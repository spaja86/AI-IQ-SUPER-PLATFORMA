import { resolve } from 'node:path';
import { startPilot } from '../src/lib/suoc-pilot/server';

async function main() {
  if (Number(process.versions.node.split('.')[0]) < 24) throw new Error('SUOC pilot zahteva Node.js 24 ili noviji.');
  process.umask(0o077);
  const app = await startPilot({
    database: process.env.SUOC_PILOT_DB ?? resolve('.suoc-pilot/pilot.sqlite'),
    port: Number(process.env.SUOC_PILOT_PORT ?? '4318'),
    assets: resolve('pilot/suoc'),
  });
  console.log(`SUOC pilot: ${app.origin}`);
  console.log(`SPAJA MASTER OMEGA / VRH: ${app.origin}/omega`);
  let stopping = false;
  const stop = async () => { if (stopping) return; stopping = true; await app.close(); };
  process.on('SIGTERM', () => void stop());
  process.on('SIGINT', () => void stop());
}
main().catch(error => { console.error(error instanceof Error ? error.message : 'Pilot nije pokrenut.'); process.exitCode = 1; });
