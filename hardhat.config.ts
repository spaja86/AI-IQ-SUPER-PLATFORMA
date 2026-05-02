import hardhatToolboxMochaEthersPlugin from '@nomicfoundation/hardhat-toolbox-mocha-ethers';
import { configVariable, defineConfig } from 'hardhat/config';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const hasDeployerPrivateKey = !!process.env.DEPLOYER_PRIVATE_KEY;

export default defineConfig({
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    profiles: {
      default: {
        version: '0.8.24',
      },
      production: {
        version: '0.8.24',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    // Polygon mainnet — produkcija (potrebni pravi MATIC)
    polygon: {
      type: 'http',
      url: process.env.POLYGON_RPC_URL ?? 'https://polygon-rpc.com',
      accounts: hasDeployerPrivateKey ? [configVariable('DEPLOYER_PRIVATE_KEY')] : [],
      chainType: 'l1',
    },
    // Polygon Amoy testnet -- BESPLATNO testiranje
    amoy: {
      type: 'http',
      url: process.env.POLYGON_AMOY_RPC_URL ?? 'https://rpc-amoy.polygon.technology',
      accounts: hasDeployerPrivateKey ? [configVariable('DEPLOYER_PRIVATE_KEY')] : [],
      chainType: 'l1',
    },
  },
  paths: {
    sources: './contracts',
    cache: './cache-hardhat',
    artifacts: './artifacts',
  },
});
