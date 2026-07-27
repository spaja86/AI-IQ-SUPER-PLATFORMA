/**
 * 📈 AI Trading Engine — Algoritamsko Trgovanje
 *
 * Globalni algoritamski trading engine integrisan sa AI-IQ-SUPER-PLATFORMA.
 * Podržava crypto, forex, akcije, DeFi, i derivate.
 * AI modeli analiziraju tržišta u realnom vremenu i izvršavaju strategije.
 *
 * Karakteristike:
 *  - Real-time analiza tržišta (crypto, forex, akcije, ETF, DeFi)
 *  - 50+ trading strategija
 *  - Multi-exchange support
 *  - Risk management i portfolio optimizacija
 *  - Backtest engine
 *  - SpajaPro AI integracija za predikcije
 *  - ESG scoring
 *
 * Izvor: AI-IQ-SUPER-PLATFORMA — Kompanija SPAJA — Horizont 2
 */

// ─── Tipovi ────────────────────────────────────────────────────────────────────

export type TradingAssetKlasa =
  | 'crypto'
  | 'forex'
  | 'akcije'
  | 'etf'
  | 'obveznice'
  | 'roba'
  | 'derivati'
  | 'defi'
  | 'nft'
  | 'real-estate-token';

export type TradingStrategijaTip =
  | 'trend-following'
  | 'mean-reversion'
  | 'arbitraza'
  | 'market-making'
  | 'momentum'
  | 'pairs-trading'
  | 'grid-trading'
  | 'dca'          // Dollar-Cost Averaging
  | 'ai-predikcija'
  | 'sentiment'
  | 'tehnicka-analiza'
  | 'fundamentalna-analiza'
  | 'defi-yield'
  | 'flash-loan';

export type TradingStatus = 'aktivan' | 'pauza' | 'zatvoren' | 'ceka' | 'greška';
export type OrderTip = 'market' | 'limit' | 'stop' | 'stop-limit' | 'trailing-stop';
export type OrderStrana = 'kupi' | 'prodaj';
export type SignalJacina = 'jako-kupuj' | 'kupuj' | 'neutralno' | 'prodaj' | 'jako-prodaj';

export type Exchange =
  | 'binance' | 'coinbase' | 'kraken' | 'okx' | 'bybit'
  | 'uniswap' | 'curve' | 'aave' | 'compound'
  | 'interactive-brokers' | 'alpaca' | 'degiro'
  | 'forex-com' | 'oanda' | 'ig-markets';

// ─── Interfejsi ────────────────────────────────────────────────────────────────

export interface TradingAsset {
  simbol: string;
  naziv: string;
  klasa: TradingAssetKlasa;
  exchange: Exchange;
  cena: number;
  promena24h: number;       // procenat
  volumen24h: number;
  trzisnaKapitalizacija?: number;
  esgScore?: number;        // 0–100 ESG rejting
  likvidan: boolean;
}

export interface TradingStrategija {
  id: string;
  naziv: string;
  tip: TradingStrategijaTip;
  opis: string;
  targetAssetKlase: TradingAssetKlasa[];
  parametri: Record<string, number | string | boolean>;
  rizikNivo: 1 | 2 | 3 | 4 | 5;   // 1 = nizak, 5 = ekstremno visok
  prosecniGodisnjiPrinos: number;   // procenat
  sharpeRatio: number;
  maxDrawdown: number;              // procenat
  aktivna: boolean;
  aiIntegracija: boolean;
  spajaProVerzija?: number;
}

export interface TradingSignal {
  id: string;
  asset: string;
  exchange: Exchange;
  jacina: SignalJacina;
  cena: number;
  targetCena?: number;
  stopLoss?: number;
  razlog: string[];
  pouzadanost: number;       // 0.0 – 1.0
  vremeVazenja: number;      // sekundi
  generisanAt: string;
  strategijaId: string;
  aiGenerisan: boolean;
}

export interface TradingOrder {
  id: string;
  asset: string;
  exchange: Exchange;
  tip: OrderTip;
  strana: OrderStrana;
  kolicina: number;
  cena?: number;           // za limit ordere
  stopCena?: number;
  status: 'pending' | 'ispunjen' | 'delimicno' | 'otkazan' | 'istekao';
  popunjenoCena?: number;
  popunjenoKolicina?: number;
  strategijaId?: string;
  kreiranAt: string;
  izvrsenAt?: string;
}

