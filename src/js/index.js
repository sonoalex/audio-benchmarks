// IMPORTS
const Meyda = require('meyda');
import rms from './Benchmarks/offline/suite_rms';
import loudness from './Benchmarks/offline/suite_loudness';
import spectral_rolloff from './Benchmarks/offline/suite_spec_rolloff';
import energy from './Benchmarks/offline/suite_energy';
import distribution_shape from './Benchmarks/offline/suite_distribution_shape';
import zcr from './Benchmarks/offline/suite_zcr';
import powerSpectrum from './Benchmarks/offline/suite_power_spectrum';
import spectral_flatness from './Benchmarks/offline/suite_spectral_flatness';
import spectral_centroid from './Benchmarks/offline/suite_spectral_centroid';
//import rms_realtime from './Benchmarks/realtime/suite_rms_realtime';

// DOM ELEMENTS
const RMSButton = document.getElementById('rms_offline');
const LoudnessButton = document.getElementById('loudness_offline');
const SpecRollofButton = document.getElementById('spec_rollof_offline');
const EnergyButton = document.getElementById('energy_offline');
const DistShapeButton = document.getElementById('dist_shape_offline');
const ZCRButton = document.getElementById('zcr_offline');
const PowerSpectrumButton = document.getElementById('powerSpectrum_offline');
const SpectralFlatnessButton = document.getElementById('spectral_flatness_offline');
const SpectralCentroidButton = document.getElementById('spectral_centroid_offline');

//Custom Variables
let essentia;
loadEssentia();

let audioURL = '/audio/track.wav';

/**
 * START HERE WITH ALL SUITES
 */

RMSButton.addEventListener('click', () => rms(essentia, Meyda, audioURL));
LoudnessButton.addEventListener('click', () => loudness(essentia, Meyda, audioURL));
SpecRollofButton.addEventListener('click', () => spectral_rolloff(essentia, Meyda, audioURL));
EnergyButton.addEventListener('click', () => energy(essentia, Meyda, audioURL));
DistShapeButton.addEventListener('click', () => distribution_shape(essentia, Meyda, audioURL));
ZCRButton.addEventListener('click', () => zcr(essentia, Meyda, audioURL));
PowerSpectrumButton.addEventListener('click', () => powerSpectrum(essentia, Meyda, audioURL));
SpectralFlatnessButton.addEventListener('click', () => spectral_flatness(essentia, Meyda, audioURL));
SpectralCentroidButton.addEventListener('click', () => spectral_centroid(essentia, Meyda, audioURL));

function loadEssentia() {
    EssentiaModule().then( (EssentiaWasmModule) => {
        essentia = new Essentia(EssentiaWasmModule);
    });
}
