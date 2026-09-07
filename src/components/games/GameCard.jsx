// GameCard — reusable game card rendered from structured game data.
import { useNavigate } from 'react-router-dom';
import PlayNowButton from './PlayNowButton';
import TokenCost from './TokenCost';
import styles from './GameCard.module.css';

export default function GameCard({ game }) {
  const navigate = useNavigate();
  const actionLabel = game.playable ? 'Play Now' : 'Coming Soon';

  function handlePlay() {
    navigate(`/games/${game.slug}/home`);
  }

  function handleArtworkError(event) {
    const image = event.currentTarget;
    if (!image.src.toLowerCase().endsWith('.avif')) return;
    image.onerror = null;
    image.src = game.image.replace(/\.avif$/i, '.png');
  }

  return (
    <article className={styles.card} aria-label={`${game.name} — ${game.tagline}`}>
      <div className={styles.artwork}>
        <img
          src={game.image}
          alt={`${game.name} game artwork`}
          className={styles.artworkImg}
          loading="lazy"
          decoding="async"
          onError={handleArtworkError}
          draggable={false}
        />
        <div className={styles.artworkOverlay} aria-hidden="true" />
      </div>

      <div className={styles.badge}>{game.category}</div>
      {!game.playable && <div className={styles.comingSoon}>Coming Soon</div>}

      <footer className={styles.footer}>
        <div className={styles.info}>
          <h3 className={styles.name}>{game.name}</h3>
          <p className={styles.tagline}>{game.tagline}</p>
        </div>
        <div className={styles.actions}>
          <TokenCost amount={game.entryCost} />
          <PlayNowButton
            onClick={game.playable ? handlePlay : undefined}
            disabled={!game.playable}
            label={actionLabel}
          />
        </div>
      </footer>
    </article>
  );
}
