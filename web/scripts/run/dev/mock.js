const path = require('path');
const apiMocker = require('mocker-api');

function createMockServer(app, config) {
  if (config.mock) {
    const proxyConfigPath = path.join(process.cwd(), config.mockPath, 'index.js');
    apiMocker(app, proxyConfigPath);
  }
}

module.exports = createMockServer;