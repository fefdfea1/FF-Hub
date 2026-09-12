'use client';

import { useEffect, useRef, useState } from 'react';

import IconButton from '@/components/ui/IconButton';
import { PillLink } from '@/components/ui/Pill';
import Thumbnail from '@/components/ui/Thumbnail';
import { useWorksExperience } from '@/components/works/WorksExperienceProvider';
import type { Work } from '@/lib/types';
import styles from '@/styles/works/modal.module.css';

/** 이전/다음으로 넘어갈 때 한쪽으로 사라지고 나타나는 데 걸리는 시간(ms). CSS 와 맞춘다. */
const FADE_MS = 240;

/**
 * 작품 상세 모달 — 클라이언트 컴포넌트.
 *
 * 그리드 카드와 링 카드 양쪽에서 같은 모달을 연다.
 * 열려 있는 작품은 Provider 가 목록상의 위치로만 들고 있어서,
 * 이전/다음 이동은 위치를 순환시키는 것으로 끝난다.
 */
export default function WorkModal() {
  const { works, modalIndex } = useWorksExperience();

  if (modalIndex === null) return null;
  const work = works[modalIndex];
  if (!work) return null;

  /*
   * 내용은 아래 ModalView 가 그린다.
   * 작품이 바뀔 때 전환 효과를 주려면 상태가 필요한데,
   * 모달이 닫혀 있는 동안에는 이 컴포넌트가 아무것도 그리지 않기 때문에
   * 상태를 쥐는 쪽을 따로 두어 조건부 렌더와 훅이 엉키지 않게 한다.
   */
  return <ModalView work={work} />;
}

/** 실제 모달 내용. 작품이 바뀌면 사라졌다 나타나는 전환을 담당한다. */
function ModalView({ work }: { work: Work }) {
  const { isModalClosing, closeModal, stepWork } = useWorksExperience();

  /** 지금 화면에 그려져 있는 작품. 전환 중에는 이전 작품을 잠시 붙들고 있는다. */
  const [shown, setShown] = useState(work);
  /**
   * 떠오른 상태인지. 처음 한 프레임은 꺼진 상태로 그려야 transition 이 재생된다.
   * 이 값이 false 가 되면 지금 위치에서 그대로 되돌아간다.
   */
  const [isOpen, setIsOpen] = useState(false);
  /** true 인 동안 내용이 투명해진다. */
  const [isFading, setIsFading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* 붙자마자 한 프레임 뒤에 열린 상태로 바꿔 떠오르는 연출을 재생한다. */
  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsOpen(true));
    /* 화면을 그리지 않는 상황(백그라운드 탭 등)에서도 반드시 열리도록 하는 보조 장치. */
    const fallback = setTimeout(() => setIsOpen(true), 60);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (work.id === shown.id) return;

    /*
     * 움직임을 줄이도록 설정한 사용자에게는 전환 자체를 건너뛴다.
     * 이때는 CSS 전환도 멈춰 있어, 기다리기만 하면 빈 화면이 잠깐 보일 뿐이다.
     */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(work);
      setIsFading(false);
      return;
    }

    /* 먼저 사라지게 하고, 다 사라진 다음에 내용을 바꿔 다시 나타나게 한다. */
    setIsFading(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShown(work);
      setIsFading(false);
    }, FADE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [work, shown.id]);

  const fadeClass = `${styles.fade} ${isFading ? styles.fadeOut : ''}`;

  return (
    <div
      className={`${styles.backdrop} ${isOpen && !isModalClosing ? styles.open : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${shown.name} 상세`}
      onClick={closeModal}
    >
      {/* 내용 영역의 클릭은 닫기로 번지지 않게 막는다. */}
      <div className={styles.dialog} onClick={(event) => event.stopPropagation()}>
        <Thumbnail
          gradient={shown.gradient}
          image={shown.image}
          alt={`${shown.name} 메인 화면`}
          priority
          className={`${styles.preview} ${fadeClass}`}
        />

        <div className={styles.footer}>
          {/* 글자도 이미지와 함께 전환된다. */}
          <div className={fadeClass}>
            <div className={styles.eyebrow}>
              {shown.label} · {shown.category} · {shown.year}
            </div>
            <div className={styles.title}>{shown.name}</div>
          </div>

          {/* 버튼은 제자리에 남아 연속으로 누를 수 있게 한다. */}
          <div className={styles.actions}>
            <IconButton onClick={() => stepWork(-1)} aria-label="이전 작품">
              ←
            </IconButton>
            <IconButton onClick={() => stepWork(1)} aria-label="다음 작품">
              →
            </IconButton>

            {/* 목록에 href 를 적어 둔 작품만 실제 링크로 동작한다. */}
            <PillLink
              href={shown.href ?? '#'}
              variant="solid"
              className={`${styles.visit} ${shown.href ? '' : styles.visitDisabled}`}
              target={shown.href ? '_blank' : undefined}
              rel={shown.href ? 'noreferrer' : undefined}
              aria-disabled={shown.href ? undefined : true}
              tabIndex={shown.href ? undefined : -1}
            >
              사이트 방문 ↗
            </PillLink>

            <IconButton tone="plain" glyphSize={20} onClick={closeModal} aria-label="닫기">
              ×
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}
