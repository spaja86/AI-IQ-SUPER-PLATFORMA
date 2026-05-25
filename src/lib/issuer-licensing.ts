import { APP_VERSION, KOMPANIJA } from '@/lib/constants';

export type IssuerLicensingKategorija =
  | 'softver'
  | 'sertifikati'
  | 'edukacija'
  | 'api-pristup'
  | 'partner-sublicenca';

export type IssuerLicensingStatus =
  | 'draft'
  | 'u_proveri'
  | 'odobreno'
  | 'suspendovano'
  | 'opozvano'
  | 'isteklo';

export type IssuerLicensingActorRole = 'viewer' | 'editor' | 'approver' | 'admin';
export type IssuerLicensingPeriodTip = 'mesecni' | 'kvartalni';

export interface IssuerLicensingAuthority {
  id: string;
  naziv: string;
  issuerEntitet: string;
  kategorija: IssuerLicensingKategorija;
  jurisdikcija: 'Srbija';
  pravniOsnov: string;
  regulatorIliVendor: string;
  status: IssuerLicensingStatus;
  vaziOd: string | null;
  vaziDo: string | null;
  kvotaUkupno: number | null;
  izdatoDoSada: number;
  sublicenciranjeDozvoljeno: boolean;
  maxDelegiranihIzdavalaca: number;
  ogranicenja: string[];
  zavisnostiNabavke: string[];
  dokazReferenca: string | null;
  checklistaPreIzdavanja: string[];
  createdAt: string;
  updatedAt: string;
  poslednjaPromenaBy: string;
}

export interface IssuerLicenseIssueRecord {
  id: string;
  authorityId: string;
  authorityNaziv: string;
  kategorija: IssuerLicensingKategorija;
  primalacNaziv: string;
  primalacEmail: string;
  status: 'izdata';
  izdavanjeTip: 'direktna' | 'partner-sublicenca';
  validFrom: string;
  validTo: string | null;
  createdBy: string;
  createdAt: string;
}

export interface IssuerLicensingAuditEvent {
  id: string;
  authorityId: string | null;
  akcija: string;
  status: 'uspesno' | 'upozorenje' | 'greska';
  detalji: string;
  actorRole: IssuerLicensingActorRole;
  actorId: string;
  timestamp: string;
}

export interface IssuerLicensingBlocker {
  authorityId: string;
  naziv: string;
  status: IssuerLicensingStatus;
  razlog: string;
  prioritet: 'kriticno' | 'visoko' | 'srednje';
}

export interface IssuerLicensingSummary {
  ukupnoOvlascenja: number;
  odobreno: number;
  uProveri: number;
  suspendovano: number;
  opozvano: number;
  isteklo: number;
  aktivnoIzdavanje: number;
  kvotaUkupno: number;
  kvotaIskoriscena: number;
  procenatKvota: number;
  izdatoPoslednjih30Dana: number;
}

export interface IssuerLicensingState {
  naziv: string;
  kompanija: string;
  verzija: string;
  timestamp: string;
  authorities: IssuerLicensingAuthority[];
  issued: IssuerLicenseIssueRecord[];
  blockers: IssuerLicensingBlocker[];
  pendingApproval: IssuerLicensingAuthority[];
  summary: IssuerLicensingSummary;
  roleMatrica: Record<'viewer' | 'editor' | 'approver', string[]>;
  audit: IssuerLicensingAuditEvent[];
}

export interface CreateIssuerAuthorityInput {
  naziv: string;
  issuerEntitet: string;
  kategorija: IssuerLicensingKategorija;
  pravniOsnov: string;
  regulatorIliVendor: string;
  vaziOd?: string | null;
  vaziDo?: string | null;
  kvotaUkupno?: number | null;
  sublicenciranjeDozvoljeno?: boolean;
  maxDelegiranihIzdavalaca?: number;
  ogranicenja?: string[];
  zavisnostiNabavke?: string[];
  checklistaPreIzdavanja?: string[];
}

export interface TransitionIssuerAuthorityInput {
  authorityId: string;
  noviStatus: IssuerLicensingStatus;
  razlog?: string;
}

