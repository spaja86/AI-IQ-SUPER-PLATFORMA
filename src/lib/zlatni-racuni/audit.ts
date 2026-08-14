// SpajaUltraOmegaCore -∞Ω+∞ — ZLATNI RAČUNI Audit
// Kompanija SPAJA — Digitalna Industrija

let _counter = 0;

export function generateId(prefix: string): string {
  _counter += 1;
  return `${prefix}-${Date.now()}-${_counter}`;
}

export interface ZlatniAuditEntry {
  agentId: string;
  timestamp: string;
  changeType: string;
  details: Record<string, unknown>;
}

export function createAuditEntry(
  changeType: string,
  details: Record<string, unknown>,
): ZlatniAuditEntry {
  return {
    agentId: 'zlatni-racuni-core',
    timestamp: new Date().toISOString(),
    changeType,
    details,
  };
}

export function _resetCounter(): void {
  _counter = 0;
}
