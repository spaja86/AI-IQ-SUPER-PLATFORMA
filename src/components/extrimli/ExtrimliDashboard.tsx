// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI
// Kompanija SPAJA — Digitalna Industrija

'use client';

import { useEffect, useState } from 'react';
import type { PerformanceReport, RiskResult, ExtrimliEvent } from '@/lib/extrimli';
import { RiskMeter } from './RiskMeter';
import { PerformanceChart } from './PerformanceChart';
import { EventBoard } from './EventBoard';
import { WeatherBanner } from './WeatherBanner';
import type { WeatherRiskFactors } from '@/lib/extrimli';
import { MotionVisual } from './MotionVisual';
import {
  EXTRIMLI_MOTION_ALIAS,
  resolveMotionMode,
  type ExtrimliMotionMode,
} from './motion-contract';

interface ExtrimliDashboardProps {
  athleteId: string;
  performanceReport: PerformanceReport;
  latestRisk: RiskResult | null;
  upcomingEvents: ExtrimliEvent[];
  weatherFactors: WeatherRiskFactors | null;
  onRegister?: (eventId: string) => void;
}

export function ExtrimliDashboard({
  athleteId,
  performanceReport,
  latestRisk,
  upcomingEvents,
  weatherFactors,
  onRegister,
}: ExtrimliDashboardProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [requestedMode, setRequestedMode] = useState<ExtrimliMotionMode>('full');

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setPrefersReducedMotion(mediaQuery.matches);
    sync();
    mediaQuery.addEventListener('change', sync);

    return () => mediaQuery.removeEventListener('change', sync);
  }, []);

  const motionMode = resolveMotionMode(prefersReducedMotion, requestedMode);

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <MotionVisual domain="dashboard" type="axis-rotate" intensity="medium" mode={motionMode} />
          EXTRIMLI Dashboard
        </h2>
        <span className="text-xs text-gray-400">Athlete: {athleteId}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2">
        <span className="text-xs text-gray-500">
          Motion layer: <strong>{EXTRIMLI_MOTION_ALIAS}</strong>
        </span>
        <button
          type="button"
          onClick={() => setRequestedMode((prev) => (prev === 'paused' ? 'full' : 'paused'))}
          className="text-xs rounded-md border border-gray-300 px-2 py-1 bg-white text-gray-700 hover:bg-gray-100"
        >
          {motionMode === 'paused' ? 'Resume motion' : 'Pause motion'}
        </button>
        <button
          type="button"
          onClick={() => setRequestedMode((prev) => (prev === 'reduced' ? 'full' : 'reduced'))}
          className="text-xs rounded-md border border-gray-300 px-2 py-1 bg-white text-gray-700 hover:bg-gray-100"
        >
          {motionMode === 'reduced' ? 'Enable full motion' : 'Reduce motion'}
        </button>
        {prefersReducedMotion && (
          <span className="text-[11px] text-amber-700">System reduced-motion preference detected.</span>
        )}
      </div>

      {weatherFactors && (
        <WeatherBanner factors={weatherFactors} />
      )}

      {latestRisk && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <MotionVisual domain="risk" type="orbital" intensity="low" mode={motionMode} />
            Current Risk Assessment
          </h3>
          <RiskMeter score={latestRisk.riskScore} level={latestRisk.riskLevel} />
          <p className="text-xs text-gray-500 mt-2 italic">{latestRisk.recommendation}</p>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <MotionVisual domain="performance" type="axis-rotate" intensity="low" mode={motionMode} />
          Performance
        </h3>
        <PerformanceChart
          sessions={performanceReport.sessions}
          personalBests={performanceReport.personalBests}
          improvementRate={performanceReport.improvementRate}
          motionMode={motionMode}
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <MotionVisual domain="event" type="orbital" intensity="medium" mode={motionMode} />
          Upcoming Events
        </h3>
        <EventBoard events={upcomingEvents} onRegister={onRegister} motionMode={motionMode} />
      </div>
    </div>
  );
}