export interface IssueLicenseInput {
  authorityId: string;
  primalacNaziv: string;
  primalacEmail: string;
  izdavanjeTip: 'direktna' | 'partner-sublicenca';
  validTo?: string | null;
  checklistKeys?: string[];
}

export interface IssuerComplianceReport {
  periodTip: IssuerLicensingPeriodTip;
  period: string;
  ukupnoOvlascenja: number;
  aktivnaOvlascenja: number;
  suspendovanaOvlascenja: number;
  isteklaOvlascenja: number;
  opozvanaOvlascenja: number;
  izdateLicence: number;
  approvalCoverageProcenat: number;
  kriticniBlokatori: number;
}

const ISO_YEAR_END = '2027-12-31';

function nowIso(): string {
  return new Date().toISOString();
}

function daysUntil(dateIso: string | null): number | null {
  if (!dateIso) return null;
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) return null;
  return Math.ceil((date.getTime() - Date.now()) / 86_400_000);
}

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function inferStatusByExpiry(authority: IssuerLicensingAuthority): IssuerLicensingStatus {
  if (authority.status === 'opozvano') return 'opozvano';
  if (!authority.vaziDo) return authority.status;
  const expired = new Date(authority.vaziDo).getTime() < Date.now();
  if (expired && authority.status !== 'opozvano') return 'isteklo';
  return authority.status;
}

function statusTransitionAllowed(from: IssuerLicensingStatus, to: IssuerLicensingStatus): boolean {
  const map: Record<IssuerLicensingStatus, IssuerLicensingStatus[]> = {
    draft: ['u_proveri', 'opozvano'],
    u_proveri: ['draft', 'odobreno', 'suspendovano', 'opozvano'],
    odobreno: ['suspendovano', 'opozvano', 'isteklo'],
    suspendovano: ['odobreno', 'opozvano', 'isteklo'],
    opozvano: [],
    isteklo: ['u_proveri', 'opozvano'],
  };
  return map[from].includes(to);
}

function roleCanCreate(role: IssuerLicensingActorRole): boolean {
  return role === 'editor' || role === 'approver' || role === 'admin';
}

function roleCanTransition(role: IssuerLicensingActorRole, status: IssuerLicensingStatus): boolean {
  if (status === 'u_proveri' || status === 'draft') {
    return role === 'editor' || role === 'approver' || role === 'admin';
  }
  return role === 'approver' || role === 'admin';
}

function roleCanIssue(role: IssuerLicensingActorRole): boolean {
  return role === 'approver' || role === 'admin';
}

