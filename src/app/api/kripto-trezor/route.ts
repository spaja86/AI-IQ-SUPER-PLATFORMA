// SpajaUltraOmegaCore -∞Ω+∞ — Kripto Trezor — Info Root
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/kripto-trezor
// Javno dostupan info endpoint — capabilities i status vault skeleton-a.

import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { EXCHANGE_FLAGS } from '@/lib/menjacnica/feature-flags';

export async function GET() {
  const trezorFlags = EXCHANGE_FLAGS.filter((f) => f.id.startsWith('kripto-trezor'));

  return NextResponse.json({
    sistem: 'SPAJA Kripto Trezor',
    appVerzija: APP_VERSION,
    status: 'aktivan',
    opis: 'Institucionalni kripto custody vault — cold storage, multi-sig i time-lock zaštita za sva SPAJA digitalna sredstva.',
    nadovezujeSe: [
      'AI IQ Menjačnica (/api/menjacnica)',
      'AI IQ Pro Novčanik (/api/menjacnica-novcanik)',
      'Poslovni Novčanik (/api/novcanik)',
    ],
    sigurnosniNivoi: [
      { tier: 'hot',       multiSig: '1-of-1', timeLockDays: 0,  minDepozit: 0.001, opis: 'Instant likvidnost' },
      { tier: 'warm',      multiSig: '2-of-3', timeLockDays: 1,  minDepozit: 0.01,  opis: 'Operativna rezerva' },
      { tier: 'cold',      multiSig: '3-of-5', timeLockDays: 3,  minDepozit: 0.1,   opis: 'Strateška rezerva' },
      { tier: 'deep-cold', multiSig: '5-of-7', timeLockDays: 7,  minDepozit: 1.0,   opis: 'Institucioni vault' },
    ],
    endpoints: [
      { metod: 'GET',  putanja: '/api/kripto-trezor/vault-status', opis: 'Vault stanje + security score', auth: true },
      { metod: 'POST', putanja: '/api/kripto-trezor/deposit',      opis: 'Vault depozit (zaključavanje)', auth: true },
      { metod: 'POST', putanja: '/api/kripto-trezor/withdraw',     opis: 'Vault isplata (time-lock + multi-sig)', auth: true },
      { metod: 'GET',  putanja: '/api/kripto-trezor/audit-log',    opis: 'Audit trag događaja i sigurnosnih akcija', auth: true },
      { metod: 'GET',  putanja: '/api/kripto-trezor/security-check', opis: 'Sigurnosni pregled i alerti trezora', auth: true },
      { metod: 'GET',  putanja: '/api/kripto-trezor/policy',         opis: 'Aktivne vault politike: limiti, tierovi i compliance', auth: true },
      { metod: 'GET',  putanja: '/api/kripto-trezor/recovery',       opis: 'Recovery plan: keyholder-i, koraci i hitni kontakti', auth: true },
      { metod: 'GET',  putanja: '/api/kripto-trezor/coverage',       opis: 'Coverage sloj: reserve fund, guarantee i uncovered gap', auth: true },
      { metod: 'GET',  putanja: '/api/kripto-trezor/risk',           opis: 'Risk assessment: tržišni, koncentracijski i likvidnosni rizik', auth: true },
      { metod: 'GET',  putanja: '/api/kripto-trezor/analytics',      opis: 'Analytics i yield: performance po asetu, tier APR i portfolio APR', auth: true },
      { metod: 'GET',  putanja: '/api/kripto-trezor/rebalance',      opis: 'Rebalance prijedlozi: optimalna raspodjela sredstava po tierovima', auth: true },
      { metod: 'GET',  putanja: '/api/kripto-trezor/liquidity',      opis: 'Likvidnost trezora: instant/24h/7d kapacitet isplate i liquidity score', auth: true },
      { metod: 'GET',  putanja: '/api/kripto-trezor/forecast',       opis: 'Performance forecast: bull/base/bear scenariji za odabrani horizont', auth: true },
      { metod: 'GET',  putanja: '/api/kripto-trezor/stress',         opis: 'Stress test izvještaj: tržišni, likvidnosni i custody incident scenariji', auth: true },
      { metod: 'GET',  putanja: '/api/kripto-trezor/resilience',     opis: 'Resilience score: coverage + liquidity + stress + risk mitigacija', auth: true },
      { metod: 'GET',  putanja: '/api/kripto-trezor/benchmark',      opis: 'Benchmark komparacija: vault portfolio vs BTC, ETH i Crypto Market Index', auth: true },
      { metod: 'GET',  putanja: '/api/kripto-trezor/attribution',    opis: 'Attribution analiza: doprinos prinosa po asetu i tieru uz koncentracioni rizik', auth: true },
    ],
    featureFlags: trezorFlags.map((f) => ({
      id: f.id,
      naziv: f.naziv,
      enabled: f.enabled,
      rolloutPct: f.rolloutPct,
    })),
    timestamp: new Date().toISOString(),
  });
}
