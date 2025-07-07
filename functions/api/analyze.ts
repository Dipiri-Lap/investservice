// Survey Questions Data (simplified version for Functions)
const surveyQuestions = [
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
  }
  // 나머지 24개 질문은 실제로는 프론트엔드에서 처리
];

// Investment Profiles (simplified)
const investmentProfiles = {
  ultra_ultra_conservative: {
    type: 'ultra_ultra_conservative',
    name: '초극보수형',
    description: '원금 보장을 절대 우선시하는 투자자',
    riskLevel: 1,
    expectedReturn: '1-2%',
    recommendedAssets: { stocks: 5, bonds: 70, cash: 25, alternatives: 0 }
  },
  ultra_conservative: {
    type: 'ultra_conservative', 
    name: '극보수형',
    description: '안전성을 최우선으로 하는 투자자',
    riskLevel: 2,
    expectedReturn: '2-3%',
    recommendedAssets: { stocks: 10, bonds: 65, cash: 20, alternatives: 5 }
  },
  conservative: {
    type: 'conservative',
    name: '보수형', 
    description: '안정성을 중시하는 투자자',
    riskLevel: 3,
    expectedReturn: '3-5%',
    recommendedAssets: { stocks: 20, bonds: 60, cash: 15, alternatives: 5 }
  },
  moderate_conservative: {
    type: 'moderate_conservative',
    name: '온건보수형',
    description: '안정성 기반의 적절한 위험 감수 투자자',
    riskLevel: 4,
    expectedReturn: '4-6%', 
    recommendedAssets: { stocks: 30, bonds: 50, cash: 15, alternatives: 5 }
  },
  balanced: {
    type: 'balanced',
    name: '균형형',
    description: '안정성과 수익성의 균형을 추구하는 투자자',
    riskLevel: 5,
    expectedReturn: '5-7%',
    recommendedAssets: { stocks: 40, bonds: 40, cash: 15, alternatives: 5 }
  },
  moderate_growth: {
    type: 'moderate_growth',
    name: '온건성장형',
    description: '성장성을 추구하되 적절한 안정성을 유지하는 투자자',
    riskLevel: 6,
    expectedReturn: '6-8%',
    recommendedAssets: { stocks: 50, bonds: 30, cash: 15, alternatives: 5 }
  },
  growth: {
    type: 'growth',
    name: '성장형',
    description: '장기적 자산 성장을 목표로 하는 투자자',
    riskLevel: 7,
    expectedReturn: '7-10%',
    recommendedAssets: { stocks: 60, bonds: 25, cash: 10, alternatives: 5 }
  },
  aggressive_growth: {
    type: 'aggressive_growth',
    name: '공격성장형',
    description: '높은 수익을 위해 큰 위험을 감수하는 투자자',
    riskLevel: 8,
    expectedReturn: '8-12%',
    recommendedAssets: { stocks: 70, bonds: 15, cash: 10, alternatives: 5 }
  },
  speculative_aggressive: {
    type: 'speculative_aggressive',
    name: '공격투기형',
    description: '투기적 투자도 감수하는 적극적 투자자',
    riskLevel: 9,
    expectedReturn: '10-15%',
    recommendedAssets: { stocks: 80, bonds: 10, cash: 5, alternatives: 5 }
  },
  ultra_speculative_aggressive: {
    type: 'ultra_speculative_aggressive',
    name: '극공격투기형', 
    description: '최대 수익을 위해 극도의 위험을 감수하는 투자자',
    riskLevel: 10,
    expectedReturn: '15%+',
    recommendedAssets: { stocks: 85, bonds: 5, cash: 5, alternatives: 5 }
  }
};

interface RequestBody {
  answers: number[];
}

