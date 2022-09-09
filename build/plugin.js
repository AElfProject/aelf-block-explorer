const withLess = require('next-with-less');
const { NEXT_PUBLIC_CSS_APP_PREFIX, NEXT_PUBLIC_BUNDLE_ANALYZER } = process.env;
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: NEXT_PUBLIC_BUNDLE_ANALYZER === 'true',
});
module.exports = [
  [withBundleAnalyzer],
  [
    withLess,
    {
      lessLoaderOptions: {
        lessOptions: {
          modifyVars: {
            '@app-prefix': NEXT_PUBLIC_CSS_APP_PREFIX,
            '@ant-prefix': NEXT_PUBLIC_CSS_APP_PREFIX,
          },
        },
      },
    },
  ],
];
