const archiver = require('archiver');
const {
  execSync
} = require("child_process");
const {
  createWriteStream
} = require("fs");

const appname = 'helgoland';

function buildZipApplication(apptype) {
  console.log(`Build zip for application ${apptype}`);

  execSync(`npm run ng-high-memory -- build ${apptype} --prod --base-href /`);
  const out = `dist/${appname}-${apptype}.zip`;
  const output = createWriteStream(out);
  const archive = archiver('zip', {
    zlib: {
      level: 9
    }
  });

  output.on('finish', () => {
    console.log('Finished creation of zip (' + out + ') with ' + archive.pointer() + ' total bytes.');
  });

  archive.pipe(output);
  archive.directory(`dist/${apptype}/`, '/');

  console.log(`Finalizing build application ${apptype} ...`);

  archive.finalize();
}

// clean up
execSync(`rimraf dist`);

// build application as ZIP
buildZipApplication('timeseries');
buildZipApplication('complete');

// build application as WAR
execSync(`npm run bundle-war timeseries`);
execSync(`npm run bundle-war complete`);