export async function onRequestPost(context: any) {
  const { request, env } = context;
  
  // CORS 헤더 설정
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
  
  try {

    // OPTIONS 요청 처리 (CORS preflight)
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // POST 요청 처리
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: '잘못된 요청 방법입니다.' }), {
        status: 405,
        headers: corsHeaders
      });
    }

    const { answers }: RequestBody = await request.json();

    if (!answers || !Array.isArray(answers) || answers.length !== 25) {
      return new Response(JSON.stringify({ error: '유효하지 않은 답변 데이터입니다.' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // 설문 답변을 텍스트로 변환 (간소화)
    const surveyResults = answers.map((answerScore, index) => {
      return {
        questionNumber: index + 1,
        category: 'general',
        question: `질문 ${index + 1}`,
        selectedAnswer: `점수 ${answerScore}`,
        score: answerScore
      }
    });

    // 평균 점수 계산
    const totalScore = answers.reduce((sum: number, score: number) => sum + score, 0);
    const averageScore = totalScore / answers.length;

    // GPT에게 보낼 프롬프트 구성 (기존 route.ts와 동일)
    const prompt = `
다음은 투자 성향 분석을 위한 25문항 설문 결과입니다. 각 질문과 답변을 종합적으로 분석하여 투자자의 성향을 정확히 판단해주세요.

**평균 점수: ${averageScore.toFixed(2)}점 (총 ${totalScore}점 / 25문항)**

설문 결과:
${surveyResults.map(result => 
  `${result.questionNumber}. [${result.category}] ${result.question}
  답변: ${result.selectedAnswer} (점수: ${result.score})`
).join('\n\n')}

투자 성향 분류 기준 (점수 기반):
평균 점수 계산: 총 점수 / 25문항

1. 초극보수형 (ultra_ultra_conservative) - 평균 1.0~1.3: 원금 보장을 절대 우선시하며, 어떤 손실도 감수하지 않는 극도로 안전한 투자만 선호
2. 극보수형 (ultra_conservative) - 평균 1.4~1.6: 안전성을 최우선으로 하며, 최소한의 위험만 감수하여 안정적인 수익을 추구
3. 보수형 (conservative) - 평균 1.7~2.0: 안정성을 중시하면서도 약간의 위험을 감수하여 인플레이션을 상회하는 수익을 추구
4. 온건보수형 (moderate_conservative) - 평균 2.1~2.4: 안정성을 기반으로 하되, 적절한 위험을 감수하여 보다 나은 수익을 추구
5. 균형형 (balanced) - 평균 2.5~2.8: 안정성과 수익성의 균형을 추구하며, 중간 정도의 위험을 감수
6. 온건성장형 (moderate_growth) - 평균 2.9~3.2: 성장성을 추구하면서도 적절한 안정성을 유지하여 균형잡힌 포트폴리오를 선호
7. 성장형 (growth) - 평균 3.3~3.6: 장기적 자산 성장을 목표로 하며, 상당한 위험을 감수하여 높은 수익을 추구
8. 공격성장형 (aggressive_growth) - 평균 3.7~4.0: 높은 수익을 추구하며, 큰 위험을 감수하고 적극적인 투자 전략을 선호
9. 공격투기형 (speculative_aggressive) - 평균 4.1~4.4: 매우 높은 수익을 추구하며, 투기적 투자도 감수하는 적극적인 성향
10. 극공격투기형 (ultra_speculative_aggressive) - 평균 4.5~5.0: 최대 수익을 추구하며, 극도로 높은 위험과 투기적 투자를 마다하지 않는 성향

분석 요청사항:
1. 위에 제시된 평균 점수 ${averageScore.toFixed(2)}점을 기준으로 해당하는 점수 구간의 투자 성향을 우선 선택해주세요.
2. 그 다음 위험 감수 능력, 투자 목적, 투자 경험, 자산 현황, 심리적 특성, 투자 전략을 종합적으로 고려해주세요.
3. 점수 기준을 반드시 우선으로 하되, 답변 패턴이 극단적으로 다를 경우에만 인접 구간으로 조정 가능합니다.
4. 각 투자 성향별 특징을 구체적으로 설명하고, 투자 행동과 심리적 특성을 반영해주세요.
5. 투자 성향 상세 설명(description)에는 점수나 평균 점수와 같은 수치 정보는 포함하지 말고, 순수하게 투자 성향의 특징과 행동 패턴만 설명해주세요.
6. 포트폴리오 구성 시 주식, 채권, 현금, 부동산(REITs), 암호화폐 비중을 총 100%로 맞춰주세요.
7. 주식 투자 부분에 대해서는 투자 성향에 맞는 세부 배분을 제공해주세요 (배당주, 성장주, 테마주, 가치주의 비중을 %로 표시하며, 총합이 100%가 되도록). 
   - 보수적 성향: 배당주 50-70%, 가치주 20-30%, 성장주 10-20%, 테마주 0-10%
   - 균형 성향: 배당주 30-40%, 가치주 25-35%, 성장주 20-30%, 테마주 10-20%
   - 공격적 성향: 성장주 40-50%, 테마주 25-35%, 배당주 10-20%, 가치주 10-20%
8. 각 주식 유형별로 한국 3개, 미국 3개씩 총 6개를 추천해주세요 (배당주, 성장주, 테마주, 가치주 각각 국가별 3개씩).
9. 추천 주식 종목은 분석 당일 날짜를 기준으로 검색하여 최신 트렌드를 고려하여 투자 성향에 맞는 다양성을 고려해주세요.
10. 각 종목에는 국가(한국/미국), 거래소(KRX/NYSE/NASDAQ), 추천 이유를 포함해주세요.
11. 분석 당일일 날짜를 토대로 검색하여 주식 트렌드를 반영하여 추천.
12. 투자 성향에 따라 보수적이면 안전한 대형주, 공격적이면 성장주나 테마주를 추천해주세요.
13. 암호화폐도 투자 성향에 맞게 3-5개를 추천해주세요 (보수적이면 비트코인/이더리움 위주, 공격적이면 알트코인 포함).
14. 1억원을 기준으로 한 구체적인 포트폴리오 예시를 제공해주세요. 각 자산군별 금액, 추천 종목과 수량을 포함하여 실제 투자 가능한 형태로 작성해주세요.
15. 투자 성향에 따른 투자 기간(단기 1년 이하, 중기 1-5년, 장기 5년 이상)을 분석하고, 각 기간별 행동지침을 제공해주세요:
    - 월별: 기존 투자 자산 모니터링, 추가 투자금 확보 방법, 시장 상황 대응
    - 분기별: 포트폴리오 리밸런싱, 수익 실현/손절 기준, 새로운 투자 기회 발굴
    - 반기별: 투자 전략 재검토, 자산 배분 조정, 세금 최적화 방안
    - 년도별: 투자 목표 재설정, 장기 계획 수립, 투자 성과 종합 평가
    각 기간별로 투자 성향에 맞는 구체적이고 실행 가능한 행동 방안을 제시해주세요.
16. 모든 답변은 전문적이고 구체적인 어투로 200-300자 분량으로 작성해주세요.

다음 JSON 형식으로만 응답해주세요:
{
  "investmentType": "ultra_ultra_conservative|ultra_conservative|conservative|moderate_conservative|balanced|moderate_growth|growth|aggressive_growth|speculative_aggressive|ultra_speculative_aggressive",
  "confidence": 85,
  "analysis": {
    "description": "투자 성향의 핵심 특징, 투자 행동 패턴, 심리적 특성, 투자 목표, 위험 감내도, 의사결정 과정, 시장 변동에 대한 반응, 선호하는 투자 방식, 투자 경험 수준, 학습 의지 등을 포함하여 500자 내외로 매우 상세하고 구체적으로 설명",
    "advantages": "해당 성향의 투자 강점과 긍정적 측면 (200-300자)",
    "disadvantages": "투자 시 주의할 점과 보완할 부분 (200-300자)",
    "improvements": "투자자에게 도움이 될 구체적인 행동 지침 및 전략 개선 제안 (200-300자)",
    "portfolio": {
      "stocks": 40,
      "bonds": 30,
      "cash": 15,
      "reits": 10,
      "crypto": 5,
      "reason": "포트폴리오 구성 이유와 비중 설명 (200-300자)",
      "stockAllocation": {
        "dividendStocks": 50,
        "growthStocks": 25,
        "themeStocks": 15,
        "valueStocks": 10,
        "reason": "투자 성향에 맞는 주식 내 세부 배분 이유와 각 유형별 비중 설명 (100-150자)"
      }
    },
    "recommendedStocks": [
      {
        "category": "dividend",
        "name": "배당주 기업명",
        "ticker": "종목코드",
        "market": "KRX 또는 NYSE/NASDAQ",
        "country": "한국 또는 미국",
        "reason": "배당 수익률, 안정성 등 추천 이유 (100-150자)"
      }
    ],
    "portfolioExample": {
      "totalAmount": 100000000,
      "breakdown": [
        {
          "category": "주식",
          "percentage": 40,
          "amount": 40000000,
          "investments": [
            {
              "name": "종목명 (코드)",
              "shares": "수량",
              "estimatedValue": "예상 금액"
            }
          ]
        }
      ],
      "notes": [
        "각 자산군별 구체적인 투자 방법과 주의사항",
        "리밸런싱 주기 및 방법",
        "세금 고려사항"
      ]
    },
    "recommendedCrypto": [
      {
        "name": "비트코인",
        "symbol": "BTC",
        "reason": "각 암호화폐별 특징 및 투자 고려 이유 (100-150자)"
      }
    ],
    "actionGuide": {
      "investmentHorizon": {
        "primary": "장기투자 (5년 이상)",
        "description": "투자 성향에 맞는 주요 투자 기간과 특징 설명 (100-150자)"
      },
      "monthly": {
        "title": "매월 해야 할 일",
        "actions": [
          "기존 투자 자산 성과 모니터링 및 기록 (구체적 방법)",
          "추가 투자금 확보 전략 (적금, 여유자금 활용 등)",
          "시장 상황 대응 방안 (투자 성향별 맞춤 대응법)"
        ]
      },
      "quarterly": {
        "title": "분기별 해야 할 일 (3개월)",
        "actions": [
          "포트폴리오 리밸런싱 실행 (구체적 기준과 방법)",
          "수익 실현 및 손절 기준 적용 (투자 성향별 기준)",
          "새로운 투자 기회 발굴 및 분석 (어떤 분야, 어떤 방식)"
        ]
      },
      "semiannual": {
        "title": "반기별 해야 할 일 (6개월)",
        "actions": [
          "투자 전략 전면 재검토 (목표 대비 성과 분석)",
          "자산 배분 비율 조정 (시장 변화 반영)",
          "세금 최적화 및 절세 방안 실행 (구체적 방법)"
        ]
      },
      "annual": {
        "title": "년도별 해야 할 일 (1년)",
        "actions": [
          "투자 목표 및 전략 전면 재설정 (다음 해 계획)",
          "투자 성과 종합 분석 및 개선 방안 도출",
          "장기 투자 계획 수립 및 자산 증식 로드맵 설정"
        ]
      }
    }
  },
  "keyFindings": [
    "주요 발견사항 1",
    "주요 발견사항 2",
    "주요 발견사항 3"
  ]
}
`;

    // OpenAI API 호출 (기존 route.ts와 동일한 설정)
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        messages: [
          {
            role: "system",
            content: "당신은 투자 전문가이자 금융 상담사입니다. 설문 결과의 평균 점수를 정확히 계산하고, 제시된 점수 구간에 따라 투자 성향을 분류해야 합니다. 반드시 점수 기준을 우선으로 하여 정확한 분석을 제공하고, 요청된 JSON 형식으로만 응답하세요. 투자 성향 상세 설명(description)에는 점수나 수치 정보는 포함하지 말고, 순수하게 투자 성향의 특징과 행동 패턴만 500자 내외로 상세하게 설명해주세요."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 6000
      }),
    });

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API 오류: ${openaiResponse.status}`);
    }

    const openaiData = await openaiResponse.json();
    const gptResponse = openaiData.choices[0]?.message?.content;
    
    if (!gptResponse) {
      throw new Error('GPT API 응답이 없습니다.');
    }

    // JSON 파싱
    let analysisResult;
    try {
      analysisResult = JSON.parse(gptResponse);
      console.log('GPT 분석 결과:', { 
        investmentType: analysisResult.investmentType, 
        averageScore: averageScore.toFixed(2),
        totalScore 
      });
    } catch (parseError) {
      console.error('GPT 응답 파싱 에러:', gptResponse);
      throw new Error('GPT 응답을 파싱할 수 없습니다.');
    }

    // 투자 성향 프로필 가져오기
    const profileType = analysisResult.investmentType as keyof typeof investmentProfiles;
    const baseProfile = investmentProfiles[profileType];
    
    if (!baseProfile) {
      throw new Error('유효하지 않은 투자 성향 타입입니다.');
    }

    // GPT 분석 결과와 기본 프로필 결합
    const enhancedProfile = {
      ...baseProfile,
      gptAnalysis: analysisResult.analysis,
      confidence: analysisResult.confidence,
      keyFindings: analysisResult.keyFindings
    };

    return new Response(JSON.stringify({
      success: true,
      profile: enhancedProfile,
      rawAnswers: answers
    }), {
      headers: corsHeaders
    });

  } catch (error) {
    console.error('투자 성향 분석 에러:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // 에러 발생 시 기본 분석으로 폴백
    try {
      const { answers } = await request.json();
      const totalScore = answers.reduce((sum: number, score: number) => sum + score, 0);
      const averageScore = totalScore / answers.length;

      let fallbackProfile;
      console.log('Fallback 점수 계산:', { totalScore, averageScore });
      
      if (averageScore <= 1.3) {
        fallbackProfile = investmentProfiles.ultra_ultra_conservative;
      } else if (averageScore <= 1.6) {
        fallbackProfile = investmentProfiles.ultra_conservative;
      } else if (averageScore <= 2.0) {
        fallbackProfile = investmentProfiles.conservative;
      } else if (averageScore <= 2.4) {
        fallbackProfile = investmentProfiles.moderate_conservative;
      } else if (averageScore <= 2.8) {
        fallbackProfile = investmentProfiles.balanced;
      } else if (averageScore <= 3.2) {
        fallbackProfile = investmentProfiles.moderate_growth;
      } else if (averageScore <= 3.6) {
        fallbackProfile = investmentProfiles.growth;
      } else if (averageScore <= 4.0) {
        fallbackProfile = investmentProfiles.aggressive_growth;
      } else if (averageScore <= 4.4) {
        fallbackProfile = investmentProfiles.speculative_aggressive;
      } else {
        fallbackProfile = investmentProfiles.ultra_speculative_aggressive;
      }

      return new Response(JSON.stringify({
        success: true,
        profile: {
          ...fallbackProfile,
          gptAnalysis: {
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
            }
          },
          confidence: 70,
          keyFindings: [
            "기본 점수 분석 기반 결과",
            "AI 분석 서비스 이용 권장",
            "추가 상담을 통한 정밀 분석 필요"
          ]
        },
        rawAnswers: answers,
        fallback: true
      }), {
        headers: corsHeaders
      });
    } catch (fallbackError) {
      return new Response(JSON.stringify({ 
        error: '분석 중 오류가 발생했습니다.',
        details: errorMessage 
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
} 