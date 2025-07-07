// Survey Questions Data (simplified version for Functions)
var surveyQuestions = [
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
var investmentProfiles = {
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

export function onRequestPost(context) {
  var request = context.request;
  var env = context.env;
  
  // CORS 헤더 설정
  var corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
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
        var answers = data.answers;

        if (!answers || !Array.isArray(answers) || answers.length !== 25) {
          resolve(new Response(JSON.stringify({ error: '유효하지 않은 답변 데이터입니다.' }), {
            status: 400,
            headers: corsHeaders
          }));
          return;
        }

        // 설문 답변을 텍스트로 변환 (간소화)
        var surveyResults = answers.map(function(answerScore, index) {
          return {
            questionNumber: index + 1,
            category: 'general',
            question: '질문 ' + (index + 1),
            selectedAnswer: '점수 ' + answerScore,
            score: answerScore
          };
        });

        // 평균 점수 계산
        var totalScore = answers.reduce(function(sum, score) {
          return sum + score;
        }, 0);
        var averageScore = totalScore / answers.length;

        // GPT에게 보낼 프롬프트 구성 (전체 분석 결과 포함)
        var prompt = '\n다음은 투자 성향 분석을 위한 25문항 설문 결과입니다. 각 질문과 답변을 종합적으로 분석하여 투자자의 성향을 정확히 판단해주세요.\n\n**평균 점수: ' + averageScore.toFixed(2) + '점 (총 ' + totalScore + '점 / 25문항)**\n\n설문 결과:\n' + surveyResults.map(function(result) {
          return result.questionNumber + '. [' + result.category + '] ' + result.question + '\n  답변: ' + result.selectedAnswer + ' (점수: ' + result.score + ')';
        }).join('\n\n') + '\n\n투자 성향 분류 기준 (점수 기반):\n평균 점수 계산: 총 점수 / 25문항\n\n1. 초극보수형 (ultra_ultra_conservative) - 평균 1.0~1.3: 원금 보장을 절대 우선시하며, 어떤 손실도 감수하지 않는 극도로 안전한 투자만 선호\n2. 극보수형 (ultra_conservative) - 평균 1.4~1.6: 안전성을 최우선으로 하며, 최소한의 위험만 감수하여 안정적인 수익을 추구\n3. 보수형 (conservative) - 평균 1.7~2.0: 안정성을 중시하면서도 약간의 위험을 감수하여 인플레이션을 상회하는 수익을 추구\n4. 온건보수형 (moderate_conservative) - 평균 2.1~2.4: 안정성을 기반으로 하되, 적절한 위험을 감수하여 보다 나은 수익을 추구\n5. 균형형 (balanced) - 평균 2.5~2.8: 안정성과 수익성의 균형을 추구하며, 중간 정도의 위험을 감수\n6. 온건성장형 (moderate_growth) - 평균 2.9~3.2: 성장성을 추구하면서도 적절한 안정성을 유지하여 균형잡힌 포트폴리오를 선호\n7. 성장형 (growth) - 평균 3.3~3.6: 장기적 자산 성장을 목표로 하며, 상당한 위험을 감수하여 높은 수익을 추구\n8. 공격성장형 (aggressive_growth) - 평균 3.7~4.0: 높은 수익을 추구하며, 큰 위험을 감수하고 적극적인 투자 전략을 선호\n9. 공격투기형 (speculative_aggressive) - 평균 4.1~4.4: 매우 높은 수익을 추구하며, 투기적 투자도 감수하는 적극적인 성향\n10. 극공격투기형 (ultra_speculative_aggressive) - 평균 4.5~5.0: 최대 수익을 추구하며, 극도로 높은 위험과 투기적 투자를 마다하지 않는 성향\n\n분석 요청사항:\n1. 위에 제시된 평균 점수 ' + averageScore.toFixed(2) + '점을 기준으로 해당하는 점수 구간의 투자 성향을 우선 선택해주세요.\n2. 그 다음 위험 감수 능력, 투자 목적, 투자 경험, 자산 현황, 심리적 특성, 투자 전략을 종합적으로 고려해주세요.\n3. 점수 기준을 반드시 우선으로 하되, 답변 패턴이 극단적으로 다를 경우에만 인접 구간으로 조정 가능합니다.\n4. 각 투자 성향별 특징을 구체적으로 설명하고, 투자 행동과 심리적 특성을 반영해주세요.\n5. 포트폴리오 구성 시 주식, 채권, 현금, 부동산(REITs), 암호화폐 비중을 총 100%로 맞춰주세요.\n6. 주식 투자 부분에 대해서는 투자 성향에 맞는 세부 배분을 제공해주세요 (배당주, 성장주, 테마주, 가치주의 비중을 %로 표시하며, 총합이 100%가 되도록).\n7. 각 주식 유형별로 한국 3개, 미국 3개씩 총 6개를 추천해주세요 (배당주, 성장주, 테마주, 가치주 각각 국가별 3개씩).\n8. 암호화폐도 투자 성향에 맞게 3-5개를 추천해주세요.\n9. 1억원을 기준으로 한 구체적인 포트폴리오 예시를 제공해주세요.\n10. 투자 성향에 따른 투자 기간별 행동지침을 제공해주세요.\n\n다음 JSON 형식으로만 응답해주세요:\n{\n  "investmentType": "ultra_ultra_conservative|ultra_conservative|conservative|moderate_conservative|balanced|moderate_growth|growth|aggressive_growth|speculative_aggressive|ultra_speculative_aggressive",\n  "confidence": 85,\n  "analysis": {\n    "description": "투자 성향의 핵심 특징과 투자 행동 패턴을 500자 내외로 상세히 설명",\n    "advantages": "해당 성향의 투자 강점과 긍정적 측면 (200-300자)",\n    "disadvantages": "투자 시 주의할 점과 보완할 부분 (200-300자)",\n    "improvements": "투자자에게 도움이 될 구체적인 행동 지침 및 전략 개선 제안 (200-300자)",\n    "portfolio": {\n      "stocks": 40,\n      "bonds": 30,\n      "cash": 15,\n      "reits": 10,\n      "crypto": 5,\n      "reason": "포트폴리오 구성 이유와 비중 설명",\n      "stockAllocation": {\n        "dividendStocks": 50,\n        "growthStocks": 25,\n        "themeStocks": 15,\n        "valueStocks": 10,\n        "reason": "주식 내 세부 배분 이유"\n      }\n    },\n    "recommendedStocks": [\n      {\n        "category": "dividend",\n        "name": "배당주 기업명",\n        "ticker": "종목코드",\n        "market": "KRX 또는 NYSE/NASDAQ",\n        "country": "한국 또는 미국",\n        "reason": "추천 이유"\n      }\n    ],\n    "recommendedCrypto": [\n      {\n        "name": "비트코인",\n        "symbol": "BTC",\n        "reason": "추천 이유"\n      }\n    ],\n    "portfolioExample": {\n      "totalAmount": 100000000,\n      "breakdown": [\n        {\n          "category": "주식",\n          "percentage": 40,\n          "amount": 40000000,\n          "investments": [\n            {\n              "name": "종목명",\n              "shares": "수량",\n              "estimatedValue": "예상 금액"\n            }\n          ]\n        }\n      ],\n      "notes": ["구체적인 투자 방법과 주의사항"]\n    },\n    "actionGuide": {\n      "investmentHorizon": {\n        "primary": "장기투자 (5년 이상)",\n        "description": "투자 기간 특징 설명"\n      },\n      "monthly": {\n        "title": "매월 해야 할 일",\n        "actions": ["구체적 행동 1", "구체적 행동 2", "구체적 행동 3"]\n      },\n      "quarterly": {\n        "title": "분기별 해야 할 일",\n        "actions": ["구체적 행동 1", "구체적 행동 2", "구체적 행동 3"]\n      },\n      "semiannual": {\n        "title": "반기별 해야 할 일",\n        "actions": ["구체적 행동 1", "구체적 행동 2", "구체적 행동 3"]\n      },\n      "annual": {\n        "title": "년도별 해야 할 일",\n        "actions": ["구체적 행동 1", "구체적 행동 2", "구체적 행동 3"]\n      }\n    }\n  },\n  "keyFindings": [\n    "주요 발견사항 1",\n    "주요 발견사항 2",\n    "주요 발견사항 3"\n  ]\n}\n';

        // OpenAI API 호출
        fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + env.OPENAI_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "당신은 투자 전문가이자 금융 상담사입니다. 설문 결과의 평균 점수를 정확히 계산하고, 제시된 점수 구간에 따라 투자 성향을 분류해야 합니다. 반드시 점수 기준을 우선으로 하여 정확한 분석을 제공하고, 요청된 JSON 형식으로만 응답하세요."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.3,
            max_tokens: 8000
          })
        }).then(function(openaiResponse) {
          if (!openaiResponse.ok) {
            throw new Error('OpenAI API 오류: ' + openaiResponse.status);
          }
          
          return openaiResponse.json();
        }).then(function(openaiData) {
          var gptResponse = openaiData.choices[0] && openaiData.choices[0].message && openaiData.choices[0].message.content;
          
          if (!gptResponse) {
            throw new Error('GPT API 응답이 없습니다.');
          }

          // JSON 파싱
          var analysisResult;
          try {
            analysisResult = JSON.parse(gptResponse);
            console.log('GPT 분석 결과:', { 
              investmentType: analysisResult.investmentType, 
              averageScore: averageScore.toFixed(2),
              totalScore: totalScore 
            });
          } catch (parseError) {
            console.error('GPT 응답 파싱 에러:', gptResponse);
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
            gptAnalysis: analysisResult.analysis,
            confidence: analysisResult.confidence,
            keyFindings: analysisResult.keyFindings
          };

          resolve(new Response(JSON.stringify({
            success: true,
            profile: enhancedProfile,
            rawAnswers: answers
          }), {
            headers: corsHeaders
          }));

        }).catch(function(error) {
          console.error('OpenAI API 오류:', error);
          
          // 에러 발생 시 기본 분석으로 폴백
          var fallbackProfile;
          console.log('Fallback 점수 계산:', { totalScore: totalScore, averageScore: averageScore });
          
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

          // 기본 포트폴리오 및 투자 데이터 생성
          var fallbackGptAnalysis = {
            description: "AI 분석을 사용할 수 없어 기본 분석을 제공합니다. 설문 점수를 기반으로 한 간단한 분석 결과입니다.",
            advantages: "설문 결과를 바탕으로 한 기본적인 투자 성향 분석이 제공됩니다.",
            disadvantages: "더 정확한 분석을 위해서는 AI 분석 서비스를 이용해주세요.",
            improvements: "AI 분석 서비스를 통해 더 구체적이고 개인화된 투자 전략을 제공받을 수 있습니다.",
            portfolio: {
              stocks: fallbackProfile.recommendedAssets.stocks,
              bonds: fallbackProfile.recommendedAssets.bonds,
              cash: fallbackProfile.recommendedAssets.cash,
              reits: fallbackProfile.recommendedAssets.alternatives,
              crypto: 0,
              reason: "기본 포트폴리오 구성입니다. 더 정확한 분석을 위해서는 AI 분석 서비스를 이용해주세요.",
              stockAllocation: {
                dividendStocks: 40,
                growthStocks: 30,
                themeStocks: 20,
                valueStocks: 10,
                reason: "기본 주식 배분입니다."
              }
            },
            recommendedStocks: [
              {
                category: "dividend",
                name: "삼성전자",
                ticker: "005930",
                market: "KRX",
                country: "한국",
                reason: "안정적인 배당 지급 기업"
              },
              {
                category: "growth",
                name: "Apple",
                ticker: "AAPL",
                market: "NASDAQ",
                country: "미국",
                reason: "지속적인 성장 기업"
              }
            ],
            recommendedCrypto: [
              {
                name: "비트코인",
                symbol: "BTC",
                reason: "대표적인 암호화폐"
              }
            ],
            portfolioExample: {
              totalAmount: 100000000,
              breakdown: [
                {
                  category: "주식",
                  percentage: fallbackProfile.recommendedAssets.stocks,
                  amount: fallbackProfile.recommendedAssets.stocks * 1000000,
                  investments: [
                    {
                      name: "대표 종목",
                      shares: "적정 수량",
                      estimatedValue: "예상 금액"
                    }
                  ]
                },
                {
                  category: "채권",
                  percentage: fallbackProfile.recommendedAssets.bonds,
                  amount: fallbackProfile.recommendedAssets.bonds * 1000000,
                  investments: [
                    {
                      name: "채권 ETF",
                      shares: "적정 수량",
                      estimatedValue: "예상 금액"
                    }
                  ]
                },
                {
                  category: "현금",
                  percentage: fallbackProfile.recommendedAssets.cash,
                  amount: fallbackProfile.recommendedAssets.cash * 1000000,
                  investments: [
                    {
                      name: "예비 현금",
                      shares: "-",
                      estimatedValue: fallbackProfile.recommendedAssets.cash * 1000000 + "원"
                    }
                  ]
                }
              ],
              notes: ["기본 포트폴리오 구성입니다.", "더 정확한 분석을 위해서는 AI 분석 서비스를 이용해주세요."]
            },
            actionGuide: {
              investmentHorizon: {
                primary: "장기투자 (5년 이상)",
                description: "안정적인 장기 투자가 권장됩니다."
              },
              monthly: {
                title: "매월 해야 할 일",
                actions: ["포트폴리오 성과 확인", "추가 투자금 확보", "시장 상황 점검"]
              },
              quarterly: {
                title: "분기별 해야 할 일",
                actions: ["포트폴리오 리밸런싱", "수익 실현 검토", "새로운 투자 기회 발굴"]
              },
              semiannual: {
                title: "반기별 해야 할 일",
                actions: ["투자 전략 재검토", "자산 배분 조정", "세금 최적화"]
              },
              annual: {
                title: "년도별 해야 할 일",
                actions: ["투자 목표 재설정", "성과 종합 분석", "장기 계획 수립"]
              }
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
              gptAnalysis: fallbackGptAnalysis,
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
      var errorMessage = error && error.message ? error.message : 'Unknown error';
      resolve(new Response(JSON.stringify({ 
        error: '분석 중 오류가 발생했습니다.',
        details: errorMessage 
      }), {
        status: 500,
        headers: corsHeaders
      }));
    }
  });
}

 