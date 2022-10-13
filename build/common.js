const rewritesConfig = require('./rewrites/index');
module.exports = {
  reactStrictMode: true,
  concurrentFeatures: true,
  async rewrites() {
    return rewritesConfig;
  },
  images: {
    domains: ['raw.githubusercontent.com'],
  },
};
