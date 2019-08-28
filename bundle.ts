const fs = require('fs');
const archiver = require('archiver');

// 1
const out = 'dist/application.war';

// 2
const output = fs.createWriteStream(out);
const archive = archiver('zip', {});

// 3
output.on('finish', () => {
    console.log('war (' + out + ') ' + archive.pointer() + ' total bytes');
});

// 4
archive.pipe(output);

archive.directory('dist/complete', '/');
archive.directory('WEB-INF', '/WEB-INF');

// 6
archive.finalize();
