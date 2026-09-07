import { canRedeem, getRedemptionTotal, REDEEM_OPTIONS } from './redemption';

const find = (id) => REDEEM_OPTIONS.find((option) => option.id === id);

describe('redemption rules', () => {
  test('supports all five reward types', () => {
    expect(REDEEM_OPTIONS.map(({ id }) => id)).toEqual(['ve', 'sve', 'gems', 'tokens', 'spins']);
  });

  test('calculates quantity totals', () => {
    expect(getRedemptionTotal(find('tokens'), 3)).toBe(600);
    expect(getRedemptionTotal(find('gems'), 2)).toBe(200);
  });

  test('guards invalid quantities at one unit', () => {
    expect(getRedemptionTotal(find('ve'), 0)).toBe(500);
    expect(getRedemptionTotal(find('ve'), -4)).toBe(500);
  });

  test('checks sufficient and insufficient balances', () => {
    expect(canRedeem(800, 800)).toBe(true);
    expect(canRedeem(799, 800)).toBe(false);
  });
});
