import styles from '@/styles/ui/sectionHeading.module.css';

type Props = {
  /** 작은 영문 라벨. 예) Works · 12 */
  label: string;
  /** 라벨 앞에 흰 점을 찍을지 여부 */
  withDot?: boolean;
  /** 큰 한글 제목 */
  title: string;
  /** 제목 아래 보조 설명 */
  lead?: string;
};

/** 섹션 머리말. Works · Services 섹션이 같은 컴포넌트를 쓴다. */
export default function SectionHeading({ label, withDot = false, title, lead }: Props) {
  return (
    <div>
      <div className={styles.label}>
        {withDot ? <span className={styles.dot} aria-hidden /> : null}
        {label}
      </div>
      <h2 className={styles.title}>{title}</h2>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
    </div>
  );
}
