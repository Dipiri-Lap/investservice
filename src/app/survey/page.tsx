'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, BarChart3, CheckCircle } from 'lucide-react'
import { 
  groupQuestions, 
  detailQuestions, 
  commonOptions, 
  determineGroup, 
  determineDetailType,
  groupMapping 
} from '@/data/surveyQuestions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SurveyPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [groupAnswers, setGroupAnswers] = useState<number[]>(new Array(9).fill(0))
  const [detailAnswers, setDetailAnswers] = useState<number[]>(new Array(16).fill(0))
  const [selectedGroup, setSelectedGroup] = useState<'stability' | 'profit' | 'aggressive' | null>(null)
  const [detailQuestionsForGroup, setDetailQuestionsForGroup] = useState<any[]>([])
  const [isCompleted, setIsCompleted] = useState(false)
  const router = useRouter()

  // 현재 성향군의 세부 질문들 준비
  useEffect(() => {
    if (selectedGroup) {
      const groupTypes = groupMapping[selectedGroup];
      const questionsForThisGroup = detailQuestions.filter(q => 
        groupTypes.includes(q.type)
      );
      setDetailQuestionsForGroup(questionsForThisGroup);
    }
  }, [selectedGroup]);

  // 전체 질문 배열 (1-9: 성향군 질문, 10-25: 세부 질문)
  const getAllQuestions = () => {
    const allQuestions = [...groupQuestions];
    if (detailQuestionsForGroup.length > 0) {
      allQuestions.push(...detailQuestionsForGroup);
    }
    return allQuestions;
  };

  const allQuestions = getAllQuestions();
  const totalQuestions = 25; // 9 + 16

  const handleAnswer = (score: number) => {
    if (currentQuestion < 9) {
      // 1단계: 성향군 결정 질문 (1-9번)
      const newGroupAnswers = [...groupAnswers];
      newGroupAnswers[currentQuestion] = score;
      setGroupAnswers(newGroupAnswers);

      // 9번째 질문 완료 시 성향군 결정
      if (currentQuestion === 8) {
        const determinedGroup = determineGroup(newGroupAnswers);
        setSelectedGroup(determinedGroup);
      }
    } else {
      // 2단계: 세부 성향 결정 질문 (10-25번)
      const detailIndex = currentQuestion - 9;
      const newDetailAnswers = [...detailAnswers];
      newDetailAnswers[detailIndex] = score;
      setDetailAnswers(newDetailAnswers);
    }

    // 마지막 문항이 아니면 다음 문항으로 자동 이동
    if (currentQuestion < totalQuestions - 1) {
      // 9번째 질문 후에는 잠시 기다려서 성향군 결정 후 이동
      const delay = currentQuestion === 8 ? 1000 : 500;
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, delay);
    } else {
      // 마지막 문항이면 완료 처리
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    const currentAnswer = currentQuestion < 9 
      ? groupAnswers[currentQuestion] 
      : detailAnswers[currentQuestion - 9];
      
    if (currentQuestion < totalQuestions - 1 && currentAnswer !== 0) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleComplete = () => {
    if (!selectedGroup) return;

    // 세부 성향 결정
    const profile = determineDetailType(selectedGroup, detailAnswers);
    
    // 결과를 localStorage에 저장
    const surveyData = {
      groupAnswers,
      detailAnswers,
      selectedGroup,
      profile
    };
    
    localStorage.setItem('surveyData', JSON.stringify(surveyData));
    localStorage.setItem('investmentProfile', JSON.stringify(profile));
    
    // 결과 페이지로 이동
    router.push('/results');
  };

  const getCurrentAnswer = () => {
    if (currentQuestion < 9) {
      return groupAnswers[currentQuestion];
    } else {
      return detailAnswers[currentQuestion - 9];
    }
  };

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / totalQuestions) * 100;
  };

  const getCurrentQuestionData = () => {
    if (currentQuestion < 9) {
      return groupQuestions[currentQuestion];
    } else if (detailQuestionsForGroup.length > 0) {
      const detailIndex = currentQuestion - 9;
      return detailQuestionsForGroup[detailIndex];
    }
    return null;
  };

  const currentQuestionData = getCurrentQuestionData();

  // 성향군이 결정되지 않았고 10번째 질문인 경우 로딩 표시
  if (currentQuestion >= 9 && !selectedGroup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">성향군을 분석 중입니다...</p>
        </div>
      </div>
    );
  }

  // 세부 질문이 준비되지 않은 경우 로딩
  if (currentQuestion >= 9 && detailQuestionsForGroup.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">세부 질문을 준비 중입니다...</p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            설문이 완료되었습니다!
          </h2>
          <p className="text-gray-600 mb-8">
            투자 성향 분석 결과를 확인해보세요.
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleComplete}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
          >
            결과 확인하기
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">질문을 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8 pt-4">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
            <ChevronLeft className="w-5 h-5 mr-1" />
            홈으로
          </Link>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <span className="text-lg font-semibold text-gray-800">투자 성향 분석</span>
          </div>
        </div>

        {/* 진행률 바 */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              {currentQuestion < 9 ? '1단계: 성향군 결정' : '2단계: 세부 성향 결정'}
            </span>
            <span>{currentQuestion + 1} / {totalQuestions}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* 질문 카드 */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-white rounded-2xl shadow-2xl p-8 mb-8"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 leading-relaxed">
              {currentQuestionData.question}
            </h2>
            {currentQuestion === 9 && selectedGroup && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 font-medium">
                  성향군이 결정되었습니다: {
                    selectedGroup === 'stability' ? '안정추구형' :
                    selectedGroup === 'profit' ? '수익추구형' : '적극적/투기형'
                  }
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  이제 세부 성향을 결정하기 위한 질문들이 이어집니다.
                </p>
              </div>
            )}
          </div>

          {/* 답변 옵션들 */}
          <div className="space-y-3">
            {commonOptions.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(option.score)}
                className={`w-full p-4 text-left rounded-xl transition-all duration-200 ${
                  getCurrentAnswer() === option.score
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option.text}</span>
                  <span className="text-sm opacity-70">({option.score}점)</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* 네비게이션 버튼 */}
        <div className="flex justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              currentQuestion === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-lg'
            }`}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            이전
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={getCurrentAnswer() === 0}
            className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              getCurrentAnswer() === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg'
            }`}
          >
            다음
            <ChevronRight className="w-5 h-5 ml-2" />
          </motion.button>
        </div>
      </div>
    </div>
  )
} 