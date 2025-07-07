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
        maxSize: 20000000, // 20MB로 제한
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true
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