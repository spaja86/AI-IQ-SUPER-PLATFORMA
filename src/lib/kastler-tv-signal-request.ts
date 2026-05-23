import { createHash } from 'crypto';
import { APP_VERSION } from './constants';
import { getReklameMetrike } from './reklame-i-partnerstva';

export type TVMonetizationModel =
  | 'pretplata'
  | 'reklame'
  | 'sponzorstva'
  | 'pay-per-view'
  | 'b2b-distribucija'
  | 'hibrid';

export type KastlerRequestStatus = 'u_pripremi' | 'spremno_za_slanje' | 'poslato';
export type KastlerSignalLifecycle = 'mock' | 'pending' | 'approved' | 'active';
export type KastlerSignalStatus = 'cekanje_partnera' | 'odobreno' | 'aktivno';
export type KastlerSignalSource = 'interni-mock' | 'kastler';
export type KastlerSignalAvailability = 'dostupan' | 'ceka' | 'blokiran';
export type KastlerMonetizationStatus = 'disabled' | 'pending' | 'enabled';

export interface KastlerSignalPartner {
  id: 'kastler';
  naziv: string;
  tip: 'tv-distribucija';
  status: 'aktivan' | 'u_pripremi';
  primarniKanal: {
    tip: 'email' | 'kontakt_forma' | 'api';
    vrednost: string;
  };
  fallbackKanali: Array<'poziv' | 'sastanak' | 'email'>;
}

export interface KastlerPrerequisite {
  id: string;
  grupa: 'tehnicki' | 'poslovni' | 'pravni' | 'monetizacija';
  naziv: string;
  opis: string;
  envSignal?: string;
  ispunjeno: boolean;
}

export interface KastlerTvKanalSignal {
  kanalId: string;
  kanalNaziv: string;
  signalLifecycle: KastlerSignalLifecycle;
  signalStatus: KastlerSignalStatus;
  signalSource: KastlerSignalSource;
  dostupnost: KastlerSignalAvailability;
  monetizacijaModel: TVMonetizationModel;
  monetizacijaStatus: KastlerMonetizationStatus;
  signalZatrazen: boolean;
}

export interface KastlerSignalAudit {
  auditVlasnik: string;
  auditKontakt: string;
  dispatchKanal: string;
  cc: string[];
  envSignalReady: string;
  envSignalSubmitted: string;
  envSignalApproved: string;
  envSignalMonetization: string;
}

export interface KastlerTvSignalRequestPackage {
  id: 'kastler-tv-signal-request';
  verzija: string;
  partner: KastlerSignalPartner;
  statusRikvesta: KastlerRequestStatus;
  signalLifecycle: KastlerSignalLifecycle;
  signalStatus: KastlerSignalStatus;
  monetizacijaModel: TVMonetizationModel;
  monetizacijaStatus: KastlerMonetizationStatus;
  opis: string;
  sazetak: string;
  trazeniKanali: KastlerTvKanalSignal[];
  trazeneOpcije: string[];
  preduslovi: KastlerPrerequisite[];
  audit: KastlerSignalAudit;
  generatedAt: string;
}

export interface KastlerRequestPayload {
  expectedPartner: 'kastler';
  expectedVersion: string;
  requestedChannelIds: string[];
  monetizationModel: TVMonetizationModel;
  acceptanceText: string;
  autoSendToPartner: boolean;
}

export interface KastlerRequestRecord {
  requestId: string;
  createdAt: string;
  partnerId: 'kastler';
  status: KastlerRequestStatus;
  signalLifecycle: KastlerSignalLifecycle;
  monetizacijaStatus: KastlerMonetizationStatus;
  monetizationModel: TVMonetizationModel;
  requestedChannelIds: string[];
  acceptanceText: string;
  autoSendToPartner: boolean;
  auditHash: string;
}

