const path = require('path');
const nodeExternals = require('webpack-node-externals');

const contentBase = '../src';

module.exports = {
    target: 'node',
    context: path.resolve(__dirname, contentBase),
    entry: './app.server.js',
    output: {
        path: path.resolve(__dirname, contentBase, 'build'),
        publicPath: '/',
        filename: './bundle.server.js'
    },
    devServer: {
        contentBase: path.resolve(__dirname, contentBase)
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader:  'babel-loader',
                    options: {
                        presets: ['env']
                    }
                },
            }
        ]
    },
    externals: [nodeExternals()]
};
