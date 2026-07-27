import { APP_VERSION } from '../../lib/constants';
import { GET } from '../../app/api/story-of-life/route';

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
  assert(body.modul === 'STORY OF LIFE', 'modul mora biti STORY OF LIFE');
  assert(body.verzija === APP_VERSION, 'verzija mora odgovarati APP_VERSION');
  assert(typeof body.timestamp === 'string' && body.timestamp.length > 0, 'timestamp mora postojati');

  const data = body.data;
  assert(data && typeof data === 'object', 'data mora biti objekat');
  assert(Array.isArray(data.timeline) && data.timeline.length > 0, 'timeline mora biti neprazan niz');
  assert(Array.isArray(data.signali) && data.signali.length > 0, 'signali moraju biti neprazan niz');

  console.log('✅ story-of-life-route.test.ts passed');
}

run().catch((error) => {
  console.error('❌ story-of-life-route.test.ts failed', error);
  process.exit(1);
});
