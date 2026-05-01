/**
 * Cloudflare Scheduled Worker — Omega Evolucioni Motor
 * Kompanija SPAJA — AI IQ SUPER PLATFORMA
 *
 * Zamena za Vercel Cron: "0 */6 * * *" (svakih 6 sati)
 *
 * Postavljanje na Cloudflare:
 *   1. wrangler deploy workers/evolucija.js --name spaja-cron-evolucija
 *   2. Dodaj Cron Trigger u CF Dashboard → Workers → spaja-cron-evolucija → Triggers → Cron Triggers
 *      Schedule: "0 */6 * * *"
 *
 * Environment Variables (postavi u CF Dashboard → Workers → Settings → Variables):
 *   - APP_URL: https://ai-iq-super-platforma.pages.dev (ili tvoj custom domen)
 *   - CRON_SECRET: (isti kao na Vercel — env var vrednost)
 */

export default {
  async scheduled(event, env, ctx) {
    const appUrl = env.APP_URL ?? 'https://ai-iq-super-platforma.pages.dev';
    const cronSecret = env.CRON_SECRET;

    const headers = {
      'Content-Type': 'application/json',
    };

    if (cronSecret) {
      headers['Authorization'] = `Bearer ${cronSecret}`;
    }

    const response = await fetch(`${appUrl}/api/cron/evolucija`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Evolucija cron greška ${response.status}: ${text}`);
    }

    const result = await response.json();
    console.log('[SPAJA] Evolucija cron završen:', JSON.stringify(result));
  },
};
