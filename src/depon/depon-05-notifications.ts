/**
 * 🔔 DEPON-05 — Notification Service
 *
 * Multi-channel notification delivery: Push, Email, SMS with
 * per-state opt-in rules and delivery tracking for 120M users.
 *
 * Kompanija SPAJA — Digitalna Industrija
 */

import type { DeponId } from './depon-registry';

export const DEPON_ID: DeponId = 'DEPON-05';

// ─── Types ───────────────────────────────────────────────────────────────────

export type NotificationChannel = 'push' | 'email' | 'sms' | 'in-app' | 'webhook';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'critical';

export type NotificationStatus =
  | 'queued'
  | 'sending'
  | 'delivered'
  | 'failed'
  | 'bounced'
  | 'unsubscribed';

export type Notification = {
  notificationId: string;
  userId: string;
  stateCode: string;
  channel: NotificationChannel;
  priority: NotificationPriority;
  subject: string;
  body: string;
  templateId: string | null;
  templateVars: Record<string, string>;
  status: NotificationStatus;
  scheduledAt: Date | null;
  sentAt: Date | null;
  deliveredAt: Date | null;
  createdAt: Date;
};

export type UserNotificationPrefs = {
  userId: string;
  stateCode: string;
  channels: Partial<Record<NotificationChannel, boolean>>;
  doNotDisturb: { enabled: boolean; startHour: number; endHour: number };
  timezone: string;
};

// ─── State CAN-SPAM / TCPA rules ─────────────────────────────────────────────

export const STATE_OPT_IN_REQUIRED: Record<string, NotificationChannel[]> = {
  CA: ['sms', 'push'],
  NY: ['sms'],
  FL: ['sms'],
  TX: ['sms'],
};

// ─── Service Functions ────────────────────────────────────────────────────────

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
  return {
    notificationId: `notif_${params.stateCode}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    userId: params.userId,
    stateCode: params.stateCode,
    channel: params.channel,
    priority: params.priority ?? 'normal',
    subject: params.subject,
    body: params.body,
    templateId: params.templateId ?? null,
    templateVars: params.templateVars ?? {},
    status: 'queued',
    scheduledAt: params.scheduledAt ?? null,
    sentAt: null,
    deliveredAt: null,
    createdAt: new Date(),
  };
}

export function isChannelAllowed(
  channel: NotificationChannel,
  stateCode: string,
  prefs: UserNotificationPrefs,
): boolean {
  if (prefs.channels[channel] === false) return false;
  const optInRequired = STATE_OPT_IN_REQUIRED[stateCode.toUpperCase()] ?? [];
  if (optInRequired.includes(channel) && prefs.channels[channel] !== true) return false;
  return true;
}

export function buildDefaultPrefs(params: {
  userId: string;
  stateCode: string;
  timezone?: string;
}): UserNotificationPrefs {
  return {
    userId: params.userId,
    stateCode: params.stateCode,
    channels: { email: true, 'in-app': true, push: false, sms: false },
    doNotDisturb: { enabled: true, startHour: 22, endHour: 8 },
    timezone: params.timezone ?? 'America/New_York',
  };
}

export function getHealthStatus(): { depon: string; status: 'ok'; version: string } {
  return { depon: DEPON_ID, status: 'ok', version: '1.0.0' };
}
