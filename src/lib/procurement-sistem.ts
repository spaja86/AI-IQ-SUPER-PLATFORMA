/**
 * Prkitandejrski sistem — Unified Procurement System
 * Kompanija SPAJA — Digitalna Industrija
 *
 * Konsoliduje B2B procurement, enterprise ugovore i licencni procurement
 * u jednu operativnu sliku sa KPI-jevima i readiness statusom po domenu.
 */

import { APP_VERSION } from '@/lib/constants';
import {
  getB2BProcurementCases,
  getB2BProcurementSummary,
  getMissingChecklist,
} from '@/lib/b2b-procurement-workflow';
import { ucitajEnterpriseUgovore } from '@/lib/enterprise-ugovor-modul';
import { getNabavkaStatistika } from '@/lib/glavni-sistem-nabavka';

// ─── Version ─────────────────────────────────────────────────────────────────

export const PROCUREMENT_SISTEM_VERSION = '1.0.0' as const;

// ─── Types ───────────────────────────────────────────────────────────────────

export type ProcurementDomen = 'b2b' | 'enterprise' | 'licencni';

/** Operativni status jednog procurement domena */
export type ProcurementSpremnost = 'spreman' | 'u_toku' | 'blokiran' | 'zavrsen';

/** KPI pregled celokupnog procurement sistema */
export interface ProcurementKpi {
  ukupnoSlucajeva: number;
  otvorenih: number;
  zavrsenih: number;
  blokiranih: number;
  /** B2B slučajevi spremni za uplatu (checklist 100% ispunjen) */
  b2bSpremniZaUplatu: number;
  /** Distribucija B2B slučajeva po fazi workflow-a */
  b2bPoFazi: Record<string, number>;
  enterprisePotpisano: number;
  enterpriseUkupno: number;
  licencniKupljeno: number;
  licencniUkupno: number;
}

/** Status jednog procurement domena */
export interface ProcurementDomenStatus {
  naziv: string;
  domen: ProcurementDomen;
  ukupno: number;
  aktivnih: number;
  zavrsenih: number;
  readiness: ProcurementSpremnost;
  napomena: string | null;
}

/** Stavka revizijskog loga za procurement događaje (in-memory, opcionalno Supabase) */
export interface ProcurementAuditStavka {
  id: string;
  domain: ProcurementDomen;
  caseId: string;
  akcija: string;
  pre: string;
  posle: string;
  korisnik: string;
  timestamp: string;
}

/** Celokupni status procurement sistema */
export interface ProcurementSistemStatus {
  appVerzija: string;
  sistemVerzija: string;
  timestamp: string;
  ukupnaSpremnost: ProcurementSpremnost;
  kpi: ProcurementKpi;
  domeni: ProcurementDomenStatus[];
  upozorenja: string[];
}

// ─── Audit Log (in-memory, max 200 stavki) ────────────────────────────────────

const MAX_AUDIT_ENTRIES = 200;
const _auditLog: ProcurementAuditStavka[] = [];

/**
 * Zabeleži audit stavku za procurement događaj
 * (status tranzicija, approval, payment, delivery update).
 */
export function zabeleziAuditStavku(
  stavka: Omit<ProcurementAuditStavka, 'id' | 'timestamp'>,
): ProcurementAuditStavka {
  const nova: ProcurementAuditStavka = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...stavka,
  };
  _auditLog.unshift(nova);
  if (_auditLog.length > MAX_AUDIT_ENTRIES) {
    _auditLog.splice(MAX_AUDIT_ENTRIES);
  }
  return nova;
}

