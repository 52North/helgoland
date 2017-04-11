const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8000;

module.exports = function(options) {
    return webpackMerge(commonConfig({
        env: ENV
    }), {
        // devtool: 'eval-source-map',
        module: {
            rules: [{
                test: /\.js$/,
                loader: 'eslint-loader',
                exclude: /node_modules\/(?!(n52-sensorweb-client-core)\/).*/,
            }]
        },
        plugins: [
            new ExtractTextPlugin({
                filename: 'css/[name].css',
                disable: !isProd,
                allChunks: true
            })
        ],
        devServer: {
            port: PORT,
            host: HOST,
            contentBase: './www',
            stats: 'minimal'
        }
    });
};
