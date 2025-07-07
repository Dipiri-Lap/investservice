import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '스마트 투자 포트폴리오 | 맞춤형 투자 성향 분석',
  description: '25문항 설문을 통한 투자 성향 분석 및 AI 기반 맞춤형 포트폴리오 추천 서비스',
  keywords: '투자, 포트폴리오, 투자성향, 자산배분, 투자추천, AI',
  authors: [{ name: '스마트 투자 포트폴리오' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </body>
    </html>
  )
} 