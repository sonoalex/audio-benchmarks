import getFile from '../../utils/getFile';
import downloadJson from '../../utils/downloadJson';
import violinDistributionPlot from '../../utils/violinDistributionPlot';
import showResultsTable from '../../utils/showResultsTable';

export default function rms(essentia, Meyda, audioURL) {

    const audioContext = new AudioContext();
    const FRAME_SIZE = 2048;
    const HOP_SIZE = 1024;
    const RMSButton = document.getElementById('rms_offline');
    const p = document.getElementById('results_rms');
    const meyda_table = document.querySelector('#rms #meyda_results #table');
    const meyda_plot = document.querySelector('#rms #meyda_results #plot');
    const ess_table = document.querySelector('#rms #essentia_results #table');
    const ess_plot = document.querySelector('#rms #essentia_results #plot');
    const stack_plot = document.querySelector('#rms #essentia_results #plot_stack');

    getFile(audioContext, audioURL).then((audioBuffer) => {
        const suite = new Benchmark.Suite('RMS');

        suite.add('Meyda#RMS', () => {
            for (let i = 0; i < audioBuffer.length/HOP_SIZE; i++) {
                Meyda.bufferSize = FRAME_SIZE;
                let frame = audioBuffer.getChannelData(0).slice(HOP_SIZE*i, HOP_SIZE*i + FRAME_SIZE);
                let lastFrame;
                if (frame.length !== FRAME_SIZE) {
                    lastFrame = new Float32Array(FRAME_SIZE);
                    audioBuffer.copyFromChannel(lastFrame, 0, HOP_SIZE*i);
                    frame = lastFrame;
                }
                Meyda.extract(['rms'], frame);
            }
        }).add('Essentia#RMS', () => {
            for (let frame in essentia.FrameGenerator(audioBuffer.getChannelData(0), FRAME_SIZE, HOP_SIZE)){
                essentia.RMS(essentia.arrayToVector(frame));
            }
        })
        .on('cycle', function(event) {
            console.log(String(event.target));
            console.log('New Cycle!');
        })
        .on('start', function() {
            RMSButton.classList.add('is-loading');
            RMSButton.disable = true;
        })
        .on('complete', function() {
            console.log(this);
            console.log('Fastest is ' + this.filter('fastest').map('name'));
            
            p.textContent = 'Fastest is ' + this.filter('fastest').map('name');
            RMSButton.classList.remove('is-loading');
            RMSButton.disable = false;

            showResultsTable(meyda_table, this[0].stats);
            showResultsTable(ess_table, this[1].stats);

            violinDistributionPlot(meyda_plot, {0:["meyda", this[0].stats.sample, "green"]}, "Time distribution RMS - Meyda");
            violinDistributionPlot(ess_plot, {0:["essentia.js",this[1].stats.sample, "red"]}, "Time distribution RMS - Essentia");
            violinDistributionPlot(stack_plot, {0:["meyda", this[0].stats.sample, "green"], 1:["essentia.js", this[1].stats.sample, "red"]},
                                     "Time distribution RMS - Stack");

            const resultsObj = {
                "meyda": {
                    "mean": this[0].stats.mean,
                    "moe": this[0].stats.moe,
                    "rme": this[0].stats.rme,
                    "sem": this[0].stats.sem,
                    "deviation": this[0].stats.deviation,
                    "variance": this[0].stats.variance,
                    "execution times": this[0].stats.sample
                },
                "essentia": {
                    "mean": this[1].stats.mean,
                    "moe": this[1].stats.moe,
                    "rme": this[1].stats.rme,
                    "sem": this[1].stats.sem,
                    "deviation": this[1].stats.deviation,
                    "variance": this[1].stats.variance,
                    "execution times": this[1].stats.sample
                }
            }
            downloadJson(resultsObj, "rms.json");
        })
        .run({ 'async': true });       
    });  
}