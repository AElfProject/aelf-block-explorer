const withLess = require('next-with-less');
const withAntdLess = require('next-plugin-antd-less');
const { NEXT_PUBLIC_CSS_APP_PREFIX, NEXT_PUBLIC_BUNDLE_ANALYZER } = process.env;
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: NEXT_PUBLIC_BUNDLE_ANALYZER === 'true',
});
module.exports = [
  [withBundleAnalyzer],
  [
    // withLess,
    withAntdLess({
      lessLoaderOptions: {
        lessOptions: {
          javascriptEnabled: true,
          modifyVars: {
            '@app-prefix': NEXT_PUBLIC_CSS_APP_PREFIX,
            '@ant-prefix': NEXT_PUBLIC_CSS_APP_PREFIX,
          },
        },
      },
      images: {
        disableStaticImages: true,
      },
      webpack: function (config) {
        config.module.rules.push(
          {
            test: /\.(jpe?g|png|gif|svg)$/i,
            use: [
              {
                loader: 'url-loader',
                options: {
                  name: 'static/img/[name]-[hash:5].[ext]',
                  limit: 8192,
                },
              },
            ],
          },
          {
            test: /\.(woff|woff2|ttf|eot|svg)(#.+)?$/,
            use: [
              {
                loader: 'url-loader',
                options: {
                  name: 'static/fonts/[name].[ext]',
                  limit: 8192,
                },
              },
            ],
          },
        );
        return config;
      },
    }),
  ],
];
