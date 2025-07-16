// 2단계 설문 시스템용 프롬프트 생성 함수 (ES5 호환)
function createPrompt(selectedGroup, groupAnswers, detailAnswers, groupResultsText, detailResultsText) {
  var prompt = '';
  
  // 프롬프트 시작 부분
  prompt += '다음은 2단계 투자 성향 분석을 위한 설문 결과입니다. 1단계에서 성향군을 구분하고, 2단계에서 세부 성향을 분석하여 최종 투자 성향을 정확히 판단해주세요.\n\n';
  
  // 1단계 설문 결과
  var groupTotalScore = groupAnswers.reduce(function(sum, score) { return sum + score; }, 0);
  var groupAverageScore = groupTotalScore / groupAnswers.length;
  
  prompt += '**1단계: 성향군 구분 결과**\n';
  prompt += '선택된 성향군: ' + selectedGroup + '\n';
  prompt += '성향군 평균 점수: ' + groupAverageScore.toFixed(2) + '점 (총 ' + groupTotalScore + '점 / 9문항)\n\n';
  prompt += '1단계 설문 결과:\n' + groupResultsText + '\n\n';
  
  // 2단계 설문 결과
  var detailQuestionCount = groupMapping[selectedGroup].length * 4;
  var detailTotalScore = detailAnswers.reduce(function(sum, score) { return sum + score; }, 0);
  var detailAverageScore = detailTotalScore / detailAnswers.length;
  
  prompt += '**2단계: 세부 성향 분석 결과**\n';
  prompt += '세부 성향 평균 점수: ' + detailAverageScore.toFixed(2) + '점 (총 ' + detailTotalScore + '점 / ' + detailAnswers.length + '문항)\n\n';
  prompt += '2단계 설문 결과:\n' + detailResultsText + '\n\n';
  
  // 투자 성향 분류 기준 (새로운 10개 성향)
  prompt += '**새로운 10가지 투자 성향 분류:**\n\n';
  prompt += '1. **보수형 (conservative)**: 안전성을 최우선으로 하며, 원금 보장을 중시하는 투자 성향\n';
  prompt += '2. **안정추구형 (stability_focused)**: 안정적인 수익을 추구하며, 변동성을 최소화하는 투자 성향\n';
  prompt += '3. **배당중시형 (dividend_focused)**: 배당 수익을 중시하며, 꾸준한 현금 흐름을 추구하는 투자 성향\n';
  prompt += '4. **균형형 (balanced)**: 안정성과 수익성의 균형을 추구하며, 분산 투자를 선호하는 성향\n';
  prompt += '5. **성장지향형 (growth_oriented)**: 장기적 자산 성장을 목표로 하며, 성장 가능성을 중시하는 투자 성향\n';
  prompt += '6. **가치중시형 (value_focused)**: 저평가된 가치주를 선호하며, 펀더멘털 분석을 중시하는 투자 성향\n';
  prompt += '7. **사회책임투자형 (esg_focused)**: ESG 요소를 고려하며, 사회적 가치와 지속가능성을 중시하는 투자 성향\n';
  prompt += '8. **공격형 (aggressive)**: 높은 위험을 감수하며, 공격적인 투자 전략을 선호하는 성향\n';
  prompt += '9. **혁신추구형 (innovation_focused)**: 혁신적인 기술과 신성장 분야에 투자하며, 미래 가치를 추구하는 성향\n';
  prompt += '10. **단기차익추구형 (short_term_profit_focused)**: 단기적인 차익 실현을 목표로 하며, 활발한 매매를 선호하는 성향\n\n';
  
  // 성향군별 세부 성향 매핑
  prompt += '**성향군별 세부 성향:**\n';
  prompt += '- 안정추구형 성향군: 보수형, 안정추구형, 배당중시형, 균형형\n';
  prompt += '- 수익추구형 성향군: 성장지향형, 가치중시형, 사회책임투자형\n';
  prompt += '- 적극적/투기형 성향군: 공격형, 혁신추구형, 단기차익추구형\n\n';
  
  return prompt;
}

// 성향군 매핑 (ES5 호환)
var groupMapping = {
  stability: ['conservative', 'stability_focused', 'dividend_focused', 'balanced'],
  profit: ['growth_oriented', 'value_focused', 'esg_focused'],
  aggressive: ['aggressive', 'innovation_focused', 'short_term_profit_focused']
};

