import { site } from '@/lib/data/site';
import styles from '@/styles/layout/footer.module.css';

/** 푸터 — 서버 컴포넌트. 고정 문구만 출력한다. */
export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <span>©{site.name}</span>
      <span>{site.email}</span>
      <span>{site.year} 제작</span>
    </footer>
  );
}
