# OpenAI API 키 설정 방법

## 1. OpenAI API 키 발급

1. [OpenAI 공식 웹사이트](https://platform.openai.com/)에 접속
2. 계정 생성 또는 로그인
3. API Keys 메뉴에서 새 API 키 생성
4. 생성된 API 키 복사 (한 번만 표시되므로 안전하게 보관)

## 2. 환경 변수 설정

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하고 다음 내용을 추가:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
```

**주의사항:**
- `.env.local` 파일은 Git에 커밋되지 않도록 `.gitignore`에 포함되어 있습니다
- API 키는 절대 공개되지 않도록 주의하세요
- 실제 API 키로 `sk-your-actual-api-key-here` 부분을 교체하세요

## 3. 서비스 실행

```bash
npm run dev
```

API 키가 올바르게 설정되면 설문 완료 후 AI 분석 결과를 받을 수 있습니다.

## 4. 비용 정보

- GPT-4 API 사용 시 토큰당 비용이 발생합니다
- 분석 1회당 약 $0.03-0.05 (한화 약 40-70원) 예상
- OpenAI 대시보드에서 사용량을 모니터링할 수 있습니다

## 5. 오류 발생 시

API 키가 없거나 오류가 발생하면 자동으로 기본 분석으로 전환됩니다.
- 신뢰도 70%의 기본 분석 제공
- AI 분석 대비 간소화된 내용 제공 