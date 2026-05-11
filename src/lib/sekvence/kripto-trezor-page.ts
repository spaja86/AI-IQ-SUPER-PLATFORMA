// SpajaUltraOmegaCore -∞Ω+∞ — SPAJA Kripto Trezor — Sekvence
// Kompanija SPAJA — Digitalna Industrija

import type { Sekvenca } from '@/lib/types';

export const kriptoTrezorSekvence: Sekvenca[] = [
  {
    id: 'kripto-trezor-hero',
    tip: 'hero',
    naslov: '🔐 SPAJA Kripto Trezor',
    podnaslov: 'Institucionalni kripto custody vault — cold storage, multi-sig i time-lock zaštita za sva SPAJA digitalna sredstva',
    ikona: '🔐',
    redosled: 1,
    podaci: {
      opis: 'Kripto Trezor je najviši nivo zaštite za digitalna sredstva u AI IQ ekosistemu. Nadovezuje se na AI IQ Menjačnicu i Pro Novčanik — kada sredstva trebaju apsolutnu sigurnost, premještaju se u Trezor sa 4 sigurnosna nivoa, multi-sig potpisivanjem i obaveznim vremenskim zaključavanjem.',
      dugmad: [
        { tekst: 'Pro Novčanik', href: '/menjacnica-novcanik' },
        { tekst: 'Menjačnica', href: '/menjacnica', stil: 'sekundarno' },
        { tekst: 'Banka', href: '/banka', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'kripto-trezor-nivoi',
    tip: 'lista',
    naslov: '🛡️ Četiri Sigurnosna Nivoa',
    redosled: 2,
    podaci: {
      stavke: [
        {
          ikona: '🔥',
          naslov: 'Hot Tier — Trenutna Likvidnost',
          opis: 'Online, instant pristup. 1-of-1 potpis. Bez time-lock-a. Za kratkoročnu likvidnost i brze transakcije. Min depozit 0.001 BTC / 0.001 ETH.',
        },
        {
          ikona: '🌡️',
          naslov: 'Warm Tier — Operativna Rezerva',
          opis: '2-of-3 multi-sig. 1 dan time-lock za isplate. Za operativnu rezervu i trezor koji se povremeno koristi. Min depozit 0.01.',
        },
        {
          ikona: '❄️',
          naslov: 'Cold Tier — Strateška Rezerva',
          opis: '3-of-5 multi-sig. 3 dana time-lock. Za stratešku rezervu i dugoročno čuvanje. Potpisi se prikupljaju od hardverskih ključeva.',
        },
        {
          ikona: '🧊',
          naslov: 'Deep-Cold Tier — Institucionalni Vault',
          opis: '5-of-7 multi-sig. 7 dana time-lock. Maksimalna sigurnost za institucionalne iznose. Air-gapped signing. Min depozit 1 BTC / 1 SPAJA.',
        },
      ],
    },
  },
  {
    id: 'kripto-trezor-api-pregled',
    tip: 'tabela',
    naslov: '🔌 API Endpointi Kripto Trezora',
    podnaslov: 'Dvadeset API ruta koje grade vault sloj iznad menjačnice i novčanika',
    redosled: 3,
    podaci: {
      zaglavlje: ['Endpoint', 'Metod', 'Opis', 'Auth', 'Feature Flag'],
      redovi: [
        ['GET /api/kripto-trezor', 'GET', 'Info i capabilities (javan)', '❌', 'uvek aktivan'],
        ['GET /api/kripto-trezor/vault-status', 'GET', 'Vault stanje + security score', '✅', 'kripto-trezor-vault-status'],
        ['POST /api/kripto-trezor/deposit', 'POST', 'Vault depozit (zaključavanje sredstava)', '✅', 'kripto-trezor-deposit'],
        ['POST /api/kripto-trezor/withdraw', 'POST', 'Vault isplata (time-lock + multi-sig inicijacija)', '✅', 'kripto-trezor-withdraw'],
        ['GET /api/kripto-trezor/audit-log', 'GET', 'Audit trag događaja i sigurnosnih akcija', '✅', 'kripto-trezor-audit-log'],
        ['GET /api/kripto-trezor/security-check', 'GET', 'Sigurnosni pregled i alerti trezora', '✅', 'kripto-trezor-security-check'],
        ['GET /api/kripto-trezor/policy', 'GET', 'Aktivne vault politike: limiti, tierovi i compliance', '✅', 'kripto-trezor-policy'],
        ['GET /api/kripto-trezor/recovery', 'GET', 'Recovery plan: keyholder-i, koraci i hitni kontakti', '✅', 'kripto-trezor-recovery'],
        ['GET /api/kripto-trezor/coverage', 'GET', 'Coverage sloj: reserve fund, guarantee i uncovered gap', '✅', 'kripto-trezor-coverage'],
        ['GET /api/kripto-trezor/risk', 'GET', 'Risk assessment: tržišni, koncentracijski i likvidnosni rizik', '✅', 'kripto-trezor-risk'],
        ['GET /api/kripto-trezor/analytics', 'GET', 'Analytics i yield: performance po asetu, tier APR i portfolio APR', '✅', 'kripto-trezor-analytics'],
        ['GET /api/kripto-trezor/rebalance', 'GET', 'Rebalance prijedlozi: optimalna raspodjela sredstava po tierovima', '✅', 'kripto-trezor-rebalance'],
        ['GET /api/kripto-trezor/liquidity', 'GET', 'Likvidnost trezora: instant/24h/7d kapacitet isplate i liquidity score', '✅', 'kripto-trezor-liquidity'],
        ['GET /api/kripto-trezor/forecast', 'GET', 'Performance forecast: bull/base/bear scenariji za odabrani horizont', '✅', 'kripto-trezor-forecast'],
        ['GET /api/kripto-trezor/stress', 'GET', 'Stress test izvještaj: tržišni, likvidnosni i custody incident scenariji', '✅', 'kripto-trezor-stress'],
        ['GET /api/kripto-trezor/resilience', 'GET', 'Resilience score: coverage + liquidity + stress + risk mitigacija', '✅', 'kripto-trezor-resilience'],
        ['GET /api/kripto-trezor/benchmark', 'GET', 'Benchmark komparacija: vault portfolio vs BTC, ETH i Crypto Market Index', '✅', 'kripto-trezor-benchmark'],
        ['GET /api/kripto-trezor/attribution', 'GET', 'Attribution analiza: doprinos prinosa po asetu i tieru uz koncentracioni rizik', '✅', 'kripto-trezor-attribution'],
        ['GET /api/kripto-trezor/exposure', 'GET', 'Exposure analiza: raspodjela izloženosti po asetu i tieru sa fokusom na koncentraciju', '✅', 'kripto-trezor-exposure'],
        ['GET /api/kripto-trezor/allocation', 'GET', 'Allocation analiza: trenutna vs ciljana raspodjela po asetu i tieru uz preporučeni shift', '✅', 'kripto-trezor-allocation'],
      ],
    },
  },
  {
    id: 'kripto-trezor-sigurnost',
    tip: 'tekst',
    naslov: '🔑 Multi-Sig i Time-Lock Arhitektura',
    redosled: 4,
    podaci: {
      sadrzaj: 'Svaka isplata iz Kripto Trezora prolazi kroz dvostepeni sigurnosni protokol: time-lock (korisnik mora sačekati 0–7 dana ovisno o tieru) i multi-sig (1–5 potpisa od hardverskih ključeva ili OMEGA AI modula). Ova kombinacija čini Trezor otpornim na kompromitovanje jednog ključa i napad trenutnog pristupa.',
      istaknuteStavke: [
        '🔐 Hot: 1-of-1 potpis, bez čekanja (za mikro iznose)',
        '🔐 Warm: 2-of-3 potpisa, 1 dan čekanja',
        '🔐 Cold: 3-of-5 potpisa, 3 dana čekanja',
        '🔐 Deep-Cold: 5-of-7 potpisa, 7 dana čekanja',
        '📋 Whitelist adresa — isplate moguće samo na prethodno odobrene adrese',
        '📊 Security Score 0–100 — meri udeo sredstava u cold/deep-cold tieru',
      ],
    },
  },
  {
    id: 'kripto-trezor-integracija',
    tip: 'kartice',
    naslov: '🔗 Integracija sa AI IQ Finance Stekom',
    redosled: 5,
    podaci: {
      kartice: [
        {
          naslov: '💱 AI IQ Menjačnica',
          opis: 'Vault prima sredstva direktno iz menjačnice. Exchange→Trezor transfer u jednom koraku.',
          ikona: '💱',
          oznake: ['exchange', 'aktivan'],
        },
        {
          naslov: '💼 Pro Novčanik',
          opis: 'Trezor se nadovezuje na Pro Novčanik ledger. Svaki vault depozit/isplata beleži se kao double-entry unos.',
          ikona: '💼',
          oznake: ['pro-wallet', 'aktivan'],
        },
        {
          naslov: '🏦 AI IQ World Bank',
          opis: 'Deep-Cold Tier je poravnat sa ERSTE Bankom za EUR/RSD fiat backing. Svaki institucioni vault ima bankarski identitet.',
          ikona: '🏦',
          oznake: ['banka', 'aktivan'],
        },
        {
          naslov: '🔗 Blockchain',
          opis: 'Vault depoziti i isplate se log-uju na Polygon blockchain (pametni ugovor) za javnu verifikaciju.',
          ikona: '🔗',
          oznake: ['blockchain', 'aktivan'],
        },
      ],
    },
  },
  {
    id: 'kripto-trezor-statistika',
    tip: 'statistika',
    naslov: '📊 Trezor Statistike',
    redosled: 6,
    podaci: {
      stavke: [
        { naziv: 'Sigurnosni Nivoi', vrednost: '4', ikona: '🛡️' },
        { naziv: 'Multi-Sig Konfiguracije', vrednost: '1–5 of 7', ikona: '🔑' },
        { naziv: 'Max Time-Lock', vrednost: '7 dana', ikona: '⏳' },
        { naziv: 'Whitelist Adrese', vrednost: 'Neograničeno', ikona: '📋' },
        { naziv: 'Podržani Aseti', vrednost: 'BTC, ETH, SOL, USDT, SPAJA', ikona: '💎' },
        { naziv: 'Security Score', vrednost: '0–100', ikona: '📊' },
      ],
    },
  },
  {
    id: 'kripto-trezor-roadmap',
    tip: 'baner',
    naslov: '🚀 Roadmap — SPAJA Kripto Trezor',
    redosled: 7,
    podaci: {
      bedz: '🔐 TREZOR',
      opis: 'Faza A: Vault status, simulovani depozit i isplata, multi-sig logika, security score — sve aktivno. Faza B: pravi blockchain potpisi, HSM integracija, institucioni onboarding. Faza B+: auto-rebalancing između tierova, yield vault (DeFi lending iz cold tier-a).',
      dugme: { tekst: 'Pro Novčanik', href: '/menjacnica-novcanik' },
    },
  },
];
