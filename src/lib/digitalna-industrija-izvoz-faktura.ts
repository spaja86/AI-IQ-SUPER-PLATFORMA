import { APP_VERSION } from './constants';
import { generatePlatformBarKod } from './bar-kod';
import type { ExportContract } from './export-pdf';
import { buildExportContract } from './export-pdf';

export type IzvozStatus = 'spremno' | 'u-pripremi' | 'zahteva-reviziju';

export interface IzvozFakturaStavka {
  id: string;
  entitet: string;
  platformaId: string;
  brojFakture: string;
  trziste: string;
  valuta: 'EUR' | 'USD' | 'CHF';
  iznos: number;
  barKod: number;
  status: IzvozStatus;
}

export interface DigitalnaIndustrijaIzvozFakturaRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  exportContract: ExportContract;
  jurisdikcija: 'Republika Srbija';
  registarNosioc: string;
  fakture: IzvozFakturaStavka[];
  kpi: {
    ukupnoFaktura: number;
    spremno: number;
    uPripremi: number;
    zahtevaReviziju: number;
    ukupnoEUR: number;
  };
}

export function buildDigitalnaIndustrijaIzvozFaktura(
  userId: string,
): DigitalnaIndustrijaIzvozFakturaRezultat {
  const demoBarKod = (seed: string) => generatePlatformBarKod(`demo-${seed}`);
  const fakture: IzvozFakturaStavka[] = [
    {
      id: 'izvoz-faktura-001',
      entitet: 'Digitalna Industrija',
      platformaId: 'ai-iq-super-platforma',
      brojFakture: 'DI-EXP-2026-001',
      trziste: 'EU',
      valuta: 'EUR',
      iznos: 82_500,
      barKod: demoBarKod('ai-iq-super-platforma'),
      status: 'spremno',
    },
    {
      id: 'izvoz-faktura-002',
      entitet: 'AI IQ World Bank Operativa',
      platformaId: 'ai-iq-world-bank',
      brojFakture: 'WB-EXP-2026-014',
      trziste: 'SAD',
      valuta: 'USD',
      iznos: 104_000,
      barKod: demoBarKod('ai-iq-world-bank'),
      status: 'u-pripremi',
    },
    {
      id: 'izvoz-faktura-003',
      entitet: 'SPAJA Tehnološki Centar',
      platformaId: 'spajapro-platforma',
      brojFakture: 'STC-EXP-2026-007',
      trziste: 'Švajcarska',
      valuta: 'CHF',
      iznos: 48_300,
      barKod: demoBarKod('spajapro-platforma'),
      status: 'zahteva-reviziju',
    },
    {
      id: 'izvoz-faktura-004',
      entitet: 'Proksi Infrastruktura',
      platformaId: 'input-output-copilot',
      brojFakture: 'PI-EXP-2026-003',
      trziste: 'EU',
      valuta: 'EUR',
      iznos: 63_400,
      barKod: demoBarKod('input-output-copilot'),
      status: 'spremno',
    },
  ];

  const spremno = fakture.filter((stavka) => stavka.status === 'spremno').length;
  const uPripremi = fakture.filter((stavka) => stavka.status === 'u-pripremi').length;
  const zahtevaReviziju = fakture.filter((stavka) => stavka.status === 'zahteva-reviziju').length;
  const ukupnoEUR = fakture
    .filter((stavka) => stavka.valuta === 'EUR')
    .reduce((sum, stavka) => sum + stavka.iznos, 0);

  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    exportContract: buildExportContract('/api/digitalna-industrija-izvoz-faktura', '/api/digitalna-industrija-izvoz-faktura/pdf'),
    jurisdikcija: 'Republika Srbija',
    registarNosioc: 'Digitalna Industrija',
    fakture,
    kpi: {
      ukupnoFaktura: fakture.length,
      spremno,
      uPripremi,
      zahtevaReviziju,
      ukupnoEUR,
    },
  };
}
