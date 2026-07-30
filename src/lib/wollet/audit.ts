import type { WolletAuditEntry, WolletTransaction } from './types';

const POLYGON_MAINNET_EXPLORER = 'https://polygonscan.com';
const POLYGON_AMOY_EXPLORER = 'https://amoy.polygonscan.com';

export type PolygonNetwork = 'mainnet' | 'amoy';

/**
 * Generiše Polygonscan link za transakciju po hash-u.
 */
export function polygonscanTxUrl(hash: string, network: PolygonNetwork = 'mainnet'): string {
  const base = network === 'mainnet' ? POLYGON_MAINNET_EXPLORER : POLYGON_AMOY_EXPLORER;
  return `${base}/tx/${hash}`;
}

/**
 * Generiše Polygonscan link za adresu.
 */
export function polygonscanAddressUrl(address: string, network: PolygonNetwork = 'mainnet'): string {
  const base = network === 'mainnet' ? POLYGON_MAINNET_EXPLORER : POLYGON_AMOY_EXPLORER;
  return `${base}/address/${address}`;
}

/**
 * Kreira audit entry za transakciju.
 */
export function kreirajAuditEntry(
  transakcija: WolletTransaction,
  akcija: WolletAuditEntry['akcija'],
  inicijator: string,
  blockchainHash?: string,
  network: PolygonNetwork = 'mainnet',
): WolletAuditEntry {
  return {
    id: `audit-${transakcija.id}-${Date.now()}`,
    transakcijId: transakcija.id,
    akcija,
    akcijaMeta: `${transakcija.naziv} — ${transakcija.opis}`,
    vreme: new Date(),
    inicijator,
    blockchainHash,
    polygonscanUrl: blockchainHash ? polygonscanTxUrl(blockchainHash, network) : undefined,
  };
}

/**
 * Kreira audit log za sve istorijske nabavke.
 */
export function kreirajIstorijski_AuditLog(
  transakcije: WolletTransaction[],
): WolletAuditEntry[] {
  return transakcije.map((t) =>
    kreirajAuditEntry(t, 'write', t.inicijator),
  );
}
