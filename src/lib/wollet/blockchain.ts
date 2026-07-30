import type { WolletTransaction } from './types';
import { ISTORIJSKE_NABAVKE } from './transactions';

/**
 * Polygon mreža konfiguracija.
 * AIIQWorldBank.sol je deployovan na Polygon mainnet (chainId: 137) ili Amoy testnet (chainId: 80002).
 */
export const POLYGON_CONFIG = {
  mainnet: {
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com',
    contractAddress: '' as string, // popuniti nakon deploya
  },
  amoy: {
    chainId: 80002,
    rpcUrl: 'https://rpc-amoy.polygon.technology',
    explorerUrl: 'https://amoy.polygonscan.com',
    contractAddress: '' as string, // popuniti nakon testnet deploya
  },
} as const;

export type PolygonChain = keyof typeof POLYGON_CONFIG;

/**
 * ABI fragmenti za AIIQWorldBank.sol (read-only funkcije).
 * Dovoljno za čitanje transakcija i stanja bez punog ABI-ja.
 */
export const AIIQWB_ABI_FRAGMENTS = [
  'function dohvatiTransakciju(uint256 _id) view returns (tuple(uint256 id, string naziv, string opis, uint256 iznos, uint8 valuta, string izvor, string destinacija, uint8 status, uint256 datumBlok, address inicijator))',
  'function dohvatiSveTransakcijeIds() view returns (uint256[])',
  'function dohvatiSveRacune() view returns (string[])',
  'function dohvatiStanjeRacuna(string _brojRacuna) view returns (uint256)',
  'function ukupnoTransakcija() view returns (uint256)',
  'function ukupnoPotroseno() view returns (uint256)',
  'function jeVlasnik(address _adresa) view returns (bool)',
] as const;

/**
 * Read-only blockchain adapter.
 * Vraća statičke podatke kada nije dostupan live RPC (offline-first arhitektura).
 *
 * NAPOMENA: Za live blockchain pozive koristiti viem (već u package.json) sa POLYGON_CONFIG.
 */
export function getStaticTransakcije(): WolletTransaction[] {
  return ISTORIJSKE_NABAVKE;
}

export function getStaticTransakcijaById(id: number): WolletTransaction | undefined {
  return ISTORIJSKE_NABAVKE.find((t) => t.id === id);
}

/**
 * Placeholder za live viem blockchain poziv.
 * Implementovati sa: import { createPublicClient, http } from 'viem'; import { polygon } from 'viem/chains';
 */
export async function fetchLiveTransakcijeIds(_chain: PolygonChain = 'mainnet'): Promise<number[]> {
  // live implementacija:
  // const client = createPublicClient({ chain: polygon, transport: http(POLYGON_CONFIG[chain].rpcUrl) });
  // const ids = await client.readContract({ address: contractAddress, abi: [...], functionName: 'dohvatiSveTransakcijeIds' });
  return ISTORIJSKE_NABAVKE.map((t) => t.id);
}

export async function fetchLiveStanjeRacuna(_brojRacuna: string, _chain: PolygonChain = 'mainnet'): Promise<number> {
  // live implementacija: client.readContract({ ..., functionName: 'dohvatiStanjeRacuna', args: [_brojRacuna] })
  return 0;
}
