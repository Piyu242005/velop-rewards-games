// Games page — the premium hub: hero + stats strip + carousel.
import { Link }       from 'react-router-dom';
import GameHeader      from '../components/games/GameHeader';
import GamesCarousel   from '../components/games/GamesCarousel';
import styles          from './Games.module.css';
import veloopLogo      from '../../assets/branding/velop-logo.png';
import coinIcon        from '../../assets/icons/game-coin-icon.png';
import tokenIcon       from '../../assets/icons/token-icon.png';
import spinsIcon       from '../../assets/icons/redeem-spins-icon.png';
import gamesData       from '../data/gamesData';

const playableGames = gamesData.filter((g) => g.playable);

export default function Games() {
  return (
    <div className={styles.page}>
      <GameHeader title="Games" />

      <main className={styles.main} id="main-content">

        {/* ════════════════════════════════════
            HERO
        ════════════════════════════════════ */}
        <section className={styles.hero} aria-label="Games hero">
          {/* Ambient background glows */}
          <div className={styles.heroBg} aria-hidden="true">
            <div className={styles.glowLeft}  />
            <div className={styles.glowRight} />
            <div className={styles.gridLines} />
          </div>

          <div className={styles.heroContent}>
            {/* Left: text */}
            <div className={styles.heroLeft}>
              <span className={styles.heroPill}>🎮 VELOOP Rewards</span>
              <h1 className={styles.heroTitle}>
                Play Games.<br />
                Earn Coins.<br />
                Redeem Rewards.
              </h1>
              <p className={styles.heroDesc}>
                Spend 20 Tokens to enter any game. Every point you score
                converts to Game Coins you can redeem for VE, SVE, Gems,
                Tokens and Spins.
              </p>
              <div className={styles.heroCta}>
                <a href="#carousel" className={styles.ctaPrimary}>
                  Choose a Game
                </a>
                <Link to="/redeem" className={styles.ctaSecondary}>
                  Redeem Coins →
                </Link>
              </div>
            </div>

            {/* Right: floating stat cards */}
            <div className={styles.heroRight} aria-hidden="true">
              <div className={styles.statCard}>
                <img src={tokenIcon} alt="" width={28} height={28} />
                <div>
                  <div className={styles.statNum}>20</div>
                  <div className={styles.statLbl}>Tokens per Game</div>
                </div>
              </div>
              <div className={`${styles.statCard} ${styles.statCardAlt}`}>
                <img src={coinIcon} alt="" width={28} height={28} />
                <div>
                  <div className={styles.statNum}>{playableGames.length}</div>
                  <div className={styles.statLbl}>Playable Now</div>
                </div>
              </div>
              <div className={styles.statCard}>
                <img src={spinsIcon} alt="" width={28} height={28} />
                <div>
                  <div className={styles.statNum}>5</div>
                  <div className={styles.statLbl}>Reward Types</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            STATS STRIP
        ════════════════════════════════════ */}
        <div className={styles.statsStrip} aria-label="Quick stats">
          <div className={styles.statsInner}>
            {[
              { value: '13', label: 'Games Available' },
              { value: '20', label: 'Tokens per Entry' },
              { value: '5',  label: 'Reward Options' },
              { value: '∞',  label: 'Coins to Earn' },
            ].map(({ value, label }) => (
              <div key={label} className={styles.stripItem}>
                <span className={styles.stripValue}>{value}</span>
                <span className={styles.stripLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════
            CAROUSEL
        ════════════════════════════════════ */}
        <section id="carousel" className={styles.carouselSection} aria-label="Choose a game">
          <div className={styles.sectionHead}>
            <div>
              <h2 className={styles.sectionTitle}>Choose Your Game</h2>
              <p className={styles.sectionSub}>13 games · 20 Tokens each · earn Game Coins every session</p>
            </div>
            <Link to="/redeem" className={styles.redeemLink}>
              Redeem Coins →
            </Link>
          </div>
          <GamesCarousel />
        </section>

        {/* ════════════════════════════════════
            BOTTOM NAV
        ════════════════════════════════════ */}
        <nav className={styles.bottomNav} aria-label="Quick navigation">
          <div className={styles.bottomNavInner}>
            <Link to="/games"  className={`${styles.navItem} ${styles.navItemActive}`}>
              <span className={styles.navIcon} aria-hidden="true">🎮</span>
              <span>Games</span>
            </Link>
            <Link to="/redeem" className={styles.navItem}>
              <span className={styles.navIcon} aria-hidden="true">💎</span>
              <span>Redeem</span>
            </Link>
          </div>
        </nav>

      </main>
    </div>
  );
}
