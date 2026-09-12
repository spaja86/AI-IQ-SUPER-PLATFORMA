import { APP_VERSION } from './constants';

export interface ExtrimliStoryVertical {
  id: string;
  naziv: string;
  publika: string;
  kanali: string[];
  formati: string[];
  teme: string[];
  tonovi: string[];
  status: 'spremno' | 'u-razvoju';
}

export interface ExtrimliPriceCatalog {
  naziv: string;
  verzija: string;
  opis: string;
  vertikale: ExtrimliStoryVertical[];
  integracije: string[];
}

export function getExtrimliPriceCatalog(): ExtrimliPriceCatalog {
  return {
    naziv: 'EXTRIMLI / EXTRONDOL / EXTREM — Kreacija Priča',
    verzija: APP_VERSION,
    opis: 'Narativni i content sloj za igrice, biskop i srodne branše povezan sa gaming, EXTRIMLI i reklamnim modulima.',
    vertikale: [
      {
        id: 'igrice',
        naziv: 'Igrice',
        publika: 'Gejmeri, streameri, gaming partneri',
        kanali: ['landing stranice', 'promo kampanje', 'story teaseri'],
        formati: ['hero priča', 'misija', 'kampanja', 'lore', 'promo copy'],
        teme: ['kompeticija', 'dimenzionalni svetovi', 'timska igra', 'AI izazovi'],
        tonovi: ['energičan', 'takmičarski', 'spektakularan'],
        status: 'spremno',
      },
      {
        id: 'biskop',
        naziv: 'Biskop',
        publika: 'Vizuelni mediji, trailer publika, event produkcija',
        kanali: ['showcase stranice', 'teaser pitch', 'partner deck'],
        formati: ['sinopsis', 'najava', 'pitch', 'promo narativ'],
        teme: ['vizuelni spektakl', 'urbana budućnost', 'premium produkcija'],
        tonovi: ['filmski', 'ambiciozan', 'dramatičan'],
        status: 'u-razvoju',
      },
      {
        id: 'ostalo',
        naziv: 'Ostale kompatibilne branše',
        publika: 'B2B partneri, edukacija, tehnološke i media vertikale',
        kanali: ['case study', 'newsletter', 'partner story'],
        formati: ['case study', 'micro-copy', 'long-form priča'],
        teme: ['inovacija', 'saradnja', 'operativna transformacija'],
        tonovi: ['pouzdan', 'vizionarski', 'poslovan'],
        status: 'spremno',
      },
    ],
    integracije: ['/igrice', '/ekstrimli-ekstrem', '/reklame-i-partnerstva', '/diktor-komandni-centar'],
  };
}
