const globals = require('./globals');

exports.js = {
  test: /\.(j|t)s?$/,
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
        ],
        plugins: [
          [require.resolve("@babel/plugin-syntax-dynamic-import")],
          [require.resolve("@babel/plugin-transform-runtime"), { "regenerator": true }],
          [require.resolve("@babel/plugin-proposal-decorators"), { legacy: true }],
          [require.resolve("@babel/plugin-proposal-class-properties"), { loose: true }],
          [require.resolve("@babel/plugin-proposal-private-methods"), { loose: true }],
          [require.resolve("@babel/plugin-proposal-private-property-in-object"), { loose: true }],
        ].filter(plugin => !!plugin),
      }
    },
  ],
  include: globals.SourceDirectory,
};
