import type { Sekvenca } from '@/lib/types';
import { buildEktrimliEkstrem } from '@/lib/ekstrimli-ekstrem';
import { AUTOFINISH_COUNT, KOMPANIJA, OMEGA_AI_OKTAVA_COUNT, OMEGA_AI_PERSONA_COUNT, TOTAL_API_ROUTES } from '@/lib/constants';

function trendIkona(direction: 'up' | 'down' | 'flat'): string {
  if (direction === 'up') return '🟢';
  if (direction === 'down') return '🔴';
  return '🟡';
}

export async function getEktrimliEkstremSekvence(): Promise<Sekvenca[]> {
  const e = await buildEktrimliEkstrem();

  return [
    {
      id: 'ekstrimli-ekstrem-hero',
      tip: 'hero',
      naslov: '⚡ EKSTRIMLI EKSTREM — MOŽE SVE',
      podnaslov: `${KOMPANIJA} V4 apsolutni master signal: ${e.ukupanScore}% (${e.konacnaOcena.replace(/_/g, ' ')})`,
      ikona: '⚡',
      redosled: 1,
      podaci: {
        opis: `V4 signal kroz 10 domena: ANALIZA + POTENCIJAL + PROCESUIRANJE + AUTOFINISH + EKSTREMNO + OPERATIVA + SPAJAPRO + GEJMING + PROKSI + OMEGA AI. Contract: ${e.meta.contractVersion}, model: ${e.meta.modelVersion}.`,
        dugmad: [
          { tekst: 'API: Ekstrimli Ekstrem', href: '/api/ekstrimli-ekstrem' },
          { tekst: 'Maksimus 3 (v3)', href: '/maksimus-3', stil: 'sekundarno' },
          { tekst: 'Analiza Svega', href: '/analiza-svega', stil: 'sekundarno' },
          { tekst: 'Procesuiranje 3', href: '/procesuiranje-3', stil: 'sekundarno' },
          { tekst: 'OMEGA AI', href: '/omega-ai', stil: 'sekundarno' },
          { tekst: 'Proksi', href: '/proksi', stil: 'sekundarno' },
        ],
      },
    },
    {
      id: 'ekstrimli-ekstrem-kpi',
      tip: 'statistika',
      naslov: '📊 EKSTRIMLI EKSTREM KPI',
      redosled: 2,
      podaci: {
        stavke: [
          { naziv: 'Ukupan Score', vrednost: `${e.ukupanScore}%`, ikona: '🎯' },
          { naziv: 'Konačna Ocena', vrednost: e.konacnaOcena.replace(/_/g, ' '), ikona: '🏆' },
          {
            naziv: 'Trend',
            vrednost: `${trendIkona(e.trend.direction)} ${e.trend.direction} (${e.trend.deltaScore >= 0 ? '+' : ''}${e.trend.deltaScore})`,
            ikona: '📈',
          },
          { naziv: 'Domeni', vrednost: Object.keys(e.domeni).length, ikona: '🧩' },
          { naziv: 'API Ruta', vrednost: TOTAL_API_ROUTES, ikona: '🔌' },
          { naziv: 'Autofinish #', vrednost: AUTOFINISH_COUNT, ikona: '♻️' },
          { naziv: 'Kritični domeni', vrednost: e.domeniBrojKriticnih, ikona: '🚨' },
          { naziv: 'OMEGA AI persona', vrednost: OMEGA_AI_PERSONA_COUNT, ikona: '🤖' },
          { naziv: 'OMEGA oktava', vrednost: OMEGA_AI_OKTAVA_COUNT, ikona: '🎵' },
          {
            naziv: 'Prosečan confidence',
            vrednost: `${Math.round(Object.values(e.domeni).reduce((sum, d) => sum + d.confidence, 0) / Object.keys(e.domeni).length)}%`,
            ikona: '🎛️',
          },
        ],
      },
    },
    {
      id: 'ekstrimli-ekstrem-domeni',
      tip: 'tabela',
      naslov: '📋 Svih 10 domena — SLA pragovi i doprinos',
      redosled: 3,
      podaci: {
        zaglavlje: ['Domen', 'Score', 'SLA prag', 'Confidence', 'Težina', 'Doprinos', 'Freshness', 'Trend', 'Source of Truth'],
        redovi: Object.values(e.domeni).map((domen) => [
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
      id: 'ekstrimli-ekstrem-progres',
      tip: 'progres',
      naslov: '📈 Ukupni progres EKSTRIMLI EKSTREM',
      redosled: 4,
      podaci: {
        procenat: e.ukupanScore,
        oznaka: `${e.konacnaOcena.replace(/_/g, ' ')} • ${e.procenatSpremnosti}% spremnosti • V4 MOŽE SVE`,
      },
    },
    {
      id: 'ekstrimli-ekstrem-kriticni',
      tip: 'lista',
      naslov: '🚨 Kritični domeni i preporuke',
      redosled: 5,
      podaci: {
        stavke: [
          ...(e.kriticniDomeni.length > 0
            ? e.kriticniDomeni.map((naziv) => `⚠️ ${naziv}`)
            : ['✅ Nema kritičnih domena ispod SLA praga — MOŽE SVE.']),
          ...e.preporuke.map((p) => `📌 ${p}`),
        ],
      },
    },
    {
      id: 'ekstrimli-ekstrem-history',
      tip: 'tabela',
      naslov: '🕐 Istorija snimaka (poslednje 3)',
      redosled: 6,
      podaci: {
        zaglavlje: ['#', 'Score', 'Timestamp'],
        redovi: e.history.length > 0
          ? e.history.map((entry, i) => [String(i + 1), `${entry.score}%`, entry.timestamp])
          : [['—', '—', 'Nema prethodnih snimaka']],
      },
    },
    {
      id: 'ekstrimli-ekstrem-cta',
      tip: 'cta',
      naslov: '⚡ Kanonski EKSTRIMLI EKSTREM endpoint',
      redosled: 99,
      podaci: {
        opis: 'Koristite /api/ekstrimli-ekstrem kao V4 apsolutni master source-of-truth za svih 10 domena — MOŽE SVE.',
        stavke: [
          { naziv: 'Ukupan score', vrednost: `${e.ukupanScore}%`, ikona: '🎯' },
          { naziv: 'Spremnost', vrednost: `${e.procenatSpremnosti}%`, ikona: '✅' },
          { naziv: 'Trend', vrednost: `${e.trend.direction} (${e.trend.deltaScore >= 0 ? '+' : ''}${e.trend.deltaScore})`, ikona: '📈' },
          { naziv: 'Degradacija', vrednost: e.meta.degraded ? 'DA' : 'NE', ikona: e.meta.degraded ? '⚠️' : '🟢' },
          { naziv: 'Kritični domeni', vrednost: e.domeniBrojKriticnih, ikona: '🚨' },
        ],
        dugmad: [
          { tekst: 'Otvori API', href: '/api/ekstrimli-ekstrem' },
          { tekst: 'Maksimus 3 (v3)', href: '/api/maksimus-3', stil: 'sekundarno' },
          { tekst: 'Maksimus 2 (v2)', href: '/api/maksimus-2', stil: 'sekundarno' },
          { tekst: 'Maksimus Svega (v1)', href: '/api/maksimus-svega', stil: 'sekundarno' },
        ],
      },
    },
  ];
}
