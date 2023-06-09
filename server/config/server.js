const path = require('path')

module.exports = {
  // 仅作用在dev
  DEVELOPMENT: {

    // 全局变量定义
    DefinePluginMap: {
      'process.env.BUILD_ENV': JSON.stringify('development'),
    },

    port: 9000,  // dev server 运行的端口

    supportBrowserRouter: false, // 是否支持BrowserRouter

    vConsole: false, // 是否开启vConsole插件，移动端调试工具

    mock: true,

    mockPath: '/mock',
  },

  devServer: { //配置热更新模块
    compress: true, // gzip压缩
    hot: true, // 热更新
    historyApiFallback: true, // 解决启动后刷新404
    // open: true,
    port: 9000,
    static: {
      directory: path.resolve(__dirname, "dist")
    },
  },

  // 仅作用在build
  PRODUCTION: {
    BUILD_ENV: 'production',

    // 全局变量定义, build模式下支持不同环境配置
    DefinePluginMap: {
      pre: {
        'process.env.BUILD_ENV': JSON.stringify('pre'),
      },
      release: {
        'process.env.BUILD_ENV': JSON.stringify('release'),
      }
    },

    outputDir: 'dist', // 递交目录

    publicPath: './', // 资源公共路径

    BundleAnalyzer: false, // 分析打包出的bundle构成, 需要时开启
  },
}
