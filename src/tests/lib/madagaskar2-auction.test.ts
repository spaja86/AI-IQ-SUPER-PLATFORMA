// SpajaUltraOmegaCore -∞Ω+∞ — MADAGASKAR 2 Auction Tests
// Kompanija SPAJA — Digitalna Industrija

import { getLot, listLots, placeBid, closeLot, getAuctionStats } from '../../lib/madagaskar-2/auction';
import { _resetLots } from '../../lib/madagaskar-2/auction';

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => Promise<void> | void): Promise<void> {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`  ❌ ${name}`);
    console.error(`     ${msg}`);
    failed++;
    failures.push(`${name}: ${msg}`);
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

async function runTests(): Promise<void> {
  _resetLots();

  // ─── List lots ────────────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar2/auction] listLots');

  await test('listLots returns all lots', () => {
    const lots = listLots();
    assert(lots.length > 0, 'Should return at least one lot');
  });

  await test('listLots filtered by open returns only open lots', () => {
    const open = listLots('open');
    assert(open.every((l) => l.status === 'open'), 'All returned lots must be open');
  });

  await test('listLots filtered by closed returns only closed lots', () => {
    const closed = listLots('closed');
    assert(closed.every((l) => l.status === 'closed'), 'All returned lots must be closed');
  });

  // ─── getLot ───────────────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar2/auction] getLot');

  await test('getLot returns lot for known id', () => {
    const lot = getLot('lot-mdg-sapphire-001');
    assert(lot !== undefined, 'Lot should exist');
    assert(lot!.goodId === 'mdg-sapphire-001', 'goodId mismatch');
  });

  await test('getLot returns undefined for unknown id', () => {
    assert(getLot('non-existent-lot') === undefined, 'Unknown lot should return undefined');
  });

  // ─── placeBid — successful ─────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar2/auction] placeBid — success');

  await test('placeBid accepts first bid above reserve', () => {
    _resetLots();
    const result = placeBid({
      lotId: 'lot-mdg-sapphire-001',
      bidderSegment: 'business',
      bidAmountCents: 90000,
      currency: 'EUR',
    });
    assert(result.accepted, `Bid should be accepted: ${result.warnings.join('; ')}`);
    assert(result.newCurrentBidCents === 90000, 'New current bid should be 90000');
    assert(!result.outbid, 'Should not be outbid');
  });

  await test('placeBid updates bid count', () => {
    _resetLots();
    const before = getLot('lot-mdg-sapphire-001')!.bidCount;
    placeBid({ lotId: 'lot-mdg-sapphire-001', bidderSegment: 'business', bidAmountCents: 95000, currency: 'EUR' });
    const after = getLot('lot-mdg-sapphire-001')!.bidCount;
    assert(after === before + 1, `bidCount should increment by 1 (was ${before}, now ${after})`);
  });

  await test('placeBid accepts higher bid than current', () => {
    _resetLots();
    placeBid({ lotId: 'lot-mdg-lemur-resin-001', bidderSegment: 'business', bidAmountCents: 130000, currency: 'EUR' });
    const result = placeBid({ lotId: 'lot-mdg-lemur-resin-001', bidderSegment: 'consumer', bidAmountCents: 135000, currency: 'EUR' });
    assert(result.accepted, 'Higher bid should be accepted');
    assert(result.newCurrentBidCents === 135000, 'Current bid should update');
  });

  // ─── placeBid — rejection scenarios ───────────────────────────────────────

  console.log('\n🔎 [madagaskar2/auction] placeBid — rejection');

  await test('placeBid rejects bid below reserve', () => {
    _resetLots();
    const result = placeBid({ lotId: 'lot-mdg-sapphire-001', bidderSegment: 'business', bidAmountCents: 50000, currency: 'EUR' });
    assert(!result.accepted, 'Bid below reserve should be rejected');
    assert(result.warnings.length > 0, 'Should have a warning');
  });

  await test('placeBid rejects bid equal to current bid (not strictly greater)', () => {
    _resetLots();
    const result = placeBid({ lotId: 'lot-mdg-lemur-resin-001', bidderSegment: 'business', bidAmountCents: 125000, currency: 'EUR' });
    assert(!result.accepted, 'Bid equal to current should be rejected');
    assert(result.outbid, 'Should flag outbid');
  });

  await test('placeBid rejects bid on closed lot', () => {
    _resetLots();
    const result = placeBid({ lotId: 'lot-ocn-black-pearl-001', bidderSegment: 'business', bidAmountCents: 80000, currency: 'USD' });
    assert(!result.accepted, 'Bidding on closed lot should fail');
    assert(result.warnings[0].includes('not open'), `Expected "not open" in warning, got: ${result.warnings[0]}`);
  });

  await test('placeBid rejects unknown lot', () => {
    const result = placeBid({ lotId: 'unknown-lot', bidderSegment: 'business', bidAmountCents: 10000, currency: 'EUR' });
    assert(!result.accepted, 'Unknown lot should be rejected');
    assert(result.warnings[0].includes('Unknown lot'), `Expected "Unknown lot" in warning`);
  });

  await test('placeBid rejects mismatched currency', () => {
    _resetLots();
    const result = placeBid({ lotId: 'lot-mdg-sapphire-001', bidderSegment: 'business', bidAmountCents: 90000, currency: 'USD' });
    assert(!result.accepted, 'Mismatched currency should be rejected');
    assert(result.warnings.some((w) => w.includes('currency')), 'Should warn about currency mismatch');
  });

  await test('placeBid rejects non-finite bidAmount', () => {
    _resetLots();
    const result = placeBid({ lotId: 'lot-mdg-sapphire-001', bidderSegment: 'business', bidAmountCents: NaN, currency: 'EUR' });
    assert(!result.accepted, 'NaN bid should be rejected');
  });

  // ─── closeLot ─────────────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar2/auction] closeLot');

  await test('closeLot marks lot as closed', () => {
    _resetLots();
    closeLot('lot-mdg-sapphire-001');
    const lot = getLot('lot-mdg-sapphire-001')!;
    assert(lot.status === 'closed', `Expected closed, got ${lot.status}`);
  });

  // ─── getAuctionStats ───────────────────────────────────────────────────────

  console.log('\n🔎 [madagaskar2/auction] getAuctionStats');

  await test('getAuctionStats returns correct counts', () => {
    _resetLots();
    const stats = getAuctionStats();
    assert(typeof stats.total === 'number', 'total must be number');
    assert(stats.total === stats.open + stats.closed + stats.cancelled, 'counts must sum to total');
  });
}

runTests().then(() => {
  console.log(`\n${'─'.repeat(50)}`);
  console.log(`Total: ${passed + failed} | ✅ Passed: ${passed} | ❌ Failed: ${failed}`);
  if (failures.length > 0) {
    console.error('\nFailed tests:');
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  }
});
