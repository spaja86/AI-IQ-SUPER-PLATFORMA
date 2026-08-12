// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI CUZ
// Kompanija SPAJA — Digitalna Industrija

'use client';

import type { Crew } from '@/lib/extrimli-cuz';

interface CrewCardProps {
  crew: Crew;
  currentAthleteId?: string;
  onJoin?: (crewId: string) => void;
  onLeave?: (crewId: string) => void;
}

export function CrewCard({ crew, currentAthleteId, onJoin, onLeave }: CrewCardProps) {
  const isMember  = currentAthleteId ? crew.memberIds.includes(currentAthleteId) : false;
  const isCaptain = currentAthleteId ? crew.captainId === currentAthleteId       : false;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-base font-semibold text-gray-800">{crew.name}</h3>
          <p className="text-xs text-gray-500">📍 {crew.region}</p>
        </div>
        {isCaptain && (
          <span className="text-xs bg-yellow-100 text-yellow-800 rounded-full px-2 py-0.5 font-medium">
            ⭐ Captain
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {crew.sportIds.map((sport) => (
          <span key={sport} className="text-xs bg-blue-50 text-blue-700 rounded px-2 py-0.5 capitalize">
            {sport}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>👥 {crew.memberIds.length} member{crew.memberIds.length !== 1 ? 's' : ''}</span>
        <span>{crew.isPublic ? '🌐 Public' : '🔒 Private'}</span>
      </div>

      {currentAthleteId && !isCaptain && (
        <div className="mt-3">
          {isMember ? (
            <button
              onClick={() => onLeave?.(crew.id)}
              className="w-full text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-1.5 transition"
            >
              Leave Crew
            </button>
          ) : (
            <button
              onClick={() => onJoin?.(crew.id)}
              className="w-full text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-1.5 transition"
            >
              {crew.isPublic ? 'Join Crew' : 'Request to Join'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
