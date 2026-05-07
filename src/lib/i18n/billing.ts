// SpajaUltraOmegaCore -∞Ω+∞ — i18n: Billing & Payment Prevodi
// Kompanija SPAJA — Digitalna Industrija
//
// Talas 7 (P2): Internacionalizacija i regionalizacija.
//
// Implementira prevode za billing/payment UI na svim podržanim jezicima:
//   sr (Srpski), en (English), de (Deutsch), fr (Français), es (Español)
//
// Upotreba:
//   import { getBillingTranslations } from '@/lib/i18n/billing';
//   const t = getBillingTranslations('en');

import type { Locale } from './index';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface BillingTranslations {
  // Planovi
  planStarter: string;
  planBasic: string;
  planPro: string;
  planEnterprise: string;
  planUnlimited: string;
  planFree: string;
  planPopular: string;
  perMonth: string;
  // Akcije
  subscribe: string;
  upgrade: string;
  downgrade: string;
  cancel: string;
  manage: string;
  viewPlans: string;
  currentPlan: string;
  changePlan: string;
  // Checkout
  checkoutTitle: string;
  checkoutSubtitle: string;
  securePayment: string;
  poweredByStripe: string;
  checkoutSuccess: string;
  checkoutFailed: string;
  checkoutCancelled: string;
  processingPayment: string;
  // Stanje pretplate
  activeSubscription: string;
  cancelledSubscription: string;
  expiredSubscription: string;
  pausedSubscription: string;
  gracePeriod: string;
  // Greške
  paymentFailed: string;
  paymentDeclined: string;
  cardExpired: string;
  insufficientFunds: string;
  stripeError: string;
  tryAgain: string;
  contactSupport: string;
  // Uspeh
  paymentSuccess: string;
  subscriptionActivated: string;
  subscriptionUpdated: string;
  subscriptionCancelled: string;
  // Račun
  invoices: string;
  invoiceDate: string;
  invoiceAmount: string;
  invoiceStatus: string;
  invoicePaid: string;
  invoicePending: string;
  downloadInvoice: string;
  // Limiti
  limitReached: string;
  limitMessages: string;
  upgradeToUnlock: string;
  messagesRemaining: string;
  // Portal
  billingPortal: string;
  paymentMethod: string;
  updatePaymentMethod: string;
  billingAddress: string;
  // Promocije
  trialPeriod: string;
  trialDaysLeft: string;
  trialEnded: string;
  promoCode: string;
  applyCode: string;
  discountApplied: string;
}

// ─── Prevodi ──────────────────────────────────────────────────────────────────

