import { APP_VERSION } from './constants';
import { getKontaktKanal } from './kompanija-spaja-operativa';
import {
  buildDigitalnaIndustrijaLicencniPortfolio,
  type LicencniPortfolioBlokator,
  type LicencniPortfolioNivo,
} from './digitalna-industrija-licencni-portfolio';
import { buildDigitalnaIndustrijaDevizniSaldo } from './digitalna-industrija-devizni-saldo';
import { buildDigitalnaIndustrijaValutniRizik } from './digitalna-industrija-valutni-rizik';
import { getGlavniEndzinPregled } from './glavni-endzin-digitalne-industrije';

export type DigitalnaIndustrijaOblast =
  | 'overview'
  | 'finansije'
  | 'rizici'
  | 'compliance'
  | 'licensing'
  | 'kadrovi'
  | 'operativa';

export type DigitalnaIndustrijaPovrsinaTip =
  | 'umbrella'
  | 'specijalizovana'
  | 'agregatna'
  | 'dijagnostika';

export interface DigitalnaIndustrijaPovrsina {
  id: string;
  naziv: string;
  oblast: DigitalnaIndustrijaOblast;
  tip: DigitalnaIndustrijaPovrsinaTip;
  status: 'aktivan';
  pagePath?: string;
  apiPath?: string;
  engineId?: string;
  ownership: string[];
  kpi: string[];
}

export interface DigitalnaIndustrijaScopeSegment {
  oblast: DigitalnaIndustrijaOblast;
  naziv: string;
  opis: string;
  ownership: string[];
  kpi: string[];
  umbrella: DigitalnaIndustrijaPovrsina[];
  specijalizovane: DigitalnaIndustrijaPovrsina[];
}

export interface DigitalnaIndustrijaPoslovniTok {
  id: string;
  naziv: string;
  opis: string;
  ownership: string[];
  prioritet: 'kritican' | 'visok' | 'srednji';
  moduli: string[];
  pagePath?: string;
  apiPath?: string;
}

export interface DigitalnaIndustrijaOperativniPregled {
  ukupnoPovrsina: number;
  specijalizovanihModula: number;
  prioritetniBlokatori: number;
  blokatoriPlatformi: number;
  verifikovaneLicence: number;
  ukupniBudzetRSD: number;
  kriticnaFXIzlozenostPct: number;
  netoDevizniSaldoEUR: number;
  glavniEndzin: ReturnType<typeof getGlavniEndzinPregled>;
  upozorenja: string[];
}

export interface DigitalnaIndustrijaGovernance {
  sourceOfTruth: string[];
  qualityGate: string[];
  secretsBoundary: string[];
  reviewModel: string[];
  downstream: string[];
}

export interface DigitalnaIndustrijaDomenModel {
  naziv: string;
  verzija: string;
  status: 'aktivan';
  umbrellaNivoi: string[];
  scope: DigitalnaIndustrijaScopeSegment[];
  poslovniTokovi: DigitalnaIndustrijaPoslovniTok[];
  povrsine: DigitalnaIndustrijaPovrsina[];
  governance: DigitalnaIndustrijaGovernance;
  operativniPregled: DigitalnaIndustrijaOperativniPregled;
}

const KONTAKT_OPERATIVA = getKontaktKanal('billing')?.email ?? 'billing@spaja.rs';
const KONTAKT_FINANSIJE = getKontaktKanal('billing')?.email ?? 'billing@spaja.rs';
const KONTAKT_TEHNICKI = getKontaktKanal('tech')?.email ?? 'tech@spaja.rs';
const KONTAKT_BIZNIS = getKontaktKanal('business')?.email ?? 'business@spaja.rs';
const KONTAKT_COMPLIANCE = getKontaktKanal('sales')?.email ?? 'sales@spaja.rs';

