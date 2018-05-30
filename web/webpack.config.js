const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    index: ['./src/index.js'],
    client: ['./src/client.js'],
    manager: ['./src/manager.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      { test: /\.css$/, use: [{ loader: "style-loader" }, { loader: "css-loader" }] },
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
      { test: /\.ogg$/, loader: "file-loader" },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      // Required
      inject: false,
      template: require('html-webpack-template'),
      filename: 'index.html',
      chunks: ['index'],
      title: 'Kuiz',
			appMountId: 'root',
    }),
    new HtmlWebpackPlugin({
      // Required
      inject: false,
      template: require('html-webpack-template'),
      filename: 'client.html',
      chunks: ['client'],
      title: 'Kuiz - Buzzer',
			appMountId: 'root',
    }),
    new HtmlWebpackPlugin({
      // Required
      inject: false,
      template: require('html-webpack-template'),
      filename: 'manager.html',
      chunks: ['manager'],
      title: 'Kuiz - Gestion des scores',
			appMountId: 'root',
    }),
  ],
};

