// GameHeader — top bar shown on every game-related page.
// Displays logo, page title, and the shared Game Coin balance.
import { Link } from 'react-router-dom';
import GameCoinBalance from './GameCoinBalance';
import styles from './GameHeader.module.css';
import veloopLogo from '../../../assets/branding/velop-logo.png';

export default function GameHeader({ title = 'Games' }) {
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

        {/* ── Game Coin balance ── */}
        <div className={styles.right}>
          <GameCoinBalance />
        </div>
      </div>
    </header>
  );
}
