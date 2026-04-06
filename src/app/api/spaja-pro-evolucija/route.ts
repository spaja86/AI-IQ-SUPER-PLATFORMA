import { NextResponse } from 'next/server';
import {
  APP_VERSION,
  SPAJA_PRO_RANGE,
  SPAJA_PRO_VERZIJA_COUNT,
} from '@/lib/constants';

export async function GET() {
  const verzije = Array.from({ length: SPAJA_PRO_VERZIJA_COUNT }, (_, i) => ({
    verzija: `v${i + 6}`,
    stadijum: i < 3 ? 'bazni' : i < 6 ? 'napredni' : i < 9 ? 'ekspertski' : 'master',
    mogucnosti: getMogucnosti(i + 6),
    evolucijskiIndeks: ((i + 1) / SPAJA_PRO_VERZIJA_COUNT * 100).toFixed(0) + '%',
  }));

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'SpajaPro Evolucija — Razvoj Verzija',
    verzija: APP_VERSION,

    pregled: {
      rasponVerzija: SPAJA_PRO_RANGE,
      brojVerzija: SPAJA_PRO_VERZIJA_COUNT,
      trenutnaAktivna: `v${SPAJA_PRO_VERZIJA_COUNT + 5}`,
    },

    evolucijskeFaze: [
      { faza: 'Bazni', verzije: 'v6–v8', opis: 'Osnovni prompt engine, bazne komande' },
      { faza: 'Napredni', verzije: 'v9–v11', opis: 'OMEGA integracija, kontekstualni promptovi' },
      { faza: 'Ekspertski', verzije: 'v12–v14', opis: 'Matricna optimizacija, multi-oktavno procesiranje' },
      { faza: 'Master', verzije: 'v15', opis: 'Puna transcendentna integracija, -∞Ω+∞' },
    ],

    verzije,

    timestamp: new Date().toISOString(),
  });
}

function getMogucnosti(v: number): string[] {
  const bazne = ['Tekst generisanje', 'Prompt parsiranje'];
  if (v >= 8) bazne.push('Kontekstualna analiza');
  if (v >= 10) bazne.push('OMEGA AI integracija');
  if (v >= 12) bazne.push('Matricna optimizacija');
  if (v >= 14) bazne.push('Multi-oktavno procesiranje');
  if (v >= 15) bazne.push('Transcendentna integracija');
  return bazne;
}
