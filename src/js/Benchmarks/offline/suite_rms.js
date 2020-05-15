import getFile from '../../utils/getFile';
import downloadJson from '../../utils/downloadJson';
import violinDistributionPlot from '../../utils/violinDistributionPlot';
import {showResultsTable} from '../../utils/showResultsTable';

export default function rms(essentia, Meyda, audioURL) {

    const audioContext = new AudioContext();
    const FRAME_SIZE = 2048;
    const HOP_SIZE = 1024;
    const RMSButton = document.querySelector('#rms #start_offline');
    const p = document.querySelector('#rms #results');
    const down_elem = document.querySelector('#rms #download_results');
    const meyda_table = document.querySelector('#rms #meyda_results #table');
    const meyda_plot = document.querySelector('#rms #meyda_results #plot');
    const ess_table = document.querySelector('#rms #essentia_results #table');
    const ess_plot = document.querySelector('#rms #essentia_results #plot');
    const stack_plot = document.querySelector('#rms #essentia_results #plot_stack');
    const repetitionsInput = document.getElementById('repetitions');
    let repetitions = repetitionsInput.value;
    
    const options = repetitions ? 
        {
            minSamples: repetitions,
            initCount: 1,
            minTime: -Infinity,
            maxTime: -Infinity,
        } 
        : {};

    getFile(audioContext, audioURL).then((audioBuffer) => {
        const suite = new Benchmark.Suite('RMS');

        // add tests
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
        }, options)
        .add('Essentia#RMS', () => {
            const frames = essentia.FrameGenerator(audioBuffer.getChannelData(0), FRAME_SIZE, HOP_SIZE);
            for (var i = 0; i < frames.size(); i++){
                essentia.RMS(frames.get(i));
            }
        },options)
        // add listeners
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
                    "execution times": this[0].stats.sample,
                    "cycle": this[0].times.cycle,
                    "elapsed": this[0].times.elapsed,
                    "period": this[0].times.period,
                    "timeStamp": this[0].times.timeStamp,
                    "count": this[0].count,
                    "cycles": this[0].cycles,
                    "hz": this[0].hz
                },
                "essentia": {
                    "mean": this[1].stats.mean,
                    "moe": this[1].stats.moe,
                    "rme": this[1].stats.rme,
                    "sem": this[1].stats.sem,
                    "deviation": this[1].stats.deviation,
                    "variance": this[1].stats.variance,
                    "execution times": this[1].stats.sample,
                    "cycle": this[1].times.cycle,
                    "elapsed": this[1].times.elapsed,
                    "period": this[1].times.period,
                    "timeStamp": this[1].times.timeStamp,
                    "count": this[1].count,
                    "cycles": this[1].cycles,
                    "hz": this[1].hz
                }
            }
            downloadJson(resultsObj, "rms.json", down_elem);
        })
        // run async
        .run({ 'async': true });       
    });  
}
