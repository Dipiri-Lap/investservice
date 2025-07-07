/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // 빌드 사이즈 최적화
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion']
  },
  
  // 웹팩 최적화
  webpack: (config, { isServer }) => {
    // 번들 사이즈 최적화
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxSize: 5000000, // 5MB로 제한 (더 작은 청크)
        minSize: 100000, // 100KB 이상만 분할
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
            maxSize: 2000000 // 2MB로 제한
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
            maxSize: 3000000 // 3MB로 제한
          }
        }
      }
    }
    return config
  },
  
  // 이미지 최적화 비활성화 (사이즈 절약)
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig 