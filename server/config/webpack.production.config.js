const webpackMerge = require('webpack-merge');
const plugins = require('./plugins');
const config = require('./server');
const globals = require('./globals');
const commonConfig = require('./webpack.common.config.js');
const path = require('path');

const packageVersion = require(path.resolve(globals.RootDirectory, 'package.json')).version

module.exports = function (env) {
  return webpackMerge.merge(commonConfig, {
    mode: 'production',
    output: {
      publicPath: config.PRODUCTION.publicPath
    },
    module: {
      rules: []
    },
    plugins: plugins.proPlugins(env),
    cache: {
      type: 'filesystem',
      version: packageVersion,
    },
    optimization: plugins.optimization()
  });
}
