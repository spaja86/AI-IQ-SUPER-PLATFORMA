// SpajaUltraOmegaCore -∞Ω+∞ — AI IQ MENJAČNICA Profesionalni Novčanik — Sekvence
// Kompanija SPAJA — Digitalna Industrija
//
// Skeleton koji se nadovezuje na AI IQ Menjačnicu:
//   - Portfolio ekspozicija i P&L pregled
//   - Orderbook i trade feed
//   - Settlement status
//   - Double-entry ledger integracija

import type { Sekvenca } from '@/lib/types';

export const menjacnicaNovcanikSekvence: Sekvenca[] = [
  {
    id: 'menjacnica-novcanik-hero',
    tip: 'hero',
    naslov: '💼 AI IQ MENJAČNICA — Profesionalni Novčanik',
    podnaslov: 'Profesionalni kripto novčanik direktno integrisan sa AI IQ Menjačnicom — portfolio, P&L, orderbook i settlement',
    ikona: '💼',
    redosled: 1,
    podaci: {
      opis: 'Profesionalni novčanik koji se nadovezuje na AI IQ Menjačnicu. Prati portfolio ekspoziciju, realizovani i nerealizovani P&L, orderbook snapshot i settlement status u realnom vremenu. Sve podržano double-entry računovodstvenim sistemom.',
      dugmad: [
        { tekst: 'Menjačnica', href: '/menjacnica' },
        { tekst: 'Banka', href: '/banka', stil: 'sekundarno' },
        { tekst: 'Poslovni Novčanik', href: '/poslovni-novcanik', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'menjacnica-novcanik-karakteristike',
    tip: 'lista',
    naslov: '🔑 Karakteristike Profesionalnog Novčanika',
    redosled: 2,
    podaci: {
      stavke: [
        {
          ikona: '📊',
          naslov: 'Portfolio Ekspozicija',
          opis: 'Pregled svih pozicija — dostupno, rezervisano i ukupno po asetu sa trenutnim USD vrednošću.',
        },
        {
          ikona: '📈',
          naslov: 'Realizovani i Nerealizovani P&L',
          opis: 'Prati profit/gubitak po svakoj poziciji — od ulazne do trenutne cene, sa procentualnom promenom.',
        },
        {
          ikona: '📒',
          naslov: 'Live Orderbook Snapshot',
          opis: 'Orderbook za svaki aktivni par — bid/ask nivoi sa kumulativnim qty i spread kalkulacijom.',
        },
        {
          ikona: '⚡',
          naslov: 'Recent Trades Feed',
          opis: 'Poslednji izvršeni trade-ovi po paru — cena, količina, strana (buy/sell) i timestamp.',
        },
        {
          ikona: '✅',
          naslov: 'Settlement Status',
          opis: 'Agregat statusa poravnanja po svim aktivnim parovima — open, pending, settled, failed.',
        },
        {
          ikona: '🔐',
          naslov: 'Double-Entry Računovodstvo',
          opis: 'Svaka transakcija upisana kao debit/credit par — audit-ready, append-only, idempotent.',
        },
      ],
    },
  },
  {
    id: 'menjacnica-novcanik-api-pregled',
    tip: 'tabela',
    naslov: '🔌 API Endpointi Profesionalnog Novčanika',
    podnaslov: 'Pet namenskih API ruta koje grade pro wallet sloj nad menjačnicom',
    redosled: 3,
    podaci: {
      zaglavlje: ['Endpoint', 'Metod', 'Opis', 'Auth', 'Feature Flag'],
      redovi: [
        ['GET /api/menjacnica-novcanik', 'GET', 'Info i capabilities skeleton', '❌', 'uvek aktivan'],
        ['GET /api/menjacnica-novcanik/portfolio', 'GET', 'Portfolio ekspozicija + P&L po korisniku', '✅', 'pro-novcanik-portfolio'],
        ['GET /api/menjacnica-novcanik/orderbook?pairId=...', 'GET', 'Orderbook snapshot za dati par', '✅', 'pro-novcanik-orderbook'],
        ['GET /api/menjacnica-novcanik/trades?pairId=...', 'GET', 'Poslednji trade-ovi za dati par', '✅', 'pro-novcanik-trades'],
        ['GET /api/menjacnica-novcanik/settlement-status', 'GET', 'Settlement status agregat', '✅', 'pro-novcanik-settlement'],
      ],
    },
  },
  {
    id: 'menjacnica-novcanik-pnl-opis',
    tip: 'tekst',
    naslov: '📈 P&L Metodologija',
    redosled: 4,
    podaci: {
      sadrzaj: 'Profesionalni novčanik koristi FIFO-kompatibilni P&L sistem sa prosečnom ulaznom cenom po asetu. Nerealizovani P&L se izračunava kao razlika između trenutne tržišne cene (iz simulatora/provajdera) i prosečne ulazne cene, pomnožena sa ukupnom količinom. Realizovani P&L se akumulira iz zatvorenih pozicija i beleži u ledger-u kao zasebni unos.',
      istaknuteStavke: [
        '📌 Prosečna ulazna cena (VWAP po nalozima korisnika)',
        '📌 Nerealizovani P&L = (trenutnaCena − avgEntry) × qty',
        '📌 Realizovani P&L = kumulativ zatvorenih pozicija iz ledger-a',
        '📌 Ukupna vrednost portfolija u USD (sve pozicije)',
        '📌 Double-entry zapis za svaki trade: debit base asset, credit quote asset (i obrnuto za sell)',
        '📌 Fee unos kao zaseban ledger red (fee entryType)',
      ],
    },
  },
  {
    id: 'menjacnica-novcanik-settlement-opis',
    tip: 'baner',
    naslov: '✅ Settlement i Poravnanje',
    redosled: 5,
    podaci: {
      bedz: '✅ SETTLEMENT',
      opis: 'Settlement status agregira stanje svih otvorenih naloga i pending poravnanja po svakom aktivnom paru. Kada su svi nalozi izvršeni i ledger upisi potvrđeni, sistem prijavljuje "allSettled: true". Svaki par ima individualni status: settled | pending | processing | failed.',
      dugme: { tekst: 'Menjačnica API', href: '/api/menjacnica' },
    },
  },
  {
    id: 'menjacnica-novcanik-integracija',
    tip: 'kartice',
    naslov: '🔗 Integracija sa AI IQ Ekosistemom',
    redosled: 6,
    podaci: {
      kartice: [
        {
          naslov: '💱 AI IQ Menjačnica',
          opis: 'Osnova — tickers, quotes, orders, trades, SPAJA BTC par. Profesionalni novčanik koristi iste parove i fee engine.',
          ikona: '💱',
          oznake: ['core', 'aktivan'],
        },
        {
          naslov: '🏦 AI IQ World Bank',
          opis: 'Fiat rail integracija — depoziti sa ERSTE Bankom, EUR/RSD pokrivenost, compliance bridge.',
          ikona: '🏦',
          oznake: ['banka', 'aktivan'],
        },
        {
          naslov: '💼 Poslovni Novčanik',
          opis: 'Wallet identitet + kartice + KYC/KYB — osnova za korisničke naloge kojima pro novčanik dodaje exchange sloj.',
          ikona: '💼',
          oznake: ['wallet', 'aktivan'],
        },
        {
          naslov: '🔐 Bezbednost & AML',
          opis: 'Svaka pro wallet operacija prolazi kroz iste AML/risk check-ove kao i menjačnica — scored, flagged, logged.',
          ikona: '🔐',
          oznake: ['compliance', 'aktivan'],
        },
      ],
    },
  },
  {
    id: 'menjacnica-novcanik-roadmap',
    tip: 'statistika',
    naslov: '🚀 Roadmap — Profesionalni Novčanik',
    redosled: 7,
    podaci: {
      stavke: [
        { naziv: 'Portfolio API', vrednost: 'Aktivan', ikona: '✅' },
        { naziv: 'Orderbook Feed', vrednost: 'Aktivan', ikona: '✅' },
        { naziv: 'Trade History Feed', vrednost: 'Aktivan', ikona: '✅' },
        { naziv: 'Settlement Status', vrednost: 'Aktivan', ikona: '✅' },
        { naziv: 'Live P&L (DB)', vrednost: 'Faza B', ikona: '🛠️' },
        { naziv: 'Real Trade Exec', vrednost: 'Faza B+', ikona: '🔒' },
      ],
    },
  },
];
