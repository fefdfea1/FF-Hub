'use client';

import type { ReactNode } from 'react';

import { pillClassName, type PillSize, type PillVariant } from '@/components/ui/Pill';

type Props = {
  /** 이동할 섹션의 id (# 없이) */
  targetId: string;
  /** 상단 고정 요소를 피하기 위한 여유 간격(px) */
  offset?: number;
  variant?: PillVariant;
  size?: PillSize;
  glow?: boolean;
  children: ReactNode;
};

/**
 * 특정 섹션으로 부드럽게 스크롤하는 버튼 — 클라이언트 컴포넌트.
 * 모양은 Pill 의 클래스를 그대로 빌려 쓰고, 이 컴포넌트는 동작만 책임진다.
 */
export default function ScrollToButton({
  targetId,
  offset = 40,
  variant = 'solid',
  size = 'lg',
  glow = false,
  children,
}: Props) {
  const handleClick = () => {
    const target = document.getElementById(targetId);
    if (!target) return;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth',
    });
  };

  return (
    <button type="button" className={pillClassName({ variant, size, glow })} onClick={handleClick}>
      {children}
    </button>
  );
}
