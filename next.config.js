// next.config.js

/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development'
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.bing.com',
        pathname: '/th/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'maps.openweathermap.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tile.openweathermap.org',
        pathname: '/**',
      }
    ],
  },
};

module.exports = withPWA({
  ...nextConfig
});