const TV_CHANNEL_REQUEST_SCOPE = [
  { kanalId: 'kanal-spaja-tech', kanalNaziv: 'SPAJA Tech' },
  { kanalId: 'kanal-spaja-sport', kanalNaziv: 'SPAJA Sport' },
  { kanalId: 'kanal-omega-ai', kanalNaziv: 'OMEGA AI Kanal' },
  { kanalId: 'kanal-spajapro-tutorials', kanalNaziv: 'SpajaPro Tutorials' },
  { kanalId: 'kanal-spaja-music', kanalNaziv: 'SPAJA Music' },
  { kanalId: 'kanal-film-zone', kanalNaziv: 'Film Zone' },
  { kanalId: 'kanal-science-lab', kanalNaziv: 'Science Lab' },
  { kanalId: 'kanal-vesti-247', kanalNaziv: 'Vesti 24/7' },
  { kanalId: 'kanal-e-sport', kanalNaziv: 'E-Sport' },
  { kanalId: 'kanal-gaming-tv', kanalNaziv: 'Gaming TV' },
  { kanalId: 'kanal-spaja-kids', kanalNaziv: 'SPAJA Kids' },
  { kanalId: 'kanal-edukacija-plus', kanalNaziv: 'Edukacija Plus' },
] as const;

export const KASTLER_SIGNAL_PARTNER: KastlerSignalPartner = {
  id: 'kastler',
  naziv: 'Kastler TV Distribution',
  tip: 'tv-distribucija',
  status: 'u_pripremi',
  primarniKanal: {
    tip: 'email',
    vrednost: 'partners@kastler.tv',
  },
  fallbackKanali: ['poziv', 'sastanak', 'email'],
};

export const KASTLER_TV_REQUEST_VERSION = '2026-05-kastler-tv-signal-v1';
export const KASTLER_TV_ACCEPTANCE_TEXT =
  'Potvrđujem da zahtevamo puštanje TV signala i aktivaciju monetizacije za SPAJA Digitalni Televizor kroz partnerstvo sa Kastler provajderom.';

function envFlag(name: string): boolean {
  return /^(1|true|yes|ok|ready|active)$/i.test(process.env[name] ?? '');
}

function getSignalLifecycleByEnv({
  requestReady,
  requestSubmitted,
  signalApproved,
  monetizationEnabled,
}: {
  requestReady: boolean;
  requestSubmitted: boolean;
  signalApproved: boolean;
  monetizationEnabled: boolean;
}): KastlerSignalLifecycle {
  if (signalApproved && monetizationEnabled) return 'active';
  if (signalApproved) return 'approved';
  if (requestReady || requestSubmitted) return 'pending';
  return 'mock';
}

export function getKastlerSignalOperationalState() {
  const requestReady = envFlag('SPAJA_KASTLER_REQUEST_READY');
  const requestSubmitted = envFlag('SPAJA_KASTLER_REQUEST_SUBMITTED');
  const signalApproved = envFlag('SPAJA_KASTLER_SIGNAL_APPROVED');
  const monetizationEnabled = envFlag('SPAJA_TV_MONETIZATION_ENABLED');

  const lifecycle = getSignalLifecycleByEnv({
    requestReady,
    requestSubmitted,
    signalApproved,
    monetizationEnabled,
  });

  const requestStatus: KastlerRequestStatus = requestSubmitted
    ? 'poslato'
    : requestReady
      ? 'spremno_za_slanje'
      : 'u_pripremi';
  const signalStatus: KastlerSignalStatus = signalApproved
    ? monetizationEnabled
      ? 'aktivno'
      : 'odobreno'
    : 'cekanje_partnera';
  const monetizationStatus: KastlerMonetizationStatus = monetizationEnabled
    ? 'enabled'
    : signalApproved
      ? 'pending'
      : 'disabled';

  const monetizationModel: TVMonetizationModel = 'hibrid';
  const blokatori = [
    ...(requestReady ? [] : ['SPAJA_KASTLER_REQUEST_READY']),
    ...(requestSubmitted ? [] : ['SPAJA_KASTLER_REQUEST_SUBMITTED']),
    ...(signalApproved ? [] : ['SPAJA_KASTLER_SIGNAL_APPROVED']),
    ...(monetizationEnabled ? [] : ['SPAJA_TV_MONETIZATION_ENABLED']),
  ];

  return {
    requestReady,
    requestSubmitted,
    signalApproved,
    monetizationEnabled,
    requestStatus,
    signalLifecycle: lifecycle,
    signalStatus,
    monetizationStatus,
    monetizationModel,
    blokatori,
  };
}

