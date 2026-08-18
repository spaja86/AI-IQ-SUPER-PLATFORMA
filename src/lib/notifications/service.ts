import {
  STATE_OPT_IN_REQUIRED,
  buildDefaultNotificationPrefs,
  buildNotificationId,
  getAllowedChannels,
  uniqueNotificationChannels,
  type NotificationAttempt,
  type NotificationCategory,
  type NotificationChannel,
  type NotificationCommand,
  type NotificationDispatchResult,
  type NotificationInventoryEntry,
  type NotificationStatus,
  type UserNotificationPrefs,
} from './domain';
import {
  NOTIFICATION_ALERT_RULES,
  NOTIFICATION_ARCHITECTURE_LAYERS,
  NOTIFICATION_INVENTORY,
  NOTIFICATION_SOURCE_OF_TRUTH,
  NOTIFICATION_TEMPLATES,
  getNotificationTemplateByAction,
  getNotificationTemplateById,
} from './catalog';

export interface NotificationTransport {
  send: (command: NotificationCommand) => Promise<void>;
}

export interface NotificationRepository {
  insertInboxNotification: (entry: {
    userId: string;
    type: string;
    action: string;
    metadata: Record<string, unknown>;
    read?: boolean;
    createdAt?: string;
  }) => Promise<void>;
}

export type NotificationSupabaseClient = {
  from: (table: 'user_notifications') => {
    insert: (payload: {
      user_id: string;
      type?: string;
      action: string;
      metadata?: Record<string, unknown>;
      read?: boolean;
      created_at?: string;
    }) => Promise<unknown>;
  };
};

export type BillingNotificationPayload = {
  userId: string;
  email?: string;
  subject: string;
  body: string;
  channels: NotificationChannel[];
  metadata?: Record<string, unknown>;
  templateId?: string;
  action?: string;
};

export type BillingNotificationResult = {
  userId: string;
  subject: string;
  succeeded: NotificationChannel[];
  failed: NotificationChannel[];
  attempts: number;
  fallbackUsed: boolean;
};

const MAX_ATTEMPTS = 3;
const BACKOFF_MS = 50;

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (_match, rawKey) => vars[rawKey.trim()] ?? '');
}

function defaultStateCode(input?: string): string {
  return input?.toUpperCase() || 'US';
}

function defaultCategory(input: NotificationCommand, templateCategory?: NotificationCategory): NotificationCategory {
  return input.category ?? templateCategory ?? 'system';
}

function resolveTemplate(command: NotificationCommand) {
  if (command.templateId) return getNotificationTemplateById(command.templateId);
  return getNotificationTemplateByAction(command.action);
}

function resolveSubjectAndBody(command: NotificationCommand): { subject: string; body: string; templateId: string | null; templateVars: Record<string, string> } {
  const template = resolveTemplate(command);
  const templateVars = Object.fromEntries(
    Object.entries(command.templateVars ?? {}).map(([key, value]) => [key, String(value)]),
  );

  if (command.subject && command.body) {
    return {
      subject: command.subject,
      body: command.body,
      templateId: command.templateId ?? template?.id ?? null,
      templateVars,
    };
  }

  if (template) {
    return {
      subject: command.subject ?? interpolate(template.subject, templateVars),
      body: command.body ?? interpolate(template.body, templateVars),
      templateId: template.id,
      templateVars,
    };
  }

  return {
    subject: command.subject ?? command.action,
    body: command.body ?? '',
    templateId: command.templateId ?? null,
    templateVars,
  };
}

function resolveChannels(command: NotificationCommand): NotificationChannel[] {
  const template = resolveTemplate(command);
  const requested = command.channels ?? template?.defaultChannels ?? ['in-app'];
  return uniqueNotificationChannels(requested);
}

function resolvePreferences(command: NotificationCommand): UserNotificationPrefs {
  return command.preferences ?? buildDefaultNotificationPrefs({
    userId: command.userId,
    stateCode: defaultStateCode(command.stateCode),
  });
}

async function delay(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendWithRetry(
  channel: NotificationChannel,
  transport: NotificationTransport,
  command: NotificationCommand,
): Promise<{ ok: boolean; attempts: number; attemptLog: NotificationAttempt[]; error?: string }> {
  const attemptLog: NotificationAttempt[] = [];

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      attemptLog.push({ channel, attempt, status: 'sending' });
      await transport.send(command);
      attemptLog.push({ channel, attempt, status: 'delivered' });
      return { ok: true, attempts: attempt, attemptLog };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      attemptLog.push({ channel, attempt, status: 'failed', error: message });
      if (attempt < MAX_ATTEMPTS) {
        await delay(BACKOFF_MS * Math.pow(2, attempt - 1));
      }
    }
  }

  const finalError = attemptLog.findLast((entry) => entry.error)?.error ?? 'TRANSPORT_FAILED';
  return { ok: false, attempts: MAX_ATTEMPTS, attemptLog, error: finalError };
}

