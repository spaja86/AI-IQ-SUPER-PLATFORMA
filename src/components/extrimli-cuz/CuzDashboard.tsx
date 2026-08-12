// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI CUZ
// Kompanija SPAJA — Digitalna Industrija

'use client';

import type { Crew, MentorProfile, MentorMatch, CommunityFeedPost, ReputationScore } from '@/lib/extrimli-cuz';
import { CrewBoard } from './CrewBoard';
import { MentorFinder } from './MentorFinder';
import { CommunityFeed } from './CommunityFeed';
import { ReputationBadge } from './ReputationBadge';

interface CuzDashboardProps {
  athleteId: string;
  crews: Crew[];
  mentors: MentorProfile[];
  mentorMatch?: MentorMatch | null;
  feedPosts: CommunityFeedPost[];
  reputationScore: ReputationScore;
  onJoinCrew?: (crewId: string) => void;
  onLeaveCrew?: (crewId: string) => void;
  onLikePost?: (postId: string) => void;
  onMatchMentor?: (menteeExperienceLevel: number, sportId: string) => void;
}

export function CuzDashboard({
  athleteId,
  crews,
  mentors,
  mentorMatch,
  feedPosts,
  reputationScore,
  onJoinCrew,
  onLeaveCrew,
  onLikePost,
  onMatchMentor,
}: CuzDashboardProps) {
  return (
    <div className="space-y-8 p-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">🤝 EXTRIMLI CUZ</h2>
        <span className="text-xs text-gray-400">Athlete: {athleteId}</span>
      </div>

      {/* Reputation */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Your Reputation</h3>
        <ReputationBadge score={reputationScore} />
      </section>

      {/* Crews */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Crews</h3>
        <CrewBoard
          crews={crews}
          currentAthleteId={athleteId}
          onJoin={onJoinCrew}
          onLeave={onLeaveCrew}
        />
      </section>

      {/* Mentors */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Find a Mentor</h3>
        <MentorFinder
          mentors={mentors}
          match={mentorMatch}
          onMatchRequest={onMatchMentor}
        />
      </section>

      {/* Community Feed */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Community Feed</h3>
        <CommunityFeed
          posts={feedPosts}
          currentAthleteId={athleteId}
          onLike={onLikePost}
        />
      </section>
    </div>
  );
}
