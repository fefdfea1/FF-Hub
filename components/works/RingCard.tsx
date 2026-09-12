'use client';

import Thumbnail from '@/components/ui/Thumbnail';
import WorkMeta from '@/components/ui/WorkMeta';
import type { RingCardLayout, Work } from '@/lib/types';
import styles from '@/styles/works/ring.module.css';

/** 이 폭보다 좁은 카드는 이름과 분류를 한 줄에 담지 못한다. */
const NARROW_CARD_WIDTH = 220;

type Props = {
  work: Work;
  layout: RingCardLayout;
  onOpen: () => void;
  onPause: () => void;
  onResume: () => void;
};

/**
 * 링 위에 놓이는 카드 한 장 — 클라이언트 컴포넌트.
 *
 * 배치 계산은 lib/ring/geometry 가 하고, 이 컴포넌트는 받은 값을 그리기만 한다.
 * 바깥 래퍼가 원형 배치와 비행을, 안쪽 버튼이 정면 복원과 흐림·투명도를 맡는다.
 * 썸네일과 메타 줄은 그리드 카드와 같은 UI 컴포넌트를 그대로 재사용한다.
 */
export default function RingCard({ work, layout, onOpen, onPause, onResume }: Props) {
  return (
    <div
      className={styles.cardWrap}
      style={{
        left: layout.left,
        top: layout.top,
        width: layout.width,
        height: layout.height,
        transform: layout.wrapTransform,
        transition: layout.transition,
      }}
    >
      <button
        type="button"
        className={styles.card}
        style={{
          transform: layout.innerTransform,
          opacity: layout.opacity,
          filter: layout.filter,
          transition: layout.opacityTransition,
        }}
        onClick={onOpen}
        onMouseEnter={onPause}
        onMouseLeave={onResume}
        aria-label={`${work.name} 상세 보기`}
        /* 카드가 좁으면 이름과 분류를 두 줄로 쌓는다. (styles/works/ring.module.css) */
        data-narrow={layout.width < NARROW_CARD_WIDTH ? 'true' : undefined}
      >
        <Thumbnail
          gradient={work.gradient}
          image={work.image}
          alt={`${work.name} 메인 화면`}
          height="calc(100% - 42px)"
        />
        <WorkMeta work={work} nameSize={13} subSize={11} className={styles.cardMeta} />
      </button>
    </div>
  );
}
