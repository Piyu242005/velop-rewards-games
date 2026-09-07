// GameRedeem — full functional redemption component.
// Rates: how many Game Coins buys one unit of each reward.
// Flow: select option → confirm modal → deduct coins → success.
import { useState } from 'react';
import styles        from './GameRedeem.module.css';
import useGameCoins  from '../../hooks/useGameCoins';
import coinIcon      from '../../../assets/icons/game-coin-icon.png';
import redeemVeIcon     from '../../../assets/icons/redeem-ve-icon.png';
import redeemSveIcon    from '../../../assets/icons/redeem-sve-icon.png';
import redeemGemsIcon   from '../../../assets/icons/redeem-gems-icon.png';
import redeemTokensIcon from '../../../assets/icons/redeem-tokens-icon.png';
import redeemSpinsIcon  from '../../../assets/icons/redeem-spins-icon.png';

// ── Redemption catalogue ────────────────────────────────────
const REDEEM_OPTIONS = [
  {
    id: 've',
    label: 'VE',
    description: 'VELOOP native tokens',
    icon: redeemVeIcon,
    costPerUnit: 500,
    unit: 'VE',
    color: '#3b82f6',
    colorBg: 'rgba(59,130,246,0.1)',
    colorBorder: 'rgba(59,130,246,0.25)',
  },
  {
    id: 'sve',
    label: 'SVE',
    description: 'Staked VELOOP tokens',
    icon: redeemSveIcon,
    costPerUnit: 800,
    unit: 'SVE',
    color: '#8b5cf6',
    colorBg: 'rgba(139,92,246,0.1)',
    colorBorder: 'rgba(139,92,246,0.25)',
  },
  {
    id: 'gems',
    label: 'Gems',
    description: 'In-app gem currency',
    icon: redeemGemsIcon,
    costPerUnit: 100,
    unit: 'Gem',
    color: '#06b6d4',
    colorBg: 'rgba(6,182,212,0.1)',
    colorBorder: 'rgba(6,182,212,0.25)',
  },
  {
    id: 'tokens',
    label: 'Tokens',
    description: 'Game entry tokens',
    icon: redeemTokensIcon,
    costPerUnit: 200,
    unit: 'Token',
    color: '#9b7dff',
    colorBg: 'rgba(155,125,255,0.1)',
    colorBorder: 'rgba(155,125,255,0.25)',
  },
  {
    id: 'spins',
    label: 'Spins',
    description: 'Lucky wheel spins',
    icon: redeemSpinsIcon,
    costPerUnit: 150,
    unit: 'Spin',
    color: '#f59e0b',
    colorBg: 'rgba(245,158,11,0.1)',
    colorBorder: 'rgba(245,158,11,0.25)',
  },
];

