'use client';

import IconButton from '@/components/ui/IconButton';
import RingCard from '@/components/works/RingCard';
import { useWorksExperience } from '@/components/works/WorksExperienceProvider';
import { RING_CIRCUMFERENCE, countdownOffset, ringCardLayout } from '@/lib/ring/geometry';
import styles from '@/styles/works/ring.module.css';

/**
 * 전체 작품을 3D 링으로 둘러 보여 주는 오버레이 — 클라이언트 컴포넌트.
 *
 * 상태와 입력 처리는 useRingCarousel 훅이, 배치 계산은 lib/ring/geometry 가 맡는다.
 * 이 컴포넌트는 그 결과를 화면에 배치하는 일만 한다.
 */
export default function RingOverlay() {
  const { works, ring, ringControls, openWork } = useWorksExperience();

  if (!ring.isOpen) return null;

  /* 카드가 날아오는 동안에는 배경과 안내 UI 를 숨겨 둔다. */
  const chromeOpacity = ring.isFlying ? 0 : 1;
  const totalLabel = String(works.length).padStart(2, '0');

  return (
    <div
      className={styles.root}
      role="dialog"
      aria-modal="true"
      aria-label="전체 작품 둘러보기"
      onWheel={ringControls.onWheel}
      onPointerDown={ringControls.onPointerDown}
      onPointerMove={ringControls.onPointerMove}
      onPointerUp={ringControls.onPointerUp}
      onPointerLeave={ringControls.onPointerUp}
    >
      {/* 바깥을 클릭하면 닫힌다. 단, 드래그로 회전시킨 직후의 클릭은 무시한다. */}
      <div
        className={styles.backdrop}
        style={{ opacity: chromeOpacity }}
        onClick={() => {
          if (!ringControls.isDragging()) ringControls.close();
        }}
      />

      <div className={styles.stage}>
        <div className={styles.stageInner}>
          {works.map((work, index) => {
            const layout = ringCardLayout({
              index,
              count: works.length,
              rotation: ring.rotation,
              viewport: ring.viewport,
              rects: ring.rects,
              moreRect: ring.moreRect,
              flying: ring.isFlying,
              settled: ring.isSettled,
            });

            return (
              <RingCard
                key={work.id}
                work={work}
                layout={layout}
                onOpen={() => {
                  if (!ringControls.isDragging()) openWork(index);
                }}
                onPause={ringControls.pause}
                onResume={ringControls.resume}
              />
            );
          })}
        </div>
      </div>

      <div className={styles.topBar} style={{ opacity: chromeOpacity }}>
        <span className={styles.hint}>
          전체 작품 {totalLabel} · 휠 · 드래그 · ← → 로 회전 · 5초마다 한 칸 자동 이동 · 바깥
          클릭으로 닫힘
        </span>

        <div className={styles.countdown}>
          {/* 다음 자동 회전까지 남은 시간 */}
          <svg viewBox="0 0 48 48" className={styles.countdownRing} aria-hidden>
            <circle cx="24" cy="24" r="22" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="2" />
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={countdownOffset(ring.countdown)}
            />
          </svg>
          <IconButton
            tone="filled"
            stretch
            className={styles.countdownClose}
            onClick={ringControls.close}
            aria-label="둘러보기 닫기"
          >
            ×
          </IconButton>
        </div>
      </div>

      <div className={styles.controls} style={{ opacity: chromeOpacity }}>
        <IconButton tone="filled" size={48} onClick={ringControls.prev} aria-label="이전 작품">
          ←
        </IconButton>
        <IconButton tone="filled" size={48} onClick={ringControls.next} aria-label="다음 작품">
          →
        </IconButton>
      </div>
    </div>
  );
}
