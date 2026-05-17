import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { buildGeneratorZaPoslovneRacune, type GenerisaniPoslovniRacun } from '@/lib/generator-za-poslovne-racune';

export type ValidacioniNivo = 'format' | 'compliance' | 'operativa';
export type ValidatorStatus = 'prolaz' | 'upozorenje';

export interface ValidatorStavka {
  id: string;
  nivo: ValidacioniNivo;
  status: ValidatorStatus;
  poruka: string;
}

export interface ValidacijaRacuna {
  racunId: string;
  tip: string;
  valuta: string;
  statusRacuna: string;
  stavke: ValidatorStavka[];
}

export interface ValidatorPoslovnihRacunaRezultat {
  status: 'aktivan';
  verzija: string;
  userId: string;
  timestamp: string;
  kontekst: {
    modul: string;
    banka: string;
    ulazniModel: 'generator-za-poslovne-racune';
    outputFormat: string[];
  };
  summary: {
    ukupnoRacuna: number;
    ukupnoProvera: number;
    prolaza: number;
    upozorenja: number;
  };
  validacije: ValidacijaRacuna[];
  preporuke: string[];
}

function validirajFormat(racun: GenerisaniPoslovniRacun): ValidatorStavka[] {
  return [
    {
      id: `${racun.id}-format-broj`,
      nivo: 'format',
      status: racun.brojRacuna.startsWith('AIIQ-') ? 'prolaz' : 'upozorenje',
      poruka: racun.brojRacuna.startsWith('AIIQ-')
        ? 'Broj računa prati AIIQ format.'
        : 'Broj računa ne prati očekivani AIIQ format.',
    },
    {
      id: `${racun.id}-format-iban`,
      nivo: 'format',
      status: racun.ibanLike.startsWith('RS35AIIQ') ? 'prolaz' : 'upozorenje',
      poruka: racun.ibanLike.startsWith('RS35AIIQ')
        ? 'IBAN-like izlaz je u očekivanom opsegu.'
        : 'IBAN-like izlaz nije u očekivanom opsegu.',
    },
  ];
}

function validirajCompliance(racun: GenerisaniPoslovniRacun): ValidatorStavka[] {
  const kycVerifikovan = racun.metadata.kycKybStatus === 'verifikovan';
  return [
    {
      id: `${racun.id}-compliance-kyc`,
      nivo: 'compliance',
      status: kycVerifikovan || racun.status === 'predlog' ? 'prolaz' : 'upozorenje',
      poruka: kycVerifikovan
        ? 'KYC/KYB status je verifikovan.'
        : 'KYC/KYB nije verifikovan — račun je zadržan u statusu predloga.',
    },
  ];
}

function validirajOperativu(racun: GenerisaniPoslovniRacun): ValidatorStavka[] {
  return [
    {
      id: `${racun.id}-operativa-limit`,
      nivo: 'operativa',
      status: racun.limitDnevno > 0 && racun.limitMesecno >= racun.limitDnevno ? 'prolaz' : 'upozorenje',
      poruka:
        racun.limitDnevno > 0 && racun.limitMesecno >= racun.limitDnevno
          ? 'Limiti su operativno konzistentni.'
          : 'Operativni limiti nisu konzistentni.',
    },
  ];
}

export function buildValidatorPoslovnihRacuna(userId: string): ValidatorPoslovnihRacunaRezultat {
  const generated = buildGeneratorZaPoslovneRacune(userId);
  const validacije: ValidacijaRacuna[] = generated.racuni.map((racun) => ({
    racunId: racun.id,
    tip: racun.tip,
    valuta: racun.valuta,
    statusRacuna: racun.status,
    stavke: [...validirajFormat(racun), ...validirajCompliance(racun), ...validirajOperativu(racun)],
  }));

  const sveStavke = validacije.flatMap((v) => v.stavke);
  const prolaza = sveStavke.filter((s) => s.status === 'prolaz').length;
  const upozorenja = sveStavke.length - prolaza;

  return {
    status: 'aktivan',
    verzija: APP_VERSION,
    userId,
    timestamp: new Date().toISOString(),
    kontekst: {
      modul: `${KOMPANIJA} — Validator poslovnih računa`,
      banka: 'AI IQ World Bank',
      ulazniModel: 'generator-za-poslovne-racune',
      outputFormat: ['racunId', 'tip', 'valuta', 'statusRacuna', 'stavke', 'summary'],
    },
    summary: {
      ukupnoRacuna: generated.racuni.length,
      ukupnoProvera: sveStavke.length,
      prolaza,
      upozorenja,
    },
    validacije,
    preporuke: [
      upozorenja === 0
        ? 'Svi računi prolaze validator i spremni su za sledeću fazu.'
        : 'Pregledajte upozorenja i uskladite podatke pre aktivacije.',
      'Povežite rezultat validatora sa poslovnim novčanikom za kontrolu transfernih tokova.',
      'Ponovite validaciju nakon svake izmene KYC/KYB statusa.',
    ],
  };
}
