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

        // GPT에게 보낼 프롬프트 구성 (기존 route.ts와 동일)
        var prompt = '\n다음은 투자 성향 분석을 위한 25문항 설문 결과입니다. 각 질문과 답변을 종합적으로 분석하여 투자자의 성향을 정확히 판단해주세요.\n\n**평균 점수: ' + averageScore.toFixed(2) + '점 (총 ' + totalScore + '점 / 25문항)**\n\n설문 결과:\n' + surveyResults.map(function(result) {
          return result.questionNumber + '. [' + result.category + '] ' + result.question + '\n  답변: ' + result.selectedAnswer + ' (점수: ' + result.score + ')';
        }).join('\n\n') + '\n\n투자 성향 분류 기준 (점수 기반):\n평균 점수 계산: 총 점수 / 25문항\n\n1. 초극보수형 (ultra_ultra_conservative) - 평균 1.0~1.3: 원금 보장을 절대 우선시하며, 어떤 손실도 감수하지 않는 극도로 안전한 투자만 선호\n2. 극보수형 (ultra_conservative) - 평균 1.4~1.6: 안전성을 최우선으로 하며, 최소한의 위험만 감수하여 안정적인 수익을 추구\n3. 보수형 (conservative) - 평균 1.7~2.0: 안정성을 중시하면서도 약간의 위험을 감수하여 인플레이션을 상회하는 수익을 추구\n4. 온건보수형 (moderate_conservative) - 평균 2.1~2.4: 안정성을 기반으로 하되, 적절한 위험을 감수하여 보다 나은 수익을 추구\n5. 균형형 (balanced) - 평균 2.5~2.8: 안정성과 수익성의 균형을 추구하며, 중간 정도의 위험을 감수\n6. 온건성장형 (moderate_growth) - 평균 2.9~3.2: 성장성을 추구하면서도 적절한 안정성을 유지하여 균형잡힌 포트폴리오를 선호\n7. 성장형 (growth) - 평균 3.3~3.6: 장기적 자산 성장을 목표로 하며, 상당한 위험을 감수하여 높은 수익을 추구\n8. 공격성장형 (aggressive_growth) - 평균 3.7~4.0: 높은 수익을 추구하며, 큰 위험을 감수하고 적극적인 투자 전략을 선호\n9. 공격투기형 (speculative_aggressive) - 평균 4.1~4.4: 매우 높은 수익을 추구하며, 투기적 투자도 감수하는 적극적인 성향\n10. 극공격투기형 (ultra_speculative_aggressive) - 평균 4.5~5.0: 최대 수익을 추구하며, 극도로 높은 위험과 투기적 투자를 마다하지 않는 성향\n\n분석 요청사항:\n1. 위에 제시된 평균 점수 ' + averageScore.toFixed(2) + '점을 기준으로 해당하는 점수 구간의 투자 성향을 우선 선택해주세요.\n2. 그 다음 위험 감수 능력, 투자 목적, 투자 경험, 자산 현황, 심리적 특성, 투자 전략을 종합적으로 고려해주세요.\n3. 점수 기준을 반드시 우선으로 하되, 답변 패턴이 극단적으로 다를 경우에만 인접 구간으로 조정 가능합니다.\n4. 각 투자 성향별 특징을 구체적으로 설명하고, 투자 행동과 심리적 특성을 반영해주세요.\n5. 투자 성향 상세 설명(description)에는 점수나 평균 점수와 같은 수치 정보는 포함하지 말고, 순수하게 투자 성향의 특징과 행동 패턴만 설명해주세요.\n\n다음 JSON 형식으로만 응답해주세요:\n{\n  "investmentType": "ultra_ultra_conservative|ultra_conservative|conservative|moderate_conservative|balanced|moderate_growth|growth|aggressive_growth|speculative_aggressive|ultra_speculative_aggressive",\n  "confidence": 85,\n  "analysis": {\n    "description": "투자 성향의 핵심 특징과 투자 행동 패턴을 500자 내외로 상세히 설명",\n    "advantages": "해당 성향의 투자 강점과 긍정적 측면 (200-300자)",\n    "disadvantages": "투자 시 주의할 점과 보완할 부분 (200-300자)",\n    "improvements": "투자자에게 도움이 될 구체적인 행동 지침 및 전략 개선 제안 (200-300자)"\n  },\n  "keyFindings": [\n    "주요 발견사항 1",\n    "주요 발견사항 2",\n    "주요 발견사항 3"\n  ]\n}\n';

        // OpenAI API 호출
        fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + env.OPENAI_API_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: "gpt-4.1",
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
            max_tokens: 6000
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

          resolve(new Response(JSON.stringify({
            success: true,
            profile: {
              type: fallbackProfile.type,
              name: fallbackProfile.name,
              description: fallbackProfile.description,
              riskLevel: fallbackProfile.riskLevel,
              expectedReturn: fallbackProfile.expectedReturn,
              recommendedAssets: fallbackProfile.recommendedAssets,
              gptAnalysis: {
                description: "AI 분석을 사용할 수 없어 기본 분석을 제공합니다. 설문 점수를 기반으로 한 간단한 분석 결과입니다.",
                advantages: "설문 결과를 바탕으로 한 기본적인 투자 성향 분석이 제공됩니다.",
                disadvantages: "더 정확한 분석을 위해서는 AI 분석 서비스를 이용해주세요.",
                improvements: "AI 분석 서비스를 통해 더 구체적이고 개인화된 투자 전략을 제공받을 수 있습니다."
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

 