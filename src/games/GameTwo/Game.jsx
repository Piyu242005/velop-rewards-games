// Fruit Blast — Game Two
// Grid match/pop game: IDLE → PLAYING → OVER → REVIVE → REWARD
// Score: group² × 10 pts. 1 coin per 500 pts.
import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useGameCoins           from '../../hooks/useGameCoins';
import usePageTitle           from '../../hooks/usePageTitle';
import styles                 from './Game.module.css';

// ── Config ──────────────────────────────────────────────────
const COLS         = 8;
const ROWS         = 9;
const FRUITS       = ['🍎', '🍋', '🍇', '🍊', '🍓', '🫐'];
const TARGET_SCORE = 3000;
const INITIAL_LIVES = 3;
const COINS_PER_500 = 1;
const PHASE = { IDLE: 'IDLE', PLAYING: 'PLAYING', OVER: 'OVER', REVIVE: 'REVIVE', REWARD: 'REWARD' };

// ── Grid helpers ─────────────────────────────────────────────
function randomFruit() {
  return FRUITS[Math.floor(Math.random() * FRUITS.length)];
}

function makeGrid() {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => randomFruit())
  );
}

// BFS — find connected group of same fruit from (r, c)
function findGroup(grid, r, c) {
  const target = grid[r][c];
  if (!target) return [];
  const visited = new Set();
  const queue   = [[r, c]];
  const group   = [];
  while (queue.length) {
    const [cr, cc] = queue.shift();
    const key = `${cr},${cc}`;
    if (visited.has(key)) continue;
    visited.add(key);
    if (grid[cr]?.[cc] !== target) continue;
    group.push([cr, cc]);
    queue.push([cr - 1, cc], [cr + 1, cc], [cr, cc - 1], [cr, cc + 1]);
  }
  return group;
}

// Remove group and apply gravity (cells fall down)
function applyBlast(grid, group) {
  const next = grid.map((row) => [...row]);
  for (const [r, c] of group) next[r][c] = null;
  // Gravity: compact each column downward
  for (let c = 0; c < COLS; c++) {
    const fruits = [];
    for (let r = 0; r < ROWS; r++) { if (next[r][c]) fruits.push(next[r][c]); }
    const padded = Array(ROWS - fruits.length).fill(null).concat(fruits);
    for (let r = 0; r < ROWS; r++) next[r][c] = padded[r];
  }
  return next;
}

// Count remaining non-null cells
function countCells(grid) {
  return grid.flat().filter(Boolean).length;
}

