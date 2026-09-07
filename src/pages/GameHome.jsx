// GameHome — individual game landing page.
// Shows game artwork, name, entry cost, and Pay to Play CTA.
// Full token deduction flow added in Phase 2.
import { useParams, useNavigate, Link } from 'react-router-dom';
import GameHeader from '../components/games/GameHeader';
import TokenCost from '../components/games/TokenCost';
import PlayNowButton from '../components/games/PlayNowButton';
import styles from './GameHome.module.css';
import gamesData from '../data/gamesData';

export default function GameHome() {
  const { id } = useParams();
  const navigate = useNavigate();

  const game = gamesData.find((g) => g.id === Number(id));

  if (!game) {
    return (
      <div className={styles.page}>
        <GameHeader title="Game Not Found" />
        <main className={styles.main}>
          <p className={styles.notFound}>
            Game not found.{' '}
            <Link to="/games" className={styles.backLink}>Back to Games</Link>
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <GameHeader title={game.name} />

      <main className={styles.main} id="main-content">
        <div className={styles.hero}>
          <img
            src={game.image}
            alt={`${game.name} artwork`}
            className={styles.artwork}
          />
          <div className={styles.overlay} />
        </div>

        <div className={styles.content}>
          <div className={styles.info}>
            <span className={styles.category}>{game.category}</span>
            <h1 className={styles.name}>{game.name}</h1>
            <p className={styles.tagline}>{game.tagline}</p>
          </div>

          <div className={styles.cta}>
            <TokenCost amount={game.entryCost} />
            {game.playable ? (
              <PlayNowButton onClick={() => navigate(`${game.route}/guide`)} />
            ) : (
              <button type="button" className={styles.comingSoonBtn} disabled>
                Coming Soon
              </button>
            )}
          </div>

          <Link to="/games" className={styles.back}>← Back to Games</Link>
        </div>
      </main>
    </div>
  );
}
