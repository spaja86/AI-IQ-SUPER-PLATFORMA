import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { getKontaktKanal, primarniOperativniNalog } from '@/lib/kompanija-spaja-operativa';

export type PoslovniRacunValuta = 'RSD' | 'EUR' | 'USD';
export type PoslovniRacunTip = 'dinarski-poslovni' | 'devizni-eur' | 'devizni-usd';
export type PoslovniRacunStatus = 'predlog' | 'aktivan';
export type KycKybStatus = 'nije-pokrenut' | 'u-toku' | 'verifikovan' | 'odbijen';

export interface PoslovniSubjektInput {
  naziv: string;
  pib: string;
  maticniBroj: string;
  email: string;
  zemlja: string;
  kycKybStatus: KycKybStatus;
}

export interface GeneratorKontekst {
  banka: string;
  modul: string;
  model: 'simulacioni-in-memory';
  trajnoCuvanje: false;
  obavezniTipoviV1: PoslovniRacunTip[];
  obavezneValuteV1: PoslovniRacunValuta[];
  postojeceReference: string[];
}

export interface PoslovniRacunValidacija {
  polje: string;
  status: 'ispravno' | 'upozorenje';
  poruka: string;
}

export interface GenerisaniPoslovniRacun {
  id: string;
  tip: PoslovniRacunTip;
  valuta: PoslovniRacunValuta;
  status: PoslovniRacunStatus;
  brojRacuna: string;
  ibanLike: string;
  limitDnevno: number;
  limitMesecno: number;
  validacije: PoslovniRacunValidacija[];
  metadata: {
    vlasnik: string;
    kycKybStatus: KycKybStatus;
    generator: 'AI IQ WORLD BANK — GENERATOR ZA POSLOVNE RAČUNE';
    timestamp: string;
  };
}

export interface GeneratorAuditZapis {
  id: string;
  akcija: string;
  status: 'uspesno' | 'upozorenje';
  detalji: string;
  timestamp: string;
}

export interface GeneratorZaPoslovneRacuneRezultat {
  status: 'aktivan';
  verzija: string;
  userId: string;
  timestamp: string;
  scopeV1: {
    cilj: string;
    simulacioniModel: true;
    loginKycPolitika: string;
    outputFormat: string[];
  };
  subjekt: PoslovniSubjektInput;
  kontekst: GeneratorKontekst;
  summary: {
    ukupnoRacuna: number;
    aktivnihRacuna: number;
    predloga: number;
    verifikovanKyc: boolean;
  };
  racuni: GenerisaniPoslovniRacun[];
  preporuke: string[];
  audit: GeneratorAuditZapis[];
}

const TIPOVI_V1: PoslovniRacunTip[] = ['dinarski-poslovni', 'devizni-eur', 'devizni-usd'];
const VALUTE_V1: PoslovniRacunValuta[] = ['RSD', 'EUR', 'USD'];

function generateAccountSeedHash(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return String(h).padStart(10, '0');
}

function formatBrojRacuna(seed: string, idx: number): string {
  const raw = `${seed}${idx}`.slice(0, 9).padEnd(9, '7');
  return `AIIQ-${raw}`;
}

function formatIbanLike(seed: string, valuta: PoslovniRacunValuta): string {
  const suffix = seed.slice(0, 14).padEnd(14, '9');
  return `RS35AIIQ${valuta}${suffix}`;
}

function tipUValutu(tip: PoslovniRacunTip): PoslovniRacunValuta {
  if (tip === 'dinarski-poslovni') return 'RSD';
  if (tip === 'devizni-eur') return 'EUR';
  return 'USD';
}

function validirajSubjekt(subjekt: PoslovniSubjektInput): PoslovniRacunValidacija[] {
  return [
    {
      polje: 'pib',
      status: subjekt.pib.length >= 8 ? 'ispravno' : 'upozorenje',
      poruka: subjekt.pib.length >= 8 ? 'PIB format prihvaćen.' : 'PIB je prekratak za poslovni račun.',
    },
    {
      polje: 'maticniBroj',
      status: subjekt.maticniBroj.length >= 8 ? 'ispravno' : 'upozorenje',
      poruka: subjekt.maticniBroj.length >= 8 ? 'Matični broj validiran.' : 'Matični broj nije kompletan.',
    },
    {
      polje: 'email',
      status: subjekt.email.includes('@') ? 'ispravno' : 'upozorenje',
      poruka: subjekt.email.includes('@') ? 'Kontakt email je validan.' : 'Kontakt email nije validan.',
    },
  ];
}

