export interface SurveyQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    score: number;
  }[];
  category: 'risk_tolerance' | 'investment_purpose' | 'investment_experience' | 'asset_liquidity' | 'psychology_behavior' | 'investment_strategy';
}

export const surveyQuestions: SurveyQuestion[] = [
  // 위험 감수 성향 (1~5번)
  {
    id: 1,
    question: "투자 자산이 갑자기 20% 하락했을 때 어떻게 하시겠습니까?",
    category: "risk_tolerance",
    options: [
      { text: "즉시 전부 매도한다", score: 1 },
      { text: "상당 부분 매도한다", score: 2 },
      { text: "일부 매도하거나 관망한다", score: 3 },
      { text: "아무 행동도 하지 않는다", score: 4 },
      { text: "추가 매수를 적극적으로 고려한다", score: 5 }
    ]
  },
  {
    id: 2,
    question: "손실을 어느 정도까지 감내할 수 있나요?",
    category: "risk_tolerance",
    options: [
      { text: "3% 이하", score: 1 },
      { text: "3~7%", score: 2 },
      { text: "7~12%", score: 3 },
      { text: "12~20%", score: 4 },
      { text: "20% 이상", score: 5 }
    ]
  },
  {
    id: 3,
    question: "변동성이 큰 암호화폐에 투자하는 것을 어떻게 생각하시나요?",
    category: "risk_tolerance",
    options: [
      { text: "절대 투자하지 않는다", score: 1 },
      { text: "거의 투자하지 않는다", score: 2 },
      { text: "신중히 투자한다", score: 3 },
      { text: "적당히 투자한다", score: 4 },
      { text: "적극적으로 투자한다", score: 5 }
    ]
  },
  {
    id: 4,
    question: "높은 예상 수익률을 위해 큰 위험도 감수할 의향이 있나요?",
    category: "risk_tolerance",
    options: [
      { text: "전혀 없다", score: 1 },
      { text: "거의 없다", score: 2 },
      { text: "보통이다", score: 3 },
      { text: "약간 있다", score: 4 },
      { text: "매우 많다", score: 5 }
    ]
  },
  {
    id: 5,
    question: "갑작스런 시장 폭락 시 당신의 반응은?",
    category: "risk_tolerance",
    options: [
      { text: "즉시 매도한다", score: 1 },
      { text: "상당 부분 매도한다", score: 2 },
      { text: "일부만 매도한다", score: 3 },
      { text: "관망한다", score: 4 },
      { text: "추가 매수 기회로 본다", score: 5 }
    ]
  },

  // 투자 목적 및 기간 (6~8번)
  {
    id: 6,
    question: "주된 투자 목적은 무엇인가요?",
    category: "investment_purpose",
    options: [
      { text: "단기 차익 실현", score: 1 },
      { text: "단기 수익 + 위험 회피", score: 2 },
      { text: "중장기 자산 성장", score: 3 },
      { text: "안정적인 배당/임대수익", score: 4 },
      { text: "자산 보존 및 위험 최소화", score: 5 }
    ]
  },
  {
    id: 7,
    question: "투자 계획 기간은 어떻게 되나요?",
    category: "investment_purpose",
    options: [
      { text: "6개월 미만", score: 1 },
      { text: "6개월~1년", score: 2 },
      { text: "1~3년", score: 3 },
      { text: "3~5년", score: 4 },
      { text: "5년 이상", score: 5 }
    ]
  },
  {
    id: 8,
    question: "급격한 시장 변동이 생기면 투자 전략을 어떻게 변경하나요?",
    category: "investment_purpose",
    options: [
      { text: "즉시 전부 매도한다", score: 1 },
      { text: "대부분 매도한다", score: 2 },
      { text: "일부 조정한다", score: 3 },
      { text: "변화 없이 유지한다", score: 4 },
      { text: "추가 매수한다", score: 5 }
    ]
  },

  // 투자 경험 및 지식 (9~12번)
  {
    id: 9,
    question: "투자 경험은 어느 정도인가요?",
    category: "investment_experience",
    options: [
      { text: "전혀 없다", score: 1 },
      { text: "6개월 미만", score: 2 },
      { text: "6개월~1년", score: 3 },
      { text: "1~3년", score: 4 },
      { text: "3년 이상", score: 5 }
    ]
  },
  {
    id: 10,
    question: "가장 많이 투자한 자산 유형은?",
    category: "investment_experience",
    options: [
      { text: "예금, 적금", score: 1 },
      { text: "채권, 펀드", score: 2 },
      { text: "주식, ETF", score: 3 },
      { text: "부동산(직접 또는 펀드)", score: 4 },
      { text: "암호화폐", score: 5 }
    ]
  },
  {
    id: 11,
    question: "투자 정보를 접하는 빈도는?",
    category: "investment_experience",
    options: [
      { text: "거의 안 본다", score: 1 },
      { text: "가끔 본다", score: 2 },
      { text: "주 1~2회 본다", score: 3 },
      { text: "자주 본다", score: 4 },
      { text: "매일 본다", score: 5 }
    ]
  },
  {
    id: 12,
    question: "투자 관련 지식 수준은?",
    category: "investment_experience",
    options: [
      { text: "거의 없다", score: 1 },
      { text: "기초 지식만 있다", score: 2 },
      { text: "기본 개념을 이해한다", score: 3 },
      { text: "심화 지식을 갖추었다", score: 4 },
      { text: "전문가 수준이다", score: 5 }
    ]
  },

  // 자산 현황 및 유동성 (13~16번)
  {
    id: 13,
    question: "투자 가능한 총 자산 규모는?",
    category: "asset_liquidity",
    options: [
      { text: "1천만 원 미만", score: 1 },
      { text: "1천만~3천만 원", score: 2 },
      { text: "3천만~5천만 원", score: 3 },
      { text: "5천만~1억 원", score: 4 },
      { text: "1억 원 이상", score: 5 }
    ]
  },
  {
    id: 14,
    question: "비상금(유동자산) 보유 수준은?",
    category: "asset_liquidity",
    options: [
      { text: "전혀 없다", score: 1 },
      { text: "생활비 1개월 이하", score: 2 },
      { text: "생활비 1~3개월", score: 3 },
      { text: "생활비 3~6개월", score: 4 },
      { text: "생활비 6개월 이상", score: 5 }
    ]
  },
  {
    id: 15,
    question: "월별 투자 가능한 금액은?",
    category: "asset_liquidity",
    options: [
      { text: "10만 원 미만", score: 1 },
      { text: "10~30만 원", score: 2 },
      { text: "30~50만 원", score: 3 },
      { text: "50~100만 원", score: 4 },
      { text: "100만 원 이상", score: 5 }
    ]
  },
  {
    id: 16,
    question: "투자 자산 중 유동성이 중요한 비중은?",
    category: "asset_liquidity",
    options: [
      { text: "거의 없다", score: 1 },
      { text: "10% 이하", score: 2 },
      { text: "10~30%", score: 3 },
      { text: "30~50%", score: 4 },
      { text: "50% 이상", score: 5 }
    ]
  },

  // 심리 및 행동 특성 (17~21번)
  {
    id: 17,
    question: "투자 손실 시 감정 조절 수준은?",
    category: "psychology_behavior",
    options: [
      { text: "거의 못 한다", score: 1 },
      { text: "가끔 흔들린다", score: 2 },
      { text: "보통이다", score: 3 },
      { text: "대체로 잘 한다", score: 4 },
      { text: "항상 냉철하다", score: 5 }
    ]
  },
  {
    id: 18,
    question: "투자 결정 시 주변 의견 영향도는?",
    category: "psychology_behavior",
    options: [
      { text: "매우 크다", score: 1 },
      { text: "다소 크다", score: 2 },
      { text: "보통이다", score: 3 },
      { text: "적다", score: 4 },
      { text: "거의 없다", score: 5 }
    ]
  },
  {
    id: 19,
    question: "투자 판단에 대한 자신감 수준은?",
    category: "psychology_behavior",
    options: [
      { text: "매우 낮다", score: 1 },
      { text: "낮다", score: 2 },
      { text: "보통이다", score: 3 },
      { text: "높다", score: 4 },
      { text: "매우 높다", score: 5 }
    ]
  },
  {
    id: 20,
    question: "시장 불안정 시 주 행동은?",
    category: "psychology_behavior",
    options: [
      { text: "전량 매도한다", score: 1 },
      { text: "대다수 매도한다", score: 2 },
      { text: "일부 매도한다", score: 3 },
      { text: "유지한다", score: 4 },
      { text: "추가 매수한다", score: 5 }
    ]
  },
  {
    id: 21,
    question: "손실 회복을 위해 더 큰 위험 감수 의향은?",
    category: "psychology_behavior",
    options: [
      { text: "전혀 없다", score: 1 },
      { text: "거의 없다", score: 2 },
      { text: "보통이다", score: 3 },
      { text: "약간 있다", score: 4 },
      { text: "매우 많다", score: 5 }
    ]
  },

  // 투자 선호 자산 및 전략 (22~25번)
  {
    id: 22,
    question: "선호하는 투자 상품은?",
    category: "investment_strategy",
    options: [
      { text: "예금, 적금, 채권", score: 1 },
      { text: "펀드, ETF", score: 2 },
      { text: "주식", score: 3 },
      { text: "부동산(직접 또는 펀드)", score: 4 },
      { text: "암호화폐 및 기타 대체 투자(금 등)", score: 5 }
    ]
  },
  {
    id: 23,
    question: "자산 배분에 대한 생각은?",
    category: "investment_strategy",
    options: [
      { text: "한두 개 자산에 집중 투자한다", score: 1 },
      { text: "적당히 분산 투자한다", score: 2 },
      { text: "분산 투자하는 편이다", score: 3 },
      { text: "매우 적극적으로 분산 투자한다", score: 4 },
      { text: "매우 다양하게 분산 투자한다", score: 5 }
    ]
  },
  {
    id: 24,
    question: "직접 투자와 간접 투자 선호도는?",
    category: "investment_strategy",
    options: [
      { text: "직접 투자만 한다", score: 1 },
      { text: "직접 투자 위주다", score: 2 },
      { text: "직접, 간접 투자 혼합한다", score: 3 },
      { text: "간접 투자 위주다", score: 4 },
      { text: "간접 투자만 한다", score: 5 }
    ]
  },
  {
    id: 25,
    question: "투자 정보 분석 및 탐색에 투자하는 시간은?",
    category: "investment_strategy",
    options: [
      { text: "거의 하지 않는다", score: 1 },
      { text: "가끔 한다", score: 2 },
      { text: "보통이다", score: 3 },
      { text: "자주 한다", score: 4 },
      { text: "매우 많이 한다", score: 5 }
    ]
  }
];

