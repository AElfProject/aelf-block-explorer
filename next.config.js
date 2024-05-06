/*
 * @Author: aelf-lxy
 * @Date: 2023-08-02 01:50:01
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-02 14:19:21
 * @Description: next config
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    // to solve the problem: https://github.com/vercel/next.js/discussions/60150
    // https://nextjs.org/docs/architecture/nextjs-compiler#styled-components
    styledComponents: {
      ssr: true,
    },
  },
  reactStrictMode: false,
  experimental: {
    proxyTimeout: 300000,
  },
  async rewrites() {
    return process.env.NODE_ENV === 'production'
      ? []
      : [
          {
            source: '/home',
            destination: '/',
            // permanent: false,
          },
          {
            source: '/api/:path*',
            destination: 'https://aelfscan.io/api/:path*',
            // permanent: false,
            // basePath: false,
          },
          {
            source: '/chain/:path*',
            destination: 'http://localhost:3001/chain/:path*',
            // permanent: false,
          },
          {
            source: '/cms/:path*',
            destination: 'http://localhost:3001/cms/:path*',
            // permanent: false,
          },
          {
            source: '/new-socket/:path*',
            destination: 'http://localhost:3001/new-socket/:path*',
            // permanent: false,
          },
          {
            source: '/Portkey_DID/:path*',
            destination: 'http://localhost:3001/Portkey_DID/:path*',
            // permanent: false,
          },
          {
            source: '/Portkey_V2_DID/:path*',
            destination: 'http://localhost:3001/Portkey_V2_DID/:path*',
            // permanent: false,
          },
          // {
          //   source: '/v1/api/:path*',
          //   destination: 'http://localhost:3001/v1/api/:path*',
          //   // permanent: false,
          // },
          // {
          //   source: '/v2/api/:path*',
          //   destination: 'http://localhost:3001/v2/api/:path*',
          //   // permanent: false,
          // },
        ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
  output: 'standalone',
};

module.exports = nextConfig;
