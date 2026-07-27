import { APP_VERSION, AUTOFINISH_COUNT, OMEGA_AI_OKTAVA_COUNT, OMEGA_AI_PERSONA_COUNT } from '@/lib/constants';
import {
  getEvolucijskaIstorija,
  getKonfiguracija,
  pokeniEvolucijskuDijagnostiku as pokreniEvolucijskuDijagnostiku,
} from '@/lib/evolucija';
import {
  metaPrompti,
  podrazumevaniGenetskiParametri,
  spajaPro13Konfiguracija,
} from '@/lib/spaja-pro-13-evolucija';

export type {
  EvolucijaCiklus,
  EvolucijaCiklusStatus,
  EvolucijaDijagnostika,
  EvolucijaPrioritet,
  EvolucijaTip,
  EvolucijskaAkcija,
  EvolucijskaIstorija,
  EvolucijskaKonfiguracija,
  EvolucijskaPreporuka,
} from '@/lib/evolucija';

export type {
  EvolucijaDijagnostika as SpajaPro13EvolucijaDijagnostika,
  EvolucijaGeneracija,
  EvolucijaMutacija,
  EvolucijaSelekcija,
  EvolucijaSesija,
  EvolucijaStatus,
  GenetskiParametri,
  MetaPrompt,
  PromptHromozom,
  SpajaPro13Konfiguracija,
} from '@/lib/spaja-pro-13-evolucija';

export interface SpajaNikOpenBrand {
  naziv: 'SpajaNikOpenEvolution';
  prikazNaziv: 'SpajaNikopEvolution';
  youtubeHandle: '@spajanikopenevolution';
  youtubeUrl: 'https://www.youtube.com/@spajanikopenevolution';
  opis: string;
  kategorijeSadrzaja: string[];
  mreze: Array<{
    naziv: string;
    url: string;
    korisnickoIme: string;
  }>;
}

export interface OmegaEvolutionStatus {
  verzija: string;
  platformaZdravlje: number;
  ukupnoProvera: number;
  kriticnih: number;
  ukupnoCiklusa: number;
  uspesnihCiklusa: number;
  poslednjiCiklus: string | null;
  sledeciCiklus: string | null;
  aktivnePersone: number;
  ukupnoPersona: number;
  ukupnoOktava: number;
  cronInterval: string;
  maxIssuePoDanu: number;
  autoMerge: boolean;
  neuronskiCiklusi: number;
  neuronskiSlojevi: number;
  spajaPro13Verzija: number;
  spajaPro13MaxGeneracija: number;
  spajaPro13MutacijaRate: number;
  spajaPro13CiljniFitness: number;
  spajaPro13MetaPromptovi: number;
  autofinishIteracija: number;
}

export interface OmegaEvolutionPregled {
  status: OmegaEvolutionStatus;
  brand: SpajaNikOpenBrand;
  endpointi: string[];
  neuronskaEvolucija: {
    genetskiAlgoritam: string;
    mutacijskaStopa: number;
    ciklusi: Array<{
      ciklus: number;
      epoha: number;
      gubitak: number;
      tacnost: string;
      status: 'završen' | 'aktivan';
    }>;
  };
  spajaPro13: {
    naziv: string;
    kodnoIme: string;
    status: string;
    maxTokena: number;
    autonomnoUcenje: boolean;
    samoEvolucija: boolean;
    promptVerzionisanje: boolean;
    feedbackIntegracija: boolean;
  };
  timestamp: string;
}

const OMEGA_EVOLUTION_ENDPOINTI = [
  '/api/omega-evolution',
  '/api/evolucija',
  '/api/evolucija-status',
  '/api/evolucija-pregled',
  '/api/evolucija-dijagnostika',
  '/api/evolucija-ciklus',
  '/api/cron/evolucija',
  '/api/omega-evolucija-mapa',
  '/api/omega-neuronska-evolucija',
  '/api/spaja-pro-evolucija',
  '/api/omega-ai',
] as const;