function buildPrerequisites(): KastlerPrerequisite[] {
  const state = getKastlerSignalOperationalState();
  return [
    {
      id: 'kastler-primer-kanala',
      grupa: 'tehnicki',
      naziv: 'Lista TV kanala i mapiranje signala',
      opis: 'Definisani su kanali kojima Kastler treba da pusti signal.',
      ispunjeno: true,
    },
    {
      id: 'kastler-request-ready',
      grupa: 'poslovni',
      naziv: 'Ready-to-send partner zahtev',
      opis: 'Operativni paket je spreman za slanje partneru.',
      envSignal: 'SPAJA_KASTLER_REQUEST_READY',
      ispunjeno: state.requestReady,
    },
    {
      id: 'kastler-request-submitted',
      grupa: 'poslovni',
      naziv: 'Rikvest formalno poslat Kastleru',
      opis: 'Signal da je zahtev zvanično podnet kroz operativni kanal.',
      envSignal: 'SPAJA_KASTLER_REQUEST_SUBMITTED',
      ispunjeno: state.requestSubmitted,
    },
    {
      id: 'kastler-signal-approved',
      grupa: 'pravni',
      naziv: 'Partner odobrio signal i distribuciona prava',
      opis: 'Kastler je odobrio puštanje signala.',
      envSignal: 'SPAJA_KASTLER_SIGNAL_APPROVED',
      ispunjeno: state.signalApproved,
    },
    {
      id: 'kastler-tv-monetization',
      grupa: 'monetizacija',
      naziv: 'TV monetizacija aktivirana',
      opis: 'Pretplate/reklame/sponzorstva aktivni za TV kanale.',
      envSignal: 'SPAJA_TV_MONETIZATION_ENABLED',
      ispunjeno: state.monetizationEnabled,
    },
  ];
}

export function getKastlerTvKanaliSignalMap(): KastlerTvKanalSignal[] {
  const state = getKastlerSignalOperationalState();
  const source: KastlerSignalSource =
    state.signalLifecycle === 'mock' ? 'interni-mock' : 'kastler';
  const dostupnost: KastlerSignalAvailability =
    state.signalLifecycle === 'approved' || state.signalLifecycle === 'active'
      ? 'dostupan'
      : 'ceka';

  return TV_CHANNEL_REQUEST_SCOPE.map((kanal) => ({
    kanalId: kanal.kanalId,
    kanalNaziv: kanal.kanalNaziv,
    signalLifecycle: state.signalLifecycle,
    signalStatus: state.signalStatus,
    signalSource: source,
    dostupnost,
    monetizacijaModel: state.monetizationModel,
    monetizacijaStatus: state.monetizationStatus,
    signalZatrazen: true,
  }));
}

export function getKastlerTVSignalRequestPackage(): KastlerTvSignalRequestPackage {
  const state = getKastlerSignalOperationalState();
  const trazeniKanali = getKastlerTvKanaliSignalMap();

  return {
    id: 'kastler-tv-signal-request',
    verzija: KASTLER_TV_REQUEST_VERSION,
    partner: KASTLER_SIGNAL_PARTNER,
    statusRikvesta: state.requestStatus,
    signalLifecycle: state.signalLifecycle,
    signalStatus: state.signalStatus,
    monetizacijaModel: state.monetizationModel,
    monetizacijaStatus: state.monetizationStatus,
    opis: 'Operativni paket za slanje rikvesta partneru Kastler radi puštanja TV signala i aktivacije monetizacije.',
    sazetak:
      'Kastler treba da pusti signal za SPAJA TV kanale i potvrdi komercijalni model za monetizaciju (pretplata/reklame/sponzorstva/PPV/B2B).',
    trazeniKanali,
    trazeneOpcije: [
      'Signal release za sve TV kanale iz request scope',
      'Distribuciona prava i komercijalna potvrda',
      'Monetizacija: pretplate + reklame + sponzorstva + PPV + B2B',
      'Operational handoff za incident i podršku',
    ],
    preduslovi: buildPrerequisites(),
    audit: {
      auditVlasnik: 'sales@spaja.rs',
      auditKontakt: 'billing@spaja.rs',
      dispatchKanal: 'partners@kastler.tv',
      cc: ['business@spaja.rs', 'tech@spaja.rs', 'billing@spaja.rs'],
      envSignalReady: 'SPAJA_KASTLER_REQUEST_READY',
      envSignalSubmitted: 'SPAJA_KASTLER_REQUEST_SUBMITTED',
      envSignalApproved: 'SPAJA_KASTLER_SIGNAL_APPROVED',
      envSignalMonetization: 'SPAJA_TV_MONETIZATION_ENABLED',
    },
    generatedAt: new Date().toISOString(),
  };
}

