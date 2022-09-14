module.exports = [
  // {
  //   source: '/api/:path*',
  //   destination: 'http://192.168.67.187:8068/api/:path*',
  // },
  {
    source: '/api/:path*',
    destination: 'https://explorer-test.aelf.io/api/:path*',
  },
  {
    source: '/api/blockChain',
    destination: 'https://explorer-test.aelf.io/chain/api/blockChain',
  },
  {
    source: '/chain',
    destination: 'https://explorer-test.aelf.io/chain',
  },
];
