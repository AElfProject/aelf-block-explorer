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
    //     value: 'explorer-test-main.aelf.io',
    //   },
    // ],
    destination: 'http://10.147.20.67:8888/cms/:path*',
  },
  {
    source: '/api/:path*',
    destination: 'http://10.147.20.67:8888/api/:path*',
  },
  {
    source: '/api/blockChain',
    destination: 'http://10.147.20.67:8888/chain/api/blockChain',
  },
  {
    source: '/chain/:path*',
    destination: 'http://10.147.20.67:8888/chain/:path*',
  },
  {
    source: '/socket',
    destination: 'http://10.147.20.67:8888/socket',
  },
];
