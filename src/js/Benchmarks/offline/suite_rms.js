import getFile from '../../utils/getFile';
import downloadJson from '../../utils/downloadJson';
import violinDistributionPlot from '../../utils/violinDistributionPlot';

export default function rms(essentia, Meyda, audioURL) {

    const audioContext = new AudioContext();
    const BUFFER_SIZE = 512;
    const BUFFER_SIZE_MEYDA = 512;

    const p = document.getElementById('results_rms');
    const ess_results = document.querySelector('#rms #essentia_results');
    const ess_mean = document.querySelector('#rms #essentia_results #rms_mean');
    const ess_moe = document.querySelector('#rms #essentia_results #rms_moe');
    const ess_rme = document.querySelector('#rms #essentia_results #rms_rme');
    const ess_sem = document.querySelector('#rms #essentia_results #rms_sem');
    const ess_deviation = document.querySelector('#rms #essentia_results #rms_deviation');
    const ess_variance = document.querySelector('#rms #essentia_results #rms_variance');
    const ess_plot = document.querySelector('#rms #essentia_results #rms_plot');
    const stack_plot = document.querySelector('#rms #essentia_results #rms_plot_stack');
    const meyda_results = document.querySelector('#rms #meyda_results');
    const meyda_mean = document.querySelector('#rms #meyda_results #rms_mean');
    const meyda_moe = document.querySelector('#rms #meyda_results #rms_moe');
    const meyda_rme = document.querySelector('#rms #meyda_results #rms_rme');
    const meyda_sem = document.querySelector('#rms #meyda_results #rms_sem');
    const meyda_deviation = document.querySelector('#rms #meyda_results #rms_deviation');
    const meyda_variance = document.querySelector('#rms #meyda_results #rms_variance');
    const meyda_plot = document.querySelector('#rms #meyda_results #rms_plot');
    const RMSButton = document.getElementById('rms_offline');


    getFile(audioContext, audioURL).then((audioBuffer) => {
        const suite = new Benchmark.Suite('RMS');

        // add tests
        suite.add('Meyda#RMS', () => {
            
            for (let i = 0; i < audioBuffer.length/BUFFER_SIZE_MEYDA; i++) {
                Meyda.bufferSize = BUFFER_SIZE_MEYDA;
                let bufferChunk = audioBuffer.getChannelData(0).slice(BUFFER_SIZE_MEYDA*i, BUFFER_SIZE_MEYDA*i + BUFFER_SIZE_MEYDA);
                let lastBuffer;
                
                if (bufferChunk.length !== BUFFER_SIZE_MEYDA) {
                    lastBuffer = new Float32Array(BUFFER_SIZE_MEYDA);
                    audioBuffer.copyFromChannel(lastBuffer, 0, BUFFER_SIZE_MEYDA*i);
                    bufferChunk = lastBuffer;
                }

                Meyda.extract(['rms'], bufferChunk);
            }
        }).add('Essentia#RMS', () => {        
            for (let i = 0; i < audioBuffer.length/BUFFER_SIZE; i++){
                let bufferChunk = audioBuffer.getChannelData(0).slice(BUFFER_SIZE*i, BUFFER_SIZE*i + BUFFER_SIZE);
                essentia.RMS(essentia.arrayToVector(bufferChunk));  
            }
        })
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
            // TODO: Here attach to the DOM
            
            p.textContent = 'Fastest is ' + this.filter('fastest').map('name');
            RMSButton.classList.remove('is-loading');
            RMSButton.disable = false;

            meyda_results.classList.remove('is-hidden');
            ess_results.classList.remove('is-hidden');

            meyda_mean.textContent = this[0].stats.mean;
            meyda_moe.textContent = this[0].stats.moe;
            meyda_rme.textContent = this[0].stats.rme;
            meyda_sem.textContent = this[0].stats.sem;
            meyda_deviation.textContent = this[0].stats.deviation;
            meyda_variance.textContent = this[0].stats.variance;

            ess_mean.textContent = this[1].stats.mean;
            ess_moe.textContent = this[1].stats.moe;
            ess_rme.textContent = this[1].stats.rme;
            ess_sem.textContent = this[1].stats.sem;
            ess_deviation.textContent = this[1].stats.deviation;
            ess_variance.textContent = this[1].stats.variance;

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
        // run async
        .run({ 'async': true });       
    });  
}