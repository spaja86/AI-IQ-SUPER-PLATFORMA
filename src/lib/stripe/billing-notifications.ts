// SpajaUltraOmegaCore -∞Ω+∞ — Billing Notifications (#59, #60)
// Kompanija SPAJA — Digitalna Industrija
//
// Implementira:
//   #59 automatski retry notifikacija korisniku (max 3 pokušaja, eksponencijalni backoff)
//   #60 fallback kanal notifikacije (email + in-app)

export type NotificationChannel = 'email' | 'in-app' | 'push';

export interface NotificationPayload {
  userId: string;
  email?: string;
  subject: string;
  body: string;
  channels: NotificationChannel[];
  metadata?: Record<string, unknown>;
}

export interface NotificationResult {
  userId: string;
  subject: string;
  succeeded: NotificationChannel[];
  failed: NotificationChannel[];
  attempts: number;
  fallbackUsed: boolean;
}

// ─── Channel Senders (stubs za integraciju) ────────────────────────────────────

async function sendEmail(payload: NotificationPayload): Promise<void> {
  // Integracija: koristiti Resend/SendGrid/SES
  // U produkciji NEXT_PUBLIC_EMAIL_API_URL + EMAIL_API_KEY env varijable
  const emailApiUrl = process.env.EMAIL_API_URL;
  if (!emailApiUrl) throw new Error('EMAIL_API_URL nije konfigurisan');
  const res = await fetch(emailApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.EMAIL_API_KEY ?? ''}`,
    },
    body: JSON.stringify({
      to: payload.email,
      subject: payload.subject,
      text: payload.body,
    }),
  });
  if (!res.ok) throw new Error(`Email API error: ${res.status}`);
}

async function sendInApp(payload: NotificationPayload, supabase: {
  from: (table: string) => {
    insert: (data: Record<string, unknown>) => Promise<unknown>;
  };
}): Promise<void> {
  await supabase
    .from('user_notifications')
    .insert({
      user_id: payload.userId,
      subject: payload.subject,
      body: payload.body,
      channel: 'in-app',
      metadata: payload.metadata ?? {},
      created_at: new Date().toISOString(),
      read: false,
    });
}

async function sendPush(payload: NotificationPayload): Promise<void> {
  // Integracija: koristiti FCM/APN u produkciji
  const pushApiUrl = process.env.PUSH_API_URL;
  if (!pushApiUrl) throw new Error('PUSH_API_URL nije konfigurisan');
  const res = await fetch(pushApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.PUSH_API_KEY ?? ''}`,
    },
    body: JSON.stringify({ userId: payload.userId, title: payload.subject, body: payload.body }),
  });
  if (!res.ok) throw new Error(`Push API error: ${res.status}`);
}

// ─── Retry sa eksponencijalnim backoff-om ─────────────────────────────────────

const MAX_ATTEMPTS = 3;

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendWithRetry(
  sendFn: () => Promise<void>,
  maxAttempts = MAX_ATTEMPTS,
): Promise<{ ok: boolean; attempts: number }> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await sendFn();
      return { ok: true, attempts: attempt };
    } catch {
      if (attempt < maxAttempts) {
        await delay(200 * Math.pow(2, attempt - 1)); // 200ms, 400ms, 800ms
      }
    }
  }
  return { ok: false, attempts: maxAttempts };
}

// ─── Multi-channel dispatcher (#59, #60) ─────────────────────────────────────

export async function sendBillingNotification(
  payload: NotificationPayload,
  supabaseClient: Parameters<typeof sendInApp>[1],
): Promise<NotificationResult> {
  const succeeded: NotificationChannel[] = [];
  const failed: NotificationChannel[] = [];
  let totalAttempts = 0;
  let fallbackUsed = false;

  for (const channel of payload.channels) {
    let result: { ok: boolean; attempts: number };

    if (channel === 'email') {
      result = await sendWithRetry(() => sendEmail(payload));
    } else if (channel === 'in-app') {
      result = await sendWithRetry(() => sendInApp(payload, supabaseClient));
    } else if (channel === 'push') {
      result = await sendWithRetry(() => sendPush(payload));
    } else {
      result = { ok: false, attempts: 1 };
    }

    totalAttempts += result.attempts;

    if (result.ok) {
      succeeded.push(channel);
    } else {
      failed.push(channel);
    }
  }

  // Fallback: se primarni kanal nije uspio, šalji in-app (#60)
  const primaryChannel = payload.channels[0];
  if (primaryChannel && failed.includes(primaryChannel) && !succeeded.includes('in-app')) {
    const fallbackResult = await sendWithRetry(() => sendInApp(payload, supabaseClient));
    totalAttempts += fallbackResult.attempts;
    if (fallbackResult.ok) {
      succeeded.push('in-app');
      fallbackUsed = true;
    }
  }

  return {
    userId: payload.userId,
    subject: payload.subject,
    succeeded,
    failed,
    attempts: totalAttempts,
    fallbackUsed,
  };
}

// ─── Billing-specifične poruke ────────────────────────────────────────────────

export function buildPastDueNotification(userId: string, email?: string): NotificationPayload {
  return {
    userId,
    email,
    subject: 'Vaša pretplata je istekla — action required',
    body: 'Naplata vaše SPAJA pretplate nije uspela. Molimo vas ažurirajte podatke o plaćanju da biste nastavili sa korišćenjem.',
    channels: ['email', 'in-app'],
  };
}

export function buildTrialEndingNotification(userId: string, email?: string, daysLeft = 3): NotificationPayload {
  return {
    userId,
    email,
    subject: `Vaš probni period ističe za ${daysLeft} ${daysLeft === 1 ? 'dan' : 'dana'}`,
    body: `Podsećamo vas da vaš SPAJA probni period ističe za ${daysLeft} dana. Pretplatite se da nastavite bez prekida.`,
    channels: ['email', 'in-app'],
  };
}

export function buildPaymentSucceededNotification(userId: string, email?: string, planName = 'plan'): NotificationPayload {
  return {
    userId,
    email,
    subject: 'Plaćanje uspešno — pretplata aktivna',
    body: `Vaša SPAJA pretplata (${planName}) je uspešno obnovljena.`,
    channels: ['email', 'in-app'],
  };
}
