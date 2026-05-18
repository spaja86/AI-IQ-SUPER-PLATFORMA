import { APP_VERSION } from './constants';

export type DelatnostStatus = 'primarna' | 'sekundarna';

export interface DigitalnaIndustrijaDelatnostStavka {
  id: string;
  entitet: string;
  sifraDelatnosti: string;
  nazivDelatnosti: string;
  oblast: 'tehnologija' | 'finansije' | 'infrastruktura';
  status: DelatnostStatus;
  opis: string;
}

export interface DigitalnaIndustrijaSifraDelatnostiRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  registarNosioc: string;
  delatnosti: DigitalnaIndustrijaDelatnostStavka[];
  kpi: {
    ukupnoDelatnosti: number;
    primarnih: number;
    sekundarnih: number;
  };
}

export function buildDigitalnaIndustrijaSifraDelatnosti(
  userId: string,
): DigitalnaIndustrijaSifraDelatnostiRezultat {
  const delatnosti: DigitalnaIndustrijaDelatnostStavka[] = [
    {
      id: 'digitalna-industrija-core',
      entitet: 'Digitalna Industrija',
      sifraDelatnosti: '62.01',
      nazivDelatnosti: 'Računarsko programiranje',
      oblast: 'tehnologija',
      status: 'primarna',
      opis: 'Osnovna delatnost razvoja i održavanja jezgra platforme.',
    },
    {
      id: 'aiiq-world-bank-operativa',
      entitet: 'AI IQ World Bank Operativa',
      sifraDelatnosti: '64.19',
      nazivDelatnosti: 'Ostalo monetarno posredovanje',
      oblast: 'finansije',
      status: 'primarna',
      opis: 'Operativni finansijski tokovi i usklađenost bankarskih servisa.',
    },
    {
      id: 'spaja-tehnoloski-centar',
      entitet: 'SPAJA Tehnološki Centar',
      sifraDelatnosti: '62.02',
      nazivDelatnosti: 'Konsultantske aktivnosti u vezi s IT',
      oblast: 'tehnologija',
      status: 'sekundarna',
      opis: 'Podrška implementaciji, modernizaciji i tehnološkim migracijama.',
    },
    {
      id: 'proksi-infrastruktura',
      entitet: 'Proksi Infrastruktura',
      sifraDelatnosti: '61.90',
      nazivDelatnosti: 'Ostale telekomunikacione delatnosti',
      oblast: 'infrastruktura',
      status: 'sekundarna',
      opis: 'Mrežna i telekom infrastruktura za platformske servise.',
    },
  ];

  const primarnih = delatnosti.filter((stavka) => stavka.status === 'primarna').length;
  const sekundarnih = delatnosti.filter((stavka) => stavka.status === 'sekundarna').length;

  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    jurisdikcija: 'Republika Srbija',
    registarNosioc: 'Digitalna Industrija',
    delatnosti,
    kpi: {
      ukupnoDelatnosti: delatnosti.length,
      primarnih,
      sekundarnih,
    },
  };
}
