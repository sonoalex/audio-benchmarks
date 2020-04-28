import getFile from '../../utils/getFile';

export default function distribution_shape(essentia, Meyda, audioURL) {

    const audioContext = new AudioContext();
    const BUFFER_SIZE = 512;
    const BUFFER_SIZE_MEYDA = 512;

    getFile(audioContext, audioURL).then((audioBuffer) => {
        const suite = new Benchmark.Suite('DIST_SHAPE');

        // add tests
        suite.add('Meyda#DIST_SHAPE', () => {
            
            for (let i = 0; i < audioBuffer.length/BUFFER_SIZE_MEYDA; i++) {
                Meyda.bufferSize = BUFFER_SIZE_MEYDA;
                let bufferChunk = audioBuffer.getChannelData(0).slice(BUFFER_SIZE_MEYDA*i, BUFFER_SIZE_MEYDA*i + BUFFER_SIZE_MEYDA);
                let lastBuffer;
                
                if (bufferChunk.length !== BUFFER_SIZE_MEYDA) {
                    lastBuffer = new Float32Array(BUFFER_SIZE_MEYDA);
                    audioBuffer.copyFromChannel(lastBuffer, 0, BUFFER_SIZE_MEYDA*i);
                    bufferChunk = lastBuffer;
                }

                Meyda.extract(['spectralSpread', 'spectralSkewness', 'spectralKurtosis'], bufferChunk);
            }
        }).add('Essentia#DIST_SHAPE', () => {        
            for (let i = 0; i < audioBuffer.length/BUFFER_SIZE; i++){
                let bufferChunk = audioBuffer.getChannelData(0).slice(BUFFER_SIZE*i, BUFFER_SIZE*i + BUFFER_SIZE);
                var centralMoments = essentia.CentralMoments(essentia.arrayToVector(bufferChunk));
                essentia.DistributionShape(centralMoments.centralMoments);
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
            // TODO: Here attach to the DOM -> SPIKE
            let p = document.getElementById('results_spec_rolloff');
            p.textContent = 'Fastest is ' + this.filter('fastest').map('name');
        })
        // run async
        .run({ 'async': true });       
    });  
}
