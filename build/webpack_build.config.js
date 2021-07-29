const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { commonRules, commonPlugins } = require('./webpack_common.config');
module.exports = {
    mode: 'production',
    entry: './src/main.ts',
    output: {
        publicPath: '/simple-gis-web/',
        // publicPath: './',
        path: path.resolve(__dirname, '../', 'dist'),
        filename: '[name].[chunkhash:8].js',
        clean: true,
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue'],
        alias: {
            '@': path.resolve(__dirname, "src"),
            '@/components': path.resolve(__dirname, "src/components"),
            '@/pages': path.resolve(__dirname, "src/pages"),
            '@/assets': path.resolve(__dirname, "src/assets"),
            '@/public': path.resolve(__dirname, "src/public"),
            '@/http': path.resolve(__dirname, "src/http_request"),
            '@/router': path.resolve(__dirname, "src/router"),
            '@/store': path.resolve(__dirname, "src/store"),
            '@/data': path.resolve(__dirname, "src/data"),
        }
    },
    optimization: {
        usedExports: true, // 识别无用代码
        minimize: true,    // 将无用代码在打包中删除
        concatenateModules: true, // 尽可能将所有模块合并输出到一个函数中
        // runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                commons: {
                    name: "commons",
                    chunks: "initial",
                    minSize: 0,
                    minChunks: 2,
                },
                vendors: {
                    test: /node_modules/,
                    name: 'vendors',
                    minSize: 0,
                    minChunks: 1,
                    chunks: 'initial',
                    priority: 1
                }
            }
        },
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    ecma: undefined,
                    warnings: false,
                    parse: {},
                    compress: {
                        drop_console: true,
                        drop_debugger: false,
                        pure_funcs: ['console.log']
                    }
                },
            }),
            new CssMinimizerPlugin(),
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
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
                { from: 'public/static', to: 'static' },
            ],
        }),
        new webpack.DefinePlugin({
            // Define relative base path in cesium for loading assets
            CESIUM_BASE_URL: JSON.stringify(''),
        }),
    ],
    module: {
        unknownContextCritical: false,
        unknownContextRegExp: /\/cesium\/cesium\/Source\/Core\/buildModuleUrl\.js/,
        rules: [
            ...commonRules,
        ],
    }
}
