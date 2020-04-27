require('meyda');
import rms_offline from './Benchmarks/offline/suite_rms_offline';
import rms_realtime from './Benchmarks/realtime/suite_rms_realtime';

rms_offline();
rms_realtime();

