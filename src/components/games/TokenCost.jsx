// TokenCost — displays "20 Tokens" with the token icon
import styles from './TokenCost.module.css';
import tokenIcon from '../../../assets/icons/token-icon.png';

export default function TokenCost({ amount = 20 }) {
  return (
    <span className={styles.tokenCost} aria-label={`Entry cost: ${amount} Tokens`}>
      <img
        src={tokenIcon}
        alt=""
        className={styles.icon}
        aria-hidden="true"
        width={16}
        height={16}
      />
      <span className={styles.amount}>{amount}</span>
      <span className={styles.label}>Tokens</span>
    </span>
  );
}
