import type { NextRequest } from 'next/server';
import { APP_VERSION } from '../../lib/constants';
import {
  INDUKCIJA_CONTRACT_VERSION,
  INDUKCIJA_MODEL_VERSION,
} from '../../lib/indukcija';
import { GET } from '../../app/api/indukcija/route';

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function run() {
  const request = new Request('http://localhost/api/indukcija', {
    headers: { 'x-forwarded-for': '127.0.9.1' },
  });
  const response = await GET(request as unknown as NextRequest);

  assert(response.status === 200, `Neočekivan status: ${response.status}`);
  assert(
    response.headers.get('X-Indukcija-Contract-Version') === INDUKCIJA_CONTRACT_VERSION,
    'X-Indukcija-Contract-Version mora odgovarati',
  );
  assert(
    response.headers.get('X-Indukcija-Model-Version') === INDUKCIJA_MODEL_VERSION,
    'X-Indukcija-Model-Version mora odgovarati',
  );

  const body = await response.json();
  assert(body && typeof body === 'object', 'body mora biti objekat');
  assert(body.verzija === APP_VERSION, 'body.verzija mora odgovarati APP_VERSION');
  assert(typeof body.timestamp === 'string' && body.timestamp.length > 0, 'body.timestamp mora postojati');

  const data = body.data;
  assert(data && typeof data === 'object', 'body.data mora biti objekat');
  assert(typeof data.sistem === 'string' && data.sistem.includes('INDUKCIJA'), 'data.sistem mora sadržati INDUKCIJA');
  assert(typeof data.verzija === 'string' && data.verzija === APP_VERSION, 'data.verzija mora odgovarati APP_VERSION');
  assert(typeof data.ukupanScore === 'number' && data.ukupanScore >= 0 && data.ukupanScore <= 100, 'data.ukupanScore mora biti 0-100');
  assert(typeof data.konacnaOcena === 'string' && data.konacnaOcena.length > 0, 'data.konacnaOcena mora postojati');
  assert(data.domeni && typeof data.domeni === 'object', 'data.domeni mora biti objekat');
  assert(Object.keys(data.domeni).length === 6, 'data.domeni mora imati 6 domena');
  assert(Array.isArray(data.preporuke), 'data.preporuke mora biti niz');

  console.log('✅ indukcija-route.test.ts passed');
}

run().catch((error) => {
  console.error('❌ indukcija-route.test.ts failed', error);
  process.exit(1);
});
