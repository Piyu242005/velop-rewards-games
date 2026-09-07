// ReviveModal — confirmation modal for spending tokens to revive.
// Placeholder — token deduction logic added in Phase 2.
import styles from './ReviveModal.module.css';

export default function ReviveModal({
  reviveCost = 20,
  onConfirm,
  onDismiss,
}) {
  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Revive">
      <div className={styles.panel}>
        <h2 className={styles.heading}>Revive?</h2>
        <p className={styles.body}>
          Spend <strong>{reviveCost} Tokens</strong> to continue from where you left off.
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.confirmBtn}
            onClick={onConfirm}
            aria-label={`Spend ${reviveCost} tokens to revive`}
          >
            Yes, Revive ({reviveCost} Tokens)
          </button>
          <button
            type="button"
            className={styles.dismissBtn}
            onClick={onDismiss}
            aria-label="No thanks, end game"
          >
            No Thanks
          </button>
        </div>
      </div>
    </div>
  );
}
