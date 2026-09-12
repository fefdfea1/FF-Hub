/** 작품 목록에 사람이 직접 적어 넣는 입력 형태 */
export type WorkInput = {
  /** 고유 키. React key 와 DOM 식별자에 쓰인다. */
  id: string;
  /** 작품(사이트) 이름 */
  name: string;
  /** 분류. 예) 카페 브랜드 사이트 */
  category: string;
  /** 제작 연도 */
  year: string;
  /**
   * 썸네일 이미지 경로. public 폴더 기준이다. (예: /works/bon-coffee.webp)
   * 생략하면 그라디언트 면만 보인다.
   */
  image?: string;
  /** 이미지가 없을 때 쓰는 카드 배경. 이미지가 로드되기 전 바탕으로도 쓰인다. */
  gradient?: string;
  /** 실제 사이트 주소. 있으면 상세 모달의 방문 버튼이 활성화된다. */
  href?: string;
};

/** 화면이 사용하는 정규화된 작품 형태 */
export type Work = Required<Omit<WorkInput, 'href' | 'image'>> &
  Pick<WorkInput, 'href' | 'image'> & {
    /** 0부터 시작하는 목록상의 위치 */
    index: number;
    /** "01" 형태의 2자리 번호 */
    label: string;
  };

/** 서비스 아코디언 한 줄 */
export type Service = {
  id: string;
  title: string;
  description: string;
};

/** 링 캐러셀이 출발 지점으로 삼는 그리드 카드의 화면 좌표 */
export type Rect = { x: number; y: number; w: number; h: number };

/** 링 캐러셀 카드 한 장의 계산된 배치 값 */
export type RingCardLayout = {
  left: number;
  top: number;
  width: number;
  height: number;
  /** 바깥 래퍼 transform (원형 배치 + 비행 애니메이션) */
  wrapTransform: string;
  /** 카드가 정면을 보도록 되돌리는 transform */
  innerTransform: string;
  transition: string;
  opacity: string;
  opacityTransition: string;
  filter: string;
};
