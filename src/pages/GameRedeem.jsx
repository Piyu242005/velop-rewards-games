// GameRedeem page — wrapper around the GameRedeem component.
import GameHeader from '../components/games/GameHeader';
import GameRedeemComponent from '../components/games/GameRedeem';
import styles from './GameRedeem.module.css';

export default function GameRedeemPage() {
  return (
    <div className={styles.page}>
      <GameHeader title="Redeem" />
      <main className={styles.main} id="main-content">
        <div className={styles.inner}>
          <div className={styles.heading}>
            <h1 className={styles.title}>Redeem Game Coins</h1>
            <p className={styles.sub}>
              Turn your earned Game Coins into real rewards — VE, SVE, Gems, Tokens, or Spins.
            </p>
          </div>
          <GameRedeemComponent />
        </div>
      </main>
    </div>
  );
}
