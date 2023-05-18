#!/usr/bin/env node

const express = require('express');
const PortFinder = require('portfinder');

const createServer = require('./dev/server');
const createMockServer = require('./dev/mock');
let config = require('../../config/custom');

const app = express();
const port = config.DEVELOPMENT.port || 8800

PortFinder.getPort({ port }, (err, spt) => {
    if (err) {
        throw '无法找到空闲端口';
    }
    ServerPort = spt;

    createServer(app, config.DEVELOPMENT, ServerPort);
    createMockServer(app, config.DEVELOPMENT)
});