// ── Main component ───────────────────────────────────────────
export default function FruitBlast() {
  usePageTitle('Fruit Blast');
  const navigate      = useNavigate();
  const { earnCoins } = useGameCoins();

  const [phase, setPhase]             = useState(PHASE.IDLE);
  const [grid, setGrid]               = useState(() => makeGrid());
  const [score, setScore]             = useState(0);
  const [lives, setLives]             = useState(INITIAL_LIVES);
  const [highlighted, setHighlighted] = useState([]);   // group preview on hover
  const [popping, setPopping]         = useState([]);    // cells currently animating
  const [finalScore, setFinalScore]   = useState(0);
  const [reviveUsed, setReviveUsed]   = useState(false);
  const coinsAwardedRef               = useRef(false);

  const coinsForScore = (s) => Math.floor(s / 500) * COINS_PER_500;

  // ── Start / restart ─────────────────────────────────────
  function startGame() {
    coinsAwardedRef.current = false;
    setGrid(makeGrid());
    setScore(0);
    setLives(INITIAL_LIVES);
    setHighlighted([]);
    setPopping([]);
    setReviveUsed(false);
    setPhase(PHASE.PLAYING);
  }

  // ── Hover → highlight group ──────────────────────────────
  function handleHover(r, c) {
    if (phase !== PHASE.PLAYING) return;
    const group = findGroup(grid, r, c);
    setHighlighted(group.length >= 2 ? group.map(([gr, gc]) => `${gr},${gc}`) : []);
  }

  function handleHoverLeave() { setHighlighted([]); }

  // ── Click → blast ────────────────────────────────────────
  function handleClick(r, c) {
    if (phase !== PHASE.PLAYING) return;
    const group = findGroup(grid, r, c);
    if (group.length < 2) return;

    const keys = group.map(([gr, gc]) => `${gr},${gc}`);
    setPopping(keys);
    setHighlighted([]);

    setTimeout(() => {
      const pts  = group.length * group.length * 10;
      const newGrid  = applyBlast(grid, group);
      const newScore = score + pts;

      setGrid(newGrid);
      setScore(newScore);
      setPopping([]);

      // Win condition — cleared board or hit target
      const remaining = countCells(newGrid);
      if (remaining === 0 || newScore >= TARGET_SCORE) {
        endGame(newScore);
        return;
      }

      // Check if any moves remain (any group ≥ 2)
      let hasMove = false;
      outer: for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          if (newGrid[row][col] && findGroup(newGrid, row, col).length >= 2) {
            hasMove = true; break outer;
          }
        }
      }
      if (!hasMove) {
        const newLives = lives - 1;
        if (newLives <= 0) {
          endGame(newScore);
        } else {
          setLives(newLives);
          // Shuffle remaining
          setGrid(makeGrid());
        }
      }
    }, 220);
  }

  function endGame(finalSc) {
    setFinalScore(finalSc);
    setPhase(PHASE.OVER);
  }

  function handleRevive() {
    setLives(1);
    setReviveUsed(true);
    setGrid(makeGrid());
    setPhase(PHASE.PLAYING);
  }

  function handleCollectReward() {
    if (!coinsAwardedRef.current) {
      earnCoins(coinsForScore(finalScore));
      coinsAwardedRef.current = true;
    }
    setPhase(PHASE.REWARD);
  }

  const finalCoins = coinsForScore(finalScore);
  const progress   = Math.min(100, Math.round((score / TARGET_SCORE) * 100));

  return (
    <div className={styles.root}>
      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => navigate('/games')} aria-label="Back to games">← Games</button>
          <h1 className={styles.gameTitle}>Fruit Blast</h1>
        </div>
        <div className={styles.hud}>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>Score</span>
            <span className={styles.hudValue}>{score.toLocaleString()}</span>
          </div>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>Target</span>
            <span className={styles.hudValue}>{TARGET_SCORE.toLocaleString()}</span>
          </div>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>Lives</span>
            <div className={styles.livesRow} aria-label={`${lives} lives`}>
              {Array.from({ length: Math.max(0, lives) }, (_, i) => (
                <span key={i} className={styles.lifeIcon} aria-hidden="true">♥</span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── Game area ── */}
      <main className={styles.main}>
        {/* Score bar */}
        <div className={styles.scoreBar} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <span>Progress</span>
          <span className={styles.scoreBarVal}>{progress}%</span>
        </div>

        {/* Grid */}
        <div
          className={styles.grid}
          style={{ gridTemplateColumns: `repeat(${COLS}, 44px)` }}
          role="grid"
          aria-label="Fruit Blast game grid"
        >
          {grid.map((row, r) =>
            row.map((fruit, c) => {
              const key  = `${r},${c}`;
              const isHl = highlighted.includes(key);
              const isPop = popping.includes(key);
              return (
                <div
                  key={key}
                  role="gridcell"
                  tabIndex={fruit ? 0 : -1}
                  aria-label={fruit ? `${fruit} at row ${r + 1} column ${c + 1}` : 'empty'}
                  className={[
                    styles.cell,
                    !fruit ? styles.empty : '',
                    isHl   ? styles.selected : '',
                    isPop  ? styles.popping  : '',
                  ].join(' ')}
                  style={fruit ? { background: `hsl(${(FRUITS.indexOf(fruit) * 55) + 30}, 85%, 90%)` } : {}}
                  onClick={() => fruit && handleClick(r, c)}
                  onMouseEnter={() => fruit && handleHover(r, c)}
                  onMouseLeave={handleHoverLeave}
                  onKeyDown={(e) => e.key === 'Enter' && fruit && handleClick(r, c)}
                >
                  {fruit ?? ''}
                </div>
              );
            })
          )}
        </div>

        <p className={styles.hint}>Click a group of 2+ matching fruits to blast them</p>
      </main>

      {/* ── IDLE panel ── */}
      {phase === PHASE.IDLE && (
        <div className={styles.overlay}>
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Fruit Blast 🍎</h2>
            <p className={styles.panelSub}>Match groups of 2+ same fruits to blast them. Reach {TARGET_SCORE.toLocaleString()} points to win!</p>
            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <span className={styles.statVal}>{TARGET_SCORE.toLocaleString()}</span>
                <span className={styles.statLbl}>Target</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statVal}>3</span>
                <span className={styles.statLbl}>Lives</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statVal}>6</span>
                <span className={styles.statLbl}>Fruits</span>
              </div>
            </div>
            <button className={styles.primaryBtn} onClick={startGame}>Start Blasting!</button>
            <Link to="/games/fruit-blast/home" className={styles.secondaryBtn}>← Back</Link>
          </div>
        </div>
      )}

      {/* ── OVER panel ── */}
      {phase === PHASE.OVER && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Game Over">
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>
              {finalScore >= TARGET_SCORE ? '🎉 You Win!' : 'Game Over'}
            </h2>
            <p className={styles.panelSub}>Fruit Blast</p>
            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <span className={styles.statVal}>{finalScore.toLocaleString()}</span>
                <span className={styles.statLbl}>Score</span>
              </div>
              <div className={styles.statItem}>
                <span className={`${styles.statVal} ${styles.gold}`}>+{finalCoins}</span>
                <span className={styles.statLbl}>Coins</span>
              </div>
            </div>
            {!reviveUsed && (
              <button className={styles.primaryBtn} onClick={() => setPhase(PHASE.REVIVE)}>
                Revive
              </button>
            )}
            <button className={styles.goldBtn} onClick={handleCollectReward}>
              Collect Reward
            </button>
            <button className={styles.secondaryBtn} onClick={startGame}>Play Again</button>
          </div>
        </div>
      )}

      {/* ── REVIVE modal ── */}
      {phase === PHASE.REVIVE && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Revive">
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Revive? 🍇</h2>
            <p className={styles.panelSub}>Continue with 1 life and a fresh board.</p>
            <button className={styles.primaryBtn} onClick={handleRevive}>Yes, Revive</button>
            <button className={styles.secondaryBtn} onClick={() => setPhase(PHASE.OVER)}>No Thanks</button>
          </div>
        </div>
      )}

      {/* ── REWARD panel ── */}
      {phase === PHASE.REWARD && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Reward">
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Well Played! 🍓</h2>
            <p className={styles.panelSub}>Fruit Blast</p>
            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <span className={styles.statVal}>{finalScore.toLocaleString()}</span>
                <span className={styles.statLbl}>Score</span>
              </div>
              <div className={styles.statItem}>
                <span className={`${styles.statVal} ${styles.gold}`}>+{finalCoins}</span>
                <span className={styles.statLbl}>Coins Earned</span>
              </div>
            </div>
            <button className={styles.primaryBtn} onClick={startGame}>Play Again</button>
            <Link to="/redeem" className={styles.goldBtn}>Redeem Coins</Link>
            <Link to="/games" className={styles.secondaryBtn}>← Games Hub</Link>
          </div>
        </div>
      )}
    </div>
  );
}
