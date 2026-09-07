// GameRewardPage — shown after game ends.
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import GameHeader from '../components/games/GameHeader';
import styles from './GameRewardPage.module.css';
import { getGameBySlug } from '../data/gamesData';
import useGameCoins from '../hooks/useGameCoins';
import usePageTitle from '../hooks/usePageTitle';
import coinIcon from '../../assets/icons/game-coin-icon.png';

const CLAIM_KEY = 'vg_reward_claimed_';

export default function GameRewardPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { earnCoins, coinBalance } = useGameCoins();
  const awardedRef = useRef(false);
  const game = getGameBySlug(slug);
  usePageTitle('Reward');

  const params = new URLSearchParams(window.location.search);
  const coins = Math.max(0, Number(params.get('coins') ?? 0));
  const score = Math.max(0, Number(params.get('score') ?? 0));
  const claimId = `${slug}:${score}:${coins}`;
  const claimStorageKey = `${CLAIM_KEY}${claimId}`;

  useEffect(() => {
    if (awardedRef.current || coins <= 0) return;
    try {
      if (sessionStorage.getItem(claimStorageKey) === '1') {
        awardedRef.current = true;
        return;
      }
      sessionStorage.setItem(claimStorageKey, '1');
    } catch {
      // Continue for browsers that block sessionStorage; backend must validate in production.
    }
    earnCoins(coins);
    awardedRef.current = true;
  }, [claimStorageKey, coins, earnCoins]);

  const gameName = game?.name ?? 'Game';

  return (
    <div className={styles.page}>
      <GameHeader title="Reward" />
      <main className={styles.main} id="main-content">
        <div className={styles.card}>
          <div className={styles.top}>
            <div className={styles.coinBadge} aria-hidden="true">
              <img src={coinIcon} alt="" width={48} height={48} className={styles.coinIcon} />
            </div>
            <h1 className={styles.heading}>Well Played!</h1>
            <p className={styles.sub}>{gameName}</p>
          </div>

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

          <div className={styles.balanceRow}>
            <span className={styles.balanceLabel}>Total Game Coins</span>
            <span className={styles.balanceValue}>{coinBalance.toLocaleString()}</span>
          </div>

          <div className={styles.actions}>
            {game?.playable && (
              <button type="button" className={styles.playAgainBtn} onClick={() => navigate(`/games/${slug}/home`)} aria-label={`Play ${gameName} again`}>
                Play Again
              </button>
            )}
            <Link to="/redeem" className={styles.redeemBtn}>Redeem Coins</Link>
            <Link to="/games" className={styles.backLink}>← Back to Games</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
