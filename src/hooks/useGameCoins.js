import { useGameCoinContext } from '../context/GameCoinContext';

// ============================================================
// useGameCoins — thin hook wrapper over GameCoinContext
// ============================================================
// Provides a stable, named interface to the coin balance so
// individual game components don't import context directly.
// ============================================================

export default function useGameCoins() {
  const { balance, earnCoins, spendCoins, resetCoins, setCoins } =
    useGameCoinContext();

  return {
    coinBalance: balance,
    earnCoins,
    spendCoins,
    resetCoins,
    setCoins,
  };
}
