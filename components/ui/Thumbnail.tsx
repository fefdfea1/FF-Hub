import type { CSSProperties, ReactNode } from 'react';

import styles from '@/styles/ui/surface.module.css';

type Props = {
  /** 이미지가 없을 때 보이는 CSS 그라디언트. 이미지가 뜨기 전 바탕으로도 쓰인다. */
  gradient: string;
  /** 썸네일 이미지 경로 (public 기준). 없으면 그라디언트만 보인다. */
  image?: string;
  /** 이미지 대체 텍스트 */
  alt?: string;
  /** 고정 비율. 링 카드처럼 높이를 직접 주는 곳에서는 생략한다. */
  aspectRatio?: string;
  /** 높이를 직접 지정할 때 쓴다. 예) 'calc(100% - 42px)' */
  height?: string;
  /** 목록 맨 앞 카드처럼 먼저 보이는 이미지는 지연 로딩을 끈다. */
  priority?: boolean;
  className?: string;
  children?: ReactNode;
};

/**
 * 작품 썸네일 면.
 * 그리드 카드 · 링 카드 · 상세 화면이 같은 면을 공유하고,
 * 비율만 쓰는 곳이 달라 aspectRatio / height 로 바깥에서 정해 준다.
 */
export default function Thumbnail({
  gradient,
  image,
  alt = '',
  aspectRatio,
  height,
  priority = false,
  className,
  children,
}: Props) {
  const style = {
    '--thumb-gradient': gradient,
    aspectRatio,
    height,
  } as CSSProperties;

  return (
    <div className={[styles.thumb, className].filter(Boolean).join(' ')} style={style}>
      {image ? (
        /* 이미 알맞은 크기로 내보낸 이미지라 그대로 쓴다. 비율은 바깥 면이 정하고 잘라 낸다. */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.thumbImage}
          src={image}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
        />
      ) : null}
      {children}
    </div>
  );
}
