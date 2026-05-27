import type { Sekvenca } from '@/lib/types';
import { buildMaksimusSvega } from '@/lib/maksimus-svega';
import { AUTOFINISH_COUNT, KOMPANIJA, TOTAL_API_ROUTES } from '@/lib/constants';

export async function getMaksimusSvegaSekvence(): Promise<Sekvenca[]> {
  const m = await buildMaksimusSvega();

  return [
    {
      id: 'maksimus-svega-hero',
      tip: 'hero',
      naslov: '🚀 MAKSIMUS SVEGA — Digitalna Industrija',
      podnaslov: `${KOMPANIJA} master signal: ${m.ukupanScore}% (${m.konacnaOcena})`,
      ikona: '🚀',
      redosled: 1,
      podaci: {
        opis: `Objedinjeni pregled ANALIZA + POTENCIJAL + PROCESUIRANJE + AUTOFINISH orkestracije. Contract: ${m.meta.contractVersion}, model: ${m.meta.modelVersion}.`,
        dugmad: [
          { tekst: 'API: Maksimus Svega', href: '/api/maksimus-svega' },
          { tekst: 'Analiza Svega', href: '/analiza-svega', stil: 'sekundarno' },
          { tekst: 'Procesuiranje Svega', href: '/procesuiranje-svega', stil: 'sekundarno' },
          { tekst: 'Potencijal Svega', href: '/potencijal-svega-ovoga-do-sada', stil: 'sekundarno' },
        ],
      },
    },
    {
      id: 'maksimus-svega-kpi',
      tip: 'statistika',
      naslov: '📊 MAKSIMUS KPI',
      redosled: 2,
      podaci: {
        stavke: [
          { naziv: 'Ukupan Score', vrednost: `${m.ukupanScore}%`, ikona: '🎯' },
          { naziv: 'Konačna Ocena', vrednost: m.konacnaOcena.replace(/_/g, ' '), ikona: '🏆' },
          { naziv: 'API Ruta', vrednost: TOTAL_API_ROUTES, ikona: '🔌' },
          { naziv: 'Autofinish #', vrednost: AUTOFINISH_COUNT, ikona: '♻️' },
          { naziv: 'Kritični domeni', vrednost: m.kriticniDomeni.length, ikona: '🚨' },
          { naziv: 'Contract', vrednost: m.meta.contractVersion, ikona: '🧾' },
        ],
      },
    },
    {
      id: 'maksimus-svega-domeni',
      tip: 'tabela',
      naslov: '📋 Domeni i doprinos',
      redosled: 3,
      podaci: {
        zaglavlje: ['Domen', 'Score', 'Težina', 'Doprinos', 'Freshness', 'Source of Truth'],
        redovi: Object.values(m.domeni).map((domen) => [
          domen.naziv,
          `${domen.score}%`,
          `${Math.round(domen.tezina * 100)}%`,
          `${domen.doprinos}%`,
          domen.freshness,
          domen.sourceOfTruth,
        ]),
      },
    },
    {
      id: 'maksimus-svega-kriticni',
      tip: 'lista',
      naslov: '🚨 Kritični domeni i preporuke',
      redosled: 4,
      podaci: {
        stavke: [
          ...(m.kriticniDomeni.length > 0
            ? m.kriticniDomeni.map((naziv) => `⚠️ ${naziv}`)
            : ['✅ Nema kritičnih domena ispod praga 75%.']),
          ...m.preporuke.map((p) => `📌 ${p}`),
        ],
      },
    },
    {
      id: 'maksimus-svega-cta',
      tip: 'cta',
      naslov: '🛰️ Kanonski MAKSIMUS endpoint',
      redosled: 99,
      podaci: {
        opis: 'Koristite /api/maksimus-svega kao master source-of-truth za objedinjeni signal svih ključnih SVEGA domena.',
        stavke: [
          { naziv: 'Ukupan score', vrednost: `${m.ukupanScore}%`, ikona: '🎯' },
          { naziv: 'Spremnost', vrednost: `${m.procenatSpremnosti}%`, ikona: '✅' },
          { naziv: 'Degradacija', vrednost: m.meta.degraded ? 'DA' : 'NE', ikona: m.meta.degraded ? '⚠️' : '🟢' },
          { naziv: 'Kritični domeni', vrednost: m.kriticniDomeni.length, ikona: '🚨' },
        ],
        dugmad: [
          { tekst: 'Otvori API', href: '/api/maksimus-svega' },
          { tekst: 'Autofinish Svega', href: '/api/autofinish-svega', stil: 'sekundarno' },
        ],
      },
    },
  ];
}
