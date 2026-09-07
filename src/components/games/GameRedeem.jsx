// GameRedeem — accessible, fully testable redemption centre.
import { useEffect, useRef, useState } from 'react';
import styles from './GameRedeem.module.css';
import useGameCoins from '../../hooks/useGameCoins';
import coinIcon from '../../../assets/icons/game-coin-icon.png';
import redeemVeIcon from '../../../assets/icons/redeem-ve-icon.png';
import redeemSveIcon from '../../../assets/icons/redeem-sve-icon.png';
import redeemGemsIcon from '../../../assets/icons/redeem-gems-icon.png';
import redeemTokensIcon from '../../../assets/icons/redeem-tokens-icon.png';
import redeemSpinsIcon from '../../../assets/icons/redeem-spins-icon.png';
import { REDEEM_OPTIONS, getRedemptionTotal, canRedeem } from '../../utils/redemption';

const ICONS = { ve: redeemVeIcon, sve: redeemSveIcon, gems: redeemGemsIcon, tokens: redeemTokensIcon, spins: redeemSpinsIcon };
const META = {
  ve: { color: '#3b82f6', colorBg: 'rgba(59,130,246,0.1)', colorBorder: 'rgba(59,130,246,0.25)' },
  sve: { color: '#8b5cf6', colorBg: 'rgba(139,92,246,0.1)', colorBorder: 'rgba(139,92,246,0.25)' },
  gems: { color: '#06b6d4', colorBg: 'rgba(6,182,212,0.1)', colorBorder: 'rgba(6,182,212,0.25)' },
  tokens: { color: '#9b7dff', colorBg: 'rgba(155,125,255,0.1)', colorBorder: 'rgba(155,125,255,0.25)' },
  spins: { color: '#f59e0b', colorBg: 'rgba(245,158,11,0.1)', colorBorder: 'rgba(245,158,11,0.25)' },
};

