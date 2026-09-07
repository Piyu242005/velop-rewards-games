// GamesCarousel — horizontal auto-scrolling carousel of 13 game cards.
// No left/right arrows. Dot indicators. Touch/swipe + mouse drag.
import { useRef } from 'react';
import GameCard from './GameCard';
import CarouselDots from './CarouselDots';
import useCarousel from '../../hooks/useCarousel';
import gamesData from '../../data/gamesData';
import styles from './GamesCarousel.module.css';

export default function GamesCarousel() {
  const {
    trackRef,
    activeIndex,
    scrollToIndex,
    pause,
    resume,
    onScroll,
    handlers,
  } = useCarousel(gamesData.length);

  return (
    <section className={styles.wrapper} aria-label="Games carousel">
      {/* ── Track ──────────────────────────────────────── */}
      <div
        ref={trackRef}
        className={styles.track}
        role="list"
        onScroll={onScroll}
        onMouseEnter={pause}
        onMouseLeave={resume}
        {...handlers}
      >
        {gamesData.map((game) => (
          <div key={game.id} className={styles.slide} role="listitem">
            <GameCard game={game} />
          </div>
        ))}
      </div>

      {/* ── Dot indicators ─────────────────────────────── */}
      <CarouselDots
        total={gamesData.length}
        active={activeIndex}
        onDotClick={scrollToIndex}
      />
    </section>
  );
}
