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
    const suite = new Benchmark.Suite('BEATS_DEGARA');

    // add tests
    suite.add('Essentia#BEATS_DEGARA', () => {
        essentia.RhythmExtractor2013(essentia.arrayToVector(audioBuffer), 208, 'beats_degara');
    }, options)
    // add listeners
    .on('cycle', function(event) {
        console.log(String(event.target));
    })
    
    .on('complete', function() {
        console.log(this);
        // console.log('Fastest is ' + this.filter('fastest').map('name'));

        const resultsObj = {
            "essentia": {
                "mean": this[0].stats.mean,
                "moe": this[0].stats.moe,
                "rme": this[0].stats.rme,
                "sem": this[0].stats.sem,
                "deviation": this[0].stats.deviation,
                "variance": this[0].stats.variance,
                "execution times": this[0].stats.sample,
                "cycle": this[0].times.cycle,
                "elapsed": this[0].times.elapsed,
                "period": this[0].times.period,
                "timeStamp": this[0].times.timeStamp,
                "count": this[0].count,
                "cycles": this[0].cycles,
                "hz": this[0].hz
            }
        }
        var json = JSON.stringify(resultsObj);
        fs.writeFile('beats_degara.json', json, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing Beats Degara Extractor JSON Object to File.");
                return console.log(err);
            }

            console.log("Beats Degara Extractor JSON file has been saved.");
        });
    })
    // run async
    .run({ 'async': true });       
  });