// 성향군별 예상 답변 개수 계산
function getExpectedAnswerCount(selectedGroup) {
  return groupMapping[selectedGroup].length * 4;
}

// 1단계: 성향군 결정 함수
function determineGroup(answers) {
  var stabilityScore = answers.slice(0, 3).reduce(function(sum, score) {
    return sum + score;
  }, 0);
  var profitScore = answers.slice(3, 6).reduce(function(sum, score) {
    return sum + score;
  }, 0);
  var aggressiveScore = answers.slice(6, 9).reduce(function(sum, score) {
    return sum + score;
  }, 0);
  
  if (stabilityScore >= profitScore && stabilityScore >= aggressiveScore) {
    return 'stability';
  } else if (profitScore >= aggressiveScore) {
    return 'profit';
  } else {
    return 'aggressive';
  }
}

// 2단계: 세부 성향 결정 함수
function determineDetailType(group, answers) {
  var types = groupMapping[group];
  var scores = {};
  
  // 각 성향별 점수 계산 (4문제씩)
  types.forEach(function(type, index) {
    var startIndex = index * 4;
    var endIndex = startIndex + 4;
    scores[type] = answers.slice(startIndex, endIndex).reduce(function(sum, score) {
      return sum + score;
    }, 0);
  });
  
  // 가장 높은 점수의 성향 선택
  var highestType = Object.keys(scores).reduce(function(a, b) {
    return scores[a] > scores[b] ? a : b;
  });
  
  return investmentProfiles[highestType];
}

// 새로운 투자 성향 프로필 (ES5 호환)
var investmentProfiles = {
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
    recommendedAssets: { stocks: 10, bonds: 60, cash: 25, alternatives: 5 }
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
    recommendedAssets: { stocks: 25, bonds: 50, cash: 20, alternatives: 5 }
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
    recommendedAssets: { stocks: 45, bonds: 30, cash: 15, alternatives: 10 }
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
    recommendedAssets: { stocks: 50, bonds: 30, cash: 10, alternatives: 10 }
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
    recommendedAssets: { stocks: 65, bonds: 20, cash: 10, alternatives: 5 }
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
    recommendedAssets: { stocks: 60, bonds: 25, cash: 10, alternatives: 5 }
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
    recommendedAssets: { stocks: 55, bonds: 25, cash: 10, alternatives: 10 }
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
    recommendedAssets: { stocks: 75, bonds: 10, cash: 5, alternatives: 10 }
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
    recommendedAssets: { stocks: 70, bonds: 15, cash: 5, alternatives: 10 }
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
    recommendedAssets: { stocks: 80, bonds: 5, cash: 5, alternatives: 10 }
  }
};

// ============================================
// ✅ preGeneratedAnalysis 데이터 (ES5 호환)
// ============================================