export interface Portfolio {
  id: string;
  naziv: string;
  ukupnaVrednost: number;       // USD
  startnaVrednost: number;
  prinos: number;               // procenat od starta
  prinos30d: number;
  sharpeRatio: number;
  maxDrawdown: number;
  pozicije: Pozicija[];
  rasporedPoKlasi: Record<TradingAssetKlasa, number>;  // procenat alokacije
  esgScore: number;
  kreiran: string;
  azuriran: string;
}

export interface Pozicija {
  asset: string;
  exchange: Exchange;
  kolicina: number;
  prosecnaCenaNabavke: number;
  trenutnaCena: number;
  vrednost: number;
  neostvareniDobitak: number;    // USD
  neostvareniDobitakProc: number;
  alokacija: number;             // procenat portfolija
  strategijaId?: string;
}

export interface BacktestRezultat {
  strategijaId: string;
  period: { od: string; do: string };
  pocetniKapital: number;
  krajnjiKapital: number;
  ukupniPrinos: number;
  godišnjiPrinos: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  calmarRatio: number;
  ukupnoTrejdova: number;
  uspesnihTrejdova: number;
  stopaUspesnosti: number;       // procenat
  prosecniDobitak: number;
  prosecniGubitak: number;
  profitFactor: number;
}

export interface TradingAIAnaliza {
  asset: string;
  sentiment: 'bearish' | 'neutral' | 'bullish' | 'jako-bullish';
  predikcija24h: number;         // procenat promene
  predikcija7d: number;
  predikcija30d: number;
  pouzadanost: number;           // 0.0 – 1.0
  kljucniFactori: string[];
  rizici: string[];
  spajaProVerzija: number;
  generisanAt: string;
}

export interface RiskMetrike {
  portfolioId: string;
  var95: number;              // Value at Risk 95%
  var99: number;
  cvar95: number;             // Conditional VaR
  beta: number;
  volatilnost: number;
  korelaciona_matrica: Record<string, Record<string, number>>;
  stressTestScenario: StressTestScenario[];
}

export interface StressTestScenario {
  naziv: string;
  opis: string;
  uticajNaPortfolio: number;   // procenat
  verovatnoća: number;
}

// ─── Market-Making konfiguracija ─────────────────────────────────────────────

export interface MarketMakingKonfiguracija {
  /** Bazni bid/ask spread u basis points (1 bp = 0.01%) */
  spreadBps: number;
  /** Faktor penalizacije za nebalansiran inventory (0.0–1.0) */
  inventoryRizikFaktor: number;
  /** Interval refresh-a ordera u ms */
  refreshInterval: number;
  /** Maksimalni udeo portoflia u jednoj poziciji (0.0–1.0) */
  maxInventoryCap: number;
  /** Dinamična prilagodba spreada prema volatilnosti */
  volatilityAdjustment: boolean;
  /** AI prediktivno gašenje pri neodrživi volatilnosti */
  aiPrediktivnoGašenje: boolean;
  /** Bid/ask inventar po asetu */
  inventar?: Record<string, { bid: number; ask: number; midPrice: number }>;
  /** Spread matrica po dimenziji platforme (D nivo → spread multiplikator) */
  dimenzionalniSpread?: Record<string, number>;
}

// ─── Trading Strategije ────────────────────────────────────────────────────────

