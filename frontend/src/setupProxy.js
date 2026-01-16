const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8001',
      changeOrigin: true,
      timeout: 30000,
      proxyTimeout: 30000,
      logLevel: 'debug',
      pathRewrite: { '^/api': '/api' }
    })
  );
};
