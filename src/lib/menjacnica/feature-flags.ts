// SpajaUltraOmegaCore -∞Ω+∞ — Exchange Feature Flags
// Kompanija SPAJA — Digitalna Industrija
//
// Kontroliše staged rollout modula za menjačnicu i novčanik.
// Svaki flag se može uključiti/isključiti bez deployment-a (config change).

export interface ExchangeFlag {
  id: string;
  naziv: string;
  opis: string;
  enabled: boolean;
  rolloutPct: number;
  activeFrom?: string;
}

export const EXCHANGE_FLAGS: ExchangeFlag[] = [
  // ─── M1: Read-only market data ──────────────────────────────────────────────
  {
    id: 'exchange-market-data',
    naziv: 'Market Data (Tickers / Quotes)',
    opis: 'Simulovani real-time tickeri i quote API-ji za sve parove',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  // ─── M2: Wallet ledger core ─────────────────────────────────────────────────
  {
    id: 'novcanik-accounts',
    naziv: 'Poslovni Novčanik — Nalozi i Stanja',
    opis: 'Wallet account kreiranje, balansi, ledger istorija',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  {
    id: 'novcanik-deposit',
    naziv: 'Poslovni Novčanik — Depoziti',
    opis: 'Depozitni tokovi sa AML screening-om',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  // ─── M3: Order lifecycle ────────────────────────────────────────────────────
  {
    id: 'exchange-orders',
    naziv: 'Menjačnica — Order Lifecycle (Simulacioni Mode)',
    opis: 'Kreiranje, praćenje i otkazivanje naloga u simulation mode-u',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  // ─── M4: SPAJA BTC ──────────────────────────────────────────────────────────
  {
    id: 'spaja-btc',
    naziv: 'SPAJA Bitkoin',
    opis: 'SPAJA BTC ekskluzivni par — kontrolisana dostupnost',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  // ─── M5: Withdrawals ────────────────────────────────────────────────────────
  {
    id: 'novcanik-withdraw',
    naziv: 'Poslovni Novčanik — Povlačenja',
    opis: 'Withdrawal zahtevi sa KYC tier provjerom i AML screening-om',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  // ─── M6: Live execution (disabled until Phase B+) ───────────────────────────
  {
    id: 'exchange-live-execution',
    naziv: 'Menjačnica — Live Izvršenje Naloga',
    opis: 'Pravo izvršenje naloga putem eksternih exchange-ova (Faza B+)',
    enabled: false,
    rolloutPct: 0,
  },
  // ─── P1-P4: Profesionalni Novčanik skeleton ──────────────────────────────────
  {
    id: 'pro-novcanik-portfolio',
    naziv: 'Pro Novčanik — Portfolio & P&L',
    opis: 'Portfolio ekspozicija i P&L per user, VWAP prosečna ulazna cena',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  {
    id: 'pro-novcanik-orderbook',
    naziv: 'Pro Novčanik — Orderbook Snapshot',
    opis: 'Simulovani orderbook snapshot (bid/ask nivoi) za sve aktivne parove',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  {
    id: 'pro-novcanik-trades',
    naziv: 'Pro Novčanik — Recent Trades Feed',
    opis: 'Simulovani feed poslednjih trade-ova po paru',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  {
    id: 'pro-novcanik-settlement',
    naziv: 'Pro Novčanik — Settlement Status',
    opis: 'Agregat settlement statusa po svim aktivnim parovima',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  {
    id: 'kripto-trezor-vault-status',
    naziv: 'Kripto Trezor — Vault Status',
    opis: 'Vault stanje, security score i detalji po tieru (hot/warm/cold/deep-cold)',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  {
    id: 'kripto-trezor-deposit',
    naziv: 'Kripto Trezor — Vault Depozit',
    opis: 'Zaključavanje sredstava u vault (simulovano, sa potvrdama)',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  {
    id: 'kripto-trezor-withdraw',
    naziv: 'Kripto Trezor — Vault Isplata',
    opis: 'Inicijacija vault isplate — time-lock + multi-sig protokol',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  {
    id: 'kripto-trezor-audit-log',
    naziv: 'Kripto Trezor — Audit Log',
    opis: 'Audit trag događaja za depozite, isplate, whitelist i sigurnosne provere',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
];

const FLAG_MAP = new Map<string, ExchangeFlag>(
  EXCHANGE_FLAGS.map((f) => [f.id, f]),
);

export function isExchangeFlagEnabled(id: string): boolean {
  return FLAG_MAP.get(id)?.enabled ?? false;
}

export function getExchangeFlag(id: string): ExchangeFlag | undefined {
  return FLAG_MAP.get(id);
}
