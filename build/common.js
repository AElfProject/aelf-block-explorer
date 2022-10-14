const rewritesConfig = require('./rewrites/index');
module.exports = {
  reactStrictMode: false,
  concurrentFeatures: true,
  async rewrites() {
    return rewritesConfig;
  },
  images: {
    domains: ['raw.githubusercontent.com'],
  },
};
