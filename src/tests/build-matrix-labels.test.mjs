import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('matrix labels load as inactive metadata, not executable commands', () => {
  const config = JSON.parse(readFileSync(new URL('../../scripts/build-matrix-labels.json', import.meta.url), 'utf8'));
  assert.equal(config.version, 1);
  assert.equal(config.mode, 'metadata-only');
  assert.equal(config.executionEnabled, false);
  assert.deepEqual(config.labels, ['djer', 'dere', 'niks', 'dor', 'rin', 'ned']);
  assert.equal(new Set(config.labels).size, 6);
  assert.deepEqual(Object.keys(config).sort(), ['executionEnabled', 'labels', 'mode', 'version']);
});
