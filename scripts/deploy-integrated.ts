import { ethers, network } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying IntegratedPlatformHub on ${network.name} as ${deployer.address}`);

  const Factory = await ethers.getContractFactory('IntegratedPlatformHub');
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  const txHash = contract.deploymentTransaction()?.hash;

  console.log('IntegratedPlatformHub deployed:');
  console.log(`  address: ${address}`);
  console.log(`  txHash:  ${txHash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
