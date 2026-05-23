import { getAuditLog, upisiAuditZapis } from './audit-trail';
import { findProtokolById, getProtokolRegistar, getProtokolRegistarMeta } from './registar';
import { runProtokolVerifikacija } from './verifikator';
import type {
  Protokol,
  ProtokolDogadjaj,
  ProtokolFilter,
  ProtokolStatus,
  VerifikacijaRezultat,
} from './types';

const EVENT_LOG_MAX = 500;
const protocolEvents: ProtokolDogadjaj[] = [];
const statusOverrides = new Map<string, ProtokolStatus>();

function pushEvent(event: ProtokolDogadjaj): void {
  protocolEvents.push(event);
  if (protocolEvents.length > EVENT_LOG_MAX) {
    protocolEvents.shift();
  }
}

function createReqId(): string {
  return `protokol-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
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

export const protokolManager = {
  getMeta() {
    return getProtokolRegistarMeta();
  },

  getAll(filter?: ProtokolFilter): Protokol[] {
    let items = withStatusOverrides(getProtokolRegistar());
    if (filter?.kategorija) {
      items = items.filter((item) => item.kategorija === filter.kategorija);
    }
    if (filter?.status) {
      items = items.filter((item) => item.status === filter.status);
    }
    return items;
  },

  getById(id: string): Protokol | null {
    const base = findProtokolById(id);
    if (!base) return null;
    const status = statusOverrides.get(base.id);
    return status ? { ...base, status } : base;
  },

  async verifikuj(id: string, userId?: string): Promise<VerifikacijaRezultat> {
    const protocol = getProtocolOrThrow(id);
    const result = runProtokolVerifikacija(protocol);
    await this.logujDogadjaj(id, {
      tip: 'verifikacija',
      timestamp: result.timestamp,
      ...(userId ? { userId } : {}),
      detalji: {
        uspesno: result.uspesno,
        ukupnoProvera: result.ukupnoProvera,
        neuspesneProvere: result.neuspesneProvere,
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
    const current = getProtocolOrThrow(id);
    statusOverrides.set(id, status);
    const updated = { ...current, status, azuriran: new Date().toISOString() };
    const reason = options?.reason ?? 'manual-update';
    await upisiAuditZapis({
      protokolId: id,
      tip: 'update',
      reqId: options?.reqId ?? createReqId(),
      ...(options?.userId ? { userId: options.userId } : {}),
      pre: { status: current.status },
      posle: { status, reason },
    });
    await this.logujDogadjaj(id, {
      tip: 'update',
      timestamp: new Date().toISOString(),
      ...(options?.userId ? { userId: options.userId } : {}),
      detalji: { status, reason },
    });
    return updated;
  },

  getStatusSummary() {
    const all = this.getAll();
    return {
      ukupno: all.length,
      aktivan: all.filter((item) => item.status === 'aktivan').length,
      neaktivan: all.filter((item) => item.status === 'neaktivan').length,
      deprecated: all.filter((item) => item.status === 'deprecated').length,
      uTestu: all.filter((item) => item.status === 'u-testu').length,
      incident: all.filter((item) => item.status === 'incident').length,
      timestamp: new Date().toISOString(),
    };
  },
};
