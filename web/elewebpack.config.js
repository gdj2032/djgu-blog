const path = require('path');
const webpack = require('webpack');

module.exports = {
  target: 'electron-main',
  entry: {
    main: './appjs/main.js',
    'electron-client': './appjs/electron-client.js'
  },
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.join(__dirname, './pc_release/release'),
    filename: '[name].js',
  },
  module: {
    rules: []
  },
  node: {
    __dirname: false
  }
};
