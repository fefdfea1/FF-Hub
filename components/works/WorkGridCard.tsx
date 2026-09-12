import Thumbnail from '@/components/ui/Thumbnail';
import WorkMeta from '@/components/ui/WorkMeta';
import type { Work } from '@/lib/types';
import styles from '@/styles/works/grid.module.css';

/**
 * 작품 그리드 카드 — 서버 컴포넌트.
 *
 * 클릭과 기울임 효과는 상위의 WorkGridInteraction 이 이벤트 위임으로 처리한다.
 * 그래서 이 카드에는 이벤트 핸들러가 하나도 없고, 순수한 HTML 로 서버에서 완성된다.
 * 상위가 카드를 찾아낼 수 있도록 data-work-index 만 남겨 둔다.
 */
export default function WorkGridCard({ work }: { work: Work }) {
  return (
    <button
      type="button"
      className={styles.card}
      data-work-index={work.index}
      aria-label={`${work.name} 상세 보기`}
    >
      <Thumbnail
        gradient={work.gradient}
        image={work.image}
        alt={`${work.name} 메인 화면`}
        aspectRatio="16 / 10"
        /* 첫 줄 카드들은 바로 보이므로 지연 로딩을 끈다. */
        priority={work.index < 3}
      />
      <WorkMeta work={work} className={styles.cardMeta} />
    </button>
  );
}
