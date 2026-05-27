import type { Sekvenca } from '@/lib/types';
import { buildMaksimus2 } from '@/lib/maksimus-2';
import { AUTOFINISH_COUNT, KOMPANIJA, TOTAL_API_ROUTES } from '@/lib/constants';

function trendIkona(direction: 'up' | 'down' | 'flat'): string {
  if (direction === 'up') return '🟢';
  if (direction === 'down') return '🔴';
  return '🟡';
}

export async function getMaksimus2Sekvence(): Promise<Sekvenca[]> {
  const m = await buildMaksimus2();

  return [
    {
      id: 'maksimus-2-hero',
      tip: 'hero',
      naslov: '🚀 MAKSIMUS 2 — Digitalna Industrija',
      podnaslov: `${KOMPANIJA} master signal v2: ${m.ukupanScore}% (${m.konacnaOcena})`,
      ikona: '🚀',
      redosled: 1,
      podaci: {
        opis: `V2 objedinjeni signal kroz 6 domena: ANALIZA + POTENCIJAL + PROCESUIRANJE + AUTOFINISH + EKSTREMNO PROCESUIRANJE + OPERATIVNA SPREMNOST. Contract: ${m.meta.contractVersion}, model: ${m.meta.modelVersion}.`,
        dugmad: [
          { tekst: 'API: Maksimus 2', href: '/api/maksimus-2' },
          { tekst: 'Analiza Svega', href: '/analiza-svega', stil: 'sekundarno' },
          { tekst: 'Procesuiranje Svega', href: '/procesuiranje-svega', stil: 'sekundarno' },
          { tekst: 'Potencijal Svega', href: '/potencijal-svega-ovoga-do-sada', stil: 'sekundarno' },
          { tekst: 'Ekstremno Procesuiranje', href: '/api/ekstremno-procesuiranje-svega', stil: 'sekundarno' },
        ],
      },
    },
    {
      id: 'maksimus-2-kpi',
      tip: 'statistika',
      naslov: '📊 MAKSIMUS 2 KPI',
      redosled: 2,
      podaci: {
        stavke: [
          { naziv: 'Ukupan Score', vrednost: `${m.ukupanScore}%`, ikona: '🎯' },
          { naziv: 'Konačna Ocena', vrednost: m.konacnaOcena.replace(/_/g, ' '), ikona: '🏆' },
          {
            naziv: 'Trend',
            vrednost: `${trendIkona(m.trend.direction)} ${m.trend.direction} (${m.trend.deltaScore >= 0 ? '+' : ''}${m.trend.deltaScore})`,
            ikona: '📈',
          },
          { naziv: 'Domeni', vrednost: Object.keys(m.domeni).length, ikona: '🧩' },
          { naziv: 'API Ruta', vrednost: TOTAL_API_ROUTES, ikona: '🔌' },
          { naziv: 'Autofinish #', vrednost: AUTOFINISH_COUNT, ikona: '♻️' },
          { naziv: 'Kritični domeni', vrednost: m.domeniBrojKriticnih, ikona: '🚨' },
          {
            naziv: 'Prosečan confidence',
            vrednost: `${Math.round(Object.values(m.domeni).reduce((sum, d) => sum + d.confidence, 0) / Object.keys(m.domeni).length)}%`,
            ikona: '🎛️',
          },
        ],
      },
    },
    {
      id: 'maksimus-2-domeni',
      tip: 'tabela',
      naslov: '📋 Domeni i doprinos',
      redosled: 3,
      podaci: {
        zaglavlje: ['Domen', 'Score', 'Confidence', 'Težina', 'Doprinos', 'Freshness', 'Trend', 'Source of Truth'],
        redovi: Object.values(m.domeni).map((domen) => [
          domen.naziv,
          `${domen.score}%`,
          `${domen.confidence}%`,
          `${Math.round(domen.tezina * 100)}%`,
          `${domen.doprinos}%`,
          domen.freshness,
          `${trendIkona(domen.trendDirection)} ${domen.trendDirection}`,
          domen.sourceOfTruth,
        ]),
      },
    },
    {
      id: 'maksimus-2-progres',
      tip: 'progres',
      naslov: '📈 Ukupni progres MAKSIMUS 2',
      redosled: 4,
      podaci: {
        procenat: m.ukupanScore,
        oznaka: `${m.konacnaOcena.replace(/_/g, ' ')} • ${m.procenatSpremnosti}% spremnosti`,
      },
    },
    {
      id: 'maksimus-2-kriticni',
      tip: 'lista',
      naslov: '🚨 Kritični domeni i preporuke',
      redosled: 5,
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
      id: 'maksimus-2-cta',
      tip: 'cta',
      naslov: '🛰️ Kanonski MAKSIMUS 2 endpoint',
      redosled: 99,
      podaci: {
        opis: 'Koristite /api/maksimus-2 kao v2 master source-of-truth za objedinjeni signal svih ključnih domena.',
        stavke: [
          { naziv: 'Ukupan score', vrednost: `${m.ukupanScore}%`, ikona: '🎯' },
          { naziv: 'Spremnost', vrednost: `${m.procenatSpremnosti}%`, ikona: '✅' },
          { naziv: 'Trend', vrednost: `${m.trend.direction} (${m.trend.deltaScore >= 0 ? '+' : ''}${m.trend.deltaScore})`, ikona: '📈' },
          { naziv: 'Degradacija', vrednost: m.meta.degraded ? 'DA' : 'NE', ikona: m.meta.degraded ? '⚠️' : '🟢' },
          { naziv: 'Kritični domeni', vrednost: m.domeniBrojKriticnih, ikona: '🚨' },
        ],
        dugmad: [
          { tekst: 'Otvori API', href: '/api/maksimus-2' },
          { tekst: 'Maksimus Svega (v1)', href: '/api/maksimus-svega', stil: 'sekundarno' },
        ],
      },
    },
  ];
}
