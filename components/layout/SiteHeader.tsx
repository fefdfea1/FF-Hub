import { PillLink } from '@/components/ui/Pill';
import { site } from '@/lib/data/site';
import styles from '@/styles/layout/header.module.css';

/**
 * 상단 내비게이션 — 서버 컴포넌트.
 * 앵커 링크만 쓰므로 클라이언트 자바스크립트가 필요 없다.
 */
export default function SiteHeader() {
  return (
    <nav className={styles.nav}>
      <span className={styles.brand}>{site.name}</span>

      <div className={styles.menu}>
        {site.nav.map((item) => (
          <PillLink key={item.href} href={item.href} variant="ghost" size="sm">
            {item.label}
          </PillLink>
        ))}
      </div>

      <PillLink href={`mailto:${site.email}`} variant="solid" size="md">
        문의 ↗
      </PillLink>
    </nav>
  );
}
