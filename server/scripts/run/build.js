#!/usr/bin/env node

const ora = require('ora');
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const argv = require('yargs').argv;
const { getWebpackConfig, exitError } = require('./utils');
const config = require('../../config/server');

const server = () => {
  const spinner = ora(`building for production...\n`);
  spinner.start();

  const webpackConfig = getWebpackConfig('production', argv.env);
  rm(path.resolve(process.cwd(), config.PRODUCTION.outputDir), err => {
    if (err) {
      throw err;
    }
    webpack(webpackConfig, function (err, stats) {
      spinner.stop();
      if (err) {
        throw err;
      }
      process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n');

      if (stats.hasErrors()) {
        exitError('  Build failed with errors.\n')
      }

      console.log(chalk.cyan('  Build complete.\n'));
      console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
      ));
    });
  });
}

server();
