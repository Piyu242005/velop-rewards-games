import { useRef, useState, useEffect, useCallback } from 'react';

// ============================================================
// useCarousel v2 — seamless infinite auto-scroll via DOM cloning.
// The track renders items twice; when the scroll position reaches
// the midpoint, it silently resets to position 0 so the loop is
// invisible to the user.
//
// Returns:
//   trackRef      — attach to the scrollable <div>
//   activeIndex   — 0-based index within the *original* set
//   scrollToIndex — jump to original-set index via dot click
//   pause / resume — stop/start the timer
//   onScroll      — attach to the track's onScroll event
//   handlers      — spread onto the track for mouse + touch drag
// ============================================================

const STEP_PX        = 260;   // px advanced per auto tick
const TICK_MS        = 2800;  // ms between ticks
const DRAG_FACTOR    = 1.25;

export default function useCarousel(totalItems = 0) {
  const trackRef          = useRef(null);
  const timerRef          = useRef(null);
  const isDraggingRef     = useRef(false);
  const dragStartXRef     = useRef(0);
  const dragScrollLeftRef = useRef(0);
  const pausedRef         = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);

  // ── Seamless reset: once we're past the cloned half, snap back ──
  const checkLoop = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const half = track.scrollWidth / 2;
    if (track.scrollLeft >= half) {
      track.scrollLeft -= half;
    }
    if (track.scrollLeft < 0) {
      track.scrollLeft += half;
    }
  }, []);

  // ── Auto advance ────────────────────────────────────────────
  const advance = useCallback(() => {
    const track = trackRef.current;
    if (!track || pausedRef.current) return;
    track.scrollLeft += STEP_PX;
    checkLoop();
  }, [checkLoop]);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, TICK_MS);
  }, [advance]);

  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current);
  }, []);

  const pause = useCallback(() => {
    pausedRef.current = true;
    stopTimer();
  }, [stopTimer]);

  const resume = useCallback(() => {
    pausedRef.current = false;
    startTimer();
  }, [startTimer]);

  // ── Sync active dot ─────────────────────────────────────────
  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || totalItems === 0) return;
    checkLoop();
    const half       = track.scrollWidth / 2;
    const cardWidth  = half / totalItems;
    const idx        = Math.round((track.scrollLeft % half) / cardWidth);
    setActiveIndex(Math.min(idx, totalItems - 1));
  }, [totalItems, checkLoop]);

  // ── Dot click → scroll ──────────────────────────────────────
  const scrollToIndex = useCallback((index) => {
    const track = trackRef.current;
    if (!track || totalItems === 0) return;
    const half      = track.scrollWidth / 2;
    const cardWidth = half / totalItems;
    // Keep within first copy
    const base = track.scrollLeft < half ? 0 : half;
    track.scrollTo({ left: base + index * cardWidth, behavior: 'smooth' });
    setActiveIndex(index);
  }, [totalItems]);

  // ── Mouse drag ──────────────────────────────────────────────
  const onMouseDown = useCallback((e) => {
    isDraggingRef.current     = true;
    dragStartXRef.current     = e.pageX - trackRef.current.offsetLeft;
    dragScrollLeftRef.current = trackRef.current.scrollLeft;
    pause();
  }, [pause]);

  const onMouseMove = useCallback((e) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - dragStartXRef.current) * DRAG_FACTOR;
    trackRef.current.scrollLeft = dragScrollLeftRef.current - walk;
    checkLoop();
  }, [checkLoop]);

  const onMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    resume();
  }, [resume]);

  // ── Touch ───────────────────────────────────────────────────
  const onTouchStart = useCallback((e) => {
    dragStartXRef.current     = e.touches[0].clientX;
    dragScrollLeftRef.current = trackRef.current.scrollLeft;
    pause();
  }, [pause]);

  const onTouchMove = useCallback((e) => {
    const x    = e.touches[0].clientX;
    const walk = (dragStartXRef.current - x) * DRAG_FACTOR;
    trackRef.current.scrollLeft = dragScrollLeftRef.current + walk;
    checkLoop();
  }, [checkLoop]);

  const onTouchEnd = useCallback(() => {
    resume();
  }, [resume]);

  // ── Lifecycle ────────────────────────────────────────────────
  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [startTimer, stopTimer]);

  return {
    trackRef,
    activeIndex,
    scrollToIndex,
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
