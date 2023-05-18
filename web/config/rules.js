const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const globals = require('./globals');
const config = require('./custom');
const { resolveTsconfigPathsToAlias, formatBabelOptions } = require('./utils');

exports.js = {
  test: /\.(j|t)sx?$/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        comments: true,
        babelrc: false,
        presets: [
          [
            require.resolve("@babel/preset-env"),
            {
              targets: {
                browsers: [
                  "last 2 versions",
                  "> 1%",
                  "IE 11"
                ]
              }
            } // or whatever your project requires
          ],
          require.resolve("@babel/preset-typescript"),
          require.resolve("@babel/preset-react"),
          ...formatBabelOptions(config.babelConfig.presets),
        ],
        plugins: [
          [require.resolve("@babel/plugin-syntax-dynamic-import")],
          [require.resolve("@babel/plugin-transform-runtime"), { "regenerator": true }],
          [require.resolve("@babel/plugin-proposal-decorators"), { legacy: true }],
          [require.resolve("@babel/plugin-proposal-class-properties"), { loose: true }],
          [require.resolve("@babel/plugin-proposal-private-methods"), { loose: true }],
          [require.resolve("@babel/plugin-proposal-private-property-in-object"), { loose: true }],
          [require.resolve("babel-plugin-import"), { libraryName: "antd", libraryDirectory: "lib", style: false }, 'antd'],
          ...formatBabelOptions(config.babelConfig.plugins),
          config.cssModule ?
            [require.resolve("babel-plugin-react-css-modules"), {
              context: __dirname,
              generateScopedName: "[local]-[fullhash:base64:12]",
              autoResolveMultipleImports: true,
              filetypes: {
                ".scss": {
                  "syntax": "postcss-scss"
                }
              },
              exclude: 'node_modules',
            }]
            : null,
          config.cssModule ?
            [require.resolve("babel-plugin-module-resolver"), {
              alias: resolveTsconfigPathsToAlias(path.resolve(globals.RootDirectory, './tsconfig.json')),
              extensions: [".ts", ".tsx", ".js", ".jsx"],
            }]
            : null
        ].filter(plugin => !!plugin),
      }
    }
  ],
  include: globals.SourceDirectory,
};

const css = (isProduction) => {
  const styleLoader = !isProduction ? 'style-loader'
    : {
      loader: MiniCssExtractPlugin.loader,
      // options: {
      //   hmr: false
      // }
    };

  return [
    {
      test: /\.css$/,
      use: [
        styleLoader
        , {
          loader: 'css-loader'
        },
      ]
    },
    {
      test: /\.s[a|c]ss$/,
      use: [
        styleLoader,
        {
          loader: 'css-loader'
        },
        {
          loader: 'postcss-loader'
        },
        {
          loader: 'sass-loader'
        },
        (config.globalSassResources && config.globalSassResources.length) ? {
          loader: 'sass-resources-loader',
          options: {
            resources: config.globalSassResources.map(filePath => path.resolve(globals.RootDirectory, filePath))
          }
        } : null
      ]
    },
    {
      test: /\.less$/,
      use: [
        styleLoader,
        'css-loader',
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              modifyVars: config.cssModifyVars || {},
              javascriptEnabled: true
            }
          }
        }
      ]
    }
  ];
};

exports.devCssRuleList = css();

exports.proRuleList = css(true);


exports.fonts = {
  test: /\.(eot|otf|woff|woff2|ttf|svg)([?]?.*)$/,
  use: 'file-loader',
  exclude: [
    globals.SvgDirectory,
  ]
};

exports.assets = {
  test: /\.(jpe?g|png|gif)$/,
  use: {
    loader: 'url-loader',
    options: { esModule: false, limit: 10240 },
  },
  type: 'javascript/auto'
};

exports.svg = {
  test: /\.(svg)$/i,
  use: 'svg-sprite-loader',
  include: [
    globals.SvgDirectory,
  ],
};