const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const DeployToWar = require('webpack-deploy2war');
const helpers = require('./helpers');

const ENV = process.env.ENV = process.env.NODE_ENV = 'production';

const buildTime = helpers.getBuildDate();

module.exports = function() {
    return webpackMerge(commonConfig({
        env: ENV,
        buildTime: buildTime
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
                fileName: 'build/client##' + helpers.getVersion() + '-' + buildTime + '.war'
            }),
            new BundleAnalyzerPlugin({
                analyzerMode: 'server',
                analyzerHost: '127.0.0.1',
                analyzerPort: 9999,
                openAnalyzer: false
            })
        ]
    });
};
