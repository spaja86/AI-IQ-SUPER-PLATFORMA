import { APP_VERSION } from './constants';
import { igrice, getSveKategorijeIgrica, type StatusIgrice } from './igrice';
import {
  gamingStatistika,
  gamingKonfiguracija,
  getAktivneIgriceSaEndzinom,
  IOOPENUIAO_URL,
} from './io-openui-ao-gaming-platforma';
import { getGlavniEndzinStatistika } from './glavni-endzin-digitalne-industrije';

export type GejmingLifecycleFaza =
  | 'vizioniranje'
  | 'izmisljanje'
  | 'stvaranje'
  | 'dodavanje'
  | 'omogucavanje'
  | 'eksploatisanje';

export interface GejmingLifecycleTok {
  faza: GejmingLifecycleFaza;
  opis: string;
  brojIgrica: number;
}

export interface GejmingIndustrijaRezultat {
  status: 'aktivan';
  userId: string;
  timestamp: string;
  verzija: string;
  pregled: {
    ukupnoIgrica: number;
    katalogKategorija: number;
    aktivnihIgrica: number;
    planiranihIgrica: number;
    starihIgrica: number;
    novihIgrica: number;
    prosecnaOptimizacija: number;
  };
  domeni: {
    katalogIgara: {
      kategorije: string[];
      poKategoriji: Array<{ kategorija: string; brojIgrica: number }>;
    };
    lifecycleIgara: {
      aktivne: number;
      beta: number;
      razvoj: number;
      planirane: number;
      tokovi: GejmingLifecycleTok[];
    };
    gameCreationPipeline: {
      faze: GejmingLifecycleTok[];
      kapacitetNovihIgrica: number;
    };
    distribucijaMonetizacija: {
      primarniKanal: string;
      laboratorijaKanal: string;
      monetizacijaKanali: string[];
      distribucijaKanali: string[];
    };
    pristupKorisnika: {
      loginObavezan: boolean;
      primarniPristup: string;
      laboratorijaPristup: string;
      url: {
        gejmingIndustrija: string;
        igrice: string;
        gamingPlatforma: string;
        login: string;
      };
    };
  };
  kpi: {
    engineGamingEndzina: number;
    enginePokrenutihIgrica: number;
    gejmingKategorija: number;
    gejmingSaPrevucenimEndzinom: number;
    aktivneIgriceSaEndzinom: number;
  };
}

function countByStatus(status: StatusIgrice): number {
  return igrice.filter((igrica) => igrica.status === status).length;
}

function buildLifecycleTokovi(): GejmingLifecycleTok[] {
  const planirane = countByStatus('planirana');
  const razvoj = countByStatus('razvoj');
  const beta = countByStatus('beta');
  const aktivne = countByStatus('aktivna');
  const saLinkom = igrice.filter((igrica) => Boolean(igrica.link)).length;

  return [
    {
      faza: 'vizioniranje',
      opis: 'Vizioniranje i definisanje novih koncepata igrica',
      brojIgrica: planirane + razvoj,
    },
    {
      faza: 'izmisljanje',
      opis: 'Kreativno izmišljanje mehanika i gejm-play modela',
      brojIgrica: razvoj,
    },
    {
      faza: 'stvaranje',
      opis: 'Stvaranje prototipa i funkcionalnih verzija igrica',
      brojIgrica: razvoj + beta,
    },
    {
      faza: 'dodavanje',
      opis: 'Dodavanje igrica u katalog i platformsku distribuciju',
      brojIgrica: beta + aktivne,
    },
    {
      faza: 'omogucavanje',
      opis: 'Omogućavanje igranja kroz Digitalnu Industriju i platforme',
      brojIgrica: aktivne,
    },
    {
      faza: 'eksploatisanje',
      opis: 'Eksploatisanje kroz distribuciju, optimizaciju i monetizaciju',
      brojIgrica: saLinkom,
    },
  ];
}

export function buildGejmingIndustrija(userId: string): GejmingIndustrijaRezultat {
  const kategorije = getSveKategorijeIgrica();
  const aktivne = countByStatus('aktivna');
  const beta = countByStatus('beta');
  const razvoj = countByStatus('razvoj');
  const planirane = countByStatus('planirana');
  const stareIgrice = aktivne + beta;
  const noveIgrice = razvoj + planirane;
  const tokovi = buildLifecycleTokovi();
  const glavniEndzinStats = getGlavniEndzinStatistika();
  const aktivneSaEndzinom = getAktivneIgriceSaEndzinom().length;

  return {
    status: 'aktivan',
    userId,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
    pregled: {
      ukupnoIgrica: igrice.length,
      katalogKategorija: kategorije.length,
      aktivnihIgrica: aktivne,
      planiranihIgrica: planirane,
      starihIgrica: stareIgrice,
      novihIgrica: noveIgrice,
      prosecnaOptimizacija: gamingStatistika.prosecnaOptimizacija,
    },
    domeni: {
      katalogIgara: {
        kategorije,
        poKategoriji: kategorije.map((kategorija) => ({
          kategorija,
          brojIgrica: igrice.filter((igrica) => igrica.kategorija === kategorija).length,
        })),
      },
      lifecycleIgara: {
        aktivne,
        beta,
        razvoj,
        planirane,
        tokovi,
      },
      gameCreationPipeline: {
        faze: tokovi,
        kapacitetNovihIgrica: razvoj + planirane + beta,
      },
      distribucijaMonetizacija: {
        primarniKanal: 'Digitalna Industrija (AI IQ SUPER PLATFORMA)',
        laboratorijaKanal: `IO/OPENUI/AO (${IOOPENUIAO_URL})`,
        monetizacijaKanali: [
          'SpajaPro planovi',
          'Gaming pretplate i premium pristup',
          'Platformska partnerstva i reklame',
        ],
        distribucijaKanali: [
          '/igrice katalog',
          '/io-openui-ao-gaming-platforma laboratorija',
          'Digitalni Brouvzer pristup po igrici',
        ],
      },
      pristupKorisnika: {
        loginObavezan: true,
        primarniPristup: 'Login na platformu → Gejming Industrija → Igrice',
        laboratorijaPristup: 'IO/OPENUI/AO kao laboratorija i demo okruženje',
        url: {
          gejmingIndustrija: '/gejming-industrija',
          igrice: '/igrice',
          gamingPlatforma: '/io-openui-ao-gaming-platforma',
          login: '/login',
        },
      },
    },
    kpi: {
      engineGamingEndzina: glavniEndzinStats.gamingEndžina,
      enginePokrenutihIgrica: glavniEndzinStats.ukupnoIgricaPokrenutih,
      gejmingKategorija: gamingStatistika.ukupnoKategorija,
      gejmingSaPrevucenimEndzinom: gamingStatistika.prevucenoEndžinom,
      aktivneIgriceSaEndzinom: aktivneSaEndzinom,
    },
  };
}
