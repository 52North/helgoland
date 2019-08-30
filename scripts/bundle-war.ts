import { execSync } from 'child_process';
import { createWriteStream } from 'fs';

const archiver = require('archiver');

let apptype = 'timeseries';
const appname = 'helgoland';

if (process.argv.length > 2) {
    if (process.argv[2] === 'timeseries' || process.argv[2] === 'complete') {
        apptype = process.argv[2];
    }
}

console.log(`Build application ${apptype}`);
execSync(`rimraf dist && npm run ng-high-memory -- build ${apptype} --prod --base-href=/${appname}/`, { stdio: [0, 1, 2] });

// 1
const out = `dist/${appname}.war`;

// 2
const output = createWriteStream(out);
const archive = archiver('zip', {});

// 3
output.on('finish', () => console.log('war (' + out + ') ' + archive.pointer() + ' total bytes'));

// 4
archive.pipe(output);

archive.directory(`dist/${apptype}`, '/');
archive.directory('WEB-INF', '/WEB-INF');

// 6
archive.finalize();
