import { mikiMausIPajaPatakSekvence } from '../../lib/sekvence/miki-maus-i-paja-patak-page';

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function run() {
  assert(Array.isArray(mikiMausIPajaPatakSekvence), 'sekvence moraju biti niz');
  assert(mikiMausIPajaPatakSekvence.length >= 6, 'sekvence moraju imati najmanje 6 stavki');

  const ids = new Set<string>();
  let previousOrder = 0;

  for (const sekvenca of mikiMausIPajaPatakSekvence) {
    assert(typeof sekvenca.id === 'string' && sekvenca.id.length > 0, 'Sekvenca mora imati id');
    assert(!ids.has(sekvenca.id), `Duplirani id: ${sekvenca.id}`);
    ids.add(sekvenca.id);

    assert(typeof sekvenca.redosled === 'number', `Neispravan redosled za ${sekvenca.id}`);
    assert(sekvenca.redosled > previousOrder, `Redosled nije rastući kod ${sekvenca.id}`);
    previousOrder = sekvenca.redosled;
  }

  const tipovi = mikiMausIPajaPatakSekvence.map((s) => s.tip);
  assert(tipovi.includes('hero'), 'Nedostaje hero sekvenca');
  assert(tipovi.includes('statistika'), 'Nedostaje statistika sekvenca');
  assert(tipovi.includes('kartice'), 'Nedostaje kartice sekvenca');
  assert(tipovi.includes('tabela'), 'Nedostaje tabela sekvenca');
  assert(tipovi.includes('tekst'), 'Nedostaje tekst sekvenca');
  assert(tipovi.includes('cta'), 'Nedostaje cta sekvenca');

  console.log('✅ miki-maus-i-paja-patak-sekvence.test.ts passed');
}

run();
