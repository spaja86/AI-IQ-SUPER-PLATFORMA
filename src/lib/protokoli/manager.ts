import { getAuditLog, upisiAuditZapis } from './audit-trail';
import { findProtokolById, getProtokolRegistar, getProtokolRegistarMeta } from './registar';
import { runProtokolVerifikacija } from './verifikator';
import { createSecureId } from '@/lib/request-id';
import type {
  Protokol,
  ProtokolDogadjaj,
  ProtokolFilter,
  ProtokolIzvor,
  ProtokolPromenaTip,
  ProtokolStatus,
  ProtokolStatusPromena,
  ProtokolVerificationSnapshot,
  VerifikacijaRezultat,
} from './types';

const EVENT_LOG_MAX = 500;
const HISTORY_LIMIT = 100;
const protocolEvents: ProtokolDogadjaj[] = [];
const statusOverrides = new Map<string, ProtokolStatus>();
const verificationHistory = new Map<string, ProtokolVerificationSnapshot[]>();
const lifecycleHistory: ProtokolStatusPromena[] = [];

function pushEvent(event: ProtokolDogadjaj): void {
  protocolEvents.push(event);
  if (protocolEvents.length > EVENT_LOG_MAX) {
    protocolEvents.shift();
  }
}

function pushVerification(snapshot: ProtokolVerificationSnapshot): void {
  const entries = verificationHistory.get(snapshot.protokolId) ?? [];
  entries.push(snapshot);
  verificationHistory.set(snapshot.protokolId, entries.slice(-EVENT_LOG_MAX));
}

function pushLifecycle(change: ProtokolStatusPromena): void {
  lifecycleHistory.push(change);
  if (lifecycleHistory.length > EVENT_LOG_MAX) {
    lifecycleHistory.shift();
  }
}

function createReqId(): string {
  return createSecureId('protokol');
}

function createLifecycleId(): string {
  return createSecureId('protokol-promena');
}

function withStatusOverrides(protocols: Protokol[]): Protokol[] {
  return protocols.map((protocol) => {
    const status = statusOverrides.get(protocol.id);
    if (!status) return protocol;
    return { ...protocol, status };
  });
}

function getProtocolOrThrow(id: string): Protokol {
  const protocol = withStatusOverrides(getProtokolRegistar()).find((entry) => entry.id === id);
  if (!protocol) {
    throw new Error(`Protokol '${id}' nije pronađen.`);
  }
  return protocol;
}

function buildLayerSummary(result: VerifikacijaRezultat): ProtokolVerificationSnapshot['slojevi'] {
  return result.checks.reduce<ProtokolVerificationSnapshot['slojevi']>(
    (acc, check) => {
      const current = acc[check.sloj] ?? { ukupno: 0, uspesno: 0 };
      acc[check.sloj] = {
        ukupno: current.ukupno + 1,
        uspesno: current.uspesno + (check.prolaz ? 1 : 0),
      };
      return acc;
    },
    {
      struktura: { ukupno: 0, uspesno: 0 },
      bezbednost: { ukupno: 0, uspesno: 0 },
      autentifikacija: { ukupno: 0, uspesno: 0 },
      performanse: { ukupno: 0, uspesno: 0 },
      integracija: { ukupno: 0, uspesno: 0 },
      compliance: { ukupno: 0, uspesno: 0 },
    },
  );
}

function toVerificationSnapshot(result: VerifikacijaRezultat): ProtokolVerificationSnapshot {
  return {
    protokolId: result.protokolId,
    status: result.uspesno ? 'uspesno' : 'neuspesno',
    timestamp: result.timestamp,
    ukupnoProvera: result.ukupnoProvera,
    uspesneProvere: result.uspesneProvere,
    neuspesneProvere: result.neuspesneProvere,
    failedChecks: result.checks.filter((check) => !check.prolaz).map((check) => check.naziv),
    slojevi: buildLayerSummary(result),
  };
}

function matchesText(protocol: Protokol, query: string): boolean {
  const text = [
    protocol.id,
    protocol.naziv,
    protocol.opis,
    protocol.vlasnickiModul,
    protocol.vlasnik.tim,
    protocol.vlasnik.uloga,
    protocol.sourceOfTruth,
  ]
    .join(' ')
    .toLowerCase();
  return text.includes(query.toLowerCase());
}

