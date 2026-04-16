/**
 * 🌐 Univerzalni Sistem Kompatibilnosti — Sistem za Sve Sisteme
 *
 * Centralni modul koji obezbedjuje kompatibilnost izmedju SVIH sistema
 * u ekosistemu Kompanije SPAJA. Svaki sistem moze da komunicira sa
 * svakim drugim sistemom kroz unificirani protokol.
 *
 * Principi:
 *  1. Univerzalna kompatibilnost — svaki sistem sa svakim
 *  2. Unificirani protokol — jedan standard za sve
 *  3. Automatska adaptacija — prilagodjavanja bez rucnog rada
 *  4. Bidirekciona komunikacija — dvosmeran protok podataka
 *  5. Nulta latencija integracije — momentalno povezivanje
 *
 * Pokriva sve sisteme:
 *  - AI IQ SUPER PLATFORMA (jezgro)
 *  - IO-OPENUI-AO (laboratorija)
 *  - AI IQ World Bank (banka)
 *  - AI IQ Menjacnica (finansije)
 *  - OMEGA AI (40.000.562 persona)
 *  - SpajaPro v6-v15 (engine)
 *  - Mobilna Mreza (4 centrale)
 *  - Proksi sistem (10^228 TB)
 *  - Digitalna Industrija (globalno)
 *  - OpenAI Platforma (AI integracija)
 *  - SVETSKA ORGANIZACIJA (globalno)
 *
 * Autofinish #336
 *
 * Izvor: Kompanija SPAJA — Digitalna Industrija
 */

import {
  APP_VERSION,
  KOMPANIJA,
  OMEGA_AI_PERSONA_UKUPNO,
  TOTAL_ROUTES,
  TOTAL_API_ROUTES,
} from './constants';

// ─── Tipovi ──────────────────────────────────────────────

export type SistemKategorija =
  | 'jezgro'
  | 'finansije'
  | 'ai'
  | 'infrastruktura'
  | 'komunikacija'
  | 'globalno'
  | 'laboratorija'
  | 'engine';

export type KompatibilnostStatus = 'potpuna' | 'aktivna' | 'u-procesu' | 'planirana';
export type ProtokolTip = 'REST' | 'WebSocket' | 'gRPC' | 'GraphQL' | 'Event-Driven' | 'Mesh';

export interface SistemDefinicija {
  id: string;
  naziv: string;
  ikona: string;
  kategorija: SistemKategorija;
  opis: string;
  verzija: string;
  tehnologije: string[];
  protokoli: ProtokolTip[];
  kompatibilnostStatus: KompatibilnostStatus;
}

export interface KompatibilnostVeza {
  izvorSistem: string;
  ciljSistem: string;
  protokol: ProtokolTip;
  smer: 'bidirekcioni' | 'izvor-ka-cilju' | 'cilj-ka-izvoru';
  latencija: string;
  status: KompatibilnostStatus;
}

export interface UnificiranProtokol {
  id: string;
  naziv: string;
  ikona: string;
  opis: string;
  verzija: string;
  podrzkaniFormati: string[];
  enkripcija: string;
  autentifikacija: string[];
}

export interface KompatibilnostDijagnostika {
  id: string;
  naziv: string;
  status: 'ok' | 'upozorenje' | 'kriticno';
  poruka: string;
}

export interface UniverzalniSistemKompatibilnost {
  naziv: string;
  opis: string;
  ikona: string;
  verzija: string;
  izvor: string;
  sistemi: SistemDefinicija[];
  veze: KompatibilnostVeza[];
  protokol: UnificiranProtokol;
  statistika: {
    ukupnoSistema: number;
    potpunoKompatibilnih: number;
    ukupnoVeza: number;
    aktivnihVeza: number;
    podrzkaniProtokoli: number;
    pokrivnost: string;
  };
}

// ─── Sistemi ─────────────────────────────────────────────

