import { APP_VERSION } from '../../lib/constants';
import { GET } from '../../app/api/miki-maus-i-paja-patak/route';

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function run() {
  const response = await GET();
  assert(response.status === 200, `Neočekivan status: ${response.status}`);

  const body = await response.json();
  assert(body.status === 'aktivan', 'status mora biti aktivan');
  assert(body.modul === 'MIKI MAUS I PAJA PATAK', 'modul mora biti MIKI MAUS I PAJA PATAK');
  assert(body.verzija === APP_VERSION, 'verzija mora odgovarati APP_VERSION');
  assert(typeof body.timestamp === 'string' && body.timestamp.length > 0, 'timestamp mora postojati');

  const data = body.data;
  assert(data && typeof data === 'object', 'data mora biti objekat');
  assert(Array.isArray(data.likovi) && data.likovi.length > 0, 'likovi moraju biti neprazan niz');
  assert(Array.isArray(data.scene) && data.scene.length > 0, 'scene moraju biti neprazan niz');
  assert(Array.isArray(data.poruke) && data.poruke.length > 0, 'poruke moraju biti neprazan niz');

  console.log('✅ miki-maus-i-paja-patak-route.test.ts passed');
}

run().catch((error) => {
  console.error('❌ miki-maus-i-paja-patak-route.test.ts failed', error);
  process.exit(1);
});
