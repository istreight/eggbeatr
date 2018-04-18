const path = require('path');

module.exports = {
    target: 'web',
    context: path.resolve(__dirname, '../'),
    entry: './app.client.js',
    output: {
        path: path.resolve(__dirname, '../build'),
        publicPath: '/',
        filename: './bundle.client.js'
    },
    devServer: {
        contentBase: path.resolve(__dirname, '../')
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
