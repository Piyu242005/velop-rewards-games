import test from 'node:test';
import assert from 'node:assert/strict';
import { canRedeem, getRedemptionTotal, REDEEM_OPTIONS } from './redemption.js';

const find = (id) => REDEEM_OPTIONS.find((option) => option.id === id);

test('redemption rules', async (t) => {
  await t.test('supports all five reward types', () => {
    assert.deepEqual(
      REDEEM_OPTIONS.map(({ id }) => id),
      ['ve', 'sve', 'gems', 'tokens', 'spins'],
    );
  });

  await t.test('calculates quantity totals', () => {
    assert.equal(getRedemptionTotal(find('tokens'), 3), 600);
    assert.equal(getRedemptionTotal(find('gems'), 2), 200);
  });

  await t.test('guards invalid quantities at one unit', () => {
    assert.equal(getRedemptionTotal(find('ve'), 0), 500);
    assert.equal(getRedemptionTotal(find('ve'), -4), 500);
  });

  await t.test('checks sufficient and insufficient balances', () => {
    assert.equal(canRedeem(800, 800), true);
    assert.equal(canRedeem(799, 800), false);
  });
});
