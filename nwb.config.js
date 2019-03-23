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
        // target: 'http://localhost:7101',
        target: 'http://127.0.0.1:7250',
        changeOrigin: true,
        secure: false
      },
      '/chain': {
        target: 'http://127.0.0.1:7250',
        changeOrigin: true,
        secure: false
      },
      '/market': {
        target: 'https://api.huobi.pro',
        changeOrigin: true,
        secure: false
      }
    }
  }
}