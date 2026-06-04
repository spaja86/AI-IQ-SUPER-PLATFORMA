import { getSupabaseServerClientSafe } from '@/lib/supabase/server';
import { createSecureId } from '@/lib/request-id';
import { logger } from '@/lib/logger';
import type { AuditZapis } from './types';

const AUDIT_MAX = 500;
const auditBuffer: AuditZapis[] = [];

function nextAuditId(): string {
  return createSecureId('audit');
}

function pushAudit(entry: AuditZapis): void {
  auditBuffer.push(entry);
  if (auditBuffer.length > AUDIT_MAX) {
    auditBuffer.shift();
  }
}

export async function upisiAuditZapis(
  payload: Omit<AuditZapis, 'id' | 'timestamp'> & { timestamp?: string; id?: string },
): Promise<AuditZapis> {
  const entry: AuditZapis = {
    id: payload.id ?? nextAuditId(),
    protokolId: payload.protokolId,
    tip: payload.tip,
    reqId: payload.reqId,
    ...(payload.userId ? { userId: payload.userId } : {}),
    ...(payload.pre ? { pre: payload.pre } : {}),
    ...(payload.posle ? { posle: payload.posle } : {}),
    timestamp: payload.timestamp ?? new Date().toISOString(),
  };

  pushAudit(entry);

  if (process.env.NODE_ENV === 'production') {
    try {
      const supabase = getSupabaseServerClientSafe();
      if (supabase) {
        await (supabase as unknown as {
          from: (table: string) => {
            insert: (row: Record<string, unknown>) => Promise<unknown>;
          };
        })
          .from('protokoli_audit_log')
          .insert({
            id: entry.id,
            protokol_id: entry.protokolId,
            tip: entry.tip,
            user_id: entry.userId ?? null,
            req_id: entry.reqId,
            pre: entry.pre ?? null,
            posle: entry.posle ?? null,
            timestamp: entry.timestamp,
          });
      }
    } catch (error) {
      // Best-effort upis; in-memory audit je i dalje izvor za runtime tok.
      logger.warn('PROTOKOLI_AUDIT', 'Supabase upis nije uspeo.', error);
    }
  }

  return entry;
}

export function getAuditLog(protokolId?: string, limit = 100): AuditZapis[] {
  const boundedLimit = Math.min(Math.max(Math.trunc(limit), 1), AUDIT_MAX);
  const source = protokolId ? auditBuffer.filter((entry) => entry.protokolId === protokolId) : auditBuffer;
  return source.slice(-boundedLimit).reverse();
}