const billingTranslations: Record<Locale, BillingTranslations> = {
  sr: {
    planStarter: 'Starter',
    planBasic: 'Basic',
    planPro: 'Pro',
    planEnterprise: 'Enterprise',
    planUnlimited: 'Unlimited',
    planFree: 'Besplatno',
    planPopular: 'Najpopularniji',
    perMonth: '/mesec',
    subscribe: 'Pretplatite se',
    upgrade: 'Nadogradite',
    downgrade: 'Smanjite plan',
    cancel: 'Otkaži pretplatu',
    manage: 'Upravljajte planom',
    viewPlans: 'Pogledajte planove',
    currentPlan: 'Trenutni plan',
    changePlan: 'Promenite plan',
    checkoutTitle: 'Završite kupovinu',
    checkoutSubtitle: 'Unesite podatke o plaćanju',
    securePayment: 'Sigurno plaćanje',
    poweredByStripe: 'Plaćanje putem Stripe',
    checkoutSuccess: 'Plaćanje uspešno!',
    checkoutFailed: 'Plaćanje nije uspelo.',
    checkoutCancelled: 'Plaćanje je otkazano.',
    processingPayment: 'Obrada plaćanja...',
    activeSubscription: 'Aktivna pretplata',
    cancelledSubscription: 'Otkazana pretplata',
    expiredSubscription: 'Istekla pretplata',
    pausedSubscription: 'Pauzirana pretplata',
    gracePeriod: 'Grace period — obnovite pretplatu',
    paymentFailed: 'Plaćanje nije uspelo',
    paymentDeclined: 'Kartica je odbijena',
    cardExpired: 'Kartica je istekla',
    insufficientFunds: 'Nedovoljno sredstava',
    stripeError: 'Greška servisa za plaćanje',
    tryAgain: 'Pokušajte ponovo',
    contactSupport: 'Kontaktirajte podršku',
    paymentSuccess: 'Plaćanje uspešno obavljeno!',
    subscriptionActivated: 'Pretplata je aktivirana.',
    subscriptionUpdated: 'Pretplata je ažurirana.',
    subscriptionCancelled: 'Pretplata je otkazana.',
    invoices: 'Računi',
    invoiceDate: 'Datum',
    invoiceAmount: 'Iznos',
    invoiceStatus: 'Status',
    invoicePaid: 'Plaćeno',
    invoicePending: 'Na čekanju',
    downloadInvoice: 'Preuzmi račun',
    limitReached: 'Dostigli ste limit poruka.',
    limitMessages: 'poruka ovog meseca',
    upgradeToUnlock: 'Nadogradite plan za više poruka.',
    messagesRemaining: 'poruka preostalo',
    billingPortal: 'Billing portal',
    paymentMethod: 'Način plaćanja',
    updatePaymentMethod: 'Ažurirajte način plaćanja',
    billingAddress: 'Adresa plaćanja',
    trialPeriod: 'Probni period',
    trialDaysLeft: 'dana probnog perioda preostalo',
    trialEnded: 'Probni period je završen.',
    promoCode: 'Promo kod',
    applyCode: 'Primeni kod',
    discountApplied: 'Popust primenjen!',
  },
  en: {
    planStarter: 'Starter',
    planBasic: 'Basic',
    planPro: 'Pro',
    planEnterprise: 'Enterprise',
    planUnlimited: 'Unlimited',
    planFree: 'Free',
    planPopular: 'Most Popular',
    perMonth: '/month',
    subscribe: 'Subscribe',
    upgrade: 'Upgrade',
    downgrade: 'Downgrade',
    cancel: 'Cancel subscription',
    manage: 'Manage plan',
    viewPlans: 'View plans',
    currentPlan: 'Current plan',
    changePlan: 'Change plan',
    checkoutTitle: 'Complete your purchase',
    checkoutSubtitle: 'Enter your payment details',
    securePayment: 'Secure payment',
    poweredByStripe: 'Powered by Stripe',
    checkoutSuccess: 'Payment successful!',
    checkoutFailed: 'Payment failed.',
    checkoutCancelled: 'Payment cancelled.',
    processingPayment: 'Processing payment...',
    activeSubscription: 'Active subscription',
    cancelledSubscription: 'Cancelled subscription',
    expiredSubscription: 'Expired subscription',
    pausedSubscription: 'Paused subscription',
    gracePeriod: 'Grace period — renew your subscription',
    paymentFailed: 'Payment failed',
    paymentDeclined: 'Card declined',
    cardExpired: 'Card expired',
    insufficientFunds: 'Insufficient funds',
    stripeError: 'Payment service error',
    tryAgain: 'Try again',
    contactSupport: 'Contact support',
    paymentSuccess: 'Payment successful!',
    subscriptionActivated: 'Subscription activated.',
    subscriptionUpdated: 'Subscription updated.',
    subscriptionCancelled: 'Subscription cancelled.',
    invoices: 'Invoices',
    invoiceDate: 'Date',
    invoiceAmount: 'Amount',
    invoiceStatus: 'Status',
    invoicePaid: 'Paid',
    invoicePending: 'Pending',
    downloadInvoice: 'Download invoice',
    limitReached: 'You have reached your message limit.',
    limitMessages: 'messages this month',
    upgradeToUnlock: 'Upgrade your plan for more messages.',
    messagesRemaining: 'messages remaining',
    billingPortal: 'Billing portal',
    paymentMethod: 'Payment method',
    updatePaymentMethod: 'Update payment method',
    billingAddress: 'Billing address',
    trialPeriod: 'Trial period',
    trialDaysLeft: 'trial days remaining',
    trialEnded: 'Trial period has ended.',
    promoCode: 'Promo code',
    applyCode: 'Apply code',
    discountApplied: 'Discount applied!',
  },
  de: {
    planStarter: 'Starter',
    planBasic: 'Basic',
    planPro: 'Pro',
    planEnterprise: 'Enterprise',
    planUnlimited: 'Unlimited',
    planFree: 'Kostenlos',
    planPopular: 'Am beliebtesten',
    perMonth: '/Monat',
    subscribe: 'Abonnieren',
    upgrade: 'Upgrade',
    downgrade: 'Downgrade',
    cancel: 'Abonnement kündigen',
    manage: 'Plan verwalten',
    viewPlans: 'Pläne ansehen',
    currentPlan: 'Aktueller Plan',
    changePlan: 'Plan ändern',
    checkoutTitle: 'Kauf abschließen',
    checkoutSubtitle: 'Zahlungsdaten eingeben',
    securePayment: 'Sichere Zahlung',
    poweredByStripe: 'Bezahlung über Stripe',
    checkoutSuccess: 'Zahlung erfolgreich!',
    checkoutFailed: 'Zahlung fehlgeschlagen.',
    checkoutCancelled: 'Zahlung abgebrochen.',
    processingPayment: 'Zahlung wird verarbeitet...',
    activeSubscription: 'Aktives Abonnement',
    cancelledSubscription: 'Gekündigtes Abonnement',
    expiredSubscription: 'Abgelaufenes Abonnement',
    pausedSubscription: 'Pausiertes Abonnement',
    gracePeriod: 'Kulanzzeit — Abonnement erneuern',
    paymentFailed: 'Zahlung fehlgeschlagen',
    paymentDeclined: 'Karte abgelehnt',
    cardExpired: 'Karte abgelaufen',
    insufficientFunds: 'Unzureichende Mittel',
    stripeError: 'Zahlungsdienst-Fehler',
    tryAgain: 'Erneut versuchen',
    contactSupport: 'Support kontaktieren',
    paymentSuccess: 'Zahlung erfolgreich!',
    subscriptionActivated: 'Abonnement aktiviert.',
    subscriptionUpdated: 'Abonnement aktualisiert.',
    subscriptionCancelled: 'Abonnement gekündigt.',
    invoices: 'Rechnungen',
    invoiceDate: 'Datum',
    invoiceAmount: 'Betrag',
    invoiceStatus: 'Status',
    invoicePaid: 'Bezahlt',
    invoicePending: 'Ausstehend',
    downloadInvoice: 'Rechnung herunterladen',
    limitReached: 'Sie haben Ihr Nachrichtenlimit erreicht.',
    limitMessages: 'Nachrichten diesen Monat',
    upgradeToUnlock: 'Upgrade für mehr Nachrichten.',
    messagesRemaining: 'Nachrichten verbleibend',
    billingPortal: 'Abrechnungsportal',
    paymentMethod: 'Zahlungsmethode',
    updatePaymentMethod: 'Zahlungsmethode aktualisieren',
    billingAddress: 'Rechnungsadresse',
    trialPeriod: 'Testzeitraum',
    trialDaysLeft: 'Testtage verbleibend',
    trialEnded: 'Testzeitraum beendet.',
    promoCode: 'Aktionscode',
    applyCode: 'Code anwenden',
    discountApplied: 'Rabatt angewendet!',
  },
  fr: {
    planStarter: 'Starter',
    planBasic: 'Basic',
    planPro: 'Pro',
    planEnterprise: 'Entreprise',
    planUnlimited: 'Illimité',
    planFree: 'Gratuit',
    planPopular: 'Plus populaire',
    perMonth: '/mois',
    subscribe: "S'abonner",
    upgrade: 'Mettre à niveau',
    downgrade: 'Rétrograder',
    cancel: "Annuler l'abonnement",
    manage: 'Gérer le plan',
    viewPlans: 'Voir les plans',
    currentPlan: 'Plan actuel',
    changePlan: 'Changer de plan',
    checkoutTitle: 'Finaliser votre achat',
    checkoutSubtitle: 'Entrez vos données de paiement',
    securePayment: 'Paiement sécurisé',
    poweredByStripe: 'Paiement via Stripe',
    checkoutSuccess: 'Paiement réussi !',
    checkoutFailed: 'Paiement échoué.',
    checkoutCancelled: 'Paiement annulé.',
    processingPayment: 'Traitement du paiement...',
    activeSubscription: 'Abonnement actif',
    cancelledSubscription: 'Abonnement annulé',
    expiredSubscription: 'Abonnement expiré',
    pausedSubscription: 'Abonnement en pause',
    gracePeriod: 'Période de grâce — renouvelez votre abonnement',
    paymentFailed: 'Paiement échoué',
    paymentDeclined: 'Carte refusée',
    cardExpired: 'Carte expirée',
    insufficientFunds: 'Fonds insuffisants',
    stripeError: 'Erreur du service de paiement',
    tryAgain: 'Réessayer',
    contactSupport: 'Contacter le support',
    paymentSuccess: 'Paiement réussi !',
    subscriptionActivated: 'Abonnement activé.',
    subscriptionUpdated: 'Abonnement mis à jour.',
    subscriptionCancelled: 'Abonnement annulé.',
    invoices: 'Factures',
    invoiceDate: 'Date',
    invoiceAmount: 'Montant',
    invoiceStatus: 'Statut',
    invoicePaid: 'Payé',
    invoicePending: 'En attente',
    downloadInvoice: 'Télécharger la facture',
    limitReached: 'Vous avez atteint votre limite de messages.',
    limitMessages: 'messages ce mois-ci',
    upgradeToUnlock: 'Mettez à niveau pour plus de messages.',
    messagesRemaining: 'messages restants',
    billingPortal: 'Portail de facturation',
    paymentMethod: 'Méthode de paiement',
    updatePaymentMethod: 'Mettre à jour la méthode de paiement',
    billingAddress: 'Adresse de facturation',
    trialPeriod: "Période d'essai",
    trialDaysLeft: "jours d'essai restants",
    trialEnded: "La période d'essai est terminée.",
    promoCode: 'Code promo',
    applyCode: 'Appliquer le code',
    discountApplied: 'Réduction appliquée !',
  },
  es: {
    planStarter: 'Starter',
    planBasic: 'Basic',
    planPro: 'Pro',
    planEnterprise: 'Enterprise',
    planUnlimited: 'Ilimitado',
    planFree: 'Gratis',
    planPopular: 'Más popular',
    perMonth: '/mes',
    subscribe: 'Suscribirse',
    upgrade: 'Actualizar',
    downgrade: 'Reducir plan',
    cancel: 'Cancelar suscripción',
    manage: 'Gestionar plan',
    viewPlans: 'Ver planes',
    currentPlan: 'Plan actual',
    changePlan: 'Cambiar plan',
    checkoutTitle: 'Completar compra',
    checkoutSubtitle: 'Introduce tus datos de pago',
    securePayment: 'Pago seguro',
    poweredByStripe: 'Pago con Stripe',
    checkoutSuccess: '¡Pago exitoso!',
    checkoutFailed: 'Pago fallido.',
    checkoutCancelled: 'Pago cancelado.',
    processingPayment: 'Procesando pago...',
    activeSubscription: 'Suscripción activa',
    cancelledSubscription: 'Suscripción cancelada',
    expiredSubscription: 'Suscripción expirada',
    pausedSubscription: 'Suscripción pausada',
    gracePeriod: 'Período de gracia — renueva tu suscripción',
    paymentFailed: 'Pago fallido',
    paymentDeclined: 'Tarjeta rechazada',
    cardExpired: 'Tarjeta caducada',
    insufficientFunds: 'Fondos insuficientes',
    stripeError: 'Error del servicio de pago',
    tryAgain: 'Intentar de nuevo',
    contactSupport: 'Contactar soporte',
    paymentSuccess: '¡Pago exitoso!',
    subscriptionActivated: 'Suscripción activada.',
    subscriptionUpdated: 'Suscripción actualizada.',
    subscriptionCancelled: 'Suscripción cancelada.',
    invoices: 'Facturas',
    invoiceDate: 'Fecha',
    invoiceAmount: 'Importe',
    invoiceStatus: 'Estado',
    invoicePaid: 'Pagado',
    invoicePending: 'Pendiente',
    downloadInvoice: 'Descargar factura',
    limitReached: 'Has alcanzado tu límite de mensajes.',
    limitMessages: 'mensajes este mes',
    upgradeToUnlock: 'Actualiza tu plan para más mensajes.',
    messagesRemaining: 'mensajes restantes',
    billingPortal: 'Portal de facturación',
    paymentMethod: 'Método de pago',
    updatePaymentMethod: 'Actualizar método de pago',
    billingAddress: 'Dirección de facturación',
    trialPeriod: 'Período de prueba',
    trialDaysLeft: 'días de prueba restantes',
    trialEnded: 'El período de prueba ha terminado.',
    promoCode: 'Código promocional',
    applyCode: 'Aplicar código',
    discountApplied: '¡Descuento aplicado!',
  },
};

// ─── Javni API ────────────────────────────────────────────────────────────────

/**
 * Dohvata billing/payment prevode za dati locale.
 * Fallback na srpski ako locale nije podržan.
 */
export function getBillingTranslations(locale: Locale): BillingTranslations {
  return billingTranslations[locale] ?? billingTranslations.sr;
}

/**
 * Formatira cenu za prikazivanje.
 *
 * @example
 * formatPrice(29, 'EUR', 'en') → '€29.00/month'
 */
export function formatPrice(
  amount: number,
  currency: string,
  locale: Locale,
): string {
  const t = getBillingTranslations(locale);
  const formatted = new Intl.NumberFormat(localeToIntl(locale), {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
  return `${formatted}${t.perMonth}`;
}

function localeToIntl(locale: Locale): string {
  const map: Record<Locale, string> = {
    sr: 'sr-Latn-RS',
    en: 'en-US',
    de: 'de-DE',
    fr: 'fr-FR',
    es: 'es-ES',
  };
  return map[locale] ?? 'en-US';
}
