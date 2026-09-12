import type { Service } from '@/lib/types';

/**
 * 서비스 아코디언 항목.
 * 추가/제거는 이 배열만 고치면 되고, 좌측 번호(01, 02 …)는 자동으로 다시 매겨진다.
 */
export const services: Service[] = [
  {
    id: 'brand-site',
    title: '브랜드 웹사이트',
    description:
      '브랜드의 톤과 이야기를 화면 구조, 타이포, 모션으로 옮깁니다. 기획부터 디자인, 퍼블리싱까지 함께합니다.',
  },
  {
    id: 'commerce',
    title: '쇼핑몰 디자인',
    description:
      '상품 탐색부터 결제까지의 흐름을 설계하고, 브랜드 감도를 유지하는 리스트·상세 화면을 디자인합니다.',
  },
  {
    id: 'landing',
    title: '랜딩 페이지',
    description:
      '캠페인·출시용 단일 페이지. 스크롤 한 번에 메시지가 전달되도록 장면 단위로 구성합니다.',
  },
  {
    id: 'interaction',
    title: '인터랙션 디자인',
    description: '커서, 스크롤, 전환 등 화면의 움직임을 설계하고 프로토타입으로 검증합니다.',
  },
  {
    id: 'publishing',
    title: '반응형 퍼블리싱',
    description:
      '데스크톱·태블릿·모바일에서 같은 경험이 되도록 시맨틱 마크업과 성능을 기준으로 구현합니다.',
  },
  {
    id: 'maintenance',
    title: '유지보수/운영',
    description: '오픈 이후 콘텐츠 업데이트, 성능 점검, 소규모 개선을 정기적으로 진행합니다.',
  },
];
