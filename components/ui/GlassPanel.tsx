import type { HTMLAttributes, ReactNode } from 'react';

import styles from '@/styles/ui/surface.module.css';

type Props = HTMLAttributes<HTMLDivElement> & {
  /** soft: 은은한 단색 / raised: 위가 밝은 그라디언트 */
  tone?: 'soft' | 'raised';
  /** 기본 여백(34px) 적용 여부 */
  padded?: boolean;
  children: ReactNode;
};

/** 반투명 유리 패널. About·Contact 카드처럼 내용만 다른 곳에서 재사용한다. */
export default function GlassPanel({
  tone = 'soft',
  padded = true,
  className,
  children,
  ...rest
}: Props) {
  const classes = [
    styles.panel,
    tone === 'raised' ? styles.panelRaised : styles.panelSoft,
    padded ? styles.pad : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
