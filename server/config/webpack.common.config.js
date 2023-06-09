const path = require('path')
const globals = require('./globals');
const rules = require('./rules');
const { resolveTsconfigPathsToAlias } = require('./utils');

module.exports = {
  target: 'node',
  entry: {
    bundle: [require.resolve("@babel/polyfill"), path.resolve(globals.SourceDirectory, 'index.ts')],
  },
  output: {
    path: globals.DistDirectory,
    filename: "server.js",
    publicPath: '',
    // 微应用暴露配置
    // library: `${packageName}-[name]`,
    libraryTarget: 'umd',
    // jsonpFunction: `webpackJsonp_${packageName}`,
  },
  context: __dirname,
  module: {
    rules: [
      rules.js,
    ]
  },
  optimization: {  //添加抽离公共代码插件的配置
    splitChunks: {
      cacheGroups: {
        //打包公共模块
        commons: {
          chunks: 'initial', //initial表示提取入口文件的公共部分
          minChunks: 2, //表示提取公共部分最少的文件数
          minSize: 0, //表示提取公共部分最小的大小
          name: 'commons' //提取出来的文件命名
        }
      }
    },
  },
  resolve: {                                    //resolve核心配置
    extensions: [".ts", ".js"],
    alias: resolveTsconfigPathsToAlias(path.resolve(globals.RootDirectory, './tsconfig.json')),
    modules: [
      globals.SourceDirectory,
      globals.NodeModulesDirectory
    ],
  },
  stats: process.env.NODE_ENV === 'development' ? 'minimal' : undefined,
}
