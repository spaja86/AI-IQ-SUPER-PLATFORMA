// SpajaUltraOmegaCore — SVE OD SVEGA ALERT
// Kompanija SPAJA — Digitalna Industrija
//
// Alert dispatcher za SVE OD SVEGA.
// Aktivira se kada: ukupanScore < 50 ILI kriticniDomeni >= 3 ILI meta.degraded === true
// Salje webhook payload ako je ANALIZA_ALERT_WEBHOOK_URL konfigurisan.

import type { SveOdSvega } from './sve-od-svega';

export type SveOdSvegaAlertNivo = 'kriticno' | 'upozorenje';

export interface SveOdSvegaAlertCondition {
  lowScore: boolean;
  manyKriticniDomeni: boolean;
  degraded: boolean;
}

export interface SveOdSvegaAlertResult {
  sent: boolean;
  reason: string;
  nivo?: SveOdSvegaAlertNivo;
  condition?: SveOdSvegaAlertCondition;
}

const LOW_SCORE_THRESHOLD = 50;
const KRITICNI_DOMENI_THRESHOLD = 3;

/**
 * Odredjuje da li treba poslati alert i koji je nivo:
 * - 'kriticno': score < 50 ili degraded = true
 * - 'upozorenje': kriticniDomeni >= 3
 */
export function getSveOdSvegaAlertNivo(
  rezultat: SveOdSvega,
): { shouldAlert: boolean; nivo: SveOdSvegaAlertNivo; condition: SveOdSvegaAlertCondition } {
  const lowScore = rezultat.ukupanScore < LOW_SCORE_THRESHOLD;
  const manyKriticniDomeni = rezultat.kriticniDomeni.length >= KRITICNI_DOMENI_THRESHOLD;
  const degraded = rezultat.meta.degraded;

  const condition: SveOdSvegaAlertCondition = { lowScore, manyKriticniDomeni, degraded };
  const shouldAlert = lowScore || manyKriticniDomeni || degraded;
  const nivo: SveOdSvegaAlertNivo = lowScore || degraded ? 'kriticno' : 'upozorenje';

  return { shouldAlert, nivo, condition };
}

/**
 * Salje webhook alert za SVE OD SVEGA ako su uslovi ispunjeni.
 * Webhook URL je ocitivan iz ANALIZA_ALERT_WEBHOOK_URL env var.
 */
export async function dispatchSveOdSvegaAlert(
  rezultat: SveOdSvega,
): Promise<SveOdSvegaAlertResult> {
  // Podrzava namenski SVE_OD_SVEGA_ALERT_WEBHOOK_URL ili deli ANALIZA_ALERT_WEBHOOK_URL
  const webhookUrl =
    process.env.SVE_OD_SVEGA_ALERT_WEBHOOK_URL ?? process.env.ANALIZA_ALERT_WEBHOOK_URL;
  if (!webhookUrl) {
    return { sent: false, reason: 'webhook-not-configured' };
  }

  const { shouldAlert, nivo, condition } = getSveOdSvegaAlertNivo(rezultat);
  if (!shouldAlert) {
    return { sent: false, reason: 'threshold-not-breached' };
  }

  const payload = {
    sistem: rezultat.sistem,
    nivo,
    ukupanScore: rezultat.ukupanScore,
    konacnaOcena: rezultat.konacnaOcena,
    kriticniDomeni: rezultat.kriticniDomeni,
    preporuke: rezultat.preporuke,
    condition,
    meta: {
      contractVersion: rezultat.meta.contractVersion,
      modelVersion: rezultat.meta.modelVersion,
      generatedAt: rezultat.meta.generatedAt,
      degraded: rezultat.meta.degraded,
      degradedSources: rezultat.meta.degradedSources,
    },
    timestamp: rezultat.timestamp,
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { sent: false, reason: `webhook-failed-${response.status}`, nivo, condition };
    }

    return { sent: true, reason: 'sent', nivo, condition };
  } catch (error) {
    console.warn('[sve-od-svega-alert] webhook fetch error', error);
    return { sent: false, reason: 'webhook-fetch-error', nivo, condition };
  }
}
