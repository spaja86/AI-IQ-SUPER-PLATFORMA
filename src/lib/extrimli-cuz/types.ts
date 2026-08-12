// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI CUZ
// Kompanija SPAJA — Digitalna Industrija

// ─── Crew ─────────────────────────────────────────────────────────────────────

export type CrewMembershipState = 'pending' | 'accepted' | 'rejected' | 'left';

export interface Crew {
  id: string;
  name: string;
  sportIds: string[];
  memberIds: string[];
  captainId: string;
  region: string;
  isPublic: boolean;
  createdAt: number; // unix ms
}

export interface CrewMembership {
  crewId: string;
  athleteId: string;
  state: CrewMembershipState;
  requestedAt: number;
  resolvedAt?: number;
}

export interface CrewJoinResult {
  crewId: string;
  athleteId: string;
  success: boolean;
  message: string;
}

// ─── Mentor ───────────────────────────────────────────────────────────────────

export type MentorAvailability = 'available' | 'busy' | 'unavailable';

export interface MentorProfile {
  athleteId: string;
  sportIds: string[];
  experienceLevel: number; // 0–10
  availability: MentorAvailability;
  bio: string;
  rating: number;         // 0–5, aggregated from MentorFeedback
  totalSessions: number;
  registeredAt: number;   // unix ms
}

export interface MentorMatchInput {
  menteeAthleteId: string;
  sportId: string;
  menteeExperienceLevel: number; // 0–10
}

export interface MentorMatch {
  menteeAthleteId: string;
  mentorAthleteId: string;
  sportId: string;
  experienceGap: number;  // mentor.experienceLevel - mentee level
  matchScore: number;     // 0–100
  matchedAt: number;
}

export interface MentorFeedback {
  mentorAthleteId: string;
  menteeAthleteId: string;
  rating: number; // 1–5
  comment: string;
  submittedAt: number;
}

// ─── Feed ─────────────────────────────────────────────────────────────────────

export type FeedPostType = 'session' | 'gear-review' | 'event-callout' | 'general';

export interface CommunityFeedPost {
  id: string;
  athleteId: string;
  sportId: string;
  type: FeedPostType;
  content: string;
  sessionId?: string;
  eventId?: string;
  gearSku?: string;
  likes: string[];        // athleteIds who liked
  flagged: boolean;
  createdAt: number;
}

export interface FeedPostResult {
  post: CommunityFeedPost;
  valid: boolean;
  message: string;
}

// ─── Reputation ───────────────────────────────────────────────────────────────

export type ReputationTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export interface AthleteRating {
  raterId: string;
  athleteId: string;
  sportsmanship: number; // 1–5
  skill: number;         // 1–5
  reliability: number;   // 1–5
  submittedAt: number;
}

export interface ReputationScore {
  athleteId: string;
  avgSportsmanship: number;
  avgSkill: number;
  avgReliability: number;
  overallScore: number; // 0–100, composite
  tier: ReputationTier;
  totalRatings: number;
}

// ─── Health Report ────────────────────────────────────────────────────────────

export interface CuzHealthReport {
  personaId: string;
  contractVersion: string;
  moduleVersion: string;
  activeCrews: number;
  mentorProfiles: number;
  feedPosts: number;
  reputationScores: number;
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const CUZ_CONTRACT_VERSION = 'v1';
export const CUZ_MODULE_VERSION = '1.0.0';
export const CUZ_PERSONA_ID = 'extrimli-cuz-social';
export const CUZ_PERFORMANCE_MAX_MS = 50;
export const CUZ_API_RESPONSE_MAX_MS = 200;
