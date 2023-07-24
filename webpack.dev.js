const path = require("path");
const baseConfig = require('./webpack.common');

const rel = str => path.join(__dirname, str);

module.exports = {
    ...baseConfig,
    mode: "development",
    devtool: "source-map",
    devServer: {
        port: 3000,
        // can disable hot module replacement, which result in full page reload
        // hot: false
        devMiddleware: {
            publicPath: "http://localhost:3000/dist",
        },
        historyApiFallback: {
            // for single page application
            index: 'index.html'
        },
        static: [
            {
                directory: rel("public"),
                publicPath: '/',
            }
        ]
    },
};