const seedAuthorities = (): IssuerLicensingAuthority[] => [
  {
    id: 'issuer-softver-main',
    naziv: 'Softverska licenca za izdavanje enterprise pristupa',
    issuerEntitet: 'Digitalna Industrija',
    kategorija: 'softver',
    jurisdikcija: 'Srbija',
    pravniOsnov: 'Master Software Distribution Addendum 2026',
    regulatorIliVendor: 'Kompanija SPAJA / partnerski vendor ugovori',
    status: 'odobreno',
    vaziOd: '2026-01-01',
    vaziDo: ISO_YEAR_END,
    kvotaUkupno: 500,
    izdatoDoSada: 12,
    sublicenciranjeDozvoljeno: true,
    maxDelegiranihIzdavalaca: 5,
    ogranicenja: ['Izdavanje isključivo B2B partnerima sa validnim ugovorom.'],
    zavisnostiNabavke: ['lic-ve-github-enterprise', 'lic-ve-openai-enterprise'],
    dokazReferenca: 'ISSUER-SW-2026-001',
    checklistaPreIzdavanja: ['dokaz-ugovora', 'compliance-potvrda', 'billing-odobrenje'],
    createdAt: nowIso(),
    updatedAt: nowIso(),
    poslednjaPromenaBy: 'system',
  },
  {
    id: 'issuer-sertifikati',
    naziv: 'Sertifikaciono ovlašćenje za digitalne certifikate',
    issuerEntitet: 'SPAJA Tehnološki Centar',
    kategorija: 'sertifikati',
    jurisdikcija: 'Srbija',
    pravniOsnov: 'Sertifikacioni okvir i interna politika CA-2026',
    regulatorIliVendor: 'Interna sertifikaciona politika + akreditovano telo',
    status: 'u_proveri',
    vaziOd: null,
    vaziDo: ISO_YEAR_END,
    kvotaUkupno: 1000,
    izdatoDoSada: 0,
    sublicenciranjeDozvoljeno: false,
    maxDelegiranihIzdavalaca: 0,
    ogranicenja: ['Izdavanje sertifikata samo za definisane profile.'],
    zavisnostiNabavke: ['lic-pe-iso27001'],
    dokazReferenca: null,
    checklistaPreIzdavanja: ['sertifikat-akreditacije', 'compliance-potvrda'],
    createdAt: nowIso(),
    updatedAt: nowIso(),
    poslednjaPromenaBy: 'system',
  },
  {
    id: 'issuer-edukacija',
    naziv: 'Ovlašćenje za izdavanje edukativnih licenci',
    issuerEntitet: 'Digitalna Industrija',
    kategorija: 'edukacija',
    jurisdikcija: 'Srbija',
    pravniOsnov: 'Edukativni partner okvir 2026',
    regulatorIliVendor: 'Kompanija SPAJA',
    status: 'draft',
    vaziOd: null,
    vaziDo: ISO_YEAR_END,
    kvotaUkupno: 3000,
    izdatoDoSada: 0,
    sublicenciranjeDozvoljeno: true,
    maxDelegiranihIzdavalaca: 20,
    ogranicenja: ['Samo validirani partneri iz B2B registra.'],
    zavisnostiNabavke: ['lic-ms-dpo-zastita-podataka'],
    dokazReferenca: null,
    checklistaPreIzdavanja: ['dokaz-ugovora', 'partner-provera', 'billing-odobrenje'],
    createdAt: nowIso(),
    updatedAt: nowIso(),
    poslednjaPromenaBy: 'system',
  },
  {
    id: 'issuer-api-pristup',
    naziv: 'API Issuer ovlašćenje za partner pristup',
    issuerEntitet: 'AI IQ WORLD BANK Operativa',
    kategorija: 'api-pristup',
    jurisdikcija: 'Srbija',
    pravniOsnov: 'API Partner Program 2026',
    regulatorIliVendor: 'AI IQ WORLD BANK',
    status: 'suspendovano',
    vaziOd: '2026-01-01',
    vaziDo: ISO_YEAR_END,
    kvotaUkupno: 200,
    izdatoDoSada: 70,
    sublicenciranjeDozvoljeno: false,
    maxDelegiranihIzdavalaca: 0,
    ogranicenja: ['Novi issuance blokiran do završetka bezbednosnog audita.'],
    zavisnostiNabavke: ['lic-pe-aml-monitoring'],
    dokazReferenca: 'ISSUER-API-2026-017',
    checklistaPreIzdavanja: ['security-audit', 'dokaz-ugovora', 'billing-odobrenje'],
    createdAt: nowIso(),
    updatedAt: nowIso(),
    poslednjaPromenaBy: 'system',
  },
];

const issuerAuthoritiesStore: IssuerLicensingAuthority[] = seedAuthorities();
const issuerIssuedStore: IssuerLicenseIssueRecord[] = [];
const issuerAuditStore: IssuerLicensingAuditEvent[] = [
  {
    id: makeId('issuer-audit'),
    authorityId: null,
    akcija: 'issuer_licensing_initialized',
    status: 'uspesno',
    detalji: 'Inicijalizovan issuer licensing domen za Srbiju.',
    actorRole: 'admin',
    actorId: 'system',
    timestamp: nowIso(),
  },
];

function addAudit(event: Omit<IssuerLicensingAuditEvent, 'id' | 'timestamp'>): void {
  issuerAuditStore.unshift({
    id: makeId('issuer-audit'),
    timestamp: nowIso(),
    ...event,
  });
}

function normalizeAuthorities(): IssuerLicensingAuthority[] {
  return issuerAuthoritiesStore.map((authority) => ({
    ...authority,
    status: inferStatusByExpiry(authority),
  }));
}

