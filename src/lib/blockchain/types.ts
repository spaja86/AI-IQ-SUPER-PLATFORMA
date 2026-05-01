/**
 * 🔗 Blockchain — TypeScript tipovi za AI IQ World Bank pametni ugovor
 */

export type ValutaEnum = 0 | 1 | 2; // 0=RSD, 1=EUR, 2=USD
export type TransakcijaStatusEnum = 0 | 1 | 2; // 0=IZVRSENO, 1=U_OBRADI, 2=CEKANJE

export const VALUTA_NAZIV: Record<ValutaEnum, string> = {
  0: 'RSD',
  1: 'EUR',
  2: 'USD',
};

export const TRANSAKCIJA_STATUS_NAZIV: Record<TransakcijaStatusEnum, string> = {
  0: 'Izvršeno ✅',
  1: 'U obradi ⏳',
  2: 'Čekanje 🕐',
};

export interface BlockchainTransakcija {
  id: bigint;
  naziv: string;
  opis: string;
  iznos: bigint;
  valuta: ValutaEnum;
  izvor: string;
  destinacija: string;
  status: TransakcijaStatusEnum;
  datumBlok: bigint;
  inicijator: `0x${string}`;
}

export interface BlockchainRacun {
  brojRacuna: string;
  naziv: string;
  valuta: ValutaEnum;
  stanje: bigint;
  aktivan: boolean;
}

export interface BlockchainInfo {
  adresaUgovora: string;
  mreza: string;
  chainId: number;
  explorerUrl: string;
  ukupnoTransakcija: number;
  ukupnoPotroseno: number;
  vlasnik: string;
  deployovan: boolean;
}

export const POLYGON_CHAIN_ID = 137;
export const POLYGON_AMOY_CHAIN_ID = 80002;

export const EXPLORER_TX_URL = (hash: string, testnet = false) =>
  testnet
    ? `https://amoy.polygonscan.com/tx/${hash}`
    : `https://polygonscan.com/tx/${hash}`;

export const EXPLORER_ADDRESS_URL = (address: string, testnet = false) =>
  testnet
    ? `https://amoy.polygonscan.com/address/${address}`
    : `https://polygonscan.com/address/${address}`;

export const EXPLORER_CONTRACT_URL = (address: string, testnet = false) =>
  testnet
    ? `https://amoy.polygonscan.com/address/${address}#code`
    : `https://polygonscan.com/address/${address}#code`;
