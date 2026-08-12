// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI CUZ
// Kompanija SPAJA — Digitalna Industrija

import type {
  MentorProfile,
  MentorMatchInput,
  MentorMatch,
  MentorFeedback,
  MentorAvailability,
} from './types';
import { generateId, isNonEmptyString, isInRange, round, clamp } from './utils';

const MENTOR_STORE: Map<string, MentorProfile> = new Map();
const FEEDBACK_STORE: Map<string, MentorFeedback[]> = new Map(); // keyed by mentorAthleteId

// ─── Helpers ──────────────────────────────────────────────────────────────────

function recalcRating(mentorAthleteId: string): void {
  const profile = MENTOR_STORE.get(mentorAthleteId);
  if (!profile) return;

  const feedbacks = FEEDBACK_STORE.get(mentorAthleteId) ?? [];
  if (feedbacks.length === 0) return;

  const avg = feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length;
  profile.rating = round(avg, 2);
  profile.totalSessions = feedbacks.length;
  MENTOR_STORE.set(mentorAthleteId, profile);
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function registerMentor(data: {
  athleteId: string;
  sportIds: string[];
  experienceLevel: number;
  availability: MentorAvailability;
  bio: string;
}): MentorProfile {
  if (!isNonEmptyString(data.athleteId)) throw new Error('athleteId is required');
  if (!Array.isArray(data.sportIds) || data.sportIds.length === 0) throw new Error('sportIds must be a non-empty array');
  if (!isInRange(data.experienceLevel, 0, 10)) throw new Error('experienceLevel must be in [0, 10]');
  if (!isNonEmptyString(data.bio)) throw new Error('bio is required');

  const profile: MentorProfile = {
    athleteId: data.athleteId,
    sportIds: data.sportIds,
    experienceLevel: data.experienceLevel,
    availability: data.availability,
    bio: data.bio.trim(),
    rating: 0,
    totalSessions: 0,
    registeredAt: Date.now(),
  };

  MENTOR_STORE.set(data.athleteId, profile);
  return { ...profile };
}

export function getMentor(athleteId: string): MentorProfile | undefined {
  const m = MENTOR_STORE.get(athleteId);
  return m ? { ...m } : undefined;
}

export function listMentors(filter?: {
  sportId?: string;
  minExperienceLevel?: number;
  availability?: MentorAvailability;
}): MentorProfile[] {
  return Array.from(MENTOR_STORE.values())
    .filter((m) => {
      if (filter?.sportId !== undefined && !m.sportIds.includes(filter.sportId)) return false;
      if (filter?.minExperienceLevel !== undefined && m.experienceLevel < filter.minExperienceLevel) return false;
      if (filter?.availability !== undefined && m.availability !== filter.availability) return false;
      return true;
    })
    .map((m) => ({ ...m }));
}

/**
 * Matches a mentee to the best available mentor for a given sport.
 *
 * Scoring criteria:
 *   - Mentor must mentor the requested sport
 *   - Mentor must be available
 *   - Mentor experience must be > mentee experience (positive gap)
 *   - Best match = smallest gap ≥ 1 (not too overwhelming), highest rating as tiebreaker
 *
 * matchScore (0–100):
 *   gap component (60): ideal gap = 2; score decays as gap grows (capped at 10)
 *   rating component (40): mentor.rating / 5 * 40
 */
export function matchMentor(input: MentorMatchInput): MentorMatch | null {
  if (!isNonEmptyString(input.menteeAthleteId)) return null;
  if (!isNonEmptyString(input.sportId)) return null;
  if (!isInRange(input.menteeExperienceLevel, 0, 10)) return null;

  const candidates = listMentors({ sportId: input.sportId, availability: 'available' })
    .filter((m) => m.athleteId !== input.menteeAthleteId && m.experienceLevel > input.menteeExperienceLevel);

  if (candidates.length === 0) return null;

  const IDEAL_GAP = 2;

  const scored = candidates.map((m) => {
    const gap = m.experienceLevel - input.menteeExperienceLevel;
    const gapDelta = Math.abs(gap - IDEAL_GAP);
    const gapScore = clamp(60 - gapDelta * 5, 0, 60);
    const ratingScore = clamp((m.rating / 5) * 40, 0, 40);
    return { mentor: m, gap, matchScore: round(gapScore + ratingScore, 2) };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);
  const best = scored[0];

  return {
    menteeAthleteId: input.menteeAthleteId,
    mentorAthleteId: best.mentor.athleteId,
    sportId: input.sportId,
    experienceGap: best.gap,
    matchScore: best.matchScore,
    matchedAt: Date.now(),
  };
}

export function submitMentorFeedback(feedback: Omit<MentorFeedback, 'submittedAt'>): MentorFeedback {
  if (!isNonEmptyString(feedback.mentorAthleteId)) throw new Error('mentorAthleteId is required');
  if (!isNonEmptyString(feedback.menteeAthleteId)) throw new Error('menteeAthleteId is required');
  if (feedback.mentorAthleteId === feedback.menteeAthleteId) throw new Error('mentor and mentee cannot be the same athlete');
  if (!isInRange(feedback.rating, 1, 5)) throw new Error('rating must be in [1, 5]');
  if (!MENTOR_STORE.has(feedback.mentorAthleteId)) throw new Error('mentor not found');

  const record: MentorFeedback = { ...feedback, submittedAt: Date.now() };

  const list = FEEDBACK_STORE.get(feedback.mentorAthleteId) ?? [];
  list.push(record);
  FEEDBACK_STORE.set(feedback.mentorAthleteId, list);
  recalcRating(feedback.mentorAthleteId);

  return { ...record };
}

export function _resetMentorStore(): void {
  MENTOR_STORE.clear();
  FEEDBACK_STORE.clear();
}