function buildBlockers(authorities: IssuerLicensingAuthority[]): IssuerLicensingBlocker[] {
  const blockers: IssuerLicensingBlocker[] = [];
  for (const authority of authorities) {
    if (authority.status === 'odobreno') continue;
    if (authority.status === 'u_proveri') {
      blockers.push({
        authorityId: authority.id,
        naziv: authority.naziv,
        status: authority.status,
        razlog: 'Ovlašćenje još nije odobreno za izdavanje.',
        prioritet: 'visoko',
      });
      continue;
    }
    blockers.push({
      authorityId: authority.id,
      naziv: authority.naziv,
      status: authority.status,
      razlog:
        authority.status === 'suspendovano'
          ? 'Ovlašćenje je suspendovano i blokira novo izdavanje.'
          : authority.status === 'isteklo'
            ? 'Ovlašćenje je isteklo i zahteva obnovu.'
            : 'Ovlašćenje nije spremno za izdavanje.',
      prioritet: authority.status === 'suspendovano' || authority.status === 'isteklo' ? 'kriticno' : 'srednje',
    });
  }
  return blockers;
}

function buildSummary(
  authorities: IssuerLicensingAuthority[],
  issued: IssuerLicenseIssueRecord[],
): IssuerLicensingSummary {
  const odobreno = authorities.filter((x) => x.status === 'odobreno').length;
  const uProveri = authorities.filter((x) => x.status === 'u_proveri').length;
  const suspendovano = authorities.filter((x) => x.status === 'suspendovano').length;
  const opozvano = authorities.filter((x) => x.status === 'opozvano').length;
  const isteklo = authorities.filter((x) => x.status === 'isteklo').length;

  const kvotaUkupno = authorities.reduce((sum, x) => sum + (x.kvotaUkupno ?? 0), 0);
  const kvotaIskoriscena = authorities.reduce((sum, x) => sum + x.izdatoDoSada, 0);
  const procenatKvota = kvotaUkupno === 0 ? 0 : Math.round((kvotaIskoriscena / kvotaUkupno) * 100);
  const threshold = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const izdatoPoslednjih30Dana = issued.filter((x) => new Date(x.createdAt).getTime() >= threshold).length;

  return {
    ukupnoOvlascenja: authorities.length,
    odobreno,
    uProveri,
    suspendovano,
    opozvano,
    isteklo,
    aktivnoIzdavanje: odobreno,
    kvotaUkupno,
    kvotaIskoriscena,
    procenatKvota,
    izdatoPoslednjih30Dana,
  };
}

export function buildIssuerLicensingState(): IssuerLicensingState {
  const authorities = normalizeAuthorities();
  const blockers = buildBlockers(authorities);
  const pendingApproval = authorities.filter((x) => x.status === 'u_proveri' || x.status === 'draft');

  return {
    naziv: 'Issuer Licensing — Ovlašćenja za izdavanje licenci',
    kompanija: KOMPANIJA,
    verzija: APP_VERSION,
    timestamp: nowIso(),
    authorities,
    issued: [...issuerIssuedStore],
    blockers,
    pendingApproval,
    summary: buildSummary(authorities, issuerIssuedStore),
    roleMatrica: {
      viewer: ['pregled-issuer-ovlascenja', 'pregled-issuer-blokatora'],
      editor: ['kreiranje-zahteva', 'priprema-izdavanja', 'dopuna-checkliste'],
      approver: ['odobrenje-issuer-ovlascenja', 'promena-statusa', 'finalno-izdavanje'],
    },
    audit: [...issuerAuditStore].slice(0, 100),
  };
}

