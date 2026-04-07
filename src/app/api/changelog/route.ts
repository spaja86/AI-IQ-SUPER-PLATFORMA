import { NextResponse } from 'next/server';
import { APP_VERSION, AUTOFINISH_COUNT, AUTOFINISH_TARGET } from '@/lib/constants';

const changelog = [
  { verzija: '7.1.0', datum: '2026-04-05', opis: 'Autofinish #21 — /api/changelog, Twitter metadata, accessibility, 31 dijagnostika' },
  { verzija: '7.0.0', datum: '2026-04-05', opis: 'Major milestone — 60 ruta, 30 dijagnostika, 28 API, PWA manifest, EN entities' },
  { verzija: '6.9.0', datum: '2026-04-05', opis: 'Sekvence za EN stranice, /api/evolucija + /api/statistike, 29 dijagnostika' },
  { verzija: '6.8.0', datum: '2026-04-04', opis: '3 nova API (kompanije, organizacije, proizvodi), robots.txt, JSON-LD, 55 ruta' },
  { verzija: '6.7.0', datum: '2026-04-04', opis: 'Constants centralizacija, SEO metadata, 47 ruta, 23 dijagnostike' },
  { verzija: '6.6.0', datum: '2026-04-03', opis: 'Ekosistem API, 43 rute, 30 statistika, finalna optimizacija' },
  { verzija: '6.5.0', datum: '2026-04-03', opis: 'Dimenzije, auto-popravka, Mobilna Mreža, 42 rute' },
  { verzija: '6.4.0', datum: '2026-04-02', opis: 'Igrice proširenje — 95 igrica, OpenAI + OMEGA AI platforme' },
  { verzija: '6.3.0', datum: '2026-04-02', opis: 'Igrice — 90 igrica, 56 IT proizvoda, gaming engine ekosistem' },
  { verzija: '6.2.0', datum: '2026-04-01', opis: 'Igrice sistem — 36 igrica, gaming IT proizvodi' },
  { verzija: '6.1.0', datum: '2026-04-01', opis: 'Dashboard proširenje, evolucija, 30 statistika' },
  { verzija: '6.0.0', datum: '2026-03-31', opis: 'Proksi, Mobilna Mreža, WiFi Antena, 14 platformi' },
  { verzija: '5.4.0', datum: '2026-03-31', opis: 'SpajaUltraOmegaCore, SpajaPro, Sajtovi' },
];

export async function GET() {
  return NextResponse.json({
    platforma: 'AI IQ SUPER PLATFORMA',
    trenutnaVerzija: APP_VERSION,
    autofinish: {
      iteracija: AUTOFINISH_COUNT,
      cilj: AUTOFINISH_TARGET,
      ciljFormatiran: '3×10¹⁷',
    },
    changelog,
    ukupnoVerzija: changelog.length,
    timestamp: new Date().toISOString(),
  });
}
