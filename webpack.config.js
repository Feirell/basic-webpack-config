const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const {HotModuleReplacementPlugin} = require("webpack");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const rel = str => path.join(__dirname, str);

module.exports = {
    name: "base",
    entry: ["./src/index.js", "./src/other.scss"],
    mode: "development",
    devtool: "source-map",
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 20000,
            minRemainingSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                    name: 'vendor'
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.(js|mjs|ts|jsx|tsx)$/i,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    // "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    // Creates `style` nodes from JS strings
                    // "style-loader",
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
        ]
    },
    resolve: {extensions: ["*", ".js", ".jsx", ".ts", ".tsx"]},
    output: {
        path: rel("public/dist"),
        publicPath: "dist",
        filename: "[name]-bundle.js"
    },
    devServer: {
        contentBase: [rel("public"), rel("other-dir")],
        contentBasePublicPath: ['/', '/other'],
        port: 3000,
        publicPath: "http://localhost:3000/dist",
        // Only enable this if you think that you can make hot module replacement working.
        // I had no such case, so I just use a full page reload.
        // hot: true
    },
    plugins: [new MiniCssExtractPlugin()]
    // plugins: [new webpack.HotModuleReplacementPlugin()]
};