function filterProtocols(items: Protokol[], filter?: ProtokolFilter): Protokol[] {
  let results = items;
  if (filter?.kategorija) {
    results = results.filter((item) => item.kategorija === filter.kategorija);
  }
  if (filter?.status) {
    results = results.filter((item) => item.status === filter.status);
  }
  if (filter?.izvor) {
    results = results.filter((item) => item.izvor === filter.izvor);
  }
  if (filter?.kriticnost) {
    results = results.filter((item) => item.kriticnost === filter.kriticnost);
  }
  if (filter?.okruzenje) {
    results = results.filter((item) => item.okruzenje === filter.okruzenje);
  }
  if (filter?.vlasnikTim) {
    results = results.filter((item) => item.vlasnik.tim.toLowerCase() === filter.vlasnikTim?.toLowerCase());
  }
  if (filter?.q) {
    results = results.filter((item) => matchesText(item, filter.q ?? ''));
  }
  return results;
}

function getPendingChangeCount(protocolId: string): number {
  return lifecycleHistory.filter((entry) => entry.protokolId === protocolId && entry.stanje === 'na-cekanju').length;
}

function withRuntime(protocol: Protokol): Protokol {
  const history = verificationHistory.get(protocol.id) ?? [];
  const lastSuccess = [...history].reverse().find((entry) => entry.status === 'uspesno')?.timestamp ?? null;
  const lastFailure = [...history].reverse().find((entry) => entry.status === 'neuspesno')?.timestamp ?? null;

  return {
    ...protocol,
    runtime: {
      poslednjaVerifikacija: history.at(-1) ?? null,
      poslednjaUspesnaVerifikacijaAt: lastSuccess,
      poslednjaNeuspesnaVerifikacijaAt: lastFailure,
      pendingPromene: getPendingChangeCount(protocol.id),
    },
  };
}

