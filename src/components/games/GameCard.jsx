// GameCard — single game card rendered inside the carousel.
// Artwork is kept strictly behind the overlay; all interactive
// UI (button, token cost) lives in the card footer.
import { useNavigate } from 'react-router-dom';
import PlayNowButton from './PlayNowButton';
import TokenCost from './TokenCost';
import styles from './GameCard.module.css';

export default function GameCard({ game }) {
  const navigate = useNavigate();

  function handlePlay() {
    if (game.playable) {
      navigate(game.route);
    } else {
      navigate(`/games/${game.id}/home`);
    }
  }

  return (
    <article
      className={styles.card}
      aria-label={`${game.name} — ${game.tagline}`}
    >
      {/* ── Artwork layer ───────────────────────── */}
      <div className={styles.artwork} aria-hidden="true">
        <img
          src={game.image}
          alt={`${game.name} game artwork`}
          className={styles.artworkImg}
          loading="lazy"
          draggable={false}
        />
        <div className={styles.artworkOverlay} />
      </div>

      {/* ── Category badge ──────────────────────── */}
      <div className={styles.badge}>{game.category}</div>

      {/* ── Card footer (interactive UI) ────────── */}
      <footer className={styles.footer}>
        <div className={styles.info}>
          <h3 className={styles.name}>{game.name}</h3>
          <p className={styles.tagline}>{game.tagline}</p>
        </div>
        <div className={styles.actions}>
          <TokenCost amount={game.entryCost} />
          <PlayNowButton onClick={handlePlay} />
        </div>
        {!game.playable && (
          <div className={styles.comingSoon} aria-label="Coming soon">
            Coming Soon
          </div>
        )}
      </footer>
    </article>
  );
}
