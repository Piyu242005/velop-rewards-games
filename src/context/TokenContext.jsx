import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

// ============================================================
// TokenContext — player Token balance (persisted).
// Tokens are the entry currency (20 per game session).
// Demo starting balance is only applied on first visit.
// ============================================================

const TokenContext  = createContext(null);
const LS_KEY        = 'vg_token_balance';
const INITIAL_DEMO  = 200;

function tokenReducer(state, action) {
  switch (action.type) {
    case 'SPEND': return state.balance < action.amount ? state : { ...state, balance: state.balance - action.amount };
    case 'ADD':   return { ...state, balance: state.balance + action.amount };
    case 'SET':   return { ...state, balance: action.amount };
    default:      return state;
  }
}

function loadTokenBalance() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw !== null ? Math.max(0, Number(raw)) : INITIAL_DEMO;
  } catch {
    return INITIAL_DEMO;
  }
}

export function TokenProvider({ children }) {
  const [state, dispatch] = useReducer(tokenReducer, undefined, () => ({
    balance: loadTokenBalance(),
  }));

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, String(state.balance)); } catch {}
  }, [state.balance]);

  const spendTokens = useCallback((amount) => dispatch({ type: 'SPEND', amount }), []);
  const addTokens   = useCallback((amount) => dispatch({ type: 'ADD',   amount }), []);
  const setTokens   = useCallback((amount) => dispatch({ type: 'SET',   amount }), []);
  const canAfford   = useCallback((amount) => state.balance >= amount, [state.balance]);

  return (
    <TokenContext.Provider value={{ tokenBalance: state.balance, spendTokens, addTokens, setTokens, canAfford }}>
      {children}
    </TokenContext.Provider>
  );
}

export function useTokenContext() {
  const ctx = useContext(TokenContext);
  if (!ctx) throw new Error('useTokenContext must be used inside <TokenProvider>');
  return ctx;
}

export default TokenContext;
