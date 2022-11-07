module.exports = [
  // main
  // {
  //   source: '/api/viewer/:path*',
  //   destination: 'http://127.0.0.1:7740/api/viewer/:path*',
  // },
  // {
  //   source: '/api/proposal/:path*',
  //   destination: 'http://127.0.0.1:7740/api/proposal/:path*',
  // },
  // {
  //   source: '/api/:path*',
  //   destination: 'http://127.0.0.1:7101/api/:path*',
  // },
  // {
  //   source: '/socket/:path*',
  //   destination: 'http://127.0.0.1:7101/socket/:path*',
  // },
  // {
  //   source: '/new-socket/:path*',
  //   destination: 'http://127.0.0.1:3710/socket/:path*',
  // },
  // {
  //   source: '/cms/:path*',
  //   destination: 'http://103.61.39.232:1338/cms/:path*',
  // },
  // {
  //   source: '/chain/:path*',
  //   destination: 'http://172.31.43.22:8000/chain/:path*',
  // },

  {
    source: '/api/:path*',
    destination: `${process.env.BUILD_ENDPOINT_HOST}/api/:path*`,
  },
  {
    source: '/api/blockChain/:path*',
    destination: `${process.env.BUILD_ENDPOINT_HOST}/chain/api/blockChain/:path*`,
  },
  {
    source: '/cms/:path*',
    destination: `${process.env.BUILD_ENDPOINT_HOST}/cms/:path*`,
  },
  {
    source: '/chain/:path*',
    destination: `${process.env.BUILD_ENDPOINT_HOST}/chain/:path*`,
  },
  {
    source: '/socket',
    destination: `${process.env.BUILD_ENDPOINT_HOST}/socket`,
  },
];
