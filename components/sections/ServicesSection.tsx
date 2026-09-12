import ServiceAccordionItem from '@/components/sections/ServiceAccordionItem';
import SectionHeading from '@/components/ui/SectionHeading';
import { services } from '@/lib/data/services';
import { anchors, site } from '@/lib/data/site';
import styles from '@/styles/sections/services.module.css';

/**
 * 서비스 섹션 — 서버 컴포넌트.
 *
 * 각 줄의 설명 문구는 서버에서 그대로 HTML 이 되고,
 * 펼침 동작만 ServiceAccordionItem(클라이언트) 이 children 으로 감싸 담당한다.
 */
export default function ServicesSection() {
  return (
    <section id={anchors.services} className={styles.section}>
      <SectionHeading label="Services" title="하는 일" lead={site.servicesLead} />

      <div className={styles.list}>
        {services.map((service, index) => (
          <ServiceAccordionItem
            key={service.id}
            number={String(index + 1).padStart(2, '0')}
            title={service.title}
            defaultOpen={index === 0}
          >
            <p className={styles.description}>{service.description}</p>
          </ServiceAccordionItem>
        ))}
      </div>
    </section>
  );
}
