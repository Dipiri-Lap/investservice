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
  const [detailAnswers, setDetailAnswers] = useState<number[]>([])
  const [selectedGroup, setSelectedGroup] = useState<'stability' | 'profit' | 'aggressive' | null>(null)
  const [detailQuestionsForGroup, setDetailQuestionsForGroup] = useState<any[]>([])
  const [isCompleted, setIsCompleted] = useState(false)
  const router = useRouter()

  // 성향군별 질문 수 계산
  const getDetailQuestionCount = (group: 'stability' | 'profit' | 'aggressive') => {
    return groupMapping[group].length * 4
  }

  // 현재 성향군의 세부 질문들 준비
  useEffect(() => {
    if (selectedGroup) {
      const groupTypes = groupMapping[selectedGroup];
      const questionsForThisGroup = detailQuestions.filter(q => 
        groupTypes.includes(q.type)
      );
      setDetailQuestionsForGroup(questionsForThisGroup);
      
      // 선택된 성향군에 따라 답변 배열 크기 조정
      const detailQuestionCount = getDetailQuestionCount(selectedGroup);
      setDetailAnswers(new Array(detailQuestionCount).fill(0));
    }
  }, [selectedGroup]);

  // 전체 질문 수 계산
  const getTotalQuestionCount = () => {
    if (selectedGroup) {
      return 9 + getDetailQuestionCount(selectedGroup);
    }
    return 9; // 아직 성향군이 결정되지 않은 경우
  }

  // 전체 질문 배열 (1-9: 성향군 질문, 10-?: 세부 질문)
  const getAllQuestions = () => {
    const allQuestions = [...groupQuestions];
    if (detailQuestionsForGroup.length > 0) {
      allQuestions.push(...detailQuestionsForGroup);
    }
    return allQuestions;
  };

  const allQuestions = getAllQuestions();
  const totalQuestions = getTotalQuestionCount();

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
      // 2단계: 세부 성향 결정 질문 (10-?)
      const detailIndex = currentQuestion - 9;
      const newDetailAnswers = [...detailAnswers];
      newDetailAnswers[detailIndex] = score;
      setDetailAnswers(newDetailAnswers);
    }

    // 9번째 질문 후에는 성향군이 결정되므로 특별 처리
    if (currentQuestion === 8) {
      // 성향군 결정 후 2단계 질문으로 이동
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 1000);
    } else {
      // 실제 총 질문 수 계산 (selectedGroup이 설정된 후)
      const actualTotalQuestions = selectedGroup ? 9 + getDetailQuestionCount(selectedGroup) : 9;
      
      // 마지막 문항이 아니면 다음 문항으로 자동 이동
      if (currentQuestion < actualTotalQuestions - 1) {
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1);
        }, 500);
      } else {
        // 마지막 문항이면 완료 처리
        setIsCompleted(true);
      }
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

  const getStageInfo = () => {
    if (currentQuestion < 9) {
      return {
        stage: '1단계: 성향군 결정',
        description: '투자 성향 그룹을 결정하는 질문입니다.',
        questionCount: 9
      };
    } else if (selectedGroup) {
      const detailCount = getDetailQuestionCount(selectedGroup);
      const groupName = selectedGroup === 'stability' ? '안정추구형' : 
                       selectedGroup === 'profit' ? '수익추구형' : '적극적/투기형';
      return {
        stage: '2단계: 세부 성향 결정',
        description: `${groupName} 성향군 내 세부 성향을 결정하는 질문입니다.`,
        questionCount: detailCount
      };
    }
    return null;
  };

  const currentQuestionData = getCurrentQuestionData();
  const stageInfo = getStageInfo();

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
          <p className="text-gray-600 mb-4">
            총 {totalQuestions}문항의 투자 성향 분석이 완료되었습니다.
          </p>
          <div className="text-sm text-gray-500 mb-8">
            <p>1단계: 성향군 결정 (9문항)</p>
            <p>2단계: 세부 성향 결정 ({getDetailQuestionCount(selectedGroup!)}문항)</p>
          </div>
          
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
            <div>
              <span className="font-medium">{stageInfo?.stage}</span>
              <p className="text-xs text-gray-500 mt-1">{stageInfo?.description}</p>
            </div>
            <span className="font-medium">{currentQuestion + 1} / {totalQuestions}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          {/* 성향군별 질문 수 표시 */}
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>1단계: 9문항</span>
            {selectedGroup && (
              <span>
                2단계: {getDetailQuestionCount(selectedGroup)}문항
                {selectedGroup === 'stability' && ' (안정추구형)'}
                {selectedGroup === 'profit' && ' (수익추구형)'}
                {selectedGroup === 'aggressive' && ' (적극적/투기형)'}
              </span>
            )}
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
              <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 font-medium mb-2">
                  ✅ 성향군이 결정되었습니다: {
                    selectedGroup === 'stability' ? '안정추구형' :
                    selectedGroup === 'profit' ? '수익추구형' : '적극적/투기형'
                  }
                </p>
                <p className="text-xs text-blue-600">
                  이제 {getDetailQuestionCount(selectedGroup)}개의 세부 성향 질문이 이어집니다.
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