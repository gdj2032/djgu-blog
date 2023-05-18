const path = require('path');

/**
 * 将tsConfig中的别名转换为webpack的别名
 * @param {string} tsconfigPath 
 * @param {string} context
 */
const resolveTsconfigPathsToAlias = (tsconfigPath = './tsconfig.json', context) => {
  const { paths, baseUrl } = require(tsconfigPath).compilerOptions;

  const aliases = {};
  const pathContext = context || baseUrl;

  Object.keys(paths).forEach((item) => {
    const key = item.replace('/*', '');
    const value = path.resolve(pathContext, paths[item][0].replace('/*', ''));

    aliases[key] = value;
  });

  return aliases;
}

/** 
 * 格式化babel配置项 （persist or plugins）
 * @param { options[] } { name, options, alias }[]
 */
const formatBabelOptions = (options = []) => {
  return options.map(o => {
    const r = [
      require.resolve(o.name),
      o.options || {},
    ];
    if (options.alias) {
      r.push(options.alias);
    }
    return r;
  });
}


exports.resolveTsconfigPathsToAlias = resolveTsconfigPathsToAlias;
exports.formatBabelOptions = formatBabelOptions
