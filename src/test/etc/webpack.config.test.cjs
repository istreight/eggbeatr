const path = require('path');
const nodeExternals = require('webpack-node-externals');

const testBase = "../";
const contentBase = '../../app/src';

module.exports = {
    target: 'node',
    mode: 'development',
    context: path.resolve(__dirname, testBase),
    entry: ['./index.test.js'],
    externals: [nodeExternals()],
    output: {
        path: path.resolve(__dirname, testBase, 'build'),
        filename: './bundle.test.js'
    },
    resolve: {
        alias: {
            '@components': path.resolve(__dirname, contentBase, 'components'),
            '@css': path.resolve(__dirname, contentBase, 'assets/css'),
            '@functions': path.resolve(__dirname, contentBase, 'assets/utils/functions'),
            '@root': path.resolve(__dirname, '../../../'),
            '@specializations': path.resolve(__dirname, contentBase, 'assets/specializations'),
            '@utils': path.resolve(__dirname, contentBase, 'assets/utils')
        },
        extensions: ['.js']
    },
    module: {
        rules: [
            {
                test: /\.m?jsx?$/,
                exclude: [/node_modules/, /defaults/],
                use: {
                    loader:  'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                'targets': { 'node': true }
                            }],
                            '@babel/preset-react'
                        ]
                    }
                }
            }
        ]
    }
};
