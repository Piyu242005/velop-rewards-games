// GameGuidePage — guide shown before gameplay; returning players can skip it.
import { useParams, useNavigate, Link } from 'react-router-dom';
import GameHeader from '../components/games/GameHeader';
import styles from './GameGuidePage.module.css';
import { getGameBySlug } from '../data/gamesData';
import usePageTitle from '../hooks/usePageTitle';

const GUIDE_SEEN_PREFIX = 'vg_guide_seen_';

export default function GameGuidePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const game = getGameBySlug(slug);
  usePageTitle(game ? `${game.name} — Guide` : 'Guide');

  if (!game) {
    return (
      <div className={styles.page}>
        <GameHeader title="Guide" />
        <main className={styles.main}>
          <p className={styles.notFound}>Game not found. <Link to="/games">Back to Games</Link></p>
        </main>
      </div>
    );
  }

  let hasSeen = false;
  try { hasSeen = localStorage.getItem(`${GUIDE_SEEN_PREFIX}${game.slug}`) === '1'; } catch { /* ignore storage failures */ }

  function handleStart() {
    try { localStorage.setItem(`${GUIDE_SEEN_PREFIX}${game.slug}`, '1'); } catch { /* continue without persistence */ }
    navigate(`/games/${game.slug}/play`);
  }

  function handleSkip() {
    navigate(`/games/${game.slug}/play`);
  }

  function handleArtworkError(event) {
    const image = event.currentTarget;
    if (!image.src.toLowerCase().endsWith('.avif')) return;
    image.onerror = null;
    image.src = game.image.replace(/\.avif$/i, '.png');
  }

  return (
    <div className={styles.page}>
      <GameHeader title={`${game.name} — Guide`} />
      <main className={styles.main} id="main-content">
        <div className={styles.card}>
          <div className={styles.artworkStrip}>
            <img
              src={game.image}
              alt=""
              className={styles.artworkImg}
              aria-hidden="true"
              decoding="async"
              onError={handleArtworkError}
            />
            <div className={styles.artworkFade} />
          </div>
          <div className={styles.body}>
            <div className={styles.header}>
              <span className={styles.category}>{game.category}</span>
              <h1 className={styles.title}>{hasSeen ? 'How to Play' : 'How to Play · First Time'}</h1>
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
              <button type="button" className={styles.startBtn} onClick={handleStart}>
                {hasSeen ? 'Start Game' : 'Got It — Start Game'}
              </button>
              {hasSeen && <button type="button" className={styles.backLink} onClick={handleSkip}>Skip Guide</button>}
              <Link to={`/games/${game.slug}/home`} className={styles.backLink}>← Back to Game Home</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
