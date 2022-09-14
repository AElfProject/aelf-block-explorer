const rewritesConfig = require('./rewrites/index');
module.exports = {
  reactStrictMode: false,
  async rewrites() {
    return rewritesConfig;
  },
  images: {
    domains: ['raw.githubusercontent.com'],
  },
  i18n: {
    locales: ['en-US', 'zh'],
    defaultLocale: 'en-US',
  },
};