const POVRSINE: DigitalnaIndustrijaPovrsina[] = [
  {
    id: 'industrija',
    naziv: 'Industrija',
    oblast: 'overview',
    tip: 'umbrella',
    status: 'aktivan',
    pagePath: '/industrija',
    apiPath: '/api/industrija',
    ownership: [KONTAKT_BIZNIS, KONTAKT_OPERATIVA],
    kpi: ['ukupnoPlatformi', 'ukupnoKompanija', 'ukupnoProizvoda'],
  },
  {
    id: 'industrija-pregled',
    naziv: 'Industrija Pregled',
    oblast: 'overview',
    tip: 'agregatna',
    status: 'aktivan',
    apiPath: '/api/industrija-pregled',
    ownership: [KONTAKT_BIZNIS, KONTAKT_OPERATIVA],
    kpi: ['aktivnihPlatformi', 'ukupnoOrganizacija', 'ukupnoPovrsina'],
  },
  {
    id: 'digitalna-industrija-pregled',
    naziv: 'Digitalna Industrija Pregled',
    oblast: 'overview',
    tip: 'agregatna',
    status: 'aktivan',
    apiPath: '/api/digitalna-industrija-pregled',
    ownership: [KONTAKT_BIZNIS, KONTAKT_OPERATIVA],
    kpi: ['prioritetniBlokatori', 'ukupniBudzetRSD', 'kriticnaFXIzlozenostPct'],
  },
  {
    id: 'glavni-endzin-digitalne-industrije',
    naziv: 'Glavni Endžin Digitalne Industrije',
    oblast: 'overview',
    tip: 'umbrella',
    status: 'aktivan',
    apiPath: '/api/glavni-endzin-digitalne-industrije',
    ownership: [KONTAKT_TEHNICKI, KONTAKT_OPERATIVA],
    engineId: 'engine-digitalna-industrija-finansije',
    kpi: ['ukupnoSpojenih', 'aktivnihEndžina', 'kompletnost'],
  },
  {
    id: 'autofinish-digitalna-industrija-pregled',
    naziv: 'Autofinish Digitalna Industrija Pregled',
    oblast: 'overview',
    tip: 'dijagnostika',
    status: 'aktivan',
    apiPath: '/api/autofinish-digitalna-industrija-pregled',
    ownership: [KONTAKT_TEHNICKI],
    kpi: ['ukupnoBlokova', 'ukupnoModula', 'ukupnoDijagnostika'],
  },
  {
    id: 'digitalna-industrija-devizni-saldo',
    naziv: 'Digitalna Industrija Devizni Saldo',
    oblast: 'finansije',
    tip: 'specijalizovana',
    status: 'aktivan',
    pagePath: '/digitalna-industrija-devizni-saldo',
    apiPath: '/api/digitalna-industrija-devizni-saldo',
    ownership: [KONTAKT_FINANSIJE],
    engineId: 'engine-digitalna-industrija-finansije',
    kpi: ['netoEUR', 'prilivi', 'odlivi'],
  },
  {
    id: 'digitalna-industrija-devizni-prilivi',
    naziv: 'Digitalna Industrija Devizni Prilivi',
    oblast: 'finansije',
    tip: 'specijalizovana',
    status: 'aktivan',
    pagePath: '/digitalna-industrija-devizni-prilivi',
    apiPath: '/api/digitalna-industrija-devizni-prilivi',
    ownership: [KONTAKT_FINANSIJE],
    engineId: 'engine-digitalna-industrija-finansije',
    kpi: ['ukupnoStavki', 'ukupanPrilivRSD', 'brojValuta'],
  },
  {
    id: 'digitalna-industrija-devizni-odlivi',
    naziv: 'Digitalna Industrija Devizni Odlivi',
    oblast: 'finansije',
    tip: 'specijalizovana',
    status: 'aktivan',
    pagePath: '/digitalna-industrija-devizni-odlivi',
    apiPath: '/api/digitalna-industrija-devizni-odlivi',
    ownership: [KONTAKT_FINANSIJE],
    engineId: 'engine-digitalna-industrija-finansije',
    kpi: ['ukupnoStavki', 'ukupanOdlivRSD', 'brojValuta'],
  },
  {
    id: 'digitalna-industrija-kursna-lista',
    naziv: 'Digitalna Industrija Kursna Lista',
    oblast: 'finansije',
    tip: 'specijalizovana',
    status: 'aktivan',
    pagePath: '/digitalna-industrija-kursna-lista',
    apiPath: '/api/digitalna-industrija-kursna-lista',
    ownership: [KONTAKT_FINANSIJE],
    engineId: 'engine-digitalna-industrija-finansije',
    kpi: ['ukupnoValuta', 'srednjiKurs', 'spread'],
  },
  {
    id: 'digitalna-industrija-kursne-razlike',
    naziv: 'Digitalna Industrija Kursne Razlike',
    oblast: 'finansije',
    tip: 'specijalizovana',
    status: 'aktivan',
    pagePath: '/digitalna-industrija-kursne-razlike',
    apiPath: '/api/digitalna-industrija-kursne-razlike',
    ownership: [KONTAKT_FINANSIJE],
    engineId: 'engine-digitalna-industrija-finansije',
    kpi: ['ukupnoStavki', 'netoEfekatRSD', 'kriticneStavke'],
  },
  {
    id: 'digitalna-industrija-inflacije',
    naziv: 'Digitalna Industrija Inflacije',
    oblast: 'finansije',
    tip: 'specijalizovana',
    status: 'aktivan',
    pagePath: '/digitalna-industrija-inflacije',
    apiPath: '/api/digitalna-industrija-inflacije',
    ownership: [KONTAKT_FINANSIJE, KONTAKT_BIZNIS],
    engineId: 'engine-digitalna-industrija-finansije',
    kpi: ['prosecnaInflacija', 'inflacioniPritisak', 'projekcija'],
  },
  {
    id: 'digitalna-industrija-valutni-rizik',
    naziv: 'Digitalna Industrija Valutni Rizik',
    oblast: 'rizici',
    tip: 'specijalizovana',
    status: 'aktivan',
    pagePath: '/digitalna-industrija-valutni-rizik',
    apiPath: '/api/digitalna-industrija-valutni-rizik',
    ownership: [KONTAKT_FINANSIJE, KONTAKT_COMPLIANCE],
    engineId: 'engine-digitalna-industrija-rizici',
    kpi: ['kriticni', 'prosecnaIskoriscenostPct', 'ukupnoPortfolija'],
  },
  {
    id: 'digitalna-industrija-kreditni-rizik',
    naziv: 'Digitalna Industrija Kreditni Rizik',
    oblast: 'rizici',
    tip: 'specijalizovana',
    status: 'aktivan',
    pagePath: '/digitalna-industrija-kreditni-rizik',
    apiPath: '/api/digitalna-industrija-kreditni-rizik',
    ownership: [KONTAKT_FINANSIJE, KONTAKT_COMPLIANCE],
    engineId: 'engine-digitalna-industrija-rizici',
    kpi: ['kriticni', 'ukupnoKlijenata', 'prosecniRizikPct'],
  },
  {
    id: 'digitalna-industrija-kamatni-rizik',
    naziv: 'Digitalna Industrija Kamatni Rizik',
    oblast: 'rizici',
    tip: 'specijalizovana',
    status: 'aktivan',
    pagePath: '/digitalna-industrija-kamatni-rizik',
    apiPath: '/api/digitalna-industrija-kamatni-rizik',
    ownership: [KONTAKT_FINANSIJE, KONTAKT_COMPLIANCE],
    engineId: 'engine-digitalna-industrija-rizici',
    kpi: ['ukupnoInstrumenata', 'prosecnaOsetljivostBp', 'kriticni'],
  },
  {
    id: 'digitalna-industrija-likvidnosni-rizik',
    naziv: 'Digitalna Industrija Likvidnosni Rizik',
    oblast: 'rizici',
    tip: 'specijalizovana',
    status: 'aktivan',
    pagePath: '/digitalna-industrija-likvidnosni-rizik',
    apiPath: '/api/digitalna-industrija-likvidnosni-rizik',
    ownership: [KONTAKT_FINANSIJE, KONTAKT_OPERATIVA],
    engineId: 'engine-digitalna-industrija-rizici',
    kpi: ['likvidniDani', 'kriticni', 'raspoloziviBufferRSD'],
  },
  {
    id: 'digitalna-industrija-operativni-rizik',
    naziv: 'Digitalna Industrija Operativni Rizik',
    oblast: 'operativa',
    tip: 'specijalizovana',
    status: 'aktivan',
    pagePath: '/digitalna-industrija-operativni-rizik',
    apiPath: '/api/digitalna-industrija-operativni-rizik',
    ownership: [KONTAKT_OPERATIVA, KONTAKT_TEHNICKI],
    engineId: 'engine-digitalna-industrija-rizici',
    kpi: ['incidenti', 'srednjeVremeOporavka', 'kriticniTokovi'],
  },
  {
    id: 'digitalna-industrija-sajber-rizik',
    naziv: 'Digitalna Industrija Sajber Rizik',
    oblast: 'compliance',
    tip: 'specijalizovana',
    status: 'aktivan',
    pagePath: '/digitalna-industrija-sajber-rizik',
    apiPath: '/api/digitalna-industrija-sajber-rizik',
    ownership: [KONTAKT_TEHNICKI, KONTAKT_COMPLIANCE],
    engineId: 'engine-digitalna-industrija-rizici',
    kpi: ['kriticni', 'srednji', 'kontrole'],
  },
  {
    id: 'digitalna-industrija-poreski-rizik',
    naziv: 'Digitalna Industrija Poreski Rizik',
    oblast: 'compliance',
    tip: 'specijalizovana',
    status: 'aktivan',
    pagePath: '/digitalna-industrija-poreski-rizik',
    apiPath: '/api/digitalna-industrija-poreski-rizik',
    ownership: [KONTAKT_FINANSIJE, KONTAKT_COMPLIANCE],
    engineId: 'engine-digitalna-industrija-rizici',
    kpi: ['rokovi', 'kriticni', 'rezervisanja'],
  },
  {
    id: 'digitalna-industrija-pravni-rizik',
    naziv: 'Digitalna Industrija Pravni Rizik',
    oblast: 'compliance',
    tip: 'specijalizovana',
    status: 'aktivan',
    pagePath: '/digitalna-industrija-pravni-rizik',
    apiPath: '/api/digitalna-industrija-pravni-rizik',
    ownership: [KONTAKT_COMPLIANCE, KONTAKT_BIZNIS],
    engineId: 'engine-digitalna-industrija-rizici',
    kpi: ['otvoreniPredmeti', 'kriticni', 'rokovi'],
  },
  {
    id: 'digitalna-industrija-compliance-rizik',
    naziv: 'Digitalna Industrija Compliance Rizik',
    oblast: 'compliance',
    tip: 'specijalizovana',
    status: 'aktivan',
    pagePath: '/digitalna-industrija-compliance-rizik',
    apiPath: '/api/digitalna-industrija-compliance-rizik',
    ownership: [KONTAKT_COMPLIANCE],
    engineId: 'engine-digitalna-industrija-rizici',
    kpi: ['otvoreneKontrole', 'kriticni', 'procenatUskladjenosti'],
  },
  {
    id: 'digitalna-industrija-esg-rizik',
    naziv: 'Digitalna Industrija ESG Rizik',
    oblast: 'compliance',
    tip: 'specijalizovana',
    status: 'aktivan',
    pagePath: '/digitalna-industrija-esg-rizik',
    apiPath: '/api/digitalna-industrija-esg-rizik',
    ownership: [KONTAKT_COMPLIANCE, KONTAKT_BIZNIS],
    engineId: 'engine-digitalna-industrija-rizici',
    kpi: ['esgScore', 'kriticni', 'obavezneMere'],
  },
  {
    id: 'digitalna-industrija-diskriminacija',
    naziv: 'Digitalna Industrija Diskriminacija',
    oblast: 'compliance',
    tip: 'specijalizovana',
    status: 'aktivan',
    pagePath: '/digitalna-industrija-diskriminacija',
    apiPath: '/api/digitalna-industrija-diskriminacija',
    ownership: [KONTAKT_COMPLIANCE, KONTAKT_BIZNIS],
    engineId: 'engine-digitalna-industrija-rizici',
    kpi: ['otvoreniSlucajevi', 'kriticni', 'preventivneMere'],
  },
  {
    id: 'digitalna-industrija-licencni-portfolio',
    naziv: 'Digitalna Industrija Licencni Portfolio',
    oblast: 'licensing',
    tip: 'specijalizovana',
    status: 'aktivan',
    pagePath: '/digitalna-industrija-licencni-portfolio',
    apiPath: '/api/digitalna-industrija-licencni-portfolio',
    ownership: [KONTAKT_COMPLIANCE, KONTAKT_TEHNICKI, KONTAKT_FINANSIJE],
    engineId: 'engine-digitalna-industrija-finansije',
    kpi: ['ukupno', 'verifikovano', 'ukupniBudzetRSD'],
  },
  {
    id: 'digitalna-industrija-licencni-procurement-queue',
    naziv: 'Digitalna Industrija Licencni Procurement Queue',
    oblast: 'licensing',
    tip: 'agregatna',
    status: 'aktivan',
    apiPath: '/api/digitalna-industrija-licencni-procurement-queue',
    ownership: [KONTAKT_TEHNICKI, KONTAKT_FINANSIJE],
    engineId: 'engine-digitalna-industrija-finansije',
    kpi: ['prioritetneStavke', 'blokatori', 'ukupniBudzetRSD'],
  },
  {
    id: 'digitalna-industrija-licencni-vendor-status',
    naziv: 'Digitalna Industrija Licencni Vendor Status',
    oblast: 'licensing',
    tip: 'agregatna',
    status: 'aktivan',
    apiPath: '/api/digitalna-industrija-licencni-vendor-status',
    ownership: [KONTAKT_TEHNICKI, KONTAKT_BIZNIS],
    engineId: 'engine-digitalna-industrija-finansije',
    kpi: ['uskladjenost', 'enterpriseZahtevi', 'vendorStatus'],
  },
  {
    id: 'digitalna-industrija-regulatorni-rokovi',
    naziv: 'Digitalna Industrija Regulatorni Rokovi',
    oblast: 'operativa',
    tip: 'specijalizovana',
    status: 'aktivan',
    pagePath: '/digitalna-industrija-regulatorni-rokovi',
    apiPath: '/api/digitalna-industrija-regulatorni-rokovi',
    ownership: [KONTAKT_COMPLIANCE, KONTAKT_OPERATIVA],
    kpi: ['ukupnoRokova', 'kasni', 'sledeciRok'],
  },
  {
    id: 'digitalna-industrija-izvoz-faktura',
    naziv: 'Digitalna Industrija Izvoz Faktura',
    oblast: 'operativa',
    tip: 'specijalizovana',
    status: 'aktivan',
    pagePath: '/digitalna-industrija-izvoz-faktura',
    apiPath: '/api/digitalna-industrija-izvoz-faktura',
    ownership: [KONTAKT_FINANSIJE, KONTAKT_OPERATIVA],
    kpi: ['ukupnoFaktura', 'naplaceno', 'otvoreno'],
  },
  {
    id: 'digitalna-industrija-pib-mb',
    naziv: 'Digitalna Industrija PIB/MB',
    oblast: 'operativa',
    tip: 'specijalizovana',
    status: 'aktivan',
    pagePath: '/digitalna-industrija-pib-mb',
    apiPath: '/api/digitalna-industrija-pib-mb',
    ownership: [KONTAKT_OPERATIVA],
    kpi: ['ukupnoEntiteta', 'aktivnih', 'zahtevi'],
  },
  {
    id: 'digitalna-industrija-sifra-delatnosti',
    naziv: 'Digitalna Industrija Šifra Delatnosti',
    oblast: 'operativa',
    tip: 'specijalizovana',
    status: 'aktivan',
    pagePath: '/digitalna-industrija-sifra-delatnosti',
    apiPath: '/api/digitalna-industrija-sifra-delatnosti',
    ownership: [KONTAKT_OPERATIVA, KONTAKT_COMPLIANCE],
    kpi: ['glavnaSifra', 'sporedneSifre', 'uskladjenost'],
  },
  {
    id: 'digitalna-industrija-plate',
    naziv: 'Digitalna Industrija Plate',
    oblast: 'kadrovi',
    tip: 'specijalizovana',
    status: 'aktivan',
    pagePath: '/digitalna-industrija-plate',
    apiPath: '/api/digitalna-industrija-plate',
    ownership: [KONTAKT_FINANSIJE, KONTAKT_BIZNIS],
    engineId: 'engine-digitalna-industrija-finansije',
    kpi: ['ukupnoPozicija', 'ukupanFond', 'medijana'],
  },
  {
    id: 'digitalna-industrija-pozicije',
    naziv: 'Digitalna Industrija Pozicije',
    oblast: 'kadrovi',
    tip: 'specijalizovana',
    status: 'aktivan',
    pagePath: '/digitalna-industrija-pozicije',
    apiPath: '/api/digitalna-industrija-pozicije',
    ownership: [KONTAKT_BIZNIS, KONTAKT_OPERATIVA],
    engineId: 'engine-digitalna-industrija-finansije',
    kpi: ['otvorenePozicije', 'kriticneUloge', 'timovi'],
  },
  {
    id: 'digitalna-industrija-beneficije',
    naziv: 'Digitalna Industrija Beneficije',
    oblast: 'kadrovi',
    tip: 'specijalizovana',
    status: 'aktivan',
    pagePath: '/digitalna-industrija-beneficije',
    apiPath: '/api/digitalna-industrija-beneficije',
    ownership: [KONTAKT_BIZNIS, KONTAKT_OPERATIVA],
    engineId: 'engine-digitalna-industrija-finansije',
    kpi: ['ukupnoBenefita', 'pokrivenost', 'aktivnePogodnosti'],
  },
  {
    id: 'digitalna-industrija-nagrade',
    naziv: 'Digitalna Industrija Nagrade',
    oblast: 'kadrovi',
    tip: 'specijalizovana',
    status: 'aktivan',
    pagePath: '/digitalna-industrija-nagrade',
    apiPath: '/api/digitalna-industrija-nagrade',
    ownership: [KONTAKT_BIZNIS, KONTAKT_OPERATIVA],
    engineId: 'engine-digitalna-industrija-finansije',
    kpi: ['ukupnoPrograma', 'aktivniProgrami', 'pragovi'],
  },
  {
    id: 'digitalna-industrija-nacini-placanja',
    naziv: 'Digitalna Industrija Načini Plaćanja',
    oblast: 'operativa',
    tip: 'specijalizovana',
    status: 'aktivan',
    ownership: [KONTAKT_FINANSIJE, KONTAKT_TEHNICKI],
    engineId: 'engine-digitalna-industrija-finansije',
    kpi: ['ukupnoRegiona', 'ukupnoValuta', 'aktivniProcesori'],
  },
];

