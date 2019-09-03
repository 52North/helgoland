import { execSync } from 'child_process';
import { createWriteStream } from 'fs';

const archiver = require('archiver');
const fs = require('fs');
const parser = require('xml2json');
const pjson = require('./package.json');

let apptype = 'timeseries';
const appname = pjson.name;
const defaultXMLasJSON = {
    'web-app': {
        'version': '3.0',
        'xmlns': 'http://java.sun.com/xml/ns/javaee',
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xsi:schemaLocation': 'http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd',
        'display-name': { '$t': 'Helgoland' },
        'description': { '$t': 'Helgoland client version ' + pjson.version + ' - built at ' + new Date() },
        'welcome-file-list': { 'welcome-file': 'index.html' },
        'mime-mapping': { 'extension': 'woff', 'mime-type': 'application/font-woff' },
        'error-page': { 'error-code': 404, location: '/index.html' }
    }
};

if (process.argv.length > 2) {
    if (process.argv[2] === 'timeseries' || process.argv[2] === 'complete') {
        apptype = process.argv[2];
    }
}

console.log('Check if web.xml exists ...');

fs.access('./web.xml', (errAccess: Error) => {
    if (!errAccess) {
        fs.readFile('./web.xml', (errorRead: Error, data: any) => {
            let json = defaultXMLasJSON;
            if (!errorRead) {
                json = JSON.parse(parser.toJson(data, { reversible: true }));
            }
            json['web-app']['description'] = {
                '$t': 'Helgoland client version ' + pjson.version + ' - built at ' + new Date()
            };
            writeFile(json, 'Updated');
        });
    } else {
        writeFile(defaultXMLasJSON, 'Created');
    }
});

function writeFile(xmlAsJson: any, update: String) {
    const stringified = JSON.stringify(xmlAsJson);
    const xml = parser.toXml(stringified);
    fs.writeFile('./web.xml', xml, (errWrite: Error) => {
        if (errWrite) {
            console.log(errWrite);
            console.log('web.xml could not be updated.');
        } else {
            console.log(`${update} web.xml`);

            buildApplication();
        }
    });
}

function buildApplication() {
    console.log(`Build application ${apptype} ...`);
    execSync(`rimraf dist && ng build ${apptype} --prod --base-href=/${appname}/`, { stdio: [0, 1, 2] });

    const out = `dist/${appname}.war`;
    const output = createWriteStream(out);
    const archive = archiver('zip', {});

    output.on('finish', () => console.log('Finished creation of war (' + out + ') with ' + archive.pointer() + ' total bytes.'));

    archive.pipe(output);
    archive.directory(`dist/${apptype}`, '/');
    archive.file('web.xml', { name: '/WEB-INF/web.xml' });

    console.log(`Finalizing build application ${apptype} ...`);

    archive.finalize();
}
