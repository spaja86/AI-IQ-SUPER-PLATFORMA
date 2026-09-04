// SpajaUltraOmegaCore -∞Ω+∞ — Unit Testovi za Profesionalni Novčanik
// Kompanija SPAJA — Digitalna Industrija
//
// Pokretanje: npx tsx src/tests/lib/menjacnica-novcanik.test.ts

import {
  calcUnrealizedPnl,
  buildSimulatedPortfolioSummary,
  buildSimulatedOrderbook,
  buildSimulatedTrades,
  buildSettlementStatusReport,
  buildPortfolioSummaryFromRecords,
  buildTradeFeedFromRecords,
  buildSettlementStatusReportFromOrders,
} from '../../lib/menjacnica/pro-novcanik';

// ─── Test Runner ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures: string[] = [];

async function test(name: string, fn: () => void): Promise<void> {
  try {
    fn();
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

function assert(cond: boolean, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function assertClose(a: number, b: number, tolerance = 1e-6, label = ''): void {
  if (Math.abs(a - b) > tolerance) {
    throw new Error(`${label}Expected ~${b}, got ${a} (diff=${Math.abs(a - b)})`);
  }
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

async function runTests(): Promise<void> {

  // ─── calcUnrealizedPnl ─────────────────────────────────────────────────────

  console.log('\n📊 calcUnrealizedPnl');

  await test('pozitivan P&L kad je trenutna cena viša', () => {
    const { pnl, pnlPct } = calcUnrealizedPnl(1, 60_000, 70_000);
    assert(pnl === 10_000, `Očekivan pnl=10000, dobijen ${pnl}`);
    assertClose(pnlPct, 16.666667, 0.01, 'pnlPct ');
  });

  await test('negativan P&L kad je trenutna cena niža', () => {
    const { pnl } = calcUnrealizedPnl(2, 50_000, 40_000);
    assert(pnl === -20_000, `Očekivan pnl=-20000, dobijen ${pnl}`);
  });

  await test('nula P&L kada su cene jednake', () => {
    const { pnl, pnlPct } = calcUnrealizedPnl(5, 100, 100);
    assert(pnl === 0, `Očekivan pnl=0, dobijen ${pnl}`);
    assert(pnlPct === 0, `Očekivan pnlPct=0, dobijen ${pnlPct}`);
  });

  await test('nula P&L kada je avgEntryPrice nula (guard)', () => {
    const { pnl, pnlPct } = calcUnrealizedPnl(10, 0, 1000);
    assert(pnl === 0, `Očekivan pnl=0, dobijen ${pnl}`);
    assert(pnlPct === 0, `Očekivan pnlPct=0, dobijen ${pnlPct}`);
  });

  await test('P&L za SPAJA BTC simulovanu poziciju', () => {
    const { pnl } = calcUnrealizedPnl(2.5, 820_000, 892_500);
    assert(pnl === 181_250, `Očekivan pnl=181250, dobijen ${pnl}`);
  });

  // ─── buildSimulatedPortfolioSummary ───────────────────────────────────────

  console.log('\n💼 buildSimulatedPortfolioSummary');

  await test('vraća portfolio summary za korisnika', () => {
    const summary = buildSimulatedPortfolioSummary('test-user-1');
    assert(summary.userId === 'test-user-1', 'userId ne odgovara');
    assert(Array.isArray(summary.positions), 'positions mora biti niz');
    assert(summary.positions.length > 0, 'mora imati bar jednu poziciju');
  });

  await test('svaka pozicija ima obavezne atribute', () => {
    const summary = buildSimulatedPortfolioSummary('test-user-2');
    for (const p of summary.positions) {
      assert(typeof p.assetId === 'string' && p.assetId.length > 0, `assetId nije string: ${p.assetId}`);
      assert(Number.isFinite(p.available) && p.available >= 0, `available nije validan: ${p.available}`);
      assert(Number.isFinite(p.reserved) && p.reserved >= 0, `reserved nije validan: ${p.reserved}`);
      assert(Number.isFinite(p.total), `total nije validan: ${p.total}`);
      assert(Number.isFinite(p.totalValueUsd), `totalValueUsd nije validan: ${p.totalValueUsd}`);
      assert(Number.isFinite(p.unrealizedPnl), `unrealizedPnl nije validan`);
      assert(Number.isFinite(p.realizedPnl), `realizedPnl nije validan`);
    }
  });

  await test('totalValueUsd je suma pozicija', () => {
    const summary = buildSimulatedPortfolioSummary('test-user-3');
    const sumPositions = summary.positions.reduce((s, p) => s + p.totalValueUsd, 0);
    assertClose(summary.totalValueUsd, sumPositions, 0.01, 'totalValueUsd ');
  });

  await test('totalUnrealizedPnl je suma nerealizovanih P&L', () => {
    const summary = buildSimulatedPortfolioSummary('test-user-4');
    const sumPnl = summary.positions.reduce((s, p) => s + p.unrealizedPnl, 0);
    assertClose(summary.totalUnrealizedPnl, sumPnl, 0.01, 'totalUnrealizedPnl ');
  });

  await test('timestamp je validan ISO 8601', () => {
    const summary = buildSimulatedPortfolioSummary('test-user-5');
    assert(!isNaN(Date.parse(summary.timestamp)), `timestamp nije validan: ${summary.timestamp}`);
  });

  // ─── buildSimulatedOrderbook ──────────────────────────────────────────────

  console.log('\n📒 buildSimulatedOrderbook');

  await test('vraća orderbook za aktivan par BTC_USDT', () => {
    const ob = buildSimulatedOrderbook('BTC_USDT', 5);
    assert(ob !== null, 'orderbook ne sme biti null za BTC_USDT');
    assert(ob!.pairId === 'BTC_USDT', `pairId nije BTC_USDT: ${ob!.pairId}`);
  });

  await test('bids i asks imaju tačan broj nivoa', () => {
    const depth = 5;
    const ob = buildSimulatedOrderbook('ETH_USDT', depth);
    assert(ob !== null, 'orderbook ne sme biti null');
    assert(ob!.bids.length === depth, `bids.length=${ob!.bids.length}, očekivano=${depth}`);
    assert(ob!.asks.length === depth, `asks.length=${ob!.asks.length}, očekivano=${depth}`);
  });

  await test('bid cene su niže od ask cena', () => {
    const ob = buildSimulatedOrderbook('BTC_USDT', 3);
    assert(ob !== null, 'orderbook ne sme biti null');
    const topBid = ob!.bids[0].price;
    const topAsk = ob!.asks[0].price;
    assert(topBid < topAsk, `topBid(${topBid}) mora biti manji od topAsk(${topAsk})`);
  });

  await test('spreadAbsolute je razlika prvog ask i prvog bid', () => {
    const ob = buildSimulatedOrderbook('BTC_USDT', 5);
    assert(ob !== null, 'orderbook ne sme biti null');
    const expectedSpread = ob!.asks[0].price - ob!.bids[0].price;
    assertClose(ob!.spreadAbsolute, expectedSpread, 1e-4, 'spreadAbsolute ');
  });

  await test('vraća null za nepostojeći par', () => {
    const ob = buildSimulatedOrderbook('NEPOSTOJI_USDT', 5);
    assert(ob === null, 'mora vratiti null za nepostojeći par');
  });

  await test('bids total je kumulativni', () => {
    const ob = buildSimulatedOrderbook('BTC_USDT', 3);
    assert(ob !== null, 'orderbook ne sme biti null');
    let cumulative = 0;
    for (const level of ob!.bids) {
      cumulative += level.qty;
      assertClose(level.total, cumulative, 1e-6, 'bids[total] ');
    }
  });

  // ─── buildSimulatedTrades ─────────────────────────────────────────────────

  console.log('\n⚡ buildSimulatedTrades');

  await test('vraća tačan broj trade-ova', () => {
    const trades = buildSimulatedTrades('BTC_USDT', 15);
    assert(trades.length === 15, `Očekivano 15, dobijeno ${trades.length}`);
  });

  await test('svi trade-ovi imaju obavezne atribute', () => {
    const trades = buildSimulatedTrades('ETH_USDT', 5);
    for (const t of trades) {
      assert(typeof t.id === 'string' && t.id.length > 0, 'id mora biti string');
      assert(t.pairId === 'ETH_USDT', `pairId nije ETH_USDT: ${t.pairId}`);
      assert(t.side === 'buy' || t.side === 'sell', `side mora biti buy/sell: ${t.side}`);
      assert(t.price > 0, `price mora biti pozitivan: ${t.price}`);
      assert(t.qty > 0, `qty mora biti pozitivan: ${t.qty}`);
      assert(Number.isFinite(t.valueUsd), `valueUsd mora biti finite: ${t.valueUsd}`);
    }
  });

  await test('trade-ovi su sortirani po vremenu opadajuće (najnoviji prvi)', () => {
    const trades = buildSimulatedTrades('BTC_USDT', 10);
    for (let i = 1; i < trades.length; i++) {
      assert(
        trades[i - 1].timestamp >= trades[i].timestamp,
        `Trade ${i - 1} mora biti noviji od ${i}`,
      );
    }
  });

  await test('vraća prazan niz za nepostojeći par', () => {
    const trades = buildSimulatedTrades('NEPOSTOJI_EUR', 10);
    assert(trades.length === 0, 'mora vratiti prazan niz za nepostojeći par');
  });

  // ─── buildSettlementStatusReport ─────────────────────────────────────────

  console.log('\n✅ buildSettlementStatusReport');

  await test('vraća report za korisnika', () => {
    const report = buildSettlementStatusReport('test-user-6');
    assert(report.userId === 'test-user-6', 'userId ne odgovara');
    assert(Array.isArray(report.pairs), 'pairs mora biti niz');
    assert(report.pairs.length > 0, 'mora imati bar jedan par');
  });

  await test('svaki par ima obavezne atribute', () => {
    const report = buildSettlementStatusReport('test-user-7');
    for (const p of report.pairs) {
      assert(typeof p.pairId === 'string', 'pairId mora biti string');
      assert(typeof p.baseAssetId === 'string', 'baseAssetId mora biti string');
      assert(typeof p.quoteAssetId === 'string', 'quoteAssetId mora biti string');
      assert(Number.isFinite(p.openOrdersCount), 'openOrdersCount mora biti broj');
      assert(Number.isFinite(p.pendingSettlementCount), 'pendingSettlementCount mora biti broj');
      const validStatuses = ['settled', 'pending', 'processing', 'failed'];
      assert(validStatuses.includes(p.status), `status nije validan: ${p.status}`);
    }
  });

  await test('totalOpenOrders je suma open naloga po parovima', () => {
    const report = buildSettlementStatusReport('test-user-8');
    const sum = report.pairs.reduce((s, p) => s + p.openOrdersCount, 0);
    assert(report.totalOpenOrders === sum, `totalOpenOrders=${report.totalOpenOrders}, suma=${sum}`);
  });

  await test('totalPendingSettlement je suma pending poravnanja', () => {
    const report = buildSettlementStatusReport('test-user-9');
    const sum = report.pairs.reduce((s, p) => s + p.pendingSettlementCount, 0);
    assert(report.totalPendingSettlement === sum, `totalPendingSettlement=${report.totalPendingSettlement}, suma=${sum}`);
  });

  await test('allSettled je true samo kad nema pending poravnanja', () => {
    const report = buildSettlementStatusReport('test-user-10');
    const expectedAllSettled = report.totalPendingSettlement === 0;
    assert(report.allSettled === expectedAllSettled, `allSettled=${report.allSettled}, očekivano=${expectedAllSettled}`);
  });

  // ─── buildPortfolioSummaryFromRecords ─────────────────────────────────────

  console.log('\n🗃️ buildPortfolioSummaryFromRecords');

  await test('gradi portfolio iz realnih account/trade zapisa', () => {
    const summary = buildPortfolioSummaryFromRecords(
      'db-user-1',
      [
        {
          id: 'acc-btc',
          user_id: 'db-user-1',
          asset_id: 'BTC',
          available: 0.5,
          reserved: 0.1,
          total: 0.6,
          kyc_tier: 'verified',
          enabled: true,
          created_at: '2026-01-01T00:00:00.000Z',
          updated_at: '2026-01-01T00:00:00.000Z',
        },
        {
          id: 'acc-usdt',
          user_id: 'db-user-1',
          asset_id: 'USDT',
          available: 1000,
          reserved: 250,
          total: 1250,
          kyc_tier: 'verified',
          enabled: true,
          created_at: '2026-01-01T00:00:00.000Z',
          updated_at: '2026-01-01T00:00:00.000Z',
        },
      ],
      [
        {
          id: 'tr-1',
          order_id: 'ord-1',
          pair_id: 'BTC_USDT',
          user_id: 'db-user-1',
          side: 'buy',
          qty: 0.75,
          price: 60000,
          fee: 90,
          fee_asset_id: 'USDT',
          simulation_mode: false,
          created_at: '2026-01-02T00:00:00.000Z',
        },
        {
          id: 'tr-2',
          order_id: 'ord-2',
          pair_id: 'BTC_USDT',
          user_id: 'db-user-1',
          side: 'sell',
          qty: 0.15,
          price: 70000,
          fee: 21,
          fee_asset_id: 'USDT',
          simulation_mode: false,
          created_at: '2026-01-03T00:00:00.000Z',
        },
      ],
    );

    assert(summary.dataSource === 'database', `dataSource treba biti database, dobijeno ${summary.dataSource}`);
    assert(summary.positions.length === 2, `očekivane 2 pozicije, dobijeno ${summary.positions.length}`);
    const btc = summary.positions.find((p) => p.assetId === 'BTC');
    assert(!!btc, 'BTC pozicija mora postojati');
    assert((btc?.avgEntryPriceUsd ?? 0) > 0, 'avgEntryPriceUsd mora biti > 0');
    assert(Number.isFinite(btc?.realizedPnl ?? NaN), 'realizedPnl mora biti finite');
    assert((btc?.realizedPnl ?? 0) > 0, 'realizedPnl mora biti pozitivan posle profitabilne prodaje');
  });

  await test('vraća prazan database-empty portfolio kada nema računa', () => {
    const summary = buildPortfolioSummaryFromRecords('db-user-2', [], []);
    assert(summary.dataSource === 'database-empty', 'portfolio mora biti database-empty');
    assert(summary.positions.length === 0, 'positions mora biti prazan niz');
    assert(summary.totalValueUsd === 0, 'totalValueUsd mora biti 0');
  });

  // ─── buildTradeFeedFromRecords ─────────────────────────────────────────────

  console.log('\n🧾 buildTradeFeedFromRecords');

  await test('sortira trade-ove opadajuće i računa USD vrednost', () => {
    const trades = buildTradeFeedFromRecords([
      {
        id: 'tr-a',
        order_id: 'ord-a',
        pair_id: 'ETH_USDT',
        user_id: 'db-user-3',
        side: 'buy',
        qty: 2,
        price: 3000,
        fee: 12,
        fee_asset_id: 'USDT',
        simulation_mode: false,
        created_at: '2026-02-01T10:00:00.000Z',
      },
      {
        id: 'tr-b',
        order_id: 'ord-b',
        pair_id: 'ETH_USDT',
        user_id: 'db-user-3',
        side: 'sell',
        qty: 1,
        price: 3100,
        fee: 6.2,
        fee_asset_id: 'USDT',
        simulation_mode: false,
        created_at: '2026-02-01T11:00:00.000Z',
      },
    ]);

    assert(trades.length === 2, 'očekivana su 2 trade-a');
    assert(trades[0].id === 'tr-b', 'najnoviji trade mora biti prvi');
    assert(Number.isFinite(trades[0].valueUsd) && trades[0].valueUsd > 0, 'valueUsd mora biti pozitivan');
  });

  // ─── buildSettlementStatusReportFromOrders ────────────────────────────────

  console.log('\n📦 buildSettlementStatusReportFromOrders');

  await test('agregira open i pending settlement iz realnih ordera', () => {
    const report = buildSettlementStatusReportFromOrders('db-user-4', [
      {
        id: 'ord-open',
        idempotency_key: null,
        user_id: 'db-user-4',
        pair_id: 'BTC_USDT',
        side: 'buy',
        tip: 'limit',
        qty: 1,
        price: 65000,
        filled_qty: 0,
        avg_fill_price: null,
        fee_asset_id: 'USDT',
        fee_total: 65,
        status: 'open',
        simulation_mode: false,
        reject_reason: null,
        aml_score: 10,
        risk_flags: [],
        metadata: { wallet: { settlementStatus: 'processing' } },
        created_at: '2026-03-01T09:00:00.000Z',
        updated_at: '2026-03-01T09:00:00.000Z',
        expires_at: null,
      },
      {
        id: 'ord-filled-pending',
        idempotency_key: null,
        user_id: 'db-user-4',
        pair_id: 'BTC_USDT',
        side: 'buy',
        tip: 'market',
        qty: 0.5,
        price: null,
        filled_qty: 0.5,
        avg_fill_price: 67000,
        fee_asset_id: 'USDT',
        fee_total: 67,
        status: 'filled',
        simulation_mode: false,
        reject_reason: null,
        aml_score: 5,
        risk_flags: [],
        metadata: { wallet: { settlementStatus: 'pending' } },
        created_at: '2026-03-01T10:00:00.000Z',
        updated_at: '2026-03-01T10:00:00.000Z',
        expires_at: null,
      },
      {
        id: 'ord-filled-settled',
        idempotency_key: null,
        user_id: 'db-user-4',
        pair_id: 'ETH_USDT',
        side: 'sell',
        tip: 'market',
        qty: 1,
        price: null,
        filled_qty: 1,
        avg_fill_price: 3200,
        fee_asset_id: 'USDT',
        fee_total: 6.4,
        status: 'filled',
        simulation_mode: false,
        reject_reason: null,
        aml_score: 2,
        risk_flags: [],
        metadata: { wallet: { settlementStatus: 'settled' } },
        created_at: '2026-03-01T11:00:00.000Z',
        updated_at: '2026-03-01T11:30:00.000Z',
        expires_at: null,
      },
    ]);

    const btc = report.pairs.find((p) => p.pairId === 'BTC_USDT');
    assert(!!btc, 'BTC_USDT status mora postojati');
    assert(btc?.openOrdersCount === 1, `očekivan openOrdersCount=1, dobijeno ${btc?.openOrdersCount}`);
    assert(btc?.pendingSettlementCount === 1, `očekivan pendingSettlementCount=1, dobijeno ${btc?.pendingSettlementCount}`);
    assert(report.totalOpenOrders >= 1, 'ukupan broj open ordera mora biti >= 1');
    assert(report.totalPendingSettlement >= 1, 'ukupan broj pending settlement-a mora biti >= 1');
    assert(report.dataSource === 'database', 'report mora biti database');
  });

  // ─── Rezime ──────────────────────────────────────────────────────────────

  console.log(`\n─── Profesionalni Novčanik: ${passed} prošlo, ${failed} palo ───`);
  if (failures.length > 0) {
    console.error('\nNeuspeli testovi:');
    failures.forEach((f) => console.error(`  - ${f}`));
  }

  if (failed > 0) process.exit(1);
}

runTests().catch((e) => {
  console.error('Fatalna greška u test suite:', e);
  process.exit(1);
});
