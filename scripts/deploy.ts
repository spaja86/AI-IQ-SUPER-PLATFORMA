/**
 * 🚀 Deploy script — AIIQWorldBank pametni ugovor (Hardhat 3 + ethers)
 *
 * Pokreće se automatski putem GitHub Actions.
 * Može se pokrenuti i ručno:
 *
 *   Amoy testnet (besplatno):
 *   npx hardhat run scripts/deploy.ts --network amoy
 *
 *   Polygon mainnet (produkcija):
 *   npx hardhat run scripts/deploy.ts --network polygon
 */

import { ethers, network } from 'hardhat';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('═══════════════════════════════════════════════');
  console.log('  AI IQ World Bank — Deploy Pametnog Ugovora');
  console.log('═══════════════════════════════════════════════');
  console.log(`Mreža:      ${network.name}`);
  console.log(`Adresa:     ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Stanje:     ${ethers.formatEther(balance)} MATIC`);
  console.log('───────────────────────────────────────────────');

  if (balance === 0n) {
    throw new Error(
      '❌ Nema MATIC na deployer adresi!\n' +
      '   Za testnet (besplatno): https://faucet.polygon.technology\n' +
      '   Za mainnet: kupite MATIC na berzi'
    );
  }

  console.log('⏳ Deployujem AIIQWorldBank...');
  const Factory = await ethers.getContractFactory('AIIQWorldBank');
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  const deployTx = contract.deploymentTransaction();

  console.log('');
  console.log('✅ USPEŠNO DEPLOYOVANO!');
  console.log('═══════════════════════════════════════════════');
  console.log(`Adresa ugovora: ${address}`);
  console.log(`Tx hash:        ${deployTx?.hash}`);
  const isTestnet = network.name === 'amoy';
  const explorerBase = isTestnet
    ? 'https://amoy.polygonscan.com'
    : 'https://polygonscan.com';
  console.log(`Explorer:       ${explorerBase}/address/${address}`);
  console.log(`Tx Explorer:    ${explorerBase}/tx/${deployTx?.hash}`);
  console.log('═══════════════════════════════════════════════');

  // Sačuvaj adresu u .env.deployed za GitHub Actions
  const envLine = `NEXT_PUBLIC_CONTRACT_ADDRESS=${address}\nNEXT_PUBLIC_BLOCKCHAIN_TESTNET=${isTestnet}\n`;
  fs.writeFileSync(path.join(__dirname, '..', '.env.deployed'), envLine, 'utf8');
  console.log('');
  console.log(`💾 Adresa sačuvana u .env.deployed`);
  console.log('');
  console.log('📋 SLEDEĆI KORAK:');
  console.log('   Postavite u Cloudflare Pages environment varijable:');
  console.log(`   NEXT_PUBLIC_CONTRACT_ADDRESS = ${address}`);
  if (isTestnet) {
    console.log('   NEXT_PUBLIC_BLOCKCHAIN_TESTNET = true');
  }
}

main().catch((err) => {
  console.error('\n❌ Deploy neuspešan:', err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
