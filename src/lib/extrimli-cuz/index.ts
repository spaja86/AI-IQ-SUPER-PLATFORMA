// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI CUZ
// Kompanija SPAJA — Digitalna Industrija

import type { CuzHealthReport } from './types';
import {
  CUZ_CONTRACT_VERSION,
  CUZ_MODULE_VERSION,
  CUZ_PERSONA_ID,
  CUZ_PERFORMANCE_MAX_MS,
  CUZ_API_RESPONSE_MAX_MS,
} from './types';
import { listCrews } from './crew-engine';
import { listMentors } from './mentor-engine';
import { listPosts, getFeedMetrics } from './feed-engine';

// ─── Health ───────────────────────────────────────────────────────────────────

export function getCuzHealthReport(): CuzHealthReport {
  const { totalPosts } = getFeedMetrics();
  return {
    personaId: CUZ_PERSONA_ID,
    contractVersion: CUZ_CONTRACT_VERSION,
    moduleVersion: CUZ_MODULE_VERSION,
    activeCrews: listCrews().length,
    mentorProfiles: listMentors().length,
    feedPosts: totalPosts,
    reputationScores: 0,          // computed on-demand; not stored in count
    performanceMaxMs: CUZ_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: CUZ_API_RESPONSE_MAX_MS,
  };
}

// ─── Crew ─────────────────────────────────────────────────────────────────────

export {
  createCrew,
  getCrew,
  listCrews,
  joinCrew,
  acceptMember,
  leaveCrew,
  transferCaptaincy,
  getCrewMemberships,
  _resetCrewStore,
} from './crew-engine';

// ─── Mentor ───────────────────────────────────────────────────────────────────

export {
  registerMentor,
  getMentor,
  listMentors,
  matchMentor,
  submitMentorFeedback,
  _resetMentorStore,
} from './mentor-engine';

// ─── Feed ─────────────────────────────────────────────────────────────────────

export {
  createPost,
  getPost,
  listPosts,
  likePost,
  unlikePost,
  flagPost,
  getFeedMetrics,
  _resetFeedStore,
} from './feed-engine';

// ─── Reputation ───────────────────────────────────────────────────────────────

export {
  submitRating,
  getReputationScore,
  _resetRatingStore,
} from './reputation-engine';

// ─── Utils ────────────────────────────────────────────────────────────────────

export { generateId, isNonEmptyString, isInRange, round, clamp } from './utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export type {
  Crew,
  CrewMembership,
  CrewMembershipState,
  CrewJoinResult,
  MentorProfile,
  MentorAvailability,
  MentorMatchInput,
  MentorMatch,
  MentorFeedback,
  CommunityFeedPost,
  FeedPostType,
  FeedPostResult,
  AthleteRating,
  ReputationScore,
  ReputationTier,
  CuzHealthReport,
} from './types';

export {
  CUZ_CONTRACT_VERSION,
  CUZ_MODULE_VERSION,
  CUZ_PERSONA_ID,
  CUZ_PERFORMANCE_MAX_MS,
  CUZ_API_RESPONSE_MAX_MS,
} from './types';
