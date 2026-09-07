// Games page — the main hub showing the carousel and hero section.
import GameHeader from '../components/games/GameHeader';
import GamesCarousel from '../components/games/GamesCarousel';
import styles from './Games.module.css';
import heroTagline from '../../assets/branding/hero-tagline.png';

export default function Games() {
  return (
    <div className={styles.page}>
      <GameHeader title="Games" />

      <main className={styles.main} id="main-content">
        {/* ── Hero ── */}
        <section className={styles.hero} aria-label="Games hero">
          <div className={styles.heroInner}>
            <div className={styles.heroText}>
              <img
                src={heroTagline}
                alt="Play. Earn. Redeem."
                className={styles.heroTagline}
                width={320}
              />
              <p className={styles.heroSub}>
                Spend 20 Tokens · Enter any game · Earn Game Coins · Redeem rewards
              </p>
            </div>
          </div>
        </section>

        {/* ── Carousel ── */}
        <section className={styles.carouselSection} aria-label="Choose a game">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Choose Your Game</h2>
            <span className={styles.sectionMeta}>13 games available · 20 Tokens each</span>
          </div>
          <GamesCarousel />
        </section>
      </main>
    </div>
  );
}