const SCOPE_META: Record<
  DigitalnaIndustrijaOblast,
  Omit<DigitalnaIndustrijaScopeSegment, 'umbrella' | 'specijalizovane'>
> = {
  overview: {
    oblast: 'overview',
    naziv: 'Overview & Orkestracija',
    opis: 'Umbrella nivo za Digitalnu Industriju, rukovodni pregled, Glavni Endžin i dijagnostiku.',
    ownership: [KONTAKT_BIZNIS, KONTAKT_TEHNICKI, KONTAKT_OPERATIVA],
    kpi: ['ukupnoPovrsina', 'ukupnoSpojenih', 'kompletnost'],
  },
  finansije: {
    oblast: 'finansije',
    naziv: 'Finansije & FX',
    opis: 'Devizni tokovi, kursne liste, kursne razlike, inflacioni signal i finansijska spremnost.',
    ownership: [KONTAKT_FINANSIJE],
    kpi: ['netoDevizniSaldoEUR', 'ukupniBudzetRSD', 'kriticnaFXIzlozenostPct'],
  },
  rizici: {
    oblast: 'rizici',
    naziv: 'Rizici',
    opis: 'Valutni, kreditni, kamatni i likvidnosni rizici kao finansijski risk engine sloj.',
    ownership: [KONTAKT_FINANSIJE, KONTAKT_COMPLIANCE],
    kpi: ['kriticni', 'prosecnaIskoriscenostPct', 'prioritetniBlokatori'],
  },
  compliance: {
    oblast: 'compliance',
    naziv: 'Compliance & Governance',
    opis: 'Pravni, poreski, ESG, sajber i diskriminacioni kontrolni sloj.',
    ownership: [KONTAKT_COMPLIANCE, KONTAKT_TEHNICKI],
    kpi: ['procenatUskladjenosti', 'kriticni', 'rokovi'],
  },
  licensing: {
    oblast: 'licensing',
    naziv: 'Licensing',
    opis: 'Licencni portfolio, vendor enterprise status i procurement redosled.',
    ownership: [KONTAKT_COMPLIANCE, KONTAKT_TEHNICKI, KONTAKT_FINANSIJE],
    kpi: ['verifikovaneLicence', 'ukupniBudzetRSD', 'prioritetniBlokatori'],
  },
  kadrovi: {
    oblast: 'kadrovi',
    naziv: 'Kadrovi & Benefiti',
    opis: 'Plate, pozicije, beneficije i nagrade kao people-ops površina.',
    ownership: [KONTAKT_BIZNIS, KONTAKT_FINANSIJE],
    kpi: ['ukupnoPozicija', 'ukupanFond', 'pokrivenost'],
  },
  operativa: {
    oblast: 'operativa',
    naziv: 'Operativa',
    opis: 'Regulatorni rokovi, izvoz faktura, PIB/MB, šifra delatnosti i platni procesori.',
    ownership: [KONTAKT_OPERATIVA, KONTAKT_TEHNICKI],
    kpi: ['sledeciRok', 'naplaceno', 'aktivniProcesori'],
  },
};