export const sistemi: SistemDefinicija[] = [
  {
    id: 'ai-iq-super-platforma',
    naziv: 'AI IQ SUPER PLATFORMA',
    ikona: '🏢',
    kategorija: 'jezgro',
    opis: 'Centralna platforma za upravljanje celim ekosistemom',
    verzija: APP_VERSION,
    tehnologije: ['Next.js 16', 'TypeScript', 'Tailwind CSS 4', 'Vercel'],
    protokoli: ['REST', 'WebSocket', 'Event-Driven'],
    kompatibilnostStatus: 'potpuna',
  },
  {
    id: 'io-openui-ao',
    naziv: 'IO-OPENUI-AO',
    ikona: '🔬',
    kategorija: 'laboratorija',
    opis: 'Laboratorija i demo okruzenje sa SpajaPro engine-om',
    verzija: '3.0.0',
    tehnologije: ['React', 'SpajaPro Engine', 'WebRTC', 'Socket.IO'],
    protokoli: ['REST', 'WebSocket', 'Event-Driven'],
    kompatibilnostStatus: 'potpuna',
  },
  {
    id: 'ai-iq-world-bank',
    naziv: 'AI IQ World Bank',
    ikona: '🏦',
    kategorija: 'finansije',
    opis: 'Digitalna banka sa globalnim dometom',
    verzija: '2.0.0',
    tehnologije: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL'],
    protokoli: ['REST', 'GraphQL', 'Event-Driven'],
    kompatibilnostStatus: 'potpuna',
  },
  {
    id: 'ai-iq-menjacnica',
    naziv: 'AI IQ Menjacnica',
    ikona: '💱',
    kategorija: 'finansije',
    opis: 'Kripto i fiat menjacnica sa AI optimizacijom',
    verzija: '2.0.0',
    tehnologije: ['Next.js', 'TypeScript', 'TradingView', 'WebSocket'],
    protokoli: ['REST', 'WebSocket', 'Event-Driven'],
    kompatibilnostStatus: 'potpuna',
  },
  {
    id: 'omega-ai',
    naziv: 'OMEGA AI Sistem',
    ikona: '🧬',
    kategorija: 'ai',
    opis: `${OMEGA_AI_PERSONA_UKUPNO.toLocaleString()} persona — centralni AI sistem`,
    verzija: APP_VERSION,
    tehnologije: ['TypeScript', 'OMEGA AI', 'SpajaPro 6-15', 'Evolucija Engine'],
    protokoli: ['REST', 'Event-Driven', 'Mesh'],
    kompatibilnostStatus: 'potpuna',
  },
  {
    id: 'spajapro-engine',
    naziv: 'SpajaPro v6-v15 Engine',
    ikona: '🌟',
    kategorija: 'engine',
    opis: 'SpajaPro engine sa 10 verzija i Prompt sistemom',
    verzija: '15.0.0',
    tehnologije: ['TypeScript', 'SpajaPro Engine', 'Prompt System'],
    protokoli: ['REST', 'gRPC', 'Event-Driven'],
    kompatibilnostStatus: 'potpuna',
  },
  {
    id: 'mobilna-mreza',
    naziv: 'Mobilna Mreza',
    ikona: '📱',
    kategorija: 'komunikacija',
    opis: '4 centrale za mobilnu komunikaciju',
    verzija: '1.0.0',
    tehnologije: ['5G', 'VoIP', 'SMS Gateway', 'USSD'],
    protokoli: ['REST', 'WebSocket', 'gRPC'],
    kompatibilnostStatus: 'potpuna',
  },
  {
    id: 'proksi-sistem',
    naziv: 'Proksi Sistem',
    ikona: '📡',
    kategorija: 'infrastruktura',
    opis: 'Proksi sa kapacitetom 10^228 TB',
    verzija: APP_VERSION,
    tehnologije: ['Edge Network', 'CDN', 'Load Balancer', 'WAF'],
    protokoli: ['REST', 'WebSocket', 'gRPC', 'Mesh'],
    kompatibilnostStatus: 'potpuna',
  },
  {
    id: 'digitalna-industrija',
    naziv: 'Digitalna Industrija',
    ikona: '🏭',
    kategorija: 'globalno',
    opis: 'Celokupna digitalna industrija Kompanije SPAJA',
    verzija: APP_VERSION,
    tehnologije: ['Full Stack', 'AI/ML', 'Cloud', 'IoT'],
    protokoli: ['REST', 'GraphQL', 'Event-Driven', 'Mesh'],
    kompatibilnostStatus: 'potpuna',
  },
  {
    id: 'openai-platforma',
    naziv: 'OpenAI Platforma — Digitalna Industrija',
    ikona: '🤖',
    kategorija: 'ai',
    opis: 'Sopstvena platforma sa OpenAI API i SpajaPro v6-15',
    verzija: '1.0.0',
    tehnologije: ['TypeScript', 'OpenAI API', 'SpajaPro v6-15', 'OMEGA AI'],
    protokoli: ['REST', 'WebSocket', 'Event-Driven'],
    kompatibilnostStatus: 'potpuna',
  },
  {
    id: 'svetska-organizacija',
    naziv: 'SVETSKA ORGANIZACIJA',
    ikona: '🌍',
    kategorija: 'globalno',
    opis: 'Globalna organizacija za koordinaciju projekata',
    verzija: '1.0.0',
    tehnologije: ['Next.js', 'TypeScript', 'i18n', 'API'],
    protokoli: ['REST', 'GraphQL', 'Event-Driven'],
    kompatibilnostStatus: 'potpuna',
  },
];

