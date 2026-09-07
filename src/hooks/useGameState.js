import { useState, useCallback } from 'react';

// ============================================================
// useGameState — manages the lifecycle state of a single game
// session (idle → paying → guide → playing → over → reward).
// ============================================================

export const GAME_PHASES = {
  IDLE:    'IDLE',    // on Game Home, before paying
  PAYING:  'PAYING',  // token deduction in progress
  GUIDE:   'GUIDE',   // reading the game guide
  PLAYING: 'PLAYING', // active gameplay
  OVER:    'OVER',    // game over screen
  REVIVE:  'REVIVE',  // revive modal open
  REWARD:  'REWARD',  // reward / coins awarded screen
};

export default function useGameState(initialPhase = GAME_PHASES.IDLE) {
  const [phase, setPhase]         = useState(initialPhase);
  const [score, setScore]         = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [reviveUsed, setReviveUsed]   = useState(false);

  const startPaying = useCallback(() => setPhase(GAME_PHASES.PAYING), []);
  const showGuide   = useCallback(() => setPhase(GAME_PHASES.GUIDE),   []);
  const startPlay   = useCallback(() => setPhase(GAME_PHASES.PLAYING), []);

  const endGame = useCallback((finalScore = 0, coins = 0) => {
    setScore(finalScore);
    setCoinsEarned(coins);
    setPhase(GAME_PHASES.OVER);
  }, []);

  const openRevive = useCallback(() => setPhase(GAME_PHASES.REVIVE),  []);

  const applyRevive = useCallback(() => {
    setReviveUsed(true);
    setPhase(GAME_PHASES.PLAYING);
  }, []);

  const showReward = useCallback((coins = 0) => {
    setCoinsEarned((prev) => prev + coins);
    setPhase(GAME_PHASES.REWARD);
  }, []);

  const resetGame = useCallback(() => {
    setPhase(GAME_PHASES.IDLE);
    setScore(0);
    setCoinsEarned(0);
    setReviveUsed(false);
  }, []);

  return {
    phase,
    score,
    coinsEarned,
    reviveUsed,
    startPaying,
    showGuide,
    startPlay,
    endGame,
    openRevive,
    applyRevive,
    showReward,
    resetGame,
  };
}
