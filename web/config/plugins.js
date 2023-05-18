const path = require('path');
const resolve = require('resolve');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const vConsolePlugin = require('vconsole-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ProgressPlugin = require('progress-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin');
const WebpackBeforeBuildPlugin = require('before-build-webpack');
const config = require('./custom');
const globals = require('./globals');

const isEnvDevelopment = process.env.NODE_ENV === 'development';
const disableESLintPlugin = process.env.DISABLE_ESLINT_PLUGIN === 'true';
const emitErrorsAsWarnings = process.env.ESLINT_NO_DEV_ERRORS === 'true';

const hasJsxRuntime = (() => {
  if (process.env.DISABLE_NEW_JSX_TRANSFORM === 'true') {
    return false;
  }

  try {
    require.resolve('react/jsx-runtime');
    return true;
  } catch (e) {
    return false;
  }
})();

// let onPrebuild
// try {
//   onPrebuild = require('../.preBuild.js');
// }
// catch (e) {
//   console.error('无法加载编译前置处理文件： .preBuild.js');
//   console.error(e);
//   throw e;
// }

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
  !disableESLintPlugin &&
  new ESLintPlugin({
    // Plugin options
    extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
    formatter: require.resolve('react-dev-utils/eslintFormatter'),
    eslintPath: require.resolve('eslint'),
    failOnError: !(isEnvDevelopment && emitErrorsAsWarnings),
    context: globals.SourceDirectory,
    cache: true,
    cacheLocation: path.resolve(
      globals.NodeModulesDirectory,
      '.cache/.eslintcache'
    ),
    // ESLint class options
    cwd: globals.RootDirectory,
    resolvePluginsRelativeTo: __dirname,
    baseConfig: {
      extends: [require.resolve('eslint-config-react-app/base')],
      rules: {
        ...(!hasJsxRuntime && {
          'react/react-in-jsx-scope': 'error',
        }),
      },
    },
  }),
]

exports.devPlugins = function () {
  return commonPlugin.concat([
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      ...config.DEVELOPMENT.DefinePluginMap
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(globals.RootDirectory, 'index.html'),
      inject: true
    }),
    new vConsolePlugin({ enable: config.DEVELOPMENT.vConsole })],
    new ProgressPlugin(true),
    config.EXTRA_PLUGINS || [],
  );
};

exports.proPlugins = function (env = 'release') {
  return commonPlugin.concat([
    new CleanWebpackPlugin(), // 实例化clean-webpack-plugin插件，删除上次打包的文件
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash:16].css',
      chunkFilename: '[name]-[contenthash:16].css',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      ...config.PRODUCTION.DefinePluginMap[env]
    }),
    new HtmlWebpackPlugin({
      filename: path.resolve(globals.DistDirectory, 'index.html'),
      template: path.resolve(globals.RootDirectory, 'index.html'),
      inject: true,
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
