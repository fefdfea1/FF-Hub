'use client';

import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react';
import { useRef } from 'react';

import { useWorksExperience } from '@/components/works/WorksExperienceProvider';
import styles from '@/styles/works/grid.module.css';

/** 마우스 위치에 따라 카드가 기울어지는 최대 각도 */
const MAX_TILT_DEG = 10;

/**
 * 작품 그리드에 동작을 입히는 클라이언트 경계.
 *
 * children 으로 서버에서 완성된 카드 목록을 그대로 받아,
 * 이벤트 위임으로 클릭(상세 열기)과 마우스 기울임만 얹는다.
 * 카드 자체는 클라이언트 컴포넌트가 되지 않으므로
 * 작품이 몇 개로 늘어나도 번들 크기는 그대로다.
 */
export default function WorkGridInteraction({ children }: { children: ReactNode }) {
  const { openWork, ring } = useWorksExperience();
  /** 마지막으로 기울인 카드. 다른 카드로 넘어갈 때 되돌리기 위해 기억한다. */
  const tiltedRef = useRef<HTMLElement | null>(null);

  const findCard = (event: ReactMouseEvent) =>
    (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-work-index]') ?? null;

  const resetTilt = () => {
    if (tiltedRef.current) tiltedRef.current.style.transform = '';
    tiltedRef.current = null;
  };

  const handleClick = (event: ReactMouseEvent) => {
    const card = findCard(event);
    if (!card) return;
    const index = Number(card.dataset.workIndex);
    if (Number.isInteger(index)) openWork(index);
  };

  const handleMouseMove = (event: ReactMouseEvent) => {
    const card = findCard(event);
    if (tiltedRef.current && tiltedRef.current !== card) resetTilt();
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    /* 상태 대신 DOM 을 직접 만져 리렌더 없이 매끄럽게 따라오게 한다. */
    card.style.transform =
      `perspective(900px) rotateX(${(-y * MAX_TILT_DEG).toFixed(2)}deg)` +
      ` rotateY(${(x * MAX_TILT_DEG).toFixed(2)}deg) translateY(-4px)`;
    tiltedRef.current = card;
  };

  return (
    <div
      className={styles.interaction}
      data-ring-open={ring.isOpen ? 'true' : 'false'}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
    >
      {children}
    </div>
  );
}
