var path = require('path');
var fs = require("fs");
var webpack = require('webpack');
module.exports = {
    entry: {
        "xhrfilter": "./src/xhrfilter.js"
    },
    output: {
        path: "./dist",
        filename: "[name].min.js"
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true
            },
            minimize: true
        })
    ]
}