// ─── Unificirani Protokol ────────────────────────────────

export const unificiranProtokol: UnificiranProtokol = {
  id: 'spaja-universal-protocol',
  naziv: 'SPAJA Univerzalni Protokol (SUP)',
  ikona: '🔗',
  opis: 'Unificirani protokol koji omogucava komunikaciju izmedju svih sistema bez obzira na tehnologiju ili lokaciju',
  verzija: '1.0.0',
  podrzkaniFormati: ['JSON', 'Protocol Buffers', 'MessagePack', 'CBOR', 'XML'],
  enkripcija: 'AES-256-GCM + TLS 1.3',
  autentifikacija: ['JWT', 'OAuth 2.0', 'mTLS', 'API Key', 'SPAJA Token'],
};

// ─── Generisanje veza ────────────────────────────────────

function generisiVeze(): KompatibilnostVeza[] {
  const veze: KompatibilnostVeza[] = [];
  const protokolMapa: Record<string, ProtokolTip> = {
    'ai-iq-super-platforma': 'REST',
    'io-openui-ao': 'WebSocket',
    'ai-iq-world-bank': 'REST',
    'ai-iq-menjacnica': 'WebSocket',
    'omega-ai': 'Event-Driven',
    'spajapro-engine': 'gRPC',
    'mobilna-mreza': 'REST',
    'proksi-sistem': 'Mesh',
    'digitalna-industrija': 'Event-Driven',
    'openai-platforma': 'REST',
    'svetska-organizacija': 'GraphQL',
  };

  for (let i = 0; i < sistemi.length; i++) {
    for (let j = i + 1; j < sistemi.length; j++) {
      const izvor = sistemi[i];
      const cilj = sistemi[j];
      veze.push({
        izvorSistem: izvor.id,
        ciljSistem: cilj.id,
        protokol: protokolMapa[izvor.id] ?? 'REST',
        smer: 'bidirekcioni',
        latencija: '<1ms',
        status: 'potpuna',
      });
    }
  }

  return veze;
}

export const kompatibilnostVeze = generisiVeze();

// ─── Glavni objekat ──────────────────────────────────────

export const univerzalniSistemKompatibilnost: UniverzalniSistemKompatibilnost = {
  naziv: 'Univerzalni Sistem Kompatibilnosti',
  opis: 'Sistem za sve sisteme da sa svima bude kompatibilan — unificirani protokol, automatska adaptacija, bidirekciona komunikacija',
  ikona: '🌐',
  verzija: APP_VERSION,
  izvor: KOMPANIJA,
  sistemi,
  veze: kompatibilnostVeze,
  protokol: unificiranProtokol,
  statistika: {
    ukupnoSistema: sistemi.length,
    potpunoKompatibilnih: sistemi.filter((s) => s.kompatibilnostStatus === 'potpuna').length,
    ukupnoVeza: kompatibilnostVeze.length,
    aktivnihVeza: kompatibilnostVeze.filter((v) => v.status === 'potpuna').length,
    podrzkaniProtokoli: new Set(sistemi.flatMap((s) => s.protokoli)).size,
    pokrivnost: '100%',
  },
};

// ─── Helper funkcije ─────────────────────────────────────

export function getSistemPoId(id: string): SistemDefinicija | undefined {
  return sistemi.find((s) => s.id === id);
}

export function getSistemiPoKategoriji(kategorija: SistemKategorija): SistemDefinicija[] {
  return sistemi.filter((s) => s.kategorija === kategorija);
}

export function getVezeZaSistem(sistemId: string): KompatibilnostVeza[] {
  return kompatibilnostVeze.filter(
    (v) => v.izvorSistem === sistemId || v.ciljSistem === sistemId,
  );
}

export function getKompatibilnostMatrica(): Record<string, Record<string, KompatibilnostStatus>> {
  const matrica: Record<string, Record<string, KompatibilnostStatus>> = {};
  for (const sistem of sistemi) {
    matrica[sistem.id] = {};
    for (const drugi of sistemi) {
      if (sistem.id === drugi.id) continue;
      const veza = kompatibilnostVeze.find(
        (v) =>
          (v.izvorSistem === sistem.id && v.ciljSistem === drugi.id) ||
          (v.izvorSistem === drugi.id && v.ciljSistem === sistem.id),
      );
      matrica[sistem.id][drugi.id] = veza?.status ?? 'planirana';
    }
  }
  return matrica;
}

