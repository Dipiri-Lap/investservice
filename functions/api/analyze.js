// 2단계 설문 시스템용 프롬프트 생성 함수 (ES5 호환)
function createPrompt(selectedGroup, groupAnswers, detailAnswers, groupResultsText, detailResultsText) {
  var prompt = '';
  
  // 프롬프트 시작 부분
  prompt += '다음은 2단계 투자 성향 분석을 위한 설문 결과입니다. 1단계에서 성향군을 결정하고, 2단계에서 세부 성향을 파악한 결과를 종합적으로 분석하여 투자자의 성향을 정확히 판단해주세요.\n\n';
  
  // 1단계 설문 결과
  prompt += '**1단계: 성향군 구분 설문 (9문항)**\n';
  prompt += '선택된 성향군: ' + selectedGroup + '\n\n';
  prompt += '1단계 설문 결과:\n' + groupResultsText + '\n\n';
  
  // 2단계 설문 결과
  prompt += '**2단계: 세부 성향 구분 설문 (선택된 성향군 내 4문항)**\n';
  prompt += '2단계 설문 결과:\n' + detailResultsText + '\n\n';
  
  // 투자 성향 분류 기준 (새로운 10개 성향)
  prompt += '투자 성향 분류 기준:\n\n';
  prompt += '**안정추구형 성향군 (stability):**\n';
  prompt += '1. 보수형 (conservative): 원금 보장을 최우선으로 하며, 안전성을 중시하는 투자 성향\n';
  prompt += '2. 안정추구형 (stability_focused): 안정적인 수익을 추구하며, 변동성을 최소화하는 투자 성향\n';
  prompt += '3. 배당중시형 (dividend_focused): 배당 수익을 중시하며, 꾸준한 현금 흐름을 추구하는 투자 성향\n';
  prompt += '4. 균형형 (balanced): 안정성과 수익성의 균형을 추구하며, 분산 투자를 선호하는 성향\n\n';
  
  prompt += '**수익추구형 성향군 (profit):**\n';
  prompt += '5. 성장지향형 (growth_oriented): 장기적 자산 성장을 목표로 하며, 성장 가능성을 중시하는 투자 성향\n';
  prompt += '6. 가치중시형 (value_focused): 저평가된 가치주를 선호하며, 펀더멘털 분석을 중시하는 투자 성향\n';
  prompt += '7. 사회책임투자형 (esg_focused): ESG 요소를 고려하며, 사회적 가치와 지속가능성을 중시하는 투자 성향\n\n';
  
  prompt += '**적극적/투기형 성향군 (aggressive):**\n';
  prompt += '8. 공격형 (aggressive): 높은 위험을 감수하며, 공격적인 투자 전략을 선호하는 성향\n';
  prompt += '9. 혁신추구형 (innovation_focused): 혁신적인 기술과 신성장 분야에 투자하며, 미래 가치를 추구하는 성향\n';
  prompt += '10. 단기차익추구형 (short_term_profit_focused): 단기적인 차익 실현을 목표로 하며, 활발한 매매를 선호하는 성향\n\n';
  
  // 분석 요청사항
  prompt += '분석 요청사항:\n';
  prompt += '1. 1단계에서 선택된 성향군 "' + selectedGroup + '"을 기반으로 하여 해당 성향군 내의 4가지 세부 성향 중 가장 적합한 것을 선택해주세요.\n';
  prompt += '2. 2단계 설문 결과에서 각 세부 성향별 점수를 계산하고, 가장 높은 점수의 성향을 우선 선택하되, 답변 패턴을 종합적으로 고려해주세요.\n';
  prompt += '3. 위험 감수 능력, 투자 목적, 투자 경험, 자산 현황, 심리적 특성, 투자 전략을 종합적으로 고려해주세요.\n';
  prompt += '4. 각 투자 성향별 특징을 구체적으로 설명하고, 투자 행동과 심리적 특성을 반영해주세요.\n';
  prompt += '5. 투자 성향 상세 설명(description)에는 점수나 수치 정보는 포함하지 말고, 순수하게 투자 성향의 특징과 행동 패턴만 설명해주세요.\n';
  prompt += '6. 포트폴리오 구성 시 주식, 채권, 현금, 부동산(REITs), 암호화폐 비중을 총 100%로 맞춰주세요.\n';
  prompt += '7. 주식 투자 부분에 대해서는 투자 성향에 맞는 세부 배분을 제공해주세요 (배당주, 성장주, 테마주, 가치주의 비중을 %로 표시하며, 총합이 100%가 되도록).\n';
  prompt += '   - 안정추구형 성향군: 배당주 40-60%, 가치주 25-35%, 성장주 10-20%, 테마주 5-15%\n';
  prompt += '   - 수익추구형 성향군: 성장주 35-45%, 가치주 25-35%, 배당주 15-25%, 테마주 15-25%\n';
  prompt += '   - 적극적/투기형 성향군: 성장주 30-40%, 테마주 25-40%, 가치주 15-25%, 배당주 10-20%\n';
  prompt += '8. 각 주식 유형별로 한국 3개, 미국 3개씩 총 6개를 추천해주세요 (배당주, 성장주, 테마주, 가치주 각각 국가별 3개씩).\n';
  prompt += '9. 추천 주식 종목은 분석 당일 날짜를 기준으로 검색하여 최신 트렌드를 고려하여 투자 성향에 맞는 다양성을 고려해주세요.\n';
  prompt += '10. 각 종목에는 반드시 ticker(종목코드), 국가(한국/미국), 거래소(KRX/NYSE/NASDAQ), 추천 이유를 포함해주세요.\n';
  prompt += '11. 분석 당일 날짜를 토대로 검색하여 주식 트렌드를 반영하여 추천.\n';
  prompt += '12. 투자 성향에 따라 보수적이면 안전한 대형주, 공격적이면 성장주나 테마주를 추천해주세요.\n';
  prompt += '13. 암호화폐도 투자 성향에 맞게 3-5개를 추천해주세요 (보수적이면 비트코인/이더리움 위주, 공격적이면 알트코인 포함). 각 암호화폐에는 반드시 symbol(티커)을 포함해주세요.\n';
  prompt += '14. 1억원을 기준으로 한 구체적인 포트폴리오 예시를 제공해주세요.\n';
  prompt += '15. 투자 성향에 따른 투자 기간과 각 기간별 행동지침을 제공해주세요.\n';
  prompt += '16. 투자 전략 섹션을 포함해주세요.\n';
  prompt += '17. 모든 답변은 전문적이고 구체적인 어투로 작성해주세요.\n\n';
  
  // JSON 형식 요청
  prompt += '다음 JSON 형식으로만 응답해주세요:\n';
  prompt += '{"investmentType": "해당_투자_성향", "confidence": 85, "analysis": {"description": "상세설명", "advantages": "장점", "disadvantages": "단점", "improvements": "개선사항", "portfolio": {"stocks": 40, "bonds": 30, "cash": 15, "reits": 10, "crypto": 5, "reason": "이유", "stockAllocation": {"dividendStocks": 40, "growthStocks": 30, "themeStocks": 20, "valueStocks": 10, "reason": "이유"}}, "recommendedStocks": {"dividend": [{"name": "종목명", "ticker": "종목코드", "country": "한국", "market": "KRX", "reason": "추천이유"}], "growth": [성장주_6개_배열], "theme": [테마주_6개_배열], "value": [가치주_6개_배열]}, "portfolioExample": {"totalAmount": 100000000, "breakdown": [{"category": "주식", "percentage": 40, "amount": 40000000, "investments": [{"name": "종목명", "shares": "수량", "estimatedValue": "예상가치"}]}]}, "recommendedCrypto": [{"name": "암호화폐명", "symbol": "심볼", "reason": "추천이유"}], "actionGuide": {"investmentHorizon": {"primary": "투자기간", "description": "설명"}, "monthly": {"title": "매월", "actions": ["행동1", "행동2", "행동3"]}, "quarterly": {"title": "분기별", "actions": ["행동1", "행동2", "행동3"]}, "semiannual": {"title": "반기별", "actions": ["행동1", "행동2", "행동3"]}, "annual": {"title": "년도별", "actions": ["행동1", "행동2", "행동3"]}}, "investmentStrategy": {"assetAllocation": {"summary": "초보자 요약", "keyPoints": ["포인트1", "포인트2"], "warnings": ["주의사항1", "주의사항2"], "actionGuide": ["가이드1", "가이드2"], "adjustmentByType": {"conservative": "보수적 조정", "balanced": "균형형 조정", "aggressive": "공격적 조정"}}, "stockInvestment": {"summary": "초보자 요약", "keyPoints": ["포인트1", "포인트2"], "warnings": ["주의사항1", "주의사항2"], "actionGuide": ["가이드1", "가이드2"], "adjustmentByType": {"conservative": "보수적 조정", "balanced": "균형형 조정", "aggressive": "공격적 조정"}}, "bondInvestment": {"summary": "초보자 요약", "keyPoints": ["포인트1", "포인트2"], "warnings": ["주의사항1", "주의사항2"], "actionGuide": ["가이드1", "가이드2"], "adjustmentByType": {"conservative": "보수적 조정", "balanced": "균형형 조정", "aggressive": "공격적 조정"}}, "alternativeInvestment": {"summary": "초보자 요약", "keyPoints": ["포인트1", "포인트2"], "warnings": ["주의사항1", "주의사항2"], "actionGuide": ["가이드1", "가이드2"], "adjustmentByType": {"conservative": "보수적 조정", "balanced": "균형형 조정", "aggressive": "공격적 조정"}}, "riskManagement": {"summary": "초보자 요약", "keyPoints": ["포인트1", "포인트2"], "warnings": ["주의사항1", "주의사항2"], "actionGuide": ["가이드1", "가이드2"], "adjustmentByType": {"conservative": "보수적 조정", "balanced": "균형형 조정", "aggressive": "공격적 조정"}}, "psychologyManagement": {"summary": "초보자 요약", "keyPoints": ["포인트1", "포인트2"], "warnings": ["주의사항1", "주의사항2"], "actionGuide": ["가이드1", "가이드2"], "adjustmentByType": {"conservative": "보수적 조정", "balanced": "균형형 조정", "aggressive": "공격적 조정"}}}}, "keyFindings": ["발견사항1", "발견사항2", "발견사항3"]}';
  
  return prompt;
}