export function createIssuerAuthorityRequest(
  input: CreateIssuerAuthorityInput,
  actor: { role: IssuerLicensingActorRole; id: string },
): { ok: true; authority: IssuerLicensingAuthority } | { ok: false; error: string } {
  if (!roleCanCreate(actor.role)) {
    return { ok: false, error: 'Nedovoljna prava za kreiranje issuer ovlašćenja.' };
  }
  if (!input.naziv || !input.issuerEntitet || !input.pravniOsnov || !input.regulatorIliVendor) {
    return { ok: false, error: 'Obavezna polja: naziv, issuerEntitet, pravniOsnov, regulatorIliVendor.' };
  }

  const authority: IssuerLicensingAuthority = {
    id: makeId('issuer-auth'),
    naziv: input.naziv,
    issuerEntitet: input.issuerEntitet,
    kategorija: input.kategorija,
    jurisdikcija: 'Srbija',
    pravniOsnov: input.pravniOsnov,
    regulatorIliVendor: input.regulatorIliVendor,
    status: 'draft',
    vaziOd: input.vaziOd ?? null,
    vaziDo: input.vaziDo ?? null,
    kvotaUkupno: input.kvotaUkupno ?? null,
    izdatoDoSada: 0,
    sublicenciranjeDozvoljeno: input.sublicenciranjeDozvoljeno ?? false,
    maxDelegiranihIzdavalaca: input.maxDelegiranihIzdavalaca ?? 0,
    ogranicenja: input.ogranicenja ?? [],
    zavisnostiNabavke: input.zavisnostiNabavke ?? [],
    dokazReferenca: null,
    checklistaPreIzdavanja:
      input.checklistaPreIzdavanja ?? ['dokaz-ugovora', 'compliance-potvrda', 'billing-odobrenje'],
    createdAt: nowIso(),
    updatedAt: nowIso(),
    poslednjaPromenaBy: actor.id,
  };

  issuerAuthoritiesStore.unshift(authority);
  addAudit({
    authorityId: authority.id,
    akcija: 'authority_created',
    status: 'uspesno',
    detalji: `Kreirano issuer ovlašćenje '${authority.naziv}'.`,
    actorRole: actor.role,
    actorId: actor.id,
  });

  return { ok: true, authority };
}

export function transitionIssuerAuthorityStatus(
  input: TransitionIssuerAuthorityInput,
  actor: { role: IssuerLicensingActorRole; id: string },
): { ok: true; authority: IssuerLicensingAuthority } | { ok: false; error: string } {
  const idx = issuerAuthoritiesStore.findIndex((x) => x.id === input.authorityId);
  if (idx === -1) return { ok: false, error: 'Issuer ovlašćenje nije pronađeno.' };

  const current = issuerAuthoritiesStore[idx];
  const currentStatus = inferStatusByExpiry(current);
  if (!statusTransitionAllowed(currentStatus, input.noviStatus)) {
    return { ok: false, error: `Tranzicija ${currentStatus} -> ${input.noviStatus} nije dozvoljena.` };
  }
  if (!roleCanTransition(actor.role, input.noviStatus)) {
    return { ok: false, error: 'Nedovoljna prava za traženu tranziciju statusa.' };
  }
  if (input.noviStatus === 'odobreno') {
    const hasChecklist = current.checklistaPreIzdavanja.length > 0;
    if (!hasChecklist) return { ok: false, error: 'Nije definisana checklista pre izdavanja.' };
    if (!current.dokazReferenca && !input.razlog?.toLowerCase().includes('privremeno')) {
      return { ok: false, error: 'Za odobrenje je potrebna dokazReferenca ili privremeni razlog.' };
    }
    if (current.vaziDo && new Date(current.vaziDo).getTime() < Date.now()) {
      return { ok: false, error: 'Ovlašćenje je isteklo i ne može biti odobreno bez obnove.' };
    }
  }

  const updated: IssuerLicensingAuthority = {
    ...current,
    status: input.noviStatus,
    updatedAt: nowIso(),
    poslednjaPromenaBy: actor.id,
  };
  issuerAuthoritiesStore[idx] = updated;

  addAudit({
    authorityId: updated.id,
    akcija: 'authority_status_transition',
    status: 'uspesno',
    detalji: `Status promenjen ${currentStatus} -> ${input.noviStatus}. ${input.razlog ?? ''}`.trim(),
    actorRole: actor.role,
    actorId: actor.id,
  });

  return { ok: true, authority: updated };
}

