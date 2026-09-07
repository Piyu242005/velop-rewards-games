// GameGuidePage — full guide screen after token deduction.
import { useParams, useNavigate, Link } from 'react-router-dom';
import GameHeader    from '../components/games/GameHeader';
import styles        from './GameGuidePage.module.css';
import { getGameBySlug } from '../data/gamesData';
import usePageTitle      from '../hooks/usePageTitle';

export default function GameGuidePage() {
  const { slug }  = useParams();
  const navigate  = useNavigate();
  const game      = getGameBySlug(slug);
  usePageTitle(game ? `${game.name} — Guide` : 'Guide');

  if (!game) {
    return (
      <div className={styles.page}>
        <GameHeader title="Guide" />
        <main className={styles.main}>
          <p className={styles.notFound}>
            Game not found. <Link to="/games">Back to Games</Link>
          </p>
        </main>
      </div>
    );
  }

  function handleStart() {
    navigate(`/games/${game.slug}/play`);
  }

  return (
    <div className={styles.page}>
      <GameHeader title={`${game.name} — Guide`} />

      <main className={styles.main} id="main-content">
        <div className={styles.card}>
          {/* Artwork strip */}
          <div className={styles.artworkStrip}>
            <img src={game.image} alt="" className={styles.artworkImg} aria-hidden="true" />
            <div className={styles.artworkFade} />
          </div>

          <div className={styles.body}>
            <div className={styles.header}>
              <span className={styles.category}>{game.category}</span>
              <h1 className={styles.title}>How to Play</h1>
              <p className={styles.subtitle}>{game.name}</p>
            </div>

            <ol className={styles.rules}>
              {game.guide.map((rule, i) => (
                <li key={i} className={styles.rule}>
                  <span className={styles.ruleNum}>{i + 1}</span>
                  <span className={styles.ruleText}>{rule}</span>
                </li>
              ))}
            </ol>

            <div className={styles.footer}>
              <button
                type="button"
                className={styles.startBtn}
                onClick={handleStart}
                aria-label={`Start playing ${game.name}`}
              >
                Start Game
              </button>
              <Link to="/games" className={styles.backLink}>← Back to Games</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
