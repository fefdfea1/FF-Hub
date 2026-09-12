/**
 * 사이트 전역 설정값.
 * 문구·연락처·노출 개수처럼 자주 바뀌는 값은 전부 여기에 모아 둔다.
 */
export const site = {
  name: 'FF Hub',
  title: 'FF Hub — 웹 경험을 설계합니다',
  description:
    '다양한 디자인과 인터렉션을 적용한 웹 페이지를 만듭니다. 브랜드 웹사이트, 포트폴리오, 랜딩 페이지 제작.',
  email: 'fefdfeas@gmail.com',
  year: '2026',

  /** 상단 그리드에 한 번에 노출할 작품 수. 나머지는 "더보기" 링 캐러셀에서 본다. */
  worksGridLimit: 9,

  hero: {
    badge: 'NEW',
    badgeText: '2026 포트폴리오 첫 공개',
    /** 줄바꿈 지점을 배열로 나눠 둔다. */
    headline: ['웹 경험을', '설계합니다.'],
    lead: '다양한 디자인과 인터렉션을 적용한 웹 페이지를 만들고 있습니다.',
  },

  about:
    '브랜드의 이야기를 웹 화면 위의 장면으로 옮깁니다. 브랜드 웹사이트, 포트폴리오, 랜딩 페이지 등 분위기와 컨셉에 맞는 시도를 이어가고 있습니다.',

  servicesLead: '기획부터 퍼블리싱까지, 웹 한 편을 만드는 데 필요한 일을 합니다.',

  /** 상단 내비게이션. 앵커 id 는 각 섹션 컴포넌트의 id 와 짝을 이룬다. */
  nav: [
    { href: '#ff-works', label: '작품' },
    { href: '#ff-services', label: '서비스' },
    { href: '#ff-about', label: 'About' },
    { href: '#ff-contact', label: 'Contact' },
  ],
} as const;

/** 섹션 앵커 id 모음. 스크롤 이동 로직과 마크업이 같은 값을 보도록 한곳에서 관리한다. */
export const anchors = {
  works: 'ff-works',
  services: 'ff-services',
  about: 'ff-about',
  contact: 'ff-contact',
} as const;
