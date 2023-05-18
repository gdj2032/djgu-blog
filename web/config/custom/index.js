const fs = require('fs-extra')
const path = require('path');
const chalk = require('chalk');
const merge = require('lodash.merge');
const { CONFIG_FILENAME } = require('./constant');
const defaultConfig = require('./default.config');
/**
 * 检查文件或者目录是否存在
 *
 * @param {string} path 
 * @param {string} type [file, dir]
 *
 * @return boolean
 */
const isExist = (path, type) => {
    let result = false;
    try {
      const stat = fs.statSync(path);
      if (type === 'file' && stat.isFile()) result = true;
      if (type === 'dir' && stat.isDirectory()) result = true;
    } catch (e) {
      result = false;
    }
    return result;
}

const configPath = path.resolve(fs.realpathSync(process.cwd()), CONFIG_FILENAME);
let config = {};

if (isExist(configPath, 'file')) {
  config = require(configPath);
}

module.exports = merge(defaultConfig, config)
