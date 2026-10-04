/** Bounded local demo dialect, not a replacement for the canonical compiler. */
export const SCENE_DEMO_SOURCE = `INTENT: CUBE_DEMO
RULE: NO_SECRET ALLOWLIST
ORCHESTRATE: ROTATE_Y 30
OUTPUT: SCENE`;

export interface DemoScene { shape: 'cube'; rotationY: number; executionMode: 'LOCAL_DETERMINISTIC'; }

export function executeSceneDemo(source: string): DemoScene {
  if (typeof source !== 'string' || source.length > 2048) throw new Error('Invalid source size');
  const fields = new Map<string, string>();
  for (const line of source.split(/\r?\n/).filter(l => l.trim())) {
    const match = /^([A-Z]+):\s*(.+)$/.exec(line.trim());
    if (!match || fields.has(match[1])) throw new Error('Malformed or duplicate instruction');
    fields.set(match[1], match[2].trim());
  }
  if (fields.size !== 4 || fields.get('INTENT') !== 'CUBE_DEMO' ||
      fields.get('RULE') !== 'NO_SECRET ALLOWLIST' || fields.get('OUTPUT') !== 'SCENE') {
    throw new Error('Unsupported demo program');
  }
  const rotate = /^ROTATE_Y (-?\d+(?:\.\d+)?)$/.exec(fields.get('ORCHESTRATE') ?? '');
  const angle = rotate ? Number(rotate[1]) : NaN;
  if (!Number.isFinite(angle) || Math.abs(angle) > 360) throw new Error('Rotation must be between -360 and 360');
  return { shape: 'cube', rotationY: angle, executionMode: 'LOCAL_DETERMINISTIC' };
}