function getScope(): DigitalnaIndustrijaScopeSegment[] {
  return (Object.keys(SCOPE_META) as DigitalnaIndustrijaOblast[]).map((oblast) => ({
    ...SCOPE_META[oblast],
    umbrella: POVRSINE.filter((p) => p.oblast === oblast && p.tip === 'umbrella'),
    specijalizovane: POVRSINE.filter((p) => p.oblast === oblast && p.tip === 'specijalizovana'),
  }));
}

function getPoslovniTokovi(): DigitalnaIndustrijaPoslovniTok[] {
  return [
    {
      id: 'tok-overview',
      naziv: 'Rukovodni pregled',
      opis: 'Kanonski ulaz za umbrella nivo, agregatni pregled i autofinish dijagnostiku.',
      ownership: [KONTAKT_BIZNIS, KONTAKT_OPERATIVA],
      prioritet: 'visok',
      moduli: ['industrija', 'industrija-pregled', 'digitalna-industrija-pregled', 'glavni-endzin-digitalne-industrije', 'autofinish-digitalna-industrija-pregled'],
      pagePath: '/industrija',
      apiPath: '/api/digitalna-industrija-pregled',
    },
    {
      id: 'tok-finansije',
      naziv: 'Finansijski tok',
      opis: 'Devizni tokovi, kursno upravljanje i inflacioni pregled za digitalnu industriju.',
      ownership: [KONTAKT_FINANSIJE],
      prioritet: 'kritican',
      moduli: [
        'digitalna-industrija-devizni-saldo',
        'digitalna-industrija-devizni-prilivi',
        'digitalna-industrija-devizni-odlivi',
        'digitalna-industrija-kursna-lista',
        'digitalna-industrija-kursne-razlike',
        'digitalna-industrija-inflacije',
      ],
      pagePath: '/digitalna-industrija-devizni-saldo',
      apiPath: '/api/digitalna-industrija-devizni-saldo',
    },
    {
      id: 'tok-rizici-compliance',
      naziv: 'Rizici i usklađenost',
      opis: 'Finansijski i nefinansijski rizici objedinjeni oko kontrola, pragova i eskalacija.',
      ownership: [KONTAKT_COMPLIANCE, KONTAKT_FINANSIJE],
      prioritet: 'kritican',
      moduli: [
        'digitalna-industrija-valutni-rizik',
        'digitalna-industrija-kreditni-rizik',
        'digitalna-industrija-kamatni-rizik',
        'digitalna-industrija-likvidnosni-rizik',
        'digitalna-industrija-sajber-rizik',
        'digitalna-industrija-poreski-rizik',
        'digitalna-industrija-pravni-rizik',
        'digitalna-industrija-compliance-rizik',
        'digitalna-industrija-esg-rizik',
        'digitalna-industrija-diskriminacija',
      ],
      pagePath: '/digitalna-industrija-valutni-rizik',
      apiPath: '/api/digitalna-industrija-valutni-rizik',
    },
    {
      id: 'tok-licensing-operativa',
      naziv: 'Licensing i operativa',
      opis: 'Licencni portfolio, regulatorni rokovi, vendor status i dokumentaciona spremnost.',
      ownership: [KONTAKT_COMPLIANCE, KONTAKT_OPERATIVA, KONTAKT_TEHNICKI],
      prioritet: 'kritican',
      moduli: [
        'digitalna-industrija-licencni-portfolio',
        'digitalna-industrija-licencni-procurement-queue',
        'digitalna-industrija-licencni-vendor-status',
        'digitalna-industrija-regulatorni-rokovi',
        'digitalna-industrija-izvoz-faktura',
        'digitalna-industrija-pib-mb',
        'digitalna-industrija-sifra-delatnosti',
        'digitalna-industrija-nacini-placanja',
      ],
      pagePath: '/digitalna-industrija-licencni-portfolio',
      apiPath: '/api/digitalna-industrija-licencni-portfolio',
    },
    {
      id: 'tok-kadrovi',
      naziv: 'Kadrovi i people ops',
      opis: 'Plate, pozicije, beneficije i nagrade grupisane kao people-ops surface.',
      ownership: [KONTAKT_BIZNIS, KONTAKT_FINANSIJE],
      prioritet: 'srednji',
      moduli: [
        'digitalna-industrija-plate',
        'digitalna-industrija-pozicije',
        'digitalna-industrija-beneficije',
        'digitalna-industrija-nagrade',
      ],
      pagePath: '/digitalna-industrija-plate',
      apiPath: '/api/digitalna-industrija-plate',
    },
  ];
}

