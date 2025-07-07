/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // 이미지 최적화 비활성화 (사이즈 절약)
  images: {
    unoptimized: true
  },
  
  // 웹팩 캐시 비활성화
  webpack: (config) => {
    config.cache = false
    return config
  }
}

module.exports = nextConfig 