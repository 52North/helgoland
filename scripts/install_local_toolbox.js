const {
  execSync
} = require('child_process');

const modules = [
  'core',
  'auth',
  'caching',
  'control',
  'd3',
  'depiction',
  'favorite',
  'map',
  'modification',
  'permalink',
  'plotly',
  'selector',
  'time',
  'time-range-slider'
];

function buildZipApplication() {
  modules.forEach(module => {
    console.log(`Install module ${module}`);
    execSync(`npm install ../helgoland-toolbox/helgoland-${module}-* `);
  });
}

buildZipApplication('timeseries');
