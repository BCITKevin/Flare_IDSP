// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**", // 모든 경로 허용
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**", // 모든 경로 허용
      },
      {
        protocol: "https",
        hostname: "maps.openweathermap.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tile.openweathermap.org",
        pathname: "/**",
      },
      // 필요한 다른 도메인이 있다면 추가
    ],
    domains: ["www.bing.com"], // 허용할 도메인 추가
  },
};



module.exports = nextConfig;
