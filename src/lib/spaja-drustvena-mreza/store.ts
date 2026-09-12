// SpajaUltraOmegaCore -∞Ω+∞ — SPAJA Društvena Mreža Store
// Kompanija SPAJA — Digitalna Industrija

import type {
  SocialAudience,
  SocialConversation,
  SocialEvent,
  SocialFeedPost,
  SocialGroup,
  SocialHealthReport,
  SocialNotification,
  SocialNotificationType,
  SocialOperationResult,
  SocialOverview,
  SocialProfile,
  SocialReadinessStatus,
  SocialVisibility,
} from './types';
import {
  SPAJA_DRUSTVENA_MREZA_API_RESPONSE_MAX_MS,
  SPAJA_DRUSTVENA_MREZA_CONTRACT_VERSION,
  SPAJA_DRUSTVENA_MREZA_DISPLAY_NAME,
  SPAJA_DRUSTVENA_MREZA_LINKED_REPO_IMPACT,
  SPAJA_DRUSTVENA_MREZA_MODULE_VERSION,
  SPAJA_DRUSTVENA_MREZA_PERFORMANCE_MAX_MS,
  SPAJA_DRUSTVENA_MREZA_PERSONA_ID,
  SPAJA_DRUSTVENA_MREZA_POST_RATE_LIMIT_PER_HOUR,
  SPAJA_DRUSTVENA_MREZA_SLUG,
} from './types';

const PROFILE_STORE = new Map<string, SocialProfile>();
const POST_STORE = new Map<string, SocialFeedPost>();
const GROUP_STORE = new Map<string, SocialGroup>();
const CONVERSATION_STORE = new Map<string, SocialConversation>();
const EVENT_STORE = new Map<string, SocialEvent>();
const NOTIFICATION_STORE = new Map<string, SocialNotification>();

const ONE_HOUR_MS = 60 * 60 * 1000;
const SEED_NOW = Date.UTC(2026, 8, 1, 8, 0, 0);
let idCounter = 0;

