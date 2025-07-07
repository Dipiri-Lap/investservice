'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, BarChart3, Target, TrendingUp, Shield, Users, Award } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const [isHovered, setIsHovered] = useState(false)

  const features = [
    {
      icon: BarChart3,
      title: '정확한 투자 성향 분석',
      description: '25문항의 과학적 설문을 통해 당신의 투자 성향을 정확히 분석합니다.',
      color: 'text-blue-600'
    },
    {
      icon: Target,
      title: '개인별 맞춤 전략',
      description: '투자 성향 분석 결과를 바탕으로 개인에게 최적화된 투자 전략을 제시합니다.',
      color: 'text-green-600'
    },
    {
      icon: TrendingUp,
      title: 'AI 기반 추천',
      description: '최신 AI 기술을 활용하여 시장 상황을 고려한 투자 전략을 제공합니다.',
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">SmartInvest</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">서비스 소개</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">이용 방법</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">문의하기</a>
            </nav>
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              당신만의 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">스마트한</span> 투자 전략
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              25문항 설문을 통해 투자 성향을 분석하고, AI가 추천하는 맞춤형 포트폴리오로 성공적인 투자를 시작하세요.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link 
              href="/survey"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              투자 성향 분석 시작하기
              <ChevronRight className={`ml-2 w-5 h-5 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
            </Link>
          </motion.div>


        </div>
      </section>

      {/* 특징 섹션 */}
      <section id="features" className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              왜 SmartInvest를 선택해야 할까요?
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              과학적 분석과 AI 기술을 결합한 차별화된 투자 솔루션을 제공합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 이용 방법 섹션 */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              간단한 3단계로 시작하세요
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              복잡한 투자 분석을 간단하게, 누구나 쉽게 이용할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-4">설문 참여</h4>
              <p className="text-gray-600">25문항의 투자 성향 설문에 솔직하게 답변해 주세요.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-4">AI 분석</h4>
              <p className="text-gray-600">AI가 당신의 답변을 분석하여 투자 성향을 정확히 진단합니다.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-4">포트폴리오 추천</h4>
              <p className="text-gray-600">맞춤형 포트폴리오와 투자 전략을 제공받으세요.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              지금 시작해서 스마트한 투자를 경험해보세요
            </h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              무료로 투자 성향을 분석하고 전문가 수준의 포트폴리오 추천을 받아보세요.
            </p>
            <Link 
              href="/survey"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              무료로 시작하기
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-xl font-bold">SmartInvest</h4>
          </div>
          <p className="text-gray-400 mb-4">
            스마트한 투자 분석 플랫폼
          </p>
          <div className="text-sm text-gray-500">
            © 2024 SmartInvest. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
} 