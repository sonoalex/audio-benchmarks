let Meyda = require('Meyda');
let essentia = require('essentia.js');
let fs = require('fs');
let path = require('path');
let Benchmark = require('benchmark');

const BUFFER_SIZE = 512;
const BUFFER_SIZE_MEYDA = 512;
const audioFilePath = path.join(__dirname, '..', '..','audio', 'track.wav');

fs.readFile(audioFilePath, (err, data) => {
    if (err) throw err;
    let audioBuffer = data;
    const suite = new Benchmark.Suite('DistributionShape');

    // add tests
    suite.add('Meyda#DistributionShape', () => {
        
        for (let i = 0; i < audioBuffer.length/BUFFER_SIZE_MEYDA; i++) {
            Meyda.bufferSize = BUFFER_SIZE_MEYDA;
            let bufferChunk = audioBuffer.slice(BUFFER_SIZE_MEYDA*i, BUFFER_SIZE_MEYDA*i + BUFFER_SIZE_MEYDA);
            
            if (bufferChunk.length !== BUFFER_SIZE_MEYDA) {
                bufferChunk = Buffer.concat([bufferChunk], BUFFER_SIZE_MEYDA);
            }

            Meyda.extract(['spectralSpread', 'spectralSkewness', 'spectralKurtosis'], bufferChunk);
        }
    }).add('Essentia#DistributionShape', () => {        
        for (let i = 0; i < audioBuffer.length/BUFFER_SIZE; i++){
            let bufferChunk = audioBuffer.slice(BUFFER_SIZE*i, BUFFER_SIZE*i + BUFFER_SIZE);
            let centralMoments = essentia.CentralMoments(essentia.arrayToVector(bufferChunk));
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
    })
    // run async
    .run({ 'async': true });       
  });