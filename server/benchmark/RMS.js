let Meyda = require('meyda');
let essentia = require('essentia.js');
let fs = require('fs');
let path = require('path');
let Benchmark = require('benchmark');

const FRAME_SIZE = 2048;
const HOP_SIZE = 1024;
const audioFilePath = path.join(__dirname, '..', '..','audio', 'track.wav');

fs.readFile(audioFilePath, (err, data) => {
    if (err) throw err;
    let audioBuffer = data;
    const suite = new Benchmark.Suite('RMS');

    // add tests
    suite.add('Meyda#RMS', () => {
        for (let i = 0; i < audioBuffer.length/HOP_SIZE; i++) {
            Meyda.bufferSize = FRAME_SIZE;
            let frame = audioBuffer.slice(HOP_SIZE*i, HOP_SIZE*i + FRAME_SIZE);
            
            if (frame.length !== FRAME_SIZE) {
                frame = Buffer.concat([frame], FRAME_SIZE);
            }
            Meyda.extract(['rms'], frame);
        }
    }).add('Essentia#RMS', () => {
        for (let frame in essentia.FrameGenerator(audioBuffer, FRAME_SIZE, HOP_SIZE)){
            essentia.RMS(essentia.arrayToVector(frame));
        }
    })
    // add listeners
    .on('cycle', function(event) {
        console.log(String(event.target));
    })
    
    .on('complete', function() {
        //console.log(this);
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    // run async
    .run({ 'async': true });       
});