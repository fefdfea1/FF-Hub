import type { Rect, RingCardLayout } from '@/lib/types';

/** 자동 회전이 한 칸 넘어가는 간격(ms) */
export const RING_STEP_MS = 5000;
/** 카드가 그리드에서 링으로 날아가 자리를 잡기까지 걸리는 시간(ms) */
export const RING_SETTLE_MS = 1050;
/** 링을 닫을 때 카드가 그리드 자리로 되돌아가는 시간(ms) */
export const RING_CLOSE_MS = 1000;
/** 카운트다운 원의 둘레 (r=22 기준 2πr) */
export const RING_CIRCUMFERENCE = 138.2;

/** 모바일 배치로 넘어가는 기준 폭(px) */
export const MOBILE_BREAKPOINT = 640;

/**
 * 링의 반지름.
 * 데스크톱·태블릿에서는 320~560px 사이로, 모바일에서는 화면 폭의 절반(최소 200px)으로 잡는다.
 * 모바일은 반지름을 줄여 카드가 화면 밖으로 크게 벗어나지 않게 한다.
 */
export function ringRadius(viewportWidth: number): number {
  return viewportWidth < MOBILE_BREAKPOINT
    ? Math.max(200, viewportWidth * 0.5)
    : Math.min(560, Math.max(320, viewportWidth * 0.36));
}

/**
 * 링에 놓이는 카드 한 장의 크기.
 * 모바일에서는 반지름 대비 카드를 크게(0.9배) 잡아 좁은 화면에서도 내용이 읽히게 한다.
 */
export function ringCardSize(
  radius: number,
  viewportWidth: number,
): { width: number; height: number } {
  const ratio = viewportWidth < MOBILE_BREAKPOINT ? 0.9 : 0.5;
  const width = Math.round(radius * ratio);
  return { width, height: Math.round(width * 0.72) };
}

/** 카드 한 장이 링에서 차지하는 각도 */
export function stepAngle(count: number): number {
  return count > 0 ? 360 / count : 0;
}

type LayoutArgs = {
  /** 카드의 목록상 위치 */
  index: number;
  /** 전체 카드 수 */
  count: number;
  /** 현재 링 회전각(도) */
  rotation: number;
  /** 뷰포트 크기 */
  viewport: { width: number; height: number };
  /** 그리드 카드들의 화면 좌표 (비행 출발점) */
  rects: Rect[];
  /** "더보기" 버튼 좌표. 그리드에 없는 카드는 여기서 출발한다. */
  moreRect: Rect | null;
  /** true 면 그리드 좌표에 붙어 있는 상태(열기 직전 / 닫는 중) */
  flying: boolean;
  /** 자리를 다 잡아 자동 회전 중인지 여부. 회전 중에는 transition 을 끈다. */
  settled: boolean;
};

/**
 * 링 카드 한 장의 배치를 계산한다.
 *
 * 동작 방식은 FLIP 과 같다.
 *  - flying = true  : 그리드에서 카드가 있던 자리/크기 그대로 둔다.
 *  - flying = false : 원 위의 제 위치(translateZ(R))로 transition 을 태워 날려 보낸다.
 * 닫을 때는 다시 flying = true 로 돌려 같은 경로를 거꾸로 되짚는다.
 */
export function ringCardLayout({
  index,
  count,
  rotation,
  viewport,
  rects,
  moreRect,
  flying,
  settled,
}: LayoutArgs): RingCardLayout {
  const radius = ringRadius(viewport.width);
  const { width, height } = ringCardSize(radius, viewport.width);
  const centerX = viewport.width / 2;
  const centerY = viewport.height / 2 + 10;

  const angle = (index * 360) / Math.max(1, count) + rotation;
  const cos = Math.cos((angle * Math.PI) / 180);

  const gridRect = rects[index];
  /** 화면 밖에 있던 카드는 날아오는 모습이 보이지 않으므로 페이드로만 처리한다. */
  const onScreen = !!gridRect && gridRect.y + gridRect.h > 40 && gridRect.y < viewport.height;
  const from = gridRect ?? moreRect ?? { x: centerX - 20, y: centerY - 20, w: 40, h: 40 };
  const scale = (from.w / width).toFixed(3);

  const wrapTransform = flying
    ? `translate3d(${(from.x + from.w / 2 - centerX).toFixed(1)}px,${(
        from.y +
        from.h / 2 -
        centerY
      ).toFixed(1)}px,0) rotateY(${angle.toFixed(2)}deg) translateZ(0px) scale3d(${scale},${scale},${scale})`
    : `translate3d(0,0,0) rotateY(${angle.toFixed(2)}deg) translateZ(${radius}px) scale3d(1,1,1)`;

  return {
    left: Math.round(centerX - width / 2),
    top: Math.round(centerY - height / 2),
    width,
    height,
    wrapTransform,
    innerTransform: `rotateY(${(-angle).toFixed(2)}deg)`,
    transition: settled
      ? 'none'
      : onScreen
        ? 'transform 1s cubic-bezier(.2,.8,.2,1)'
        : 'transform .6s cubic-bezier(.2,.8,.2,1)',
    opacity: flying ? (onScreen ? '1' : '0') : (0.3 + (0.7 * (cos + 1)) / 2).toFixed(2),
    opacityTransition: flying && !onScreen ? 'none' : 'opacity .6s ease,filter .6s',
    filter: flying ? 'none' : `blur(${(Math.round((1 - cos) * 2 * 2) / 2).toFixed(1)}px)`,
  };
}

/** 카운트다운 원의 stroke-dashoffset. progress 1 → 가득 참, 0 → 비어 있음 */
export function countdownOffset(progress: number): string {
  return (RING_CIRCUMFERENCE * (1 - progress)).toFixed(1);
}
