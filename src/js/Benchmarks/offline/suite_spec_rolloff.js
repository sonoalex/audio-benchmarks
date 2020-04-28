import getFile from '../../utils/getFile';

export default function spectral_rolloff(essentia, Meyda, audioURL) {

    const audioContext = new AudioContext();
    const BUFFER_SIZE = 512;
    const BUFFER_SIZE_MEYDA = 512;

    const p = document.getElementById('results_spec_rolloff');
    const SpecRollofButton = document.getElementById('spec_rollof_offline');

    getFile(audioContext, audioURL).then((audioBuffer) => {
        const suite = new Benchmark.Suite('SPECTRAL_ROLLOFF');

        // add tests
        suite.add('Meyda#SPEC_ROLLOFF', () => {
            
            for (let i = 0; i < audioBuffer.length/BUFFER_SIZE_MEYDA; i++) {
                Meyda.bufferSize = BUFFER_SIZE_MEYDA;
                let bufferChunk = audioBuffer.getChannelData(0).slice(BUFFER_SIZE_MEYDA*i, BUFFER_SIZE_MEYDA*i + BUFFER_SIZE_MEYDA);
                let lastBuffer;
                
                if (bufferChunk.length !== BUFFER_SIZE_MEYDA) {
                    lastBuffer = new Float32Array(BUFFER_SIZE_MEYDA);
                    audioBuffer.copyFromChannel(lastBuffer, 0, BUFFER_SIZE_MEYDA*i);
                    bufferChunk = lastBuffer;
                }

                Meyda.extract(['spectralRolloff'], bufferChunk);
            }
        }).add('Essentia#SPEC_ROLLOFF', () => {        
            for (let i = 0; i < audioBuffer.length/BUFFER_SIZE; i++){
                let bufferChunk = audioBuffer.getChannelData(0).slice(BUFFER_SIZE*i, BUFFER_SIZE*i + BUFFER_SIZE);
                essentia.RollOff(essentia.arrayToVector(bufferChunk));  
            }
        })
        // add listeners
        .on('cycle', function(event) {
            console.log(String(event.target));
            console.log('New Cycle!');
        })
        .on('start', function() {
            SpecRollofButton.classList.add('is-loading');
            SpecRollofButton.disable = true;
        })
        .on('complete', function() {
            console.log(this);
            console.log('Fastest is ' + this.filter('fastest').map('name'));
            // TODO: Here attach to the DOM -> SPIKE
            p.textContent = 'Fastest is ' + this.filter('fastest').map('name');
            SpecRollofButton.classList.remove('is-loading');
            SpecRollofButton.disable = false;
        })
        // run async
        .run({ 'async': true });       
    });  
}
