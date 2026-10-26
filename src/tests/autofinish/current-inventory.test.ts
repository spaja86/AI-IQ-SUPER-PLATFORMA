import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { runDiagnostics } from '../../lib/auto-repair';
import { gejmingEntiteti } from '../../lib/gejming-likovi';
import { TOTAL_API_ROUTES, TOTAL_PAGES, TOTAL_ROUTES, TOTAL_DIAGNOSTIKA, TOTAL_GEJMING_ENTITETA } from '../../lib/constants';

test('current counters equal the actual source and runtime catalogues', () => {
  const files = readdirSync('src/app', { recursive: true }) as string[];
  assert.equal(TOTAL_API_ROUTES, files.filter(file => /^api\/.*\/route\.tsx?$/.test(file)).length);
  assert.equal(TOTAL_PAGES, files.filter(file => /(?:^|\/)page\.tsx?$/.test(file)).length);
  assert.equal(TOTAL_ROUTES, TOTAL_API_ROUTES + TOTAL_PAGES);
  assert.equal(TOTAL_DIAGNOSTIKA, runDiagnostics().provere.length);
  assert.equal(TOTAL_GEJMING_ENTITETA, gejmingEntiteti.length);
});
