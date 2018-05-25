const path = require('path');

const contentBase = '../src';


module.exports = {
    target: 'web',
    mode: 'development',
    context: path.resolve(__dirname, contentBase),
    entry: './app.client.js',
    output: {
        path: path.resolve(__dirname, contentBase, 'build'),
        publicPath: '/',
        filename: './bundle.client.js'
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
                        presets: ['env', 'react']
                    }
                },
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ]
            }
        ]
    }
};
