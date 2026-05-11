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
