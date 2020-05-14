// IMPORTS
const Meyda = require('meyda');
import energy from './Benchmarks/offline/suite_energy';
import rms from './Benchmarks/offline/suite_rms';
import zcr from './Benchmarks/offline/suite_zcr';
import amplitude_spectrum from './Benchmarks/offline/suite_amplitude_spectrum';
import power_spectrum from './Benchmarks/offline/suite_power_spectrum';
import spectral_centroid from './Benchmarks/offline/suite_spectral_centroid';
import spectral_flatness from './Benchmarks/offline/suite_spectral_flatness';
import spectral_flux from './Benchmarks/offline/suite_spectral_flux';
import spectral_rolloff from './Benchmarks/offline/suite_spec_rolloff';
import distribution_shape from './Benchmarks/offline/suite_distribution_shape';
import mfcc from './Benchmarks/offline/suite_mfcc';
import mel_bands from './Benchmarks/offline/suite_mel_bands';
import loudness from './Benchmarks/offline/suite_loudness';
import perceptual_spread from './Benchmarks/offline/suite_perceptual_spread';
import all_time_freq from './Benchmarks/offline/suite_all_time_domain_and_spectral_features';

// Import CSS
import "../../src/css/styles.css";


// DOM ELEMENTS
const EnergyButton = document.querySelector('#energy #start_offline');
const RMSButton = document.querySelector('#rms #start_offline');
const ZCRButton = document.querySelector('#zcr #start_offline');
const AmplitudeSpectralButton = document.querySelector('#amplitude_spectrum #start_offline');
const PowerSpectrumButton = document.querySelector('#power_spectrum #start_offline');
const SpectralCentroidButton = document.querySelector('#spectral_centroid #start_offline');
const SpectralFlatnessButton = document.querySelector('#spectral_flatness #start_offline');
const SpectralFluxButton = document.querySelector('#spectral_flux #start_offline');
const SpecRolloffButton = document.querySelector('#spec_rolloff #start_offline');
const DistShapeButton = document.querySelector('#dist_shape #start_offline');
const MFCCButton = document.querySelector('#mfcc #start_offline');
const MelBandsButton = document.querySelector('#mel_bands #start_offline');
const LoudnessButton = document.querySelector('#loudness #start_offline');
const PerceptualSpreadButton = document.querySelector('#perceptual_spread #start_offline');
const AllTimeFreqButton = document.querySelector('#all_time_freq #start_offline');

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
PowerSpectrumButton.addEventListener('click', () => power_spectrum(essentia, Meyda, audioURL));
SpectralCentroidButton.addEventListener('click', () => spectral_centroid(essentia, Meyda, audioURL));
SpectralFlatnessButton.addEventListener('click', () => spectral_flatness(essentia, Meyda, audioURL));
SpectralFluxButton.addEventListener('click', () =>  spectral_flux(essentia, Meyda, audioURL));
SpecRolloffButton.addEventListener('click', () => spectral_rolloff(essentia, Meyda, audioURL));
DistShapeButton.addEventListener('click', () => distribution_shape(essentia, Meyda, audioURL));
MFCCButton.addEventListener('click', () => mfcc(essentia, Meyda, audioURL));
MelBandsButton.addEventListener('click', () => mel_bands(essentia, Meyda, audioURL));
LoudnessButton.addEventListener('click', () => loudness(essentia, Meyda, audioURL));
PerceptualSpreadButton.addEventListener('click', () => perceptual_spread(essentia, Meyda, audioURL));
AllTimeFreqButton.addEventListener('click', () => all_time_freq(essentia, Meyda, audioURL));

function loadEssentia() {
    EssentiaModule().then( (EssentiaWasmModule) => {
        essentia = new Essentia(EssentiaWasmModule);
    });
}