export function createSupabaseNotificationRepository(client: NotificationSupabaseClient): NotificationRepository {
  return {
    async insertInboxNotification(entry) {
      await client.from('user_notifications').insert({
        user_id: entry.userId,
        type: entry.type,
        action: entry.action,
        metadata: entry.metadata,
        read: entry.read ?? false,
        created_at: entry.createdAt,
      });
    },
  };
}

export async function dispatchNotification(
  command: NotificationCommand,
  deps: {
    repository?: NotificationRepository;
    transports?: Partial<Record<NotificationChannel, NotificationTransport>>;
  } = {},
): Promise<NotificationDispatchResult> {
  const stateCode = defaultStateCode(command.stateCode);
  const prefs = resolvePreferences(command);
  const channels = resolveChannels(command);
  const { allowed, skipped } = getAllowedChannels(channels, stateCode, prefs);
  const { subject, body, templateId, templateVars } = resolveSubjectAndBody(command);
  const template = resolveTemplate(command);
  const category = defaultCategory(command, template?.category);
  const priority = command.priority ?? template?.priority ?? 'normal';
  const notificationId = buildNotificationId(stateCode, command.action);
  const createdAt = new Date().toISOString();
  const attemptLog: NotificationAttempt[] = [];
  const succeeded: NotificationChannel[] = [];
  const failed: NotificationChannel[] = [];
  let totalAttempts = 0;
  let fallbackUsed = false;
  let persisted = false;

  for (const channel of allowed) {
    if (channel === 'in-app') continue;
    const transport = deps.transports?.[channel];
    if (!transport) {
      failed.push(channel);
      attemptLog.push({ channel, attempt: 1, status: 'failed', error: 'TRANSPORT_NOT_CONFIGURED' });
      totalAttempts += 1;
      continue;
    }

    const result = await sendWithRetry(channel, transport, {
      ...command,
      stateCode,
      subject,
      body,
      templateId: templateId ?? undefined,
      templateVars,
      priority,
      category,
    });
    totalAttempts += result.attempts;
    attemptLog.push(...result.attemptLog);
    if (result.ok) {
      succeeded.push(channel);
    } else {
      failed.push(channel);
    }
  }

  const shouldPersistInApp =
    allowed.includes('in-app') ||
    (allowed.length > 0 && succeeded.length === 0) ||
    (failed.length > 0 && !succeeded.includes('in-app'));

  if (shouldPersistInApp && deps.repository) {
    await deps.repository.insertInboxNotification({
      userId: command.userId,
      type: category,
      action: command.action,
      createdAt,
      metadata: {
        notificationId,
        category,
        priority,
        stateCode,
        subject,
        body,
        templateId,
        templateVars,
        requestedChannels: channels,
        allowedChannels: allowed,
        skippedChannels: skipped,
        attemptLog,
        sourceOfTruth: NOTIFICATION_SOURCE_OF_TRUTH,
        sourceAction: command.action,
        sourceMetadata: command.metadata ?? {},
      },
    });
    persisted = true;
    if (!succeeded.includes('in-app')) {
      succeeded.push('in-app');
      attemptLog.push({ channel: 'in-app', attempt: 1, status: 'delivered' });
      if (!allowed.includes('in-app')) {
        fallbackUsed = true;
      }
    }
  } else if (allowed.includes('in-app')) {
    failed.push('in-app');
    attemptLog.push({ channel: 'in-app', attempt: 1, status: 'failed', error: 'PERSISTENCE_NOT_CONFIGURED' });
    totalAttempts += 1;
  }

  const status: NotificationStatus =
    failed.length === 0 && succeeded.length > 0
      ? 'delivered'
      : succeeded.length > 0
        ? 'partial'
        : skipped.length === channels.length
          ? 'skipped'
          : 'failed';

  return {
    notificationId,
    userId: command.userId,
    action: command.action,
    category,
    status,
    succeeded,
    failed,
    skipped,
    attempts: totalAttempts,
    fallbackUsed,
    persisted,
    templateId,
    subject,
    body,
    createdAt,
    attemptLog,
    metadata: {
      ...command.metadata,
      stateCode,
      priority,
      requestedChannels: channels,
      allowedChannels: allowed,
      skippedChannels: skipped,
    },
  };
}

export async function sendBillingNotification(
  payload: BillingNotificationPayload,
  supabaseClient: NotificationSupabaseClient,
): Promise<BillingNotificationResult> {
  const repository = createSupabaseNotificationRepository(supabaseClient);
  const result = await dispatchNotification(
    {
      userId: payload.userId,
      action: payload.action ?? payload.templateId ?? 'billing.custom',
      category: 'billing',
      channels: payload.channels,
      subject: payload.subject,
      body: payload.body,
      templateId: payload.templateId,
      metadata: {
        email: payload.email,
        ...payload.metadata,
      },
    },
    { repository },
  );

  return {
    userId: result.userId,
    subject: result.subject,
    succeeded: result.succeeded,
    failed: result.failed,
    attempts: result.attempts,
    fallbackUsed: result.fallbackUsed,
  };
}

