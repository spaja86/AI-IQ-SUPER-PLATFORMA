// SpajaUltraOmegaCore -∞Ω+∞ — EXTRIMLI CUZ
// Kompanija SPAJA — Digitalna Industrija

import type { CommunityFeedPost, FeedPostType, FeedPostResult } from './types';
import { generateId, isNonEmptyString } from './utils';

const FEED_STORE: Map<string, CommunityFeedPost> = new Map();

// ─── Public API ───────────────────────────────────────────────────────────────

export function createPost(data: {
  athleteId: string;
  sportId: string;
  type: FeedPostType;
  content: string;
  sessionId?: string;
  eventId?: string;
  gearSku?: string;
}): FeedPostResult {
  if (!isNonEmptyString(data.athleteId)) {
    return { post: {} as CommunityFeedPost, valid: false, message: 'athleteId is required' };
  }
  if (!isNonEmptyString(data.sportId)) {
    return { post: {} as CommunityFeedPost, valid: false, message: 'sportId is required' };
  }
  if (!isNonEmptyString(data.content)) {
    return { post: {} as CommunityFeedPost, valid: false, message: 'content is required' };
  }
  if (!['session', 'gear-review', 'event-callout', 'general'].includes(data.type)) {
    return { post: {} as CommunityFeedPost, valid: false, message: 'invalid post type' };
  }

  const post: CommunityFeedPost = {
    id: generateId('post'),
    athleteId: data.athleteId,
    sportId: data.sportId,
    type: data.type,
    content: data.content.trim(),
    sessionId: data.sessionId,
    eventId: data.eventId,
    gearSku: data.gearSku,
    likes: [],
    flagged: false,
    createdAt: Date.now(),
  };

  FEED_STORE.set(post.id, post);
  return { post: { ...post }, valid: true, message: 'post created' };
}

export function getPost(id: string): CommunityFeedPost | undefined {
  const post = FEED_STORE.get(id);
  return post ? { ...post } : undefined;
}

export function listPosts(filter?: {
  athleteId?: string;
  sportId?: string;
  type?: FeedPostType;
  flagged?: boolean;
}): CommunityFeedPost[] {
  return Array.from(FEED_STORE.values())
    .filter((p) => {
      if (filter?.athleteId !== undefined && p.athleteId !== filter.athleteId) return false;
      if (filter?.sportId   !== undefined && p.sportId   !== filter.sportId)   return false;
      if (filter?.type      !== undefined && p.type      !== filter.type)      return false;
      if (filter?.flagged   !== undefined && p.flagged   !== filter.flagged)   return false;
      return true;
    })
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((p) => ({ ...p }));
}

export function likePost(postId: string, athleteId: string): CommunityFeedPost {
  const post = FEED_STORE.get(postId);
  if (!post) throw new Error(`post not found: ${postId}`);
  if (!isNonEmptyString(athleteId)) throw new Error('athleteId is required');
  if (!post.likes.includes(athleteId)) {
    post.likes.push(athleteId);
    FEED_STORE.set(postId, post);
  }
  return { ...post };
}

export function unlikePost(postId: string, athleteId: string): CommunityFeedPost {
  const post = FEED_STORE.get(postId);
  if (!post) throw new Error(`post not found: ${postId}`);
  post.likes = post.likes.filter((id) => id !== athleteId);
  FEED_STORE.set(postId, post);
  return { ...post };
}

export function flagPost(postId: string): CommunityFeedPost {
  const post = FEED_STORE.get(postId);
  if (!post) throw new Error(`post not found: ${postId}`);
  post.flagged = true;
  FEED_STORE.set(postId, post);
  return { ...post };
}

export function getFeedMetrics() {
  return { totalPosts: FEED_STORE.size };
}

export function _resetFeedStore(): void {
  FEED_STORE.clear();
}
