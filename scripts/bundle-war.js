const archiver = require('archiver');
const { execSync } = require('child_process');
const fs = require('fs');
const pjson = require('../package.json');

let apptype = 'timeseries';
const appname = pjson.name;
const xmlAsText = `<web-app version="3.0" xmlns="http://java.sun.com/xml/ns/javaee"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd">
    <display-name>Helgoland client version ${pjson.version} - built at ${new Date()}</display-name>
    <welcome-file-list>
        <welcome-file>index.html</welcome-file>
    </welcome-file-list>
    <mime-mapping>
        <extension>woff</extension>
        <mime-type>application/font-woff</mime-type>
    </mime-mapping>
    <error-page>
        <error-code>404</error-code>
        <location>/index.html</location>
    </error-page>
</web-app>`;

if (process.argv.length > 2) {
  if (process.argv[2] === 'timeseries' || process.argv[2] === 'complete') {
    apptype = process.argv[2];
  }
}

console.log('Creating web.xml ...');

fs.writeFile('./web.xml', xmlAsText, (errWrite) => {
  if (errWrite) {
    console.log(errWrite);
    console.log('web.xml could not be updated.');
    return;
  } else {
    console.log(`Updated web.xml`);
    buildApplication();
  }
});

function buildApplication() {
  console.log(`Build application ${apptype}`);
  execSync(
    `rimraf dist/${apptype} && ng build ${apptype} --prod --base-href=/${appname}-${apptype}/`,
    { stdio: [0, 1, 2] }
  );

  const out = `dist/${appname}-${apptype}.war`;
  const output = fs.createWriteStream(out);
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  output.on('finish', () => {
    fs.unlinkSync('web.xml');
    console.log('Finished creation of war (' + out + ') with ' + archive.pointer() + ' total bytes.');
  });

  archive.pipe(output);
  archive.directory(`dist/${apptype}`, '/');
  archive.file('web.xml', { name: '/WEB-INF/web.xml' });

  console.log(`Finalizing build application ${apptype} ...`);

  archive.finalize();
}
