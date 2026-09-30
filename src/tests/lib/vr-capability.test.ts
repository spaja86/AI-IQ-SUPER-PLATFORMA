import { resolveVrCapabilityReport } from '../../lib/vr-capability';

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try { fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (error) { console.error(`  ❌ ${name}`); console.error(error); failed++; }
}

function assert(value: boolean, message: string) { if (!value) throw new Error(message); }

console.log('\n[vr-capability] tests\n');
test('reports unsupported without WebGL', () => {
  const report = resolveVrCapabilityReport({ webglAvailable: false, webxrAvailable: true, immersiveVrSupported: true });
  assert(report.status === 'unsupported', 'expected unsupported');
});
test('reports unavailable without WebXR', () => {
  const report = resolveVrCapabilityReport({ webglAvailable: true, webxrAvailable: false, immersiveVrSupported: false });
  assert(report.status === 'unavailable', 'expected unavailable');
});
test('reports ready only for immersive VR support', () => {
  const report = resolveVrCapabilityReport({ webglAvailable: true, webxrAvailable: true, immersiveVrSupported: true });
  assert(report.status === 'ready', 'expected ready');
  assert(report.disclaimer.includes('ne potvrđuje model naočara'), 'missing compatibility disclaimer');
});
console.log(`\nResults: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
