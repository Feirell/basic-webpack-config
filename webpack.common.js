const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const rel = str => path.join(__dirname, str);

// if the babel rc can not not be found or loaded do it manually:
// const babelConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../.babelrc')));

module.exports = {
    name: "base",
    entry: ["./src/index.tsx"],
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
                test: /\.m?[jt]sx?$/i,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
                // if there are issues loading the babelrc use this:
                // use: {
                //     loader: "babel-loader",
                //     options: {
                //         ...babelConfig
                //     }
                // }
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader",
                ],
            },
        ]
    },
    resolve: {extensions: ["*", ".js", ".jsx", ".ts", ".tsx"]},
    plugins: [new MiniCssExtractPlugin({filename: 'main-bundle.css'})],
    output: {
        path: rel("public/dist"),
        publicPath: "dist",
        filename: "[name]-bundle.js"
    }
};
