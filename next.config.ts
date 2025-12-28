import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'family-storage.storage.yandexcloud.net',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
