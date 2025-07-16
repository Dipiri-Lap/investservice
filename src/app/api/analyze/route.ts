import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { groupQuestions, detailQuestions, commonOptions, groupMapping, determineGroup, determineDetailType, InvestmentProfile, investmentProfiles } from '@/data/surveyQuestions'
import { preGeneratedAnalysis } from '@/data/preGeneratedAnalysis'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// 성향군별 예상 답변 개수 계산
function getExpectedAnswerCount(selectedGroup: keyof typeof groupMapping) {
  return groupMapping[selectedGroup].length * 4;
}

export async function POST(request: NextRequest) {
  // CORS 헤더 설정 (모바일 브라우저 호환성)
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Cache-Control, Pragma',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }

  try {
    const { groupAnswers, detailAnswers, selectedGroup } = await request.json()

    // 1단계: 성향군 구분 답변 검증
    if (!groupAnswers || !Array.isArray(groupAnswers) || groupAnswers.length !== 9) {
      return NextResponse.json(
        { error: '유효하지 않은 성향군 구분 답변 데이터입니다.' },
        { 
          status: 400,
          headers: corsHeaders
        }
      )
    }

    // 2단계: 세부 성향 답변 검증
    if (!detailAnswers || !Array.isArray(detailAnswers) || !selectedGroup) {
      return NextResponse.json(
        { error: '유효하지 않은 세부 성향 답변 데이터입니다.' },
        { 
          status: 400,
          headers: corsHeaders
        }
      )
    }

    // 성향군별 예상 답변 개수 확인
    const expectedAnswerCount = getExpectedAnswerCount(selectedGroup as keyof typeof groupMapping)
    if (detailAnswers.length !== expectedAnswerCount) {
      return NextResponse.json(
        { error: `선택된 성향군(${selectedGroup})에 대한 답변 개수가 올바르지 않습니다. ${expectedAnswerCount}개의 답변이 필요합니다.` },
        { 
          status: 400,
          headers: corsHeaders
        }
      )
    }

    // 1단계 설문 답변을 텍스트로 변환
    const groupSurveyResults = groupAnswers.map((answerScore: number, index: number) => {
      const question = groupQuestions[index]
      const selectedOption = commonOptions.find(option => option.score === answerScore)
      
      return {
        questionNumber: index + 1,
        group: question.group,
        question: question.question,
        selectedAnswer: selectedOption?.text || '답변 없음',
        score: answerScore
      }
    }).filter(result => result.selectedAnswer !== '답변 없음')

    // 2단계 설문 답변을 텍스트로 변환
    const detailSurveyResults = detailAnswers.map((answerScore: number, index: number) => {
      const questionTypes = groupMapping[selectedGroup as keyof typeof groupMapping]
      const typeIndex = Math.floor(index / 4)
      const questionIndex = index % 4
      const actualQuestionIndex = questionTypes.findIndex(type => type === questionTypes[typeIndex]) * 4 + questionIndex + 10
      
      const question = detailQuestions.find(q => q.id === actualQuestionIndex)
      const selectedOption = commonOptions.find(option => option.score === answerScore)
      
      return {
        questionNumber: actualQuestionIndex,
        type: question?.type || 'unknown',
        question: question?.question || '알 수 없는 질문',
        selectedAnswer: selectedOption?.text || '답변 없음',
        score: answerScore
      }
    }).filter(result => result.selectedAnswer !== '답변 없음')

    // 평균 점수 계산
    const groupTotalScore = groupAnswers.reduce((sum: number, score: number) => sum + score, 0)
    const detailTotalScore = detailAnswers.reduce((sum: number, score: number) => sum + score, 0)
    const groupAverageScore = groupTotalScore / groupAnswers.length
    const detailAverageScore = detailTotalScore / detailAnswers.length

    // GPT에게 보낼 프롬프트 구성
    const prompt = `
다음은 2단계 투자 성향 분석을 위한 설문 결과입니다. 1단계에서 성향군을 구분하고, 2단계에서 세부 성향을 분석하여 최종 투자 성향을 정확히 판단해주세요.

**1단계: 성향군 구분 결과**
선택된 성향군: ${selectedGroup}
성향군 평균 점수: ${groupAverageScore.toFixed(2)}점 (총 ${groupTotalScore}점 / 9문항)

1단계 설문 결과:
${groupSurveyResults.map(result => 
  `${result.questionNumber}. [${result.group}] ${result.question}
  답변: ${result.selectedAnswer} (점수: ${result.score})`
).join('\n\n')}

**2단계: 세부 성향 분석 결과**
세부 성향 평균 점수: ${detailAverageScore.toFixed(2)}점 (총 ${detailTotalScore}점 / ${detailAnswers.length}문항)

2단계 설문 결과:
${detailSurveyResults.map(result => 
  `${result.questionNumber}. [${result.type}] ${result.question}
  답변: ${result.selectedAnswer} (점수: ${result.score})`
).join('\n\n')}

**새로운 10가지 투자 성향 분류:**

1. **보수형 (conservative)**: 안전성을 최우선으로 하며, 원금 보장을 중시하는 투자 성향
2. **안정추구형 (stability_focused)**: 안정적인 수익을 추구하며, 변동성을 최소화하는 투자 성향
3. **배당중시형 (dividend_focused)**: 배당 수익을 중시하며, 꾸준한 현금 흐름을 추구하는 투자 성향
4. **균형형 (balanced)**: 안정성과 수익성의 균형을 추구하며, 분산 투자를 선호하는 성향
5. **성장지향형 (growth_oriented)**: 장기적 자산 성장을 목표로 하며, 성장 가능성을 중시하는 투자 성향
6. **가치중시형 (value_focused)**: 저평가된 가치주를 선호하며, 펀더멘털 분석을 중시하는 투자 성향
7. **사회책임투자형 (esg_focused)**: ESG 요소를 고려하며, 사회적 가치와 지속가능성을 중시하는 투자 성향
8. **공격형 (aggressive)**: 높은 위험을 감수하며, 공격적인 투자 전략을 선호하는 성향
9. **혁신추구형 (innovation_focused)**: 혁신적인 기술과 신성장 분야에 투자하며, 미래 가치를 추구하는 성향
10. **단기차익추구형 (short_term_profit_focused)**: 단기적인 차익 실현을 목표로 하며, 활발한 매매를 선호하는 성향

**성향군별 세부 성향:**
- 안정추구형 성향군: 보수형, 안정추구형, 배당중시형, 균형형
- 수익추구형 성향군: 성장지향형, 가치중시형, 사회책임투자형
- 적극적/투기형 성향군: 공격형, 혁신추구형, 단기차익추구형

분석 요청사항:
1. 1단계에서 결정된 성향군(${selectedGroup}) 내에서 2단계 답변을 바탕으로 세부 성향을 분석해주세요.
2. 2단계 답변에서 각 성향별 점수를 계산하여 가장 높은 점수의 성향을 선택해주세요.
3. 투자 성향 분석 시 리스크 감내력, 투자 목적, 투자 전략, 심리적 특성을 종합적으로 고려해주세요.
4. 투자 성향 상세 설명(description)에는 점수나 평균 점수와 같은 수치 정보는 포함하지 말고, 순수하게 투자 성향의 특징과 행동 패턴만 설명해주세요.
5. 포트폴리오 구성 시 주식, 채권, 현금, 부동산(REITs), 암호화폐 비중을 총 100%로 맞춰주세요.
6. 주식 투자 부분에 대해서는 투자 성향에 맞는 세부 배분을 제공해주세요 (배당주, 성장주, 테마주, 가치주의 비중을 %로 표시하며, 총합이 100%가 되도록). 
   - 보수적 성향: 배당주 50-70%, 가치주 20-30%, 성장주 10-20%, 테마주 0-10%
   - 균형 성향: 배당주 30-40%, 가치주 25-35%, 성장주 20-30%, 테마주 10-20%
   - 공격적 성향: 성장주 40-50%, 테마주 25-35%, 배당주 10-20%, 가치주 10-20%
7. 각 주식 유형별로 한국 3개, 미국 3개씩 총 6개를 추천해주세요 (배당주, 성장주, 테마주, 가치주 각각 국가별 3개씩).
8. 추천 주식 종목은 분석 당일 날짜를 기준으로 검색하여 최신 트렌드를 고려하여 투자 성향에 맞는 다양성을 고려해주세요.
9. 각 종목에는 국가(한국/미국), 거래소(KRX/NYSE/NASDAQ), 추천 이유를 포함해주세요.
10. 분석 당일일 날짜를 토대로 검색하여 주식 트렌드를 반영하여 추천.
11. 투자 성향에 따라 보수적이면 안전한 대형주, 공격적이면 성장주나 테마주를 추천해주세요.
12. 암호화폐도 투자 성향에 맞게 3-5개를 추천해주세요 (보수적이면 비트코인/이더리움 위주, 공격적이면 알트코인 포함).
13. 1억원을 기준으로 한 구체적인 포트폴리오 예시를 제공해주세요. 각 자산군별 금액, 추천 종목과 수량을 포함하여 실제 투자 가능한 형태로 작성해주세요.
14. 투자 성향에 따른 투자 기간(단기 1년 이하, 중기 1-5년, 장기 5년 이상)을 분석하고, 각 기간별 행동지침을 제공해주세요:
    - 월별: 기존 투자 자산 모니터링, 추가 투자금 확보 방법, 시장 상황 대응
    - 분기별: 포트폴리오 리밸런싱, 수익 실현/손절 기준, 새로운 투자 기회 발굴
    - 반기별: 투자 전략 재검토, 자산 배분 조정, 세금 최적화 방안
    - 년도별: 투자 목표 재설정, 장기 계획 수립, 투자 성과 종합 평가
    각 기간별로 투자 성향에 맞는 구체적이고 실행 가능한 행동 방안을 제시해주세요.
15. 모든 답변은 전문적이고 구체적인 어투로 200-300자 분량으로 작성해주세요.

다음 JSON 형식으로만 응답해주세요:
{
  "investmentType": "conservative|stability_focused|dividend_focused|balanced|growth_oriented|value_focused|esg_focused|aggressive|innovation_focused|short_term_profit_focused",
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
      },
      {
        "category": "dividend",
        "name": "배당주 기업명",
        "ticker": "종목코드",
        "market": "KRX 또는 NYSE/NASDAQ",
        "country": "한국 또는 미국",
        "reason": "배당 수익률, 안정성 등 추천 이유 (100-150자)"
      },
      {
        "category": "dividend",
        "name": "배당주 기업명",
        "ticker": "종목코드",
        "market": "KRX 또는 NYSE/NASDAQ",
        "country": "한국 또는 미국",
        "reason": "배당 수익률, 안정성 등 추천 이유 (100-150자)"
      },
      {
        "category": "dividend",
        "name": "배당주 기업명",
        "ticker": "종목코드",
        "market": "KRX 또는 NYSE/NASDAQ",
        "country": "한국 또는 미국",
        "reason": "배당 수익률, 안정성 등 추천 이유 (100-150자)"
      },
      {
        "category": "dividend",
        "name": "배당주 기업명",
        "ticker": "종목코드",
        "market": "KRX 또는 NYSE/NASDAQ",
        "country": "한국 또는 미국",
        "reason": "배당 수익률, 안정성 등 추천 이유 (100-150자)"
      },
      {
        "category": "dividend",
        "name": "배당주 기업명",
        "ticker": "종목코드",
        "market": "KRX 또는 NYSE/NASDAQ",
        "country": "한국 또는 미국",
        "reason": "배당 수익률, 안정성 등 추천 이유 (100-150자)"
      },
      {
        "category": "growth",
        "name": "성장주 기업명",
        "ticker": "종목코드",
        "market": "KRX 또는 NYSE/NASDAQ",
        "country": "한국 또는 미국",
        "reason": "성장성, 기술력 등 추천 이유 (100-150자)"
      },
      {
        "category": "growth",
        "name": "성장주 기업명",
        "ticker": "종목코드",
        "market": "KRX 또는 NYSE/NASDAQ",
        "country": "한국 또는 미국",
        "reason": "성장성, 기술력 등 추천 이유 (100-150자)"
      },
      {
        "category": "growth",
        "name": "성장주 기업명",
        "ticker": "종목코드",
        "market": "KRX 또는 NYSE/NASDAQ",
        "country": "한국 또는 미국",
        "reason": "성장성, 기술력 등 추천 이유 (100-150자)"
      },
      {
        "category": "growth",
        "name": "성장주 기업명",
        "ticker": "종목코드",
        "market": "KRX 또는 NYSE/NASDAQ",
        "country": "한국 또는 미국",
        "reason": "성장성, 기술력 등 추천 이유 (100-150자)"
      },
      {
        "category": "growth",
        "name": "성장주 기업명",
        "ticker": "종목코드",
        "market": "KRX 또는 NYSE/NASDAQ",
        "country": "한국 또는 미국",
        "reason": "성장성, 기술력 등 추천 이유 (100-150자)"
      },
      {
        "category": "growth",
        "name": "성장주 기업명",
        "ticker": "종목코드",
        "market": "KRX 또는 NYSE/NASDAQ",
        "country": "한국 또는 미국",
        "reason": "성장성, 기술력 등 추천 이유 (100-150자)"
      },
      {
        "category": "theme",
        "name": "테마주 기업명",
        "ticker": "종목코드",
        "market": "KRX 또는 NYSE/NASDAQ",
        "country": "한국 또는 미국",
        "reason": "테마, 트렌드 등 추천 이유 (100-150자)"
      },
      {
        "category": "theme",
        "name": "테마주 기업명",
        "ticker": "종목코드",
        "market": "KRX 또는 NYSE/NASDAQ",
        "country": "한국 또는 미국",
        "reason": "테마, 트렌드 등 추천 이유 (100-150자)"
      },
      {
        "category": "theme",
        "name": "테마주 기업명",
        "ticker": "종목코드",
        "market": "KRX 또는 NYSE/NASDAQ",
        "country": "한국 또는 미국",
        "reason": "테마, 트렌드 등 추천 이유 (100-150자)"
      },
      {
        "category": "theme",
        "name": "테마주 기업명",
        "ticker": "종목코드",
        "market": "KRX 또는 NYSE/NASDAQ",
        "country": "한국 또는 미국",
        "reason": "테마, 트렌드 등 추천 이유 (100-150자)"
      },
      {
        "category": "theme",
        "name": "테마주 기업명",
        "ticker": "종목코드",
        "market": "KRX 또는 NYSE/NASDAQ",
        "country": "한국 또는 미국",
        "reason": "테마, 트렌드 등 추천 이유 (100-150자)"
      },
      {
        "category": "theme",
        "name": "테마주 기업명",
        "ticker": "종목코드",
        "market": "KRX 또는 NYSE/NASDAQ",
        "country": "한국 또는 미국",
        "reason": "테마, 트렌드 등 추천 이유 (100-150자)"
      },
      {
        "category": "value",
        "name": "가치주 기업명",
        "ticker": "종목코드",
        "market": "KRX 또는 NYSE/NASDAQ",
        "country": "한국 또는 미국",
        "reason": "저평가, 펀더멘털 등 추천 이유 (100-150자)"
      },
      {
        "category": "value",
        "name": "가치주 기업명",
        "ticker": "종목코드",
        "market": "KRX 또는 NYSE/NASDAQ",
        "country": "한국 또는 미국",
        "reason": "저평가, 펀더멘털 등 추천 이유 (100-150자)"
      },
      {
        "category": "value",
        "name": "가치주 기업명",
        "ticker": "종목코드",
        "market": "KRX 또는 NYSE/NASDAQ",
        "country": "한국 또는 미국",
        "reason": "저평가, 펀더멘털 등 추천 이유 (100-150자)"
      },
      {
        "category": "value",
        "name": "가치주 기업명",
        "ticker": "종목코드",
        "market": "KRX 또는 NYSE/NASDAQ",
        "country": "한국 또는 미국",
        "reason": "저평가, 펀더멘털 등 추천 이유 (100-150자)"
      },
      {
        "category": "value",
        "name": "가치주 기업명",
        "ticker": "종목코드",
        "market": "KRX 또는 NYSE/NASDAQ",
        "country": "한국 또는 미국",
        "reason": "저평가, 펀더멘털 등 추천 이유 (100-150자)"
      },
      {
        "category": "value",
        "name": "가치주 기업명",
        "ticker": "종목코드",
        "market": "KRX 또는 NYSE/NASDAQ",
        "country": "한국 또는 미국",
        "reason": "저평가, 펀더멘털 등 추천 이유 (100-150자)"
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
        },
        {
          "category": "채권",
          "percentage": 30,
          "amount": 30000000,
          "investments": [
            {
              "name": "채권명 또는 ETF명",
              "shares": "수량",
              "estimatedValue": "예상 금액"
            }
          ]
        },
        {
          "category": "현금",
          "percentage": 15,
          "amount": 15000000,
          "investments": [
            {
              "name": "예비 현금 보유",
              "shares": "-",
              "estimatedValue": "15,000,000원"
            }
          ]
        },
        {
          "category": "부동산",
          "percentage": 10,
          "amount": 10000000,
          "investments": [
            {
              "name": "리츠 ETF명",
              "shares": "수량",
              "estimatedValue": "예상 금액"
            }
          ]
        },
        {
          "category": "암호화폐",
          "percentage": 5,
          "amount": 5000000,
          "investments": [
            {
              "name": "비트코인 (BTC)",
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
      },
      {
        "name": "이더리움",
        "symbol": "ETH",
        "reason": "각 암호화폐별 특징 및 투자 고려 이유 (100-150자)"
      },
      {
        "name": "바이낸스 코인",
        "symbol": "BNB",
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
`

    console.log('🚀 OpenAI API 호출 시작...')
    console.log('📊 설문 데이터 요약:', {
      selectedGroup,
      groupAnswersCount: groupAnswers.length,
      detailAnswersCount: detailAnswers.length,
      expectedAnswerCount
    })
    
    // ============================================
    // 🚫 기존 GPT API 호출 주석처리 시작
    // ============================================
    /*
    // GPT API 호출 (타임아웃 포함)
    const completion = await Promise.race([
      openai.chat.completions.create({
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
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('OpenAI API 요청 시간 초과 (90초)')), 90000)
      )
    ]) as any

    const gptResponse = completion.choices[0]?.message?.content
    if (!gptResponse) {
      throw new Error('GPT API 응답이 없습니다.')
    }

    // JSON 파싱
    let analysisResult
    try {
      analysisResult = JSON.parse(gptResponse)
      console.log('GPT 분석 결과:', { 
        investmentType: analysisResult.investmentType, 
        selectedGroup,
        groupAverageScore: groupAverageScore.toFixed(2),
        detailAverageScore: detailAverageScore.toFixed(2),
        expectedAnswerCount,
        actualAnswerCount: detailAnswers.length
      })
    } catch (parseError) {
      console.error('GPT 응답 파싱 에러:', gptResponse)
      throw new Error('GPT 응답을 파싱할 수 없습니다.')
    }
    */
    // ============================================
    // 🚫 기존 GPT API 호출 주석처리 끝
    // ============================================
    
    // ============================================
    // ✅ 새로운 preGeneratedAnalysis 사용 시작
    // ============================================
    
    console.log('✅ preGeneratedAnalysis 사용으로 GPT 분석 대체')
    
    // 1단계 성향군에서 2단계 답변을 기반으로 세부 성향 결정
    const determinedGroup = determineGroup(groupAnswers)
    const detailProfile = determineDetailType(determinedGroup, detailAnswers)
    
    // preGeneratedAnalysis에서 해당 성향의 데이터 가져오기
    const profileType = detailProfile.type
    const preGeneratedData = preGeneratedAnalysis[profileType as keyof typeof preGeneratedAnalysis]
    
    if (!preGeneratedData) {
      throw new Error(`preGeneratedAnalysis에서 '${profileType}' 성향 데이터를 찾을 수 없습니다.`)
    }
    
    // 기존 분석 결과 구조에 맞게 데이터 변환
    const analysisResult = {
      investmentType: preGeneratedData.investmentType,
      confidence: preGeneratedData.confidence,
      analysis: preGeneratedData.analysis,
      keyFindings: preGeneratedData.keyFindings
    }
    
    console.log('📊 preGeneratedAnalysis 분석 결과:', { 
      investmentType: analysisResult.investmentType, 
      selectedGroup,
      groupAverageScore: groupAverageScore.toFixed(2),
      detailAverageScore: detailAverageScore.toFixed(2),
      expectedAnswerCount,
      actualAnswerCount: detailAnswers.length,
      source: 'preGeneratedAnalysis'
    })
    
    // ============================================
    // ✅ 새로운 preGeneratedAnalysis 사용 끝
    // ============================================

    // 투자 성향 프로필 가져오기
    const baseProfile = investmentProfiles[profileType]
    
    if (!baseProfile) {
      throw new Error('유효하지 않은 투자 성향 타입입니다.')
    }

    // 분석 결과와 기본 프로필 결합
    const enhancedProfile: InvestmentProfile & { 
      gptAnalysis: any,
      confidence: number,
      keyFindings: string[]
    } = {
      ...baseProfile,
      gptAnalysis: analysisResult.analysis,
      confidence: analysisResult.confidence,
      keyFindings: analysisResult.keyFindings
    }

    console.log('✅ 분석 완료! (preGeneratedAnalysis 사용)')
    
    return NextResponse.json({
      success: true,
      profile: enhancedProfile,
      rawAnswers: {
        groupAnswers,
        detailAnswers,
        selectedGroup
      },
      questionCounts: {
        groupQuestions: 9,
        detailQuestions: expectedAnswerCount,
        total: 9 + expectedAnswerCount
      },
      dataSource: 'preGeneratedAnalysis'
    }, {
      headers: corsHeaders
    })

  } catch (error) {
    console.error('투자 성향 분석 에러:', error)
    
    // 에러 발생 시 기본 분석으로 폴백
    try {
      const { groupAnswers, detailAnswers, selectedGroup } = await request.json()
      
      // 기본 분석 실행
      const determinedGroup = determineGroup(groupAnswers)
      const detailProfile = determineDetailType(determinedGroup, detailAnswers)
      
      const expectedAnswerCount = getExpectedAnswerCount(selectedGroup as keyof typeof groupMapping)
      
      console.log('Fallback 분석 결과:', { 
        determinedGroup, 
        profileType: detailProfile.type,
        expectedAnswerCount,
        actualAnswerCount: detailAnswers.length
      })

      console.log('⚠️ 폴백 분석 사용')
      
      return NextResponse.json({
        success: true,
        profile: {
          ...detailProfile,
          gptAnalysis: {
            description: "AI 분석을 사용할 수 없어 기본 분석을 제공합니다. 설문 점수를 기반으로 한 간단한 분석 결과입니다.",
            advantages: "설문 결과를 바탕으로 한 기본적인 투자 성향 분석이 제공됩니다.",
            disadvantages: "더 정확한 분석을 위해서는 AI 분석 서비스를 이용해주세요.",
            improvements: "AI 분석 서비스를 통해 더 구체적이고 개인화된 투자 전략을 제공받을 수 있습니다.",
            portfolio: {
              stocks: detailProfile.recommendedAssets.stocks,
              bonds: detailProfile.recommendedAssets.bonds,
              cash: detailProfile.recommendedAssets.cash,
              reits: 0,
              crypto: detailProfile.recommendedAssets.alternatives,
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
          },
          confidence: 70,
          keyFindings: [
            "기본 점수 분석 기반 결과",
            "AI 분석 서비스 이용 권장",
            "추가 상담을 통한 정밀 분석 필요"
          ]
        },
        rawAnswers: {
          groupAnswers,
          detailAnswers,
          selectedGroup
        },
        questionCounts: {
          groupQuestions: 9,
          detailQuestions: expectedAnswerCount,
          total: 9 + expectedAnswerCount
        },
        fallback: true
      }, {
        headers: corsHeaders
      })
    } catch (fallbackError) {
      console.error('❌ 폴백 분석도 실패:', fallbackError)
      return NextResponse.json(
        { error: '분석 중 오류가 발생했습니다.' },
        { 
          status: 500,
          headers: corsHeaders
        }
      )
    }
  }
}

// OPTIONS 요청 처리 (CORS preflight)
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Cache-Control, Pragma',
    },
  })
} 