import SectionHeading from '@/components/ui/SectionHeading';
import RingOpenButton from '@/components/works/RingOpenButton';
import WorkGridCard from '@/components/works/WorkGridCard';
import WorkGridInteraction from '@/components/works/WorkGridInteraction';
import { getGridWorks, totalWorks, totalWorksLabel } from '@/lib/data/works';
import { anchors, site } from '@/lib/data/site';
import styles from '@/styles/works/grid.module.css';

/**
 * 작품 섹션 — 서버 컴포넌트.
 *
 * 카드 목록은 서버에서 HTML 로 완성해 두고,
 * 클릭·기울임 같은 동작만 WorkGridInteraction(클라이언트) 이 children 으로 감싸 얹는다.
 * 그리드에 몇 개를 노출할지는 site.worksGridLimit 하나로 정해진다.
 */
export default function WorksSection() {
  const gridWorks = getGridWorks(site.worksGridLimit);
  /*
   * 그리드에 다 담기지 않은 작품이 있을 때만 "더보기"(링 캐러셀)를 띄운다.
   * 기준 개수는 site.worksGridLimit(기본 9) 이라, 작품이 9개 이하면 버튼이 나오지 않는다.
   */
  const hasMore = totalWorks > gridWorks.length;

  return (
    <section id={anchors.works} className={styles.section}>
      <div className={styles.head}>
        <SectionHeading label={`Works · ${totalWorksLabel}`} withDot title="제작 사이트" />
      </div>

      <WorkGridInteraction>
        <div className={styles.grid}>
          {gridWorks.map((work) => (
            <WorkGridCard key={work.id} work={work} />
          ))}
        </div>

        {hasMore ? (
          <div className={styles.more}>
            <RingOpenButton totalLabel={totalWorksLabel} />
          </div>
        ) : null}
      </WorkGridInteraction>
    </section>
  );
}