export function buildGeneratorZaPoslovneRacune(
  userId: string,
  subjekt?: Partial<PoslovniSubjektInput>
): GeneratorZaPoslovneRacuneRezultat {
  const kontaktEmailFallback = getKontaktKanal('billing')?.email ?? primarniOperativniNalog.email;
  const finalniSubjekt: PoslovniSubjektInput = {
    naziv: subjekt?.naziv ?? 'Digitalna Industrija',
    pib: subjekt?.pib ?? '108001122',
    maticniBroj: subjekt?.maticniBroj ?? '22110033',
    email: subjekt?.email ?? kontaktEmailFallback,
    zemlja: subjekt?.zemlja ?? 'RS',
    kycKybStatus: subjekt?.kycKybStatus ?? 'u-toku',
  };

  const seed = generateAccountSeedHash(`${userId}:${finalniSubjekt.naziv}:${finalniSubjekt.pib}`);
  const bazeValidacije = validirajSubjekt(finalniSubjekt);
  const kycOk = finalniSubjekt.kycKybStatus === 'verifikovan';

  const racuni: GenerisaniPoslovniRacun[] = TIPOVI_V1.map((tip, idx) => {
    const valuta = tipUValutu(tip);
    const status: PoslovniRacunStatus = kycOk ? 'aktivan' : 'predlog';
    return {
      id: `aiiq-racun-${idx + 1}`,
      tip,
      valuta,
      status,
      brojRacuna: formatBrojRacuna(seed, idx + 1),
      ibanLike: formatIbanLike(seed.slice(idx), valuta),
      limitDnevno: tip === 'dinarski-poslovni' ? 5_000_000 : 100_000,
      limitMesecno: tip === 'dinarski-poslovni' ? 50_000_000 : 1_000_000,
      validacije: [
        ...bazeValidacije,
        {
          polje: 'kycKybStatus',
          status: kycOk ? 'ispravno' : 'upozorenje',
          poruka: kycOk
            ? 'KYC/KYB verifikacija završena — račun može biti aktivan.'
            : 'KYC/KYB nije verifikovan — račun ostaje u statusu predloga.',
        },
      ],
      metadata: {
        vlasnik: finalniSubjekt.naziv,
        kycKybStatus: finalniSubjekt.kycKybStatus,
        generator: 'AI IQ WORLD BANK — GENERATOR ZA POSLOVNE RAČUNE',
        timestamp: new Date().toISOString(),
      },
    };
  });

  const audit: GeneratorAuditZapis[] = [
    {
      id: `AUDIT-GPR-${seed.slice(0, 6)}-01`,
      akcija: 'scope_v1_locked',
      status: 'uspesno',
      detalji:
        'V1 scope zaključan: 3 obavezna tipa računa (RSD/EUR/USD), simulacioni in-memory model, IBAN-like izlaz.',
      timestamp: new Date().toISOString(),
    },
    {
      id: `AUDIT-GPR-${seed.slice(0, 6)}-02`,
      akcija: 'accounts_generated',
      status: kycOk ? 'uspesno' : 'upozorenje',
      detalji: kycOk
        ? 'Računi su generisani kao aktivni.'
        : 'Računi su generisani kao predlog dok KYC/KYB ne bude verifikovan.',
      timestamp: new Date().toISOString(),
    },
  ];

  const aktivnihRacuna = racuni.filter((r) => r.status === 'aktivan').length;

  return {
    status: 'aktivan',
    verzija: APP_VERSION,
    userId,
    timestamp: new Date().toISOString(),
    scopeV1: {
      cilj: 'Korisnik kreira poslovne račun(e) kroz AI IQ World Bank modul povezan sa /banka i /poslovni-novcanik.',
      simulacioniModel: true,
      loginKycPolitika:
        'Javni demo endpoint dozvoljen; aktivacija računa zahteva verifikovan KYC/KYB status.',
      outputFormat: ['brojRacuna', 'ibanLike', 'tip', 'valuta', 'status', 'limiti', 'validacije', 'metadata'],
    },
    subjekt: finalniSubjekt,
    kontekst: {
      banka: 'AI IQ World Bank',
      modul: `${KOMPANIJA} — Generator za poslovne račune`,
      model: 'simulacioni-in-memory',
      trajnoCuvanje: false,
      obavezniTipoviV1: TIPOVI_V1,
      obavezneValuteV1: VALUTE_V1,
      postojeceReference: ['DIGI-IND-001', 'DIGI-IND-002-EUR', 'AIIQ-GITHUB-DIGI-IND-002-EUR'],
    },
    summary: {
      ukupnoRacuna: racuni.length,
      aktivnihRacuna,
      predloga: racuni.length - aktivnihRacuna,
      verifikovanKyc: kycOk,
    },
    racuni,
    preporuke: [
      kycOk
        ? 'KYC/KYB je verifikovan — možete aktivirati produkcioni tok računa.'
        : 'Završite KYC/KYB verifikaciju da bi predlog računa postao aktivan račun.',
      'Povežite račune sa /poslovni-novcanik radi orkestracije plaćanja i kartičnih tokova.',
      'Aktivirajte dnevne i mesečne limite po internim pravilima AI IQ World Bank.',
    ],
    audit,
  };
}
