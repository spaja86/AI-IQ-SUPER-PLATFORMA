import type { NextRequest } from 'next/server';
import { NextRequest as NextServerRequest } from 'next/server';
import { APP_VERSION } from '../../lib/constants';
import { GET } from '../../app/api/vukobat/route';
import { VUKOBAT_CONTRACT_VERSION, VUKOBAT_MODEL_VERSION, VUKOBAT_NAZIV } from '../../lib/vukobat';

const TEST_API_URL = 'http://localhost/api/vukobat';

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function run() {
  const request = new NextServerRequest(TEST_API_URL, {
    headers: { 'x-forwarded-for': '127.0.0.1' },
  }) as NextRequest;

  const response = await GET(request);
  assert(response.status === 200, `Neočekivan status: ${response.status}`);
  assert(response.headers.get('X-Vukobat-Contract-Version') === VUKOBAT_CONTRACT_VERSION, 'contract header mora postojati');
  assert(response.headers.get('X-Vukobat-Model-Version') === VUKOBAT_MODEL_VERSION, 'model header mora postojati');

  const body = await response.json();
  assert(body.status === 'aktivan', 'status mora biti aktivan');
  assert(body.modul === VUKOBAT_NAZIV, 'modul mora biti VUKOBAT');
  assert(body.verzija === APP_VERSION, 'verzija mora odgovarati APP_VERSION');
  assert(body.contractVersion === VUKOBAT_CONTRACT_VERSION, 'contractVersion mora odgovarati');
  assert(body.modelVersion === VUKOBAT_MODEL_VERSION, 'modelVersion mora odgovarati');
  assert(typeof body.timestamp === 'string' && body.timestamp.length > 0, 'timestamp mora postojati');

  const data = body.data;
  assert(data && typeof data === 'object', 'data mora biti objekat');
  assert(data.sistem === VUKOBAT_NAZIV, 'data.sistem mora odgovarati nazivu modula');
  assert(typeof data.ukupanScore === 'number', 'ukupanScore mora biti broj');
  assert(typeof data.ukupnaVelocity === 'number', 'ukupnaVelocity mora biti broj');
  assert(Array.isArray(data.preporuke) && data.preporuke.length > 0, 'preporuke moraju biti neprazan niz');
  assert(Array.isArray(data.history), 'history mora biti niz');
  assert(data.meta?.contractVersion === VUKOBAT_CONTRACT_VERSION, 'data.meta.contractVersion mora postojati');
  assert(Object.keys(data.domeni ?? {}).length === 6, 'mora postojati 6 VUKOBAT domena');

  console.log('✅ vukobat-route.test.ts passed');
}

run().catch((error) => {
  console.error('❌ vukobat-route.test.ts failed', error);
  process.exit(1);
});
