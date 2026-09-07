import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

// ============================================================
// GameCoinContext — shared Game Coin economy (persisted).
// Balance survives page refresh via localStorage.
// ============================================================

const GameCoinContext = createContext(null);
const LS_KEY = 'vg_coin_balance';

export const COIN_ACTIONS = {
  EARN:  'EARN',
  SPEND: 'SPEND',
  RESET: 'RESET',
  SET:   'SET',
};

function coinReducer(state, action) {
  switch (action.type) {
    case COIN_ACTIONS.EARN:
      return { ...state, balance: state.balance + action.amount };
    case COIN_ACTIONS.SPEND:
      if (state.balance < action.amount) return state;
      return { ...state, balance: state.balance - action.amount };
    case COIN_ACTIONS.RESET:
      return { ...state, balance: 0 };
    case COIN_ACTIONS.SET:
      return { ...state, balance: action.amount };
    default:
      return state;
  }
}

function loadBalance() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw !== null ? Math.max(0, Number(raw)) : 0;
  } catch {
    return 0;
  }
}

export function GameCoinProvider({ children }) {
  const [state, dispatch] = useReducer(coinReducer, undefined, () => ({
    balance: loadBalance(),
  }));

  // Persist on every change
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, String(state.balance)); } catch {}
  }, [state.balance]);

  const earnCoins  = useCallback((amount) => dispatch({ type: COIN_ACTIONS.EARN,  amount }), []);
  const spendCoins = useCallback((amount) => dispatch({ type: COIN_ACTIONS.SPEND, amount }), []);
  const resetCoins = useCallback(()       => dispatch({ type: COIN_ACTIONS.RESET }), []);
  const setCoins   = useCallback((amount) => dispatch({ type: COIN_ACTIONS.SET,   amount }), []);

  return (
    <GameCoinContext.Provider value={{ balance: state.balance, earnCoins, spendCoins, resetCoins, setCoins }}>
      {children}
    </GameCoinContext.Provider>
  );
}

export function useGameCoinContext() {
  const ctx = useContext(GameCoinContext);
  if (!ctx) throw new Error('useGameCoinContext must be used inside <GameCoinProvider>');
  return ctx;
}

export default GameCoinContext;
