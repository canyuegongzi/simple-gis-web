const webpack = require('webpack');
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin-webpack5');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const {commonRules, commonPlugins} = require('./webpack_common.config');
const SpeedMeasurePlugin=require('speed-measure-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const smp = new SpeedMeasurePlugin();
const config = {
    mode: 'production',
    entry: './src/main.ts',
    output: {
        publicPath: './',
        path: path.resolve(__dirname, '../', "dist"),
        filename: '[name].[chunkhash:8].js',
        clean: true,
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            '@/components': path.resolve(__dirname, "src/components"),
            '@/pages': path.resolve(__dirname, "src/pages"),
            '@/assets': path.resolve(__dirname, "src/assets"),
            '@/public': path.resolve(__dirname, "src/public"),
            '@/http': path.resolve(__dirname, "src/http_request"),
            '@/router': path.resolve(__dirname, "src/router"),
            '@/store': path.resolve(__dirname, "src/store"),
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
            template: "./public/index.html"
        }),
        new BundleAnalyzerPlugin(),
        new VueLoaderPlugin(),
        ...commonPlugins
    ],
    module: {
        rules: [
            ...commonRules
        ]
    }
}
module.exports = smp.wrap(config);
