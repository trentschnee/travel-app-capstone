var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
    entry: './src/index.js',
    mode: 'development',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js'
    },
    module: {
        rules: [
            {
                test: '/\.js$/',
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: [ 'style-loader', 'css-loader', 'sass-loader' ]
            }
        ]
    }
  ,
plugins: [ new HtmlWebpackPlugin({
    template: "./src/index.html",
    filename: "./index.html",
})]
};