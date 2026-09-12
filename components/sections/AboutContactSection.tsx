import GlassPanel from '@/components/ui/GlassPanel';
import { anchors, site } from '@/lib/data/site';
import styles from '@/styles/sections/aboutContact.module.css';

/**
 * About · Contact 섹션 — 서버 컴포넌트.
 * 두 카드 모두 GlassPanel 을 재사용하고 내용만 다르다.
 */
export default function AboutContactSection() {
  return (
    <section className={styles.section}>
      <GlassPanel id={anchors.about} tone="soft">
        <div className={styles.eyebrow}>About</div>
        <p className={styles.aboutText}>{site.about}</p>
      </GlassPanel>

      <GlassPanel id={anchors.contact} tone="raised" className={styles.contact}>
        <div className={styles.eyebrow}>Contact</div>
        <div className={styles.contactBody}>
          <a className={styles.email} href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
      </GlassPanel>
    </section>
  );
}