// 성향군 매핑 (ES5 호환)
var groupMapping = {
  stability: ['conservative', 'stability_focused', 'dividend_focused', 'balanced'],
  profit: ['growth_oriented', 'value_focused', 'esg_focused'],
  aggressive: ['aggressive', 'innovation_focused', 'short_term_profit_focused']
};

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

        if (!detailAnswers || !Array.isArray(detailAnswers) || detailAnswers.length !== 4) {
          resolve(new Response(JSON.stringify({ error: '2단계 설문 데이터가 유효하지 않습니다.' }), {
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
        console.log('5. 프롬프트 길이:', prompt.length);

        if (!env.OPENAI_API_KEY) {
          console.error('❌ OPENAI_API_KEY 환경 변수가 설정되지 않았습니다!');
          throw new Error('OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.');
        }

        console.log('6. OpenAI API 호출 시작...');
        
        // 모바일 네트워크 환경을 고려한 타임아웃 설정
        var controller = new AbortController();
        var timeoutId = setTimeout(function() {
          controller.abort();
        }, 90000); // 90초 타임아웃
        
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
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "당신은 투자 전문가이자 금융 상담사입니다. 2단계 설문 시스템을 통해 수집된 데이터를 분석하여 투자자의 성향을 정확히 분류하고, 맞춤형 투자 전략을 제공해야 합니다. 반드시 요청된 JSON 형식으로만 응답하세요."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.3,
            max_tokens: 10000
          }),
          signal: controller.signal
        }).then(function(openaiResponse) {
          clearTimeout(timeoutId);
          console.log('7. OpenAI API 응답 수신 - 상태:', openaiResponse.status);
          
          if (!openaiResponse.ok) {
            console.error('❌ OpenAI API 오류 - 상태 코드:', openaiResponse.status);
            throw new Error('OpenAI API 오류: ' + openaiResponse.status);
          }
          
          return openaiResponse.json();
        }).then(function(openaiData) {
          console.log('8. OpenAI API 데이터 처리 완료');
          
          var gptResponse = openaiData.choices[0] && openaiData.choices[0].message && openaiData.choices[0].message.content;
          
          if (!gptResponse) {
            console.error('❌ GPT API 응답이 없습니다');
            throw new Error('GPT API 응답이 없습니다.');
          }

          console.log('9. GPT 응답 길이:', gptResponse.length);

          // JSON 파싱
          var analysisResult;
          try {
            analysisResult = JSON.parse(gptResponse);
            console.log('✅ 2단계 설문 GPT 분석 성공!', { 
              investmentType: analysisResult.investmentType,
              selectedGroup: selectedGroup 
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
            selectedGroup: selectedGroup,
            groupAnswers: groupAnswers,
            detailAnswers: detailAnswers
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
          
          // 기본 분석 결과 생성
          var fallbackAnalysis = {
            description: "AI 분석을 사용할 수 없어 기본 분석을 제공합니다. 2단계 설문 점수를 기반으로 한 간단한 분석 결과입니다.",
            advantages: "설문 결과를 바탕으로 한 기본적인 투자 성향 분석이 제공됩니다.",
            disadvantages: "더 정확한 분석을 위해서는 AI 분석 서비스를 이용해주세요.",
            improvements: "AI 분석 서비스를 통해 더 구체적이고 개인화된 투자 전략을 제공받을 수 있습니다.",
            portfolio: {
              stocks: fallbackProfile.recommendedAssets.stocks,
              bonds: fallbackProfile.recommendedAssets.bonds,
              cash: fallbackProfile.recommendedAssets.cash,
              reits: fallbackProfile.recommendedAssets.alternatives,
              crypto: 5,
              reason: "기본 포트폴리오 구성입니다."
            }
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
                "기본 2단계 설문 분석 기반 결과",
                "AI 분석 서비스 이용 권장",
                "추가 상담을 통한 정밀 분석 필요"
              ]
            },
            selectedGroup: selectedGroup,
            groupAnswers: groupAnswers,
            detailAnswers: detailAnswers,
            fallback: true,
            fallbackReason: error.message || 'OpenAI API 오류'
          }), {
            headers: corsHeaders
          }));
        });

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

 