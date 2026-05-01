/**
 * 🔗 Blockchain — Wagmi + Viem konfiguracija za Polygon mrežu
 *
 * Konfiguracija za čitanje podataka sa AI IQ World Bank pametnog ugovora
 * direktno sa Polygon blockchain-a.
 *
 * Mreže:
 *   - Polygon mainnet (chainId: 137) — produkcija
 *   - Polygon Amoy testnet (chainId: 80002) — testiranje
 */

import { http, createConfig } from 'wagmi';
import { polygon, polygonAmoy } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

const IS_TESTNET = process.env.NEXT_PUBLIC_BLOCKCHAIN_TESTNET === 'true';

// WalletConnect Project ID — registrujte se na https://cloud.walletconnect.com
const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? 'aiiq-world-bank-placeholder';

// Adresa deployovanog pametnog ugovora
export const CONTRACT_ADDRESS = (
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '0x0000000000000000000000000000000000000000'
) as `0x${string}`;

export const IS_CONTRACT_DEPLOYED =
  CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000';

export const ACTIVE_CHAIN = IS_TESTNET ? polygonAmoy : polygon;

export const wagmiConfig = createConfig({
  chains: [polygon, polygonAmoy],
  connectors: [
    injected(),
    walletConnect({ projectId: WALLETCONNECT_PROJECT_ID }),
  ],
  transports: {
    [polygon.id]: http(
      process.env.NEXT_PUBLIC_POLYGON_RPC_URL ?? 'https://polygon-rpc.com'
    ),
    [polygonAmoy.id]: http(
      process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC_URL ?? 'https://rpc-amoy.polygon.technology'
    ),
  },
  ssr: true,
});

export { polygon, polygonAmoy };
