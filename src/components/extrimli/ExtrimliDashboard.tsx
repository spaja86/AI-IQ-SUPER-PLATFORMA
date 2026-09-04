// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI
// Kompanija SPAJA — Digitalna Industrija

'use client';

import type { PerformanceReport, RiskResult, ExtrimliEvent } from '@/lib/extrimli';
import { RiskMeter } from './RiskMeter';
import { PerformanceChart } from './PerformanceChart';
import { EventBoard } from './EventBoard';
import { WeatherBanner } from './WeatherBanner';
import type { WeatherRiskFactors } from '@/lib/extrimli';

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
  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">🏔 EXTRIMLI Dashboard</h2>
        <span className="text-xs text-gray-400">Athlete: {athleteId}</span>
      </div>

      {weatherFactors && (
        <WeatherBanner factors={weatherFactors} />
      )}

      {latestRisk && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Current Risk Assessment</h3>
          <RiskMeter score={latestRisk.riskScore} level={latestRisk.riskLevel} />
          <p className="text-xs text-gray-500 mt-2 italic">{latestRisk.recommendation}</p>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Performance</h3>
        <PerformanceChart
          sessions={performanceReport.sessions}
          personalBests={performanceReport.personalBests}
          improvementRate={performanceReport.improvementRate}
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Upcoming Events</h3>
        <EventBoard events={upcomingEvents} onRegister={onRegister} />
      </div>
    </div>
  );
}
