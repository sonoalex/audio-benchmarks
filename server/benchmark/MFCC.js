let Meyda = require('meyda');
let essentia = require('essentia.js');
let fs = require('fs');
let path = require('path');
let Benchmark = require('benchmark');

const FRAME_SIZE = 2048;
const HOP_SIZE = 1024;
const audioFilePath = path.join(__dirname, '..', '..','audio', 'mozart_c_major_30sec.wav');
var options = {};
if (process.argv[2] !== undefined){
    options = {
            minSamples: process.argv[2],
            initCount: 1,
            minTime: -Infinity,
            maxTime: -Infinity,
            };
}

fs.readFile(audioFilePath, (err, data) => {
    if (err) throw err;
    let audioBuffer = data;
    const suite = new Benchmark.Suite('MFCC');

    // add tests
    suite.add('Meyda#MFCC', () => {
        for (let i = 0; i < audioBuffer.length/HOP_SIZE; i++) {
            Meyda.bufferSize = FRAME_SIZE;
            let frame = audioBuffer.slice(HOP_SIZE*i, HOP_SIZE*i + FRAME_SIZE);
            if (frame.length !== FRAME_SIZE) {
                frame = Buffer.concat([frame], FRAME_SIZE);
            }
            Meyda.extract(['mfcc'], frame);
        }
    }, options)
    .add('Essentia#MFCC', () => {        
        const frames = essentia.FrameGenerator(audioBuffer, FRAME_SIZE, HOP_SIZE);
        for (var i = 0; i < frames.size(); i++){
            var frame_windowed = essentia.Windowing(frames.get(i),true, FRAME_SIZE);
            essentia.MFCC(essentia.Spectrum(frame_windowed['frame'])['spectrum']);
        }

    }, options)
    // add listeners
    .on('cycle', function(event) {
        console.log(String(event.target));
    })
    
    .on('complete', function() {
        // console.log(this);
        console.log('Fastest is ' + this.filter('fastest').map('name'));

        const resultsObj = {
            "meyda": {
                "mean": this[0].stats.mean,
                "moe": this[0].stats.moe,
                "rme": this[0].stats.rme,
                "sem": this[0].stats.sem,
                "deviation": this[0].stats.deviation,
                "variance": this[0].stats.variance,
                "execution times": this[0].stats.sample
            },
            "essentia": {
                "mean": this[1].stats.mean,
                "moe": this[1].stats.moe,
                "rme": this[1].stats.rme,
                "sem": this[1].stats.sem,
                "deviation": this[1].stats.deviation,
                "variance": this[1].stats.variance,
                "execution times": this[1].stats.sample
            }
        }

        var json = JSON.stringify(resultsObj);
        fs.writeFile('mfcc.json', json, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing MFCC JSON Object to File.");
                return console.log(err);
            }

            console.log("MFCC JSON file has been saved.");
        });
    })
    // run async
    .run({ 'async': true });       
  });