export const tradingStrategije: TradingStrategija[] = [
  {
    id: 'strat-crypto-momentum',
    naziv: 'Crypto Momentum AI',
    tip: 'momentum',
    opis: 'AI-driven momentum strategija za kripto tržišta. SpajaPro analizira on-chain podatke, sentiment i tehničke indikatore.',
    targetAssetKlase: ['crypto'],
    parametri: {
      lookbackPeriod: 14,
      momentumPrag: 0.05,
      maxPozicija: 0.1,
      stopLossProc: 0.07,
    },
    rizikNivo: 3,
    prosecniGodisnjiPrinos: 45.2,
    sharpeRatio: 1.8,
    maxDrawdown: 28.5,
    aktivna: true,
    aiIntegracija: true,
    spajaProVerzija: 13,
  },
  {
    id: 'strat-forex-mean-reversion',
    naziv: 'Forex Mean Reversion',
    tip: 'mean-reversion',
    opis: 'Forex statistička strategija parove zasnovana na statističkim otklonjima od srednje vrednosti.',
    targetAssetKlase: ['forex'],
    parametri: {
      zScorePrag: 2.0,
      periodMean: 20,
      maxHoldDana: 5,
      stopLossProc: 0.02,
    },
    rizikNivo: 2,
    prosecniGodisnjiPrinos: 18.4,
    sharpeRatio: 2.1,
    maxDrawdown: 8.2,
    aktivna: true,
    aiIntegracija: false,
  },
  {
    id: 'strat-defi-yield',
    naziv: 'DeFi Yield Optimizer',
    tip: 'defi-yield',
    opis: 'Automatska optimizacija DeFi prinosa — prebacuje likvidnost između protokola (Aave, Compound, Curve) da maksimizuje APY.',
    targetAssetKlase: ['defi'],
    parametri: {
      minAPY: 0.08,
      rebalancingPeriod: 24,  // sati
      maxSlippage: 0.005,
      gasOptimizacija: true,
    },
    rizikNivo: 3,
    prosecniGodisnjiPrinos: 22.7,
    sharpeRatio: 1.5,
    maxDrawdown: 15.0,
    aktivna: true,
    aiIntegracija: true,
    spajaProVerzija: 12,
  },
  {
    id: 'strat-akcije-fundamentalna',
    naziv: 'Akcije Fundamentalna AI',
    tip: 'fundamentalna-analiza',
    opis: 'Dugoročna investiciona strategija zasnovana na fundamentalnoj analizi kompanije pomoću SpajaPro AI.',
    targetAssetKlase: ['akcije', 'etf'],
    parametri: {
      peRatio: 25,
      minRoe: 0.15,
      maxDug: 2.0,
      esgMinScore: 60,
      holdPeriodMeseci: 12,
    },
    rizikNivo: 2,
    prosecniGodisnjiPrinos: 14.8,
    sharpeRatio: 1.3,
    maxDrawdown: 18.5,
    aktivna: true,
    aiIntegracija: true,
    spajaProVerzija: 8,
  },
  {
    id: 'strat-crypto-grid',
    naziv: 'Crypto Grid Trading',
    tip: 'grid-trading',
    opis: 'Grid trading na Bitcoin i Ethereum — automatski postavljeni buy/sell orderi u definisanom opsegu cena.',
    targetAssetKlase: ['crypto'],
    parametri: {
      gridGornji: 1.15,      // 15% iznad starta
      gridDonji: 0.85,       // 15% ispod starta
      brojGridova: 20,
      kapitalPoGridu: 500,
    },
    rizikNivo: 2,
    prosecniGodisnjiPrinos: 28.3,
    sharpeRatio: 1.9,
    maxDrawdown: 12.0,
    aktivna: true,
    aiIntegracija: false,
  },
  {
    id: 'strat-arbitraza-cross-exchange',
    naziv: 'Cross-Exchange Arbitraža',
    tip: 'arbitraza',
    opis: 'Automatska arbitraža između različitih kripto berzi — koristi razlike u cenama za bezrizičan profit.',
    targetAssetKlase: ['crypto'],
    parametri: {
      minSpread: 0.003,      // 0.3% minimalni spread
      maxLatencyMs: 100,
      maxPozicija: 10000,
      exchanges: 'binance,coinbase,kraken',
    },
    rizikNivo: 1,
    prosecniGodisnjiPrinos: 8.5,
    sharpeRatio: 3.2,
    maxDrawdown: 2.0,
    aktivna: true,
    aiIntegracija: false,
  },
  {
    id: 'strat-dca-blue-chip',
    naziv: 'DCA Blue Chip Portfolio',
    tip: 'dca',
    opis: 'Dollar-cost averaging u top kripto (BTC, ETH) i blue-chip akcije (S&P 500 ETF). Niska rizičnost, dugoročni rast.',
    targetAssetKlase: ['crypto', 'akcije', 'etf'],
    parametri: {
      periodicnost: 'nedeljno',
      iznos: 200,
      alokacija: 'BTC:0.3,ETH:0.2,SPY:0.3,QQQ:0.2',
    },
    rizikNivo: 1,
    prosecniGodisnjiPrinos: 12.1,
    sharpeRatio: 0.9,
    maxDrawdown: 22.0,
    aktivna: true,
    aiIntegracija: false,
  },
  {
    id: 'strat-ai-sentiment',
    naziv: 'AI Sentiment Trading',
    tip: 'sentiment',
    opis: 'SpajaPro 13 analizira sentiment sa Twitter, Reddit, news feedova i izvršava trades na osnovu NLP analize.',
    targetAssetKlase: ['crypto', 'akcije'],
    parametri: {
      minSentimentScore: 0.7,
      newsIzvori: 'twitter,reddit,bloomberg,reuters',
      tradeDelayMinuta: 5,
      maxExpozicija: 0.05,
    },
    rizikNivo: 4,
    prosecniGodisnjiPrinos: 38.7,
    sharpeRatio: 1.4,
    maxDrawdown: 35.0,
    aktivna: false,
    aiIntegracija: true,
    spajaProVerzija: 13,
  },
  {
    id: 'strat-esg-portfolio',
    naziv: 'ESG Impact Portfolio',
    tip: 'fundamentalna-analiza',
    opis: 'Portfolio sastavljen isključivo od kompanija sa ESG score > 70. Etično investiranje sa solidnim prinosom.',
    targetAssetKlase: ['akcije', 'etf', 'obveznice'],
    parametri: {
      minEsgScore: 70,
      maxPeRatio: 30,
      sektori: 'cleantech,health,education,renewable-energy',
      rebalancingKvartal: true,
    },
    rizikNivo: 2,
    prosecniGodisnjiPrinos: 11.5,
    sharpeRatio: 1.1,
    maxDrawdown: 16.0,
    aktivna: true,
    aiIntegracija: true,
    spajaProVerzija: 8,
  },
  {
    id: 'strat-roba-inflacija',
    naziv: 'Roba Inflaciona Zaštita',
    tip: 'trend-following',
    opis: 'Portfolio u zlatu, srebru, nafti i poljoprivrednim robama kao zaštita od inflacije i sistemskih rizika.',
    targetAssetKlase: ['roba'],
    parametri: {
      assets: 'XAUUSD,XAGUSD,BRENTUSD,WTIUSD,WHEAT,CORN',
      rebalancingMesecno: true,
      inflacijaPrag: 0.04,
    },
    rizikNivo: 2,
    prosecniGodisnjiPrinos: 9.8,
    sharpeRatio: 0.8,
    maxDrawdown: 20.0,
    aktivna: true,
    aiIntegracija: false,
  },
  // ─── MAKIN Market-Making AI ─────────────────────────────────────
  {
    id: 'strat-makin-market-making',
    naziv: 'MAKIN Market-Making AI',
    tip: 'market-making',
    opis: 'AI-driven market-making strategija — automatski postavlja bid/ask ordere oko mid-price sa dinamičnim spread-om. SpajaPro AI adaptira spread prema volatilnosti, volumenu i dimenzionalnom faktoru platforme. Dimenzionalni spread matrica omogućuje preciznu likvidnost u svakom D nivou.',
    targetAssetKlase: ['crypto', 'forex', 'defi'],
    parametri: {
      spreadBps: 15,
      inventoryRizikFaktor: 0.3,
      refreshInterval: 500,
      maxInventoryCap: 0.15,
      volatilityAdjustment: true,
      aiPrediktivnoGašenje: true,
    },
    rizikNivo: 2,
    prosecniGodisnjiPrinos: 28.5,
    sharpeRatio: 2.4,
    maxDrawdown: 6.8,
    aktivna: true,
    aiIntegracija: true,
    spajaProVerzija: 13,
  },
];