export function getKastlerTVMonetizationSummary() {
  const reklameMetrike = getReklameMetrike();
  const state = getKastlerSignalOperationalState();
  return {
    model: state.monetizationModel,
    status: state.monetizationStatus,
    platformMonetizationChannels: reklameMetrike.monetizacijaKanala,
    platformActiveMonetizationChannels: reklameMetrike.aktivnihKanala,
    tvMonetizationEnabled: state.monetizationEnabled,
    napomena:
      state.monetizationStatus === 'enabled'
        ? 'TV monetizacija je aktivna i može u produkciju.'
        : state.monetizationStatus === 'pending'
          ? 'Signal je odobren, monetizacija čeka finalnu aktivaciju.'
          : 'Monetizacija TV signala nije aktivirana.',
  };
}

export function validateKastlerRequestPayload(payload: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: ['Payload mora biti objekat.'] };
  }
  const data = payload as Partial<KastlerRequestPayload>;
  if (data.expectedPartner !== 'kastler') {
    errors.push('expectedPartner mora biti "kastler".');
  }
  if (data.expectedVersion !== KASTLER_TV_REQUEST_VERSION) {
    errors.push('expectedVersion ne odgovara aktuelnoj verziji Kastler paketa.');
  }
  if (!Array.isArray(data.requestedChannelIds) || data.requestedChannelIds.length === 0) {
    errors.push('requestedChannelIds mora biti neprazan niz.');
  } else {
    const allowedIds = new Set(TV_CHANNEL_REQUEST_SCOPE.map((item) => item.kanalId));
    const invalid = data.requestedChannelIds.filter((id) => !allowedIds.has(id));
    if (invalid.length > 0) {
      errors.push(`requestedChannelIds sadrži nepoznate kanale: ${invalid.join(', ')}`);
    }
  }
  if (
    !data.monetizationModel ||
    !['pretplata', 'reklame', 'sponzorstva', 'pay-per-view', 'b2b-distribucija', 'hibrid'].includes(data.monetizationModel)
  ) {
    errors.push('monetizationModel mora biti jedan od podržanih modela.');
  }
  if (data.acceptanceText?.trim() !== KASTLER_TV_ACCEPTANCE_TEXT) {
    errors.push('acceptanceText mora biti tačan operativni tekst potvrde.');
  }
  if (data.autoSendToPartner !== true) {
    errors.push('autoSendToPartner mora biti true.');
  }
  return { valid: errors.length === 0, errors };
}

export function buildKastlerRequestRecord(payload: KastlerRequestPayload): KastlerRequestRecord {
  const state = getKastlerSignalOperationalState();
  const createdAt = new Date().toISOString();
  const hashInput = `${payload.expectedPartner}|${payload.expectedVersion}|${payload.requestedChannelIds.join(',')}|${payload.monetizationModel}|${createdAt}`;

  return {
    requestId: `KASTLER-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    createdAt,
    partnerId: 'kastler',
    status: state.requestStatus,
    signalLifecycle: state.signalLifecycle,
    monetizacijaStatus: state.monetizationStatus,
    monetizationModel: payload.monetizationModel,
    requestedChannelIds: payload.requestedChannelIds,
    acceptanceText: payload.acceptanceText,
    autoSendToPartner: payload.autoSendToPartner,
    auditHash: createHash('sha256').update(hashInput).digest('hex'),
  };
}

export function getKastlerSignalReadinessSummary() {
  const paket = getKastlerTVSignalRequestPackage();
  const state = getKastlerSignalOperationalState();
  const preduslovi = paket.preduslovi;
  return {
    version: APP_VERSION,
    packageVersion: KASTLER_TV_REQUEST_VERSION,
    partner: paket.partner.naziv,
    requestStatus: state.requestStatus,
    signalLifecycle: state.signalLifecycle,
    signalStatus: state.signalStatus,
    monetizationStatus: state.monetizationStatus,
    trazenihKanala: paket.trazeniKanali.length,
    ispunjenihPreduslova: preduslovi.filter((item) => item.ispunjeno).length,
    ukupnoPreduslova: preduslovi.length,
    blokatori: state.blokatori,
  };
}
