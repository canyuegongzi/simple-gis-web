const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { commonPlugins, commonRules } = require('./webpack_common.config');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';
module.exports = {
    entry: ['@babel/polyfill', './src/main.ts'],
    output: {
        // path: path.resolve(__dirname, '../', "dist"),
        filename: 'bundle.[chunkhash:8].js',
        publicPath: '/',
        sourcePrefix: '',
    },
    target: 'web',
    resolve: {
        extensions: ['.ts', '.js', '.vue'],
        alias: {
            '@': path.resolve(__dirname, "src"),
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
            template: './public/index.html',
        }),
        ...commonPlugins,
        new CopyWebpackPlugin({
            patterns: [
                { from: 'node_modules/cesium/Build/Cesium/Workers', to: 'Workers' },
                { from: 'node_modules/cesium/Build/Cesium/ThirdParty', to: 'ThirdParty' },
                { from: 'node_modules/cesium/Build/Cesium/Assets', to: 'Assets' },
                { from: 'node_modules/cesium/Build/Cesium/Widgets', to: 'Widgets' },
            ],
        }),
        new webpack.DefinePlugin({
            // Define relative base path in cesium for loading assets
            CESIUM_BASE_URL: JSON.stringify(''),
        }),

    ],
    devServer: {
        contentBase: path.join(__dirname, './dist'),
        open: true,
        port: 9005,
        hot: true,
    },
    // devtool: 'eval-source-map',
    devtool: false,
    module: {
        unknownContextCritical: false,
        unknownContextRegExp: /\/cesium\/cesium\/Source\/Core\/buildModuleUrl\.js/,
        rules: [
            ...commonRules,
        ],
    }
}
