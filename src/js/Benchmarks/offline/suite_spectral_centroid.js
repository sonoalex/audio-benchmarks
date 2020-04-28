import getFile from '../../utils/getFile';

export default function spectralCentroid(essentia, Meyda, audioURL) {

    const audioContext = new AudioContext();
    const BUFFER_SIZE = 512;
    const BUFFER_SIZE_MEYDA = 512;

    const SpectralCentroidButton = document.getElementById('spectral_centroid_offline');
    const p = document.getElementById('results_energy');



    getFile(audioContext, audioURL).then((audioBuffer) => {
        const suite = new Benchmark.Suite('SPECTRAL_CENTROID');

        // add tests
        suite.add('Meyda#SPECTRAL_CENTROID', () => {
            
            for (let i = 0; i < audioBuffer.length/BUFFER_SIZE_MEYDA; i++) {
                Meyda.bufferSize = BUFFER_SIZE_MEYDA;
                let bufferChunk = audioBuffer.getChannelData(0).slice(BUFFER_SIZE_MEYDA*i, BUFFER_SIZE_MEYDA*i + BUFFER_SIZE_MEYDA);
                let lastBuffer;
                
                if (bufferChunk.length !== BUFFER_SIZE_MEYDA) {
                    lastBuffer = new Float32Array(BUFFER_SIZE_MEYDA);
                    audioBuffer.copyFromChannel(lastBuffer, 0, BUFFER_SIZE_MEYDA*i);
                    bufferChunk = lastBuffer;
                }

                Meyda.extract(['spectralCentroid'], bufferChunk);
            }
        }).add('Essentia#SPECTRAL_CENTROID', () => {
            for (let i = 0; i < audioBuffer.length/BUFFER_SIZE; i++){
                let bufferChunk = audioBuffer.getChannelData(0).slice(BUFFER_SIZE*i, BUFFER_SIZE*i + BUFFER_SIZE);
                essentia.SpectralCentroidTime(essentia.arrayToVector(bufferChunk));
            }
        })
        // add listeners
        .on('cycle', function(event) {
            console.log(String(event.target));
            console.log('New Cycle!');
        })
        .on('start', function() {
            console.log('starting!', loudnessBtn);
            SpectralCentroidButton.classList.add('is-loading');
            SpectralCentroidButton.disable = true;
        })
        .on('complete', function() {
            console.log(this);
            console.log('Fastest is ' + this.filter('fastest').map('name'));
            // TODO: Here attach to the DOM -> SPIKE
            p.textContent = 'Fastest is ' + this.filter('fastest').map('name');
            SpectralCentroidButton.classList.remove('is-loading');
            SpectralCentroidButton.disable = false;
        })
        // run async
        .run({ 'async': true });       
    });  
}
