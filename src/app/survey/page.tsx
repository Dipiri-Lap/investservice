'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, BarChart3, CheckCircle } from 'lucide-react'
import { surveyQuestions, calculateInvestmentProfile } from '@/data/surveyQuestions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SurveyPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>(new Array(25).fill(0))
  const [isCompleted, setIsCompleted] = useState(false)
  const router = useRouter()

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = score
    setAnswers(newAnswers)

    // 마지막 문항이 아니면 다음 문항으로 자동 이동
    if (currentQuestion < surveyQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
      }, 500)
    } else {
      // 마지막 문항이면 완료 처리
      setIsCompleted(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < surveyQuestions.length - 1 && answers[currentQuestion] !== 0) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleComplete = () => {
    // 답변 결과를 localStorage에 저장
    const profile = calculateInvestmentProfile(answers)
    localStorage.setItem('surveyAnswers', JSON.stringify(answers))
    localStorage.setItem('investmentProfile', JSON.stringify(profile))
    
    // 결과 페이지로 이동
    router.push('/results')
  }

  const progress = ((currentQuestion + 1) / surveyQuestions.length) * 100
  const currentQuestionData = surveyQuestions[currentQuestion]

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-8 h-8 text-green-600" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            설문 완료!
          </h2>
          
          <p className="text-gray-600 mb-8">
            모든 질문에 답변해주셔서 감사합니다. 
            이제 당신의 투자 성향을 분석해보겠습니다.
          </p>
          
          <button
            onClick={handleComplete}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            결과 확인하기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">SmartInvest</h1>
            </Link>
            
            <div className="text-sm text-gray-600">
              {currentQuestion + 1} / {surveyQuestions.length}
            </div>
          </div>
        </div>
      </header>

      {/* 진행률 바 */}
      <div className="bg-white/50 p-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">진행률</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* 설문 내용 */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              {/* 질문 번호 및 카테고리 */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                    Q{currentQuestion + 1}
                  </span>
                  <span className="text-sm text-gray-500">
                    {currentQuestionData.category.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* 질문 */}
              <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
                {currentQuestionData.question}
              </h2>

              {/* 답변 옵션 */}
              <div className="space-y-3">
                {currentQuestionData.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(option.score)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 hover:border-blue-300 hover:bg-blue-50 ${
                      answers[currentQuestion] === option.score
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQuestion] === option.score
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {answers[currentQuestion] === option.score && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-gray-700">{option.text}</span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* 네비게이션 버튼 */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    currentQuestion === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>이전</span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentQuestion === surveyQuestions.length - 1 || answers[currentQuestion] === 0}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    currentQuestion === surveyQuestions.length - 1 || answers[currentQuestion] === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  }`}
                >
                  <span>다음</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
} 