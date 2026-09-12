'use client';

import type { ReactNode } from 'react';
import { useId, useState } from 'react';

import styles from '@/styles/sections/services.module.css';

type Props = {
  /** "01" 형태의 번호 */
  number: string;
  title: string;
  /** 처음부터 펼쳐 둘지 여부 */
  defaultOpen?: boolean;
  /** 펼쳤을 때 보여 줄 내용. 서버에서 완성된 마크업을 그대로 받는다. */
  children: ReactNode;
};

/**
 * 서비스 아코디언의 한 줄 — 클라이언트 컴포넌트.
 *
 * 열림/닫힘 상태를 항목마다 각자 들고 있어 서로 간섭하지 않는다.
 * 본문은 children 으로 받기 때문에 설명 문구는 서버 컴포넌트로 남고,
 * 이 컴포넌트에는 토글 동작만 실린다.
 */
export default function ServiceAccordionItem({
  number,
  title,
  defaultOpen = false,
  children,
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className={styles.item}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className={styles.label}>
          <span className={styles.number}>{number}</span>
          {title}
        </span>
        <span className={`${styles.marker} ${isOpen ? styles.markerOpen : ''}`} aria-hidden>
          +
        </span>
      </button>

      <div
        id={panelId}
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
        role="region"
        aria-hidden={!isOpen}
      >
        <div className={styles.panelInner}>{children}</div>
      </div>
    </div>
  );
}
