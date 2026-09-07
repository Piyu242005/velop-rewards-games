// GameRedeem page — full premium redemption hub.
import { Link }            from 'react-router-dom';
import GameHeader           from '../components/games/GameHeader';
import GameRedeemComponent  from '../components/games/GameRedeem';
import styles               from './GameRedeem.module.css';
import usePageTitle         from '../hooks/usePageTitle';

export default function GameRedeemPage() {
  usePageTitle('Redeem Coins');
  return (
    <div className={styles.page}>
      <GameHeader title="Redeem" />

      <main className={styles.main} id="main-content">
        <div className={styles.inner}>

          {/* ── Page header ── */}
          <div className={styles.pageHead}>
            <div className={styles.pageHeadLeft}>
              <span className={styles.headPill}>💎 Redemption Centre</span>
              <h1 className={styles.title}>Redeem Game Coins</h1>
              <p className={styles.sub}>
                Convert your earned Game Coins into real VELOOP rewards.
                Every session counts — the more you play, the more you earn.
              </p>
            </div>
            <Link to="/games" className={styles.backBtn}>← Back to Games</Link>
          </div>

          {/* ── How it works strip ── */}
          <div className={styles.howStrip}>
            {[
              { step: '1', text: 'Play any game' },
              { step: '2', text: 'Earn Game Coins' },
              { step: '3', text: 'Redeem below' },
            ].map(({ step, text }) => (
              <div key={step} className={styles.howItem}>
                <span className={styles.howStep}>{step}</span>
                <span className={styles.howText}>{text}</span>
              </div>
            ))}
          </div>

          {/* ── Redemption component ── */}
          <GameRedeemComponent />

          {/* ── Bottom nav ── */}
          <nav className={styles.bottomNav} aria-label="Section navigation">
            <Link to="/games"  className={styles.navItem}>🎮 Games</Link>
            <Link to="/redeem" className={`${styles.navItem} ${styles.navActive}`}>💎 Redeem</Link>
          </nav>

        </div>
      </main>
    </div>
  );
}
