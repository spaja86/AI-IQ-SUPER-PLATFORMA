import type { Sekvenca } from '@/lib/types';
import { buildSveOdSvega } from '@/lib/sve-od-svega';
import { AUTOFINISH_COUNT, KOMPANIJA, TOTAL_API_ROUTES } from '@/lib/constants';

export async function getSveOdSvegaSekvence(): Promise<Sekvenca[]> {
  const s = await buildSveOdSvega();

  return [
    {
      id: 'sve-od-svega-hero',
      tip: 'hero',
      naslov: '🌌 SVE OD SVEGA — Digitalna Industrija',
      podnaslov: `${KOMPANIJA} ultimativni signal: ${s.ukupanScore}% (${s.konacnaOcena})`,
      ikona: '🌌',
      redosled: 1,
      podaci: {
        opis: `Objedinjeni mega-signal: ANALIZA + POTENCIJAL + PROCESUIRANJE + AUTOFINISH ORKESTRACIJA. Contract: ${s.meta.contractVersion}, model: ${s.meta.modelVersion}.`,
        dugmad: [
          { tekst: 'API: Sve Od Svega', href: '/api/sve-od-svega' },
          { tekst: 'Analiza Svega', href: '/analiza-svega', stil: 'sekundarno' },
          { tekst: 'Procesuiranje Svega', href: '/procesuiranje-svega', stil: 'sekundarno' },
          { tekst: 'Maksimus Svega', href: '/maksimus-svega', stil: 'sekundarno' },
        ],
      },
    },
    {
      id: 'sve-od-svega-kpi',
      tip: 'statistika',
      naslov: '📊 SVE OD SVEGA KPI',
      redosled: 2,
      podaci: {
        stavke: [
          { naziv: 'Ukupan Score', vrednost: `${s.ukupanScore}%`, ikona: '🎯' },
          { naziv: 'Konačna Ocena', vrednost: s.konacnaOcena.replace(/_/g, ' '), ikona: '🏆' },
          { naziv: 'API Ruta', vrednost: TOTAL_API_ROUTES, ikona: '🔌' },
          { naziv: 'Autofinish #', vrednost: AUTOFINISH_COUNT, ikona: '♻️' },
          { naziv: 'Kritični domeni', vrednost: s.kriticniDomeni.length, ikona: '🚨' },
          { naziv: 'Contract', vrednost: s.meta.contractVersion, ikona: '🧾' },
          { naziv: 'Degradiran', vrednost: s.meta.degraded ? 'DA' : 'NE', ikona: s.meta.degraded ? '⚠️' : '🟢' },
          { naziv: 'Domeni', vrednost: Object.keys(s.domeni).length, ikona: '🌐' },
        ],
      },
    },
    {
      id: 'sve-od-svega-domeni',
      tip: 'tabela',
      naslov: '📋 Domeni — doprinos i težine',
      redosled: 3,
      podaci: {
        zaglavlje: ['Domen', 'Score', 'Težina', 'Doprinos', 'Freshness', 'Source of Truth'],
        redovi: Object.values(s.domeni).map((d) => [
          d.naziv,
          `${d.score}%`,
          `${Math.round(d.tezina * 100)}%`,
          `${d.doprinos}%`,
          d.freshness,
          d.sourceOfTruth,
        ]),
      },
    },
    {
      id: 'sve-od-svega-kriticni',
      tip: 'lista',
      naslov: '🚨 Kritični domeni i preporuke',
      redosled: 4,
      podaci: {
        stavke: [
          ...(s.kriticniDomeni.length > 0
            ? s.kriticniDomeni.map((naziv) => `⚠️ ${naziv}`)
            : ['✅ Nema kritičnih domena ispod praga 75%.']),
          ...s.preporuke.map((p) => `📌 ${p}`),
        ],
      },
    },
    {
      id: 'sve-od-svega-cta',
      tip: 'cta',
      naslov: '🌌 Kanonski SVE OD SVEGA endpoint',
      redosled: 99,
      podaci: {
        opis: 'Koristite /api/sve-od-svega kao ultimativni source-of-truth koji agregira sve ključne "svega" domene Digitalne Industrije u jedan mega-signal.',
        stavke: [
          { naziv: 'Ukupan score', vrednost: `${s.ukupanScore}%`, ikona: '🎯' },
          { naziv: 'Spremnost', vrednost: `${s.procenatSpremnosti}%`, ikona: '✅' },
          { naziv: 'Degradacija', vrednost: s.meta.degraded ? 'DA' : 'NE', ikona: s.meta.degraded ? '⚠️' : '🟢' },
          { naziv: 'Kritični domeni', vrednost: s.kriticniDomeni.length, ikona: '🚨' },
        ],
        dugmad: [
          { tekst: 'Otvori API', href: '/api/sve-od-svega' },
          { tekst: 'Maksimus Svega', href: '/maksimus-svega', stil: 'sekundarno' },
        ],
      },
    },
  ];
}
