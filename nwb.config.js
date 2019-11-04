const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const { getLessVariables } = require('./build/utils');

const ROOT = path.resolve(__dirname);

module.exports = {
  type: 'react-app',
  babel: {
    cherryPick: 'lodash',
    plugins: [
      [
        'import',
        {
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: true
        }
      ]
    ]
  },
  webpack: {
    rules: {
      less: {
        javascriptEnabled: true,
        globalVars: getLessVariables(
          path.resolve(ROOT, 'src/assets/less/_variables.less')
        )
      }
    },
    aliases: {
      '@config': path.resolve('config'),
      '@src': path.resolve('src'),
      '@pages': path.resolve('src/pages'),
      '@components': path.resolve('src/components'),
      '@utils': path.resolve('src/utils'),
      '@store': path.resolve('src/store'),
      '@api': path.resolve('src/api'),
      '@actions': path.resolve('src/redux/actions/')
    },
    extra: {
      optimization: {
        minimizer: [
          new TerserPlugin({
            cache: true,
            parallel: true,
            sourceMap: false, // Must be set to true if using source-maps in production
            terserOptions: {
              compress: {
                drop_debugger: true,
                drop_console: true
              }
            }
          })
        ]
      }
    }
  },
  devServer: {
    disableHostCheck: true,
    proxy: {
      '/api': {
        // target: 'http://localhost:7101',
        // target: 'http://192.168.199.109:7101',
        target: 'http://127.0.0.1:7250',
        changeOrigin: true,
        secure: false
      },
      '/chain': {
        // target: 'http://34.212.171.27:8000',
        target: 'http://127.0.0.1:7250',
        changeOrigin: true,
        secure: false
      },
      '/market': {
        target: 'https://api.huobi.pro',
        changeOrigin: true,
        secure: false
      },
      '/socket': {
        target: 'ws://127.0.0.1:7101',
        changeOrigin: true,
        ws: true,
        secure: false
      }
    }
  }
};
