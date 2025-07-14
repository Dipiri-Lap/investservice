// 1단계: 성향군 구분 질문
export interface GroupQuestion {
  id: number;
  question: string;
  group: 'stability' | 'profit' | 'aggressive';
}

// 2단계: 세부 성향 질문  
export interface DetailQuestion {
  id: number;
  question: string;
  type: 'conservative' | 'stability_focused' | 'dividend_focused' | 'balanced' | 'growth_oriented' | 'value_focused' | 'esg_focused' | 'aggressive' | 'innovation_focused' | 'short_term_profit_focused';
}

// 공통 옵션 (5점 척도)
export const commonOptions = [
  { text: "매우 그렇다", score: 5 },
  { text: "그렇다", score: 4 },
  { text: "보통", score: 3 },
  { text: "아니다", score: 2 },
  { text: "매우 아니다", score: 1 }
];

// 1단계: 성향군 구분 질문 (9문제)
export const groupQuestions: GroupQuestion[] = [
  // 안정추구형 성향군 (1~3번)
  {
    id: 1,
    question: "투자 시 원금 손실은 절대 감수할 수 없다.",
    group: "stability"
  },
  {
    id: 2,
    question: "높은 수익률보다는 꾸준하고 안정적인 수익을 얻는 것이 훨씬 중요하다.",
    group: "stability"
  },
  {
    id: 3,
    question: "투자자산 대부분을 예금이나 채권 등 안전자산에 투자하고 싶다.",
    group: "stability"
  },
  
  // 수익추구형 성향군 (4~6번)
  {
    id: 4,
    question: "투자할 때 기업의 성장 가능성이나 장기적 가치 상승을 가장 중요하게 생각한다.",
    group: "profit"
  },
  {
    id: 5,
    question: "저평가된 가치주나, 펀더멘탈이 탄탄한 기업을 찾아 투자한다.",
    group: "profit"
  },
  {
    id: 6,
    question: "친환경, 사회적 책임(ESG) 등 사회적 가치가 높은 기업에 투자하고 싶다.",
    group: "profit"
  },
  
  // 적극적/투기형 성향군 (7~9번)
  {
    id: 7,
    question: "높은 투자 수익을 위해 상당한 위험과 가격 변동성을 적극 감수할 수 있다.",
    group: "aggressive"
  },
  {
    id: 8,
    question: "시장의 단기적인 변동을 이용해 자주 거래하는 것이 좋다.",
    group: "aggressive"
  },
  {
    id: 9,
    question: "신기술이나 신산업 등 혁신적인 분야에 대한 투자에 매우 관심이 많다.",
    group: "aggressive"
  }
];