// 미리 생성된 분석 데이터 - 실제 사용 시 별도 파일로 분리 권장
var preGeneratedAnalysisData = {
  "conservative": {
    "investmentType": "conservative",
    "confidence": 90,
    "analysis": {
      "description": "보수형 투자자는 원금 보호를 최우선으로 생각하며, 안정적이고 예측 가능한 수익을 선호합니다. 투자 행동은 채권, 우량주, 현금성 자산 중심으로 분산되며, 급격한 시장 변동에는 신중하게 대응하는 편입니다. 위험 감내도는 낮아 큰 손실에 대한 두려움이 크고, 의사결정은 전문가 의견과 검증된 정보를 바탕으로 이루어집니다. 투자 목표는 자산의 안정적 성장과 보호이며, 주로 장기 투자를 지향합니다.",
      "advantages": "보수형 투자자는 자산 손실 위험을 최소화하고 안정적인 수익을 지속적으로 창출할 수 있다는 강점이 있습니다. 급락장에서도 감정에 흔들리지 않고 원칙을 지키며 장기적인 재무 건전성을 확보할 수 있어 은퇴자나 안정적인 자산 보호가 필요한 투자자에게 적합합니다.",
      "disadvantages": "과도한 안전 자산 선호로 인플레이션 및 시장 성장 기회를 놓칠 위험이 있습니다. 현금 보유 비중이 높아 기회비용이 발생하며, 성장 자산 편입에 소극적일 수 있습니다.",
      "improvements": "안정성을 유지하면서도 적절한 위험 감수를 통해 포트폴리오를 다각화할 것을 권장합니다. 우량주 외 성장주를 일부 포함시키고, 사전에 매수·매도 기준을 정해 감정적 대응을 줄이세요.",
      "portfolio": {
        "stocks": 40,
        "bonds": 40,
        "cash": 15,
        "reits": 4,
        "crypto": 1,
        "reason": "보수형 투자자는 원금 보호와 안정적 수익을 우선하므로 채권과 현금 비중을 높여 안정성을 확보합니다. 주식은 우량주 중심으로 일부 성장성을 포함하여 균형을 맞추고, 리츠로 부동산 간접투자를 통한 배당 수익을 기대합니다.",
        "stockAllocation": {
          "dividendStocks": 25,
          "growthStocks": 10,
          "themeStocks": 3,
          "valueStocks": 2,
          "reason": "주식 내에서는 안정적 배당을 주는 종목에 비중을 높여 현금 흐름을 확보하고, 일부 성장주와 테마주를 포함해 성장 잠재력을 반영합니다."
        }
      },
      "recommendedStocks": [
        {
          "category": "dividend",
          "name": "KT&G",
          "ticker": "033780",
          "market": "KRX",
          "country": "한국",
          "reason": "안정적 배당과 꾸준한 현금 흐름을 제공하는 고배당주로, 경기 변동에 강해 보수형 투자자에게 적합합니다."
        },
        {
          "category": "dividend",
          "name": "삼성전자",
          "ticker": "005930",
          "market": "KRX",
          "country": "한국",
          "reason": "글로벌 기술 대기업으로 재무 건전성과 안정적 배당을 바탕으로 보수적 포트폴리오에 적합합니다."
        },
        {
          "category": "dividend",
          "name": "Johnson & Johnson",
          "ticker": "JNJ",
          "market": "NYSE",
          "country": "미국",
          "reason": "헬스케어 분야의 대표적 고배당주로 꾸준한 배당 인상과 안정적인 수익을 제공합니다."
        }
      ],
      "recommendedCrypto": [
        {
          "name": "비트코인",
          "symbol": "BTC",
          "reason": "가장 안정적인 암호화폐로 보수형 투자자에게 적합한 소량 투자 대상입니다."
        },
        {
          "name": "이더리움",
          "symbol": "ETH",
          "reason": "스마트 컨트랙트 플랫폼 기반의 대표적 암호화폐입니다."
        }
      ]
    },
    "keyFindings": [
      "보수형 투자자는 안정성과 원금 보호를 최우선으로 한다.",
      "채권과 배당주 중심의 포트폴리오로 꾸준한 수익을 추구한다.",
      "급락장에서도 흔들리지 않는 심리적 안정감이 장점이다."
    ]
  },
  "stability_focused": {
    "investmentType": "stability_focused",
    "confidence": 88,
    "analysis": {
      "description": "안정추구형 투자자는 변동성을 최소화하면서도 꾸준한 수익을 추구하는 성향입니다. 시장 변동에 민감하지 않은 안정적인 자산을 선호하며, 장기적인 관점에서 자산을 운용합니다.",
      "advantages": "꾸준한 수익 창출과 낮은 변동성으로 안정적인 자산 운용이 가능합니다.",
      "disadvantages": "시장 상승 시 기회를 놓칠 수 있으며, 인플레이션 위험에 노출될 수 있습니다.",
      "improvements": "적절한 성장 자산 편입으로 수익성을 높이고, 정기적인 리밸런싱을 통해 포트폴리오를 관리하세요.",
      "portfolio": {
        "stocks": 35,
        "bonds": 45,
        "cash": 15,
        "reits": 4,
        "crypto": 1,
        "reason": "안정추구형은 채권 비중을 높여 안정성을 확보하면서도 우량주를 통해 일정한 수익을 추구합니다.",
        "stockAllocation": {
          "dividendStocks": 20,
          "growthStocks": 10,
          "themeStocks": 3,
          "valueStocks": 2,
          "reason": "안정적인 배당주 중심으로 구성하여 변동성을 최소화합니다."
        }
      },
      "recommendedStocks": [
        {
          "category": "dividend",
          "name": "삼성전자",
          "ticker": "005930",
          "market": "KRX",
          "country": "한국",
          "reason": "안정적인 배당과 대형주 안정성을 제공합니다."
        }
      ],
      "recommendedCrypto": [
        {
          "name": "비트코인",
          "symbol": "BTC",
          "reason": "가장 안정적인 암호화폐입니다."
        }
      ]
    },
    "keyFindings": [
      "안정추구형 투자자는 변동성을 최소화하면서 꾸준한 수익을 추구한다.",
      "채권과 우량주 중심의 안정적인 포트폴리오를 구성한다.",
      "장기적인 관점에서 자산을 운용한다."
    ]
  }
  // 실제 사용 시 모든 성향에 대한 데이터 포함 필요
};

