import test, { mock } from 'node:test';
import assert from 'node:assert/strict';
import { getExtrimliExtremProfilerReport } from '../../lib/extrimli-extrem';

test('language profiler summary retains all consumed technical and governance signals', () => {
  mock.timers.enable({ apis: ['Date'], now: Date.UTC(2026, 9, 23) });
  try {
    const summary = getExtrimliExtremProfilerReport({ materializeInnovations: false });
    const full = getExtrimliExtremProfilerReport();
    for (const key of [
      'programskiJezikInformacionihTokova', 'programskiJezikPretpostavka',
      'programskiJezikPoProsparitetuDeklasiraneMatriceUEkstazi', 'programskiJezikDekoracijeObjektnihPrimesa',
      'programskiJezikSpecijalizovanZaIgrice',
    ] as const) assert.deepEqual(summary[key], full[key], key);
    assert.deepEqual(summary.dokDikDakDukConsistencyHealth.signals, full.dokDikDakDukConsistencyHealth.signals);
    assert.deepEqual(
      summary.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.automatizacijaProgramskogJezikaTrack,
      full.dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.automatizacijaProgramskogJezikaTrack,
    );
  } finally { mock.timers.reset(); }
});
