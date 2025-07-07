// 프롬프트 생성 함수 (ES5 호환)
function createPrompt(averageScore, totalScore, surveyResultsText) {
  var prompt = '';
  
  // 프롬프트 시작 부분
  prompt += '다음은 투자 성향 분석을 위한 25문항 설문 결과입니다. 각 질문과 답변을 종합적으로 분석하여 투자자의 성향을 정확히 판단해주세요.\n\n';
  
  // 점수 정보
  prompt += '**평균 점수: ' + averageScore.toFixed(2) + '점 (총 ' + totalScore + '점 / 25문항)**\n\n';
  
  // 설문 결과
  prompt += '설문 결과:\n' + surveyResultsText + '\n\n';
  
  // 투자 성향 분류 기준
  prompt += '투자 성향 분류 기준 (점수 기반):\n';
  prompt += '평균 점수 계산: 총 점수 / 25문항\n\n';
  prompt += '1. 초극보수형 (ultra_ultra_conservative) - 평균 1.0~1.3: 원금 보장을 절대 우선시하며, 어떤 손실도 감수하지 않는 극도로 안전한 투자만 선호\n';
  prompt += '2. 극보수형 (ultra_conservative) - 평균 1.4~1.6: 안전성을 최우선으로 하며, 최소한의 위험만 감수하여 안정적인 수익을 추구\n';
  prompt += '3. 보수형 (conservative) - 평균 1.7~2.0: 안정성을 중시하면서도 약간의 위험을 감수하여 인플레이션을 상회하는 수익을 추구\n';
  prompt += '4. 온건보수형 (moderate_conservative) - 평균 2.1~2.4: 안정성을 기반으로 하되, 적절한 위험을 감수하여 보다 나은 수익을 추구\n';
  prompt += '5. 균형형 (balanced) - 평균 2.5~2.8: 안정성과 수익성의 균형을 추구하며, 중간 정도의 위험을 감수\n';
  prompt += '6. 온건성장형 (moderate_growth) - 평균 2.9~3.2: 성장성을 추구하면서도 적절한 안정성을 유지하여 균형잡힌 포트폴리오를 선호\n';
  prompt += '7. 성장형 (growth) - 평균 3.3~3.6: 장기적 자산 성장을 목표로 하며, 상당한 위험을 감수하여 높은 수익을 추구\n';
  prompt += '8. 공격성장형 (aggressive_growth) - 평균 3.7~4.0: 높은 수익을 추구하며, 큰 위험을 감수하고 적극적인 투자 전략을 선호\n';
  prompt += '9. 공격투기형 (speculative_aggressive) - 평균 4.1~4.4: 매우 높은 수익을 추구하며, 투기적 투자도 감수하는 적극적인 성향\n';
  prompt += '10. 극공격투기형 (ultra_speculative_aggressive) - 평균 4.5~5.0: 최대 수익을 추구하며, 극도로 높은 위험과 투기적 투자를 마다하지 않는 성향\n\n';
  
  // 분석 요청사항
  prompt += '분석 요청사항:\n';
  prompt += '1. 위에 제시된 평균 점수 ' + averageScore.toFixed(2) + '점을 기준으로 해당하는 점수 구간의 투자 성향을 우선 선택해주세요.\n';
  prompt += '2. 그 다음 위험 감수 능력, 투자 목적, 투자 경험, 자산 현황, 심리적 특성, 투자 전략을 종합적으로 고려해주세요.\n';
  prompt += '3. 점수 기준을 반드시 우선으로 하되, 답변 패턴이 극단적으로 다를 경우에만 인접 구간으로 조정 가능합니다.\n';
  prompt += '4. 각 투자 성향별 특징을 구체적으로 설명하고, 투자 행동과 심리적 특성을 반영해주세요.\n';
  prompt += '5. 투자 성향 상세 설명(description)에는 점수나 평균 점수와 같은 수치 정보는 포함하지 말고, 순수하게 투자 성향의 특징과 행동 패턴만 설명해주세요.\n';
  prompt += '6. 포트폴리오 구성 시 주식, 채권, 현금, 부동산(REITs), 암호화폐 비중을 총 100%로 맞춰주세요.\n';
  prompt += '7. 주식 투자 부분에 대해서는 투자 성향에 맞는 세부 배분을 제공해주세요 (배당주, 성장주, 테마주, 가치주의 비중을 %로 표시하며, 총합이 100%가 되도록).\n';
  prompt += '   - 보수적 성향: 배당주 50-70%, 가치주 20-30%, 성장주 10-20%, 테마주 0-10%\n';
  prompt += '   - 균형 성향: 배당주 30-40%, 가치주 25-35%, 성장주 20-30%, 테마주 10-20%\n';
  prompt += '   - 공격적 성향: 성장주 40-50%, 테마주 25-35%, 배당주 10-20%, 가치주 10-20%\n';
  prompt += '8. 각 주식 유형별로 한국 3개, 미국 3개씩 총 6개를 추천해주세요 (배당주, 성장주, 테마주, 가치주 각각 국가별 3개씩).\n';
  prompt += '9. 추천 주식 종목은 분석 당일 날짜를 기준으로 검색하여 최신 트렌드를 고려하여 투자 성향에 맞는 다양성을 고려해주세요.\n';
  prompt += '10. 각 종목에는 국가(한국/미국), 거래소(KRX/NYSE/NASDAQ), 추천 이유를 포함해주세요.\n';
  prompt += '11. 분석 당일일 날짜를 토대로 검색하여 주식 트렌드를 반영하여 추천.\n';
  prompt += '12. 투자 성향에 따라 보수적이면 안전한 대형주, 공격적이면 성장주나 테마주를 추천해주세요.\n';
  prompt += '13. 암호화폐도 투자 성향에 맞게 3-5개를 추천해주세요 (보수적이면 비트코인/이더리움 위주, 공격적이면 알트코인 포함).\n';
  prompt += '14. 1억원을 기준으로 한 구체적인 포트폴리오 예시를 제공해주세요. 각 자산군별 금액, 추천 종목과 수량을 포함하여 실제 투자 가능한 형태로 작성해주세요.\n';
  prompt += '15. 투자 성향에 따른 투자 기간(단기 1년 이하, 중기 1-5년, 장기 5년 이상)을 분석하고, 각 기간별 행동지침을 제공해주세요:\n';
  prompt += '    - 월별: 기존 투자 자산 모니터링, 추가 투자금 확보 방법, 시장 상황 대응\n';
  prompt += '    - 분기별: 포트폴리오 리밸런싱, 수익 실현/손절 기준, 새로운 투자 기회 발굴\n';
  prompt += '    - 반기별: 투자 전략 재검토, 자산 배분 조정, 세금 최적화 방안\n';
  prompt += '    - 년도별: 투자 목표 재설정, 장기 계획 수립, 투자 성과 종합 평가\n';
  prompt += '    각 기간별로 투자 성향에 맞는 구체적이고 실행 가능한 행동 방안을 제시해주세요.\n';
  prompt += '16. 모든 답변은 전문적이고 구체적인 어투로 200-300자 분량으로 작성해주세요.\n\n';
  
  // JSON 형식 요청
  prompt += '다음 JSON 형식으로만 응답해주세요. 각 주식 유형별로 한국 3개, 미국 3개씩 총 24개 종목을 추천해주세요:\n';
  prompt += '{"investmentType": "해당_투자_성향", "confidence": 85, "analysis": {"description": "상세설명", "advantages": "장점", "disadvantages": "단점", "improvements": "개선사항", "portfolio": {"stocks": 40, "bonds": 30, "cash": 15, "reits": 10, "crypto": 5, "reason": "이유", "stockAllocation": {"dividendStocks": 50, "growthStocks": 25, "themeStocks": 15, "valueStocks": 10, "reason": "이유"}}, "recommendedStocks": [24개_종목_배열], "portfolioExample": {"totalAmount": 100000000, "breakdown": [자산별_상세내역]}, "recommendedCrypto": [암호화폐_배열], "actionGuide": {"investmentHorizon": {"primary": "투자기간", "description": "설명"}, "monthly": {"title": "매월", "actions": ["행동1", "행동2", "행동3"]}, "quarterly": {"title": "분기별", "actions": ["행동1", "행동2", "행동3"]}, "semiannual": {"title": "반기별", "actions": ["행동1", "행동2", "행동3"]}, "annual": {"title": "년도별", "actions": ["행동1", "행동2", "행동3"]}}}, "keyFindings": ["발견사항1", "발견사항2", "발견사항3"]}';
  
  return prompt;
}

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
    recommendedAssets: { stocks: 5, bonds: 70, cash: 25, alternatives: 0 },
    characteristics: [
      '원금 손실에 대한 극도의 거부감',
      '안정적인 예금과 적금 선호',
      '변동성이 높은 투자 회피',
      '보수적이고 신중한 투자 결정'
    ]
  },
  ultra_conservative: {
    type: 'ultra_conservative', 
    name: '극보수형',
    description: '안전성을 최우선으로 하는 투자자',
    riskLevel: 2,
    expectedReturn: '2-3%',
    recommendedAssets: { stocks: 10, bonds: 65, cash: 20, alternatives: 5 },
    characteristics: [
      '안전성을 최우선으로 고려',
      '최소한의 위험만 감수',
      '예측 가능한 수익 추구',
      '장기적 안정성 중시'
    ]
  },
  conservative: {
    type: 'conservative',
    name: '보수형', 
    description: '안전성을 중시하는 투자자',
    riskLevel: 3,
    expectedReturn: '3-5%',
    recommendedAssets: { stocks: 20, bonds: 60, cash: 15, alternatives: 5 },
    characteristics: [
      '안정성과 수익성의 조화 추구',
      '인플레이션 대응 투자 고려',
      '적절한 분산투자 선호',
      '점진적인 자산 증식 목표'
    ]
  },
  moderate_conservative: {
    type: 'moderate_conservative',
    name: '온건보수형',
    description: '안정성 기반의 적절한 위험 감수 투자자',
    riskLevel: 4,
    expectedReturn: '4-6%', 
    recommendedAssets: { stocks: 30, bonds: 50, cash: 15, alternatives: 5 },
    characteristics: [
      '안정성을 기반으로 한 성장 추구',
      '적절한 위험 수용 능력',
      '다양한 자산군 분산투자',
      '중장기적 투자 관점'
    ]
  },
  balanced: {
    type: 'balanced',
    name: '균형형',
    description: '안정성과 수익성의 균형을 추구하는 투자자',
    riskLevel: 5,
    expectedReturn: '5-7%',
    recommendedAssets: { stocks: 40, bonds: 40, cash: 15, alternatives: 5 },
    characteristics: [
      '안정성과 수익성의 균형 추구',
      '중간 수준의 위험 감수',
      '포트폴리오 리밸런싱 실행',
      '시장 변동성에 대한 인내심'
    ]
  },
  moderate_growth: {
    type: 'moderate_growth',
    name: '온건성장형',
    description: '성장성을 추구하되 적절한 안정성을 유지하는 투자자',
    riskLevel: 6,
    expectedReturn: '6-8%',
    recommendedAssets: { stocks: 50, bonds: 30, cash: 15, alternatives: 5 },
    characteristics: [
      '성장성과 안정성의 조화',
      '중간 이상의 위험 감수',
      '성장 가능성이 높은 투자 선호',
      '장기적 자산 증식 목표'
    ]
  },
  growth: {
    type: 'growth',
    name: '성장형',
    description: '장기적 자산 성장을 목표로 하는 투자자',
    riskLevel: 7,
    expectedReturn: '7-10%',
    recommendedAssets: { stocks: 60, bonds: 25, cash: 10, alternatives: 5 },
    characteristics: [
      '장기적 자산 성장 중시',
      '상당한 위험 감수 능력',
      '성장주와 혁신 기업 투자',
      '시장 변동성에 대한 높은 내성'
    ]
  },
  aggressive_growth: {
    type: 'aggressive_growth',
    name: '공격성장형',
    description: '높은 수익을 위해 큰 위험을 감수하는 투자자',
    riskLevel: 8,
    expectedReturn: '8-12%',
    recommendedAssets: { stocks: 70, bonds: 15, cash: 10, alternatives: 5 },
    characteristics: [
      '높은 수익률 추구',
      '큰 위험 감수 의지',
      '공격적인 투자 전략 선호',
      '빠른 자산 증식 목표'
    ]
  },
  speculative_aggressive: {
    type: 'speculative_aggressive',
    name: '공격투기형',
    description: '투기적 투자도 감수하는 적극적 투자자',
    riskLevel: 9,
    expectedReturn: '10-15%',
    recommendedAssets: { stocks: 80, bonds: 10, cash: 5, alternatives: 5 },
    characteristics: [
      '매우 높은 수익률 추구',
      '투기적 투자 수용',
      '적극적인 거래 성향',
      '높은 변동성 감수'
    ]
  },
  ultra_speculative_aggressive: {
    type: 'ultra_speculative_aggressive',
    name: '극공격투기형', 
    description: '최대 수익을 위해 극도의 위험을 감수하는 투자자',
    riskLevel: 10,
    expectedReturn: '15%+',
    recommendedAssets: { stocks: 85, bonds: 5, cash: 5, alternatives: 5 },
    characteristics: [
      '최대 수익률 추구',
      '극도의 위험 감수',
      '고위험 고수익 투자 선호',
      '단기 트레이딩 경향'
    ]
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

        // 설문 결과를 텍스트로 변환
        var surveyResultsText = surveyResults.map(function(result) {
          return result.questionNumber + '. [' + result.category + '] ' + result.question + '\n답변: ' + result.selectedAnswer + ' (점수: ' + result.score + ')';
        }).join('\n\n');

        // GPT에게 보낼 프롬프트 구성 (route.ts와 동일한 상세한 분석)
        var prompt = createPrompt(averageScore, totalScore, surveyResultsText);

        // 상세 디버깅 로그 추가
        console.log('=== GPT 분석 디버그 시작 ===');
        console.log('1. API 키 확인:', env.OPENAI_API_KEY ? 'API 키 있음 (' + env.OPENAI_API_KEY.substring(0, 10) + '...)' : 'API 키 없음');
        console.log('2. 평균 점수:', averageScore.toFixed(2));
        console.log('3. 총 점수:', totalScore);
        console.log('4. 프롬프트 길이:', prompt.length);
        console.log('5. 설문 결과 개수:', surveyResults.length);

        if (!env.OPENAI_API_KEY) {
          console.error('❌ OPENAI_API_KEY 환경 변수가 설정되지 않았습니다!');
          throw new Error('OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.');
        }

        console.log('6. OpenAI API 호출 시작...');
        
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
          console.log('7. OpenAI API 응답 수신 - 상태:', openaiResponse.status);
          
          if (!openaiResponse.ok) {
            console.error('❌ OpenAI API 오류 - 상태 코드:', openaiResponse.status);
            throw new Error('OpenAI API 오류: ' + openaiResponse.status);
          }
          
          console.log('8. OpenAI API 응답 JSON 파싱 시작...');
          return openaiResponse.json();
        }).then(function(openaiData) {
          console.log('9. OpenAI API 데이터 구조:', {
            choices: openaiData.choices ? openaiData.choices.length : 0,
            hasMessage: openaiData.choices && openaiData.choices[0] && openaiData.choices[0].message ? true : false,
            usage: openaiData.usage || null
          });
          
          var gptResponse = openaiData.choices[0] && openaiData.choices[0].message && openaiData.choices[0].message.content;
          
          if (!gptResponse) {
            console.error('❌ GPT API 응답이 없습니다:', openaiData);
            throw new Error('GPT API 응답이 없습니다.');
          }

          console.log('10. GPT 응답 길이:', gptResponse.length);
          console.log('11. GPT 응답 첫 100자:', gptResponse.substring(0, 100));

          // JSON 파싱
          var analysisResult;
          try {
            analysisResult = JSON.parse(gptResponse);
            console.log('✅ GPT 분석 성공!', { 
              investmentType: analysisResult.investmentType, 
              averageScore: averageScore.toFixed(2),
              totalScore: totalScore 
            });
          } catch (parseError) {
            console.error('❌ GPT 응답 파싱 에러:', parseError.message);
            console.error('파싱 실패한 응답:', gptResponse);
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
          console.error('=== OpenAI API 오류 발생 ===');
          console.error('❌ 에러 타입:', error.name);
          console.error('❌ 에러 메시지:', error.message);
          console.error('❌ 에러 스택:', error.stack);
          console.error('❌ API 키 상태:', env.OPENAI_API_KEY ? 'API 키 존재' : 'API 키 없음');
          console.error('❌ 환경 변수 전체:', Object.keys(env));
          
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
              // 배당주 - 한국 3개
              {
                category: "dividend",
                name: "삼성전자",
                ticker: "005930",
                market: "KRX",
                country: "한국",
                reason: "안정적인 배당 지급과 대형주 안정성을 제공하는 대표 종목"
              },
              {
                category: "dividend",
                name: "SK텔레콤",
                ticker: "017670",
                market: "KRX",
                country: "한국", 
                reason: "통신업계 선두주자로 꾸준한 배당수익률 제공"
              },
              {
                category: "dividend",
                name: "한국전력",
                ticker: "015760",
                market: "KRX",
                country: "한국",
                reason: "공기업 특성상 안정적인 배당정책을 유지하는 종목"
              },
              // 배당주 - 미국 3개
              {
                category: "dividend",
                name: "Apple",
                ticker: "AAPL",
                market: "NASDAQ",
                country: "미국",
                reason: "꾸준한 배당 증가와 안정적인 현금 흐름을 보이는 글로벌 기업"
              },
              {
                category: "dividend",
                name: "Microsoft",
                ticker: "MSFT",
                market: "NASDAQ",
                country: "미국",
                reason: "지속적인 배당 성장과 견고한 비즈니스 모델을 갖춘 기술주"
              },
              {
                category: "dividend",
                name: "Coca-Cola",
                ticker: "KO",
                market: "NYSE",
                country: "미국",
                reason: "50년 이상 배당을 증가시킨 배당 귀족주의 대표 종목"
              },
              // 성장주 - 한국 3개
              {
                category: "growth",
                name: "네이버",
                ticker: "035420",
                market: "KRX",
                country: "한국",
                reason: "국내 IT 대표 기업으로 지속적인 성장 잠재력 보유"
              },
              {
                category: "growth",
                name: "카카오",
                ticker: "035720",
                market: "KRX",
                country: "한국",
                reason: "플랫폼 기반 디지털 서비스의 선두주자로 성장성 우수"
              },
              {
                category: "growth",
                name: "LG에너지솔루션",
                ticker: "373220",
                market: "KRX",
                country: "한국",
                reason: "전기차 배터리 시장의 글로벌 리더로 높은 성장 전망"
              },
              // 성장주 - 미국 3개
              {
                category: "growth",
                name: "Tesla",
                ticker: "TSLA",
                market: "NASDAQ",
                country: "미국",
                reason: "전기차와 에너지 사업 분야의 혁신적 성장주"
              },
              {
                category: "growth",
                name: "Amazon",
                ticker: "AMZN",
                market: "NASDAQ",
                country: "미국",
                reason: "클라우드와 이커머스 분야에서 지속적인 성장 잠재력"
              },
              {
                category: "growth",
                name: "Nvidia",
                ticker: "NVDA",
                market: "NASDAQ",
                country: "미국",
                reason: "AI와 반도체 분야의 선두주자로 폭발적 성장 가능성"
              },
              // 테마주 - 한국 3개
              {
                category: "theme",
                name: "삼성SDI",
                ticker: "006400",
                market: "KRX",
                country: "한국",
                reason: "배터리 테마의 대표주자로 친환경 에너지 트렌드 수혜"
              },
              {
                category: "theme",
                name: "POSCO홀딩스",
                ticker: "005490",
                market: "KRX",
                country: "한국",
                reason: "2차전지 소재 및 수소 테마의 대표 기업"
              },
              {
                category: "theme",
                name: "셀트리온",
                ticker: "068270",
                market: "KRX",
                country: "한국",
                reason: "바이오 헬스케어 테마의 대표주자로 글로벌 진출 확대"
              },
              // 테마주 - 미국 3개
              {
                category: "theme",
                name: "Palantir",
                ticker: "PLTR",
                market: "NYSE",
                country: "미국",
                reason: "빅데이터 분석과 AI 테마의 대표적인 성장주"
              },
              {
                category: "theme",
                name: "AMD",
                ticker: "AMD",
                market: "NASDAQ",
                country: "미국",
                reason: "반도체와 AI 칩 테마의 주요 수혜주"
              },
              {
                category: "theme",
                name: "Beyond Meat",
                ticker: "BYND",
                market: "NASDAQ",
                country: "미국",
                reason: "대체육 및 친환경 식품 테마의 선두주자"
              },
              // 가치주 - 한국 3개
              {
                category: "value",
                name: "현대차",
                ticker: "005380",
                market: "KRX",
                country: "한국",
                reason: "견고한 펀더멘털 대비 저평가된 전통 제조업 대표 기업"
              },
              {
                category: "value",
                name: "KB금융",
                ticker: "105560",
                market: "KRX",
                country: "한국",
                reason: "금리 상승기 수혜와 안정적인 배당을 제공하는 금융주"
              },
              {
                category: "value",
                name: "POSCO",
                ticker: "005490",
                market: "KRX",
                country: "한국",
                reason: "철강업계 대표주자로 경기회복 시 큰 수혜 기대"
              },
              // 가치주 - 미국 3개
              {
                category: "value",
                name: "Berkshire Hathaway",
                ticker: "BRK.B",
                market: "NYSE",
                country: "미국",
                reason: "워렌 버핏의 가치투자 철학이 담긴 대표적인 가치주"
              },
              {
                category: "value",
                name: "JPMorgan Chase",
                ticker: "JPM",
                market: "NYSE",
                country: "미국",
                reason: "견고한 재무구조와 안정적인 수익성을 갖춘 금융주"
              },
              {
                category: "value",
                name: "Johnson & Johnson",
                ticker: "JNJ",
                market: "NYSE",
                country: "미국",
                reason: "헬스케어 분야의 안정적인 수익성과 배당을 제공하는 우량주"
              }
            ],
            recommendedCrypto: [
              {
                name: "비트코인",
                symbol: "BTC",
                reason: "가장 안정적이고 대표적인 암호화폐로 디지털 금의 역할"
              },
              {
                name: "이더리움",
                symbol: "ETH",
                reason: "스마트 컨트랙트 플랫폼의 선두주자로 DeFi 생태계의 핵심"
              },
              {
                name: "바이낸스 코인",
                symbol: "BNB",
                reason: "세계 최대 암호화폐 거래소 토큰으로 실용성이 높음"
              },
              {
                name: "솔라나",
                symbol: "SOL",
                reason: "빠른 거래속도와 낮은 수수료로 차세대 블록체인 플랫폼 주목"
              },
              {
                name: "카르다노",
                symbol: "ADA",
                reason: "지속가능한 블록체인을 추구하는 친환경 암호화폐"
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
                      name: "삼성전자 (005930)",
                      shares: "30주",
                      estimatedValue: "2,100,000원"
                    },
                    {
                      name: "Apple (AAPL)",
                      shares: "10주",
                      estimatedValue: "1,900,000원"
                    },
                    {
                      name: "국내 대형주 ETF",
                      shares: "200좌",
                      estimatedValue: "2,000,000원"
                    }
                  ]
                },
                {
                  category: "채권",
                  percentage: fallbackProfile.recommendedAssets.bonds,
                  amount: fallbackProfile.recommendedAssets.bonds * 1000000,
                  investments: [
                    {
                      name: "국고채 10년 ETF",
                      shares: "600좌",
                      estimatedValue: "6,000,000원"
                    },
                    {
                      name: "회사채 ETF",
                      shares: "400좌",
                      estimatedValue: "4,000,000원"
                    }
                  ]
                },
                {
                  category: "현금",
                  percentage: fallbackProfile.recommendedAssets.cash,
                  amount: fallbackProfile.recommendedAssets.cash * 1000000,
                  investments: [
                    {
                      name: "고금리 적금",
                      shares: "-",
                      estimatedValue: "1,500,000원"
                    },
                    {
                      name: "예비 현금",
                      shares: "-",
                      estimatedValue: "500,000원"
                    }
                  ]
                },
                {
                  category: "부동산",
                  percentage: fallbackProfile.recommendedAssets.alternatives,
                  amount: fallbackProfile.recommendedAssets.alternatives * 1000000,
                  investments: [
                    {
                      name: "리츠 ETF",
                      shares: "50좌",
                      estimatedValue: "500,000원"
                    }
                  ]
                },
                {
                  category: "암호화폐",
                  percentage: 5,
                  amount: 500000,
                  investments: [
                    {
                      name: "비트코인 (BTC)",
                      shares: "0.01 BTC",
                      estimatedValue: "300,000원"
                    },
                    {
                      name: "이더리움 (ETH)",
                      shares: "0.1 ETH",
                      estimatedValue: "200,000원"
                    }
                  ]
                }
              ],
              notes: [
                "분산투자를 통한 리스크 관리가 핵심입니다",
                "3개월마다 포트폴리오 리밸런싱을 권장합니다",
                "세금 효율적인 투자를 위해 ISA, 연금저축 등을 활용하세요",
                "시장 변동성에 따라 자산 배분 비율을 조정할 수 있습니다"
              ]
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

          console.log('⚠️ Fallback 분석 사용 - 선택된 프로필:', fallbackProfile.type);
          
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
            fallback: true,
            fallbackReason: error.message || 'OpenAI API 오류',
            debugInfo: {
              averageScore: averageScore.toFixed(2),
              totalScore: totalScore,
              hasApiKey: env.OPENAI_API_KEY ? true : false,
              errorType: error.name || 'Unknown',
              timestamp: new Date().toISOString()
            }
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

 