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
        path: path.resolve(__dirname, testBase, 'dist'),
        filename: './bundle.test.js'
    },
    resolve: appConfig.resolve,
    module: {
        rules: [{
            test: /Spec\.js$/,
            use: {
                loader:  'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                }
            }
        }]
    }
};
