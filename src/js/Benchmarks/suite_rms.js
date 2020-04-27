import getFile from '../utils/getFile';
let essentia;
export default function test_rms() {
    const RMSbutton = document.getElementById('rms');
    console.log(RMSbutton);
    EssentiaModule().then( (EssentiaWasmModule) => {
        essentia = new Essentia(EssentiaWasmModule);
        // prints version of the essentia wasm backend
        //console.log(essentia.version)
        // prints all the available algorithms in essentia.js
        //console.log(essentia.algorithmNames);
    });

    RMSbutton.addEventListener('click', () => {
        const audioContext = new AudioContext();
        const BUFFER_SIZE = 512;
        const BUFFER_SIZE_MEYDA = 512;

        getFile(audioContext,'/audio/track.wav').then((audioBuffer) => {
            console.log(audioBuffer);
            var suite = new Benchmark.Suite;

            // add tests
            suite.add('Meyda#RMS', () => {
                console.log(Meyda);
                for (let i = 0; i < audioBuffer.length/BUFFER_SIZE_MEYDA; i++) {
                    Meyda.bufferSize = BUFFER_SIZE_MEYDA;
                    var bufferChunk = audioBuffer.getChannelData(0).slice(BUFFER_SIZE_MEYDA*i, BUFFER_SIZE_MEYDA*i + BUFFER_SIZE_MEYDA);
                    const features = Meyda.extract(['rms'], bufferChunk);
                    console.log(features)
                    
                }
            }).add('Essentia#RMS', () => {        
                for (var i = 0; i < audioBuffer.length/BUFFER_SIZE; i++){
                    var buffer = audioBuffer.getChannelData(0).slice(BUFFER_SIZE*i, BUFFER_SIZE*i + BUFFER_SIZE);
                    var essRMS = essentia.RMS(essentia.arrayToVector(buffer));
                    
                }
            })
            // add listeners
            .on('cycle', function(event) {
                console.log(String(event.target));
                console.log('New Cycle!');
            })
            .on('complete', function() {
                console.log('Fastest is ' + this.filter('fastest').map('name'));
                // TODO: Here attach to the DOM
            })
            // run async
            .run({ 'async': true });
                    
        });  
    })  
}