import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ExtrimliDashboard } from '@/components/extrimli/ExtrimliDashboard';
import { MotionVisual } from '@/components/extrimli/MotionVisual';
import {
  EXTRIMLI_MOTION_ALIAS,
  resolveExtrimliMotion,
  resolveMotionMode,
} from '@/components/extrimli/motion-contract';
import { getExtrimliVisualAsset } from '@/components/extrimli/visual-assets';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

(() => {
  const resolved = resolveExtrimliMotion({
    type: 'orbital',
    intensity: 'high',
    mode: 'full',
    itemIndex: 1,
    maxAnimatedItems: 2,
  });
  assert(resolved.animate, 'motion should animate inside guardrail');
  assert(resolved.direction === 'reverse', 'high intensity should use reverse direction');
})();

(() => {
  const blocked = resolveExtrimliMotion({
    type: 'axis-rotate',
    intensity: 'medium',
    mode: 'full',
    itemIndex: 5,
    maxAnimatedItems: 5,
  });
  assert(!blocked.animate, 'motion should stop above maxAnimatedItems guardrail');
})();

(() => {
  const reduced = resolveMotionMode(true, 'full');
  assert(reduced === 'reduced', 'prefers-reduced-motion must force reduced mode');
})();

(() => {
  const fallback = getExtrimliVisualAsset('missing-domain');
  assert(fallback.icon === '🌀', 'unknown visual domain should use fallback asset');
})();

(() => {
  const reducedMarkup = renderToStaticMarkup(
    createElement(MotionVisual, {
      domain: 'gear',
      type: 'axis-rotate',
      mode: 'reduced',
    }),
  );
  assert(!reducedMarkup.includes('animate-spin'), 'reduced mode should not emit spin animation class');
})();

(() => {
  const dashboardMarkup = renderToStaticMarkup(
    createElement(ExtrimliDashboard, {
      athleteId: 'ATH-EXTRIMLI-001',
      performanceReport: {
        sessions: [],
        personalBests: [],
        improvementRate: 0,
      },
      latestRisk: null,
      upcomingEvents: [],
      weatherFactors: null,
    }),
  );

  assert(dashboardMarkup.includes(EXTRIMLI_MOTION_ALIAS), 'dashboard should expose EXTRIMLI motion alias');
  assert(dashboardMarkup.includes('Reduce motion'), 'dashboard should expose reduce-motion control');
})();
