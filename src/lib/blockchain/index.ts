/**
 * 🔗 Blockchain — index fajl za blockchain biblioteku
 */

export { wagmiConfig, CONTRACT_ADDRESS, IS_CONTRACT_DEPLOYED, ACTIVE_CHAIN, polygon, polygonAmoy } from './config';
export { AIIQ_WORLD_BANK_ABI } from './abi';
export type { AIIQWorldBankABI } from './abi';
export {
  VALUTA_NAZIV,
  TRANSAKCIJA_STATUS_NAZIV,
  POLYGON_CHAIN_ID,
  POLYGON_AMOY_CHAIN_ID,
  EXPLORER_TX_URL,
  EXPLORER_ADDRESS_URL,
  EXPLORER_CONTRACT_URL,
} from './types';
export type {
  BlockchainTransakcija,
  BlockchainRacun,
  BlockchainInfo,
  ValutaEnum,
  TransakcijaStatusEnum,
} from './types';
export {
  useUkupnoTransakcija,
  useUkupnoPotroseno,
  useVlasnikUgovora,
  useListaTransakcijaIds,
  useTransakcija,
  usePrveTransakcije,
  useStanjeRacuna,
} from './hooks';
