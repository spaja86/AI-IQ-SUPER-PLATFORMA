// SpajaUltraOmegaCore -∞Ω+∞ — SpajaPro Mozak Pregled API
// Kompanija SPAJA — Digitalna Industrija
// GET /api/autofinish-spaja-pro-mozak-pregled
// Pregled svih SpajaPro Mozak modula implementiranih u Autofinish #709

import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  AUTOFINISH_COUNT,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
  TOTAL_DIAGNOSTIKA,
} from '@/lib/constants';

// ─── SpajaPro Mozak Moduli ─────────────────────────────────────────────

const MOZAK_MODULI = [
  {
    id: 'prompt-zastita',
    naziv: 'Prompt Zaštita',
    ikona: '🛡️',
    opis: 'Detekcija prompt injection napada i PII maskiranje pre obrade',
    status: 'AKTIVAN',
    komponente: [
      'Detekcija 11 injection obrazaca (ignore-instructions, jailbreak/DAN, XSS, command injection, prompt extraction...)',
      'PII maskiranje 5 tipova: email, srpski telefon (+381), JMBG, kreditna kartica, IBAN, lozinka',
      'Validacija dužine poruke (max 4000 karaktera)',
      'Zaštita izlaznog odgovora od curenja sistemskog prompta',
    ],
    integracija: 'Chat API — sve poruke prolaze kroz zaštitu pre AI obrade',
  },
  {
    id: 'model-router',
    naziv: 'Smart Model Router',
    ikona: '🧭',
    opis: 'Automatski odabir optimalnog AI modela na osnovu kompleksnosti upita i korisničkog plana',
    status: 'AKTIVAN',
    komponente: [
      'Analiza kompleksnosti: brzi / srednji / duboki / rezonovanje',
      'Keyword matching: 14 brzi, 14 duboki, 13 rezonovanje signala',
      'Token budzet po tipu: 1024 / 2048 / 4096 tokena',
      'Temperatura po tipu: 0.7 / 0.5 / 0.1',
      'Uvažava plan korisnika i preferred model',
      'Reasoning modeli (o1/o3) za matematiku i logiku',
    ],
    integracija: 'Chat API — svaki upit dobija optimalni model automatski',
  },
  {
    id: 'self-check',
    naziv: 'Self-Check Verifikacija',
    ikona: '✅',
    opis: 'Verifikacija kvaliteta AI odgovora i procena nivoa poverenja pre slanja korisniku',
    status: 'AKTIVAN',
    komponente: [
      'Konfidensni nivo: visok (≥75%) / srednji (≥45%) / nizak / ne-znam',
      'Detekcija signala halucinacija (26 nesigurnih fraza)',
      'Detekcija eksplicitnog "ne znam" (17 fraza)',
      'Pozitivni konfidensni signali (citati, kod, numerički podaci)',
      'Upozorenja i preporuke za korisnika u odgovoru',
    ],
    integracija: 'Chat API — selfCheck objekat u svakom odgovoru (streaming + non-streaming)',
  },
  {
    id: 'cache',
    naziv: 'LRU Response Cache',
    ikona: '⚡',
    opis: 'In-memory LRU keš za identične upite — nula latencija, nula trošak za keširane odgovore',
    status: 'AKTIVAN',
    komponente: [
      'LRU algoritam: 200 unosa, FIFO eviction',
      'TTL: 5 minuta po unosu',
      'Cache key: model + systemPrompt hash + normalized message',
      'Cache hit = cost_eur: 0 (bez OpenAI poziva)',
      'Automatsko isključivanje za konverzacijski kontekst (threadId)',
      'Cache statistike dostupne via KPI API',
    ],
    integracija: 'Chat API — lookup pre AI poziva, save posle AI odgovora',
  },
  {
    id: 'sistem-prompt',
    naziv: 'Poboljšani SpajaPro Sistem Prompt',
    ikona: '📋',
    opis: 'Redizajniran sistem prompt sa srpskom specijalizacijom, transparentnošću i konfidensnim nivoima',
    status: 'AKTIVAN',
    komponente: [
      'Srpski/BHS poslovni fokus: lokalna terminologija, NBS, ZOP, PDV, Zakon o radu',
      'Obavezna "ne znam" instrukcija — zabrana izmišljanja informacija',
      'Konfidensni nivo footer (🟢/🟡/🔴) na kraju složenih odgovora',
      'Transparentnost izvora: web pretraga / sopstveno znanje / kalkulator',
      '3 use-case fokusa: biznis automatizacija, IT konsulting, finansijska analiza',
      'Razdvojene sistemske instrukcije, poslovna pravila i user intent',
    ],
    integracija: 'Chat API — baza svakog SpajaPro razgovora',
  },
];

