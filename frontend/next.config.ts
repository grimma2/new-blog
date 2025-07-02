import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // Статический экспорт
  trailingSlash: true,
  images: {
    unoptimized: true  // Отключаем оптимизацию изображений для статики
  }
};

export default nextConfig;
