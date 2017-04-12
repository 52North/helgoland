const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DeployToWar = require('webpack-deploy2war');
const helpers = require('./helpers');

const ENV = process.env.ENV = process.env.NODE_ENV = 'production';

module.exports = function(options) {
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
            }]),
            new DeployToWar({
                fileName: 'build/client##' + helpers.getVersion() + '-' + helpers.getBuildDate() + '.war'
            })
        ]
    });
};