// 2단계: 세부 성향 질문 (각 성향별 4문제)
export const detailQuestions: DetailQuestion[] = [
  // 안정추구형 성향군 - 보수형 (4문제)
  {
    id: 10,
    question: "투자자금의 원금이 조금이라도 줄어드는 것은 절대 용납할 수 없다.",
    type: "conservative"
  },
  {
    id: 11,
    question: "투자는 주로 예금과 원금 보장형 금융상품으로만 해야 마음이 편하다.",
    type: "conservative"
  },
  {
    id: 12,
    question: "시장 변동이 클 때 극도의 불안감을 느끼고 빠르게 투자금을 안전 자산으로 옮긴다.",
    type: "conservative"
  },
  {
    id: 13,
    question: "원금 손실 가능성이 있는 상품은 아예 고려조차 하지 않는다.",
    type: "conservative"
  },
  
  // 안정추구형 성향군 - 안정추구형 (4문제)
  {
    id: 14,
    question: "채권과 같이 일정하고 꾸준한 이자 수익을 주는 투자상품을 선호한다.",
    type: "stability_focused"
  },
  {
    id: 15,
    question: "수익률이 낮더라도 변동성이 낮고 안정적인 자산을 선호한다.",
    type: "stability_focused"
  },
  {
    id: 16,
    question: "자산의 대부분을 채권 또는 우량한 회사채 중심으로 투자하는 것이 좋다고 생각한다.",
    type: "stability_focused"
  },
  {
    id: 17,
    question: "손실이 발생하면 추가 투자 없이 바로 자산 비중을 줄인다.",
    type: "stability_focused"
  },
  
  // 안정추구형 성향군 - 배당중시형 (4문제)
  {
    id: 18,
    question: "꾸준히 배당을 주는 우량기업에 투자하는 것이 가장 중요하다.",
    type: "dividend_focused"
  },
  {
    id: 19,
    question: "자산의 상당 부분을 고배당 주식이나 배당 ETF 등에 투자하고 싶다.",
    type: "dividend_focused"
  },
  {
    id: 20,
    question: "시세차익보다는 정기적인 배당수익 확보가 투자목표이다.",
    type: "dividend_focused"
  },
  {
    id: 21,
    question: "배당률이 높은 기업이나 펀드를 선택할 때 마음이 가장 편하다.",
    type: "dividend_focused"
  },
  
  // 안정추구형 성향군 - 균형형 (4문제)
  {
    id: 22,
    question: "주식과 채권, 현금성 자산을 적절히 분산 투자하는 것이 가장 효과적이라고 생각한다.",
    type: "balanced"
  },
  {
    id: 23,
    question: "안정성과 수익성 사이에서 균형을 맞추는 것이 최우선이다.",
    type: "balanced"
  },
  {
    id: 24,
    question: "투자 기간은 중기(3~5년) 정도로 설정하는 것이 가장 적절하다.",
    type: "balanced"
  },
  {
    id: 25,
    question: "시장 변동이 있어도 기존의 투자 전략을 크게 바꾸지 않고 유지한다.",
    type: "balanced"
  },
  
  // 수익추구형 성향군 - 성장지향형 (4문제)
  {
    id: 26,
    question: "단기적인 손실을 보더라도 장기적으로 성장할 가능성이 큰 기업에 투자하고 싶다.",
    type: "growth_oriented"
  },
  {
    id: 27,
    question: "향후 5년 이상 지속적으로 성장할 것으로 기대되는 주식에 투자한다.",
    type: "growth_oriented"
  },
  {
    id: 28,
    question: "성장 잠재력이 높은 신흥 시장이나 업종에 투자하는 것이 좋다고 생각한다.",
    type: "growth_oriented"
  },
  {
    id: 29,
    question: "기업의 미래 가치와 성장성을 평가하는 데 가장 많은 시간을 투자한다.",
    type: "growth_oriented"
  },
  
  // 수익추구형 성향군 - 가치중시형 (4문제)
  {
    id: 30,
    question: "기업의 재무제표, 이익, 부채 비율 등을 철저히 분석하여 투자한다.",
    type: "value_focused"
  },
  {
    id: 31,
    question: "시장에서 저평가된 기업을 찾아 장기적으로 보유하는 전략을 선호한다.",
    type: "value_focused"
  },
  {
    id: 32,
    question: "시장의 유행이나 단기적 변동보다는 기업의 내재가치와 펀더멘탈을 중시한다.",
    type: "value_focused"
  },
  {
    id: 33,
    question: "인기가 많고 과대평가된 기업보다는 숨겨진 우량 가치주를 선호한다.",
    type: "value_focused"
  },
  
  // 수익추구형 성향군 - 사회책임투자형 (4문제)
  {
    id: 34,
    question: "환경보호, 윤리경영, ESG 점수가 높은 기업에 투자하는 것이 중요하다.",
    type: "esg_focused"
  },
  {
    id: 35,
    question: "투자할 때 기업이 사회적 책임을 얼마나 다하는지를 반드시 고려한다.",
    type: "esg_focused"
  },
  {
    id: 36,
    question: "수익률이 다소 낮더라도 환경과 사회에 긍정적인 영향을 미치는 기업에 투자한다.",
    type: "esg_focused"
  },
  {
    id: 37,
    question: "지속가능성 및 사회적 가치와 관련된 펀드 및 ETF에 투자하고 싶다.",
    type: "esg_focused"
  },
  
  // 적극적/투기형 성향군 - 공격형 (4문제)
  {
    id: 38,
    question: "매우 높은 수익을 얻기 위해서는 큰 손실도 적극 감수할 수 있다.",
    type: "aggressive"
  },
  {
    id: 39,
    question: "시장이 하락했을 때 더 적극적으로 추가 매수하는 스타일이다.",
    type: "aggressive"
  },
  {
    id: 40,
    question: "투자 포트폴리오에서 주식과 암호화폐 같은 고위험 자산 비중을 높게 유지한다.",
    type: "aggressive"
  },
  {
    id: 41,
    question: "경제 사이클이나 시장 타이밍을 활용하여 적극적으로 자산을 매매한다.",
    type: "aggressive"
  },
  
  // 적극적/투기형 성향군 - 혁신추구형 (4문제)
  {
    id: 42,
    question: "신기술이나 혁신을 주도할 기업 및 산업에 투자하는 것이 매우 매력적이다.",
    type: "innovation_focused"
  },
  {
    id: 43,
    question: "검증되지 않은 스타트업이나 혁신기업에 투자를 적극적으로 고려한다.",
    type: "innovation_focused"
  },
  {
    id: 44,
    question: "미래 산업을 주도할 것으로 기대되는 기술(예: AI, 블록체인)에 관심이 많다.",
    type: "innovation_focused"
  },
  {
    id: 45,
    question: "아직 이익을 내지 못하는 초기 기업이라도 혁신적이라면 투자를 고려한다.",
    type: "innovation_focused"
  },
  
  // 적극적/투기형 성향군 - 단기차익추구형 (4문제)
  {
    id: 46,
    question: "단기적으로 높은 수익을 얻기 위해 잦은 거래와 매매를 선호한다.",
    type: "short_term_profit_focused"
  },
  {
    id: 47,
    question: "레버리지나 마진거래와 같은 고위험 단기 전략을 자주 활용한다.",
    type: "short_term_profit_focused"
  },
  {
    id: 48,
    question: "하루 또는 며칠 이내의 단기 가격 변동을 이용한 투자가 더 효율적이라 생각한다.",
    type: "short_term_profit_focused"
  },
  {
    id: 49,
    question: "빠른 시장 정보와 뉴스에 따라 민첩하게 투자 결정을 내린다.",
    type: "short_term_profit_focused"
  }
];

