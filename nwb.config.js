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
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:7101',
        changeOrigin: true,
        secure: false
      },
      '/chain': {
        target: 'http://127.0.0.1:8100',
        changeOrigin: true,
        secure: false
      },
    }
  }
}