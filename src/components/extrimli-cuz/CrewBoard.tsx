// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI CUZ
// Kompanija SPAJA — Digitalna Industrija

'use client';

import type { Crew } from '@/lib/extrimli-cuz';
import { CrewCard } from './CrewCard';

interface CrewBoardProps {
  crews: Crew[];
  currentAthleteId?: string;
  onJoin?: (crewId: string) => void;
  onLeave?: (crewId: string) => void;
}

export function CrewBoard({ crews, currentAthleteId, onJoin, onLeave }: CrewBoardProps) {
  if (crews.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-8">No crews found. Be the first to create one!</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {crews.map((crew) => (
        <CrewCard
          key={crew.id}
          crew={crew}
          currentAthleteId={currentAthleteId}
          onJoin={onJoin}
          onLeave={onLeave}
        />
      ))}
    </div>
  );
}
