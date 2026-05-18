import { APP_VERSION } from './constants';

export type RegistarStatus = 'aktivan' | 'u-pripremi';

export interface DigitalnaIndustrijaPibMbEntitet {
  id: string;
  naziv: string;
  tip: 'maticni-subjekt' | 'bankarski-entitet' | 'tehnoloski-entitet';
  pib: string;
  maticniBroj: string;
  sediste: string;
  status: RegistarStatus;
  opis: string;
}

export interface DigitalnaIndustrijaPibMbRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  jurisdikcija: 'Republika Srbija';
  registarNosioc: string;
  entiteti: DigitalnaIndustrijaPibMbEntitet[];
  kpi: {
    ukupnoEntiteta: number;
    aktivnih: number;
    uPripremi: number;
  };
}

export function buildDigitalnaIndustrijaPibMb(userId: string): DigitalnaIndustrijaPibMbRezultat {
  // Napomena: PIB/MB vrednosti su operativni primeri registra za internu platformsku evidenciju.
  const entiteti: DigitalnaIndustrijaPibMbEntitet[] = [
    {
      id: 'digitalna-industrija-core',
      naziv: 'Digitalna Industrija',
      tip: 'maticni-subjekt',
      pib: '114923571',
      maticniBroj: '67894123',
      sediste: 'Smederevo, Srbija',
      status: 'aktivan',
      opis: 'Matični poslovni subjekt koji vodi centralni registar platforme.',
    },
    {
      id: 'aiiq-world-bank-operativa',
      naziv: 'AI IQ World Bank Operativa',
      tip: 'bankarski-entitet',
      pib: '114923588',
      maticniBroj: '67894157',
      sediste: 'Smederevo, Srbija',
      status: 'aktivan',
      opis: 'Operativni bankarski entitet za finansijske tokove i usklađenost.',
    },
    {
      id: 'spaja-tehnoloski-centar',
      naziv: 'SPAJA Tehnološki Centar',
      tip: 'tehnoloski-entitet',
      pib: '114923601',
      maticniBroj: '67894203',
      sediste: 'Smederevo, Srbija',
      status: 'u-pripremi',
      opis: 'Tehnološki entitet za razvoj, održavanje i infrastrukturne licence.',
    },
  ];

  const aktivnih = entiteti.filter((entitet) => entitet.status === 'aktivan').length;
  const uPripremi = entiteti.filter((entitet) => entitet.status === 'u-pripremi').length;

  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    jurisdikcija: 'Republika Srbija',
    registarNosioc: 'Digitalna Industrija',
    entiteti,
    kpi: {
      ukupnoEntiteta: entiteti.length,
      aktivnih,
      uPripremi,
    },
  };
}
