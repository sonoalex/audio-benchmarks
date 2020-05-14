// IMPORTS
const Meyda = require('meyda');
import energy from './Benchmarks/offline/suite_energy';
import rms from './Benchmarks/offline/suite_rms';
import zcr from './Benchmarks/offline/suite_zcr';
import amplitude_spectrum from './Benchmarks/offline/suite_amplitude_spectrum';
import loudness from './Benchmarks/offline/suite_loudness';
import spectral_rolloff from './Benchmarks/offline/suite_spec_rolloff';
import distribution_shape from './Benchmarks/offline/suite_distribution_shape';
import powerSpectrum from './Benchmarks/offline/suite_power_spectrum';
import spectral_flatness from './Benchmarks/offline/suite_spectral_flatness';
import spectral_centroid from './Benchmarks/offline/suite_spectral_centroid';
//import rms_realtime from './Benchmarks/realtime/suite_rms_realtime';

// Import CSS
import "../../src/css/styles.css";


// DOM ELEMENTS
const EnergyButton = document.querySelector('#energy #start_offline');
const RMSButton = document.querySelector('#rms #start_offline');
const ZCRButton = document.querySelector('#zcr #start_offline');
const AmplitudeSpectralButton = document.querySelector('#amplitude_spectrum #start_offline');
const LoudnessButton = document.querySelector('#loudness #start_offline');
const SpecRolloffButton = document.querySelector('#spec_rolloff #start_offline');
const DistShapeButton = document.querySelector('#dist_shape #start_offline');
const PowerSpectrumButton = document.querySelector('#power_spectrum #start_offline');
const SpectralFlatnessButton = document.querySelector('#spectral_flatness #start_offline');
const SpectralCentroidButton = document.querySelector('#spectral_centroid #start_offline');

//Custom Variables
let essentia;
loadEssentia();

let audioURL = '/audio/mozart_c_major_30sec.wav';

/**
 * START HERE WITH ALL SUITES
 */

EnergyButton.addEventListener('click', () => energy(essentia, Meyda, audioURL));
RMSButton.addEventListener('click', () => rms(essentia, Meyda, audioURL));
ZCRButton.addEventListener('click', () => zcr(essentia, Meyda, audioURL));
AmplitudeSpectralButton.addEventListener('click', () => amplitude_spectrum(essentia, Meyda, audioURL));
LoudnessButton.addEventListener('click', () => loudness(essentia, Meyda, audioURL));
SpecRolloffButton.addEventListener('click', () => spectral_rolloff(essentia, Meyda, audioURL));
DistShapeButton.addEventListener('click', () => distribution_shape(essentia, Meyda, audioURL));
PowerSpectrumButton.addEventListener('click', () => powerSpectrum(essentia, Meyda, audioURL));
SpectralFlatnessButton.addEventListener('click', () => spectral_flatness(essentia, Meyda, audioURL));
SpectralCentroidButton.addEventListener('click', () => spectral_centroid(essentia, Meyda, audioURL));

function loadEssentia() {
    EssentiaModule().then( (EssentiaWasmModule) => {
        essentia = new Essentia(EssentiaWasmModule);
    });
}
