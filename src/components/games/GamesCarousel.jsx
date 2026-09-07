// GamesCarousel — seamless infinite horizontal carousel.
// Renders games twice (clone trick) for a gapless loop.
// No arrows. Dot indicators. Touch/drag. Auto-scroll.
import GameCard     from './GameCard';
import CarouselDots from './CarouselDots';
import useCarousel  from '../../hooks/useCarousel';
import gamesData    from '../../data/gamesData';
import styles       from './GamesCarousel.module.css';

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

  // Duplicate the cards so the seamless loop works
  const doubled = [...gamesData, ...gamesData];

  return (
    <section className={styles.wrapper} aria-label="Games carousel">
      {/* ── Scrollable track ── */}
      <div
        ref={trackRef}
        className={styles.track}
        role="list"
        aria-label="Scroll through games"
        onScroll={onScroll}
        onMouseEnter={pause}
        onMouseLeave={resume}
        {...handlers}
      >
        {doubled.map((game, i) => (
          <div
            key={`${game.id}-${i}`}
            className={styles.slide}
            role="listitem"
            aria-hidden={i >= gamesData.length}   /* clones are decorative */
          >
            <GameCard game={game} />
          </div>
        ))}
      </div>

      {/* ── Dot indicators (original set only) ── */}
      <CarouselDots
        total={gamesData.length}
        active={activeIndex}
        onDotClick={scrollToIndex}
      />
    </section>
  );
}