export function onRequestPost(context) {
  var request = context.request;
  var env = context.env;
  
  // CORS 헤더 설정 (모바일 환경 최적화)
  var corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Cache-Control, Pragma',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  };
  
  return new Promise(function(resolve, reject) {
    try {
      // OPTIONS 요청 처리 (CORS preflight)
      if (request.method === 'OPTIONS') {
        resolve(new Response(null, { headers: corsHeaders }));
        return;
      }

      // POST 요청 처리
      if (request.method !== 'POST') {
        resolve(new Response(JSON.stringify({ error: '잘못된 요청 방법입니다.' }), {
          status: 405,
          headers: corsHeaders
        }));
        return;
      }

      request.json().then(function(data) {
        var groupAnswers = data.groupAnswers;
        var detailAnswers = data.detailAnswers;
        var selectedGroup = data.selectedGroup;

        // 2단계 설문 데이터 검증
        if (!groupAnswers || !Array.isArray(groupAnswers) || groupAnswers.length !== 9) {
          resolve(new Response(JSON.stringify({ error: '1단계 설문 데이터가 유효하지 않습니다.' }), {
            status: 400,
            headers: corsHeaders
          }));
          return;
        }

        // 성향군별 예상 답변 개수 계산
        var expectedAnswerCount = getExpectedAnswerCount(selectedGroup);

        if (!detailAnswers || !Array.isArray(detailAnswers) || detailAnswers.length !== expectedAnswerCount) {
          resolve(new Response(JSON.stringify({ 
            error: '2단계 설문 데이터가 유효하지 않습니다. 성향군 ' + selectedGroup + '에 대해 ' + expectedAnswerCount + '개의 답변이 필요합니다.' 
          }), {
            status: 400,
            headers: corsHeaders
          }));
          return;
        }

        if (!selectedGroup || !groupMapping[selectedGroup]) {
          resolve(new Response(JSON.stringify({ error: '유효하지 않은 성향군입니다.' }), {
            status: 400,
            headers: corsHeaders
          }));
          return;
        }

        // 1단계 설문 결과를 텍스트로 변환
        var groupQuestions = [
          { id: 1, question: "투자 시 원금 손실은 절대 감수할 수 없다.", group: "stability" },
          { id: 2, question: "높은 수익률보다는 꾸준하고 안정적인 수익을 얻는 것이 훨씬 중요하다.", group: "stability" },
          { id: 3, question: "투자자산 대부분을 예금이나 채권 등 안전자산에 투자하고 싶다.", group: "stability" },
          { id: 4, question: "투자할 때 기업의 성장 가능성이나 장기적 가치 상승을 가장 중요하게 생각한다.", group: "profit" },
          { id: 5, question: "저평가된 가치주나, 펀더멘탈이 탄탄한 기업을 찾아 투자한다.", group: "profit" },
          { id: 6, question: "친환경, 사회적 책임(ESG) 등 사회적 가치가 높은 기업에 투자하고 싶다.", group: "profit" },
          { id: 7, question: "높은 투자 수익을 위해 상당한 위험과 가격 변동성을 적극 감수할 수 있다.", group: "aggressive" },
          { id: 8, question: "시장의 단기적인 변동을 이용해 자주 거래하는 것이 좋다.", group: "aggressive" },
          { id: 9, question: "신기술이나 신산업 등 혁신적인 분야에 대한 투자에 매우 관심이 많다.", group: "aggressive" }
        ];

        var groupResultsText = groupQuestions.map(function(q, index) {
          return (index + 1) + '. [' + q.group + '] ' + q.question + '\n답변: ' + groupAnswers[index] + '점';
        }).join('\n\n');

        // 2단계 설문 결과를 텍스트로 변환 (선택된 성향군 기반)
        var detailQuestionsByGroup = {
          stability: [
            "투자자금의 원금이 조금이라도 줄어드는 것은 절대 용납할 수 없다.",
            "채권과 같이 일정하고 꾸준한 이자 수익을 주는 투자상품을 선호한다.",
            "꾸준히 배당을 주는 우량기업에 투자하는 것이 가장 중요하다.",
            "주식과 채권, 현금성 자산을 적절히 분산 투자하는 것이 가장 효과적이라고 생각한다."
          ],
          profit: [
            "단기적인 손실을 보더라도 장기적으로 성장할 가능성이 큰 기업에 투자하고 싶다.",
            "기업의 재무제표, 이익, 부채 비율 등을 철저히 분석하여 투자한다.",
            "환경보호, 윤리경영, ESG 점수가 높은 기업에 투자하는 것이 중요하다.",
            "수익률이 다소 낮더라도 환경과 사회에 긍정적인 영향을 미치는 기업에 투자한다."
          ],
          aggressive: [
            "매우 높은 수익을 얻기 위해서는 큰 손실도 적극 감수할 수 있다.",
            "신기술이나 혁신을 주도할 기업 및 산업에 투자하는 것이 매우 매력적이다.",
            "단기적으로 높은 수익을 얻기 위해 잦은 거래와 매매를 선호한다.",
            "레버리지나 마진거래와 같은 고위험 단기 전략을 자주 활용한다."
          ]
        };

        var detailResultsText = detailQuestionsByGroup[selectedGroup].map(function(q, index) {
          return (index + 1) + '. ' + q + '\n답변: ' + detailAnswers[index] + '점';
        }).join('\n\n');

        // GPT에게 보낼 프롬프트 구성
        var prompt = createPrompt(selectedGroup, groupAnswers, detailAnswers, groupResultsText, detailResultsText);

        // 상세 디버깅 로그
        console.log('=== 2단계 설문 GPT 분석 디버그 시작 ===');
        console.log('1. API 키 확인:', env.OPENAI_API_KEY ? 'API 키 있음' : 'API 키 없음');
        console.log('2. 선택된 성향군:', selectedGroup);
        console.log('3. 1단계 답변:', groupAnswers);
        console.log('4. 2단계 답변:', detailAnswers);
        console.log('5. 예상 답변 개수:', expectedAnswerCount);
        console.log('6. 실제 답변 개수:', detailAnswers.length);
        console.log('7. 프롬프트 길이:', prompt.length);

        if (!env.OPENAI_API_KEY) {
          console.error('❌ OPENAI_API_KEY 환경 변수가 설정되지 않았습니다!');
          throw new Error('OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.');
        }

        console.log('8. OpenAI API 호출 시작...');
        
        // 모바일 네트워크 환경을 고려한 타임아웃 설정
        var controller = new AbortController();
        var timeoutId = setTimeout(function() {
          controller.abort();
        }, 90000); // 90초 타임아웃
        
        // ============================================
        // 🚫 기존 OpenAI API 호출 주석처리 시작
        // ============================================
        /*
        // OpenAI API 호출
        fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + env.OPENAI_API_KEY,
            'Content-Type': 'application/json',
            'User-Agent': 'SmartInvest/1.0 (2-Stage-Survey)',
            'Connection': 'keep-alive'
          },
          body: JSON.stringify({
            model: "gpt-4.1",
            messages: [
              {
                role: "system",
                content: "당신은 투자 전문가이자 금융 상담사입니다. 2단계 설문 결과를 바탕으로 1단계에서 선택된 성향군 내에서 2단계 답변을 분석하여 가장 적합한 세부 투자 성향을 결정해야 합니다. 새로운 10개 투자 성향 분류에 따라 정확한 분석을 제공하고, 요청된 JSON 형식으로만 응답하세요. 투자 성향 상세 설명(description)에는 점수나 수치 정보는 포함하지 말고, 순수하게 투자 성향의 특징과 행동 패턴만 500자 내외로 상세하게 설명해주세요."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.3,
            max_tokens: 6000
          }),
          signal: controller.signal
        }).then(function(openaiResponse) {
          clearTimeout(timeoutId);
          console.log('9. OpenAI API 응답 수신 - 상태:', openaiResponse.status);
          
          if (!openaiResponse.ok) {
            console.error('❌ OpenAI API 오류 - 상태 코드:', openaiResponse.status);
            throw new Error('OpenAI API 오류: ' + openaiResponse.status);
          }
          
          return openaiResponse.json();
        }).then(function(openaiData) {
          console.log('10. OpenAI API 데이터 처리 완료');
          
          var gptResponse = openaiData.choices[0] && openaiData.choices[0].message && openaiData.choices[0].message.content;
          
          if (!gptResponse) {
            console.error('❌ GPT API 응답이 없습니다');
            throw new Error('GPT API 응답이 없습니다.');
          }

          console.log('11. GPT 응답 길이:', gptResponse.length);

          // JSON 파싱
          var analysisResult;
          try {
            analysisResult = JSON.parse(gptResponse);
            console.log('✅ 2단계 설문 GPT 분석 성공!', { 
              investmentType: analysisResult.investmentType, 
              selectedGroup: selectedGroup,
              detailAnswerCount: detailAnswers.length,
              expectedAnswerCount: expectedAnswerCount
            });
          } catch (parseError) {
            console.error('❌ GPT 응답 파싱 에러:', parseError.message);
            throw new Error('GPT 응답을 파싱할 수 없습니다.');
          }

          // 투자 성향 프로필 가져오기
          var profileType = analysisResult.investmentType;
          var baseProfile = investmentProfiles[profileType];
          
          if (!baseProfile) {
            throw new Error('유효하지 않은 투자 성향 타입입니다.');
          }

          // GPT 분석 결과와 기본 프로필 결합
          var enhancedProfile = {
            type: baseProfile.type,
            name: baseProfile.name,
            description: baseProfile.description,
            riskLevel: baseProfile.riskLevel,
            expectedReturn: baseProfile.expectedReturn,
            recommendedAssets: baseProfile.recommendedAssets,
            characteristics: baseProfile.characteristics,
            gptAnalysis: analysisResult.analysis,
            confidence: analysisResult.confidence,
            keyFindings: analysisResult.keyFindings
          };

          resolve(new Response(JSON.stringify({
            success: true,
            profile: enhancedProfile,
            rawAnswers: {
              groupAnswers: groupAnswers,
              detailAnswers: detailAnswers,
              selectedGroup: selectedGroup
            },
            questionCounts: {
              groupQuestions: 9,
              detailQuestions: expectedAnswerCount,
              total: 9 + expectedAnswerCount
            }
          }), {
            headers: corsHeaders
          }));

        }).catch(function(error) {
          clearTimeout(timeoutId);
          console.error('=== OpenAI API 오류 발생 ===');
          console.error('❌ 에러:', error.message);
          
          // 에러 발생 시 기본 분석으로 폴백
          var fallbackProfile = determineDetailType(selectedGroup, detailAnswers);
          console.log('⚠️ Fallback 분석 사용 - 선택된 프로필:', fallbackProfile.type);
          
          var fallbackAnalysis = {
            description: "AI 분석을 사용할 수 없어 기본 분석을 제공합니다. 설문 점수를 기반으로 한 간단한 분석 결과입니다.",
            advantages: "설문 결과를 바탕으로 한 기본적인 투자 성향 분석이 제공됩니다.",
            disadvantages: "더 정확한 분석을 위해서는 AI 분석 서비스를 이용해주세요.",
            improvements: "AI 분석 서비스를 통해 더 구체적이고 개인화된 투자 전략을 제공받을 수 있습니다.",
            portfolio: {
              stocks: fallbackProfile.recommendedAssets.stocks,
              bonds: fallbackProfile.recommendedAssets.bonds,
              cash: fallbackProfile.recommendedAssets.cash,
              reits: 0,
              crypto: fallbackProfile.recommendedAssets.alternatives,
              reason: "기본 분석 결과를 바탕으로 한 일반적인 자산 배분 제안입니다.",
              stockAllocation: {
                dividendStocks: 40,
                growthStocks: 30,
                themeStocks: 20,
                valueStocks: 10,
                reason: "안정적인 배당주 위주의 기본 배분입니다."
              }
            },
            recommendedStocks: [
              {
                category: "dividend",
                name: "삼성전자",
                ticker: "005930",
                market: "KRX",
                country: "한국",
                reason: "안정적인 배당 수익률과 대형주 안정성을 제공하는 대표 종목입니다."
              },
              {
                category: "growth",
                name: "네이버",
                ticker: "035420",
                market: "KRX",
                country: "한국",
                reason: "국내 IT 대표 기업으로 지속적인 성장 잠재력을 보유하고 있습니다."
              }
            ],
            recommendedCrypto: [
              {
                name: "비트코인",
                symbol: "BTC",
                reason: "가장 안정적인 암호화폐입니다."
              },
              {
                name: "이더리움",
                symbol: "ETH",
                reason: "스마트 컨트랙트 플랫폼 기반 코인입니다."
              },
              {
                name: "바이낸스 코인",
                symbol: "BNB",
                reason: "세계 최대 거래소 토큰입니다."
              }
            ]
          };
          
          resolve(new Response(JSON.stringify({
            success: true,
            profile: {
              type: fallbackProfile.type,
              name: fallbackProfile.name,
              description: fallbackProfile.description,
              riskLevel: fallbackProfile.riskLevel,
              expectedReturn: fallbackProfile.expectedReturn,
              recommendedAssets: fallbackProfile.recommendedAssets,
              characteristics: fallbackProfile.characteristics,
              gptAnalysis: fallbackAnalysis,
              confidence: 70,
              keyFindings: [
                "기본 점수 분석 기반 결과",
                "AI 분석 서비스 이용 권장",
                "추가 상담을 통한 정밀 분석 필요"
              ]
            },
            rawAnswers: {
              groupAnswers: groupAnswers,
              detailAnswers: detailAnswers,
              selectedGroup: selectedGroup
            },
            questionCounts: {
              groupQuestions: 9,
              detailQuestions: expectedAnswerCount,
              total: 9 + expectedAnswerCount
            },
            fallback: true,
            fallbackReason: error.message || 'OpenAI API 오류'
          }), {
            headers: corsHeaders
          }));
        });
        */
        // ============================================
        // 🚫 기존 OpenAI API 호출 주석처리 끝
        // ============================================
        
        // ============================================
        // ✅ 새로운 preGeneratedAnalysis 사용 시작
        // ============================================
        
        console.log('✅ preGeneratedAnalysis 사용으로 GPT 분석 대체');
        
        // 1단계 성향군에서 2단계 답변을 기반으로 세부 성향 결정
        var fallbackProfile = determineDetailType(selectedGroup, detailAnswers);
        var profileType = fallbackProfile.type;
        
        // preGeneratedAnalysisData에서 해당 성향의 데이터 가져오기
        var preGeneratedData = preGeneratedAnalysisData[profileType];
        
        if (!preGeneratedData) {
          console.log('⚠️ preGeneratedAnalysisData에서 ' + profileType + ' 성향 데이터를 찾을 수 없음. 기본 분석 사용');
          
          // 기본 분석 사용
          var basicAnalysis = {
            description: "기본 분석을 사용합니다. 설문 점수를 기반으로 한 간단한 분석 결과입니다.",
            advantages: "설문 결과를 바탕으로 한 기본적인 투자 성향 분석이 제공됩니다.",
            disadvantages: "더 정확한 분석을 위해서는 상세 분석 데이터가 필요합니다.",
            improvements: "보다 구체적이고 개인화된 투자 전략이 필요합니다.",
            portfolio: {
              stocks: fallbackProfile.recommendedAssets.stocks,
              bonds: fallbackProfile.recommendedAssets.bonds,
              cash: fallbackProfile.recommendedAssets.cash,
              reits: 0,
              crypto: fallbackProfile.recommendedAssets.alternatives,
              reason: "기본 분석 결과를 바탕으로 한 일반적인 자산 배분 제안입니다.",
              stockAllocation: {
                dividendStocks: 40,
                growthStocks: 30,
                themeStocks: 20,
                valueStocks: 10,
                reason: "안정적인 배당주 위주의 기본 배분입니다."
              }
            },
            recommendedStocks: [
              {
                category: "dividend",
                name: "삼성전자",
                ticker: "005930",
                market: "KRX",
                country: "한국",
                reason: "안정적인 배당 수익률과 대형주 안정성을 제공하는 대표 종목입니다."
              }
            ],
            recommendedCrypto: [
              {
                name: "비트코인",
                symbol: "BTC",
                reason: "가장 안정적인 암호화폐입니다."
              }
            ]
          };
          
          resolve(new Response(JSON.stringify({
            success: true,
            profile: {
              type: fallbackProfile.type,
              name: fallbackProfile.name,
              description: fallbackProfile.description,
              riskLevel: fallbackProfile.riskLevel,
              expectedReturn: fallbackProfile.expectedReturn,
              recommendedAssets: fallbackProfile.recommendedAssets,
              characteristics: fallbackProfile.characteristics,
              gptAnalysis: basicAnalysis,
              confidence: 70,
              keyFindings: [
                "기본 점수 분석 기반 결과",
                "상세 분석 데이터 필요",
                "추가 상담을 통한 정밀 분석 권장"
              ]
            },
            rawAnswers: {
              groupAnswers: groupAnswers,
              detailAnswers: detailAnswers,
              selectedGroup: selectedGroup
            },
            questionCounts: {
              groupQuestions: 9,
              detailQuestions: expectedAnswerCount,
              total: 9 + expectedAnswerCount
            },
            dataSource: 'basicAnalysis'
          }), {
            headers: corsHeaders
          }));
          return;
        }
        
        // preGeneratedAnalysisData 사용
        console.log('📊 preGeneratedAnalysis 분석 결과:', { 
          investmentType: preGeneratedData.investmentType, 
          selectedGroup: selectedGroup,
          detailAnswerCount: detailAnswers.length,
          expectedAnswerCount: expectedAnswerCount,
          source: 'preGeneratedAnalysis'
        });
        
        // 기존 분석 결과 구조에 맞게 데이터 변환
        var analysisResult = {
          investmentType: preGeneratedData.investmentType,
          confidence: preGeneratedData.confidence,
          analysis: preGeneratedData.analysis,
          keyFindings: preGeneratedData.keyFindings
        };
        
        // 투자 성향 프로필 가져오기
        var baseProfile = investmentProfiles[profileType];
        
        if (!baseProfile) {
          throw new Error('유효하지 않은 투자 성향 타입입니다.');
        }

        // 분석 결과와 기본 프로필 결합
        var enhancedProfile = {
          type: baseProfile.type,
          name: baseProfile.name,
          description: baseProfile.description,
          riskLevel: baseProfile.riskLevel,
          expectedReturn: baseProfile.expectedReturn,
          recommendedAssets: baseProfile.recommendedAssets,
          characteristics: baseProfile.characteristics,
          gptAnalysis: analysisResult.analysis,
          confidence: analysisResult.confidence,
          keyFindings: analysisResult.keyFindings
        };

        resolve(new Response(JSON.stringify({
          success: true,
          profile: enhancedProfile,
          rawAnswers: {
            groupAnswers: groupAnswers,
            detailAnswers: detailAnswers,
            selectedGroup: selectedGroup
          },
          questionCounts: {
            groupQuestions: 9,
            detailQuestions: expectedAnswerCount,
            total: 9 + expectedAnswerCount
          },
          dataSource: 'preGeneratedAnalysis'
        }), {
          headers: corsHeaders
        }));
        
        // ============================================
        // ✅ 새로운 preGeneratedAnalysis 사용 끝
        // ============================================

      }).catch(function(error) {
        console.error('요청 파싱 에러:', error);
        resolve(new Response(JSON.stringify({ error: '유효하지 않은 요청 데이터입니다.' }), {
          status: 400,
          headers: corsHeaders
        }));
      });

    } catch (error) {
      console.error('일반 에러:', error);
      resolve(new Response(JSON.stringify({ 
        error: '분석 중 오류가 발생했습니다.',
        details: error.message || 'Unknown error'
      }), {
        status: 500,
        headers: corsHeaders
      }));
    }
  });
}

 