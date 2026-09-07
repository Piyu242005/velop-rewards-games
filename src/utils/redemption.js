export const REDEEM_OPTIONS = [
  { id: 've', label: 'VE', description: 'VELOOP native tokens', costPerUnit: 500, unit: 'VE' },
  { id: 'sve', label: 'SVE', description: 'Staked VELOOP tokens', costPerUnit: 800, unit: 'SVE' },
  { id: 'gems', label: 'Gems', description: 'In-app gem currency', costPerUnit: 100, unit: 'Gem' },
  { id: 'tokens', label: 'Tokens', description: 'Game entry tokens', costPerUnit: 200, unit: 'Token' },
  { id: 'spins', label: 'Spins', description: 'Lucky wheel spins', costPerUnit: 150, unit: 'Spin' },
];

export function getRedemptionTotal(option, qty) {
  const safeQty = Math.max(1, Math.floor(Number(qty) || 1));
  return option.costPerUnit * safeQty;
}

export function canRedeem(balance, total) {
  return Number(balance) >= Number(total);
}
