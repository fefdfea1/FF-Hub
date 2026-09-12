import BackdropDecor from '@/components/layout/BackdropDecor';
import SiteFooter from '@/components/layout/SiteFooter';
import SiteHeader from '@/components/layout/SiteHeader';
import AboutContactSection from '@/components/sections/AboutContactSection';
import HeroSection from '@/components/sections/HeroSection';
import ServicesSection from '@/components/sections/ServicesSection';
import WorksSection from '@/components/sections/WorksSection';
import WorksExperienceProvider from '@/components/works/WorksExperienceProvider';
import { works } from '@/lib/data/works';
import styles from '@/styles/layout/page.module.css';

/**
 * 홈 화면 — 서버 컴포넌트.
 *
 * 모든 섹션은 서버에서 HTML 로 완성된다.
 * WorksExperienceProvider 는 유일한 클라이언트 경계로, 섹션들을 children 으로 감싸
 * 상세 모달과 링 캐러셀만 얹는다. 감싸인 섹션들은 클라이언트 컴포넌트가 되지 않는다.
 */
export default function HomePage() {
  return (
    <WorksExperienceProvider works={works}>
      <main className={styles.page}>
        <BackdropDecor />
        <SiteHeader />
        <HeroSection />
        <WorksSection />
        <ServicesSection />
        <AboutContactSection />
        <SiteFooter />
      </main>
    </WorksExperienceProvider>
  );
}
