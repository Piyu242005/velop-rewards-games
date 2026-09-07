// PlayNowButton — shared CTA with subtle infinite shimmer.
import styles from './PlayNowButton.module.css';

export default function PlayNowButton({ onClick, disabled = false, label = 'Play Now' }) {
  return (
    <button
      type="button"
      className={styles.btn}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-disabled={disabled}
    >
      <span className={styles.shimmerLayer} aria-hidden="true" />
      <span className={styles.text}>{label}</span>
    </button>
  );
}
