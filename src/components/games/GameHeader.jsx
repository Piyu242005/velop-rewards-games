// GameHeader — top bar shown on every game-related page.
// Displays logo, page title, Game Coin balance, and Token balance.
import { Link } from 'react-router-dom';
import GameCoinBalance from './GameCoinBalance';
import styles     from './GameHeader.module.css';
import veloopLogo from '../../../assets/branding/velop-logo.png';
import tokenIcon  from '../../../assets/icons/token-icon.png';
import useTokens  from '../../hooks/useTokens';

export default function GameHeader({ title = 'Games' }) {
  const { tokenBalance } = useTokens();

  return (
    <header className={styles.header} role="banner">
      <div className={styles.inner}>
        {/* ── Logo ── */}
        <Link to="/" className={styles.logoLink} aria-label="VELOOP home">
          <img
            src={veloopLogo}
            alt="VELOOP"
            className={styles.logo}
            width={110}
            height={36}
          />
        </Link>

        {/* ── Page title ── */}
        <h1 className={styles.title}>{title}</h1>

        {/* ── Balances ── */}
        <div className={styles.right}>
          {/* Token balance */}
          <div className={styles.tokenBadge} aria-label={`Token balance: ${tokenBalance}`} title="Tokens">
            <img src={tokenIcon} alt="" aria-hidden="true" className={styles.tokenIcon} width={16} height={16} />
            <span className={styles.tokenValue}>{tokenBalance}</span>
          </div>
          <GameCoinBalance />
        </div>
      </div>
    </header>
  );
}
