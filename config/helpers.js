const dateFormat = require('dateformat');
const packageConfig = require('./../package.json');
const path = require('path');

function getBuildDate() {
    return dateFormat(new Date(), 'yyyymmddhhMM');
}

function getVersion() {
    return packageConfig.version;
}

var ROOT = path.resolve(__dirname, '..');
var root = path.join.bind(path, ROOT);

exports.getBuildDate = getBuildDate;
exports.getVersion = getVersion;
exports.root = root;
