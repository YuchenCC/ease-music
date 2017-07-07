var path = require('path');
var webpack = require('webpack');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var HtmlwebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
  entry: {
      bundle1: './src/index.js',
      bundle2: './src/song.js'
  },
  output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist')
  },
    module: {
        loaders:[
            { test: /\.scss$/,loader:'style-loader!css-loader!autoprefixer-loader?browsers=last 6 versions!sass-loader'},
            { test: /\.css$/, loader: 'style-loader!css-loader!autoprefixer-loader?browsers=last 6 versions' },
            {
                test: /\.js[x]?$/, exclude: /node_modules/, loader: 'babel-loader', options: {
                    presets: ['env'],
                    plugins: [require('babel-plugin-transform-object-rest-spread')]
                }
            }
            // { test: /\.(png|jpg|gif)$/, loader: 'url-loader' }
        ]
    },
    devServer:{
      contentBase: path.join(__dirname,"dist"),
        compress: true,
        port: 9080
    },
    plugins: [
        new uglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        // new HtmlwebpackPlugin({
        //     title: 'Webpack-demos',
        //     filename: 'text.html'
        // }),
        new OpenBrowserPlugin({
            url: 'http://localhost:9080',
           // contentBase: path.join(__dirname, 'dist')
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ]
};
