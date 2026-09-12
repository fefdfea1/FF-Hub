import type { Work } from '@/lib/types';
import styles from '@/styles/ui/surface.module.css';

type Props = {
  work: Work;
  /** 이름 글자 크기(px). 카드 크기에 맞춰 조절한다. */
  nameSize?: number;
  /** 분류·연도 글자 크기(px) */
  subSize?: number;
  className?: string;
};

/** "작품 이름 — 분류 · 연도" 한 줄. 그리드/링/모달이 공유한다. */
export default function WorkMeta({ work, nameSize = 17, subSize = 12, className }: Props) {
  return (
    <div className={[styles.meta, className].filter(Boolean).join(' ')}>
      <span className={styles.metaName} style={{ fontSize: nameSize }}>
        {work.name}
      </span>
      <span className={styles.metaSub} style={{ fontSize: subSize }}>
        {work.category} · {work.year}
      </span>
    </div>
  );
}
