import styles from '@/styles/layout/backdrop.module.css';

/**
 * 배경 장식 레이어 — 서버 컴포넌트.
 * 격자, 상단 광원, 떠다니는 별 오브제로 이루어진 순수 장식이라 상태가 없다.
 */
export default function BackdropDecor() {
  return (
    <div className={styles.root} aria-hidden>
      <div className={styles.grid} />
      <div className={styles.glow} />
      <div className={`${styles.star} ${styles.starLarge}`} />
      <div className={`${styles.star} ${styles.starSmall}`} />
    </div>
  );
}
