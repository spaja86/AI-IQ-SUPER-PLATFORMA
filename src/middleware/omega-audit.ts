// SpajaUltraOmegaCore -∞Ω+∞ — Omega Audit Log
// Kompanija SPAJA — Digitalna Industrija
// Nepromenjivi append-only audit log sa kriptografskim lancem hash-eva

import type { ΩAuditEvent } from '@/lib/auth/types';
import { ΩCryptoEngine } from '@/lib/auth/omega-crypto';

// Re-export za lakši uvoz
export type { ΩAuditEvent };

// Konfiguracija čuvanja logova
const AUDIT_RETENTION_MS = 90 * 24 * 60 * 60 * 1000; // 90 dana

// In-memory append-only log (u produkciji: write-once storage, WORM)
const auditLog: ΩAuditEvent[] = [];
let lastHash = '0000000000000000000000000000000000000000000000000000000000000000'; // Genesis hash

// ΩAuditLogger — nepromenjivi audit log
export class ΩAuditLogger {
  // log — beleži novi audit događaj (append-only)
  static log(params: {
    userId: string;
    action: string;
    resource: string;
    ip: string;
    userAgent: string;
    outcome: ΩAuditEvent['outcome'];
    details?: Record<string, unknown>;
  }): ΩAuditEvent {
    const id = ΩCryptoEngine.generateId();
    const timestamp = Date.now();

    // Kriptografski lanac: hash = SHA256(id + timestamp + userId + action + outcome + previousHash)
    const hashInput = `${id}|${timestamp}|${params.userId}|${params.action}|${params.resource}|${params.outcome}|${lastHash}`;
    const hash = ΩCryptoEngine.hashSHA256(hashInput);

    const event: ΩAuditEvent = {
      id,
      timestamp,
      userId: params.userId,
      action: params.action,
      resource: params.resource,
      ip: params.ip,
      userAgent: params.userAgent,
      outcome: params.outcome,
      previousHash: lastHash,
      hash,
      details: params.details,
    };

    // Append-only: ne menjati postojeće
    auditLog.push(event);
    lastHash = hash;

    return event;
  }

  // verifyChain — verifikuje integritet kriptografskog lanca
  static verifyChain(): { valid: boolean; brokenAt?: number } {
    let prev = '0000000000000000000000000000000000000000000000000000000000000000';

    for (let i = 0; i < auditLog.length; i++) {
      const event = auditLog[i];
      const hashInput = `${event.id}|${event.timestamp}|${event.userId}|${event.action}|${event.resource}|${event.outcome}|${prev}`;
      const expectedHash = ΩCryptoEngine.hashSHA256(hashInput);

      if (event.previousHash !== prev || event.hash !== expectedHash) {
        return { valid: false, brokenAt: i };
      }
      prev = event.hash;
    }

    return { valid: true };
  }

  // getRecentEvents — dohvata novije ereignisse (sa paginacijom)
  static getRecentEvents(limit = 100, offset = 0): ΩAuditEvent[] {
    const sorted = [...auditLog].sort((a, b) => b.timestamp - a.timestamp);
    return sorted.slice(offset, offset + limit);
  }

  // getEventsByUser — dohvata događaje za korisnika
  static getEventsByUser(userId: string, limit = 50): ΩAuditEvent[] {
    return auditLog
      .filter((e) => e.userId === userId)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // getEventsByOutcome — filtrira po ishodu
  static getEventsByOutcome(
    outcome: ΩAuditEvent['outcome'],
    limit = 50
  ): ΩAuditEvent[] {
    return auditLog
      .filter((e) => e.outcome === outcome)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // purgeOldEvents — briše stare događaje (starije od 90 dana)
  // Napomena: u pravom sistemu, logovi nikad ne bi bili brisani — arhivirali bi se
  static purgeOldEvents(): number {
    const cutoff = Date.now() - AUDIT_RETENTION_MS;
    const before = auditLog.length;
    const toRemove = auditLog.filter((e) => e.timestamp < cutoff);

    for (const event of toRemove) {
      const idx = auditLog.indexOf(event);
      if (idx !== -1) auditLog.splice(idx, 1);
    }

    return before - auditLog.length;
  }

  // getStats — statistike audit loga
  static getStats(): {
    total: number;
    success: number;
    denied: number;
    error: number;
    chainValid: boolean;
  } {
    const success = auditLog.filter((e) => e.outcome === 'SUCCESS').length;
    const denied = auditLog.filter((e) => e.outcome === 'DENIED').length;
    const error = auditLog.filter((e) => e.outcome === 'ERROR').length;
    const { valid: chainValid } = this.verifyChain();

    return {
      total: auditLog.length,
      success,
      denied,
      error,
      chainValid,
    };
  }
}

// logAuthEvent — helper za beleženje auth događaja
export function logAuthEvent(
  userId: string,
  action: string,
  resource: string,
  ip: string,
  userAgent: string,
  outcome: ΩAuditEvent['outcome'],
  details?: Record<string, unknown>
): void {
  ΩAuditLogger.log({ userId, action, resource, ip, userAgent, outcome, details });
}
