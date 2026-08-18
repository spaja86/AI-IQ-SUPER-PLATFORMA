/**
 * 🔔 DEPON-05 — Notification Service
 *
 * Source of truth moved to src/lib/notifications/.
 * DEPON-05 now acts as the compatibility facade for legacy imports.
 */

import type { DeponId } from './depon-registry';
import {
  STATE_OPT_IN_REQUIRED,
  buildDefaultNotificationPrefs,
  buildNotification as buildDomainNotification,
  isChannelAllowed,
  type Notification,
  type NotificationChannel,
  type NotificationPriority,
  type NotificationStatus,
  type UserNotificationPrefs,
} from '@/lib/notifications';

export const DEPON_ID: DeponId = 'DEPON-05';

export type {
  Notification,
  NotificationChannel,
  NotificationPriority,
  NotificationStatus,
  UserNotificationPrefs,
};

export { STATE_OPT_IN_REQUIRED, isChannelAllowed };

export function buildNotification(params: {
  userId: string;
  stateCode: string;
  channel: NotificationChannel;
  subject: string;
  body: string;
  priority?: NotificationPriority;
  templateId?: string;
  templateVars?: Record<string, string>;
  scheduledAt?: Date;
}): Notification {
  return buildDomainNotification(params);
}

export function buildDefaultPrefs(params: {
  userId: string;
  stateCode: string;
  timezone?: string;
}): UserNotificationPrefs {
  return buildDefaultNotificationPrefs(params);
}

export function getHealthStatus(): { depon: string; status: 'ok'; version: string } {
  return { depon: DEPON_ID, status: 'ok', version: '2.0.0' };
}
