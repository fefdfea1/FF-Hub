'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

import styles from '@/styles/ui/iconButton.module.css';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: 'bordered' | 'filled' | 'plain';
  /** 지름(px) */
  size?: number;
  /** 글리프 크기(px) */
  glyphSize?: number;
  /**
   * true 면 크기를 지정하지 않고 부모가 잡아 준 자리를 그대로 채운다.
   * 카운트다운 원 안쪽처럼 CSS 의 inset 으로 위치를 잡는 곳에서 쓴다.
   * (지정하면 인라인 width/height 가 CSS 를 덮어써 중심이 어긋난다)
   */
  stretch?: boolean;
  children: ReactNode;
};

/**
 * 원형 아이콘 버튼.
 * 모달과 링 오버레이 양쪽에서 이전/다음/닫기 버튼으로 재사용한다.
 */
export default function IconButton({
  tone = 'bordered',
  size = 44,
  glyphSize = 18,
  stretch = false,
  className,
  children,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      className={[styles.button, styles[tone], className].filter(Boolean).join(' ')}
      style={stretch ? { fontSize: glyphSize } : { width: size, height: size, fontSize: glyphSize }}
      {...rest}
    >
      {children}
    </button>
  );
}
