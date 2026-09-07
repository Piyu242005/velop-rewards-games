import { createContext, useContext, useReducer, useCallback } from 'react';

// ============================================================
// GameCoinContext — Centralised Game Coin economy
// ============================================================
// A single Game Coin balance is shared across all games.
// This prevents per-game balance fragmentation and ensures
// coins earned in Game One are spendable in redemption.
// ============================================================

const GameCoinContext = createContext(null);

// ── Action types ────────────────────────────────────────────
export const COIN_ACTIONS = {
  EARN:  'EARN',
  SPEND: 'SPEND',
  RESET: 'RESET',
  SET:   'SET',
};

// ── Reducer ─────────────────────────────────────────────────
function coinReducer(state, action) {
  switch (action.type) {
    case COIN_ACTIONS.EARN:
      return { ...state, balance: state.balance + action.amount };
    case COIN_ACTIONS.SPEND:
      if (state.balance < action.amount) return state; // guard
      return { ...state, balance: state.balance - action.amount };
    case COIN_ACTIONS.RESET:
      return { ...state, balance: 0 };
    case COIN_ACTIONS.SET:
      return { ...state, balance: action.amount };
    default:
      return state;
  }
}

// ── Provider ────────────────────────────────────────────────
export function GameCoinProvider({ children }) {
  const [state, dispatch] = useReducer(coinReducer, { balance: 0 });

  const earnCoins = useCallback((amount) => {
    dispatch({ type: COIN_ACTIONS.EARN, amount });
  }, []);

  const spendCoins = useCallback((amount) => {
    dispatch({ type: COIN_ACTIONS.SPEND, amount });
  }, []);

  const resetCoins = useCallback(() => {
    dispatch({ type: COIN_ACTIONS.RESET });
  }, []);

  const setCoins = useCallback((amount) => {
    dispatch({ type: COIN_ACTIONS.SET, amount });
  }, []);

  const value = {
    balance: state.balance,
    earnCoins,
    spendCoins,
    resetCoins,
    setCoins,
  };

  return (
    <GameCoinContext.Provider value={value}>
      {children}
    </GameCoinContext.Provider>
  );
}

// ── Consumer hook ───────────────────────────────────────────
export function useGameCoinContext() {
  const ctx = useContext(GameCoinContext);
  if (!ctx) {
    throw new Error('useGameCoinContext must be used inside <GameCoinProvider>');
  }
  return ctx;
}

export default GameCoinContext;