function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter.toString().padStart(4, '0')}`;
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizeHandle(handle: string): string {
  return handle.trim().toLowerCase();
}

function normalizeTags(tags: string[] | undefined): string[] {
  if (!Array.isArray(tags)) return [];
  return Array.from(
    new Set(
      tags
        .filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0)
        .map((tag) => tag.trim().toLowerCase()),
    ),
  );
}

function forwardFailure<T>(result: SocialOperationResult<unknown>): SocialOperationResult<T> {
  return {
    ok: false,
    code: result.code,
    message: result.message,
  };
}

function countByAudience(): Record<SocialAudience, number> {
  const result: Record<SocialAudience, number> = { internal: 0, partner: 0, public: 0 };
  for (const profile of PROFILE_STORE.values()) {
    result[profile.audience] += 1;
  }
  return result;
}

function getReadinessStatus(): SocialReadinessStatus {
  const moderationAlerts = Array.from(POST_STORE.values()).filter((post) => post.flaggedBy.length > 0).length
    + Array.from(PROFILE_STORE.values()).filter((profile) => profile.moderationStatus !== 'active').length;
  const pendingMemberships = Array.from(GROUP_STORE.values()).reduce((sum, group) => sum + group.pendingMemberIds.length, 0);

  if (moderationAlerts > 2) return 'RED';
  if (pendingMemberships > 4 || PROFILE_STORE.size < 3) return 'YELLOW';
  return 'GREEN';
}

function pushNotification(recipientId: string, type: SocialNotificationType, title: string, body: string, createdAt = Date.now()): void {
  if (!PROFILE_STORE.has(recipientId)) return;
  const notification: SocialNotification = {
    id: nextId('notif'),
    recipientId,
    type,
    title,
    body,
    read: false,
    createdAt,
  };
  NOTIFICATION_STORE.set(notification.id, notification);
}

function seedState(): void {
  if (PROFILE_STORE.size > 0) return;

  const profiles: SocialProfile[] = [
    {
      id: 'profile-internal-core',
      handle: 'spaja.core',
      displayName: 'SPAJA Core Ops',
      audience: 'internal',
      role: 'moderator',
      visibility: 'network',
      bio: 'Interni operativni nalog za moderaciju i koordinaciju platforme.',
      interests: ['ops', 'moderation', 'nova-generacija'],
      verified: true,
      moderationStatus: 'active',
      createdAt: SEED_NOW,
    },
    {
      id: 'profile-partner-ioopenui',
      handle: 'ioopenui.partner',
      displayName: 'IO OPENUI AO Partner',
      audience: 'partner',
      role: 'partner-admin',
      visibility: 'network',
      bio: 'Partnerski nalog za koordinaciju zajedničkih programa i događaja.',
      interests: ['gaming', 'partnership', 'launches'],
      verified: true,
      moderationStatus: 'active',
      createdAt: SEED_NOW + 1_000,
    },
    {
      id: 'profile-public-builder',
      handle: 'spaja.builder',
      displayName: 'SPAJA Builder Community',
      audience: 'public',
      role: 'customer',
      visibility: 'public',
      bio: 'Javni community nalog za buildere, korisnike i promotere platforme.',
      interests: ['community', 'events', 'feedback'],
      verified: false,
      moderationStatus: 'active',
      createdAt: SEED_NOW + 2_000,
    },
  ];

  for (const profile of profiles) PROFILE_STORE.set(profile.id, clone(profile));

  const post: SocialFeedPost = {
    id: 'post-seed-0001',
    authorId: 'profile-internal-core',
    audience: 'internal',
    visibility: 'network',
    content: 'Dobrodošli u SPAJA Društvenu Mrežu — koordinacija internih, partnerskih i javnih tokova počinje ovde.',
    tags: ['launch', 'community'],
    reactions: ['profile-partner-ioopenui'],
    flaggedBy: [],
    createdAt: SEED_NOW + 5_000,
  };
  POST_STORE.set(post.id, clone(post));

  const group: SocialGroup = {
    id: 'group-seed-0001',
    name: 'Nova Generacija Community',
    description: 'Radna zajednica za launch, feedback i governance koordinaciju.',
    audience: 'partner',
    visibility: 'network',
    ownerId: 'profile-internal-core',
    topicTags: ['nova-generacija', 'community', 'launch'],
    joinMode: 'approval',
    memberIds: ['profile-internal-core', 'profile-partner-ioopenui'],
    pendingMemberIds: [],
    createdAt: SEED_NOW + 8_000,
  };
  GROUP_STORE.set(group.id, clone(group));

  const conversation: SocialConversation = {
    id: 'thread-seed-0001',
    participantIds: ['profile-internal-core', 'profile-partner-ioopenui'],
    audience: 'partner',
    visibility: 'network',
    subject: 'Launch koordinacija',
    messages: [
      {
        id: 'msg-seed-0001',
        authorId: 'profile-internal-core',
        content: 'Potvrdite readiness za zajednički community launch.',
        createdAt: SEED_NOW + 10_000,
      },
    ],
    createdAt: SEED_NOW + 10_000,
    updatedAt: SEED_NOW + 10_000,
  };
  CONVERSATION_STORE.set(conversation.id, clone(conversation));

  const event: SocialEvent = {
    id: 'event-seed-0001',
    title: 'SPAJA Social kickoff',
    description: 'Repo-local kickoff događaj za profile, feed i grupne tokove.',
    hostId: 'profile-internal-core',
    audience: 'public',
    visibility: 'public',
    scheduledAt: Date.UTC(2026, 9, 1, 12, 0, 0),
    capacity: 3,
    attendeeIds: ['profile-internal-core', 'profile-partner-ioopenui'],
    waitlistIds: [],
    createdAt: SEED_NOW + 12_000,
  };
  EVENT_STORE.set(event.id, clone(event));

  pushNotification(
    'profile-partner-ioopenui',
    'message',
    'Nova poruka',
    'Otvoren je thread za launch koordinaciju.',
    SEED_NOW + 15_000,
  );
  pushNotification(
    'profile-public-builder',
    'event',
    'Kickoff događaj',
    'Otvoren je javni kickoff događaj za SPAJA Social.',
    SEED_NOW + 16_000,
  );
}

function requireProfile(profileId: string): SocialOperationResult<SocialProfile> {
  seedState();
  const profile = PROFILE_STORE.get(profileId);
  if (!profile) {
    return { ok: false, code: 'NOT_FOUND', message: `profile not found: ${profileId}` };
  }
  return { ok: true, message: 'ok', data: clone(profile) };
}

export function listProfiles(filter?: { audience?: SocialAudience; visibility?: SocialVisibility }): SocialProfile[] {
  seedState();
  return Array.from(PROFILE_STORE.values())
    .filter((profile) => {
      if (filter?.audience && profile.audience !== filter.audience) return false;
      if (filter?.visibility && profile.visibility !== filter.visibility) return false;
      return true;
    })
    .map((profile) => clone(profile));
}

export function createProfile(input: {
  handle: string;
  displayName: string;
  audience: SocialAudience;
  role: SocialProfile['role'];
  visibility: SocialVisibility;
  bio: string;
  interests?: string[];
  verified?: boolean;
}): SocialOperationResult<SocialProfile> {
  seedState();
  if (!/^[a-z0-9._-]{3,32}$/i.test(input.handle.trim())) {
    return { ok: false, code: 'UNPROCESSABLE_ENTITY', message: 'handle must match [a-z0-9._-] and be 3..32 chars' };
  }
  const normalizedHandle = normalizeHandle(input.handle);
  if (Array.from(PROFILE_STORE.values()).some((profile) => normalizeHandle(profile.handle) === normalizedHandle)) {
    return { ok: false, code: 'CONFLICT', message: 'handle already exists' };
  }

  const profile: SocialProfile = {
    id: nextId('profile'),
    handle: normalizedHandle,
    displayName: input.displayName.trim(),
    audience: input.audience,
    role: input.role,
    visibility: input.visibility,
    bio: input.bio.trim(),
    interests: normalizeTags(input.interests),
    verified: Boolean(input.verified),
    moderationStatus: 'active',
    createdAt: Date.now(),
  };
  PROFILE_STORE.set(profile.id, clone(profile));
  pushNotification(profile.id, 'profile', 'Profil aktiviran', `Profil ${profile.handle} je uspešno registrovan.`);
  return { ok: true, message: 'profile created', data: clone(profile) };
}

export function listPosts(filter?: { audience?: SocialAudience; authorId?: string; visibility?: SocialVisibility }): SocialFeedPost[] {
  seedState();
  return Array.from(POST_STORE.values())
    .filter((post) => {
      if (filter?.audience && post.audience !== filter.audience) return false;
      if (filter?.authorId && post.authorId !== filter.authorId) return false;
      if (filter?.visibility && post.visibility !== filter.visibility) return false;
      return true;
    })
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((post) => clone(post));
}

export function createPost(input: {
  authorId: string;
  audience: SocialAudience;
  visibility: SocialVisibility;
  content: string;
  tags?: string[];
}): SocialOperationResult<SocialFeedPost> {
  seedState();
  const author = requireProfile(input.authorId);
  if (!author.ok) return forwardFailure<SocialFeedPost>(author);
  if (!isNonEmptyString(input.content)) {
    return { ok: false, code: 'UNPROCESSABLE_ENTITY', message: 'content is required' };
  }

  const normalizedContent = input.content.trim();
  const authorPosts = Array.from(POST_STORE.values()).filter((post) => post.authorId === input.authorId);
  const recentCount = authorPosts.filter((post) => post.createdAt >= Date.now() - ONE_HOUR_MS).length;
  if (recentCount >= SPAJA_DRUSTVENA_MREZA_POST_RATE_LIMIT_PER_HOUR) {
    return { ok: false, code: 'TOO_MANY_REQUESTS', message: 'post rate limit exceeded for this author' };
  }
  if (authorPosts.some((post) => post.content === normalizedContent)) {
    return { ok: false, code: 'CONFLICT', message: 'duplicate post content for this author' };
  }

  const post: SocialFeedPost = {
    id: nextId('post'),
    authorId: input.authorId,
    audience: input.audience,
    visibility: input.visibility,
    content: normalizedContent,
    tags: normalizeTags(input.tags),
    reactions: [],
    flaggedBy: [],
    createdAt: Date.now(),
  };
  POST_STORE.set(post.id, clone(post));

  for (const profile of PROFILE_STORE.values()) {
    if (profile.id !== input.authorId && (profile.audience === input.audience || input.audience === 'public')) {
      pushNotification(profile.id, 'post', 'Nova objava', `Nova objava od ${author.data?.displayName ?? input.authorId}`);
    }
  }

  return { ok: true, message: 'post created', data: clone(post) };
}

export function reactToPost(postId: string, actorId: string): SocialOperationResult<SocialFeedPost> {
  seedState();
  const post = POST_STORE.get(postId);
  if (!post) return { ok: false, code: 'NOT_FOUND', message: `post not found: ${postId}` };
  const actor = requireProfile(actorId);
  if (!actor.ok) return forwardFailure<SocialFeedPost>(actor);
  if (post.authorId === actorId) {
    return { ok: false, code: 'CONFLICT', message: 'self-reaction is not allowed' };
  }
  if (post.reactions.includes(actorId)) {
    return { ok: false, code: 'CONFLICT', message: 'duplicate reaction is not allowed' };
  }
  post.reactions.push(actorId);
  POST_STORE.set(post.id, clone(post));
  pushNotification(post.authorId, 'post', 'Nova reakcija', `${actor.data?.displayName ?? actorId} je reagovao/la na objavu.`);
  return { ok: true, message: 'reaction recorded', data: clone(post) };
}

export function flagPost(postId: string, actorId: string): SocialOperationResult<SocialFeedPost> {
  seedState();
  const post = POST_STORE.get(postId);
  if (!post) return { ok: false, code: 'NOT_FOUND', message: `post not found: ${postId}` };
  const actor = requireProfile(actorId);
  if (!actor.ok) return forwardFailure<SocialFeedPost>(actor);
  if (post.flaggedBy.includes(actorId)) {
    return { ok: false, code: 'CONFLICT', message: 'duplicate flag is not allowed' };
  }
  post.flaggedBy.push(actorId);
  POST_STORE.set(post.id, clone(post));
  pushNotification('profile-internal-core', 'moderation', 'Flagged post', `Objava ${post.id} je prijavljena za moderaciju.`);
  return { ok: true, message: 'post flagged', data: clone(post) };
}

export function listGroups(filter?: { audience?: SocialAudience; visibility?: SocialVisibility }): SocialGroup[] {
  seedState();
  return Array.from(GROUP_STORE.values())
    .filter((group) => {
      if (filter?.audience && group.audience !== filter.audience) return false;
      if (filter?.visibility && group.visibility !== filter.visibility) return false;
      return true;
    })
    .map((group) => clone(group));
}

export function createGroup(input: {
  name: string;
  description: string;
  audience: SocialAudience;
  visibility: SocialVisibility;
  ownerId: string;
  topicTags?: string[];
  joinMode?: SocialGroup['joinMode'];
}): SocialOperationResult<SocialGroup> {
  seedState();
  const owner = requireProfile(input.ownerId);
  if (!owner.ok) return forwardFailure<SocialGroup>(owner);
  if (!isNonEmptyString(input.name) || !isNonEmptyString(input.description)) {
    return { ok: false, code: 'UNPROCESSABLE_ENTITY', message: 'name and description are required' };
  }
  if (Array.from(GROUP_STORE.values()).some((group) => group.ownerId === input.ownerId && group.name === input.name.trim())) {
    return { ok: false, code: 'CONFLICT', message: 'group with this name already exists for owner' };
  }
  const group: SocialGroup = {
    id: nextId('group'),
    name: input.name.trim(),
    description: input.description.trim(),
    audience: input.audience,
    visibility: input.visibility,
    ownerId: input.ownerId,
    topicTags: normalizeTags(input.topicTags),
    joinMode: input.joinMode ?? 'open',
    memberIds: [input.ownerId],
    pendingMemberIds: [],
    createdAt: Date.now(),
  };
  GROUP_STORE.set(group.id, clone(group));
  pushNotification(input.ownerId, 'group', 'Grupa kreirana', `Grupa ${group.name} je spremna za članove.`);
  return { ok: true, message: 'group created', data: clone(group) };
}

export function joinGroup(groupId: string, profileId: string): SocialOperationResult<SocialGroup> {
  seedState();
  const group = GROUP_STORE.get(groupId);
  if (!group) return { ok: false, code: 'NOT_FOUND', message: `group not found: ${groupId}` };
  const profile = requireProfile(profileId);
  if (!profile.ok) return forwardFailure<SocialGroup>(profile);
  if (group.memberIds.includes(profileId)) {
    return { ok: false, code: 'CONFLICT', message: 'profile is already a group member' };
  }
  if (group.pendingMemberIds.includes(profileId)) {
    return { ok: false, code: 'CONFLICT', message: 'join request is already pending' };
  }
  if (group.joinMode === 'approval') {
    group.pendingMemberIds.push(profileId);
    GROUP_STORE.set(group.id, clone(group));
    pushNotification(group.ownerId, 'group', 'Novi zahtev za grupu', `${profile.data?.displayName ?? profileId} čeka odobrenje za grupu ${group.name}.`);
    return { ok: true, message: 'join request submitted', data: clone(group) };
  }
  group.memberIds.push(profileId);
  GROUP_STORE.set(group.id, clone(group));
  pushNotification(group.ownerId, 'group', 'Novi član grupe', `${profile.data?.displayName ?? profileId} je pristupio/la grupi ${group.name}.`);
  return { ok: true, message: 'joined group', data: clone(group) };
}

export function listConversations(filter?: { participantId?: string; audience?: SocialAudience }): SocialConversation[] {
  seedState();
  return Array.from(CONVERSATION_STORE.values())
    .filter((thread) => {
      if (filter?.participantId && !thread.participantIds.includes(filter.participantId)) return false;
      if (filter?.audience && thread.audience !== filter.audience) return false;
      return true;
    })
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map((thread) => clone(thread));
}

export function createConversation(input: {
  participantIds: string[];
  audience: SocialAudience;
  visibility: SocialVisibility;
  subject: string;
  content: string;
  authorId: string;
}): SocialOperationResult<SocialConversation> {
  seedState();
  const uniqueParticipants = Array.from(new Set(input.participantIds));
  if (uniqueParticipants.length < 2) {
    return { ok: false, code: 'UNPROCESSABLE_ENTITY', message: 'at least 2 unique participants are required' };
  }
  for (const participantId of uniqueParticipants) {
    const participant = requireProfile(participantId);
    if (!participant.ok) return forwardFailure<SocialConversation>(participant);
  }
  if (!uniqueParticipants.includes(input.authorId)) {
    return { ok: false, code: 'UNPROCESSABLE_ENTITY', message: 'authorId must be one of participantIds' };
  }
  if (!isNonEmptyString(input.subject) || !isNonEmptyString(input.content)) {
    return { ok: false, code: 'UNPROCESSABLE_ENTITY', message: 'subject and content are required' };
  }

  const fingerprint = uniqueParticipants.slice().sort().join('|');
  if (Array.from(CONVERSATION_STORE.values()).some((thread) => thread.subject === input.subject.trim() && thread.participantIds.slice().sort().join('|') === fingerprint)) {
    return { ok: false, code: 'CONFLICT', message: 'duplicate conversation already exists' };
  }

  const now = Date.now();
  const thread: SocialConversation = {
    id: nextId('thread'),
    participantIds: uniqueParticipants,
    audience: input.audience,
    visibility: input.visibility,
    subject: input.subject.trim(),
    messages: [
      {
        id: nextId('msg'),
        authorId: input.authorId,
        content: input.content.trim(),
        createdAt: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
  CONVERSATION_STORE.set(thread.id, clone(thread));
  for (const participantId of uniqueParticipants) {
    if (participantId !== input.authorId) {
      pushNotification(participantId, 'message', 'Nova konverzacija', `Pokrenut je thread: ${thread.subject}`);
    }
  }
  return { ok: true, message: 'conversation created', data: clone(thread) };
}

export function appendMessage(threadId: string, authorId: string, content: string): SocialOperationResult<SocialConversation> {
  seedState();
  const thread = CONVERSATION_STORE.get(threadId);
  if (!thread) return { ok: false, code: 'NOT_FOUND', message: `conversation not found: ${threadId}` };
  if (!thread.participantIds.includes(authorId)) {
    return { ok: false, code: 'CONFLICT', message: 'author is not a participant in this conversation' };
  }
  if (!isNonEmptyString(content)) {
    return { ok: false, code: 'UNPROCESSABLE_ENTITY', message: 'content is required' };
  }
  const now = Date.now();
  thread.messages.push({
    id: nextId('msg'),
    authorId,
    content: content.trim(),
    createdAt: now,
  });
  thread.updatedAt = now;
  CONVERSATION_STORE.set(thread.id, clone(thread));
  for (const participantId of thread.participantIds) {
    if (participantId !== authorId) {
      pushNotification(participantId, 'message', 'Nova poruka', `Nova poruka u thread-u "${thread.subject}".`);
    }
  }
  return { ok: true, message: 'message appended', data: clone(thread) };
}

export function listEvents(filter?: { audience?: SocialAudience; visibility?: SocialVisibility }): SocialEvent[] {
  seedState();
  return Array.from(EVENT_STORE.values())
    .filter((event) => {
      if (filter?.audience && event.audience !== filter.audience) return false;
      if (filter?.visibility && event.visibility !== filter.visibility) return false;
      return true;
    })
    .sort((a, b) => a.scheduledAt - b.scheduledAt)
    .map((event) => clone(event));
}

export function createEvent(input: {
  title: string;
  description: string;
  hostId: string;
  audience: SocialAudience;
  visibility: SocialVisibility;
  scheduledAt: number;
  capacity: number;
}): SocialOperationResult<SocialEvent> {
  seedState();
  const host = requireProfile(input.hostId);
  if (!host.ok) return forwardFailure<SocialEvent>(host);
  if (!isNonEmptyString(input.title) || !isNonEmptyString(input.description)) {
    return { ok: false, code: 'UNPROCESSABLE_ENTITY', message: 'title and description are required' };
  }
  if (!Number.isFinite(input.scheduledAt) || input.scheduledAt <= Date.now()) {
    return { ok: false, code: 'UNPROCESSABLE_ENTITY', message: 'scheduledAt must be a future Unix timestamp in milliseconds' };
  }
  if (!Number.isInteger(input.capacity) || input.capacity < 2 || input.capacity > 500) {
    return { ok: false, code: 'UNPROCESSABLE_ENTITY', message: 'capacity must be an integer in [2, 500]' };
  }

  const event: SocialEvent = {
    id: nextId('event'),
    title: input.title.trim(),
    description: input.description.trim(),
    hostId: input.hostId,
    audience: input.audience,
    visibility: input.visibility,
    scheduledAt: input.scheduledAt,
    capacity: input.capacity,
    attendeeIds: [input.hostId],
    waitlistIds: [],
    createdAt: Date.now(),
  };
  EVENT_STORE.set(event.id, clone(event));
  pushNotification(input.hostId, 'event', 'Događaj kreiran', `Događaj ${event.title} je aktivan.`);
  return { ok: true, message: 'event created', data: clone(event) };
}

export function rsvpEvent(eventId: string, profileId: string): SocialOperationResult<SocialEvent> {
  seedState();
  const event = EVENT_STORE.get(eventId);
  if (!event) return { ok: false, code: 'NOT_FOUND', message: `event not found: ${eventId}` };
  const profile = requireProfile(profileId);
  if (!profile.ok) return forwardFailure<SocialEvent>(profile);
  if (event.attendeeIds.includes(profileId) || event.waitlistIds.includes(profileId)) {
    return { ok: false, code: 'CONFLICT', message: 'profile already registered for this event' };
  }

  if (event.attendeeIds.length < event.capacity) {
    event.attendeeIds.push(profileId);
    EVENT_STORE.set(event.id, clone(event));
    pushNotification(event.hostId, 'event', 'Nova RSVP potvrda', `${profile.data?.displayName ?? profileId} dolazi na ${event.title}.`);
    return { ok: true, message: 'attending', data: clone(event) };
  }

  event.waitlistIds.push(profileId);
  EVENT_STORE.set(event.id, clone(event));
  pushNotification(event.hostId, 'event', 'Nova waitlist prijava', `${profile.data?.displayName ?? profileId} je na waitlist-i za ${event.title}.`);
  return { ok: true, message: 'waitlisted', data: clone(event) };
}

export function listNotifications(filter?: { recipientId?: string; unreadOnly?: boolean }): SocialNotification[] {
  seedState();
  return Array.from(NOTIFICATION_STORE.values())
    .filter((notification) => {
      if (filter?.recipientId && notification.recipientId !== filter.recipientId) return false;
      if (filter?.unreadOnly && notification.read) return false;
      return true;
    })
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((notification) => clone(notification));
}

export function markNotificationRead(notificationId: string, recipientId: string): SocialOperationResult<SocialNotification> {
  seedState();
  const notification = NOTIFICATION_STORE.get(notificationId);
  if (!notification) return { ok: false, code: 'NOT_FOUND', message: `notification not found: ${notificationId}` };
  if (notification.recipientId !== recipientId) {
    return { ok: false, code: 'CONFLICT', message: 'notification does not belong to recipient' };
  }
  notification.read = true;
  NOTIFICATION_STORE.set(notification.id, clone(notification));
  return { ok: true, message: 'notification marked as read', data: clone(notification) };
}

export function getSpajaDrustvenaMrezaHealthReport(): SocialHealthReport {
  seedState();
  return {
    personaId: SPAJA_DRUSTVENA_MREZA_PERSONA_ID,
    displayName: SPAJA_DRUSTVENA_MREZA_DISPLAY_NAME,
    slug: SPAJA_DRUSTVENA_MREZA_SLUG,
    contractVersion: SPAJA_DRUSTVENA_MREZA_CONTRACT_VERSION,
    moduleVersion: SPAJA_DRUSTVENA_MREZA_MODULE_VERSION,
    linkedRepoImpact: SPAJA_DRUSTVENA_MREZA_LINKED_REPO_IMPACT,
    activeProfiles: PROFILE_STORE.size,
    feedPosts: POST_STORE.size,
    groups: GROUP_STORE.size,
    conversations: CONVERSATION_STORE.size,
    events: EVENT_STORE.size,
    notifications: NOTIFICATION_STORE.size,
    moderationAlerts: Array.from(POST_STORE.values()).reduce((sum, post) => sum + post.flaggedBy.length, 0),
    audienceSplit: countByAudience(),
    readinessStatus: getReadinessStatus(),
    performanceMaxMs: SPAJA_DRUSTVENA_MREZA_PERFORMANCE_MAX_MS,
    apiResponseMaxMs: SPAJA_DRUSTVENA_MREZA_API_RESPONSE_MAX_MS,
  };
}

export function getSpajaDrustvenaMrezaPregled(): SocialOverview {
  seedState();
  return {
    displayName: SPAJA_DRUSTVENA_MREZA_DISPLAY_NAME,
    slug: SPAJA_DRUSTVENA_MREZA_SLUG,
    contractVersion: SPAJA_DRUSTVENA_MREZA_CONTRACT_VERSION,
    moduleVersion: SPAJA_DRUSTVENA_MREZA_MODULE_VERSION,
    productScope: {
      internalUsers: ['operativa', 'moderacija', 'produkt timovi'],
      partners: ['linked-repo partneri', 'B2B saradnici', 'kampanje i launch koordinatori'],
      publicUsers: ['community korisnici', 'buildersi', 'beta promotori'],
    },
    capabilities: [
      'repo-local profili i audience zone',
      'deterministički feed i reakcije',
      'grupe/zajednice sa open ili approval join modelom',
      'poruke i konverzacije bez eksternih zavisnosti',
      'događaji, RSVP i waitlist pravila',
      'notifikacioni readiness i health agregat',
    ],
    visibilityRules: [
      'internal sadržaj ostaje za interne tokove',
      'network vidljivost obuhvata interne i partnerske aktere',
      'public sadržaj je otvoren za javni community sloj',
    ],
    moderationRules: [
      'self-reaction nije dozvoljen',
      'duplikat objava i duplikat reakcija se odbijaju',
      `jedan autor može kreirati najviše ${SPAJA_DRUSTVENA_MREZA_POST_RATE_LIMIT_PER_HOUR} objava po satu`,
      'flagged sadržaj generiše moderacione notifikacije',
    ],
    kpis: [
      { name: 'Engine evaluation', target: '≤ 50ms' },
      { name: 'API response', target: '≤ 200ms' },
      { name: 'Audience split coverage', target: 'internal + partner + public' },
      { name: 'Linked repo impact', target: 'none for v1' },
    ],
    rolloutPhases: [
      'Faza 1: docs + page + health/pregled',
      'Faza 2: profiles + feed',
      'Faza 3: groups + events',
      'Faza 4: messages + notifications',
      'Faza 5: validator + governance + optional cross-repo sync',
    ],
    rollbackPlan: [
      'zadržati v1 repo-local bez eksternih zavisnosti',
      'isključiti rutu iz navigacije ako quality gate padne',
      'vratiti se na health/pregled-only surface ako community tokovi degradiraju',
    ],
    auditRequirements: [
      'human-review za config/workflow promene',
      'validator workflow mora proći lint, typecheck, tests i security scan',
      'multi-repo doc mora eksplicitno navesti da za v1 nema obavezne downstream promene',
    ],
    multiRepo: {
      linkedRepoImpact: SPAJA_DRUSTVENA_MREZA_LINKED_REPO_IMPACT,
      note: 'No linked repo change required for SPAJA Društvena Mreža v1; follow-up only if IO-OPENUI-AO adopts runtime consumers.',
    },
    readinessStatus: getReadinessStatus(),
  };
}

export function _resetSpajaDrustvenaMrezaState(): void {
  PROFILE_STORE.clear();
  POST_STORE.clear();
  GROUP_STORE.clear();
  CONVERSATION_STORE.clear();
  EVENT_STORE.clear();
  NOTIFICATION_STORE.clear();
  idCounter = 0;
  seedState();
}
