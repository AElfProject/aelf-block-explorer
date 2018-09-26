const path = require('path');

module.exports = {
  type: 'react-app',
  babel: {
    cherryPick: 'lodash',
    plugins: [
      ['import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true
      }]
    ]
  },
  webpack: {
    rules: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://explore.aelf.io:7101',
        changeOrigin: true,
        secure: false
      },
      '/chain': {
        target: 'http://explore.aelf.io:8100',
        changeOrigin: true,
        secure: false
      },
      '/trade': {
        target: 'https://api.hadax.com/market',
        changeOrigin: true,
        secure: false
      }
    }
  }
}