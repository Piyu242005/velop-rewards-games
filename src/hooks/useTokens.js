import { useTokenContext } from '../context/TokenContext';

// Thin named wrapper so game components don't import context directly.
export default function useTokens() {
  return useTokenContext();
}
