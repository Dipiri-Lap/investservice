# 🚀 SmartInvest - 투자 성향 분석 및 포트폴리오 추천 서비스

## 📊 프로젝트 개요

SmartInvest는 25문항의 과학적 설문을 통해 사용자의 투자 성향을 분석하고, AI 기반의 맞춤형 포트폴리오를 추천하는 웹 애플리케이션입니다.

### 🎯 주요 기능

- **📝 25문항 투자 성향 설문**: 체계적인 설문을 통한 정확한 투자 성향 분석
- **🤖 AI 기반 분석**: GPT API를 활용한 투자 성향 분류 (5단계)
- **📈 맞춤형 포트폴리오 추천**: 개인별 최적화된 자산 배분 전략 제공
- **📊 시각화된 결과**: 차트와 그래프를 통한 직관적인 결과 표시
- **📱 반응형 디자인**: 모바일과 데스크톱 모든 환경에서 최적화된 UI

### 🏷️ 투자 성향 분류

1. **매우 보수적**: 원금 보장 중시, 안정적 수익 추구
2. **보수적**: 안정성 우선, 제한적 위험 감수
3. **균형형**: 안정성과 수익성의 균형 추구
4. **성장형**: 장기 성장 중시, 적극적 투자
5. **매우 공격적**: 최대 수익 추구, 높은 위험 감수

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **AI Integration**: OpenAI GPT API

## 📦 설치 및 실행

### 1. 프로젝트 클론

```bash
git clone https://github.com/your-username/funding-service.git
cd funding-service
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# OpenAI API 키 (향후 AI 기반 분석을 위해 필요)
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 애플리케이션을 확인하세요.

## 🎨 프로젝트 구조

```
src/
├── app/                    # Next.js 13+ App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈 페이지
│   ├── survey/            # 설문 페이지
│   │   └── page.tsx
│   └── results/           # 결과 페이지
│       └── page.tsx
├── components/            # 재사용 가능한 컴포넌트
├── data/                  # 데이터 및 타입 정의
│   └── surveyQuestions.ts # 설문 문항 및 분석 로직
└── styles/               # 전역 스타일
```

## 📱 사용 방법

### 1. 홈 페이지 접속
- 서비스 소개 및 주요 기능 확인
- "투자 성향 분석 시작하기" 버튼 클릭

### 2. 설문 진행
- 25문항의 투자 성향 설문에 답변
- 실시간 진행률 확인
- 이전/다음 버튼으로 자유로운 네비게이션

### 3. 결과 확인
- 투자 성향 분석 결과 확인
- 맞춤형 포트폴리오 추천 받기
- 시각화된 자산 배분 차트 확인

### 4. 결과 활용
- 투자 성향별 특징 및 추천 사항 검토
- 결과 저장 및 출력 기능 활용
- 필요시 재분석 진행

## 🔧 커스터마이징

### 설문 문항 수정
`src/data/surveyQuestions.ts` 파일에서 설문 문항을 수정할 수 있습니다:

```typescript
export const surveyQuestions: SurveyQuestion[] = [
  {
    id: 1,
    question: "새로운 질문을 추가해보세요",
    category: "risk_tolerance",
    options: [
      { text: "옵션 1", score: 1 },
      { text: "옵션 2", score: 2 },
      // ...
    ]
  },
  // ...
]
```

### 투자 성향 분류 기준 변경
`calculateInvestmentProfile` 함수에서 점수 기준을 조정할 수 있습니다:

```typescript
export function calculateInvestmentProfile(scores: number[]): InvestmentProfile {
  const averageScore = totalScore / scores.length;
  
  if (averageScore <= 1.8) {
    return investmentProfiles.very_conservative;
  }
  // 기준 점수 조정 가능
}
```

## 🚀 배포

### Vercel 배포 (권장)

```bash
npm run build
```

Vercel에 프로젝트를 연결하고 자동 배포 설정을 완료하세요.

### 다른 플랫폼 배포

```bash
npm run build
npm run start
```

## 📊 향후 개발 계획

- [ ] OpenAI GPT API 연동을 통한 AI 기반 투자 성향 분석
- [ ] 실시간 주식/암호화폐 데이터 연동
- [ ] 개인화된 투자 종목 추천 시스템
- [ ] 사용자 계정 관리 및 히스토리 저장
- [ ] 포트폴리오 성과 추적 기능
- [ ] 투자 교육 콘텐츠 제공

## 🤝 기여 방법

1. 프로젝트를 Fork합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 Push합니다 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성합니다

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참고하세요.

## 📧 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 언제든지 연락주세요:

- 이메일: your.email@example.com
- GitHub Issues: [프로젝트 이슈 페이지](https://github.com/your-username/funding-service/issues)

---

⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요! 