// Space Shooter — Game One
// Full canvas-based game: IDLE → PLAYING → OVER → REVIVE → REWARD
import { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate, Link }   from 'react-router-dom';
import useGameCoins            from '../../hooks/useGameCoins';
import usePageTitle            from '../../hooks/usePageTitle';
import styles                  from './Game.module.css';

// ── Safari <15.4 roundRect polyfill ────────────────────────
if (typeof CanvasRenderingContext2D !== 'undefined' &&
    !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    this.beginPath();
    this.moveTo(x + radius, y);
    this.arcTo(x + w, y,     x + w, y + h, radius);
    this.arcTo(x + w, y + h, x,     y + h, radius);
    this.arcTo(x,     y + h, x,     y,     radius);
    this.arcTo(x,     y,     x + w, y,     radius);
    this.closePath();
  };
}

// ── Game constants ──────────────────────────────────────────
const W               = 480;
const H               = 640;
const PLAYER_W        = 40;
const PLAYER_H        = 44;
const BULLET_W        = 4;
const BULLET_H        = 14;
const ENEMY_W         = 38;
const ENEMY_H         = 34;
const ASTEROID_R      = 14;
const PLAYER_SPEED    = 5;
const BULLET_SPEED    = 9;
const ENEMY_SPEED_BASE = 1.4;
const ASTEROID_SPEED  = 1.2;
const FIRE_RATE_MS    = 180;
const WAVE_INTERVAL   = 3000;
const INITIAL_LIVES   = 3;
const COINS_PER_100   = 1; // 1 coin per 100 score

// ── Tiny star field ─────────────────────────────────────────
function makeStars(n = 80) {
  return Array.from({ length: n }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.5 + 0.3,
    speed: Math.random() * 0.6 + 0.2,
    alpha: Math.random() * 0.6 + 0.2,
  }));
}

// ── Draw helpers ────────────────────────────────────────────
function drawPlayer(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);
  // Body
  ctx.fillStyle = '#d63a3a';
  ctx.beginPath();
  ctx.moveTo(0, -PLAYER_H / 2);
  ctx.lineTo(PLAYER_W / 2, PLAYER_H / 2);
  ctx.lineTo(-PLAYER_W / 2, PLAYER_H / 2);
  ctx.closePath();
  ctx.fill();
  // Cockpit
  ctx.fillStyle = '#fcd6d6';
  ctx.beginPath();
  ctx.ellipse(0, -4, 7, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  // Engine glow
  ctx.fillStyle = 'rgba(255,180,60,0.85)';
  ctx.beginPath();
  ctx.ellipse(0, PLAYER_H / 2 + 4, 7, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawEnemy(ctx, x, y, type) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = type === 'boss' ? '#9b59b6' : '#3498db';
  ctx.strokeStyle = type === 'boss' ? '#d2a6f5' : '#74b9ff';
  ctx.lineWidth = 1.5;
  if (type === 'boss') {
    // Hexagon boss
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      const r = 22;
      i === 0 ? ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r)
              : ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  } else {
    // Diamond
    ctx.beginPath();
    ctx.moveTo(0, -ENEMY_H / 2);
    ctx.lineTo(ENEMY_W / 2, 0);
    ctx.lineTo(0, ENEMY_H / 2);
    ctx.lineTo(-ENEMY_W / 2, 0);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}

function drawAsteroid(ctx, x, y, r) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#7f8c8d';
  ctx.strokeStyle = '#bdc3c7';
  ctx.lineWidth = 1;
  ctx.beginPath();
  const pts = 8;
  for (let i = 0; i < pts; i++) {
    const a   = (Math.PI * 2 / pts) * i;
    const jit = r * (0.75 + Math.random() * 0.25);
    i === 0 ? ctx.moveTo(Math.cos(a) * jit, Math.sin(a) * jit)
            : ctx.lineTo(Math.cos(a) * jit, Math.sin(a) * jit);
  }
  ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.restore();
}

