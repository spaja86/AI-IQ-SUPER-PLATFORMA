import { APP_VERSION } from './constants';
import { platforme } from './platforme';

export interface BarKodStavka {
  platformaId: string;
  naziv: string;
  barKod: number;
  jedinicaFunkcije: number;
  kategorija: string;
  timestamp: string;
}

export interface BarKodRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  izvor: string;
  stavke: BarKodStavka[];
  kpi: {
    ukupnoBarKodova: number;
    sumaJedinicaFunkcije: number;
    minBarKod: number;
    maxBarKod: number;
  };
}

const BAR_KOD_BODY_MOD = 1_000_000_000_000n; // 12 cifara
const JEDINICA_MOD = 1_000_000n;

function hashId(id: string): bigint {
  let h = 0n;
  for (let i = 0; i < id.length; i++) {
    // 131 je mali prost broj sa dobrom raspodelom u rolling-hash obrascu.
    h = (h * 131n + BigInt(id.charCodeAt(i))) % BAR_KOD_BODY_MOD;
  }
  return h;
}

function calculateCheckDigit(body12: string): number {
  let sum = 0;
  for (let i = 0; i < body12.length; i++) {
    const digit = Number(body12[i]);
    const weight = i % 2 === 0 ? 1 : 3;
    sum += digit * weight;
  }
  return (10 - (sum % 10)) % 10;
}

export function generatePlatformBarKod(id: string): number {
  const body12 = hashId(id).toString().padStart(12, '0');
  const checkDigit = calculateCheckDigit(body12);
  const barKod = Number(`${body12}${checkDigit}`);
  if (!Number.isSafeInteger(barKod)) {
    throw new Error('Generisani BAR KOD nije bezbedan celobrojni broj.');
  }
  return barKod;
}

export function generateJedinicaFunkcije(id: string, redBroj: number): number {
  const hashValue = hashId(`${id}:${redBroj}`);
  return Number(hashValue % JEDINICA_MOD);
}

export function buildBarKod(userId: string): BarKodRezultat {
  const now = new Date().toISOString();
  const stavke: BarKodStavka[] = platforme.map((platforma, index) => ({
    platformaId: platforma.id,
    naziv: platforma.naziv,
    barKod: generatePlatformBarKod(platforma.id),
    jedinicaFunkcije: generateJedinicaFunkcije(platforma.id, index + 1),
    kategorija: platforma.kategorija,
    timestamp: now,
  }));

  const sumaJedinicaFunkcije = stavke.reduce((sum, stavka) => sum + stavka.jedinicaFunkcije, 0);
  const minBarKod = stavke.reduce((min, stavka) => Math.min(min, stavka.barKod), Infinity);
  const maxBarKod = stavke.reduce((max, stavka) => Math.max(max, stavka.barKod), 0);

  return {
    status: 'aktivan',
    userId,
    timestamp: now,
    verzija: APP_VERSION,
    izvor: 'BAR KOD Registar Digitalne Industrije',
    stavke,
    kpi: {
      ukupnoBarKodova: stavke.length,
      sumaJedinicaFunkcije,
      minBarKod,
      maxBarKod,
    },
  };
}
