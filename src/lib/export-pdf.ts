import { APP_VERSION, BASE_URL, KOMPANIJA, KOMPANIJA_FORMALNI_IDENTITET } from './constants';
import type { GeneratorZaPoslovneRacuneRezultat } from './generator-za-poslovne-racune';
import type { DigitalnaIndustrijaIzvozFakturaRezultat } from './digitalna-industrija-izvoz-faktura';

export const PDF_EXPORT_CONTRACT_VERSION = 'pdf-export-v1';

export interface ExportArtifactDescriptor {
  format: 'json' | 'pdf';
  url: string;
  contentType: string;
  primary: boolean;
}

export interface ExportContract {
  version: typeof PDF_EXPORT_CONTRACT_VERSION;
  sourceOfTruth: 'json';
  parityChecks: string[];
  generatedBy: string;
  artifacts: ExportArtifactDescriptor[];
}

function escapePdfText(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/đ/g, 'dj')
    .replace(/Đ/g, 'Dj')
    .replace(/—/g, '-')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E]/g, '?')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\r?\n/g, ' ');
}

function wrapText(input: string, maxLength = 92): string[] {
  if (input.length === 0) return [''];
  const trimmed = input.trim();
  if (trimmed.length === 0) return [''];
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [''];
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxLength) {
      current = candidate;
      continue;
    }
    if (current) lines.push(current);
    current = word;
  }
  if (current) lines.push(current);
  return lines;
}

export function buildExportContract(jsonPath: string, pdfPath: string): ExportContract {
  return {
    version: PDF_EXPORT_CONTRACT_VERSION,
    sourceOfTruth: 'json',
    parityChecks: [
      'Identičan poslovni payload između JSON odgovora i PDF dokumenta.',
      'Status, valuta, iznos, validacije, audit i barkod moraju ostati isti u oba formata.',
      'PDF je sekundarni kanal; JSON ostaje kanonski export contract.',
    ],
    generatedBy: `${KOMPANIJA} — PDF Export`,
    artifacts: [
      {
        format: 'json',
        url: `${BASE_URL}${jsonPath}`,
        contentType: 'application/json',
        primary: true,
      },
      {
        format: 'pdf',
        url: `${BASE_URL}${pdfPath}`,
        contentType: 'application/pdf',
        primary: false,
      },
    ],
  };
}

export function createTextPdfDocument(title: string, sourceLines: string[]): Buffer {
  const lines = [title, '', ...sourceLines.flatMap((line) => wrapText(line))];
  const linesPerPage = 44;
  const pageChunks: string[][] = [];
  for (let i = 0; i < lines.length; i += linesPerPage) {
    pageChunks.push(lines.slice(i, i + linesPerPage));
  }
  if (pageChunks.length === 0) {
    pageChunks.push(['']);
  }

  const objects: string[] = [];
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';

  const pageRefs: string[] = [];
  let objectIndex = 4;

  for (const chunk of pageChunks) {
    const pageObjectId = objectIndex++;
    const contentObjectId = objectIndex++;
    pageRefs.push(`${pageObjectId} 0 R`);

    const commands = [
      'BT',
      '/F1 11 Tf',
      '50 760 Td',
      '15 TL',
      ...chunk.map((line, index) => `${index === 0 ? '' : 'T* ' }(${escapePdfText(line)}) Tj`),
      'ET',
    ].join('\n');

    const contentLength = Buffer.byteLength(commands, 'utf8');

    objects[pageObjectId] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] ` +
      `/Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObjectId} 0 R >>`;
    objects[contentObjectId] = `<< /Length ${contentLength} >>\nstream\n${commands}\nendstream`;
  }

  objects[2] = `<< /Type /Pages /Count ${pageRefs.length} /Kids [${pageRefs.join(' ')}] >>`;

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];

  for (let i = 1; i < objects.length; i++) {
    if (!objects[i]) continue;
    offsets[i] = Buffer.byteLength(pdf, 'utf8');
    pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefOffset = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length}\n`;
  pdf += '0000000000 65535 f \n';

  for (let i = 1; i < objects.length; i++) {
    if (!objects[i]) {
      pdf += '0000000000 65535 f \n';
      continue;
    }
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf, 'utf8');
}

export function buildPoslovniRacuniPdfDocument(result: GeneratorZaPoslovneRacuneRezultat): Buffer {
  const lines: string[] = [
    KOMPANIJA_FORMALNI_IDENTITET,
    `Generator: ${result.kontekst.modul}`,
    `Export contract: ${result.exportContract.version}`,
    `Korisnik: ${result.userId}`,
    `Status: ${result.status}`,
    `KYC/KYB: ${result.subjekt.kycKybStatus}`,
    `Subjekt: ${result.subjekt.naziv} | PIB ${result.subjekt.pib} | MB ${result.subjekt.maticniBroj}`,
    `Email: ${result.subjekt.email} | Zemlja: ${result.subjekt.zemlja}`,
    `Ukupno racuna: ${result.summary.ukupnoRacuna} | Aktivnih: ${result.summary.aktivnihRacuna} | Predloga: ${result.summary.predloga}`,
    '',
    'RACUNI',
  ];

  for (const racun of result.racuni) {
    lines.push(
      `# ${racun.id} | ${racun.tip} | ${racun.valuta} | ${racun.status}`,
      `Broj racuna: ${racun.brojRacuna}`,
      `IBAN-like: ${racun.ibanLike}`,
      `Dnevni limit: ${racun.limitDnevno} | Mesecni limit: ${racun.limitMesecno}`,
      ...racun.validacije.map((validacija) => `Validacija ${validacija.polje}: ${validacija.status} - ${validacija.poruka}`),
      `Audit timestamp: ${racun.metadata.timestamp}`,
      '',
    );
  }

  lines.push('AUDIT');
  for (const item of result.audit) {
    lines.push(`${item.id} | ${item.akcija} | ${item.status} | ${item.detalji}`);
  }

  lines.push('', `Verzija platforme: ${APP_VERSION}`);
  return createTextPdfDocument('AI IQ WORLD BANK - POSLOVNI RACUNI PDF', lines);
}

export function buildIzvozFakturaPdfDocument(result: DigitalnaIndustrijaIzvozFakturaRezultat): Buffer {
  const lines: string[] = [
    KOMPANIJA_FORMALNI_IDENTITET,
    `Registar: ${result.registarNosioc} | Jurisdikcija: ${result.jurisdikcija}`,
    `Export contract: ${result.exportContract.version}`,
    `Korisnik: ${result.userId}`,
    `Ukupno faktura: ${result.kpi.ukupnoFaktura} | Spremno: ${result.kpi.spremno} | U pripremi: ${result.kpi.uPripremi} | Revizija: ${result.kpi.zahtevaReviziju}`,
    '',
    'IZVOZNE FAKTURE',
  ];

  for (const faktura of result.fakture) {
    lines.push(
      `# ${faktura.id} | ${faktura.entitet} | ${faktura.status}`,
      `Broj fakture: ${faktura.brojFakture}`,
      `Platforma: ${faktura.platformaId} | Trziste: ${faktura.trziste}`,
      `Valuta: ${faktura.valuta} | Iznos: ${faktura.iznos}`,
      `BAR KOD: ${faktura.barKod}`,
      '',
    );
  }

  lines.push(
    'PARITY CHECK',
    'PDF dokument je generisan iz istog JSON payload-a kao i javni API odgovor.',
    `Verzija platforme: ${APP_VERSION}`,
  );

  return createTextPdfDocument('DIGITALNA INDUSTRIJA - IZVOZ FAKTURA PDF', lines);
}