function drawBullet(ctx, x, y) {
  ctx.fillStyle = '#f39c12';
  ctx.shadowColor = '#f39c12';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.roundRect(x - BULLET_W / 2, y - BULLET_H, BULLET_W, BULLET_H, 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

// ── Main component ──────────────────────────────────────────
const PHASE = { IDLE: 'IDLE', PLAYING: 'PLAYING', OVER: 'OVER', REVIVE: 'REVIVE', REWARD: 'REWARD' };

export default function SpaceShooter() {
  usePageTitle('Space Shooter');
  const navigate    = useNavigate();
  const { earnCoins } = useGameCoins();

  const canvasRef    = useRef(null);
  const stateRef     = useRef(null);      // mutable game state (not React state)
  const rafRef       = useRef(null);
  const lastFireRef  = useRef(0);
  const lastWaveRef  = useRef(0);
  const keysRef      = useRef({});
  const pointerRef   = useRef(null);      // touch/mouse x position on canvas

  const [phase, setPhase]           = useState(PHASE.IDLE);
  const [displayScore, setDisplayScore] = useState(0);
  const [displayLives, setDisplayLives] = useState(INITIAL_LIVES);
  const [displayWave, setDisplayWave]   = useState(1);
  const [finalScore, setFinalScore]     = useState(0);
  const [finalCoins, setFinalCoins]     = useState(0);
  const [reviveUsed, setReviveUsed]     = useState(false);
  const coinsAwardedRef = useRef(false);

  // ── Initialise game state ──────────────────────────────
  function initState() {
    const stars = makeStars(80);
    return {
      player: { x: W / 2, y: H - 80 },
      bullets: [],
      enemies: [],
      asteroids: [],
      particles: [],
      stars,
      score: 0,
      lives: INITIAL_LIVES,
      wave: 1,
      running: true,
    };
  }

  // ── Spawn a wave of enemies ────────────────────────────
  function spawnWave(state) {
    const count = 4 + state.wave;
    const isBossWave = state.wave % 5 === 0;
    if (isBossWave) {
      state.enemies.push({ x: W / 2, y: -40, vy: ENEMY_SPEED_BASE * 0.5, type: 'boss', hp: 4 });
    } else {
      for (let i = 0; i < count; i++) {
        state.enemies.push({
          x: ENEMY_W + Math.random() * (W - ENEMY_W * 2),
          y: -ENEMY_H - Math.random() * 120,
          vy: ENEMY_SPEED_BASE + state.wave * 0.08,
          type: 'normal',
          hp: 1,
        });
      }
    }
    // Occasionally spawn asteroids
    if (state.wave > 1 && Math.random() > 0.5) {
      for (let i = 0; i < 2; i++) {
        state.asteroids.push({
          x: ASTEROID_R + Math.random() * (W - ASTEROID_R * 2),
          y: -ASTEROID_R,
          vy: ASTEROID_SPEED + state.wave * 0.06,
          r: ASTEROID_R,
        });
      }
    }
  }

  // ── Particle burst ────────────────────────────────────
  function burst(state, x, y, color) {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 / 8) * i;
      state.particles.push({
        x, y,
        vx: Math.cos(angle) * (1.5 + Math.random() * 2),
        vy: Math.sin(angle) * (1.5 + Math.random() * 2),
        life: 1,
        color,
        r: 2 + Math.random() * 2,
      });
    }
  }

  // ── Collision AABB ────────────────────────────────────
  function collides(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
  }

  // ── Main loop tick ────────────────────────────────────
  const tick = useCallback((ts) => {
    const s = stateRef.current;
    if (!s || !s.running) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dt  = 1; // normalised

    // ── Player movement ──────────────────────────────
    if (keysRef.current['ArrowLeft'] || keysRef.current['KeyA']) s.player.x -= PLAYER_SPEED;
    if (keysRef.current['ArrowRight'] || keysRef.current['KeyD']) s.player.x += PLAYER_SPEED;
    // Pointer (touch / mouse)
    if (pointerRef.current !== null) {
      const dx = pointerRef.current - s.player.x;
      s.player.x += Math.sign(dx) * Math.min(Math.abs(dx), PLAYER_SPEED * 2);
    }
    s.player.x = Math.max(PLAYER_W / 2, Math.min(W - PLAYER_W / 2, s.player.x));

    // ── Auto fire ────────────────────────────────────
    if (ts - lastFireRef.current > FIRE_RATE_MS) {
      s.bullets.push({ x: s.player.x, y: s.player.y - PLAYER_H / 2 });
      lastFireRef.current = ts;
    }

    // ── Spawn waves ───────────────────────────────────
    if (ts - lastWaveRef.current > WAVE_INTERVAL) {
      s.wave++;
      spawnWave(s);
      lastWaveRef.current = ts;
      setDisplayWave(s.wave);
    }

    // ── Move bullets ─────────────────────────────────
    for (let i = s.bullets.length - 1; i >= 0; i--) {
      s.bullets[i].y -= BULLET_SPEED;
      if (s.bullets[i].y < -BULLET_H) s.bullets.splice(i, 1);
    }

    // ── Move enemies ──────────────────────────────────
    for (let i = s.enemies.length - 1; i >= 0; i--) {
      const e = s.enemies[i];
      e.y += e.vy;
      // Bullet hits enemy
      for (let j = s.bullets.length - 1; j >= 0; j--) {
        const b = s.bullets[j];
        if (collides(b.x - BULLET_W/2, b.y - BULLET_H, BULLET_W, BULLET_H,
                     e.x - ENEMY_W/2,  e.y - ENEMY_H/2, ENEMY_W, ENEMY_H)) {
          s.bullets.splice(j, 1);
          e.hp--;
          burst(s, e.x, e.y, e.type === 'boss' ? '#d2a6f5' : '#74b9ff');
          if (e.hp <= 0) {
            const pts = e.type === 'boss' ? 500 : 100;
            s.score += pts;
            burst(s, e.x, e.y, '#f39c12');
            s.enemies.splice(i, 1);
            break;
          }
        }
      }
      // Enemy passes bottom
      if (e.y > H + ENEMY_H) {
        s.enemies.splice(i, 1);
        s.lives--;
        if (s.lives <= 0) { gameOver(s); return; }
        setDisplayLives(s.lives);
      }
      // Enemy hits player
      if (s.enemies[i] !== undefined &&
          collides(s.player.x - PLAYER_W/2, s.player.y - PLAYER_H/2, PLAYER_W, PLAYER_H,
                   s.enemies[i].x - ENEMY_W/2, s.enemies[i].y - ENEMY_H/2, ENEMY_W, ENEMY_H)) {
        burst(s, s.player.x, s.player.y, '#d63a3a');
        s.enemies.splice(i, 1);
        s.lives--;
        if (s.lives <= 0) { gameOver(s); return; }
        setDisplayLives(s.lives);
      }
    }

    // ── Move asteroids ────────────────────────────────
    for (let i = s.asteroids.length - 1; i >= 0; i--) {
      const a = s.asteroids[i];
      a.y += a.vy;
      if (a.y > H + a.r) { s.asteroids.splice(i, 1); continue; }
      // Bullet destroys asteroid
      for (let j = s.bullets.length - 1; j >= 0; j--) {
        const b = s.bullets[j];
        const dist = Math.hypot(b.x - a.x, b.y - a.y);
        if (dist < a.r + 4) {
          s.bullets.splice(j, 1);
          burst(s, a.x, a.y, '#bdc3c7');
          s.asteroids.splice(i, 1);
          s.score += 50;
          break;
        }
      }
      // Asteroid hits player
      if (s.asteroids[i] !== undefined) {
        const dist = Math.hypot(s.player.x - a.x, s.player.y - a.y);
        if (dist < a.r + 16) {
          burst(s, s.player.x, s.player.y, '#e74c3c');
          s.asteroids.splice(i, 1);
          s.lives--;
          if (s.lives <= 0) { gameOver(s); return; }
          setDisplayLives(s.lives);
        }
      }
    }

    // ── Particles ─────────────────────────────────────
    for (let i = s.particles.length - 1; i >= 0; i--) {
      const p = s.particles[i];
      p.x += p.vx; p.y += p.vy; p.life -= 0.05;
      if (p.life <= 0) s.particles.splice(i, 1);
    }

    // ── Update score display (throttled) ─────────────
    setDisplayScore(s.score);

    // ── Draw ──────────────────────────────────────────
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#060918';
    ctx.fillRect(0, 0, W, H);

    // Stars
    s.stars.forEach((star) => {
      star.y += star.speed;
      if (star.y > H) { star.y = 0; star.x = Math.random() * W; }
      ctx.globalAlpha = star.alpha;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Asteroids
    s.asteroids.forEach((a) => drawAsteroid(ctx, a.x, a.y, a.r));

    // Enemies
    s.enemies.forEach((e) => drawEnemy(ctx, e.x, e.y, e.type));

    // Bullets
    s.bullets.forEach((b) => drawBullet(ctx, b.x, b.y));

    // Player
    drawPlayer(ctx, s.player.x, s.player.y);

    // Particles
    s.particles.forEach((p) => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    rafRef.current = requestAnimationFrame(tick);
  }, []); // eslint-disable-line

  function gameOver(s) {
    s.running = false;
    cancelAnimationFrame(rafRef.current);
    const coins = Math.floor(s.score / 100) * COINS_PER_100;
    setFinalScore(s.score);
    setFinalCoins(coins);
    setPhase(PHASE.OVER);
  }

  // ── Start / restart ───────────────────────────────────
  function startGame() {
    coinsAwardedRef.current = false;
    const s  = initState();
    stateRef.current = s;
    spawnWave(s);
    lastFireRef.current = 0;
    lastWaveRef.current = performance.now();
    setDisplayScore(0);
    setDisplayLives(INITIAL_LIVES);
    setDisplayWave(1);
    setReviveUsed(false);
    setPhase(PHASE.PLAYING);
    rafRef.current = requestAnimationFrame(tick);
  }

  // ── Revive — restore 1 life, continue ─────────────────
  function handleRevive() {
    const s = stateRef.current;
    if (!s) return;
    s.lives = 1;
    s.running = true;
    setDisplayLives(1);
    setReviveUsed(true);
    setPhase(PHASE.PLAYING);
    rafRef.current = requestAnimationFrame(tick);
  }

  // ── Collect reward ────────────────────────────────────
  function handleCollectReward() {
    if (!coinsAwardedRef.current) {
      earnCoins(finalCoins);
      coinsAwardedRef.current = true;
    }
    setPhase(PHASE.REWARD);
  }

  // ── Cleanup ───────────────────────────────────────────
  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ── Keyboard ──────────────────────────────────────────
  useEffect(() => {
    function down(e) { keysRef.current[e.code] = true; }
    function up(e)   { keysRef.current[e.code] = false; }
    window.addEventListener('keydown', down);
    window.addEventListener('keyup',   up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup',   up);
    };
  }, []);

  // ── Pointer (mouse + touch on canvas) ─────────────────
  function onPointerMove(e) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect   = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    pointerRef.current = (clientX - rect.left) * scaleX;
  }

  function onPointerLeave() { pointerRef.current = null; }

  const coins = Math.floor(finalScore / 100) * COINS_PER_100;

  return (
    <div className={styles.root}>
      <div className={styles.stars} aria-hidden="true" />

      {/* ── HUD Header ── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => navigate('/games')} aria-label="Back to games">← Games</button>
          <h1 className={styles.gameTitle}>Space Shooter</h1>
        </div>
        <div className={styles.hud}>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>Score</span>
            <span className={styles.hudValue}>{displayScore.toLocaleString()}</span>
          </div>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>Wave</span>
            <span className={styles.hudValue}>{displayWave}</span>
          </div>
          <div className={styles.hudItem}>
            <span className={styles.hudLabel}>Lives</span>
            <div className={styles.livesRow} aria-label={`${displayLives} lives`}>
              {Array.from({ length: Math.max(0, displayLives) }, (_, i) => (
                <span key={i} className={styles.lifeIcon} aria-hidden="true">♥</span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── Canvas ── */}
      <div className={styles.canvasWrap}>
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className={styles.canvas}
          onMouseMove={onPointerMove}
          onMouseLeave={onPointerLeave}
          onTouchMove={onPointerMove}
          onTouchEnd={onPointerLeave}
          aria-label="Space Shooter game canvas"
        />
        {phase === PHASE.PLAYING && (
          <div className={styles.touchHint}>Move mouse / drag finger to steer · Auto-fires</div>
        )}
      </div>

      {/* ── IDLE panel ── */}
      {phase === PHASE.IDLE && (
        <div className={styles.overlay}>
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Space Shooter</h2>
            <p className={styles.panelSub}>Destroy enemies · dodge asteroids · survive waves</p>
            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <span className={styles.statVal}>Auto</span>
                <span className={styles.statLbl}>Fire Mode</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statVal}>3</span>
                <span className={styles.statLbl}>Lives</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statVal}>∞</span>
                <span className={styles.statLbl}>Waves</span>
              </div>
            </div>
            <button className={styles.primaryBtn} onClick={startGame}>Launch</button>
            <Link to="/games/space-shooter/home" className={styles.secondaryBtn}>← Back</Link>
          </div>
        </div>
      )}

      {/* ── OVER panel ── */}
      {phase === PHASE.OVER && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Game Over">
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Game Over</h2>
            <p className={styles.panelSub}>Space Shooter</p>
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
            <h2 className={styles.panelTitle}>Revive?</h2>
            <p className={styles.panelSub}>Continue from where you left off — 1 life restored.</p>
            <button className={styles.primaryBtn} onClick={handleRevive}>Yes, Revive</button>
            <button className={styles.secondaryBtn} onClick={() => setPhase(PHASE.OVER)}>No Thanks</button>
          </div>
        </div>
      )}

      {/* ── REWARD panel ── */}
      {phase === PHASE.REWARD && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Reward">
          <div className={styles.panel}>
            <h2 className={styles.panelTitle}>Well Played!</h2>
            <p className={styles.panelSub}>Space Shooter</p>
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
