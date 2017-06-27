require('style-loader');
require('raw-loader');
require('less-loader');
require('css-loader');
require('file-loader');
require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const helpers = require('./helpers');

const clientTitle = 'Helgoland';

module.exports = function(options) {

    return {
        entry: './www/app.js',
        externals: {
            jQuery: 'jquery'
        },
        module: {
            rules: [{
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules\/(?!(n52-sensorweb-client-core)\/).*/,
                options: {
                    presets: [require.resolve('babel-preset-es2015')]
                }
            }, {
                // CSS LOADER
                // Reference: https://github.com/webpack/css-loader
                // Allow loading css through js
                //
                // Reference: https://github.com/postcss/postcss-loader
                // Postprocess your css with PostCSS plugins
                test: /\.css$/,
                // Reference: https://github.com/webpack/extract-text-webpack-plugin
                // Extract css files in production builds
                //
                // Reference: https://github.com/webpack/style-loader
                // Use style-loader in development.
                loader: 'style-loader!css-loader'
            }, {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "less-loader" // compiles Less to CSS
                }]
            }, {
                // ASSET LOADER
                // Reference: https://github.com/webpack/file-loader
                // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
                // Rename the file using the asset hash
                // Pass along the updated reference to your code
                // You can add here any file extension you want to get copied to your output
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
                loader: 'file-loader'
            }, {
                // HTML LOADER
                // Reference: https://github.com/webpack/raw-loader
                // Allow loading html through js
                test: /\.html$/,
                loader: 'raw-loader',
                exclude: [helpers.root('./www/index.html')]
            }]
        },
        plugins: [
            new webpack.ProvidePlugin({
                jQuery: 'jquery',
                $: 'jquery',
                jquery: 'jquery',
                'window.jQuery': 'jquery'
            }),
            new HtmlWebpackPlugin({
                template: './www/index.html',
                title: clientTitle,
                lastBuildTime: options.buildTime
            })
        ]
    };
};
