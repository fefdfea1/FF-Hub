import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';

import { site } from '@/lib/data/site';
import '@/styles/base/globals.css';

/**
 * 시안의 본문 서체(Manrope)는 next/font 로 셀프 호스팅한다.
 * 한글은 Pretendard 로 떨어지도록 CSS 변수 폰트 스택에서 뒤에 이어 붙인다.
 */
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
  variable: '--font-manrope',
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#070a12',
  colorScheme: 'dark',
};

/**
 * 루트 레이아웃 — 서버 컴포넌트.
 * 문서 뼈대와 전역 스타일, 서체만 담당하고 화면 구성은 page.tsx 가 맡는다.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={manrope.variable}>
      <head>
        {/* 한글 본문 서체 */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body>
        {children}
        {/* Vercel 방문 지표 수집 */}
        <Analytics />
      </body>
    </html>
  );
}
