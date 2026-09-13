import type { Work, WorkInput } from '@/lib/types';

/**
 * 썸네일 이미지가 없을 때 쓰는 기본 그라디언트 팔레트.
 * 이미지가 있는 작품에서는 이미지가 뜨기 전 바탕색 역할을 한다.
 */
const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg,#2b1d18 0%,#8c5a44 45%,#e9c9b2 100%)',
  'linear-gradient(135deg,#17211c 0%,#4f7a63 50%,#d6e3cf 100%)',
  'linear-gradient(135deg,#1d1a33 0%,#6f63c9 50%,#ece6ff 100%)',
  'linear-gradient(135deg,#3a1f1a,#c2613f 50%,#ffd9c2)',
  'linear-gradient(135deg,#2b2417,#a68a3b 50%,#f3e7b8)',
  'linear-gradient(135deg,#0f1f2e,#2f7fb0 50%,#cfeaff)',
  'linear-gradient(135deg,#1c1c1c,#6b6b6b 50%,#e9e9e9)',
  'linear-gradient(135deg,#0d2a1f,#1f9d6a 50%,#c9f5dd)',
] as const;

/**
 * ┌──────────────────────────────────────────────────────────────┐
 * │  작품(사이트) 목록 — 이 배열 하나만 고치면 사이트 전체가 반영된다.   │
 * └──────────────────────────────────────────────────────────────┘
 *
 * 추가 : 아래 배열에 객체 하나를 추가한다. 필수 값은 id / name / category / year.
 *        image 에 썸네일 경로를 적는다. public/works/ 아래에 파일을 두고
 *        `/works/파일명.webp` 형태로 쓴다. (권장 크기 1280×800)
 *        image 를 적지 않으면 그라디언트 면만 보인다.
 *        href 를 적으면 상세 화면의 "사이트 방문" 버튼이 실제 링크로 동작한다.
 * 제거 : 해당 객체를 지우거나 앞에 `//` 를 붙여 주석 처리한다.
 * 순서 : 배열 순서 = 그리드 노출 순서 = 링 캐러셀 배치 순서.
 */
const WORK_INPUTS: WorkInput[] = [
  {
    id: 'maison-mocha',
    name: '메종모카',
    category: '카페 브랜드 사이트',
    year: '2026',
    image: '/works/maison-mocha.webp',
    href: 'https://maison-mocha-five.vercel.app',
    gradient: 'linear-gradient(135deg,#2b2417,#a68a3b 50%,#f3e7b8)',
  },
  {
    id: 'noir-coffee',
    name: '누아르커피',
    category: '카페 브랜드 사이트',
    year: '2026',
    image: '/works/noir-coffee.webp',
    href: 'https://noircoffee-flax.vercel.app',
    gradient: 'linear-gradient(135deg,#151210,#4a3a2e 50%,#c8b199)',
  },
  {
    id: 'bon-coffee',
    name: '봉커피',
    category: '카페 브랜드 사이트',
    year: '2026',
    image: '/works/bon-coffee.webp',
    href: 'https://bon-coffee-alpha.vercel.app',
    gradient: 'linear-gradient(135deg,#2b1d18 0%,#8c5a44 45%,#e9c9b2 100%)',
  },
  {
    id: 'cafe-muse',
    name: '카페뮤즈',
    category: '카페 브랜드 사이트',
    year: '2026',
    image: '/works/cafe-muse.webp',
    href: 'https://cafe-muse.vercel.app',
    gradient: 'linear-gradient(135deg,#2e1a12,#b6452c 50%,#f2e5cf)',
  },
  {
    id: 'haram-portfolio',
    name: '하람 사진',
    category: '포토그래퍼 포트폴리오',
    year: '2026',
    image: '/works/haram-portfolio.webp',
    href: 'https://photograperportfolio.vercel.app/',
    gradient: 'linear-gradient(135deg,#121212,#5a4a3a 50%,#d8c6ae)',
  },
];

/**
 * 입력값을 화면이 바로 쓰는 형태로 정규화한다.
 * (번호 부여 · 그라디언트 기본값 채우기)
 */
function normalize(inputs: WorkInput[]): Work[] {
  return inputs.map((input, index) => ({
    ...input,
    index,
    /** "01", "02" … 화면 표기에 쓰는 2자리 번호 */
    label: String(index + 1).padStart(2, '0'),
    gradient: input.gradient ?? FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length],
  }));
}

/** 정규화가 끝난 전체 작품 목록 */
export const works: Work[] = normalize(WORK_INPUTS);

/** 전체 작품 개수 */
export const totalWorks = works.length;

/** "05" 처럼 2자리로 맞춘 전체 개수 표기 */
export const totalWorksLabel = String(totalWorks).padStart(2, '0');

/** 그리드에 노출할 만큼만 잘라낸 목록 */
export function getGridWorks(limit: number): Work[] {
  return works.slice(0, Math.max(0, limit));
}
