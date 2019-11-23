/** @format */
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const contentBase = "../src";
module.exports = {
    target: "node"
    , mode: "development"
    , context: path.resolve(__dirname, contentBase)
    , entry: "./index.server.js"
    , output: {
        path: path.resolve(__dirname, contentBase, "build")
        , publicPath: "/"
        , filename: "./bundle.server.js"
    }
    , devServer: {
        contentBase: path.resolve(__dirname, contentBase)
    }
    , module: {
        rules: [{
            test: /\.js$/
            , exclude: /node_modules/
            , use: {
                loader: "babel-loader"
                , options: {
                    presets: ["@babel/preset-env"]
                }
            }
        }]
    }
    , externals: [nodeExternals()]
};