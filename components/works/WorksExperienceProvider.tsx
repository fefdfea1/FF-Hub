'use client';

import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import RingOverlay from '@/components/works/RingOverlay';
import WorkModal from '@/components/works/WorkModal';
import { useRingCarousel, type RingControls, type RingState } from '@/lib/hooks/useRingCarousel';
import type { Work } from '@/lib/types';

/** 모달이 되돌아가 사라지는 데 걸리는 시간(ms). CSS 의 transition 길이(0.32~0.4s)와 맞춘다. */
const MODAL_CLOSE_MS = 400;

type WorksExperienceValue = {
  works: Work[];
  /** 현재 열려 있는 작품의 위치. 닫혀 있으면 null */
  modalIndex: number | null;
  /** 닫히는 중인지 (사라지는 애니메이션 재생 구간) */
  isModalClosing: boolean;
  openWork: (index: number) => void;
  closeModal: () => void;
  /** 이전(-1) / 다음(+1) 작품으로 순환 이동 */
  stepWork: (direction: number) => void;
  ring: RingState;
  ringControls: RingControls;
};

const WorksExperienceContext = createContext<WorksExperienceValue | null>(null);

/**
 * 작품 관련 상호작용(상세 모달 · 링 캐러셀)을 한곳에서 관리하는 클라이언트 경계.
 *
 * children 으로 넘어오는 화면(헤더 · 히어로 · 작품 그리드 · 서비스 …)은
 * 서버 컴포넌트 그대로 렌더되고, 이 컴포넌트는 그 위에 얹히는
 * 오버레이와 상태만 담당한다. 덕분에 페이지 본문은 서버에서 HTML 로 완성되고
 * 클라이언트 자바스크립트는 실제로 움직이는 부분에만 실린다.
 */
export default function WorksExperienceProvider({
  works,
  children,
}: {
  works: Work[];
  children: ReactNode;
}) {
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [ring, ringControls] = useRingCarousel({
    count: works.length,
    isModalOpen: modalIndex !== null,
  });

  /**
   * 모달이 열려 있는지를 이벤트 핸들러에서 바로 읽기 위한 값.
   * 상태를 읽으면 콜백이 매번 새로 만들어지므로 ref 로 따로 둔다.
   */
  const isOpenRef = useRef(false);

  const openWork = useCallback((index: number) => {
    if (index < 0) return;
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    isOpenRef.current = true;
    setIsModalClosing(false);
    setModalIndex(index);
  }, []);

  const closeModal = useCallback(() => {
    if (!isOpenRef.current) return;
    isOpenRef.current = false;

    /* 닫힘 표시를 먼저 켜 화면이 곧바로 되돌아가기 시작하고, 다 사라지면 걷어 낸다. */
    setIsModalClosing(true);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setModalIndex(null);
      setIsModalClosing(false);
    }, MODAL_CLOSE_MS);
  }, []);

  const stepWork = useCallback(
    (direction: number) => {
      const total = works.length;
      if (!total) return;
      setModalIndex((current) => (current === null ? current : (current + direction + total) % total));
    },
    [works.length],
  );

  /* 모달이 열려 있는 동안의 키보드 조작 */
  useEffect(() => {
    if (modalIndex === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal();
      if (event.key === 'ArrowRight') stepWork(1);
      if (event.key === 'ArrowLeft') stepWork(-1);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalIndex, closeModal, stepWork]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    [],
  );

  const value = useMemo<WorksExperienceValue>(
    () => ({
      works,
      modalIndex,
      isModalClosing,
      openWork,
      closeModal,
      stepWork,
      ring,
      ringControls,
    }),
    [works, modalIndex, isModalClosing, openWork, closeModal, stepWork, ring, ringControls],
  );

  return (
    <WorksExperienceContext.Provider value={value}>
      {children}
      <RingOverlay />
      <WorkModal />
    </WorksExperienceContext.Provider>
  );
}

/** 작품 상호작용 상태에 접근한다. Provider 밖에서 부르면 오류를 던진다. */
export function useWorksExperience(): WorksExperienceValue {
  const context = useContext(WorksExperienceContext);
  if (!context) {
    throw new Error('useWorksExperience 는 WorksExperienceProvider 안에서만 사용할 수 있습니다.');
  }
  return context;
}
