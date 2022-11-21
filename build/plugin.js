const withAntdLess = require('next-plugin-antd-less');
const { NEXT_PUBLIC_BUNDLE_ANALYZER } = process.env;
const { withSentryConfig } = require('@sentry/nextjs');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: NEXT_PUBLIC_BUNDLE_ANALYZER === 'true',
});
const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  include: '.next',
  configFile: '.sentryclirc',
  urlPrefix: '~/_next',
};
module.exports = [
  [withBundleAnalyzer],
  [withAntdLess],
  (nextConfig) => withSentryConfig(nextConfig, sentryWebpackPluginOptions),
];