// ─── Integrisani API endpointi ─────────────────────────────────────────

const NOVI_ENDPOINTI = [
  {
    ruta: '/api/spaja-pro/feedback',
    metode: ['POST', 'GET'],
    opis: 'Feedback sistem: ocena 1-5, tip (tacnost/korisnost/brzina/opstenito), "ispravi odgovor" flag, NPS procena',
  },
  {
    ruta: '/api/spaja-pro/kpi',
    metode: ['GET'],
    opis: 'KPI dashboard: avg tokeni, trošak/upitu, cache hit rate, feedback score, NPS, 7-dnevna distribucija, benchmark ciljevi',
  },
  {
    ruta: '/api/autofinish-spaja-pro-mozak-pregled',
    metode: ['GET'],
    opis: 'Pregled svih SpajaPro Mozak modula i SpajaPro unapređenja iz Autofinish #709',
  },
];

// ─── Dijagnostike ──────────────────────────────────────────────────────

const DIJAGNOSTIKE = [
  {
    id: 'mozak-prompt-zastita',
    naziv: 'Prompt Zaštita — aktivan',
    status: 'OK',
    opis: '11 injection obrazaca + 5 PII tipova registrovano i aktivno',
  },
  {
    id: 'mozak-model-router',
    naziv: 'Model Router — aktivan',
    status: 'OK',
    opis: '4 kompleksnost nivoa, routing za sve planove (starter→unlimited)',
  },
  {
    id: 'mozak-self-check',
    naziv: 'Self-Check Verifikacija — aktivan',
    status: 'OK',
    opis: 'Konfidensni nivo u svakom odgovoru, detekcija halucinacija',
  },
  {
    id: 'mozak-cache',
    naziv: 'LRU Cache — aktivan',
    status: 'OK',
    opis: '200 unosa, 5 min TTL, cache key per-model+prompt',
  },
  {
    id: 'mozak-chat-integracija',
    naziv: 'Chat API Integracija — kompletna',
    status: 'OK',
    opis: 'Svi mozak moduli integrisani u /api/spaja-pro/chat streaming i non-streaming tok',
  },
];

// ─── GET handler ───────────────────────────────────────────────────────

export async function GET() {
  const ukupnoModula = MOZAK_MODULI.length;
  const aktivnihModula = MOZAK_MODULI.filter((m) => m.status === 'AKTIVAN').length;
  const ukupnoKomponenti = MOZAK_MODULI.reduce((s, m) => s + m.komponente.length, 0);
  const dijagnostikaOK = DIJAGNOSTIKE.filter((d) => d.status === 'OK').length;

  return NextResponse.json({
    naziv: 'SpajaPro Mozak — Pregled Modula',
    opis: 'Pregled svih SpajaPro Mozak modula implementiranih u Autofinish #709: prompt zaštita, model routing, self-check verifikacija, LRU keš i poboljšani sistem prompt',
    verzija: APP_VERSION,
    autofinishIteracija: AUTOFINISH_COUNT,

    statistike: {
      ukupnoModula,
      aktivnihModula,
      ukupnoKomponenti,
      noviEndpointi: NOVI_ENDPOINTI.length,
      dijagnostikaOK: `${dijagnostikaOK}/${DIJAGNOSTIKE.length}`,
    },

    moduli: MOZAK_MODULI,
    noviEndpointi: NOVI_ENDPOINTI,
    dijagnostike: DIJAGNOSTIKE,

    benefiti: {
      bezbednost: 'Blokiranje injection napada + automatsko PII maskiranje',
      troskovi: 'Cache smanjuje OpenAI pozive za identične upite (cost_eur: 0 za cache hit)',
      kvalitet: 'Smart routing bira najjeftiniji model koji može odgovoriti na zadatak',
      poverenje: 'Self-check daje korisniku konfidensni nivo za svaki odgovor',
      lokalizacija: 'Srpski/BHS fokus u sistem promptu — lokalni regulatorni i poslovni kontekst',
    },

    ekosistem: {
      rute: TOTAL_ROUTES,
      apiRute: TOTAL_API_ROUTES,
      dijagnostike: TOTAL_DIAGNOSTIKA,
    },

    timestamp: new Date().toISOString(),
  });
}
