const rewritesConfig = require('./rewrites/index');
module.exports = {
  // `Warning: findDOMNode is deprecated in StrictMode.` when use antd
  reactStrictMode: false,
  concurrentFeatures: true,
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  productionBrowserSourceMaps: true,
  async rewrites() {
    return rewritesConfig;
  },
  images: {
    domains: ['raw.githubusercontent.com'],
  },
};