// 투자 성향 유형 정의
export interface InvestmentProfile {
  type: 'ultra_ultra_conservative' | 'ultra_conservative' | 'conservative' | 'moderate_conservative' | 'balanced' | 'moderate_growth' | 'growth' | 'aggressive_growth' | 'speculative_aggressive' | 'ultra_speculative_aggressive';
  name: string;
  description: string;
  characteristics: string[];
  riskLevel: number; // 1-10
  expectedReturn: string;
  recommendedAssets: {
    stocks: number;
    bonds: number;
    cash: number;
    alternatives: number;
  };
}

export const investmentProfiles: Record<string, InvestmentProfile> = {
  ultra_ultra_conservative: {
    type: 'ultra_ultra_conservative',
    name: '초극보수형',
    description: '원금 보장을 절대 우선시하며, 어떤 손실도 감수하지 않는 극도로 안전한 투자만 선호',
    characteristics: [
      '원금 손실 절대 불가',
      '예금과 적금 위주 투자',
      '변동성 극도로 기피',
      '유동성 최우선 고려'
    ],
    riskLevel: 1,
    expectedReturn: '1-2%',
    recommendedAssets: {
      stocks: 0,
      bonds: 30,
      cash: 65,
      alternatives: 5
    }
  },
  ultra_conservative: {
    type: 'ultra_conservative',
    name: '극보수형',
    description: '안전성을 최우선으로 하며, 최소한의 위험만 감수하여 안정적인 수익을 추구',
    characteristics: [
      '원금 보장 상품 선호',
      '국채 및 우량 채권 중심',
      '극도로 안전한 투자만 고려',
      '수익률보다 안정성 우선'
    ],
    riskLevel: 2,
    expectedReturn: '2-3%',
    recommendedAssets: {
      stocks: 5,
      bonds: 50,
      cash: 40,
      alternatives: 5
    }
  },
  conservative: {
    type: 'conservative',
    name: '보수형',
    description: '안정성을 중시하면서도 약간의 위험을 감수하여 인플레이션을 상회하는 수익을 추구',
    characteristics: [
      '안정적 수익 추구',
      '우량 대형주 선호',
      '채권 비중 높음',
      '인플레이션 헤지 고려'
    ],
    riskLevel: 3,
    expectedReturn: '3-4%',
    recommendedAssets: {
      stocks: 15,
      bonds: 55,
      cash: 25,
      alternatives: 5
    }
  },
  moderate_conservative: {
    type: 'moderate_conservative',
    name: '온건보수형',
    description: '안정성을 기반으로 하되, 적절한 위험을 감수하여 보다 나은 수익을 추구',
    characteristics: [
      '점진적 자산 증대',
      '배당주 선호',
      '안정적 성장 추구',
      '리스크 관리 중시'
    ],
    riskLevel: 4,
    expectedReturn: '4-5%',
    recommendedAssets: {
      stocks: 25,
      bonds: 45,
      cash: 20,
      alternatives: 10
    }
  },
  balanced: {
    type: 'balanced',
    name: '균형형',
    description: '안정성과 수익성의 균형을 추구하며, 중간 정도의 위험을 감수',
    characteristics: [
      '안정성과 수익성 균형',
      '분산투자 선호',
      '중장기 투자 관점',
      '적정 위험 감수'
    ],
    riskLevel: 5,
    expectedReturn: '5-7%',
    recommendedAssets: {
      stocks: 40,
      bonds: 35,
      cash: 15,
      alternatives: 10
    }
  },
  moderate_growth: {
    type: 'moderate_growth',
    name: '온건성장형',
    description: '성장성을 추구하면서도 적절한 안정성을 유지하여 균형잡힌 포트폴리오를 선호',
    characteristics: [
      '성장성과 안정성 조화',
      '우량 성장주 선호',
      '장기 투자 지향',
      '변동성 어느 정도 수용'
    ],
    riskLevel: 6,
    expectedReturn: '6-8%',
    recommendedAssets: {
      stocks: 55,
      bonds: 25,
      cash: 10,
      alternatives: 10
    }
  },
  growth: {
    type: 'growth',
    name: '성장형',
    description: '장기적 자산 성장을 목표로 하며, 상당한 위험을 감수하여 높은 수익을 추구',
    characteristics: [
      '장기적 성장 추구',
      '성장주 투자 선호',
      '상당한 위험 감수',
      '시장 변동성 수용'
    ],
    riskLevel: 7,
    expectedReturn: '7-10%',
    recommendedAssets: {
      stocks: 65,
      bonds: 15,
      cash: 10,
      alternatives: 10
    }
  },
  aggressive_growth: {
    type: 'aggressive_growth',
    name: '공격성장형',
    description: '높은 수익을 추구하며, 큰 위험을 감수하고 적극적인 투자 전략을 선호',
    characteristics: [
      '높은 수익 추구',
      '공격적 투자 전략',
      '큰 위험 감수 가능',
      '성장 가능성 중시'
    ],
    riskLevel: 8,
    expectedReturn: '9-13%',
    recommendedAssets: {
      stocks: 75,
      bonds: 5,
      cash: 5,
      alternatives: 15
    }
  },
  speculative_aggressive: {
    type: 'speculative_aggressive',
    name: '공격투기형',
    description: '매우 높은 수익을 추구하며, 투기적 투자도 감수하는 적극적인 성향',
    characteristics: [
      '매우 높은 수익 추구',
      '투기적 투자 가능',
      '높은 변동성 수용',
      '단기 트레이딩 선호'
    ],
    riskLevel: 9,
    expectedReturn: '12-18%',
    recommendedAssets: {
      stocks: 80,
      bonds: 0,
      cash: 5,
      alternatives: 15
    }
  },
  ultra_speculative_aggressive: {
    type: 'ultra_speculative_aggressive',
    name: '극공격투기형',
    description: '최대 수익을 추구하며, 극도로 높은 위험과 투기적 투자를 마다하지 않는 성향',
    characteristics: [
      '최대 수익 추구',
      '극도로 높은 위험 감수',
      '투기적 투자 선호',
      '고위험 고수익 추구'
    ],
    riskLevel: 10,
    expectedReturn: '15%+',
    recommendedAssets: {
      stocks: 70,
      bonds: 0,
      cash: 5,
      alternatives: 25
    }
  }
};

// 점수 계산 함수
export function calculateInvestmentProfile(scores: number[]): InvestmentProfile {
  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  const averageScore = totalScore / scores.length;

  if (averageScore <= 1.3) {
    return investmentProfiles.ultra_ultra_conservative;
  } else if (averageScore <= 1.6) {
    return investmentProfiles.ultra_conservative;
  } else if (averageScore <= 2.0) {
    return investmentProfiles.conservative;
  } else if (averageScore <= 2.4) {
    return investmentProfiles.moderate_conservative;
  } else if (averageScore <= 2.8) {
    return investmentProfiles.balanced;
  } else if (averageScore <= 3.2) {
    return investmentProfiles.moderate_growth;
  } else if (averageScore <= 3.6) {
    return investmentProfiles.growth;
  } else if (averageScore <= 4.0) {
    return investmentProfiles.aggressive_growth;
  } else if (averageScore <= 4.4) {
    return investmentProfiles.speculative_aggressive;
  } else {
    return investmentProfiles.ultra_speculative_aggressive;
  }
} 