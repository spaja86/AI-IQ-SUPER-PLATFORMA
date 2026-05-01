/**
 * Cloudflare Scheduled Worker — Zdravlje Sistema
 * Kompanija SPAJA — AI IQ SUPER PLATFORMA
 *
 * Zamena za Vercel Cron: "*/30 * * * *" (svakih 30 minuta)
 *
 * Postavljanje na Cloudflare:
 *   1. wrangler deploy workers/zdravlje.js --name spaja-cron-zdravlje
 *   2. Dodaj Cron Trigger u CF Dashboard → Workers → spaja-cron-zdravlje → Triggers → Cron Triggers
 *      Schedule: "*/30 * * * *"
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

    const response = await fetch(`${appUrl}/api/cron/zdravlje`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Zdravlje cron greška ${response.status}: ${text}`);
    }

    const result = await response.json();
    console.log('[SPAJA] Zdravlje cron završen:', JSON.stringify(result));
  },
};
