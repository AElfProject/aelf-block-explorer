const rewritesConfig = require('./rewrites/index');
module.exports = {
  reactStrictMode: false,
  async rewrites() {
    return rewritesConfig;
  },
  images: {
    domains: ['raw.githubusercontent.com'],
  },
};
