import { getSpajaServerControlPlane } from '../src/lib/spaja-server-control-plane';
/** Read-only local diagnostics. No network, deployment or payment operations. */
import { spawnSync } from 'node:child_process';
import { getSveKomponente, getKompjuterStatistika, DIGITALNI_KOMPJUTER_EVIDENCE } from '../src/lib/spaja-digitalni-kompjuter';
import { buildBankPrototypeSummary } from '../src/lib/bank-prototype';
import { getDigitalniKompjuterToolchain } from '../src/lib/digitalni-kompjuter-toolchain';
const command = process.argv[2];
if (command === 'server') {
  console.log(JSON.stringify(getSpajaServerControlPlane(), null, 2));
} else if (command === 'evidence') {
  const file = process.argv[3];
  if (!file || process.argv.length !== 4) { console.error('Usage: evidence <local-report.json>'); process.exitCode = 2; }
  else {
    const result = spawnSync(process.execPath, ['scripts/revision-test-evidence.mjs', '--inspect', file], { stdio: 'inherit', timeout: 15000, shell: false });
    process.exitCode = result.status ?? 1;
  }
} else if (command === 'toolchain') {
  console.log(JSON.stringify(getDigitalniKompjuterToolchain(), null, 2));
} else if (command === 'bank-status') {
  console.log(JSON.stringify(buildBankPrototypeSummary(), null, 2));
} else if (command === 'inventory') {
  console.log(JSON.stringify({ ...DIGITALNI_KOMPJUTER_EVIDENCE, components: getSveKomponente() }, null, 2));
} else if (command === 'status') {
  console.log(JSON.stringify({ ...DIGITALNI_KOMPJUTER_EVIDENCE, statistics: getKompjuterStatistika() }, null, 2));
} else if (command === 'check') {
  const components = getSveKomponente();
  const valid = new Set(components.map(c => c.id)).size === components.length && components.length === getKompjuterStatistika().ukupnoKomponenti;
  console.log(JSON.stringify({ catalogConsistent: valid, runtimeVerified: false }));
  process.exitCode = valid ? 0 : 1;
} else if (command === 'test') {
  const result = spawnSync('npm', ['run', 'test:digitalni-kompjuter'], { stdio: 'inherit' });
  process.exitCode = result.status ?? 1;
} else {
  console.error('Usage: npm run digitalni-kompjuter -- inventory|status|check|test|bank-status|toolchain|evidence|server');
  process.exitCode = 2;
}
