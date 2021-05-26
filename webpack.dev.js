const path = require("path");
const baseConfig = require('./webpack.common');

const rel = str => path.join(__dirname, str);

module.exports = {
    ...baseConfig,
    mode: "development",
    devtool: "source-map",
    devServer: {
        contentBase: [rel("public"), rel("other-dir")],
        contentBasePublicPath: ['/', '/other'],
        port: 3000,
        publicPath: "http://localhost:3000/dist",
        // Only enable this if you think that you can make hot module replacement working.
        // I had no such case, so I just use a full page reload.
        // hot: true
    },
};
