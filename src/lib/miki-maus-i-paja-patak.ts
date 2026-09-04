import { APP_VERSION, KOMPANIJA } from '@/lib/constants';

export interface MikiPajaLik {
  ime: string;
  uloga: string;
  osobina: string;
}

export interface MikiPajaScena {
  korak: string;
  fokus: string;
  ishod: string;
}

export interface MikiPajaData {
  naziv: string;
  verzija: string;
  opis: string;
  likovi: MikiPajaLik[];
  scene: MikiPajaScena[];
  poruke: string[];
  statistika: {
    brojLikova: number;
    brojScena: number;
    ton: string;
    tipModula: string;
  };
}

export function getMikiMausIPajaPatakData(): MikiPajaData {
  const likovi: MikiPajaLik[] = [
    {
      ime: 'Miki Maus',
      uloga: 'Strateg i organizator',
      osobina: 'Brzo pronalazi rešenje i održava timski ritam',
    },
    {
      ime: 'Paja Patak',
      uloga: 'Operativni pokretač',
      osobina: 'Energičan je i gura akciju kroz praktične korake',
    },
  ];

  const scene: MikiPajaScena[] = [
    {
      korak: 'Scena 1 — Uvod',
      fokus: 'Postavljanje zajedničkog cilja i plana',
      ishod: 'Jasna podela uloga i početni operativni zamah',
    },
    {
      korak: 'Scena 2 — Izazov',
      fokus: 'Suočavanje sa preprekom i korekcija toka',
      ishod: 'Usaglašena strategija i stabilizacija procesa',
    },
    {
      korak: 'Scena 3 — Ishod',
      fokus: 'Završetak zadatka uz koordinaciju i tempo',
      ishod: 'Uspešno rešenje i prenos lekcija na sledeći ciklus',
    },
  ];

  return {
    naziv: 'MIKI MAUS I PAJA PATAK',
    verzija: APP_VERSION,
    opis: `${KOMPANIJA} narativni modul o partnerstvu, koordinaciji i timskom rešavanju problema kroz poznati dvojac.`,
    likovi,
    scene,
    poruke: [
      'Jasna komunikacija ubrzava rešavanje problema.',
      'Različiti stilovi rada mogu biti komplementarni.',
      'Ritam tima je ključan za stabilan ishod.',
    ],
    statistika: {
      brojLikova: likovi.length,
      brojScena: scene.length,
      ton: 'porodični narativ',
      tipModula: 'sekvence + API',
    },
  };
}