function getTopBlokatori() {
  const portfolio = buildDigitalnaIndustrijaLicencniPortfolio();
  return portfolio.stavke
    .filter((stavka) => stavka.blokator !== 'neblokirajuca')
    .sort((a, b) => {
      const blokatorPoredak: Record<LicencniPortfolioBlokator, number> = {
        blokira_legalan_rad: 0,
        blokira_platforme: 1,
        neblokirajuca: 2,
      };
      const nivoPoredak: Record<LicencniPortfolioNivo, number> = {
        'maticni-subjekt': 0,
        'povezani-entitet': 1,
        'platforma-asset': 2,
        'vendor-enterprise': 3,
      };
      return (
        blokatorPoredak[a.blokator] - blokatorPoredak[b.blokator] ||
        nivoPoredak[a.nivo] - nivoPoredak[b.nivo] ||
        a.naziv.localeCompare(b.naziv)
      );
    })
    .slice(0, 5)
    .map((stavka) => ({
      id: stavka.id,
      entitet: stavka.entitet,
      naziv: stavka.naziv,
      blokator: stavka.blokator,
      status: stavka.status,
      rok: stavka.rok,
      vlasnik: stavka.vlasnik,
    }));
}

function getOperativniPregled(): DigitalnaIndustrijaOperativniPregled {
  const portfolio = buildDigitalnaIndustrijaLicencniPortfolio();
  const saldo = buildDigitalnaIndustrijaDevizniSaldo('digitalna-industrija-pregled');
  const fxRisk = buildDigitalnaIndustrijaValutniRizik('digitalna-industrija-pregled');
  const kriticnaFxStavka =
    fxRisk.izlozenosti
      .filter((stavka) => stavka.status === 'kritican')
      .sort((a, b) => b.iskoriscenostLimitaPct - a.iskoriscenostLimitaPct)[0] ?? null;
  const upozorenja: string[] = [];

  if (portfolio.summary.blokirajucihLegalanRad > 0) {
    upozorenja.push(
      `${portfolio.summary.blokirajucihLegalanRad} licencnih stavki i dalje blokira legalan rad.`,
    );
  }
  if (kriticnaFxStavka) {
    upozorenja.push(
      `Kritična FX izloženost na portfoliju "${kriticnaFxStavka.portfolio}" (${kriticnaFxStavka.iskoriscenostLimitaPct}%).`,
    );
  }
  if (saldo.kpi.netoEUR < 0) {
    upozorenja.push(`Devizni saldo u EUR je negativan (${saldo.kpi.netoEUR}).`);
  }
  if (portfolio.vendorEnterpriseIntegrisan.some((stavka) => !stavka.uskladen)) {
    upozorenja.push('Vendor enterprise status nije potpuno usklađen sa licencnim portfoliom.');
  }

  return {
    ukupnoPovrsina: POVRSINE.length,
    specijalizovanihModula: POVRSINE.filter((p) => p.tip === 'specijalizovana').length,
    prioritetniBlokatori: portfolio.summary.blokirajucihLegalanRad,
    blokatoriPlatformi: portfolio.summary.blokirajucihPlatforme,
    verifikovaneLicence: portfolio.summary.verifikovano,
    ukupniBudzetRSD: portfolio.summary.ukupniBudzetRSD,
    kriticnaFXIzlozenostPct: kriticnaFxStavka?.iskoriscenostLimitaPct ?? 0,
    netoDevizniSaldoEUR: saldo.kpi.netoEUR,
    glavniEndzin: getGlavniEndzinPregled(),
    upozorenja,
  };
}

