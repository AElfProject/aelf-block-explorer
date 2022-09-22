const withLess = require('next-with-less');
const path = require('path');
const withAntdLess = require('next-plugin-antd-less');
const { NEXT_PUBLIC_CSS_APP_PREFIX, NEXT_PUBLIC_BUNDLE_ANALYZER } = process.env;
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: NEXT_PUBLIC_BUNDLE_ANALYZER === 'true',
});
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const {
  ROOT,
  OUTPUT_PATH,
  isProdMode,
  // ENTRIES,
  // PAGES,
  PUBLIC_PATH,
  getLessVariables,
} = require('./util.js');

const copies = [];

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
        config.plugins.push(
          // new HtmlWebpackPlugin({
          //   template: path.resolve(ROOT, './template.ejs'),
          //   filename: 'index.html',
          //   chunks: isProdMode ? ['runtime.app', 'vendors', 'app'] : ['app'],
          //   name: 'app',
          //   title: 'AELF Block Explorer',
          // }),
          // new webpack.ProvidePlugin({
          //   React: 'react',
          // }),
          // new MomentLocalesPlugin({
          //   localesToKeep: ['es-us', 'en-ca', 'zh-cn'],
          // }),
          new CopyWebpackPlugin(copies),
          new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.RELOAD_ENV': JSON.stringify(process.env.RELOAD_ENV),
            'process.env.LOCALE': JSON.stringify(process.env.LOCALE || 'zh'),
            PACKAGE_VERSION: JSON.stringify(process.env.npm_package_version),
          }),
          // new MonacoWebpackPlugin({
          //   languages: ['xml', 'csharp', 'json'],
          //   features: [
          //     'bracketMatching',
          //     'wordHighlighter',
          //     'comment',
          //     'find',
          //     'coreCommands',
          //     'links',
          //     'hover',
          //     'quickCommand',
          //     'goToDefinitionCommands',
          //     'goToDefinitionMouse',
          //     'gotoLine',
          //     'linesOperations',
          //   ],
          // }),
          new webpack.ProvidePlugin({
            process: 'process/browser',
          }),
        );
        return config;
      },
    }),
  ],
];
