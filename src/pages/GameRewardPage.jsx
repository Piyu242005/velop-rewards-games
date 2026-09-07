// GameRewardPage — shown after game ends (No Thanks path).
// Displays coins earned, awards them to the shared balance, and
// offers Play Again or Redeem.
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import GameHeader    from '../components/games/GameHeader';
import styles        from './GameRewardPage.module.css';
import { getGameBySlug } from '../data/gamesData';
import useGameCoins  from '../hooks/useGameCoins';
import coinIcon      from '../../assets/icons/game-coin-icon.png';

export default function GameRewardPage() {
  const { slug }           = useParams();
  const navigate           = useNavigate();
  const { earnCoins, coinBalance } = useGameCoins();
  const awardedRef         = useRef(false);

  const game    = getGameBySlug(slug);
  // coins and score are passed via location state from the game
  const params  = new URLSearchParams(window.location.search);
  const coins   = Number(params.get('coins') ?? 0);
  const score   = Number(params.get('score') ?? 0);

  // Award coins once on mount
  useEffect(() => {
    if (!awardedRef.current && coins > 0) {
      earnCoins(coins);
      awardedRef.current = true;
    }
  }, [coins, earnCoins]);

  const gameName = game?.name ?? 'Game';

  return (
    <div className={styles.page}>
      <GameHeader title="Reward" />

      <main className={styles.main} id="main-content">
        <div className={styles.card}>
          {/* ── Celebration header ── */}
          <div className={styles.top}>
            <div className={styles.coinBadge} aria-hidden="true">
              <img src={coinIcon} alt="" width={48} height={48} className={styles.coinIcon} />
            </div>
            <h1 className={styles.heading}>Well Played!</h1>
            <p className={styles.sub}>{gameName}</p>
          </div>

          {/* ── Stats ── */}
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{score.toLocaleString()}</span>
              <span className={styles.statLabel}>Final Score</span>
            </div>
            <div className={styles.divider} aria-hidden="true" />
            <div className={styles.stat}>
              <span className={`${styles.statValue} ${styles.coinValue}`}>+{coins}</span>
              <span className={styles.statLabel}>Game Coins Earned</span>
            </div>
          </div>

          {/* ── New balance ── */}
          <div className={styles.balanceRow}>
            <span className={styles.balanceLabel}>Total Game Coins</span>
            <span className={styles.balanceValue}>{coinBalance.toLocaleString()}</span>
          </div>

          {/* ── Actions ── */}
          <div className={styles.actions}>
            {game?.playable && (
              <button
                type="button"
                className={styles.playAgainBtn}
                onClick={() => navigate(`/games/${slug}/home`)}
                aria-label={`Play ${gameName} again`}
              >
                Play Again
              </button>
            )}
            <Link to="/redeem" className={styles.redeemBtn}>
              Redeem Coins
            </Link>
            <Link to="/games" className={styles.backLink}>
              ← Back to Games
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
