const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {commonPlugins, commonRules} = require("./webpack_common.config");
module.exports = {
    entry: ['@babel/polyfill', './src/main.ts'],
    output: {
        path: path.resolve(__dirname, '../', "dist"),
        filename: "bundle.[chunkhash:8].js",
        publicPath: '/',
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue'],
        alias: {
            '@/components': path.resolve(__dirname, "src/components"),
            '@/views': path.resolve(__dirname, "src/views"),
            '@/assets': path.resolve(__dirname, "src/assets"),
            '@/style': path.resolve(__dirname, "src/style"),
            '@/service': path.resolve(__dirname, "src/service"),
            '@/router': path.resolve(__dirname, "src/router"),
            '@/store': path.resolve(__dirname, "src/store"),
        }
    },
    plugins: [
        new webpack.EvalSourceMapDevToolPlugin({}),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: "./public/index.html"
        }),
        ...commonPlugins

    ],
    devServer: {
        contentBase: path.join(__dirname, './dist'),
        open: true,
        port: 9005,
    },
    // devtool: 'eval-source-map',
    devtool: false,
    module: {
        rules: [
            ...commonRules
        ]
    }
}
