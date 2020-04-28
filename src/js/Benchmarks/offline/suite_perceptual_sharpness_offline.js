import getFile from '../../utils/getFile';
let essentia;
let essentiaExtractor;

export default function perceptual_sharpness_offline(essentia, essentiaExtractor, Meyda, audioURL) {

    const audioContext = new AudioContext();
    const BUFFER_SIZE = 512;
    const BUFFER_SIZE_MEYDA = 512;

    getFile(audioContext, audioURL).then((audioBuffer) => {
        const suite = new Benchmark.Suite;

        // add tests
        suite.add('Meyda#PERCEPTUAL_SHARPNESS_OFF', () => {
            
            for (let i = 0; i < audioBuffer.length/BUFFER_SIZE_MEYDA; i++) {
                Meyda.bufferSize = BUFFER_SIZE_MEYDA;
                let bufferChunk = audioBuffer.getChannelData(0).slice(BUFFER_SIZE_MEYDA*i, BUFFER_SIZE_MEYDA*i + BUFFER_SIZE_MEYDA);
                let lastBuffer;
                
                if (bufferChunk.length !== BUFFER_SIZE_MEYDA) {
                    lastBuffer = new Float32Array(BUFFER_SIZE_MEYDA);
                    audioBuffer.copyFromChannel(lastBuffer, 0, BUFFER_SIZE_MEYDA*i);
                    bufferChunk = lastBuffer;
                }

                Meyda.extract(['perceptualSharpness'], bufferChunk);
            }
        }).add('Essentia#PERCEPTUAL_SHARPNESS_OFF', () => {
            for (let i = 0; i < audioBuffer.length/BUFFER_SIZE; i++){
                let bufferChunk = audioBuffer.getChannelData(0).slice(BUFFER_SIZE*i, BUFFER_SIZE*i + BUFFER_SIZE);
                // TODO: Make the extractor work
                essentiaExtractor.BarkExtractor(essentia.arrayToVector(bufferChunk));
            }
        })
        // add listeners
        .on('cycle', function(event) {
            console.log(String(event.target));
            console.log('New Cycle!');
        })
        .on('complete', function() {
            console.log(this);
            console.log('Fastest is ' + this.filter('fastest').map('name'));
            // TODO: Here attach to the DOM
        })
        // run async
        .run({ 'async': true });
    });
}