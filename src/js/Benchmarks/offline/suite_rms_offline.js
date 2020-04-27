import getFile from '../../utils/getFile';
let essentia;

export default function rms_offline(essentia, Meyda) {

    const audioContext = new AudioContext();
    const BUFFER_SIZE = 512;
    const BUFFER_SIZE_MEYDA = 512;

    getFile(audioContext,'/audio/track.wav').then((audioBuffer) => {
        const suite = new Benchmark.Suite;

        // add tests
        suite.add('Meyda#RMS_OFF', () => {
            
            for (let i = 0; i < audioBuffer.length/BUFFER_SIZE_MEYDA; i++) {
                Meyda.bufferSize = BUFFER_SIZE_MEYDA;
                let bufferChunk = audioBuffer.getChannelData(0).slice(BUFFER_SIZE_MEYDA*i, BUFFER_SIZE_MEYDA*i + BUFFER_SIZE_MEYDA);
                let anotherArray;
                
                if (bufferChunk.length !== BUFFER_SIZE_MEYDA) {
                    anotherArray = new Float32Array(BUFFER_SIZE_MEYDA);
                    audioBuffer.copyFromChannel(anotherArray, 0, BUFFER_SIZE_MEYDA*i);
                    bufferChunk = anotherArray;
                }

                Meyda.extract(['rms'], bufferChunk);   
            }
        }).add('Essentia#RMS_OFF', () => {        
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
        .on('complete', function() {
            console.log(this);
            console.log('Fastest is ' + this.filter('fastest').map('name'));
            // TODO: Here attach to the DOM
        })
        // run async
        .run({ 'async': true });       
    });  
}