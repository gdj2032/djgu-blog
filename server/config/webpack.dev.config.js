const webpackMerge = require('webpack-merge');
const plugins = require('./plugins');
const commonConfig = require('./webpack.common.config.js');

module.exports = function () {
  return webpackMerge.merge(commonConfig, {
    mode: 'development',
    output: {
      filename: '[name][fullhash:8].js',
      chunkFilename: '[name][fullhash:8].js',
    },
    module: {
      rules: [
      ]
    },
    plugins: plugins.devPlugins(),
    // devtool: 'eval-cheap-module-source-map',
    devServer: custom.devServer,
  });
}
