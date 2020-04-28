// IMPORTS
const Meyda = require('meyda');
import rms_offline from './Benchmarks/offline/suite_rms_offline';
import loudness_offline from './Benchmarks/offline/suite_loudness_offline';
import spectral_rolloff_offline from './Benchmarks/offline/suite_spec_rolloff';
//import rms_realtime from './Benchmarks/realtime/suite_rms_realtime';

// DOM ELEMENTS
const RMSOffbutton = document.getElementById('rms_offline');
const LOUDNESSOffbutton = document.getElementById('loudness_offline');
const SpecRollofButton = document.getElementById('spec_rollof_offline');

//Custom Variables
let essentia;
loadEssentia();

let audioURL = '/audio/track.wav';

/**
 * START HERE WITH ALL SUITES
 */

RMSOffbutton.addEventListener('click', () => rms_offline(essentia, Meyda, audioURL));
LOUDNESSOffbutton.addEventListener('click', () => loudness_offline(essentia, Meyda, audioURL));
SpecRollofButton.addEventListener('click', () => spectral_rolloff_offline(essentia, Meyda, audioURL));

function loadEssentia() {
    EssentiaModule().then( (EssentiaWasmModule) => {
        essentia = new Essentia(EssentiaWasmModule);
    });
}