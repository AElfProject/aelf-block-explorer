/*
 * @Author: aelf-lxy
 * @Date: 2023-08-02 01:50:01
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-02 14:19:21
 * @Description: next config
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent:true
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
      {
        source: '/chain/:path*',
        destination: 'http://localhost:3001/chain/:path*',
      },
      {
        source: '/cms/:path*',
        destination: 'http://localhost:3001/cms/:path*',
      },
      {
        source: '/new-socket/:path*',
        destination: 'http://localhost:3001/new-socket/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