// ── Component ────────────────────────────────────────────────
export default function GameRedeem() {
  const { coinBalance, spendCoins } = useGameCoins();

  const [selected, setSelected]   = useState(null);   // option being confirmed
  const [qty, setQty]             = useState(1);       // number of units
  const [success, setSuccess]     = useState(null);    // { label, qty, cost }
  const [error, setError]         = useState('');

  function openConfirm(option) {
    setSelected(option);
    setQty(1);
    setError('');
    setSuccess(null);
  }

  function closeConfirm() {
    setSelected(null);
    setError('');
  }

  function handleRedeem() {
    if (!selected) return;
    const total = selected.costPerUnit * qty;
    if (coinBalance < total) {
      setError(`Not enough Game Coins. You need ${total.toLocaleString()} but have ${coinBalance.toLocaleString()}.`);
      return;
    }
    spendCoins(total);
    setSuccess({ label: selected.label, qty, cost: total, unit: selected.unit });
    setSelected(null);
    setError('');
  }

  function canAffordAny(option) {
    return coinBalance >= option.costPerUnit;
  }

  const maxQty = selected ? Math.floor(coinBalance / selected.costPerUnit) : 0;

  return (
    <section className={styles.redeem} aria-label="Game Coin redemption">

      {/* ── Balance hero ── */}
      <div className={styles.balanceHero}>
        <div className={styles.balanceCoinWrap}>
          <img src={coinIcon} alt="" width={40} height={40} className={styles.balanceCoinIcon} />
        </div>
        <div>
          <div className={styles.balanceNum} aria-label={`${coinBalance} Game Coins`}>
            {coinBalance.toLocaleString()}
          </div>
          <div className={styles.balanceLbl}>Game Coins Available</div>
        </div>
      </div>

      {/* ── Success toast ── */}
      {success && (
        <div className={styles.successBanner} role="status" aria-live="polite">
          <span className={styles.successIcon}>✓</span>
          <span>
            Redeemed <strong>{success.qty} {success.unit}{success.qty > 1 ? 's' : ''}</strong> for{' '}
            <strong>{success.cost.toLocaleString()} Game Coins</strong>
          </span>
          <button
            type="button"
            className={styles.successClose}
            onClick={() => setSuccess(null)}
            aria-label="Dismiss"
          >×</button>
        </div>
      )}

      {/* ── Rate note ── */}
      <p className={styles.rateNote}>
        Select a reward below to see how many Game Coins it costs.
      </p>

      {/* ── Options grid ── */}
      <div className={styles.grid} role="list">
        {REDEEM_OPTIONS.map((opt) => {
          const affordable = canAffordAny(opt);
          const units      = Math.floor(coinBalance / opt.costPerUnit);
          return (
            <button
              key={opt.id}
              type="button"
              role="listitem"
              className={`${styles.option} ${!affordable ? styles.optionDisabled : ''}`}
              style={{ '--opt-color': opt.color, '--opt-bg': opt.colorBg, '--opt-border': opt.colorBorder }}
              onClick={() => affordable && openConfirm(opt)}
              aria-label={`Redeem Game Coins for ${opt.label} — ${opt.costPerUnit} coins per unit`}
              aria-disabled={!affordable}
            >
              <div className={styles.optionIconWrap} style={{ background: opt.colorBg, border: `1px solid ${opt.colorBorder}` }}>
                <img src={opt.icon} alt="" aria-hidden="true" className={styles.optionIcon} width={36} height={36} />
              </div>
              <div className={styles.optionBody}>
                <div className={styles.optionLabel} style={{ color: opt.color }}>{opt.label}</div>
                <div className={styles.optionDesc}>{opt.description}</div>
              </div>
              <div className={styles.optionRate}>
                <span className={styles.rateCost}>{opt.costPerUnit.toLocaleString()}</span>
                <span className={styles.rateUnit}>GC / {opt.unit}</span>
                {affordable && (
                  <span className={styles.rateAfford}>You can get {units}</span>
                )}
                {!affordable && (
                  <span className={styles.rateInsuff}>Need {(opt.costPerUnit - coinBalance).toLocaleString()} more</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Confirm modal ── */}
      {selected && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-label={`Redeem ${selected.label}`}>
          <div className={styles.modal}>
            <button
              type="button"
              className={styles.modalClose}
              onClick={closeConfirm}
              aria-label="Cancel"
            >×</button>

            <div className={styles.modalIcon} style={{ background: selected.colorBg, border: `1px solid ${selected.colorBorder}` }}>
              <img src={selected.icon} alt="" width={48} height={48} />
            </div>
            <h2 className={styles.modalTitle}>Redeem {selected.label}</h2>
            <p className={styles.modalDesc}>{selected.description}</p>

            {/* Rate row */}
            <div className={styles.modalRate}>
              <span className={styles.modalRateLabel}>Rate</span>
              <span className={styles.modalRateValue} style={{ color: selected.color }}>
                {selected.costPerUnit.toLocaleString()} GC = 1 {selected.unit}
              </span>
            </div>

            {/* Qty selector */}
            <div className={styles.qtyRow}>
              <label htmlFor="redeem-qty" className={styles.qtyLabel}>Quantity</label>
              <div className={styles.qtyStepper}>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  disabled={qty <= 1}
                >−</button>
                <span className={styles.qtyValue} id="redeem-qty" aria-live="polite">{qty}</span>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                  aria-label="Increase quantity"
                  disabled={qty >= maxQty}
                >+</button>
              </div>
            </div>

            {/* Total */}
            <div className={styles.modalTotal}>
              <span>Total cost</span>
              <strong className={styles.modalTotalVal}>
                {(selected.costPerUnit * qty).toLocaleString()} Game Coins
              </strong>
            </div>
            <div className={styles.modalBalance}>
              <span>Your balance after</span>
              <strong className={(coinBalance - selected.costPerUnit * qty) < 0 ? styles.balanceNeg : styles.balancePos}>
                {Math.max(0, coinBalance - selected.costPerUnit * qty).toLocaleString()} GC
              </strong>
            </div>

            {error && <p className={styles.modalError} role="alert">{error}</p>}

            <button
              type="button"
              className={styles.confirmBtn}
              style={{ background: selected.color }}
              onClick={handleRedeem}
              disabled={coinBalance < selected.costPerUnit * qty}
              aria-label={`Confirm redeem ${qty} ${selected.unit} for ${(selected.costPerUnit * qty).toLocaleString()} Game Coins`}
            >
              Confirm Redemption
            </button>
            <button type="button" className={styles.cancelBtn} onClick={closeConfirm}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
