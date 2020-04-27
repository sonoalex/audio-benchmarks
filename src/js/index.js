// IMPORTS
const Meyda = require('meyda');
import rms_offline from './Benchmarks/offline/suite_rms_offline';
//import rms_realtime from './Benchmarks/realtime/suite_rms_realtime';

// DOM ELEMENTS
const RMSOffbutton = document.getElementById('rms_offline');

//Custom Variables
let essentia;
loadEssentia();

/**
 * START HERE WITH ALL SUITES
 */
RMSOffbutton.addEventListener('click', () => rms_offline(essentia, Meyda))

function loadEssentia() {
    EssentiaModule().then( (EssentiaWasmModule) => {
        essentia = new Essentia(EssentiaWasmModule);
    });
}