export function getDigitalnaIndustrijaGovernance(): DigitalnaIndustrijaGovernance {
  return {
    sourceOfTruth: [
      '/industrija',
      '/api/industrija',
      '/api/digitalna-industrija-pregled',
      '/api/glavni-endzin-digitalne-industrije',
      '/api/autofinish-digitalna-industrija-pregled',
    ],
    qualityGate: ['lint', 'test', 'smoke', 'predeploy', 'security'],
    secretsBoundary: [
      'GitHub Secrets, Vercel secrets i privatni ključevi ostaju van Git repozitorijuma.',
      'Deploy hook URL-ovi i env vrednosti ne smeju biti upisani u dokumentaciju ili seed podatke.',
    ],
    reviewModel: [
      'Human review je obavezan pre merge-a.',
      'Config/deploy promene zahtevaju audit-ready summary sa rollout i rollback planom.',
    ],
    downstream: [
      'Ako Digitalna Industrija menja linked-repo ponašanje, opis mora biti dodat u docs/MULTI-REPO-LINKS.md.',
      'Ova konsolidacija ostaje repo-local i ne uvodi nove downstream sinhronizacije.',
    ],
  };
}

export function getDigitalnaIndustrijaDomenModel(): DigitalnaIndustrijaDomenModel {
  return {
    naziv: 'Digitalna Industrija',
    verzija: APP_VERSION,
    status: 'aktivan',
    umbrellaNivoi: ['industrija', 'glavni-endzin-digitalne-industrije'],
    scope: getScope(),
    poslovniTokovi: getPoslovniTokovi(),
    povrsine: POVRSINE,
    governance: getDigitalnaIndustrijaGovernance(),
    operativniPregled: getOperativniPregled(),
  };
}

export function buildDigitalnaIndustrijaPregled() {
  const domen = getDigitalnaIndustrijaDomenModel();
  return {
    status: 'aktivan' as const,
    naziv: 'Digitalna Industrija Pregled — Kanonski Scope i Operativni Pregled',
    verzija: domen.verzija,
    scope: domen.scope,
    umbrellaNivoi: domen.umbrellaNivoi,
    poslovniTokovi: domen.poslovniTokovi,
    povrsine: domen.povrsine,
    governance: domen.governance,
    operativniPregled: domen.operativniPregled,
    prioritetniBlokatori: getTopBlokatori(),
    timestamp: new Date().toISOString(),
  };
}