const NEURONSKI_CIKLUSI = [
  { ciklus: 1, epoha: 1000, gubitak: 0.0012, tacnost: '99.88%', status: 'završen' as const },
  { ciklus: 2, epoha: 2000, gubitak: 0.0006, tacnost: '99.94%', status: 'završen' as const },
  { ciklus: 3, epoha: 5000, gubitak: 0.0001, tacnost: '99.99%', status: 'aktivan' as const },
];

const NEURONSKI_SLOJEVI = 5;

export function getSpajaNikOpenBrand(): SpajaNikOpenBrand {
  return {
    naziv: 'SpajaNikOpenEvolution',
    prikazNaziv: 'SpajaNikopEvolution',
    youtubeHandle: '@spajanikopenevolution',
    youtubeUrl: 'https://www.youtube.com/@spajanikopenevolution',
    opis: 'Zvanični SpajaNikOpenEvolution kanal za video tutorijale, analize i demonstracije evolucije platforme.',
    kategorijeSadrzaja: ['tutoriali', 'analize', 'demonstracije'],
    mreze: [
      {
        naziv: 'YouTube',
        url: 'https://www.youtube.com/@spajanikopenevolution',
        korisnickoIme: 'SpajaNikopEvolution',
      },
    ],
  };
}

export function getOmegaEvolutionPregled(): OmegaEvolutionPregled {
  const istorija = getEvolucijskaIstorija();
  const konfiguracija = getKonfiguracija();
  const dijagnostika = pokreniEvolucijskuDijagnostiku();

  return {
    status: {
      verzija: APP_VERSION,
      platformaZdravlje: dijagnostika.zdravlje,
      ukupnoProvera: dijagnostika.ukupnoProvera,
      kriticnih: dijagnostika.kriticnih,
      ukupnoCiklusa: istorija.ukupnoCiklusa,
      uspesnihCiklusa: istorija.uspesnihCiklusa,
      poslednjiCiklus: istorija.poslednjiCiklus,
      sledeciCiklus: istorija.sledeciCiklus,
      aktivnePersone: konfiguracija.aktivnePersone.length,
      ukupnoPersona: OMEGA_AI_PERSONA_COUNT,
      ukupnoOktava: OMEGA_AI_OKTAVA_COUNT,
      cronInterval: konfiguracija.cronInterval,
      maxIssuePoDanu: konfiguracija.maxIssuePoDanu,
      autoMerge: konfiguracija.autoMerge,
      neuronskiCiklusi: NEURONSKI_CIKLUSI.length,
      neuronskiSlojevi: NEURONSKI_SLOJEVI,
      spajaPro13Verzija: spajaPro13Konfiguracija.verzija,
      spajaPro13MaxGeneracija: podrazumevaniGenetskiParametri.maxGeneracija,
      spajaPro13MutacijaRate: podrazumevaniGenetskiParametri.stopaMutacije,
      spajaPro13CiljniFitness: podrazumevaniGenetskiParametri.ciljnaFitness,
      spajaPro13MetaPromptovi: metaPrompti.length,
      autofinishIteracija: AUTOFINISH_COUNT,
    },
    brand: getSpajaNikOpenBrand(),
    endpointi: [...OMEGA_EVOLUTION_ENDPOINTI],
    neuronskaEvolucija: {
      genetskiAlgoritam: 'OMEGA-GA-v3',
      mutacijskaStopa: 0.001,
      ciklusi: [...NEURONSKI_CIKLUSI],
    },
    spajaPro13: {
      naziv: spajaPro13Konfiguracija.naziv,
      kodnoIme: spajaPro13Konfiguracija.kodnoIme,
      status: spajaPro13Konfiguracija.status,
      maxTokena: spajaPro13Konfiguracija.maxTokena,
      autonomnoUcenje: spajaPro13Konfiguracija.autonomnoUcenje,
      samoEvolucija: spajaPro13Konfiguracija.samoEvolucija,
      promptVerzionisanje: spajaPro13Konfiguracija.promptVerzionisanje,
      feedbackIntegracija: spajaPro13Konfiguracija.feedbackIntegracija,
    },
    timestamp: new Date().toISOString(),
  };
}
