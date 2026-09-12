import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

import styles from '@/styles/ui/pill.module.css';

export type PillVariant = 'solid' | 'outline' | 'glass' | 'ghost';
export type PillSize = 'sm' | 'md' | 'lg';

type PillStyleProps = {
  variant?: PillVariant;
  size?: PillSize;
  /** CTA 발광 애니메이션 적용 여부 */
  glow?: boolean;
  className?: string;
};

/**
 * 알약 모양 표면의 클래스 이름을 만든다.
 * 링크·버튼·태그가 같은 시각 언어를 공유하도록 이 함수 하나만 쓴다.
 */
export function pillClassName({
  variant = 'glass',
  size = 'sm',
  glow = false,
  className,
}: PillStyleProps = {}): string {
  return [styles.pill, styles[variant], styles[size], glow ? styles.glow : '', className]
    .filter(Boolean)
    .join(' ');
}

/** 앵커/외부 링크용 알약. 서버 컴포넌트로 그대로 렌더된다. */
export function PillLink({
  variant,
  size,
  glow,
  className,
  children,
  ...rest
}: PillStyleProps & AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) {
  return (
    <a className={pillClassName({ variant, size, glow, className })} {...rest}>
      {children}
    </a>
  );
}

/**
 * 동작 없는 표시용 알약(배지 등).
 * 클릭이 필요한 버튼은 클라이언트 컴포넌트에서 pillClassName() 을 직접 사용한다.
 */
export function PillTag({
  variant,
  size,
  className,
  children,
  ...rest
}: PillStyleProps & { children: ReactNode } & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={pillClassName({ variant, size, className })}
      style={{ cursor: 'default', ...rest.style }}
      {...rest}
    >
      {children}
    </span>
  );
}
