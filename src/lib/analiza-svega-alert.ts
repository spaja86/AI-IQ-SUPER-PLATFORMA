import type { AnalizaSvega } from './analiza-svega';

export interface AnalizaAlertResult {
  sent: boolean;
  reason: string;
}

function getThreshold(): number {
  const raw = process.env.ANALIZA_ALERT_THRESHOLD;
  if (!raw) return 75;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    console.warn('[analiza-svega-alert] ANALIZA_ALERT_THRESHOLD nije validan broj, koristi se fallback 75');
    return 75;
  }
  return Math.max(0, Math.min(100, Math.round(parsed)));
}

/**
 * Šalje webhook alert kada ukupan score padne ispod threshold-a
 * ili kada postoje kritični domeni.
 */
export async function dispatchAnalizaSvegaAlert(analiza: AnalizaSvega): Promise<AnalizaAlertResult> {
  const webhookUrl = process.env.ANALIZA_ALERT_WEBHOOK_URL;
  if (!webhookUrl) {
    return { sent: false, reason: 'webhook-not-configured' };
  }

  const threshold = getThreshold();
  const shouldAlert = analiza.ukupanScore < threshold || analiza.kriticniDomeni.length > 0;
  if (!shouldAlert) {
    return { sent: false, reason: 'threshold-not-breached' };
  }

  const payload = {
    sistem: analiza.sistem,
    ukupanScore: analiza.ukupanScore,
    konacnaOcena: analiza.konacnaOcena,
    threshold,
    kriticniDomeni: analiza.kriticniDomeni,
    preporuke: analiza.preporukeDetaljno
      .filter((p) => p.klasa === 'blocking')
      .map((p) => ({
        id: p.id,
        poruka: p.poruka,
        prioritet: p.prioritet,
        domeni: p.domeni,
      })),
    trend: analiza.trend,
    meta: {
      contractVersion: analiza.meta.contractVersion,
      modelVersion: analiza.meta.modelVersion,
      generatedAt: analiza.meta.generatedAt,
    },
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { sent: false, reason: `webhook-failed-${response.status}` };
    }

    return { sent: true, reason: 'sent' };
  } catch (error) {
    console.warn('[analiza-svega-alert] webhook fetch error', error);
    return { sent: false, reason: 'webhook-fetch-error' };
  }
}
