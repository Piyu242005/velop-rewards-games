// GameOver — displayed when the player loses.
// Shows score, coins earned so far, and Revive / No Thanks options.
import styles from './GameOver.module.css';

export default function GameOver({
  gameName = '',
  score = 0,
  coinsEarned = 0,
  onRevive,
  onNoThanks,
}) {
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Game Over">
      <div className={styles.panel}>
        <h2 className={styles.heading}>Game Over</h2>
        <p className={styles.sub}>{gameName}</p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{score.toLocaleString()}</span>
            <span className={styles.statLabel}>Score</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{coinsEarned}</span>
            <span className={styles.statLabel}>Coins Earned</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.reviveBtn}
            onClick={onRevive}
            aria-label="Revive and continue playing"
          >
            Revive
          </button>
          <button
            type="button"
            className={styles.noThanksBtn}
            onClick={onNoThanks}
            aria-label="End game and collect reward"
          >
            No Thanks
          </button>
        </div>
      </div>
    </div>
  );
}
