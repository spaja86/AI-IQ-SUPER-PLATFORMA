// SpajaUltraOmegaCore -∞Ω+∞ — SPAJA Društvena Mreža Types
// Kompanija SPAJA — Digitalna Industrija

export const SPAJA_DRUSTVENA_MREZA_CONTRACT_VERSION = 'v1';
export const SPAJA_DRUSTVENA_MREZA_MODULE_VERSION = '1.0.0';
export const SPAJA_DRUSTVENA_MREZA_DISPLAY_NAME = 'SPAJA Društvena Mreža';
export const SPAJA_DRUSTVENA_MREZA_SLUG = 'spaja-drustvena-mreza';
export const SPAJA_DRUSTVENA_MREZA_PERSONA_ID = 'spaja-drustvena-mreza-core';
export const SPAJA_DRUSTVENA_MREZA_OCTAVE = 8;
export const SPAJA_DRUSTVENA_MREZA_HIPERMREZA_NODE = 67;
export const SPAJA_DRUSTVENA_MREZA_PERFORMANCE_MAX_MS = 50;
export const SPAJA_DRUSTVENA_MREZA_API_RESPONSE_MAX_MS = 200;
export const SPAJA_DRUSTVENA_MREZA_LINKED_REPO_IMPACT = 'none';
export const SPAJA_DRUSTVENA_MREZA_POST_RATE_LIMIT_PER_HOUR = 5;
export const SPAJA_DRUSTVENA_MREZA_DISCLAIMER =
  'SPAJA Društvena Mreža is a deterministic repo-local social-network surface and does not replace human moderation, legal review, or incident response.';

export type SocialAudience = 'internal' | 'partner' | 'public';
export type SocialVisibility = 'internal' | 'network' | 'public';
export type SocialProfileRole = 'employee' | 'partner-admin' | 'customer' | 'moderator';
export type SocialModerationStatus = 'active' | 'limited' | 'hidden';
export type SocialGroupJoinMode = 'open' | 'approval';
export type SocialNotificationType = 'profile' | 'post' | 'group' | 'message' | 'event' | 'moderation';
export type SocialReadinessStatus = 'GREEN' | 'YELLOW' | 'RED';
export type SocialIssueCode = 'BAD_REQUEST' | 'NOT_FOUND' | 'CONFLICT' | 'UNPROCESSABLE_ENTITY' | 'TOO_MANY_REQUESTS';

export interface SocialProfile {
  id: string;
  handle: string;
  displayName: string;
  audience: SocialAudience;
  role: SocialProfileRole;
  visibility: SocialVisibility;
  bio: string;
  interests: string[];
  verified: boolean;
  moderationStatus: SocialModerationStatus;
  createdAt: number;
}

export interface SocialFeedPost {
  id: string;
  authorId: string;
  audience: SocialAudience;
  visibility: SocialVisibility;
  content: string;
  tags: string[];
  reactions: string[];
  flaggedBy: string[];
  createdAt: number;
}

export interface SocialGroup {
  id: string;
  name: string;
  description: string;
  audience: SocialAudience;
  visibility: SocialVisibility;
  ownerId: string;
  topicTags: string[];
  joinMode: SocialGroupJoinMode;
  memberIds: string[];
  pendingMemberIds: string[];
  createdAt: number;
}

export interface SocialMessageEntry {
  id: string;
  authorId: string;
  content: string;
  createdAt: number;
}

export interface SocialConversation {
  id: string;
  participantIds: string[];
  audience: SocialAudience;
  visibility: SocialVisibility;
  subject: string;
  messages: SocialMessageEntry[];
  createdAt: number;
  updatedAt: number;
}

export interface SocialEvent {
  id: string;
  title: string;
  description: string;
  hostId: string;
  audience: SocialAudience;
  visibility: SocialVisibility;
  scheduledAt: number;
  capacity: number; // total attendee capacity, including the host
  attendeeIds: string[];
  waitlistIds: string[];
  createdAt: number;
}

export interface SocialNotification {
  id: string;
  recipientId: string;
  type: SocialNotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: number;
}

export interface SocialOperationResult<T> {
  ok: boolean;
  message: string;
  code?: SocialIssueCode;
  data?: T;
}

export interface SocialHealthReport {
  personaId: string;
  displayName: string;
  slug: string;
  contractVersion: string;
  moduleVersion: string;
  linkedRepoImpact: string;
  activeProfiles: number;
  feedPosts: number;
  groups: number;
  conversations: number;
  events: number;
  notifications: number;
  moderationAlerts: number;
  audienceSplit: Record<SocialAudience, number>;
  readinessStatus: SocialReadinessStatus;
  performanceMaxMs: number;
  apiResponseMaxMs: number;
}

export interface SocialOverview {
  displayName: string;
  slug: string;
  contractVersion: string;
  moduleVersion: string;
  apiRoutes: string[];
  scopeBoundaries: {
    inScope: string[];
    outOfScope: string[];
  };
  productScope: {
    internalUsers: string[];
    partners: string[];
    publicUsers: string[];
  };
  capabilities: string[];
  visibilityRules: string[];
  moderationRules: string[];
  kpis: Array<{ name: string; target: string }>;
  rolloutPhases: string[];
  rollbackPlan: string[];
  auditRequirements: string[];
  multiRepo: {
    linkedRepoImpact: string;
    note: string;
  };
  readinessStatus: SocialReadinessStatus;
}
