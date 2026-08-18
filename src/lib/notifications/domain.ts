export const NOTIFICATION_CHANNELS = ['email', 'sms', 'push', 'in-app', 'webhook'] as const;
export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number];

export const NOTIFICATION_PRIORITIES = ['low', 'normal', 'high', 'critical'] as const;
export type NotificationPriority = (typeof NOTIFICATION_PRIORITIES)[number];

export const NOTIFICATION_STATUSES = ['queued', 'sending', 'delivered', 'partial', 'failed', 'bounced', 'unsubscribed', 'skipped'] as const;
export type NotificationStatus = (typeof NOTIFICATION_STATUSES)[number];

export const NOTIFICATION_CATEGORIES = ['billing', 'system', 'alert'] as const;
export type NotificationCategory = (typeof NOTIFICATION_CATEGORIES)[number];

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

export type NotificationTemplateDefinition = {
  id: string;
  action: string;
  category: NotificationCategory;
  version: string;
  description: string;
  subject: string;
  body: string;
  variables: string[];
  defaultChannels: NotificationChannel[];
  priority: NotificationPriority;
};

export type NotificationAlertRule = {
  id: string;
  naziv: string;
  category: NotificationCategory;
  severity: NotificationPriority;
  metric: string;
  threshold: string;
  channels: NotificationChannel[];
  escalation: boolean;
};

export type NotificationInventoryEntry = {
  id: string;
  producer: string;
  category: NotificationCategory;
  description: string;
  sourceFiles: string[];
  routes: string[];
  channels: NotificationChannel[];
  persistence: string;
  sourceOfTruth: string;
};

export type NotificationArchitectureLayer = {
  id: 'domain' | 'orchestration' | 'producers' | 'persistence' | 'read-model';
  naziv: string;
  purpose: string;
  sourceFiles: string[];
};

export type NotificationCommand = {
  userId: string;
  stateCode?: string;
  action: string;
  category?: NotificationCategory;
  subject?: string;
  body?: string;
  channels?: NotificationChannel[];
  priority?: NotificationPriority;
  templateId?: string;
  templateVars?: Record<string, string>;
  metadata?: Record<string, unknown>;
  preferences?: UserNotificationPrefs;
  email?: string;
  phoneNumber?: string;
  webhookUrl?: string;
};

export type NotificationAttempt = {
  channel: NotificationChannel;
  attempt: number;
  status: NotificationStatus;
  error?: string;
};

export type NotificationDispatchResult = {
  notificationId: string;
  userId: string;
  action: string;
  category: NotificationCategory;
  status: NotificationStatus;
  succeeded: NotificationChannel[];
  failed: NotificationChannel[];
  skipped: NotificationChannel[];
  attempts: number;
  fallbackUsed: boolean;
  persisted: boolean;
  templateId: string | null;
  subject: string;
  body: string;
  createdAt: string;
  attemptLog: NotificationAttempt[];
  metadata: Record<string, unknown>;
};

export const STATE_OPT_IN_REQUIRED: Record<string, NotificationChannel[]> = {
  CA: ['sms', 'push'],
  NY: ['sms'],
  FL: ['sms'],
  TX: ['sms'],
};

export function buildNotificationId(stateCode: string, action: string): string {
  return `notif_${stateCode.toUpperCase()}_${action.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

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
    notificationId: buildNotificationId(params.stateCode, params.templateId ?? params.subject),
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

export function buildDefaultNotificationPrefs(params: {
  userId: string;
  stateCode: string;
  timezone?: string;
}): UserNotificationPrefs {
  return {
    userId: params.userId,
    stateCode: params.stateCode.toUpperCase(),
    channels: { email: true, 'in-app': true, push: false, sms: false, webhook: false },
    doNotDisturb: { enabled: true, startHour: 22, endHour: 8 },
    timezone: params.timezone ?? 'America/New_York',
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

export function getAllowedChannels(
  requestedChannels: NotificationChannel[],
  stateCode: string,
  prefs: UserNotificationPrefs,
): { allowed: NotificationChannel[]; skipped: NotificationChannel[] } {
  const allowed: NotificationChannel[] = [];
  const skipped: NotificationChannel[] = [];

  for (const channel of requestedChannels) {
    if (isChannelAllowed(channel, stateCode, prefs)) {
      allowed.push(channel);
    } else {
      skipped.push(channel);
    }
  }

  return { allowed, skipped };
}

export function uniqueNotificationChannels(channels: NotificationChannel[]): NotificationChannel[] {
  return Array.from(new Set(channels));
}
