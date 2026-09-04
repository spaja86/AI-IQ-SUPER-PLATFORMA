// SpajaUltraOmegaCore -∞Ω+∞ — ZLATNI RAČUNI Transaction Engine
// Kompanija SPAJA — Digitalna Industrija

import type { ZlatniTransakcija, ZlatniPointsInput } from './types';
import { generateId } from './audit';

// ─── In-memory ledger (append-only) ──────────────────────────────────────────

const ledger: ZlatniTransakcija[] = [];
const idempotencyKeys = new Set<string>();

// ─── Public API ──────────────────────────────────────────────────────────────

export function appendTransaction(input: ZlatniPointsInput): ZlatniTransakcija {
  if (idempotencyKeys.has(input.idempotencyKey)) {
    const existing = ledger.find(
      (t) => t.racunId === input.racunId && t.metadata?.idempotencyKey === input.idempotencyKey,
    );
    if (existing) return existing;
  }

  const tx: ZlatniTransakcija = {
    id: generateId('ztx'),
    racunId: input.racunId,
    type: input.type,
    amount: input.amount,
    timestamp: new Date().toISOString(),
    source: input.source,
    metadata: { ...input.metadata, idempotencyKey: input.idempotencyKey },
  };

  ledger.push(tx);
  idempotencyKeys.add(input.idempotencyKey);
  return tx;
}

export function getTransactions(
  racunId: string,
  page = 1,
  pageSize = 20,
): { items: ZlatniTransakcija[]; total: number; page: number; pageSize: number } {
  const filtered = ledger.filter((t) => t.racunId === racunId);
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  return { items, total, page, pageSize };
}

export function getTotalTransactions(): number {
  return ledger.length;
}

export function _resetTransactionLedger(): void {
  ledger.length = 0;
  idempotencyKeys.clear();
}
