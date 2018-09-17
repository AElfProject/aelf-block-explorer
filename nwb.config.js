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
    aliases: {
      'react-virtualized/List': 'react-virtualized/dist/es/List',
    },
    rules: {
      less: {
        javascriptEnabled: true
      }
    }
  }
}