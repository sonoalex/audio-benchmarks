import getFile from '../utils/getFile';

export default function test_rms() {
    const RMSbutton = document.getElementById('rms');
    console.log(RMSbutton);
    RMSbutton.addEventListener('click', () => {
        const audioContext = new AudioContext();
        getFile(audioContext,'/audio/track.wav').then((audioBuffer) => {
            console.log(audioBuffer);
            var suite = new Benchmark.Suite;

            // add tests
            suite.add('Meyda#test', function() {
                console.log(Meyda);
                Meyda.bufferSize = 512;
                const features = Meyda.extract(['rms'], audioBuffer.getChannelData(0).slice(0, 512));
                console.log('features: ', features)
                
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