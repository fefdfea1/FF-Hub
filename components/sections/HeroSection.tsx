import { PillLink, PillTag } from '@/components/ui/Pill';
import ScrollToButton from '@/components/ui/ScrollToButton';
import { anchors, site } from '@/lib/data/site';
import styles from '@/styles/sections/hero.module.css';

/**
 * 히어로 섹션 — 서버 컴포넌트.
 * 문구는 전부 정적이고, 스크롤 이동 버튼 하나만 클라이언트 컴포넌트로 끼워 넣는다.
 */
export default function HeroSection() {
  return (
    <section className={styles.section}>
      <PillTag variant="glass" className={styles.badge}>
        <span className={styles.badgeMark}>{site.hero.badge}</span>
        {site.hero.badgeText}
      </PillTag>

      <h1 className={styles.headline}>
        {site.hero.headline.map((line, i) => (
          <span key={line}>
            {line}
            {i < site.hero.headline.length - 1 ? <br /> : null}
          </span>
        ))}
      </h1>

      <p className={styles.lead}>{site.hero.lead}</p>

      <div className={styles.actions}>
        <ScrollToButton targetId={anchors.works} variant="solid" size="lg" glow>
          작품 보기 →
        </ScrollToButton>
        <PillLink href={`#${anchors.about}`} variant="outline" size="lg">
          소개 보기
        </PillLink>
      </div>
    </section>
  );
}
