const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'production';

module.exports = function(options) {
    console.log('run prod config');
    return webpackMerge(commonConfig({
        env: ENV
    }), {
        devtool: 'source-map',
        output: {
            path: __dirname + './../dist',
            filename: '[name].[chunkhash].bundle.js',
            sourceMapFilename: '[name].[chunkhash].bundle.map',
            chunkFilename: '[id].[chunkhash].chunk.js'
        },
        module: {
            rules: [{
                // JS LOADER
                // Reference: https://github.com/babel/babel-loader
                // Transpile .js files using babel-loader
                // Compiles ES6 and ES7 into ES5 code
                test: /\.js$/,
                loader: 'babel-loader',
                // exclude: /node_modules/,
                exclude: /node_modules\/(?!(n52-sensorweb-client-core)\/).*/
                // options: {
                //     presets: ['es2015']
                // }
            }]
        },
        plugins: [
            new webpack.optimize.UglifyJsPlugin(),
            new CopyWebpackPlugin([{
                from: 'www/settings.json',
                to: 'settings.json'
            }, {
                from: 'www/i18n',
                to: 'i18n'
            }, {
                from: 'www/templates',
                to: 'templates'
            }])
        ]
    });
};