export default function GameRedeem() {
  const { coinBalance, spendCoins } = useGameCoins();
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');
  const closeRef = useRef(null);

  useEffect(() => {
    if (!selected) return undefined;
    const onKeyDown = (event) => { if (event.key === 'Escape') closeConfirm(); };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => closeRef.current?.focus());
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.style.overflow = previousOverflow; };
  }, [selected]);

  function openConfirm(option) { setSelected(option); setQty(1); setError(''); setSuccess(null); }
  function closeConfirm() { setSelected(null); setError(''); }
  function handleRedeem() {
    if (!selected) return;
    const total = getRedemptionTotal(selected, qty);
    if (!canRedeem(coinBalance, total)) {
      setError(`Insufficient Game Coins. You need ${total.toLocaleString()} but have ${coinBalance.toLocaleString()}.`);
      return;
    }
    spendCoins(total);
    setSuccess({ label: selected.label, qty, cost: total, unit: selected.unit, after: coinBalance - total });
    closeConfirm();
  }

  const maxQty = selected ? Math.max(1, Math.floor(coinBalance / selected.costPerUnit)) : 1;
  const total = selected ? getRedemptionTotal(selected, qty) : 0;

  return (
    <section className={styles.redeem} aria-label="Game Coin redemption">
      <div className={styles.balanceHero}>
        <div className={styles.balanceCoinWrap}><img src={coinIcon} alt="Game Coin" width={40} height={40} className={styles.balanceCoinIcon} /></div>
        <div><div className={styles.balanceNum} aria-label={`${coinBalance.toLocaleString()} Game Coins available`}>{coinBalance.toLocaleString()}</div><div className={styles.balanceLbl}>Game Coins Available</div></div>
      </div>

      {success && <div className={styles.successBanner} role="status" aria-live="polite"><span className={styles.successIcon} aria-hidden="true">✓</span><span>Redeemed <strong>{success.qty} {success.unit}{success.qty > 1 ? 's' : ''}</strong> for <strong>{success.cost.toLocaleString()} Game Coins</strong>. Remaining balance: <strong>{success.after.toLocaleString()} GC</strong>.</span><button type="button" className={styles.successClose} onClick={() => setSuccess(null)} aria-label="Dismiss redemption confirmation">×</button></div>}

      <p className={styles.rateNote}>Select a reward to review the rate, choose a quantity, and confirm redemption. Unaffordable rewards remain selectable so the balance warning can be verified.</p>

      <div className={styles.grid} role="list" aria-label="Available redemption rewards">
        {REDEEM_OPTIONS.map((opt) => {
          const affordable = coinBalance >= opt.costPerUnit;
          const units = Math.floor(coinBalance / opt.costPerUnit);
          const meta = META[opt.id];
          return <button key={opt.id} type="button" role="listitem" className={`${styles.option} ${!affordable ? styles.optionDisabled : ''}`} style={{ '--opt-color': meta.color, '--opt-bg': meta.colorBg, '--opt-border': meta.colorBorder }} onClick={() => openConfirm(opt)} aria-label={`Redeem for ${opt.label}. ${opt.costPerUnit.toLocaleString()} Game Coins per ${opt.unit}. ${affordable ? `You can get ${units}.` : `You need ${(opt.costPerUnit - coinBalance).toLocaleString()} more Game Coins.`}`}>
            <div className={styles.optionIconWrap} style={{ background: meta.colorBg, border: `1px solid ${meta.colorBorder}` }}><img src={ICONS[opt.id]} alt="" aria-hidden="true" className={styles.optionIcon} width={36} height={36} /></div>
            <div className={styles.optionBody}><div className={styles.optionLabel}>{opt.label}</div><div className={styles.optionDesc}>{opt.description}</div></div>
            <div className={styles.optionRate}><span className={styles.rateCost}>{opt.costPerUnit.toLocaleString()}</span><span className={styles.rateUnit}>GC / {opt.unit}</span>{affordable ? <span className={styles.rateAfford}>You can get {units}</span> : <span className={styles.rateInsuff}>Need {(opt.costPerUnit - coinBalance).toLocaleString()} more</span>}</div>
          </button>;
        })}
      </div>

      {selected && <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="redeem-dialog-title" onMouseDown={(event) => { if (event.target === event.currentTarget) closeConfirm(); }}>
        <div className={styles.modal}>
          <button ref={closeRef} type="button" className={styles.modalClose} onClick={closeConfirm} aria-label="Close redemption dialog">×</button>
          <div className={styles.modalIcon} style={{ background: META[selected.id].colorBg, border: `1px solid ${META[selected.id].colorBorder}` }}><img src={ICONS[selected.id]} alt="" width={48} height={48} aria-hidden="true" /></div>
          <h2 className={styles.modalTitle} id="redeem-dialog-title">Redeem {selected.label}</h2>
          <p className={styles.modalDesc}>{selected.description}</p>
          <div className={styles.modalRate}><span className={styles.modalRateLabel}>Rate</span><span className={styles.modalRateValue} style={{ color: META[selected.id].color }}>{selected.costPerUnit.toLocaleString()} GC = 1 {selected.unit}</span></div>
          <div className={styles.qtyRow}><label htmlFor="redeem-qty" className={styles.qtyLabel}>Quantity</label><div className={styles.qtyStepper} aria-label="Redemption quantity"><button type="button" className={styles.qtyBtn} onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" disabled={qty <= 1}>−</button><output id="redeem-qty" className={styles.qtyValue} aria-live="polite" aria-label={`Quantity ${qty}`}>{qty}</output><button type="button" className={styles.qtyBtn} onClick={() => setQty((q) => Math.min(maxQty, q + 1))} aria-label="Increase quantity" disabled={qty >= maxQty}>+</button></div></div>
          <div className={styles.modalTotal}><span>Total cost</span><strong className={styles.modalTotalVal}>{total.toLocaleString()} Game Coins</strong></div>
          <div className={styles.modalBalance}><span>Balance after redemption</span><strong className={coinBalance >= total ? styles.balancePos : styles.balanceNeg}>{Math.max(0, coinBalance - total).toLocaleString()} GC</strong></div>
          {!canRedeem(coinBalance, total) && <p className={styles.modalError} role="alert" aria-live="assertive">Insufficient Game Coins. You need {(total - coinBalance).toLocaleString()} more.</p>}
          {error && <p className={styles.modalError} role="alert" aria-live="assertive">{error}</p>}
          <button type="button" className={styles.confirmBtn} style={{ background: META[selected.id].color }} onClick={handleRedeem} disabled={!canRedeem(coinBalance, total)}>Confirm Redemption</button>
          <button type="button" className={styles.cancelBtn} onClick={closeConfirm}>Cancel</button>
        </div>
      </div>}
    </section>
  );
}
