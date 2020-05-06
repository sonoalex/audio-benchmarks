import getFile from '../../utils/getFile';

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
            essentia_results.classList.remove('is-hidden');

            meyda_mean.textContent = this[0].stats.mean;
            meyda_moe.textContent = this[0].stats.moe;
            meyda_rme.textContent = this[0].stats.rme;
            meyda_sem.textContent = this[0].stats.sem;
            meyda_deviation.textContent = this[0].stats.deviation;
            meyda_variance.textContent = this[0].stats.variance;
            var meyda_trace = {
                x: this[0].stats.sample,
                type: 'histogram',
                name: 'meyda'
              };
            var meyda_data = [meyda_trace];
            var xaxis={title:'time'};
            var yaxis={title:'executions'};
            var meyda_layout = {title:"Distribution meyda RMS", xaxis, yaxis};
            Plotly.newPlot(meyda_plot, meyda_data, meyda_layout);

            ess_mean.textContent = this[1].stats.mean;
            ess_moe.textContent = this[1].stats.moe;
            ess_rme.textContent = this[1].stats.rme;
            ess_sem.textContent = this[1].stats.sem;
            ess_deviation.textContent = this[1].stats.deviation;
            ess_variance.textContent = this[1].stats.variance;
            var ess_trace = {
                x: this[1].stats.sample,
                type: 'histogram',
                name: 'essentia.js'
              };
            var ess_layout = {title:"Distribution essentia.js RMS", xaxis, yaxis};
            var ess_data = [ess_trace];
            Plotly.newPlot(ess_plot, ess_data, ess_layout);


            // stack_plot
            var stack_data = [ess_trace, meyda_trace];

            var stack_layout = {title:"Distribution stacked RMS", xaxis, yaxis, barmode: "stack"};
            Plotly.newPlot(stack_plot, stack_data, stack_layout);
        })
        // run async
        .run({ 'async': true });       
    });  
}