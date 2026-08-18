// SpajaUltraOmegaCore -∞Ω+∞ — Billing Notifications (#59, #60)
// Kompanija SPAJA — Digitalna Industrija
//
// Billing notifikacije su reorganizovane na zajednički notification service sloj.

export type { NotificationChannel } from '@/lib/notifications';
export type {
  BillingNotificationPayload as NotificationPayload,
  BillingNotificationResult as NotificationResult,
  NotificationSupabaseClient,
} from '@/lib/notifications';
export {
  sendBillingNotification,
  buildPastDueNotification,
  buildTrialEndingNotification,
  buildPaymentSucceededNotification,
} from '@/lib/notifications';
