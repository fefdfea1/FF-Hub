'use client';

import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { RING_CLOSE_MS, RING_SETTLE_MS, RING_STEP_MS, stepAngle } from '@/lib/ring/geometry';
import type { Rect } from '@/lib/types';

/** 링이 열릴 때 카드가 출발하는 그리드 카드의 선택자 */
const CARD_SELECTOR = '[data-work-index]';
/** 그리드에 없는 카드가 출발하는 "더보기" 버튼의 선택자 */
const MORE_SELECTOR = '[data-ring-more]';

export type RingState = {
  /** 오버레이가 화면에 올라가 있는지 */
  isOpen: boolean;
  /** true 면 카드가 그리드 좌표에 붙어 있는 상태(여는 중 / 닫는 중) */
  isFlying: boolean;
  /** 자리를 다 잡아 자동 회전 중인지 */
  isSettled: boolean;
  /** 현재 회전각(도) */
  rotation: number;
  /** 다음 자동 회전까지 남은 비율. 1 에서 0 으로 줄어든다. */
  countdown: number;
  rects: Rect[];
  moreRect: Rect | null;
  viewport: { width: number; height: number };
};

export type RingControls = {
  open: () => void;
  close: () => void;
  /** 한 칸 뒤로 */
  prev: () => void;
  /** 한 칸 앞으로 */
  next: () => void;
  /** 카드에 마우스를 올리면 자동 회전을 멈춘다. */
  pause: () => void;
  resume: () => void;
  onWheel: (event: ReactWheelEvent) => void;
  onPointerDown: (event: ReactPointerEvent) => void;
  onPointerMove: (event: ReactPointerEvent) => void;
  onPointerUp: () => void;
  /** 드래그 직후에 발생하는 클릭을 무시하기 위해 쓴다. */
  isDragging: () => boolean;
};

type Args = {
  /** 링에 올라갈 카드 수 */
  count: number;
  /** 상세 모달이 열려 있는 동안에는 자동 회전을 멈춘다. */
  isModalOpen: boolean;
};

function readRect(element: Element): Rect {
  const r = element.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
}

/**
 * 3D 링 캐러셀의 상태와 조작을 담당하는 훅 (기능 전담).
 *
 * 화면에 무엇을 그릴지는 전혀 모르고, 아래 네 가지만 관리한다.
 *  1. 열기/닫기와 그때의 비행(FLIP) 단계
 *  2. 관성이 붙은 회전각 — 목표각을 매 프레임 조금씩 따라간다
 *  3. 5초마다 한 칸씩 넘어가는 자동 회전과 그 카운트다운
 *  4. 휠 · 드래그 · 키보드 입력
 */
