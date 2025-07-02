import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Убираем output: 'export' для серверного режима
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  }
};

export default nextConfig;
