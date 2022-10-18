const path = require('path');
const withAntdLess = require('next-plugin-antd-less');
const { NEXT_PUBLIC_CSS_APP_PREFIX, NEXT_PUBLIC_BUNDLE_ANALYZER, NEXT_PUBLIC_CSS_EXAMPLE_PREFIX } = process.env;
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: NEXT_PUBLIC_BUNDLE_ANALYZER === 'true',
});

const { ROOT, getLessVariables } = require('./util.js');

module.exports = [
  [withBundleAnalyzer],
  [
    // withLess,
    withAntdLess({
      lessLoaderOptions: {
        lessOptions: {
          javascriptEnabled: true,
          modifyVars: Object.assign(getLessVariables(path.resolve(ROOT, 'src/assets/theme/color.less')), {
            '@app-prefix': NEXT_PUBLIC_CSS_EXAMPLE_PREFIX,
            '@ant-prefix': NEXT_PUBLIC_CSS_APP_PREFIX,
          }),
          lessVarsFilePath: 'src/assets/theme/color.less', // optional
          lessVarsFilePathAppendToEndOfContent: false, // optional
        },
      },
      images: {
        disableStaticImages: true,
      },
      webpack: function (config) {
        config.module.rules.push(
          {
            test: /\.(jpe?g|png|gif|svg|webp)$/i,
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
