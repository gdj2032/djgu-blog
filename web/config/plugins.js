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
  new webpack.ProvidePlugin({
    'window.Quill': 'Quill',
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
      chunks: 'async',//三选一："initial" 初始化，"all"(默认就是all)，"async"（动态加载）
      minSize: 20000,//当导入的模块最小是多少字节才会进行代码分割
      minRemainingSize: 0,//解析见代码下面的文字说明，不用设置
      minChunks: 1,//当一个模块被导入(引用)至少多少次才对该模块进行代码分割
      maxAsyncRequests: 30,//按需加载时的最大并行请求数
      maxInitialRequests: 30,//入口点的最大并行请求数
      enforceSizeThreshold: 50000,//解析见代码下面的文字说明，不用设置
      cacheGroups: {//缓存组，这里是我们表演的舞台，抽取公共模块什么的，都在这个地方
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,//优先级
          reuseExistingChunk: true,
        },
        vconsole: {
          name: "vconsole",
          priority: 7,
          test: /[\\/]node_modules[\\/]_?vconsole(.*)/,
          chunks: "all",
          minSize: 0,
        },
        common: {
          //src下同步引入的模块，全部放到common.js中
          name: "common",
          test: /[\\/]src[\\/]/,
          minSize: 1024,
          chunks: "initial",
          priority: 5
        },
        defaultVendors: {
          //第三方依赖库,全部放到venders.js中
          test: /[\\/]node_modules[\\/]/,
          priority: -10, // 优先级
          name: 'vendors',
          chunks: 'initial',
          reuseExistingChunk: true, // 如果一个模块已经被打包过了，那么这个模块也不会被打包
        },
        default: {//分包的基本配置
          minChunks: 2, // 被超过两个模块引用，才会被打包（可以去掉）
          priority: -20, // 优先级
          reuseExistingChunk: true, // 如果一个模块已经被打包过了，那么这个模块也不会被打包
        },
      },
    },
    concatenateModules: false
  };
};
