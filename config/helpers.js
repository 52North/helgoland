const dateFormat = require('dateformat');
const package = require('./../package.json');

function getBuildDate() {
    return dateFormat(new Date(), 'yyyymmddhhMM');
}

function getVersion() {
    return package.version;
}

exports.getBuildDate = getBuildDate;
exports.getVersion = getVersion;
