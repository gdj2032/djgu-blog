#!/usr/bin/env node

const path = require('path');
const chalk = require('chalk');
const cors = require('cors')
const webpack = require('webpack');
const express = require('express');
const OpenUrl = require('openurl');
const url = require('url');
const fs = require('fs');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackDevMiddleware = require('webpack-dev-middleware');
const { getWebpackConfig } = require('../utils');
const https = require('https');


function createServer(app, config, port) {
    const webpackConfig = getWebpackConfig('dev');
    // HMR
    Object.keys(webpackConfig.entry).forEach((name) => {
        webpackConfig.entry[name] = ['webpack-hot-middleware/client?noInfo=true&reload=true'].concat(webpackConfig.entry[name]);
    });
    const compiler = webpack(webpackConfig);
    const devMiddleware = webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: 'minimal'
    });
    const hotMiddleware = webpackHotMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        noInfo: true,
    });

    app.use(cors({
        origin: `*`,
        credentials: true
    }));
    app.use(devMiddleware);
    app.use(hotMiddleware);
    app.use(express.static(process.cwd()));

    // 解决BrowserRoute路由问题
    if (config.supportBrowserRouter) {
        app.use('*', function (req, res, next) {
            var filename = path.join(compiler.outputPath, 'index.html');
            compiler.outputFileSystem.readFile(filename, function (err, result) {
                if (err) {
                    return next(err);
                }
                res.set('content-type', 'text/html');
                res.send(result);
                res.end();
            });
        });
    }

    let schema = 'http';
    if (config.tls) {
        schema = 'https';
        const tls =
        {
            cert: fs.readFileSync(config.tls.cert),
            key: fs.readFileSync(config.tls.key)
        };
        httpsServer = https.createServer(tls, app);
        httpsServer.listen(port, '0.0.0.0');
    }
    else {
        app.listen(port);
    }

    const clientUrl = url.format(url.parse(`${schema}://localhost:${port}`));
    devMiddleware.waitUntilValid(() => {
        console.log(chalk.green('\nLive Development Server is listening on '), chalk.blue.underline(clientUrl));
        OpenUrl.open(clientUrl);
    });
}

module.exports = createServer;