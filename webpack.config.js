const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        app: path.resolve(__dirname, './client/index.js'),
    },
    output: {
        filename: '[name][hash].bundle.js',
        path: path.resolve(__dirname, 'build'),
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.jsx?$/i,
                use: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(s?css)$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
        ],
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html',
            chunks: ['app'],
            hash: true,
            favicon: './public/favicon.png',
            templateParameters: {
                apiKey: process.env.API_KEY,
            },
        }),
        new CleanWebpackPlugin(),
    ],
};
