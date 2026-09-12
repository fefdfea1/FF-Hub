'use client';

import { pillClassName } from '@/components/ui/Pill';
import { useWorksExperience } from '@/components/works/WorksExperienceProvider';
import styles from '@/styles/works/grid.module.css';

/**
 * "더보기" 버튼 — 클라이언트 컴포넌트.
 *
 * 링 캐러셀을 여는 동작만 담당한다.
 * data-ring-more 는 링이 열릴 때 그리드에 없는 카드들이 출발할 좌표를 재는 표식이다.
 */
export default function RingOpenButton({
  totalLabel,
}: {
  /** "12" 처럼 2자리로 맞춘 전체 개수 */
  totalLabel: string;
}) {
  const { ringControls } = useWorksExperience();

  return (
    <button
      type="button"
      data-ring-more="1"
      className={pillClassName({ variant: 'glass', className: styles.moreButton })}
      onClick={ringControls.open}
    >
      더보기 · 전체 {totalLabel}개 →
    </button>
  );
}
