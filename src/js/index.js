// IMPORTS
const Meyda = require('meyda');
import rms_offline from './Benchmarks/offline/suite_rms_offline';
import loudness_offline from './Benchmarks/offline/suite_loudness_offline';
import perceptual_sharpness_offline from './Benchmarks/offline/suite_perceptual_sharpness_offline';
//import rms_realtime from './Benchmarks/realtime/suite_rms_realtime';

// DOM ELEMENTS
const RMSOffbutton = document.getElementById('rms_offline');
const LOUDNESSOffbutton = document.getElementById('loudness_offline');
const PERCEPTUALSHARPNESSOffbutton = document.getElementById('perceptual_sharpness_offline');

//Custom Variables
let essentia;
let essentiaExtractor;
loadEssentia();

let audioURL = '/audio/track.wav';

/**
 * START HERE WITH ALL SUITES
 */
RMSOffbutton.addEventListener('click', () => rms_offline(essentia, Meyda, audioURL));
LOUDNESSOffbutton.addEventListener('click', () => loudness_offline(essentia, Meyda, audioURL));
PERCEPTUALSHARPNESSOffbutton.addEventListener('click', () => perceptual_sharpness_offline(essentia, essentiaExtractor, Meyda, audioURL));

function loadEssentia() {
    EssentiaModule().then( (EssentiaWasmModule) => {
        essentia = new Essentia(EssentiaWasmModule);
        essentiaExtractor = new EssentiaExtractor(EssentiaWasmModule);
        console.log(essentiaExtractor.algorithmNames);
    });
}