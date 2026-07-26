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
  // ─── M3+: Max order value enforcement (disabled until KYC profil bude dostupan) ──
  {
    id: 'exchange-max-order-value',
    naziv: 'Menjačnica — Maksimalni Iznos Ordrea (KYC tier)',
    opis: 'Blokira ordere čija USD vrednost prelazi limit za dati KYC tier korisnika. Aktivira se kada user_profiles.kyc_tier bude dostupan u toku narudžbe.',
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
  {
    id: 'kripto-trezor-security-check',
    naziv: 'Kripto Trezor — Security Check',
    opis: 'Agregovani sigurnosni pregled trezora sa alertima i preporukama',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  {
    id: 'kripto-trezor-policy',
    naziv: 'Kripto Trezor — Vault Policy',
    opis: 'Pregled aktivnih vault politika: limiti, tierovi, whitelist i compliance pravila',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  {
    id: 'kripto-trezor-recovery',
    naziv: 'Kripto Trezor — Vault Recovery Plan',
    opis: 'Plan oporavka vault-a: čuvari ključa, koraci oporavka i kontakti za hitne slučajeve',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  {
    id: 'kripto-trezor-coverage',
    naziv: 'Kripto Trezor — Vault Coverage',
    opis: 'Pregled coverage sloja: reserve fund, bank guarantee, insurance i uncovered gap analiza',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  {
    id: 'kripto-trezor-risk',
    naziv: 'Kripto Trezor — Vault Risk Assessment',
    opis: 'Procjena tržišnog, koncentracijskog, likvidnosnog i custody rizika vault portfolia',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  {
    id: 'kripto-trezor-analytics',
    naziv: 'Kripto Trezor — Vault Analytics',
    opis: 'Analytics i yield izvještaj: performance po asetu, tier APR, prinos i portfolio ukupni APR',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  {
    id: 'kripto-trezor-rebalance',
    naziv: 'Kripto Trezor — Vault Rebalance',
    opis: 'Rebalance prijedlozi za optimalnu raspodjelu sredstava po tierovima prema ciljnoj alokaciji',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  {
    id: 'kripto-trezor-forecast',
    naziv: 'Kripto Trezor — Vault Forecast',
    opis: 'Performance forecast trezora: bull/base/bear scenariji za 30d/90d/180d/365d horizont',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  {
    id: 'kripto-trezor-stress',
    naziv: 'Kripto Trezor — Vault Stress',
    opis: 'Stress test izvještaj: flash-crash, liquidity freeze i custody incident scenariji sa resilience score-om',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  {
    id: 'kripto-trezor-resilience',
    naziv: 'Kripto Trezor — Vault Resilience',
    opis: 'Objedinjeni resilience score iz coverage, liquidity, stress i risk signala sa hardening preporukama',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  {
    id: 'kripto-trezor-benchmark',
    naziv: 'Kripto Trezor — Vault Benchmark',
    opis: 'Benchmark komparacija: vault portfolio vs BTC, ETH i Crypto Market Index sa alpha metrikama',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  {
    id: 'kripto-trezor-attribution',
    naziv: 'Kripto Trezor — Vault Attribution',
    opis: 'Attribution analiza: doprinos prinosa po asetu i tieru, uz koncentracioni rizik',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  {
    id: 'kripto-trezor-exposure',
    naziv: 'Kripto Trezor — Vault Exposure',
    opis: 'Exposure analiza: raspodjela izloženosti po asetu i tieru sa fokusom na koncentraciju i likvidnost',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  {
    id: 'kripto-trezor-allocation',
    naziv: 'Kripto Trezor — Vault Allocation',
    opis: 'Allocation analiza: trenutna vs ciljana raspodjela po asetu i tieru uz preporučeni shift',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  {
    id: 'kripto-trezor-performance',
    naziv: 'Kripto Trezor — Vault Performance',
    opis: 'Performance izvještaj: PnL, ukupni return, annualized return i period returns po assetu',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  {
    id: 'kripto-trezor-liquidity',
    naziv: 'Kripto Trezor — Vault Liquidity',
    opis: 'Likvidnosni izvještaj: instant/24h/7d kapacitet isplate i operativni buffer po tierovima',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  {
    id: 'kripto-trezor-yield',
    naziv: 'Kripto Trezor — Vault Yield',
    opis: 'Yield/staking reward izvještaj: APR po tieru, dnevni/mjesečni/godišnji prinos i compounding projekcije',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  {
    id: 'kripto-trezor-governance',
    naziv: 'Kripto Trezor — Vault Governance',
    opis: 'Governance prijedlozi i glasanje: promjene parametara vault politike, time-lock i multi-sig konfiguracije',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-11',
  },
  {
    id: 'kripto-trezor-compliance',
    naziv: 'Kripto Trezor — Vault Compliance',
    opis: 'Compliance izvještaj: AML/KYC/sanctions kontrole, warning i breach status provjera',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-12',
  },
  {
    id: 'kripto-trezor-insurance',
    naziv: 'Kripto Trezor — Vault Insurance',
    opis: 'Insurance izvještaj: pokrivenost cold/hot/cyber polica, premije i status zahtjeva',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-13',
  },
  {
    id: 'kripto-trezor-diversification',
    naziv: 'Kripto Trezor — Vault Diversification',
    opis: 'Diversification izvještaj: raspodjela po asset klasama, HHI i rebalans preporuke',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-13',
  },
  {
    id: 'kripto-trezor-collateral',
    naziv: 'Kripto Trezor — Vault Collateral',
    opis: 'Collateral izvještaj: pozicije, LTV, margin call status i preporuke za upravljanje kolateralom',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-13',
  },
  {
    id: 'kripto-trezor-solvency',
    naziv: 'Kripto Trezor — Vault Solvency',
    opis: 'Solvency izvještaj: assets/liabilities ratio, kapitalni buffer i stres signal po vault tierovima',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-13',
  },
  {
    id: 'kripto-trezor-reserve',
    naziv: 'Kripto Trezor — Vault Reserve',
    opis: 'Reserve izvještaj: pokriće rezervama po klasama imovine, aggregate coverage ratio i stress signal',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-13',
  },
  {
    id: 'kripto-trezor-custody',
    naziv: 'Kripto Trezor — Vault Custody',
    opis: 'Custody izvještaj: raspodjela imovine po custodian nivoima, segregacija, osiguranje i status računa',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-13',
  },
  {
    id: 'kripto-trezor-tokenization',
    naziv: 'Kripto Trezor — Vault Tokenization',
    opis: 'Tokenization izvještaj: tokenizovana imovina, emisija tokena, tržišna kapitalizacija, smart-contract status i compliance',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-13',
  },
  {
    id: 'kripto-trezor-redemption',
    naziv: 'Kripto Trezor — Vault Redemption',
    opis: 'Redemption izvještaj: zahtjevi za otkup, likvidnosni izvor, settlement status, naknade i compliance hold',
    enabled: true,
    rolloutPct: 100,
    activeFrom: '2026-05-13',
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
