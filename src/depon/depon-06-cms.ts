/**
 * 📝 DEPON-06 — Content Management
 *
 * Multi-language, multi-state CMS for managing platform content,
 * state-specific regulations, and localized copy.
 *
 * Kompanija SPAJA — Digitalna Industrija
 */

import type { DeponId } from './depon-registry';

export const DEPON_ID: DeponId = 'DEPON-06';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ContentType =
  | 'page'
  | 'article'
  | 'regulation'
  | 'faq'
  | 'announcement'
  | 'legal'
  | 'email-template'
  | 'notification-template';

export type ContentStatus = 'draft' | 'review' | 'published' | 'archived' | 'deleted';

export type SupportedLocale =
  | 'en-US' | 'es-US' | 'zh-US' | 'fr-US' | 'de-US'
  | 'pt-US' | 'ko-US' | 'vi-US' | 'tl-US' | 'ar-US';

export type ContentEntry = {
  contentId: string;
  type: ContentType;
  slug: string;
  stateCode: string | null;
  locale: SupportedLocale;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
  status: ContentStatus;
  version: number;
  authorId: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ContentQuery = {
  type?: ContentType;
  stateCode?: string;
  locale?: SupportedLocale;
  status?: ContentStatus;
  slug?: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

export const DEFAULT_LOCALE: SupportedLocale = 'en-US';

export const SUPPORTED_LOCALES: SupportedLocale[] = [
  'en-US', 'es-US', 'zh-US', 'fr-US', 'de-US',
  'pt-US', 'ko-US', 'vi-US', 'tl-US', 'ar-US',
];

// ─── Service Functions ────────────────────────────────────────────────────────

export function buildContent(params: {
  type: ContentType;
  slug: string;
  title: string;
  body: string;
  authorId: string;
  stateCode?: string;
  locale?: SupportedLocale;
  metadata?: Record<string, unknown>;
}): ContentEntry {
  const now = new Date();
  return {
    contentId: `cnt_${params.type}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    type: params.type,
    slug: params.slug,
    stateCode: params.stateCode ?? null,
    locale: params.locale ?? DEFAULT_LOCALE,
    title: params.title,
    body: params.body,
    metadata: params.metadata ?? {},
    status: 'draft',
    version: 1,
    authorId: params.authorId,
    publishedAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

export function publishContent(entry: ContentEntry): ContentEntry {
  return {
    ...entry,
    status: 'published',
    publishedAt: new Date(),
    updatedAt: new Date(),
  };
}

export function matchesQuery(entry: ContentEntry, query: ContentQuery): boolean {
  if (query.type && entry.type !== query.type) return false;
  if (query.stateCode && entry.stateCode !== query.stateCode && entry.stateCode !== null) return false;
  if (query.locale && entry.locale !== query.locale) return false;
  if (query.status && entry.status !== query.status) return false;
  if (query.slug && entry.slug !== query.slug) return false;
  return true;
}

export function getHealthStatus(): { depon: string; status: 'ok'; version: string; locales: number } {
  return { depon: DEPON_ID, status: 'ok', version: '1.0.0', locales: SUPPORTED_LOCALES.length };
}
