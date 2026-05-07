import { createHash } from 'crypto';

export function sha256Hex(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

export interface AuditChainInput {
  payload: unknown;
  prevHash: string | null;
  timestampIso: string;
}

export function buildAuditChainHash(input: AuditChainInput): { payloadHash: string; chainHash: string } {
  const payloadHash = sha256Hex(JSON.stringify(input.payload));
  const chainHash = sha256Hex(`${input.prevHash ?? 'GENESIS'}|${payloadHash}|${input.timestampIso}`);
  return { payloadHash, chainHash };
}