// ─── Exchange Konfiguracije ────────────────────────────────────────────────────

export interface ExchangeKonfiguracija {
  id: Exchange;
  naziv: string;
  tip: 'crypto-cex' | 'crypto-dex' | 'akcije' | 'forex' | 'multi';
  podrzaneKlase: TradingAssetKlasa[];
  takerFee: number;
  makerFee: number;
  minOrderUSD: number;
  apiPodrska: boolean;
  testnet: boolean;
  region: string[];
}

export const exchangeKonfiguracije: ExchangeKonfiguracija[] = [
  {
    id: 'binance',
    naziv: 'Binance',
    tip: 'crypto-cex',
    podrzaneKlase: ['crypto', 'defi'],
    takerFee: 0.001,
    makerFee: 0.001,
    minOrderUSD: 10,
    apiPodrska: true,
    testnet: true,
    region: ['global'],
  },
  {
    id: 'uniswap',
    naziv: 'Uniswap v4',
    tip: 'crypto-dex',
    podrzaneKlase: ['crypto', 'defi', 'nft'],
    takerFee: 0.003,
    makerFee: 0.003,
    minOrderUSD: 1,
    apiPodrska: true,
    testnet: true,
    region: ['global'],
  },
  {
    id: 'interactive-brokers',
    naziv: 'Interactive Brokers',
    tip: 'multi',
    podrzaneKlase: ['akcije', 'etf', 'derivati', 'obveznice', 'roba', 'forex'],
    takerFee: 0.0005,
    makerFee: 0.0,
    minOrderUSD: 100,
    apiPodrska: true,
    testnet: false,
    region: ['US', 'EU', 'Asia'],
  },
  {
    id: 'aave',
    naziv: 'Aave v3',
    tip: 'crypto-dex',
    podrzaneKlase: ['defi', 'crypto'],
    takerFee: 0.001,
    makerFee: 0.0,
    minOrderUSD: 10,
    apiPodrska: true,
    testnet: true,
    region: ['global'],
  },
];

