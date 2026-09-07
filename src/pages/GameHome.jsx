// GameHome — individual game landing page.
// Shows artwork, name, token cost, and the Pay to Play gate.
// Token deduction happens here before routing to /guide.
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import GameHeader from '../components/games/GameHeader';
import TokenCost  from '../components/games/TokenCost';
import styles     from './GameHome.module.css';
import { getGameBySlug } from '../data/gamesData';
import useTokens         from '../hooks/useTokens';
import tokenIcon         from '../../assets/icons/token-icon.png';

export default function GameHome() {
  const { slug }   = useParams();
  const navigate   = useNavigate();
  const { tokenBalance, spendTokens, canAfford } = useTokens();
  const [error, setError] = useState('');

  const game = getGameBySlug(slug);

  if (!game) {
    return (
      <div className={styles.page}>
        <GameHeader title="Game Not Found" />
        <main className={styles.main}>
          <p className={styles.notFound}>
            Game not found.{' '}
            <Link to="/games" className={styles.backLink}>Back to Games</Link>
          </p>
        </main>
      </div>
    );
  }

  function handlePay() {
    if (!canAfford(game.entryCost)) {
      setError(`Not enough Tokens. You need ${game.entryCost} but have ${tokenBalance}.`);
      return;
    }
    spendTokens(game.entryCost);
    navigate(`/games/${game.slug}/guide`);
  }

  return (
    <div className={styles.page}>
      <GameHeader title={game.name} />

      <main className={styles.main} id="main-content">
        {/* ── Hero artwork ── */}
        <div className={styles.hero}>
          <img src={game.image} alt={`${game.name} artwork`} className={styles.artwork} />
          <div className={styles.overlay} />
        </div>

        {/* ── Content ── */}
        <div className={styles.content}>
          <div className={styles.info}>
            <span className={styles.category}>{game.category}</span>
            <h1 className={styles.name}>{game.name}</h1>
            <p className={styles.tagline}>{game.tagline}</p>
          </div>

          {game.playable ? (
            <div className={styles.payGate}>
              {/* Token balance display */}
              <div className={styles.balanceRow}>
                <img src={tokenIcon} alt="" width={18} height={18} aria-hidden="true" />
                <span className={styles.balanceLabel}>Your Tokens:</span>
                <span className={styles.balanceValue}>{tokenBalance}</span>
              </div>

              {/* Entry cost */}
              <div className={styles.costRow}>
                <span className={styles.costLabel}>Entry cost</span>
                <TokenCost amount={game.entryCost} />
              </div>

              {error && <p className={styles.errorMsg} role="alert">{error}</p>}

              <button
                type="button"
                className={styles.payBtn}
                onClick={handlePay}
                disabled={!canAfford(game.entryCost)}
                aria-label={`Spend ${game.entryCost} Tokens and enter ${game.name}`}
              >
                Spend {game.entryCost} Tokens &amp; Play
              </button>
            </div>
          ) : (
            <div className={styles.payGate}>
              <p className={styles.comingSoonMsg}>This game is coming soon.</p>
            </div>
          )}

          <Link to="/games" className={styles.back}>← Back to Games</Link>
        </div>
      </main>
    </div>
  );
}
