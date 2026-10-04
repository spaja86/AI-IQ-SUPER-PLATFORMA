import assert from 'node:assert/strict';
import { executeSceneDemo, SCENE_DEMO_SOURCE } from '../../lib/ai-iq-programski-jezik/scene-demo';
assert.deepEqual(executeSceneDemo(SCENE_DEMO_SOURCE), { shape: 'cube', rotationY: 30, executionMode: 'LOCAL_DETERMINISTIC' });
for (const value of [-360, 0, 360, 12.5]) assert.equal(executeSceneDemo(SCENE_DEMO_SOURCE.replace('30', String(value))).rotationY, value);
for (const source of ['', SCENE_DEMO_SOURCE + '\nAI: RUN', SCENE_DEMO_SOURCE + '\nOUTPUT: SCENE', SCENE_DEMO_SOURCE.replace('30', '361'), SCENE_DEMO_SOURCE.replace('30', 'Infinity'), SCENE_DEMO_SOURCE.replace('NO_SECRET ALLOWLIST', 'ALLOWLIST'), SCENE_DEMO_SOURCE.replace('ROTATE_Y 30', 'eval(alert(1))'), 'x'.repeat(2049)]) assert.throws(() => executeSceneDemo(source));
console.log('PASS: bounded scene execution, angle boundaries, unknown/duplicate operations and injection rejection');
