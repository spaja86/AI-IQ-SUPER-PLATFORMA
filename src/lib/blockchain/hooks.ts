/**
 * 🔗 Blockchain — React hooks za čitanje podataka iz pametnog ugovora
 *
 * Koristi wagmi v2 + viem za direktno čitanje sa Polygon blockchain-a.
 * Svaki hook čita podatke u real-time — bez posrednika, bez centralizovane baze.
 */

import { useReadContract, useReadContracts } from 'wagmi';
import { AIIQ_WORLD_BANK_ABI } from './abi';
import { CONTRACT_ADDRESS, IS_CONTRACT_DEPLOYED } from './config';
import type { BlockchainTransakcija } from './types';

/**
 * Ukupan broj transakcija na blockchain-u
 */
export function useUkupnoTransakcija() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AIIQ_WORLD_BANK_ABI,
    functionName: 'ukupnoTransakcija',
    query: { enabled: IS_CONTRACT_DEPLOYED },
  });
}

/**
 * Ukupno potrošeno (u USD)
 */
export function useUkupnoPotroseno() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AIIQ_WORLD_BANK_ABI,
    functionName: 'ukupnoPotroseno',
    query: { enabled: IS_CONTRACT_DEPLOYED },
  });
}

/**
 * Adresa vlasnika ugovora
 */
export function useVlasnikUgovora() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AIIQ_WORLD_BANK_ABI,
    functionName: 'vlasnik',
    query: { enabled: IS_CONTRACT_DEPLOYED },
  });
}

/**
 * Lista svih ID-ova transakcija
 */
export function useListaTransakcijaIds() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AIIQ_WORLD_BANK_ABI,
    functionName: 'dohvatiSveTransakcijeIds',
    query: { enabled: IS_CONTRACT_DEPLOYED },
  });
}

/**
 * Jedna transakcija po ID-u
 */
export function useTransakcija(id: bigint | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AIIQ_WORLD_BANK_ABI,
    functionName: 'dohvatiTransakciju',
    args: id !== undefined ? [id] : undefined,
    query: { enabled: IS_CONTRACT_DEPLOYED && id !== undefined },
  });
}

/**
 * Više transakcija odjednom (batch čitanje)
 */
export function usePrveTransakcije(count: number) {
  const ids = Array.from({ length: count }, (_, i) => BigInt(i + 1));

  return useReadContracts({
    contracts: ids.map((id) => ({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: AIIQ_WORLD_BANK_ABI,
      functionName: 'dohvatiTransakciju' as const,
      args: [id] as const,
    })),
    query: {
      enabled: IS_CONTRACT_DEPLOYED && count > 0,
      select: (results) =>
        results
          .filter((r) => r.status === 'success' && r.result !== undefined)
          .map((r) => r.result as BlockchainTransakcija),
    },
  });
}

/**
 * Stanje računa
 */
export function useStanjeRacuna(brojRacuna: string) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: AIIQ_WORLD_BANK_ABI,
    functionName: 'dohvatiStanjeRacuna',
    args: [brojRacuna],
    query: { enabled: IS_CONTRACT_DEPLOYED && !!brojRacuna },
  });
}
