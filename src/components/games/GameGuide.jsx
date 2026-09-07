// GameGuide — shows game rules and instructions before play starts.
// Placeholder — receives game-specific content via props in Phase 2.
import styles from './GameGuide.module.css';

export default function GameGuide({ gameName = '', rules = [], onStart }) {
  return (
    <div className={styles.guide} role="region" aria-label={`${gameName} guide`}>
      <h2 className={styles.heading}>How to Play</h2>

      {rules.length > 0 ? (
        <ol className={styles.rules}>
          {rules.map((rule, i) => (
            <li key={i} className={styles.rule}>{rule}</li>
          ))}
        </ol>
      ) : (
        <p className={styles.placeholder}>Game rules will appear here.</p>
      )}

      <button
        type="button"
        className={styles.startBtn}
        onClick={onStart}
        aria-label={`Start playing ${gameName}`}
      >
        Start Game
      </button>
    </div>
  );
}
