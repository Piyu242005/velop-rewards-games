// PlayNowButton — infinite shimmer CTA used on every game card
import styles from './PlayNowButton.module.css';

export default function PlayNowButton({ onClick, disabled = false, label = 'Play Now' }) {
  return (
    <button
      type="button"
      className={styles.btn}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      <span className={styles.shimmerLayer} aria-hidden="true" />
      <span className={styles.text}>{label}</span>
    </button>
  );
}
