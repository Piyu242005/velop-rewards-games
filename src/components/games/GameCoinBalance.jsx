// GameCoinBalance — persistent coin balance badge shown in the header.
// Reads from the shared GameCoinContext so it updates across all games.
import useGameCoins from '../../hooks/useGameCoins';
import styles from './GameCoinBalance.module.css';
import coinIcon from '../../../assets/icons/game-coin-icon.png';

export default function GameCoinBalance() {
  const { coinBalance } = useGameCoins();

  return (
    <div
      className={styles.badge}
      aria-label={`Game Coins balance: ${coinBalance}`}
      title="Game Coins"
    >
      <img
        src={coinIcon}
        alt=""
        className={styles.icon}
        aria-hidden="true"
        width={20}
        height={20}
      />
      <span className={styles.balance}>{coinBalance.toLocaleString()}</span>
      <span className={styles.label}>GC</span>
    </div>
  );
}