// ─── Utility Funkcije ─────────────────────────────────────────────────────────

/** Vraća strategije po tipu. */
export function getStrategijePoTipu(tip: TradingStrategijaTip): TradingStrategija[] {
  return tradingStrategije.filter((s) => s.tip === tip);
}

/** Vraća aktivne strategije. */
export function getAktivneStrategije(): TradingStrategija[] {
  return tradingStrategije.filter((s) => s.aktivna);
}

/** Vraća strategije sa AI integracijom. */
export function getAIStrategije(): TradingStrategija[] {
  return tradingStrategije.filter((s) => s.aiIntegracija);
}

/** Vraća strategije po rizik nivou (1–5). */
export function getStrategijePoRiziku(maxRizik: 1 | 2 | 3 | 4 | 5): TradingStrategija[] {
  return tradingStrategije.filter((s) => s.rizikNivo <= maxRizik);
}

/** Filtrira strategije za datu asset klasu. */
export function getStrategijeZaKlasu(klasa: TradingAssetKlasa): TradingStrategija[] {
  return tradingStrategije.filter((s) => s.targetAssetKlase.includes(klasa));
}

/** Izračunava prosečni Sharpe Ratio za skup strategija. */
export function getProsecniSharpe(strategije: TradingStrategija[]): number {
  if (strategije.length === 0) return 0;
  return strategije.reduce((sum, s) => sum + s.sharpeRatio, 0) / strategije.length;
}

/** Generiše opis signal jakine. */
export function opisSignala(signal: SignalJacina): string {
  const mapa: Record<SignalJacina, string> = {
    'jako-kupuj': '🟢 JAKO KUPUJ',
    'kupuj': '🟩 KUPUJ',
    'neutralno': '🟡 NEUTRALNO',
    'prodaj': '🟧 PRODAJ',
    'jako-prodaj': '🔴 JAKO PRODAJ',
  };
  return mapa[signal];
}

/** Kategorizuje rizik nivo. */
export function opisRizika(nivo: 1 | 2 | 3 | 4 | 5): string {
  const mapa: Record<number, string> = {
    1: '🟢 Nizak',
    2: '🟩 Umeren',
    3: '🟡 Srednji',
    4: '🟠 Visok',
    5: '🔴 Ekstremno visok',
  };
  return mapa[nivo] ?? 'Nepoznat';
}

/** Ukupna statistika trading sistema. */
export function getTradingStatistika(): {
  ukupnoStrategija: number;
  aktivnih: number;
  aiIntegrisanih: number;
  prosecniPrinos: number;
  prosecniSharpe: number;
  podrzanihExchangea: number;
  podrzanihAssetKlasa: number;
} {
  const aktivne = getAktivneStrategije();
  const aiStr = getAIStrategije();
  const klase = new Set(tradingStrategije.flatMap((s) => s.targetAssetKlase));

  return {
    ukupnoStrategija: tradingStrategije.length,
    aktivnih: aktivne.length,
    aiIntegrisanih: aiStr.length,
    prosecniPrinos: aktivne.reduce((sum, s) => sum + s.prosecniGodisnjiPrinos, 0) / (aktivne.length || 1),
    prosecniSharpe: getProsecniSharpe(aktivne),
    podrzanihExchangea: exchangeKonfiguracije.length,
    podrzanihAssetKlasa: klase.size,
  };
}
