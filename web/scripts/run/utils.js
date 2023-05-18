const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

/**
 * 抛出错误，并终止程序
 * @param {string} msg 
 */
const exitError = (msg) => {
  console.log(chalk.red(msg));
  process.exit(1);
};

/**
 * 获取对应webpack配置
 * @param {string} mode
 * @param {string} env 
 */
const getWebpackConfig = (mode, env = 'release') => {
  let webpackConfig;
  const webpackConfigPath = path.resolve(path.resolve(__dirname), `../../config/webpack.${mode}.config.js`);
  try {
    fs.accessSync(webpackConfigPath, fs.constants.R_OK);
    webpackConfig = require(webpackConfigPath);
    return webpackConfig(env);
  } catch (err) {
    exitError(err);
  }
};


exports.exitError = exitError;
exports.getWebpackConfig = getWebpackConfig;