export function issueLicenseFromAuthority(
  input: IssueLicenseInput,
  actor: { role: IssuerLicensingActorRole; id: string },
): { ok: true; issued: IssuerLicenseIssueRecord } | { ok: false; error: string } {
  if (!roleCanIssue(actor.role)) {
    return { ok: false, error: 'Nedovoljna prava za finalno izdavanje licence.' };
  }
  const idx = issuerAuthoritiesStore.findIndex((x) => x.id === input.authorityId);
  if (idx === -1) return { ok: false, error: 'Issuer ovlašćenje nije pronađeno.' };
  const authority = issuerAuthoritiesStore[idx];
  const status = inferStatusByExpiry(authority);
  if (status !== 'odobreno') {
    return { ok: false, error: `Izdavanje nije dozvoljeno: status ovlašćenja je '${status}'.` };
  }
  if (!input.primalacNaziv || !input.primalacEmail) {
    return { ok: false, error: 'Obavezna polja: primalacNaziv i primalacEmail.' };
  }
  if (input.izdavanjeTip === 'partner-sublicenca' && !authority.sublicenciranjeDozvoljeno) {
    return { ok: false, error: 'Sublicenciranje nije dozvoljeno za izabrano ovlašćenje.' };
  }

  const checklistKeys = new Set(input.checklistKeys ?? []);
  const missingChecklist = authority.checklistaPreIzdavanja.filter((x) => !checklistKeys.has(x));
  if (missingChecklist.length > 0) {
    return { ok: false, error: `Nedostaje checklista: ${missingChecklist.join(', ')}.` };
  }

  if (authority.kvotaUkupno !== null && authority.izdatoDoSada >= authority.kvotaUkupno) {
    return { ok: false, error: 'Kvota izdavanja je iscrpljena.' };
  }

  const issued: IssuerLicenseIssueRecord = {
    id: makeId('issuer-lic'),
    authorityId: authority.id,
    authorityNaziv: authority.naziv,
    kategorija: authority.kategorija,
    primalacNaziv: input.primalacNaziv,
    primalacEmail: input.primalacEmail,
    status: 'izdata',
    izdavanjeTip: input.izdavanjeTip,
    validFrom: nowIso(),
    validTo: input.validTo ?? authority.vaziDo ?? null,
    createdBy: actor.id,
    createdAt: nowIso(),
  };

  issuerIssuedStore.unshift(issued);
  issuerAuthoritiesStore[idx] = {
    ...authority,
    izdatoDoSada: authority.izdatoDoSada + 1,
    updatedAt: nowIso(),
    poslednjaPromenaBy: actor.id,
  };

  addAudit({
    authorityId: authority.id,
    akcija: 'license_issued',
    status: 'uspesno',
    detalji: `Izdato ovlašćenje '${authority.naziv}' ka '${input.primalacNaziv}'.`,
    actorRole: actor.role,
    actorId: actor.id,
  });

  return { ok: true, issued };
}

export function getIssuerLicensingExpirations(windowDays = 90): IssuerLicensingAuthority[] {
  return normalizeAuthorities().filter((authority) => {
    if (!authority.vaziDo) return false;
    const days = daysUntil(authority.vaziDo);
    return days !== null && days <= windowDays;
  });
}

export function getIssuerLicensingComplianceReport(periodTip: IssuerLicensingPeriodTip): IssuerComplianceReport {
  const state = buildIssuerLicensingState();
  const now = new Date();
  const quarter = Math.floor(now.getMonth() / 3) + 1;
  return {
    periodTip,
    period:
      periodTip === 'mesecni'
        ? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
        : `${now.getFullYear()}-Q${quarter}`,
    ukupnoOvlascenja: state.summary.ukupnoOvlascenja,
    aktivnaOvlascenja: state.summary.odobreno,
    suspendovanaOvlascenja: state.summary.suspendovano,
    isteklaOvlascenja: state.summary.isteklo,
    opozvanaOvlascenja: state.summary.opozvano,
    izdateLicence: state.issued.length,
    approvalCoverageProcenat:
      state.summary.ukupnoOvlascenja === 0
        ? 0
        : Math.round((state.summary.odobreno / state.summary.ukupnoOvlascenja) * 100),
    kriticniBlokatori: state.blockers.filter((x) => x.prioritet === 'kriticno').length,
  };
}

export function getIssuerLicensingBlockers(): IssuerLicensingBlocker[] {
  return buildIssuerLicensingState().blockers;
}

export function getIssuerLicensingSummary(): IssuerLicensingSummary {
  return buildIssuerLicensingState().summary;
}

export function getIssuerLicensingAuthorities(): IssuerLicensingAuthority[] {
  return buildIssuerLicensingState().authorities;
}

export function getIssuerLicensingIssued(): IssuerLicenseIssueRecord[] {
  return buildIssuerLicensingState().issued;
}
