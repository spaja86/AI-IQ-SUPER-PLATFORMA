import assert from 'node:assert';
import { getVukobatSekvence } from '../../lib/sekvence/vukobat-page';

function run() {
  const sekvence = getVukobatSekvence();

  assert(Array.isArray(sekvence), 'vukobat sekvence moraju biti niz');
  assert(sekvence.length >= 6, 'vukobat sekvence moraju imati najmanje 6 elemenata');

  const ids = new Set<string>();
  let previousOrder = 0;

  for (const sekvenca of sekvence) {
    assert(typeof sekvenca.id === 'string' && sekvenca.id.length > 0, 'sekvenca mora imati id');
    assert(!ids.has(sekvenca.id), `duplirani id: ${sekvenca.id}`);
    ids.add(sekvenca.id);

    assert(typeof sekvenca.redosled === 'number', `neispravan redosled za ${sekvenca.id}`);
    assert(sekvenca.redosled > previousOrder, `redosled nije rastući kod ${sekvenca.id}`);
    previousOrder = sekvenca.redosled;
  }

  const tipovi = sekvence.map((s) => s.tip);
  assert(tipovi.includes('hero'), 'nedostaje hero sekvenca');
  assert(tipovi.includes('statistika'), 'nedostaje statistika sekvenca');
  assert(tipovi.includes('tabela'), 'nedostaje tabela sekvenca');
  assert(tipovi.includes('progres'), 'nedostaje progres sekvenca');
  assert(tipovi.includes('lista'), 'nedostaje lista sekvenca');
  assert(tipovi.includes('cta'), 'nedostaje cta sekvenca');

  console.log('✅ vukobat-sekvence.test.ts passed');
}

run();
