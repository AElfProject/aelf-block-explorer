/**
 * @file 基础配置
 * @author atom-yang
 */

/* eslint-env node */
const path = require('path');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {
  ROOT,
  OUTPUT_PATH,
  PUBLIC_PATH,
  isProdMode,
  getLessVariables
} = require('./utils');

const copies = [];

const baseConfig = {
  entry: {
    app: path.resolve(ROOT, 'src/index.js')
  },
  output: {
    path: OUTPUT_PATH,
    publicPath: PUBLIC_PATH
  },
  resolve: {
    alias: {
      'aelf-sdk': 'aelf-sdk/dist/aelf.umd.js',
      '@config': path.resolve(ROOT,'config'),
      '@src': path.resolve(ROOT, 'src'),
      '@pages': path.resolve(ROOT, 'src/pages'),
      '@components': path.resolve(ROOT, 'src/components'),
      '@utils': path.resolve(ROOT, 'src/utils'),
      '@store': path.resolve(ROOT, 'src/store'),
      '@api': path.resolve(ROOT, 'src/api'),
      '@actions': path.resolve(ROOT, 'src/redux/actions/')
    },
    modules: [
      path.resolve(ROOT, 'src'),
      path.resolve(ROOT, 'node_modules')
    ],
    extensions: ['.jsx', '.js', '.mjs']
  },
  module: {
    rules: [
      {
        test: /\.(js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve('babel-loader')
        }
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true,
            modifyVars: getLessVariables(
                path.resolve(ROOT, 'src/assets/less/_variables.less')
            )
          }
        }]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [{
          loader: 'url-loader',
          options: {
            name: 'static/img/[name]-[hash:5].[ext]',
            limit: 8192
          }
        }]
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)(#.+)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: 'static/fonts/[name].[ext]',
            limit: 8192
          }
        }]
      },
      {
        loader: 'webpack-ant-icon-loader',
        enforce: 'pre',
        include: [
          require.resolve('@ant-design/icons/lib/dist')
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(ROOT, './template.ejs'),
      filename: 'index.html',
      chunks: isProdMode ? ['runtime.app', 'vendors', 'app'] : ['app'],
      name: 'app',
      title: 'AELF Block Explorer'
    }),
    new webpack.ProvidePlugin({
      React: 'react'
    }),
    new MomentLocalesPlugin({
      localesToKeep: ['en-ca', 'zh-cn'],
    }),
    new CopyWebpackPlugin(copies),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.LOCALE': JSON.stringify(process.env.LOCALE || 'zh')
    })
  ]
};

module.exports = baseConfig;
