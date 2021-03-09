const path = require('path');
const appConfig = require('./webpack.config.app.js');
const nodeExternals = require('webpack-node-externals');

const testBase = "../test";

module.exports = {
    target: 'node',
    mode: 'development',
    context: path.resolve(__dirname, testBase),
    entry: ['./index.test.js'],
    externals: [nodeExternals()],
    output: {
        path: path.resolve(__dirname, '../build'),
        filename: './bundle.test.js'
    },
    resolve: appConfig.resolve,
    module: appConfig.module
};