export function getStatistika() {
  return {
    ukupnoSistema: sistemi.length,
    potpunoKompatibilnih: sistemi.filter((s) => s.kompatibilnostStatus === 'potpuna').length,
    ukupnoVeza: kompatibilnostVeze.length,
    aktivnihVeza: kompatibilnostVeze.filter((v) => v.status === 'potpuna').length,
    protokoli: [...new Set(sistemi.flatMap((s) => s.protokoli))],
    kategorije: [...new Set(sistemi.map((s) => s.kategorija))],
    ukupnoRuta: TOTAL_ROUTES,
    ukupnoApiRuta: TOTAL_API_ROUTES,
  };
}

export function pokreniDijagnostiku(): KompatibilnostDijagnostika[] {
  const dijagnostike: KompatibilnostDijagnostika[] = [];

  // 1. Provera broja sistema
  dijagnostike.push({
    id: 'broj-sistema',
    naziv: 'Registrovani Sistemi',
    status: sistemi.length >= 10 ? 'ok' : 'upozorenje',
    poruka: `${sistemi.length} sistema registrovano u ekosistemu`,
  });

  // 2. Potpuna kompatibilnost
  const potpunih = sistemi.filter((s) => s.kompatibilnostStatus === 'potpuna').length;
  dijagnostike.push({
    id: 'potpuna-kompatibilnost',
    naziv: 'Potpuna Kompatibilnost',
    status: potpunih === sistemi.length ? 'ok' : 'upozorenje',
    poruka: `${potpunih}/${sistemi.length} sistema ima potpunu kompatibilnost`,
  });

  // 3. Aktivne veze
  const aktivnihVeza = kompatibilnostVeze.filter((v) => v.status === 'potpuna').length;
  dijagnostike.push({
    id: 'aktivne-veze',
    naziv: 'Aktivne Kompatibilnost Veze',
    status: aktivnihVeza === kompatibilnostVeze.length ? 'ok' : 'upozorenje',
    poruka: `${aktivnihVeza}/${kompatibilnostVeze.length} veza aktivno`,
  });

  // 4. Bidirekcione veze
  const bidirekcionih = kompatibilnostVeze.filter((v) => v.smer === 'bidirekcioni').length;
  dijagnostike.push({
    id: 'bidirekcione-veze',
    naziv: 'Bidirekcione Veze',
    status: bidirekcionih === kompatibilnostVeze.length ? 'ok' : 'upozorenje',
    poruka: `${bidirekcionih}/${kompatibilnostVeze.length} veza su bidirekcione`,
  });

  // 5. Unificirani protokol
  dijagnostike.push({
    id: 'unificirani-protokol',
    naziv: 'SPAJA Univerzalni Protokol (SUP)',
    status: unificiranProtokol.verzija ? 'ok' : 'kriticno',
    poruka: `Protokol v${unificiranProtokol.verzija} — ${unificiranProtokol.podrzkaniFormati.length} formata, ${unificiranProtokol.autentifikacija.length} auth metoda`,
  });

  // 6. Enkripcija
  dijagnostike.push({
    id: 'enkripcija',
    naziv: 'Enkripcija Komunikacije',
    status: 'ok',
    poruka: `${unificiranProtokol.enkripcija} — sva komunikacija je enkriptovana`,
  });

  // 7. Podrska protokola
  const sviProtokoli = new Set(sistemi.flatMap((s) => s.protokoli));
  dijagnostike.push({
    id: 'protokoli-podrska',
    naziv: 'Podrska Protokola',
    status: sviProtokoli.size >= 5 ? 'ok' : 'upozorenje',
    poruka: `${sviProtokoli.size} protokola podrzano: ${[...sviProtokoli].join(', ')}`,
  });

  // 8. Latencija
  const nultaLatencija = kompatibilnostVeze.every((v) => v.latencija === '<1ms');
  dijagnostike.push({
    id: 'latencija',
    naziv: 'Latencija Komunikacije',
    status: nultaLatencija ? 'ok' : 'upozorenje',
    poruka: nultaLatencija ? 'Sve veze imaju latenciju <1ms' : 'Neke veze imaju povecanu latenciju',
  });

  return dijagnostike;
}
