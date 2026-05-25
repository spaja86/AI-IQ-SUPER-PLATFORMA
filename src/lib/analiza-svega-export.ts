import type { AnalizaSvega } from './analiza-svega';

function csvEscape(value: unknown): string {
  const str = String(value ?? '');
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Serializuje ANALIZA SVEGA payload u CSV.
 * Prvi deo sadrži redove po domenu, a drugi deo summary sekciju.
 */
export function serializeAnalizaSvegaCSV(analiza: AnalizaSvega): string {
  const header = [
    'domen',
    'score',
    'ocena',
    'confidence',
    'freshness',
    'izvori',
  ];

  const rows = Object.entries(analiza.domeni).map(([domen, podaci]) => [
    domen,
    podaci.score,
    podaci.ocena,
    podaci.confidence,
    podaci.freshness,
    podaci.izvori.join('|'),
  ]);

  const summary = [
    ['ukupan_score', analiza.ukupanScore],
    ['konacna_ocena', analiza.konacnaOcena],
    ['kriticni_domeni', analiza.kriticniDomeni.join('|') || 'none'],
    ['trend_direction', analiza.trend.direction],
    ['trend_delta_score', analiza.trend.deltaScore],
    ['generated_at', analiza.meta.generatedAt],
  ];

  const content = [
    header.map(csvEscape).join(','),
    ...rows.map((row) => row.map(csvEscape).join(',')),
    '',
    'summary_key,summary_value',
    ...summary.map((row) => row.map(csvEscape).join(',')),
  ];

  return content.join('\n');
}
