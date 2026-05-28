import type { Sekvenca } from '@/lib/types';
import { buildMaksimus3 } from '@/lib/maksimus-3';
import { AUTOFINISH_COUNT, KOMPANIJA, TOTAL_API_ROUTES } from '@/lib/constants';

function trendIkona(direction: 'up' | 'down' | 'flat'): string {
  if (direction === 'up') return '🟢';
  if (direction === 'down') return '🔴';
  return '🟡';
}

export async function getMaksimus3Sekvence(): Promise<Sekvenca[]> {
  const m = await buildMaksimus3();

  return [
    {
      id: 'maksimus-3-hero',
      tip: 'hero',
      naslov: '🚀 MAKSIMUS 3 — Digitalna Industrija',
      podnaslov: `${KOMPANIJA} master signal v3: ${m.ukupanScore}% (${m.konacnaOcena.replace(/_/g, ' ')})`,
      ikona: '🚀',
      redosled: 1,
      podaci: {
        opis: `V3 objedinjeni signal kroz 8 domena: ANALIZA + POTENCIJAL + PROCESUIRANJE + AUTOFINISH + EKSTREMNO PROCESUIRANJE + OPERATIVNA SPREMNOST + SPAJAPRO + GEJMING. Contract: ${m.meta.contractVersion}, model: ${m.meta.modelVersion}.`,
        dugmad: [
          { tekst: 'API: Maksimus 3', href: '/api/maksimus-3' },
          { tekst: 'Analiza Svega', href: '/analiza-svega', stil: 'sekundarno' },
          { tekst: 'Procesuiranje Svega', href: '/procesuiranje-svega', stil: 'sekundarno' },
          { tekst: 'Potencijal Svega', href: '/potencijal-svega-ovoga-do-sada', stil: 'sekundarno' },
          { tekst: 'Ekstremno Procesuiranje', href: '/api/ekstremno-procesuiranje-svega', stil: 'sekundarno' },
          { tekst: 'SpajaPro', href: '/spaja-pro', stil: 'sekundarno' },
          { tekst: 'Gejming Industrija', href: '/gejming-industrija', stil: 'sekundarno' },
        ],
      },
    },
    {
      id: 'maksimus-3-kpi',
      tip: 'statistika',
      naslov: '📊 MAKSIMUS 3 KPI',
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
      id: 'maksimus-3-domeni',
      tip: 'tabela',
      naslov: '📋 Domeni, SLA pragovi i doprinos',
      redosled: 3,
      podaci: {
        zaglavlje: ['Domen', 'Score', 'SLA prag', 'Confidence', 'Težina', 'Doprinos', 'Freshness', 'Trend', 'Source of Truth'],
        redovi: Object.values(m.domeni).map((domen) => [
          domen.naziv,
          `${domen.score}%`,
          `${domen.slaThreshold}%`,
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
      id: 'maksimus-3-progres',
      tip: 'progres',
      naslov: '📈 Ukupni progres MAKSIMUS 3',
      redosled: 4,
      podaci: {
        procenat: m.ukupanScore,
        oznaka: `${m.konacnaOcena.replace(/_/g, ' ')} • ${m.procenatSpremnosti}% spremnosti`,
      },
    },
    {
      id: 'maksimus-3-kriticni',
      tip: 'lista',
      naslov: '🚨 Kritični domeni i preporuke',
      redosled: 5,
      podaci: {
        stavke: [
          ...(m.kriticniDomeni.length > 0
            ? m.kriticniDomeni.map((naziv) => `⚠️ ${naziv}`)
            : ['✅ Nema kritičnih domena ispod SLA praga.']),
          ...m.preporuke.map((p) => `📌 ${p}`),
        ],
      },
    },
    {
      id: 'maksimus-3-history',
      tip: 'tabela',
      naslov: '🕐 Istorija snimaka (poslednje 3)',
      redosled: 6,
      podaci: {
        zaglavlje: ['#', 'Score', 'Timestamp'],
        redovi: m.history.length > 0
          ? m.history.map((entry, i) => [String(i + 1), `${entry.score}%`, entry.timestamp])
          : [['—', '—', 'Nema prethodnih snimaka']],
      },
    },
    {
      id: 'maksimus-3-cta',
      tip: 'cta',
      naslov: '🛰️ Kanonski MAKSIMUS 3 endpoint',
      redosled: 99,
      podaci: {
        opis: 'Koristite /api/maksimus-3 kao v3 master source-of-truth za objedinjeni signal svih 8 ključnih domena sa per-domain SLA pragovima i multi-snapshot istorijom.',
        stavke: [
          { naziv: 'Ukupan score', vrednost: `${m.ukupanScore}%`, ikona: '🎯' },
          { naziv: 'Spremnost', vrednost: `${m.procenatSpremnosti}%`, ikona: '✅' },
          { naziv: 'Trend', vrednost: `${m.trend.direction} (${m.trend.deltaScore >= 0 ? '+' : ''}${m.trend.deltaScore})`, ikona: '📈' },
          { naziv: 'Degradacija', vrednost: m.meta.degraded ? 'DA' : 'NE', ikona: m.meta.degraded ? '⚠️' : '🟢' },
          { naziv: 'Kritični domeni', vrednost: m.domeniBrojKriticnih, ikona: '🚨' },
        ],
        dugmad: [
          { tekst: 'Otvori API', href: '/api/maksimus-3' },
          { tekst: 'Maksimus 2 (v2)', href: '/api/maksimus-2', stil: 'sekundarno' },
          { tekst: 'Maksimus Svega (v1)', href: '/api/maksimus-svega', stil: 'sekundarno' },
        ],
      },
    },
  ];
}