// 성향군 매핑
export const groupMapping = {
  stability: ['conservative', 'stability_focused', 'dividend_focused', 'balanced'],
  profit: ['growth_oriented', 'value_focused', 'esg_focused'],
  aggressive: ['aggressive', 'innovation_focused', 'short_term_profit_focused']
};

// 1단계: 성향군 결정 함수
export function determineGroup(answers: number[]): 'stability' | 'profit' | 'aggressive' {
  const stabilityScore = answers.slice(0, 3).reduce((sum, score) => sum + score, 0);
  const profitScore = answers.slice(3, 6).reduce((sum, score) => sum + score, 0);
  const aggressiveScore = answers.slice(6, 9).reduce((sum, score) => sum + score, 0);
  
  if (stabilityScore >= profitScore && stabilityScore >= aggressiveScore) {
    return 'stability';
  } else if (profitScore >= aggressiveScore) {
    return 'profit';
  } else {
    return 'aggressive';
  }
}

// 2단계: 세부 성향 결정 함수
export function determineDetailType(group: 'stability' | 'profit' | 'aggressive', answers: number[]): InvestmentProfile {
  const types = groupMapping[group];
  const scores: { [key: string]: number } = {};
  
  // 각 성향별 점수 계산 (4문제씩)
  types.forEach((type, index) => {
    const startIndex = index * 4;
    const endIndex = startIndex + 4;
    scores[type] = answers.slice(startIndex, endIndex).reduce((sum, score) => sum + score, 0);
  });
  
  // 가장 높은 점수의 성향 선택
  const highestType = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
  
  return investmentProfiles[highestType];
}

