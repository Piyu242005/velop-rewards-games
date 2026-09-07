// CarouselDots — dot indicators for the GamesCarousel
import styles from './CarouselDots.module.css';

export default function CarouselDots({ total, active, onDotClick }) {
  return (
    <div
      className={styles.dots}
      role="tablist"
      aria-label="Game carousel navigation"
    >
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === active}
          aria-label={`Go to game ${i + 1}`}
          className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
          onClick={() => onDotClick(i)}
        />
      ))}
    </div>
  );
}
