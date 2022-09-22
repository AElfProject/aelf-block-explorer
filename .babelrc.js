module.exports = {
  presets: [['next/babel']],
  plugins: [
    ['import', { libraryName: 'antd', style: true }],
    [
      'import',
      {
        libraryName: 'react-use',
        libraryDirectory: 'lib',
        camel2DashComponentName: false,
      },
      'react-use',
    ],
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
  ],
};
