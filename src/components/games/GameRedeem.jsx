// GameRedeem component — shows redemption options for Game Coins.
// Full implementation in Phase 3. Renders option tiles for each reward type.
import styles from './GameRedeem.module.css';
import useGameCoins from '../../hooks/useGameCoins';
import redeemVeIcon from '../../../assets/icons/redeem-ve-icon.png';
import redeemSveIcon from '../../../assets/icons/redeem-sve-icon.png';
import redeemGemsIcon from '../../../assets/icons/redeem-gems-icon.png';
import redeemTokensIcon from '../../../assets/icons/redeem-tokens-icon.png';
import redeemSpinsIcon from '../../../assets/icons/redeem-spins-icon.png';

const REDEEM_OPTIONS = [
  { id: 've',     label: 'VE',     icon: redeemVeIcon },
  { id: 'sve',    label: 'SVE',    icon: redeemSveIcon },
  { id: 'gems',   label: 'Gems',   icon: redeemGemsIcon },
  { id: 'tokens', label: 'Tokens', icon: redeemTokensIcon },
  { id: 'spins',  label: 'Spins',  icon: redeemSpinsIcon },
];

export default function GameRedeem() {
  const { coinBalance } = useGameCoins();

  return (
    <section className={styles.redeem} aria-label="Game Coin redemption">
      <div className={styles.balance}>
        <span className={styles.balanceLabel}>Available Game Coins</span>
        <span className={styles.balanceValue}>{coinBalance.toLocaleString()}</span>
      </div>

      <div className={styles.grid}>
        {REDEEM_OPTIONS.map(({ id, label, icon }) => (
          <button
            key={id}
            type="button"
            className={styles.option}
            aria-label={`Redeem for ${label}`}
            disabled
          >
            <img src={icon} alt="" aria-hidden="true" className={styles.optionIcon} width={40} height={40} />
            <span className={styles.optionLabel}>{label}</span>
            <span className={styles.comingSoon}>Soon</span>
          </button>
        ))}
      </div>
    </section>
  );
}
