const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: ['babel-polyfill', path.resolve(__dirname,'src/index.js')],
    output: {
      path: path.join(__dirname, 'Build'),
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'svg-url-loader',
              options: {
                limit: 10000,
              },
            },
          ],
        },
        {
          test: /\.js|jsx$/,
          exclude: /node_modules/,
          use: ["babel-loader"]
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader
           ]
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { sourceMap: true }
            }, {
              loader: 'sass-loader',
              options: { sourceMap: true }
            }
          ]
        },
        {
          test: /\.(gif|png|jpe?g)$/i,
          use: [
            'file-loader',
            {
              loader: 'image-webpack-loader',
              options: {
                bypassOnDebug: true, // webpack@1.x
                disable: true, // webpack@2.x and newer
              },
            },
          ],
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({template: path.resolve(__dirname,"index.html")}),
      new MiniCssExtractPlugin({filename: "style.css",})
    ],
    devServer: {
      port: 3000
    }
};