const user = require('./user');

const proxy = {
  _proxy: {
    proxy: {
      // '/xhr/(.*)': 'http://127.0.0.1:3721/',
      '/api/(.*)': 'http://localhost:9999/'
      // '/api/(.*)': 'http://116.62.21.79:5678/api/',
      // '/api/(.*)': 'http://192.168.1.212:28081/api/',
    },
    pathRewrite: {
      // '^/xhr': '',
      // '^/api': ''
    },
    changeHost: true,
    httpProxy: {
      options: {
        ignorePath: false
      },
      listeners: {
        proxyReq: function (proxyReq, req, res, options) {
          let rewritePath = req.url;
          console.log('proxyReq => ', req.headers.referer + req.url + '  ->  ' + 'https://' + req.headers.host + rewritePath);
        },
        error: function (err, req, res) {
          res.writeHead(500, {
            'Content-Type': 'text/plain'
          });

          res.end('Something went wrong.');
        }
      }
    }
  },
  ...user
};
module.exports = proxy;
