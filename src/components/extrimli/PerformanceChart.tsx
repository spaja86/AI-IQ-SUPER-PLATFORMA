// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI
// Kompanija SPAJA — Digitalna Industrija

'use client';

import type { AthleteSession, PersonalBest } from '@/lib/extrimli';

interface PerformanceChartProps {
  sessions: AthleteSession[];
  personalBests: PersonalBest[];
  improvementRate: number;
}

export function PerformanceChart({ sessions, personalBests, improvementRate }: PerformanceChartProps) {
  const sorted = [...sessions].sort((a, b) => a.timestamp - b.timestamp).slice(-10);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">Recent Sessions</h4>
        <span className={`text-xs font-bold ${improvementRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {improvementRate >= 0 ? '▲' : '▼'} {Math.abs(improvementRate).toFixed(1)}% improvement
        </span>
      </div>

      {sorted.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4">No sessions recorded yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-gray-600">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase text-left">
                <th className="pb-1 pr-3">Sport</th>
                <th className="pb-1 pr-3">Speed</th>
                <th className="pb-1 pr-3">Altitude</th>
                <th className="pb-1 pr-3">Distance</th>
                <th className="pb-1">G-Force</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((s) => (
                <tr key={s.sessionId} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-1 pr-3 font-medium">{s.sportId}</td>
                  <td className="py-1 pr-3">{s.speedKph != null ? `${s.speedKph} kph` : '—'}</td>
                  <td className="py-1 pr-3">{s.altitudeM != null ? `${s.altitudeM} m` : '—'}</td>
                  <td className="py-1 pr-3">{s.distanceKm != null ? `${s.distanceKm} km` : '—'}</td>
                  <td className="py-1">{s.gForce != null ? `${s.gForce}g` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {personalBests.length > 0 && (
        <div>
          <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Personal Bests 🏅</h5>
          <div className="flex flex-wrap gap-2">
            {personalBests.map((pb) => (
              <span key={pb.metric} className="text-xs bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-full px-2 py-0.5">
                {pb.metric}: {pb.value}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
