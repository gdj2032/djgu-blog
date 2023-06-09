const path = require('path');
const resolve = require('resolve');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const vConsolePlugin = require('vconsole-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ProgressPlugin = require('progress-webpack-plugin')
const WebpackBeforeBuildPlugin = require('before-build-webpack');
const globals = require('./globals');
const config = require('./server')

const isEnvDevelopment = process.env.NODE_ENV === 'development';
const disableESLintPlugin = process.env.DISABLE_ESLINT_PLUGIN === 'true';
const emitErrorsAsWarnings = process.env.ESLINT_NO_DEV_ERRORS === 'true';

const commonPlugin = [
  // {
  //   apply: (compiler) => {
  //     onPrebuild && onPrebuild(compiler)
  //   },
  // },
  // webpack构建前执行函数
  // new WebpackBeforeBuildPlugin(function (stats, callback) {
  //   console.info('--- WebpackBeforeBuildPlugin ---',);
  //   onPrebuild && onPrebuild(stats)
  //   callback();
  // }, ['run', 'watch-run', 'done']),
  // !disableESLintPlugin &&
  // new ESLintPlugin({
  //   // Plugin options
  //   extensions: ['js', 'mjs', 'ts'],
  //   eslintPath: require.resolve('eslint'),
  //   failOnError: !(isEnvDevelopment && emitErrorsAsWarnings),
  //   context: globals.SourceDirectory,
  //   cache: true,
  //   cacheLocation: path.resolve(
  //     globals.NodeModulesDirectory,
  //     '.cache/.eslintcache'
  //   ),
  //   // ESLint class options
  //   cwd: globals.RootDirectory,
  //   resolvePluginsRelativeTo: __dirname,
  // }),
]

exports.devPlugins = function () {
  return commonPlugin.concat([
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      ...config.DEVELOPMENT.DefinePluginMap
    }),
    // new vConsolePlugin({ enable: config.DEVELOPMENT.vConsole })
  ],
    new ProgressPlugin(true),
    config.EXTRA_PLUGINS || [],
  );
};

exports.proPlugins = function (env = 'release') {
  return commonPlugin.concat([
    new CleanWebpackPlugin(), // 实例化clean-webpack-plugin插件，删除上次打包的文件
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      ...config.PRODUCTION.DefinePluginMap[env]
    }),
  ], config.PRODUCTION.BundleAnalyzer ? [new BundleAnalyzerPlugin()] : [])
};

exports.optimization = function () {
  return {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          mangle: false, // Note `mangle.properties` is `false` by default.
        },
      }),
    ],
    splitChunks: {
      automaticNameDelimiter: '-',
    },
    concatenateModules: false
  };
};
