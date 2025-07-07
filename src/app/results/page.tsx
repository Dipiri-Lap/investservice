'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Shield, Target, AlertCircle, Download, ArrowLeft } from 'lucide-react'
import { InvestmentProfile } from '@/data/surveyQuestions'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// 숫자 카운팅 애니메이션 컴포넌트
const AnimatedNumber = ({ value, suffix = '', duration = 2000 }: { value: number; suffix?: string; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const currentValue = Math.floor(progress * value);
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{displayValue}{suffix}</span>;
};

// 원형 프로그레스 바 컴포넌트
const CircularProgress = ({ value, maxValue = 10, color = '#3B82F6', size = 120 }: { 
  value: number; 
  maxValue?: number; 
  color?: string; 
  size?: number; 
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedValue / maxValue) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 500);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>
          <AnimatedNumber value={value} />
        </span>
      </div>
    </div>
  );
};

export default function ResultsPage() {
  const [profile, setProfile] = useState<InvestmentProfile | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [gptAnalysis, setGptAnalysis] = useState<any>(null)
  const [confidence, setConfidence] = useState<number | null>(null)
  const [keyFindings, setKeyFindings] = useState<string[]>([])
  const [isFallback, setIsFallback] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const router = useRouter()
  const contentRef = useRef<HTMLDivElement>(null)

  // PDF 생성 함수
  const generatePDF = async () => {
    if (!contentRef.current || !profile) return
    
    setIsGeneratingPDF(true)
    
    try {
      // PDF 생성
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })
      
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 20
      const contentWidth = pageWidth - (margin * 2)
      const contentHeight = pageHeight - (margin * 2)
      
                            // 전체 콘텐츠를 4페이지로 나누어 캡처
        const sections = ['pdf-header', 'pdf-summary', 'pdf-characteristics', 'pdf-analysis', 'pdf-portfolio', 'pdf-recommendations']
        
        // 1페이지: 헤더 + 요약 + 특징 통합
        const overviewSections = ['pdf-header', 'pdf-summary', 'pdf-characteristics']
        const overviewElements = overviewSections.map(id => document.getElementById(id)).filter(el => el !== null)
        
        if (overviewElements.length > 0) {
          // 임시 컨테이너로 통합
          const tempDiv = document.createElement('div')
          tempDiv.style.cssText = 'position:absolute;left:-9999px;background:white;padding:20px;width:800px;'
          
          overviewElements.forEach(el => {
            const clone = el.cloneNode(true) as HTMLElement
            clone.style.marginBottom = '30px'
            tempDiv.appendChild(clone)
          })
          
          document.body.appendChild(tempDiv)
          
          const canvas = await html2canvas(tempDiv, {
            scale: 2,
            backgroundColor: '#ffffff',
            useCORS: true,
          })
          
          document.body.removeChild(tempDiv)
          
          const imgData = canvas.toDataURL('image/png')
          const imgRatio = canvas.width / canvas.height
          let imgWidth = contentWidth
          let imgHeight = contentWidth / imgRatio
          
          if (imgHeight > contentHeight) {
            imgHeight = contentHeight
            imgWidth = contentHeight * imgRatio
          }
          
          pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight)
        }
        
        // 2페이지: AI 분석 + 포트폴리오 전략
        const analysisEl = document.getElementById('pdf-analysis')
        if (analysisEl) {
          pdf.addPage()
          
          const canvas = await html2canvas(analysisEl, {
            scale: 1.5,
            backgroundColor: '#ffffff',
            useCORS: true,
          })
          
          const imgData = canvas.toDataURL('image/png')
          const imgRatio = canvas.width / canvas.height
          let imgWidth = contentWidth
          let imgHeight = contentWidth / imgRatio
          
          if (imgHeight > contentHeight) {
            imgHeight = contentHeight
            imgWidth = contentHeight * imgRatio
          }
          
          pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight)
        }
        
        // 3페이지: 추천 종목
        const portfolioEl = document.getElementById('pdf-portfolio')
        if (portfolioEl) {
          pdf.addPage()
          
          const canvas = await html2canvas(portfolioEl, {
            scale: 1.5,
            backgroundColor: '#ffffff',
            useCORS: true,
          })
          
          const imgData = canvas.toDataURL('image/png')
          const imgRatio = canvas.width / canvas.height
          let imgWidth = contentWidth
          let imgHeight = contentWidth / imgRatio
          
          if (imgHeight > contentHeight) {
            imgHeight = contentHeight
            imgWidth = contentHeight * imgRatio
          }
          
          pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight)
        }
        
        // 4페이지: 자산 배분 및 추천사항
        const recommendEl = document.getElementById('pdf-recommendations')
        if (recommendEl) {
          pdf.addPage()
          
          const canvas = await html2canvas(recommendEl, {
            scale: 2,
            backgroundColor: '#ffffff',
            useCORS: true,
          })
          
          const imgData = canvas.toDataURL('image/png')
          const imgRatio = canvas.width / canvas.height
          let imgWidth = contentWidth
          let imgHeight = contentWidth / imgRatio
          
          if (imgHeight > contentHeight) {
            imgHeight = contentHeight
            imgWidth = contentHeight * imgRatio
          }
          
          pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight)
        }

        // 5페이지: 1억원 포트폴리오 예시
        const portfolioExampleEl = document.getElementById('pdf-portfolio-example')
        if (portfolioExampleEl) {
          pdf.addPage()
          
          const canvas = await html2canvas(portfolioExampleEl, {
            scale: 1.5,
            backgroundColor: '#ffffff',
            useCORS: true,
          })
          
          const imgData = canvas.toDataURL('image/png')
          const imgRatio = canvas.width / canvas.height
          let imgWidth = contentWidth
          let imgHeight = contentWidth / imgRatio
          
          if (imgHeight > contentHeight) {
            imgHeight = contentHeight
            imgWidth = contentHeight * imgRatio
          }
          
          pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight)
        }
      
              // 파일명 생성
        const fileName = `투자성향분석_${profile.type}_${new Date().toISOString().split('T')[0]}.pdf`
      
      // PDF 저장
      pdf.save(fileName)
      
    } catch (error) {
      console.error('PDF 생성 오류:', error)
      alert('PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === 'undefined') return
    
    const analyzeResults = async () => {
      try {
        setIsLoading(true)
        setAnalysisError(null)
        
        // localStorage에서 설문 답변 가져오기
        let savedAnswers
        try {
          savedAnswers = localStorage.getItem('surveyAnswers')
        } catch (error) {
          console.error('localStorage 접근 오류:', error)
          router.push('/survey')
          return
        }
        
        if (!savedAnswers) {
          router.push('/survey')
          return
        }
        
        let parsedAnswers
        try {
          parsedAnswers = JSON.parse(savedAnswers)
          setAnswers(parsedAnswers)
        } catch (error) {
          console.error('JSON 파싱 오류:', error)
          router.push('/survey')
          return
        }
        
        // GPT API를 통해 분석 요청
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            answers: parsedAnswers
          })
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('API 응답 오류:', response.status, errorText)
          throw new Error(`분석 요청 실패: ${response.status}`)
        }
        
        const result = await response.json()
        
        if (result.success) {
          setProfile(result.profile)
          setGptAnalysis(result.profile.gptAnalysis)
          setConfidence(result.profile.confidence)
          setKeyFindings(result.profile.keyFindings || [])
          setIsFallback(result.fallback || false)
        } else {
          throw new Error(result.error || '분석 중 오류가 발생했습니다.')
        }
        
      } catch (error) {
        console.error('분석 오류:', error)
        setAnalysisError(`분석 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '다시 시도해주세요.'}`)
      } finally {
        setIsLoading(false)
      }
    }

    analyzeResults()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">AI가 투자 성향을 분석하고 있습니다...</p>
          <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요 (30초 이내)</p>
        </div>
      </div>
    )
  }

  if (analysisError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            분석 오류
          </h2>
          <p className="text-gray-600 mb-8">
            {analysisError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 mr-4"
          >
            다시 시도하기
          </button>
          <Link
            href="/survey"
            className="w-full bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all duration-300 mt-4 inline-block"
          >
            설문 다시하기
          </Link>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            결과를 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 mb-8">
            먼저 투자 성향 설문을 완료해주세요.
          </p>
          <Link
            href="/survey"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 inline-block"
          >
            설문 시작하기
          </Link>
        </div>
      </div>
    )
  }

  // 안전한 기본값 설정
  const safeGptAnalysis = {
    ...gptAnalysis,
    recommendedStocks: gptAnalysis?.recommendedStocks || [],
    recommendedCrypto: gptAnalysis?.recommendedCrypto || [],
    portfolioExample: {
      breakdown: gptAnalysis?.portfolioExample?.breakdown || [],
      notes: gptAnalysis?.portfolioExample?.notes || [],
      ...gptAnalysis?.portfolioExample
    },
    actionGuide: {
      monthly: { actions: gptAnalysis?.actionGuide?.monthly?.actions || [] },
      quarterly: { actions: gptAnalysis?.actionGuide?.quarterly?.actions || [] },
      semiannual: { actions: gptAnalysis?.actionGuide?.semiannual?.actions || [] },
      annual: { actions: gptAnalysis?.actionGuide?.annual?.actions || [] },
      ...gptAnalysis?.actionGuide
    }
  }



  const getRiskLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'text-red-700 bg-red-100'
      case 2: return 'text-orange-700 bg-orange-100'
      case 3: return 'text-yellow-700 bg-yellow-100'
      case 4: return 'text-amber-700 bg-amber-100'
      case 5: return 'text-green-700 bg-green-100'
      case 6: return 'text-cyan-700 bg-cyan-100'
      case 7: return 'text-blue-700 bg-blue-100'
      case 8: return 'text-purple-700 bg-purple-100'
      case 9: return 'text-fuchsia-700 bg-fuchsia-100'
      case 10: return 'text-pink-700 bg-pink-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
      {/* 헤더 */}
      <header className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white py-12 overflow-hidden print:hidden">
        {/* 배경 패턴 */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCA0LTRzNCwyIDQsNHYyYzAtMi0yLTQtNC00cy00LDItNCw0djJ6bS0yIDBoMnYtMmMwLTItMi00LTQtNHMtNCwyLTQsNHYyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center space-x-2 hover:text-blue-200 transition-all duration-300 hover:scale-105">
              <ArrowLeft className="w-5 h-5" />
              <span>홈으로 돌아가기</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
              >
                <BarChart3 className="w-6 h-6" />
              </motion.div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                SmartInvest
              </h1>
            </div>
          </div>
          
          {/* 히어로 섹션 */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-block"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                투자 성향 분석 완료
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto rounded-full"></div>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto" ref={contentRef}>
          {/* PDF 전용 헤더 */}
          <div id="pdf-header" className="hidden print:block mb-8 text-center border-b pb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">SmartInvest 투자 성향 분석 결과</h1>
            <p className="text-gray-600">분석일: {new Date().toLocaleDateString('ko-KR')}</p>
          </div>
          
          {/* PDF 1장: 요약 섹션 */}
          <div id="pdf-summary" className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            {/* 결과 헤더 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center space-x-2 mb-6"
            >
              <div className={`px-6 py-3 rounded-2xl text-sm font-bold shadow-lg ${getRiskLevelColor(profile.riskLevel)}`}>
                위험 수준: <AnimatedNumber value={profile.riskLevel} suffix="/10" />
              </div>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight"
            >
              당신의 투자 성향은
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
                {profile.name}
              </span>
              입니다
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              {profile.description}
            </motion.p>
          </motion.div>

            {/* 주요 지표 카드 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
            >
            {/* 기대 수익률 카드 */}
            <motion.div 
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">기대 수익률</h3>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-blue-600 mb-2">
                    <AnimatedNumber value={parseInt(profile.expectedReturn)} suffix="%" />
                  </p>
                  <p className="text-sm text-gray-600 font-medium">연평균 기대 수익률</p>
                </div>
              </div>
            </motion.div>

            {/* 위험 수준 카드 */}
            <motion.div 
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">위험 수준</h3>
                  </div>
                </div>
                <div className="text-center">
                  <div className="mb-4">
                    <CircularProgress 
                      value={profile.riskLevel} 
                      maxValue={10} 
                      color="#10B981" 
                      size={100}
                    />
                  </div>
                  <p className="text-sm text-gray-600 font-medium">투자 위험도</p>
                </div>
              </div>
            </motion.div>

            {/* 투자 성향 카드 */}
            <motion.div 
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">투자 성향</h3>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600 mb-2">{profile.name}</p>
                  <p className="text-sm text-gray-600 font-medium">분석 결과</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

            {/* 투자 성향 특징 */}
            <motion.div
              id="pdf-characteristics"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gray-50 rounded-2xl p-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">투자 성향 특징</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(profile.characteristics || []).map((characteristic, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      className="flex items-start space-x-4 p-4 rounded-xl bg-white/50 hover:bg-white/80 transition-all duration-300 hover:shadow-md"
                    >
                      <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 font-medium">{characteristic}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* AI 분석 결과 - 기본 분석 */}
          {safeGptAnalysis && (
            <motion.div
              id="pdf-analysis"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 rounded-3xl shadow-2xl p-8 mb-12 relative overflow-hidden"
            >
              {/* 배경 장식 */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-200/20 to-indigo-200/20 rounded-full translate-y-24 -translate-x-24"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">분석 결과</h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    {confidence && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-medium shadow-lg"
                      >
                        신뢰도: <AnimatedNumber value={confidence} suffix="%" />
                      </motion.div>
                    )}
                    {isFallback && (
                      <div className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full text-sm font-medium shadow-lg">
                        기본 분석
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* 투자 성향 상세 설명 */}
              <div className="bg-white rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">투자 성향 상세 설명</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{safeGptAnalysis.description}</p>
              </div>
              
              {/* 장단점 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    투자 강점
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{safeGptAnalysis.advantages}</p>
                </div>
                
                <div className="bg-white rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    주의할 점
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{safeGptAnalysis.disadvantages}</p>
                </div>
              </div>
              
              {/* 권장 개선 방향 */}
              <div className="bg-white rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  권장 개선 방향
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{safeGptAnalysis.improvements}</p>
              </div>
              
              {/* 추천 포트폴리오 */}
              {safeGptAnalysis.portfolio && (
                <div className="bg-white rounded-2xl p-8 mb-6 shadow-lg">
                  <h3 className="font-bold text-gray-800 mb-6 text-xl">추천 포트폴리오</h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="text-center"
                    >
                      <div className="mb-4">
                        <CircularProgress 
                          value={safeGptAnalysis.portfolio.stocks} 
                          maxValue={100} 
                          color="#3B82F6" 
                          size={80}
                        />
                      </div>
                      <div className="text-sm font-medium text-gray-700">주식</div>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-center"
                    >
                      <div className="mb-4">
                        <CircularProgress 
                          value={safeGptAnalysis.portfolio.bonds} 
                          maxValue={100} 
                          color="#10B981" 
                          size={80}
                        />
                      </div>
                      <div className="text-sm font-medium text-gray-700">채권</div>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="text-center"
                    >
                      <div className="mb-4">
                        <CircularProgress 
                          value={safeGptAnalysis.portfolio.cash} 
                          maxValue={100} 
                          color="#F59E0B" 
                          size={80}
                        />
                      </div>
                      <div className="text-sm font-medium text-gray-700">현금</div>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="text-center"
                    >
                      <div className="mb-4">
                        <CircularProgress 
                          value={safeGptAnalysis.portfolio.reits} 
                          maxValue={100} 
                          color="#8B5CF6" 
                          size={80}
                        />
                      </div>
                      <div className="text-sm font-medium text-gray-700">부동산</div>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="text-center"
                    >
                      <div className="mb-4">
                        <CircularProgress 
                          value={safeGptAnalysis.portfolio.crypto} 
                          maxValue={100} 
                          color="#EF4444" 
                          size={80}
                        />
                      </div>
                      <div className="text-sm font-medium text-gray-700">암호화폐</div>
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4"
                  >
                    <p className="text-gray-700 text-sm leading-relaxed font-medium">{safeGptAnalysis.portfolio.reason}</p>
                  </motion.div>
                </div>
              )}
              
              {/* 주식 배분 전략 */}
              {safeGptAnalysis.portfolio?.stockAllocation && (
                <div className="bg-white rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-4">주식 투자 전략</h3>
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm mb-4">{safeGptAnalysis.portfolio.stockAllocation.reason}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{safeGptAnalysis.portfolio.stockAllocation.dividendStocks}%</div>
                        <div className="text-sm text-gray-600">배당주</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{safeGptAnalysis.portfolio.stockAllocation.growthStocks}%</div>
                        <div className="text-sm text-gray-600">성장주</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{safeGptAnalysis.portfolio.stockAllocation.themeStocks}%</div>
                        <div className="text-sm text-gray-600">테마주</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{safeGptAnalysis.portfolio.stockAllocation.valueStocks}%</div>
                        <div className="text-sm text-gray-600">가치주</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* 추천 종목 */}
          {safeGptAnalysis && (
            <motion.div
              id="pdf-portfolio"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-3xl shadow-2xl p-8 mb-12 relative overflow-hidden"
            >
              {/* 배경 장식 */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full -translate-y-32 -translate-x-32"></div>
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tr from-pink-200/20 to-rose-200/20 rounded-full translate-y-24 translate-x-24"></div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full"></div>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">추천 종목</h2>
                </div>
              </div>

              {/* 추천 주식 종목 */}
              {safeGptAnalysis.recommendedStocks && (
                <div className="bg-white rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-4">유형별 추천 주식</h3>
                  <div className="space-y-8">
                    {/* 배당주 */}
                    {safeGptAnalysis.recommendedStocks.dividend && safeGptAnalysis.recommendedStocks.dividend.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          배당주 ({safeGptAnalysis.portfolio?.stockAllocation?.dividendStocks || 0}%)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* 한국 배당주 */}
                          {safeGptAnalysis.recommendedStocks.dividend.filter((stock: any) => stock.country === '한국').length > 0 && (
                            <div className="border rounded-lg p-4">
                              <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                                <span className="w-6 h-4 bg-red-500 rounded-sm mr-2"></span>
                                한국
                              </h5>
                              <div className="space-y-3">
                                {safeGptAnalysis.recommendedStocks.dividend.filter((stock: any) => stock.country === '한국').map((stock: any, index: number) => (
                                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <h6 className="font-medium text-gray-800">{stock.name}</h6>
                                      <span className="text-sm text-gray-500">({stock.ticker})</span>
                                    </div>
                                    <p className="text-gray-600 text-sm">{stock.reason}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* 미국 배당주 */}
                          {safeGptAnalysis.recommendedStocks.dividend.filter((stock: any) => stock.country === '미국').length > 0 && (
                            <div className="border rounded-lg p-4">
                              <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                                <span className="w-6 h-4 bg-blue-600 rounded-sm mr-2"></span>
                                미국
                              </h5>
                              <div className="space-y-3">
                                {safeGptAnalysis.recommendedStocks.dividend.filter((stock: any) => stock.country === '미국').map((stock: any, index: number) => (
                                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <h6 className="font-medium text-gray-800">{stock.name}</h6>
                                      <span className="text-sm text-gray-500">({stock.ticker})</span>
                                    </div>
                                    <p className="text-gray-600 text-sm">{stock.reason}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* 성장주 */}
                    {safeGptAnalysis.recommendedStocks.growth && safeGptAnalysis.recommendedStocks.growth.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          성장주 ({safeGptAnalysis.portfolio?.stockAllocation?.growthStocks || 0}%)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* 한국 성장주 */}
                          {safeGptAnalysis.recommendedStocks.growth.filter((stock: any) => stock.country === '한국').length > 0 && (
                            <div className="border rounded-lg p-4">
                              <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                                <span className="w-6 h-4 bg-red-500 rounded-sm mr-2"></span>
                                한국
                              </h5>
                              <div className="space-y-3">
                                {safeGptAnalysis.recommendedStocks.growth.filter((stock: any) => stock.country === '한국').map((stock: any, index: number) => (
                                  <div key={index} className="border-l-4 border-green-500 pl-4">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <h6 className="font-medium text-gray-800">{stock.name}</h6>
                                      <span className="text-sm text-gray-500">({stock.ticker})</span>
                                    </div>
                                    <p className="text-gray-600 text-sm">{stock.reason}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* 미국 성장주 */}
                          {safeGptAnalysis.recommendedStocks.growth.filter((stock: any) => stock.country === '미국').length > 0 && (
                            <div className="border rounded-lg p-4">
                              <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                                <span className="w-6 h-4 bg-blue-600 rounded-sm mr-2"></span>
                                미국
                              </h5>
                              <div className="space-y-3">
                                {safeGptAnalysis.recommendedStocks.growth.filter((stock: any) => stock.country === '미국').map((stock: any, index: number) => (
                                  <div key={index} className="border-l-4 border-green-500 pl-4">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <h6 className="font-medium text-gray-800">{stock.name}</h6>
                                      <span className="text-sm text-gray-500">({stock.ticker})</span>
                                    </div>
                                    <p className="text-gray-600 text-sm">{stock.reason}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 테마주 */}
                    {safeGptAnalysis.recommendedStocks.theme && safeGptAnalysis.recommendedStocks.theme.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                          테마주 ({safeGptAnalysis.portfolio?.stockAllocation?.themeStocks || 0}%)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* 한국 테마주 */}
                          {safeGptAnalysis.recommendedStocks.theme.filter((stock: any) => stock.country === '한국').length > 0 && (
                            <div className="border rounded-lg p-4">
                              <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                                <span className="w-6 h-4 bg-red-500 rounded-sm mr-2"></span>
                                한국
                              </h5>
                              <div className="space-y-3">
                                {safeGptAnalysis.recommendedStocks.theme.filter((stock: any) => stock.country === '한국').map((stock: any, index: number) => (
                                  <div key={index} className="border-l-4 border-purple-500 pl-4">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <h6 className="font-medium text-gray-800">{stock.name}</h6>
                                      <span className="text-sm text-gray-500">({stock.ticker})</span>
                                    </div>
                                    <p className="text-gray-600 text-sm">{stock.reason}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* 미국 테마주 */}
                          {safeGptAnalysis.recommendedStocks.theme.filter((stock: any) => stock.country === '미국').length > 0 && (
                            <div className="border rounded-lg p-4">
                              <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                                <span className="w-6 h-4 bg-blue-600 rounded-sm mr-2"></span>
                                미국
                              </h5>
                              <div className="space-y-3">
                                {safeGptAnalysis.recommendedStocks.theme.filter((stock: any) => stock.country === '미국').map((stock: any, index: number) => (
                                  <div key={index} className="border-l-4 border-purple-500 pl-4">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <h6 className="font-medium text-gray-800">{stock.name}</h6>
                                      <span className="text-sm text-gray-500">({stock.ticker})</span>
                                    </div>
                                    <p className="text-gray-600 text-sm">{stock.reason}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 가치주 */}
                    {safeGptAnalysis.recommendedStocks.value && safeGptAnalysis.recommendedStocks.value.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                          가치주 ({safeGptAnalysis.portfolio?.stockAllocation?.valueStocks || 0}%)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* 한국 가치주 */}
                          {safeGptAnalysis.recommendedStocks.value.filter((stock: any) => stock.country === '한국').length > 0 && (
                            <div className="border rounded-lg p-4">
                              <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                                <span className="w-6 h-4 bg-red-500 rounded-sm mr-2"></span>
                                한국
                              </h5>
                              <div className="space-y-3">
                                {safeGptAnalysis.recommendedStocks.value.filter((stock: any) => stock.country === '한국').map((stock: any, index: number) => (
                                  <div key={index} className="border-l-4 border-orange-500 pl-4">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <h6 className="font-medium text-gray-800">{stock.name}</h6>
                                      <span className="text-sm text-gray-500">({stock.ticker})</span>
                                    </div>
                                    <p className="text-gray-600 text-sm">{stock.reason}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* 미국 가치주 */}
                          {safeGptAnalysis.recommendedStocks.value.filter((stock: any) => stock.country === '미국').length > 0 && (
                            <div className="border rounded-lg p-4">
                              <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                                <span className="w-6 h-4 bg-blue-600 rounded-sm mr-2"></span>
                                미국
                              </h5>
                              <div className="space-y-3">
                                {safeGptAnalysis.recommendedStocks.value.filter((stock: any) => stock.country === '미국').map((stock: any, index: number) => (
                                  <div key={index} className="border-l-4 border-orange-500 pl-4">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <h6 className="font-medium text-gray-800">{stock.name}</h6>
                                      <span className="text-sm text-gray-500">({stock.ticker})</span>
                                    </div>
                                    <p className="text-gray-600 text-sm">{stock.reason}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* 추천 암호화폐 */}
              {safeGptAnalysis.recommendedCrypto && (
                <div className="bg-white rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-4">추천 암호화폐</h3>
                  <div className="space-y-3">
                                         {safeGptAnalysis.recommendedCrypto.map((crypto: any, index: number) => (
                       <div key={index} className="border-l-4 border-orange-500 pl-4">
                         <div className="flex items-center space-x-2 mb-1">
                           <h4 className="font-medium text-gray-800">{crypto.name}</h4>
                           <span className="text-sm text-gray-500">({crypto.symbol})</span>
                         </div>
                         <p className="text-gray-600 text-sm">{crypto.reason}</p>
                       </div>
                     ))}
                  </div>
                </div>
              )}
              

            </motion.div>
          )}

          {/* 1억원 포트폴리오 예시 */}
          <div id="pdf-recommendations" className="bg-white p-8 rounded-2xl shadow-lg mb-12">




            {/* 1억원 포트폴리오 예시 */}
            {safeGptAnalysis && safeGptAnalysis.portfolioExample && (
              <motion.div
                id="pdf-portfolio-example"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    1억원 기준 포트폴리오 예시
                  </h2>
                </div>
                
                                 <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                   <div className="overflow-x-auto">
                     <table className="w-full">
                       <thead className="bg-gray-50">
                         <tr>
                           <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">자산군</th>
                           <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800">비중 (%)</th>
                           <th className="px-4 py-3 text-center text-sm font-semibold text-gray-800">금액 (원)</th>
                           <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">구체적 투자 종목 및 수량(예시)</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-200">
                         {safeGptAnalysis.portfolioExample.breakdown.map((item: any, index: number) => (
                           <tr key={index} className="hover:bg-gray-50">
                             <td className="px-4 py-4 text-sm font-medium text-gray-800">{item.category}</td>
                             <td className="px-4 py-4 text-center text-sm text-gray-600">{item.percentage}%</td>
                             <td className="px-4 py-4 text-center text-sm text-gray-600">
                               {item.amount.toLocaleString()}
                             </td>
                             <td className="px-4 py-4 text-sm text-gray-600">
                               <div className="space-y-1">
                                 {item.investments.map((investment: any, investIndex: number) => (
                                   <div key={investIndex} className="flex items-center space-x-2">
                                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                     <span>
                                       {investment.name} {investment.shares !== '-' ? `${investment.shares}주` : ''} 
                                       (약 {investment.estimatedValue})
                                     </span>
                                   </div>
                                 ))}
                               </div>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 </div>

                {/* 세부 설명 */}
                {safeGptAnalysis.portfolioExample.notes && safeGptAnalysis.portfolioExample.notes.length > 0 && (
                  <div className="mt-6 bg-white rounded-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <span className="w-5 h-5 bg-blue-100 rounded mr-2 flex items-center justify-center">
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      </span>
                      세부 설명
                    </h3>
                    <div className="space-y-3">
                      {safeGptAnalysis.portfolioExample.notes.map((note: string, index: number) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-600 text-sm leading-relaxed">{note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* 기간별 행동지침 */}
          {safeGptAnalysis && safeGptAnalysis.actionGuide && (
            <motion.div
              id="pdf-action-guide"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white rounded-2xl shadow-lg p-8 mb-12"
            >
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">투자 성향별 행동지침</h2>
              </div>

              {/* 투자 기간 분석 */}
              {safeGptAnalysis.actionGuide.investmentHorizon && (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">⏱</span>
                    </div>
                    <h3 className="text-xl font-bold text-indigo-800">추천 투자 기간</h3>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                        {safeGptAnalysis.actionGuide.investmentHorizon.primary}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {safeGptAnalysis.actionGuide.investmentHorizon.description}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 월별 */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">월</span>
                    </div>
                    {safeGptAnalysis.actionGuide.monthly.title}
                  </h3>
                  <div className="space-y-3">
                    {safeGptAnalysis.actionGuide.monthly.actions.map((action: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-blue-700 text-sm leading-relaxed">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 분기별 */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">분기</span>
                    </div>
                    {safeGptAnalysis.actionGuide.quarterly.title}
                  </h3>
                  <div className="space-y-3">
                    {safeGptAnalysis.actionGuide.quarterly.actions.map((action: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-green-700 text-sm leading-relaxed">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 반기별 */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">반기</span>
                    </div>
                    {safeGptAnalysis.actionGuide.semiannual.title}
                  </h3>
                  <div className="space-y-3">
                    {safeGptAnalysis.actionGuide.semiannual.actions.map((action: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-purple-700 text-sm leading-relaxed">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 년도별 */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">년</span>
                    </div>
                    {safeGptAnalysis.actionGuide.annual.title}
                  </h3>
                  <div className="space-y-3">
                    {safeGptAnalysis.actionGuide.annual.actions.map((action: string, index: number) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-orange-700 text-sm leading-relaxed">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-gray-50 rounded-xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">💡</span>
                  </div>
                  <h4 className="font-semibold text-gray-800">투자 행동지침 실행 가이드</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p><strong>월별 점검:</strong> 투자 자산 모니터링과 추가 투자금 확보 계획을 매월 첫째 주에 실행하세요.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p><strong>분기별 조정:</strong> 포트폴리오 리밸런싱과 수익 실현을 분기 말에 체계적으로 진행하세요.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p><strong>반기별 전략:</strong> 투자 전략 재검토와 세금 최적화를 6월, 12월에 집중적으로 실행하세요.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p><strong>연간 계획:</strong> 투자 목표 재설정과 장기 계획 수립을 매년 12월-1월에 진행하세요.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p><strong>감정 관리:</strong> 투자 성향에 맞는 행동지침을 따라 시장 변동성에 흔들리지 않는 투자를 유지하세요.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p><strong>기록 관리:</strong> 모든 투자 활동을 기록하고 정기적으로 성과를 분석하여 개선점을 찾아내세요.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 액션 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center print:hidden"
          >
            <button
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <Download className="w-5 h-5" />
              <span>{isGeneratingPDF ? 'PDF 생성 중...' : 'PDF로 저장하기'}</span>
            </button>
            
            <Link
              href="/survey"
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
            >
              <span>다시 분석하기</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 
