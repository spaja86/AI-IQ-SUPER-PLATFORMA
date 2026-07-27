import { APP_VERSION, KOMPANIJA, OMEGA_AI_PERSONA_UKUPNO, SPAJA_PRO_RANGE } from '@/lib/constants';

export interface StoryOfLifeMilestone {
  period: string;
  fokus: string;
  ishod: string;
}

export interface StoryOfLifeSignal {
  naziv: string;
  opis: string;
  status: 'aktivno' | 'stabilno' | 'u_razvoju';
}

export interface StoryOfLifeData {
  naziv: string;
  verzija: string;
  opis: string;
  timeline: StoryOfLifeMilestone[];
  signali: StoryOfLifeSignal[];
  statistika: {
    platforme: number;
    apiRute: number;
    sekvence: number;
    omegaPersona: number;
    spajaProVerzije: string;
  };
}

export function getStoryOfLifeData(): StoryOfLifeData {
  return {
    naziv: 'STORY OF LIFE',
    verzija: APP_VERSION,
    opis: `${KOMPANIJA} narativni modul koji objedinjeno prikazuje evoluciju, sisteme i smer razvoja digitalne industrije.`,
    timeline: [
      {
        period: 'Faza 1 — Temelj',
        fokus: 'Definisanje jezgra, identiteta i sekvencijalne arhitekture',
        ishod: 'Stabilna osnova za razvoj modularnih stranica i API ruta',
      },
      {
        period: 'Faza 2 — Skaliranje',
        fokus: 'Širenje platformi, sekvenci i operativnih modula',
        ishod: 'Povećan obuhvat funkcionalnosti i interoperabilnosti',
      },
      {
        period: 'Faza 3 — Automatizacija',
        fokus: 'Autofinish tokovi, dijagnostika i samonadzor',
        ishod: 'Kontinuirani razvoj uz automatske povratne petlje',
      },
      {
        period: 'Faza 4 — Ekspanzija',
        fokus: 'Povezivanje sa spoljnim platformama i multi-repo koordinacija',
        ishod: 'Konzistentan rast kroz sinkronizovane module',
      },
    ],
    signali: [
      {
        naziv: 'Sekvence-first',
        opis: 'Sadržaj se modeluje kroz tipizirane sekvence umesto ad-hoc UI implementacija.',
        status: 'stabilno',
      },
      {
        naziv: 'Autonomna evolucija',
        opis: 'Sistem periodično proverava stanje i generiše naredne korake.',
        status: 'aktivno',
      },
      {
        naziv: 'Cross-platform narativ',
        opis: 'Jedinstven prikaz životnog ciklusa kroz više domena i podsistema.',
        status: 'u_razvoju',
      },
    ],
    statistika: {
      platforme: 12,
      apiRute: 1258,
      sekvence: 10,
      omegaPersona: OMEGA_AI_PERSONA_UKUPNO,
      spajaProVerzije: SPAJA_PRO_RANGE,
    },
  };
}
