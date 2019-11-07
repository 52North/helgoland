import { readFile, writeFile } from 'fs';

const fileToD3 = 'node_modules/plotly.js/node_modules/d3/d3.js';
// temporary fix for the following issue: https://github.com/plotly/plotly.js/issues/3518
readFile(fileToD3, 'utf8', function (err, obj) {
    // find and replace fragment
    const replaced = obj.replace(/}\(\);$/, '}.apply(self);');
    writeFile(fileToD3, replaced, (error) => {
        if (error) { console.error(error); }
    });
});
