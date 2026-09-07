import { createContext, useContext, useReducer, useCallback } from 'react';

// ============================================================
// TokenContext — player's spendable Token balance.
// Tokens are the entry currency (20 per game session).
// Starting with a demo balance so the flow is testable.
// ============================================================

const TokenContext = createContext(null);

const INITIAL_BALANCE = 200; // demo starting balance

function tokenReducer(state, action) {
  switch (action.type) {
    case 'SPEND':
      if (state.balance < action.amount) return state;
      return { ...state, balance: state.balance - action.amount };
    case 'ADD':
      return { ...state, balance: state.balance + action.amount };
    case 'SET':
      return { ...state, balance: action.amount };
    default:
      return state;
  }
}

export function TokenProvider({ children }) {
  const [state, dispatch] = useReducer(tokenReducer, { balance: INITIAL_BALANCE });

  const spendTokens  = useCallback((amount) => dispatch({ type: 'SPEND', amount }), []);
  const addTokens    = useCallback((amount) => dispatch({ type: 'ADD',   amount }), []);
  const setTokens    = useCallback((amount) => dispatch({ type: 'SET',   amount }), []);
  const canAfford    = useCallback((amount) => state.balance >= amount, [state.balance]);

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
