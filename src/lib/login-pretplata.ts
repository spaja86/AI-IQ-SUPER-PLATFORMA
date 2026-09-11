import { isOwnerEmail } from './owner-identity';

export const STANDARDIZOVANI_PRETPLATA_STATUSI = ['aktivan', 'cekanje', 'verifikacija', 'blokiran'] as const;

export type StandardizovaniPretplataStatus = (typeof STANDARDIZOVANI_PRETPLATA_STATUSI)[number];

export interface PretplataStatusDefinicija {
  status: StandardizovaniPretplataStatus;
  opis: string;
  goNoGo: 'go' | 'no-go';
}

export const STANDARDIZOVANI_PRETPLATA_STATUS_MODEL: PretplataStatusDefinicija[] = [
  { status: 'aktivan', opis: 'Pretplata je aktivna i digitalna industrija je dostupna.', goNoGo: 'go' },
  { status: 'cekanje', opis: 'Pretplata je u čekanju potvrde uplate ili aktivacije.', goNoGo: 'no-go' },
  { status: 'verifikacija', opis: 'Potrebna je verifikacija naloga ili komercijalnih podataka.', goNoGo: 'no-go' },
  { status: 'blokiran', opis: 'Pristup je blokiran dok se ne otklone obavezni blokatori.', goNoGo: 'no-go' },
];

export interface IndustrijaDozvole {
  industrija: boolean;
  platforme: boolean;
  ekosistem: boolean;
  gamingPlatforma: boolean;
  delatnosti: boolean;
  gejmingKonstrukcija: boolean;
}

export interface OnboardingGoNoGo {
  registracija: 'go' | 'hold';
  verifikacija: 'go' | 'hold';
  odabirPlana: 'go' | 'hold';
  industrijskeFunkcije: 'go' | 'hold';
  sledeciKorak: 'registracija' | 'verifikacija' | 'odabir-plana' | 'industrija-otkljucana' | 'manual-review';
}

export interface PretplataSnapshot {
  status: StandardizovaniPretplataStatus;
  plan: string;
  goNoGo: 'go' | 'no-go';
  dozvole: IndustrijaDozvole;
  onboarding: OnboardingGoNoGo;
  razlog: string;
  source: 'owner-policy' | 'role-policy' | 'fallback';
}

export interface BuildPretplataSnapshotInput {
  email: string;
  roles: readonly string[];
  digitalIndustryAccess: boolean;
}

function imaUlogu(roles: readonly string[], ...candidates: string[]): boolean {
  const normalized = new Set(roles.map((role) => role.toLowerCase()));
  return candidates.some((candidate) => normalized.has(candidate.toLowerCase()));
}

function deriveStatus(roles: readonly string[]): {
  status: StandardizovaniPretplataStatus;
  source: PretplataSnapshot['source'];
  razlog: string;
} {
  if (imaUlogu(roles, 'subscription-blocked', 'pretplata-blokiran', 'billing-blocked')) {
    return {
      status: 'blokiran',
      source: 'role-policy',
      razlog: 'Pretplata je blokirana po billing/compliance pravilima.',
    };
  }

  if (imaUlogu(roles, 'subscription-verification', 'pretplata-verifikacija', 'billing-verification')) {
    return {
      status: 'verifikacija',
      source: 'role-policy',
      razlog: 'Nalog zahteva dodatnu verifikaciju pre aktivacije pretplate.',
    };
  }

  if (imaUlogu(roles, 'subscription-pending', 'pretplata-cekanje', 'billing-pending')) {
    return {
      status: 'cekanje',
      source: 'role-policy',
      razlog: 'Pretplata je u čekanju potvrde i još nije aktivirana.',
    };
  }

  return {
    status: 'aktivan',
    source: 'fallback',
    razlog: 'Pretplata je podrazumevano aktivna za ovaj profil.',
  };
}

function dozvoleZaStatus(status: StandardizovaniPretplataStatus): IndustrijaDozvole {
  if (status === 'aktivan') {
    return {
      industrija: true,
      platforme: true,
      ekosistem: true,
      gamingPlatforma: true,
      delatnosti: true,
      gejmingKonstrukcija: true,
    };
  }

  if (status === 'cekanje' || status === 'verifikacija') {
    return {
      industrija: false,
      platforme: true,
      ekosistem: false,
      gamingPlatforma: false,
      delatnosti: false,
      gejmingKonstrukcija: false,
    };
  }

  return {
    industrija: false,
    platforme: false,
    ekosistem: false,
    gamingPlatforma: false,
    delatnosti: false,
    gejmingKonstrukcija: false,
  };
}

function onboardingZaStatus(status: StandardizovaniPretplataStatus): OnboardingGoNoGo {
  if (status === 'aktivan') {
    return {
      registracija: 'go',
      verifikacija: 'go',
      odabirPlana: 'go',
      industrijskeFunkcije: 'go',
      sledeciKorak: 'industrija-otkljucana',
    };
  }

  if (status === 'cekanje') {
    return {
      registracija: 'go',
      verifikacija: 'go',
      odabirPlana: 'hold',
      industrijskeFunkcije: 'hold',
      sledeciKorak: 'odabir-plana',
    };
  }

  if (status === 'verifikacija') {
    return {
      registracija: 'go',
      verifikacija: 'hold',
      odabirPlana: 'hold',
      industrijskeFunkcije: 'hold',
      sledeciKorak: 'verifikacija',
    };
  }

  return {
    registracija: 'hold',
    verifikacija: 'hold',
    odabirPlana: 'hold',
    industrijskeFunkcije: 'hold',
    sledeciKorak: 'manual-review',
  };
}

export function buildPretplataSnapshot(input: BuildPretplataSnapshotInput): PretplataSnapshot {
  const derived = deriveStatus(input.roles);

  if (isOwnerEmail(input.email) && input.digitalIndustryAccess && derived.status === 'aktivan') {
    const status: StandardizovaniPretplataStatus = 'aktivan';
    return {
      status,
      plan: 'Unlimited VIP',
      goNoGo: 'go',
      dozvole: dozvoleZaStatus(status),
      onboarding: onboardingZaStatus(status),
      razlog: 'Owner nalog ima aktivnu enterprise pretplatu.',
      source: 'owner-policy',
    };
  }

  const status = !input.digitalIndustryAccess ? 'blokiran' : derived.status;
  const razlog = !input.digitalIndustryAccess
    ? 'Digitalna industrija nije odobrena za ovaj nalog.'
    : derived.razlog;
  const source = !input.digitalIndustryAccess && derived.status !== 'blokiran'
    ? 'fallback'
    : derived.source;
  return {
    status,
    plan: status === 'aktivan' ? 'Starter' : 'Nije aktiviran',
    goNoGo: status === 'aktivan' ? 'go' : 'no-go',
    dozvole: dozvoleZaStatus(status),
    onboarding: onboardingZaStatus(status),
    razlog,
    source,
  };
}
