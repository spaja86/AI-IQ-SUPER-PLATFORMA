// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI CUZ
// Kompanija SPAJA — Digitalna Industrija

'use client';

import type { MentorProfile, MentorMatch } from '@/lib/extrimli-cuz';

interface MentorFinderProps {
  mentors: MentorProfile[];
  match?: MentorMatch | null;
  menteeExperienceLevel?: number;
  onMatchRequest?: (menteeExperienceLevel: number, sportId: string) => void;
}

const AVAILABILITY_COLOR: Record<string, string> = {
  available:   'bg-green-100 text-green-800',
  busy:        'bg-yellow-100 text-yellow-800',
  unavailable: 'bg-gray-100 text-gray-500',
};

export function MentorFinder({ mentors, match, menteeExperienceLevel = 0, onMatchRequest }: MentorFinderProps) {
  return (
    <div className="space-y-4">
      {match && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-semibold text-green-800 mb-1">🎯 Best Match Found</p>
          <p className="text-xs text-green-700">
            Mentor: <span className="font-medium">{match.mentorAthleteId}</span> &nbsp;·&nbsp;
            Sport: <span className="font-medium">{match.sportId}</span> &nbsp;·&nbsp;
            Match Score: <span className="font-medium">{match.matchScore}</span> &nbsp;·&nbsp;
            Experience Gap: <span className="font-medium">+{match.experienceGap}</span>
          </p>
        </div>
      )}

      {mentors.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">No mentors available.</p>
      ) : (
        <div className="space-y-3">
          {mentors.map((mentor) => (
            <div key={mentor.athleteId} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{mentor.athleteId}</p>
                  <p className="text-xs text-gray-500">Level: {mentor.experienceLevel} / 10</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${AVAILABILITY_COLOR[mentor.availability] ?? 'bg-gray-100'}`}>
                  {mentor.availability}
                </span>
              </div>
              <p className="text-xs text-gray-600 italic mb-2">{mentor.bio}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {mentor.sportIds.map((s) => (
                  <span key={s} className="text-xs bg-blue-50 text-blue-700 rounded px-2 py-0.5 capitalize">{s}</span>
                ))}
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {mentor.rating > 0 && <span>⭐ {mentor.rating.toFixed(1)}</span>}
                {mentor.totalSessions > 0 && <span>📋 {mentor.totalSessions} sessions</span>}
              </div>
              {onMatchRequest && mentor.availability === 'available' && (
                <button
                  onClick={() => onMatchRequest(menteeExperienceLevel, mentor.sportIds[0])}
                  className="mt-3 w-full text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-1.5 transition"
                >
                  Find My Best Match
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
