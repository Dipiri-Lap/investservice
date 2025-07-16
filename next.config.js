/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // 정적 export 설정 (클라이언트에서 직접 preGeneratedAnalysis 사용)
  output: 'export',
  
  // 이미지 최적화 비활성화 (사이즈 절약)
  images: {
    unoptimized: true
  },
  
  // 웹팩 캐시 비활성화
  webpack: (config) => {
    config.cache = false
    return config
  },
  
  // 트레일링 슬래시 설정
  trailingSlash: true
}

module.exports = nextConfig 