/** Dohvati poslednjih `limit` audit stavki */
export function dohvatiAuditLog(limit = 50): ProcurementAuditStavka[] {
  const n = Math.max(1, Math.min(limit, MAX_AUDIT_ENTRIES));
  return _auditLog.slice(0, n);
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function resolveSpremnost(
  ukupno: number,
  aktivnih: number,
  zavrsenih: number,
  blokiranih: number,
): ProcurementSpremnost {
  if (ukupno === 0) return 'u_toku';
  if (zavrsenih >= ukupno) return 'zavrsen';
  if (blokiranih > 0) return 'blokiran';
  if (aktivnih > 0) return 'u_toku';
  return 'spreman';
}

function resolveUkupnaSpremnost(domeni: ProcurementDomenStatus[]): ProcurementSpremnost {
  if (domeni.some((d) => d.readiness === 'blokiran')) return 'blokiran';
  if (domeni.every((d) => d.readiness === 'zavrsen')) return 'zavrsen';
  if (domeni.some((d) => d.readiness === 'spreman')) return 'spreman';
  return 'u_toku';
}

// ─── Main API ─────────────────────────────────────────────────────────────────

/**
 * Vraca konsolidovani status celokupnog procurement sistema:
 * B2B nabavke, enterprise ugovori i licencni procurement.
 *
 * Bezbednosna napomena: ne sadrži osetljive podatke (adrese, privatne kontakte).
 * Dovoljan USER nivo clearance za čitanje.
 */
export async function getProcurementSistemStatus(): Promise<ProcurementSistemStatus> {
  const [b2bCases, b2bSummary, enterpriseUgovori] = await Promise.all([
    getB2BProcurementCases({ includeSensitive: false }),
    getB2BProcurementSummary(false),
    ucitajEnterpriseUgovore(),
  ]);

  const licencniStats = getNabavkaStatistika();
  const upozorenja: string[] = [];

  // ── B2B domain ───────────────────────────────────────────────────────────────
  const b2bBlokirani = b2bCases.filter((item) => getMissingChecklist(item).length > 0);
  const b2bZavrseni = b2bCases.filter(
    (item) => item.status === 'preuzeto' || item.status === 'otkazano',
  );
  const b2bAktivni = b2bCases.filter(
    (item) => item.status !== 'preuzeto' && item.status !== 'otkazano',
  );

  if (b2bBlokirani.length > 0) {
    upozorenja.push(
      `${b2bBlokirani.length} B2B slučaj(eva) blokirano — nedostaje dokumentacija ili odobrenje.`,
    );
  }

  // ── Enterprise domain ────────────────────────────────────────────────────────
  const enterprisePotpisano = enterpriseUgovori.filter((e) => e.status === 'potpisano').length;
  const enterpriseKontaktirani = enterpriseUgovori.filter(
    (e) => e.status === 'kontaktiran',
  ).length;
  const enterprisePending = enterpriseUgovori.filter((e) => e.status === 'pending').length;
  const enterpriseUkupno = enterpriseUgovori.length;

  if (enterprisePending > 0) {
    upozorenja.push(`${enterprisePending} enterprise ugovor(a) čeka inicijalni kontakt.`);
  }

  // ── Licencni domain ──────────────────────────────────────────────────────────
  const licencniUkupno = licencniStats.ukupnoStavki;
  const licencniKupljeno = licencniStats.kupljeno;
  const licencniPreostalo = licencniUkupno - licencniKupljeno;

  if (licencniPreostalo > 0) {
    upozorenja.push(`${licencniPreostalo} licencnih stavki preostalo za nabavku.`);
  }

  // ── Build domain statuses ────────────────────────────────────────────────────
  const domeni: ProcurementDomenStatus[] = [
    {
      naziv: 'B2B Procurement',
      domen: 'b2b',
      ukupno: b2bCases.length,
      aktivnih: b2bAktivni.length,
      zavrsenih: b2bZavrseni.length,
      readiness: resolveSpremnost(
        b2bCases.length,
        b2bAktivni.length,
        b2bZavrseni.length,
        b2bBlokirani.length,
      ),
      napomena:
        b2bBlokirani.length > 0
          ? `${b2bBlokirani.length} slučaj(eva) sa nedostajućom dokumentacijom ili odobrenjem.`
          : null,
    },
    {
      naziv: 'Enterprise Ugovori',
      domen: 'enterprise',
      ukupno: enterpriseUkupno,
      aktivnih: enterpriseKontaktirani,
      zavrsenih: enterprisePotpisano,
      readiness: resolveSpremnost(
        enterpriseUkupno,
        enterpriseKontaktirani,
        enterprisePotpisano,
        enterprisePending,
      ),
      napomena:
        enterprisePending > 0
          ? `${enterprisePending} ugovor(a) čeka inicijalni kontakt.`
          : null,
    },
    {
      naziv: 'Licencni Procurement',
      domen: 'licencni',
      ukupno: licencniUkupno,
      aktivnih: licencniPreostalo,
      zavrsenih: licencniKupljeno,
      readiness: resolveSpremnost(licencniUkupno, licencniPreostalo, licencniKupljeno, 0),
      napomena:
        licencniPreostalo > 0 ? `${licencniPreostalo} stavki preostalo za nabavku.` : null,
    },
  ];

  const kpi: ProcurementKpi = {
    ukupnoSlucajeva: b2bCases.length + enterpriseUkupno + licencniUkupno,
    otvorenih: b2bAktivni.length + enterpriseKontaktirani + licencniPreostalo,
    zavrsenih: b2bZavrseni.length + enterprisePotpisano + licencniKupljeno,
    blokiranih: b2bBlokirani.length + enterprisePending,
    b2bSpremniZaUplatu: b2bSummary.spremniZaUplatu,
    b2bPoFazi: b2bSummary.poStatusu as Record<string, number>,
    enterprisePotpisano,
    enterpriseUkupno,
    licencniKupljeno,
    licencniUkupno,
  };

  return {
    appVerzija: APP_VERSION,
    sistemVerzija: PROCUREMENT_SISTEM_VERSION,
    timestamp: new Date().toISOString(),
    ukupnaSpremnost: resolveUkupnaSpremnost(domeni),
    kpi,
    domeni,
    upozorenja,
  };
}

/** Vraca samo KPI deo (za lightweight polling bez punog statusa) */
export async function getProcurementKpi(): Promise<ProcurementKpi> {
  const status = await getProcurementSistemStatus();
  return status.kpi;
}