async function applyStatusChange(
  id: string,
  status: ProtokolStatus,
  options: {
    userId?: string;
    approvedBy?: string;
    reqId?: string;
    reason: string;
    tip: ProtokolPromenaTip;
    requestId?: string;
    rollbackStatus?: ProtokolStatus;
  },
): Promise<{ updated: Protokol; change: ProtokolStatusPromena }> {
  const current = getProtocolOrThrow(id);
  statusOverrides.set(id, status);
  const timestamp = new Date().toISOString();
  const updated = withRuntime({ ...current, status, azuriran: timestamp });
  const change: ProtokolStatusPromena = {
    id: options.requestId ?? createLifecycleId(),
    protokolId: id,
    prethodniStatus: current.status,
    noviStatus: status,
    razlog: options.reason,
    tip: options.tip,
    stanje: 'izvrseno',
    ...(options.userId ? { requestedBy: options.userId } : {}),
    ...(options.approvedBy ? { approvedBy: options.approvedBy } : {}),
    ...(options.rollbackStatus ? { rollbackStatus: options.rollbackStatus } : {}),
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  pushLifecycle(change);

  await upisiAuditZapis({
    protokolId: id,
    tip: 'update',
    reqId: options.reqId ?? createReqId(),
    ...(options.userId ? { userId: options.userId } : {}),
    pre: { status: current.status },
    posle: { status, reason: options.reason, changeType: options.tip, changeId: change.id },
    timestamp,
  });

  await protokolManager.logujDogadjaj(id, {
    tip: 'update',
    timestamp,
    ...(options.userId ? { userId: options.userId } : {}),
    detalji: { status, reason: options.reason, changeType: options.tip, changeId: change.id },
  });

  return { updated, change };
}

function buildCounts<T extends string>(items: Protokol[], getter: (item: Protokol) => T): Record<T, number> {
  return items.reduce<Record<T, number>>((acc, item) => {
    const key = getter(item);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {} as Record<T, number>);
}

export const protokolManager = {
  getMeta() {
    return getProtokolRegistarMeta();
  },

  getAll(filter?: ProtokolFilter): Protokol[] {
    const items = withStatusOverrides(getProtokolRegistar()).map(withRuntime);
    return filterProtocols(items, filter);
  },

  getById(id: string): Protokol | null {
    const base = findProtokolById(id);
    if (!base) return null;
    const status = statusOverrides.get(base.id);
    return withRuntime(status ? { ...base, status } : base);
  },

  getVerificationHistory(id: string, limit = HISTORY_LIMIT): ProtokolVerificationSnapshot[] {
    const boundedLimit = Math.min(Math.max(Math.trunc(limit), 1), EVENT_LOG_MAX);
    return [...(verificationHistory.get(id) ?? [])].slice(-boundedLimit).reverse();
  },

  getLifecycleHistory(id?: string, limit = HISTORY_LIMIT): ProtokolStatusPromena[] {
    const boundedLimit = Math.min(Math.max(Math.trunc(limit), 1), EVENT_LOG_MAX);
    const source = id ? lifecycleHistory.filter((entry) => entry.protokolId === id) : lifecycleHistory;
    return source.slice(-boundedLimit).reverse();
  },

  getBySource(izvor: ProtokolIzvor): Protokol[] {
    return this.getAll({ izvor });
  },

  getCatalogSummary() {
    const all = this.getAll();
    const verificationSnapshots = all.filter((item) => item.runtime?.poslednjaVerifikacija).length;
    const pendingPromene = all.reduce((sum, item) => sum + (item.runtime?.pendingPromene ?? 0), 0);

    return {
      ukupno: all.length,
      byStatus: buildCounts(all, (item) => item.status),
      byKategorija: buildCounts(all, (item) => item.kategorija),
      byIzvor: buildCounts(all, (item) => item.izvor),
      byKriticnost: buildCounts(all, (item) => item.kriticnost),
      byOkruzenje: buildCounts(all, (item) => item.okruzenje),
      verificationSnapshots,
      pendingPromene,
      incidentIds: all.filter((item) => item.status === 'incident').map((item) => item.id),
      timestamp: new Date().toISOString(),
    };
  },

  async verifikuj(id: string, userId?: string): Promise<VerifikacijaRezultat> {
    const protocol = getProtocolOrThrow(id);
    const result = runProtokolVerifikacija(protocol);
    const snapshot = toVerificationSnapshot(result);
    pushVerification(snapshot);
    await this.logujDogadjaj(id, {
      tip: 'verifikacija',
      timestamp: result.timestamp,
      ...(userId ? { userId } : {}),
      detalji: {
        uspesno: result.uspesno,
        ukupnoProvera: result.ukupnoProvera,
        neuspesneProvere: result.neuspesneProvere,
        failedChecks: snapshot.failedChecks,
      },
    });
    return result;
  },

  async verifikujSveAktivne(userId?: string): Promise<VerifikacijaRezultat[]> {
    const aktivni = this.getAll({ status: 'aktivan' });
    const results: VerifikacijaRezultat[] = [];
    for (const protokol of aktivni) {
      results.push(await this.verifikuj(protokol.id, userId));
    }
    return results;
  },

  async logujDogadjaj(id: string, dogadjaj: ProtokolDogadjaj): Promise<ProtokolDogadjaj> {
    getProtocolOrThrow(id);
    const timestamp = dogadjaj.timestamp || new Date().toISOString();
    const payload: ProtokolDogadjaj = {
      tip: dogadjaj.tip,
      timestamp,
      ...(dogadjaj.userId ? { userId: dogadjaj.userId } : {}),
      ...(dogadjaj.detalji ? { detalji: dogadjaj.detalji } : {}),
    };
    pushEvent(payload);
    await upisiAuditZapis({
      protokolId: id,
      tip: payload.tip,
      reqId: createReqId(),
      ...(payload.userId ? { userId: payload.userId } : {}),
      ...(payload.detalji ? { posle: payload.detalji } : {}),
      timestamp,
    });
    return payload;
  },

  getLog(id?: string, limit = 100): ProtokolDogadjaj[] {
    const boundedLimit = Math.min(Math.max(Math.trunc(limit), 1), EVENT_LOG_MAX);
    const source = id
      ? getAuditLog(id, boundedLimit).map((entry) => ({
          tip: entry.tip,
          timestamp: entry.timestamp,
          ...(entry.userId ? { userId: entry.userId } : {}),
          detalji: {
            reqId: entry.reqId,
            ...(entry.pre ? { pre: entry.pre } : {}),
            ...(entry.posle ? { posle: entry.posle } : {}),
          },
        }))
      : protocolEvents;
    return source.slice(-boundedLimit).reverse();
  },

  async updateStatus(
    id: string,
    status: ProtokolStatus,
    options?: { userId?: string; reqId?: string; reason?: string },
  ): Promise<Protokol> {
    const { updated } = await applyStatusChange(id, status, {
      userId: options?.userId,
      reqId: options?.reqId,
      reason: options?.reason ?? 'manual-update',
      tip: status === 'incident' ? 'incident' : 'odobrenje',
      rollbackStatus: getProtocolOrThrow(id).status,
    });
    return updated;
  },

  async predloziPromenuStatusa(
    id: string,
    status: ProtokolStatus,
    options: { reason: string; userId?: string },
  ): Promise<ProtokolStatusPromena> {
    const current = getProtocolOrThrow(id);
    const timestamp = new Date().toISOString();
    const change: ProtokolStatusPromena = {
      id: createLifecycleId(),
      protokolId: id,
      prethodniStatus: current.status,
      noviStatus: status,
      razlog: options.reason,
      tip: 'predlog',
      stanje: 'na-cekanju',
      ...(options.userId ? { requestedBy: options.userId } : {}),
      rollbackStatus: current.status,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    pushLifecycle(change);
    await upisiAuditZapis({
      protokolId: id,
      tip: 'update',
      reqId: createReqId(),
      ...(options.userId ? { userId: options.userId } : {}),
      pre: { status: current.status },
      posle: { proposedStatus: status, reason: options.reason, changeType: 'predlog', changeId: change.id },
      timestamp,
    });
    await this.logujDogadjaj(id, {
      tip: 'update',
      timestamp,
      ...(options.userId ? { userId: options.userId } : {}),
      detalji: { proposedStatus: status, reason: options.reason, changeId: change.id, changeType: 'predlog' },
    });
    return change;
  },

  async odobriPromenuStatusa(
    id: string,
    requestId: string,
    options: { approvedBy: string; reqId?: string },
  ): Promise<{ protokol: Protokol; promena: ProtokolStatusPromena }> {
    const change = lifecycleHistory.find((entry) => entry.id === requestId && entry.protokolId === id);
    if (!change) {
      throw new Error(`Promena statusa '${requestId}' nije pronađena.`);
    }
    if (change.stanje !== 'na-cekanju') {
      throw new Error(`Promena statusa '${requestId}' više nije na čekanju.`);
    }
    change.stanje = 'odobreno';
    change.approvedBy = options.approvedBy;
    change.updatedAt = new Date().toISOString();

    const { updated, change: applied } = await applyStatusChange(id, change.noviStatus, {
      userId: change.requestedBy,
      approvedBy: options.approvedBy,
      reqId: options.reqId,
      reason: change.razlog,
      tip: 'odobrenje',
      requestId: change.id,
      rollbackStatus: change.rollbackStatus ?? change.prethodniStatus,
    });

    return { protokol: updated, promena: applied };
  },

  async rollbackPromenuStatusa(
    id: string,
    options: { approvedBy?: string; reqId?: string; reason?: string },
  ): Promise<{ protokol: Protokol; promena: ProtokolStatusPromena }> {
    const lastApplied = [...lifecycleHistory]
      .reverse()
      .find((entry) => entry.protokolId === id && entry.stanje === 'izvrseno' && entry.tip !== 'predlog');
    if (!lastApplied) {
      throw new Error(`Nema izvršene promene za rollback protokola '${id}'.`);
    }
    const targetStatus = lastApplied.rollbackStatus ?? lastApplied.prethodniStatus;
    const { updated, change } = await applyStatusChange(id, targetStatus, {
      userId: options.approvedBy,
      approvedBy: options.approvedBy,
      reqId: options.reqId,
      reason: options.reason ?? `rollback:${lastApplied.id}`,
      tip: 'rollback',
      rollbackStatus: getProtocolOrThrow(id).status,
    });
    return { protokol: updated, promena: change };
  },

  getStatusSummary() {
    const all = this.getAll();
    const verification = all.map((item) => item.runtime?.poslednjaVerifikacija).filter(Boolean);
    return {
      ukupno: all.length,
      aktivan: all.filter((item) => item.status === 'aktivan').length,
      neaktivan: all.filter((item) => item.status === 'neaktivan').length,
      deprecated: all.filter((item) => item.status === 'deprecated').length,
      uTestu: all.filter((item) => item.status === 'u-testu').length,
      incident: all.filter((item) => item.status === 'incident').length,
      poKategoriji: buildCounts(all, (item) => item.kategorija),
      poIzvoru: buildCounts(all, (item) => item.izvor),
      poKriticnosti: buildCounts(all, (item) => item.kriticnost),
      pendingPromene: all.reduce((sum, item) => sum + (item.runtime?.pendingPromene ?? 0), 0),
      poslednjaNeuspesnaVerifikacijaAt:
        verification.find((entry) => entry?.status === 'neuspesno')?.timestamp ?? null,
      timestamp: new Date().toISOString(),
    };
  },
};
