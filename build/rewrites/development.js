module.exports = [
  // {
  //   source: '/api/:path*',
  //   destination: 'http://192.168.67.187:8068/api/:path*',
  // },
  {
    source: '/cms/:path*',
    // has: [
    //   {
    //     type: 'host',
    //     value: 'explorer-test.aelf.io',
    //   },
    // ],
    destination: 'https://explorer-test.aelf.io/cms/:path*',
  },
  {
    source: '/api/:path*',
    destination: 'https://explorer-test.aelf.io/api/:path*',
  },
  {
    source: '/api/blockChain',
    destination: 'https://explorer-test.aelf.io/chain/api/blockChain',
  },
  {
    source: '/chain/:path*',
    destination: 'https://explorer-test.aelf.io/chain/:path*',
  },
  {
    source: '/socket',
    destination: 'https://explorer-test.aelf.io/socket',
  },
];
