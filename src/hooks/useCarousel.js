import { useRef, useState, useEffect, useCallback } from 'react';

// ============================================================
// useCarousel — state and interaction logic for the Games
//               horizontal carousel.
// ============================================================
// Returns:
//   trackRef       — ref to attach to the scrollable track element
//   activeIndex    — currently "centered" card index (0-based)
//   setActiveIndex — override active index (used by dot clicks)
//   isPaused       — whether auto-scroll is paused (hover/touch)
//   pause          — pause auto-scroll
//   resume         — resume auto-scroll
// ============================================================

const SCROLL_INTERVAL_MS = 3200; // time between auto-steps
const SCROLL_STEP_PX     = 280;  // px per auto-step

export default function useCarousel(totalItems = 0) {
  const trackRef          = useRef(null);
  const autoTimerRef      = useRef(null);
  const isDraggingRef     = useRef(false);
  const dragStartXRef     = useRef(0);
  const dragScrollLeftRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused]       = useState(false);

  // ── Auto-scroll ─────────────────────────────────────────
  const step = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    const next      = track.scrollLeft + SCROLL_STEP_PX;

    if (next >= maxScroll - 2) {
      // Near end — loop back smoothly
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollTo({ left: next, behavior: 'smooth' });
    }
  }, []);

  const startAuto = useCallback(() => {
    autoTimerRef.current = setInterval(step, SCROLL_INTERVAL_MS);
  }, [step]);

  const stopAuto = useCallback(() => {
    clearInterval(autoTimerRef.current);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
    stopAuto();
  }, [stopAuto]);

  const resume = useCallback(() => {
    setIsPaused(false);
    startAuto();
  }, [startAuto]);

  // ── Track scroll → active index sync ────────────────────
  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.firstChild?.offsetWidth ?? SCROLL_STEP_PX;
    const idx = Math.round(track.scrollLeft / cardWidth);
    setActiveIndex(Math.min(idx, totalItems - 1));
  }, [totalItems]);

  // ── Dot-click → scroll to card ──────────────────────────
  const scrollToIndex = useCallback((index) => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.firstChild?.offsetWidth ?? SCROLL_STEP_PX;
    track.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
    setActiveIndex(index);
  }, []);

  // ── Mouse/touch drag ────────────────────────────────────
  const onMouseDown = useCallback((e) => {
    isDraggingRef.current     = true;
    dragStartXRef.current     = e.pageX - trackRef.current.offsetLeft;
    dragScrollLeftRef.current = trackRef.current.scrollLeft;
    pause();
  }, [pause]);

  const onMouseMove = useCallback((e) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const x    = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - dragStartXRef.current) * 1.2;
    trackRef.current.scrollLeft = dragScrollLeftRef.current - walk;
  }, []);

  const onMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    resume();
  }, [resume]);

  // ── Touch ────────────────────────────────────────────────
  const onTouchStart = useCallback((e) => {
    dragStartXRef.current     = e.touches[0].clientX;
    dragScrollLeftRef.current = trackRef.current.scrollLeft;
    pause();
  }, [pause]);

  const onTouchMove = useCallback((e) => {
    const x    = e.touches[0].clientX;
    const walk = (dragStartXRef.current - x) * 1.1;
    trackRef.current.scrollLeft = dragScrollLeftRef.current + walk;
  }, []);

  const onTouchEnd = useCallback(() => {
    resume();
  }, [resume]);

  // ── Mount / unmount ──────────────────────────────────────
  useEffect(() => {
    startAuto();
    return () => stopAuto();
  }, [startAuto, stopAuto]);

  return {
    trackRef,
    activeIndex,
    setActiveIndex,
    scrollToIndex,
    isPaused,
    pause,
    resume,
    onScroll,
    handlers: {
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave: onMouseUp,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
}