// 투자 성향 유형 정의
export interface InvestmentProfile {
  type: 'conservative' | 'stability_focused' | 'dividend_focused' | 'balanced' | 'growth_oriented' | 'value_focused' | 'esg_focused' | 'aggressive' | 'innovation_focused' | 'short_term_profit_focused';
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
  conservative: {
    type: 'conservative',
    name: '보수형',
    description: '안전성을 최우선으로 하며, 원금 보장을 중시하는 투자 성향',
    characteristics: [
      '원금 보장 상품 선호',
      '안전성 최우선 고려',
      '예금, 적금, 국채 중심',
      '변동성 극도로 기피'
    ],
    riskLevel: 2,
    expectedReturn: '2-4%',
    recommendedAssets: {
      stocks: 10,
      bonds: 60,
      cash: 25,
      alternatives: 5
    }
  },
  stability_focused: {
    type: 'stability_focused',
    name: '안정추구형',
    description: '안정적인 수익을 추구하며, 변동성을 최소화하는 투자 성향',
    characteristics: [
      '안정적 수익 추구',
      '변동성 최소화',
      '우량 대형주 선호',
      '장기 투자 지향'
    ],
    riskLevel: 3,
    expectedReturn: '3-5%',
    recommendedAssets: {
      stocks: 25,
      bonds: 50,
      cash: 20,
      alternatives: 5
    }
  },
  dividend_focused: {
    type: 'dividend_focused',
    name: '배당중시형',
    description: '배당 수익을 중시하며, 꾸준한 현금 흐름을 추구하는 투자 성향',
    characteristics: [
      '배당 수익 중심',
      '꾸준한 현금 흐름 추구',
      '배당 성장주 선호',
      '인컴 투자 중시'
    ],
    riskLevel: 4,
    expectedReturn: '4-6%',
    recommendedAssets: {
      stocks: 45,
      bonds: 30,
      cash: 15,
      alternatives: 10
    }
  },
  balanced: {
    type: 'balanced',
    name: '균형형',
    description: '안정성과 수익성의 균형을 추구하며, 분산 투자를 선호하는 성향',
    characteristics: [
      '안정성과 수익성 균형',
      '분산투자 선호',
      '중장기 투자 관점',
      '적정 위험 감수'
    ],
    riskLevel: 5,
    expectedReturn: '5-7%',
    recommendedAssets: {
      stocks: 50,
      bonds: 30,
      cash: 10,
      alternatives: 10
    }
  },
  growth_oriented: {
    type: 'growth_oriented',
    name: '성장지향형',
    description: '장기적 자산 성장을 목표로 하며, 성장 가능성을 중시하는 투자 성향',
    characteristics: [
      '장기적 성장 추구',
      '성장주 투자 선호',
      '높은 수익률 추구',
      '상당한 위험 감수'
    ],
    riskLevel: 6,
    expectedReturn: '6-9%',
    recommendedAssets: {
      stocks: 65,
      bonds: 20,
      cash: 10,
      alternatives: 5
    }
  },
  value_focused: {
    type: 'value_focused',
    name: '가치중시형',
    description: '저평가된 가치주를 선호하며, 펀더멘털 분석을 중시하는 투자 성향',
    characteristics: [
      '저평가 가치주 선호',
      '펀더멘털 분석 중시',
      '장기 관점 투자',
      '내재가치 대비 할인 추구'
    ],
    riskLevel: 5,
    expectedReturn: '5-8%',
    recommendedAssets: {
      stocks: 60,
      bonds: 25,
      cash: 10,
      alternatives: 5
    }
  },
  esg_focused: {
    type: 'esg_focused',
    name: '사회책임투자형',
    description: 'ESG 요소를 고려하며, 사회적 가치와 지속가능성을 중시하는 투자 성향',
    characteristics: [
      'ESG 요소 고려',
      '사회적 가치 중시',
      '지속가능성 추구',
      '사회책임 투자 선호'
    ],
    riskLevel: 5,
    expectedReturn: '5-8%',
    recommendedAssets: {
      stocks: 55,
      bonds: 25,
      cash: 10,
      alternatives: 10
    }
  },
  aggressive: {
    type: 'aggressive',
    name: '공격형',
    description: '높은 위험을 감수하며, 공격적인 투자 전략을 선호하는 성향',
    characteristics: [
      '높은 위험 감수',
      '공격적 투자 전략',
      '높은 수익률 추구',
      '변동성 수용'
    ],
    riskLevel: 8,
    expectedReturn: '8-12%',
    recommendedAssets: {
      stocks: 75,
      bonds: 10,
      cash: 5,
      alternatives: 10
    }
  },
  innovation_focused: {
    type: 'innovation_focused',
    name: '혁신추구형',
    description: '혁신적인 기술과 신성장 분야에 투자하며, 미래 가치를 추구하는 성향',
    characteristics: [
      '혁신 기술 투자',
      '신성장 분야 선호',
      '미래 가치 추구',
      '테마 투자 선호'
    ],
    riskLevel: 7,
    expectedReturn: '7-11%',
    recommendedAssets: {
      stocks: 70,
      bonds: 15,
      cash: 5,
      alternatives: 10
    }
  },
  short_term_profit_focused: {
    type: 'short_term_profit_focused',
    name: '단기차익추구형',
    description: '단기적인 차익 실현을 목표로 하며, 활발한 매매를 선호하는 성향',
    characteristics: [
      '단기 차익 실현',
      '활발한 매매 선호',
      '시장 타이밍 중시',
      '높은 회전율'
    ],
    riskLevel: 9,
    expectedReturn: '10-15%',
    recommendedAssets: {
      stocks: 80,
      bonds: 5,
      cash: 5,
      alternatives: 10
    }
  }
}; 