const user = require('./user');

const proxy = {
  _proxy: {
    proxy: {
      // '/xhr/(.*)': 'http://127.0.0.1:3721/',
      '/api/(.*)': 'http://127.0.0.1:9999/',
      // '/api/(.*)': 'http://116.62.21.79:5678/api/',
      // '/api/(.*)': 'http://192.168.1.212:28081/api/',
    },
    pathRewrite: {
      // '^/xhr': '',
      '^/api': '',
    },
    changeHost: true,
    httpProxy: {
      options: {
        ignorePath: false,
      },
      listeners: {
        proxyReq: function (proxyReq, req, res, options) {
          // pathRewrite
          let rewritePath = req.url.replace(/^\/xhr/, '');
          // if(rewritePath.startsWith('/api/aiArithmetic')){
          //   rewritePath =rewritePath.replace(/^\/api\/aiArithmetic/, '')
          // }
          proxyReq.path = rewritePath;
          // setHeader
          // proxyReq.setHeader('Cookie', localCookie);
        },
        error: function (err, req, res) {
          res.writeHead(500, {
            'Content-Type': 'text/plain'
          });

          res.end('Something went wrong.');
        }
      }
    },
  },
  ...user,
}
module.exports = proxy;
