const path = require('path')

module.exports = {
  /* [!important]路径基于项目根目录 */

  svgDir: './src/images/svg', // svg存放目录

  tsConfigPath: 'tsconfig.json', // tsconfig.json文件路径

  globalSassResources: ['./src/styles/variable.scss'], // 全局sass样式，请配置文件路径

  cssModule: false, // 是否开启css module

  // excludeCssModules: ['@tmind/yuna'], // 排除cssModule的模块名称

  babelConfig: {
    presets: [
      // {
      //   name: '@babel/preset-env',
      //   options: {
      //     targets: { browsers: 'last 2 versions' }
      //   }
      // }
    ],

    plugins: [
      // {
      //   name: 'babel-plugin-import',
      //   options: { libraryName: 'antd', libraryDirectory: 'lib', style: 'css'},
      //   alias: 'antd' 注意，当有多个相同的plugin时，必须有alias字段
      // }
    ]
  },

  // antd 主题覆盖
  cssModifyVars: {
    // '@ant-prefix': 'y-m-ant',
    // 'primary-color': '#1DA57A',
  },

  // 仅作用在dev
  DEVELOPMENT: {

    // 全局变量定义
    DefinePluginMap: {
      'process.env.BUILD_ENV': JSON.stringify('development'),
    },

    port: '9999',  // dev server 运行的端口

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
    port: 9999,
    static: {
      directory: path.resolve(__dirname, "dist")
    },
    proxy: {
      '/mock/*': {
        target: 'http://localhost:3721',
        changeOrigin: true,
      },
      '/api/*': {
        target: 'http://localhost:9999',
        pathRewrite: {
          '^/api': '/api'
        },
        changeOrigin: true
      }
    }
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

  EXTRA_PLUGINS: [
  ],
}
