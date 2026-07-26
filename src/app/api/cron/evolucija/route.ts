import { NextResponse } from 'next/server';
import { kreirajISnimiCiklus, getKonfiguracija } from '@/lib/evolucija';
import { APP_VERSION } from '@/lib/constants';
import { validateCronAuth } from '@/lib/cron-auth';

/**
 * Cron endpoint — Omega Evolucioni Motor
 *
 * Pokre\u0107e se automatski svakih 6 sati putem eksternog scheduler-a.
 * Dijagnostikuje sistem, generi\u0161e preporuke, i kreira GitHub Issues.
 * Snima rezultate trajno u Supabase (evolution_cycles tabela).
 *
 * Dedup logika: pre kreiranja issue-a proverava da li ve\u0107 postoji otvoreni
 * issue sa istim naslovom (poslednja stranica od 50 otvorenih issue-a).
 * Ako postoji, preska\u010de kreiranje i bele\u017ei status \'vec-postoji\'.
 *
 * GET /api/cron/evolucija
 */
export async function GET(request: Request) {
  // Provider-neutral cron autentifikacija:
  // - Authorization: ******
  // - x-cron-secret: <CRON_SECRET>
  if (!validateCronAuth(request).authorized) {
    return NextResponse.json({ error: 'Neautorizovan pristup' }, { status: 401 });
  }

  // Kreira ciklus i snima ga u Supabase (non-blocking)
  const ciklus = await kreirajISnimiCiklus();
  const konfiguracija = getKonfiguracija();

  // Kreiranje GitHub Issues za svaku preporuku (ako je GITHUB_TOKEN dostupan)
  const githubToken = process.env.GITHUB_TOKEN;
  const githubRepo = process.env.GITHUB_REPOSITORY ?? 'spaja86/AI-IQ-SUPER-PLATFORMA';
  const kreiraniIssues: Array<{ naslov: string; broj?: number; status: string }> = [];

  if (githubToken) {
    const [owner, repo] = githubRepo.split('/');
    const githubHeaders = {
      Authorization: `token ${githubToken}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };

    // Dedup: fetch existing open issues to avoid duplicates
    let existingTitles = new Set<string>();
    try {
      const existingRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=50&labels=omega-evolucija`,
        { headers: githubHeaders },
      );
      if (existingRes.ok) {
        const existingIssues = await existingRes.json() as Array<{ title: string }>;
        if (Array.isArray(existingIssues)) {
          existingTitles = new Set(existingIssues.map((i) => i.title));
        }
      }
    } catch {
      // Non-critical: proceed without dedup if fetch fails
    }

    for (const preporuka of ciklus.dijagnostika.preporuke.slice(0, konfiguracija.maxIssuePoDanu)) {
      // Dedup: skip if open issue with same title already exists
      if (existingTitles.has(preporuka.githubIssueNaslov)) {
        kreiraniIssues.push({
          naslov: preporuka.githubIssueNaslov,
          status: 'vec-postoji',
        });
        continue;
      }

      try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
          method: 'POST',
          headers: githubHeaders,
          body: JSON.stringify({
            title: preporuka.githubIssueNaslov,
            body: preporuka.githubIssueTelo,
            labels: ['omega-evolucija', `prioritet:${preporuka.prioritet}`, `tip:${preporuka.tip}`],
          }),
        });

        if (response.ok) {
          const issue = await response.json() as Record<string, unknown>;
          const issueNumber = typeof issue.number === 'number' ? issue.number : undefined;
          kreiraniIssues.push({
            naslov: preporuka.githubIssueNaslov,
            broj: issueNumber,
            status: 'kreiran',
          });
        } else {
          kreiraniIssues.push({
            naslov: preporuka.githubIssueNaslov,
            status: `greska-${response.status}`,
          });
        }
      } catch {
        kreiraniIssues.push({
          naslov: preporuka.githubIssueNaslov,
          status: 'greska-fetch',
        });
      }
    }
  }

  return NextResponse.json({
    sistem: 'Omega Evolucioni Motor',
    verzija: APP_VERSION,
    ciklus: {
      id: ciklus.id,
      status: ciklus.status,
      zdravlje: ciklus.dijagnostika.zdravlje,
      preporuka: ciklus.dijagnostika.preporuke.length,
      akcija: ciklus.akcije.length,
    },
    kreiraniIssues,
    konfiguracija: {
      cronInterval: konfiguracija.cronInterval,
      maxIssuePoDanu: konfiguracija.maxIssuePoDanu,
      autoMerge: konfiguracija.autoMerge,
    },
    timestamp: new Date().toISOString(),
  });
}