export function buildPastDueNotification(userId: string, email?: string): BillingNotificationPayload {
  return {
    userId,
    email,
    subject: 'Vaša pretplata je istekla — action required',
    body: 'Naplata vaše SPAJA pretplate nije uspela. Molimo vas ažurirajte podatke o plaćanju da biste nastavili sa korišćenjem.',
    channels: ['email', 'in-app'],
    templateId: 'billing.past-due.v1',
    action: 'billing.past_due',
  };
}

export function buildTrialEndingNotification(userId: string, email?: string, daysLeft = 3): BillingNotificationPayload {
  return {
    userId,
    email,
    subject: `Vaš probni period ističe za ${daysLeft} ${daysLeft === 1 ? 'dan' : 'dana'}`,
    body: `Podsećamo vas da vaš SPAJA probni period ističe za ${daysLeft} dana. Pretplatite se da nastavite bez prekida.`,
    channels: ['email', 'in-app'],
    templateId: 'billing.trial-ending.v1',
    action: 'billing.trial_ending',
    metadata: { daysLeft },
  };
}

export function buildPaymentSucceededNotification(userId: string, email?: string, planName = 'plan'): BillingNotificationPayload {
  return {
    userId,
    email,
    subject: 'Plaćanje uspešno — pretplata aktivna',
    body: `Vaša SPAJA pretplata (${planName}) je uspešno obnovljena.`,
    channels: ['email', 'in-app'],
    templateId: 'billing.payment-succeeded.v1',
    action: 'billing.payment_succeeded',
    metadata: { planName },
  };
}

export function getNotificationInventory(): NotificationInventoryEntry[] {
  return NOTIFICATION_INVENTORY;
}

export function getNotificationOverview() {
  const channels = Array.from(new Set(NOTIFICATION_INVENTORY.flatMap((entry) => entry.channels)));
  const categories = Array.from(new Set(NOTIFICATION_INVENTORY.map((entry) => entry.category)));
  const templatesByCategory = NOTIFICATION_TEMPLATES.reduce<Record<string, number>>((acc, template) => {
    acc[template.category] = (acc[template.category] ?? 0) + 1;
    return acc;
  }, {});

  return {
    sourceOfTruth: NOTIFICATION_SOURCE_OF_TRUTH,
    architecture: NOTIFICATION_ARCHITECTURE_LAYERS,
    inventory: NOTIFICATION_INVENTORY,
    counts: {
      flows: NOTIFICATION_INVENTORY.length,
      templates: NOTIFICATION_TEMPLATES.length,
      alertRules: NOTIFICATION_ALERT_RULES.length,
      channels: channels.length,
      categories: categories.length,
    },
    channels,
    categories,
    templates: {
      total: NOTIFICATION_TEMPLATES.length,
      byCategory: templatesByCategory,
      items: NOTIFICATION_TEMPLATES,
    },
    alerting: {
      totalRules: NOTIFICATION_ALERT_RULES.length,
      escalationEnabled: NOTIFICATION_ALERT_RULES.filter((rule) => rule.escalation).length,
      items: NOTIFICATION_ALERT_RULES,
    },
    persistence: {
      primaryTable: 'user_notifications',
      strategy: 'metadata-extended',
      trackedFields: [
        'notificationId',
        'category',
        'priority',
        'requestedChannels',
        'allowedChannels',
        'skippedChannels',
        'attemptLog',
        'templateId',
        'templateVars',
        'sourceMetadata',
      ],
    },
    observability: {
      metricsSource: 'central-notification-service',
      deliverySignals: ['attemptLog', 'allowedChannels', 'skippedChannels', 'fallbackUsed', 'persisted'],
      alertRules: NOTIFICATION_ALERT_RULES.map((rule) => rule.id),
    },
  };
}

export function getNotificationHistoryView() {
  return NOTIFICATION_INVENTORY.map((entry) => ({
    id: entry.id,
    producer: entry.producer,
    category: entry.category,
    routes: entry.routes,
    channels: entry.channels,
    persistence: entry.persistence,
    sourceFiles: entry.sourceFiles,
  }));
}

export function getNotificationPreferencesView(stateCode = 'US', userId = 'preview-user') {
  const prefs = buildDefaultNotificationPrefs({ userId, stateCode });
  return {
    userId: prefs.userId,
    stateCode: prefs.stateCode,
    defaultPreferences: prefs,
    compliance: {
      optInRequiredChannels: STATE_OPT_IN_REQUIRED[prefs.stateCode] ?? [],
      rules: getAllowedChannels(uniqueNotificationChannels(['email', 'sms', 'push', 'in-app', 'webhook']), stateCode, prefs),
    },
  };
}

export function getNotificationHealthView() {
  const overview = getNotificationOverview();
  return {
    status: 'ok' as const,
    sourceOfTruth: overview.sourceOfTruth,
    inventoryCoverage: overview.counts.flows,
    templates: overview.counts.templates,
    alertRules: overview.counts.alertRules,
    channels: overview.counts.channels,
    persistence: overview.persistence.primaryTable,
    observabilitySource: overview.observability.metricsSource,
  };
}