export function useRingCarousel({ count, isModalOpen }: Args): [RingState, RingControls] {
  const [isOpen, setIsOpen] = useState(false);
  const [isFlying, setIsFlying] = useState(true);
  const [isSettled, setIsSettled] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [countdown, setCountdown] = useState(1);
  const [rects, setRects] = useState<Rect[]>([]);
  const [moreRect, setMoreRect] = useState<Rect | null>(null);
  const [viewport, setViewport] = useState({ width: 1440, height: 900 });

  /* 매 프레임 바뀌는 값은 리렌더를 일으키지 않도록 ref 에 둔다. */
  const rotationRef = useRef(0);
  const targetRef = useRef(0);
  const rafRef = useRef(0);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepAtRef = useRef(0);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const pointerDownRef = useRef(false);
  const dragXRef = useRef(0);
  const dragStartXRef = useRef(0);
  const modalOpenRef = useRef(isModalOpen);
  const settledRef = useRef(false);
  const openRef = useRef(false);

  modalOpenRef.current = isModalOpen;

  const readViewport = useCallback(
    () => ({ width: window.innerWidth || 1440, height: window.innerHeight || 900 }),
    [],
  );

  /** 목표각을 카드 한 칸 간격에 딱 맞춰 정렬한다. */
  const snap = useCallback(() => {
    const step = stepAngle(count);
    if (!step) return;
    targetRef.current = Math.round(targetRef.current / step) * step;
  }, [count]);

  /** 자동 회전 루프. 목표각을 향해 매 프레임 조금씩 따라간다. */
  const loop = useCallback(
    (time: number) => {
      if (!openRef.current || !settledRef.current) return;

      const active = !pausedRef.current && !draggingRef.current && !modalOpenRef.current;
      if (!active || !stepAtRef.current) {
        stepAtRef.current = time + RING_STEP_MS;
      } else if (time >= stepAtRef.current) {
        targetRef.current -= stepAngle(count);
        stepAtRef.current = time + RING_STEP_MS;
      }

      setCountdown(Math.max(0, Math.min(1, (stepAtRef.current - time) / RING_STEP_MS)));

      const ease = draggingRef.current ? 0.12 : 0.035;
      rotationRef.current += (targetRef.current - rotationRef.current) * ease;

      /* 각도가 무한정 커지지 않도록 한 바퀴씩 접어 둔다. */
      if (rotationRef.current > 720) {
        rotationRef.current -= 360;
        targetRef.current -= 360;
      }
      if (rotationRef.current < -720) {
        rotationRef.current += 360;
        targetRef.current += 360;
      }

      setRotation(rotationRef.current);
      rafRef.current = requestAnimationFrame(loop);
    },
    [count],
  );

  const open = useCallback(() => {
    if (openRef.current) return;

    /* 그리드 카드가 지금 화면 어디에 있는지 재 둔다. 카드는 이 자리에서 출발한다. */
    const measured = Array.from(document.querySelectorAll(CARD_SELECTOR), readRect);
    const more = document.querySelector(MORE_SELECTOR);

    rotationRef.current = 0;
    targetRef.current = 0;
    pausedRef.current = false;
    draggingRef.current = false;
    stepAtRef.current = 0;
    settledRef.current = false;
    openRef.current = true;

    cancelAnimationFrame(rafRef.current);
    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);

    setRects(measured);
    setMoreRect(more ? readRect(more) : null);
    setViewport(readViewport());
    setRotation(0);
    setCountdown(1);
    setIsSettled(false);
    setIsFlying(true);
    setIsOpen(true);
    document.body.dataset.ringOpen = 'true';

    /* 한 프레임 뒤에 목표 위치로 바꿔야 transition 이 실제로 재생된다. */
    requestAnimationFrame(() => requestAnimationFrame(() => setIsFlying(false)));

    settleTimerRef.current = setTimeout(() => {
      /*
       * 안전장치: 브라우저가 프레임을 그리지 않아(백그라운드 탭 등) 위의 rAF 가
       * 실행되지 않았더라도, 여기서 한 번 더 내려 링이 중간 상태로 멈추지 않게 한다.
       */
      setIsFlying(false);
      settledRef.current = true;
      setIsSettled(true);
      rafRef.current = requestAnimationFrame(loop);
    }, RING_SETTLE_MS);
  }, [loop, readViewport]);

  const close = useCallback(() => {
    if (!openRef.current) return;
    cancelAnimationFrame(rafRef.current);
    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);

    settledRef.current = false;
    setIsSettled(false);
    /* 카드를 다시 그리드 좌표로 돌려보낸 뒤 오버레이를 내린다. */
    setIsFlying(true);

    settleTimerRef.current = setTimeout(() => {
      openRef.current = false;
      setIsOpen(false);
      delete document.body.dataset.ringOpen;
    }, RING_CLOSE_MS);
  }, []);

  const nudge = useCallback((delta: number) => {
    targetRef.current += delta;
    stepAtRef.current = performance.now() + RING_STEP_MS;
  }, []);

  /*
   * 링은 시계 반대 방향으로 자동 회전하므로, 각도의 부호와 버튼의 의미가 반대다.
   * "이전"은 각도를 늘려 앞쪽 카드를 되돌려 오고, "다음"은 각도를 줄여 다음 카드를 당겨 온다.
   */
  const prev = useCallback(() => nudge(stepAngle(count)), [count, nudge]);
  const next = useCallback(() => nudge(-stepAngle(count)), [count, nudge]);

  /* 링이 열려 있는 동안의 키보드 조작과 창 크기 변화 */
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (modalOpenRef.current) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') nudge(-30);
      if (event.key === 'ArrowLeft') nudge(30);
    };
    const onResize = () => setViewport(readViewport());

    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [isOpen, close, nudge, readViewport]);

  /* 언마운트 정리 */
  useEffect(
    () => () => {
      cancelAnimationFrame(rafRef.current);
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
      delete document.body.dataset.ringOpen;
    },
    [],
  );

  const controls: RingControls = {
    open,
    close,
    prev,
    next,
    pause: () => {
      pausedRef.current = true;
    },
    resume: () => {
      pausedRef.current = false;
    },
    onWheel: (event) => {
      const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      nudge(Math.max(-20, Math.min(20, delta * 0.125)));
      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
      snapTimerRef.current = setTimeout(snap, 160);
    },
    onPointerDown: (event) => {
      if (event.button !== 0) return;
      pointerDownRef.current = true;
      draggingRef.current = false;
      dragXRef.current = event.clientX;
      dragStartXRef.current = event.clientX;
    },
    onPointerMove: (event) => {
      if (!pointerDownRef.current) return;
      if (!draggingRef.current) {
        /* 6px 이상 움직여야 드래그로 친다. 그 전까지는 클릭으로 본다. */
        if (Math.abs(event.clientX - dragStartXRef.current) < 6) return;
        draggingRef.current = true;
        dragXRef.current = event.clientX;
      }
      targetRef.current += (event.clientX - dragXRef.current) * 0.125;
      dragXRef.current = event.clientX;
      stepAtRef.current = performance.now() + RING_STEP_MS;
    },
    onPointerUp: () => {
      pointerDownRef.current = false;
      if (draggingRef.current) {
        stepAtRef.current = performance.now() + RING_STEP_MS;
        snap();
      }
      /* 같은 틱의 click 이벤트까지는 드래그로 남겨 두고 그 다음에 푼다. */
      setTimeout(() => {
        draggingRef.current = false;
      }, 0);
    },
    isDragging: () => draggingRef.current,
  };

  return [{ isOpen, isFlying, isSettled, rotation, countdown, rects, moreRect, viewport }, controls];
}
