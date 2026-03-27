import { NextResponse } from 'next/server';
import { kreirajEvolucijskiCiklus, getKonfiguracija } from '@/lib/evolucija';

/**
 * Vercel Cron endpoint — Omega Evolucioni Motor
 *
 * Pokreće se automatski svakih 6 sati (konfigurabilno).
 * Dijagnostikuje sistem, generiše preporuke, i kreira GitHub Issues.
 *
 * Vercel Cron: GET /api/cron/evolucija
 */
export async function GET(request: Request) {
  // Vercel Cron šalje Authorization header sa CRON_SECRET
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // U produkciji, proveravamo CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Neautorizovan pristup' }, { status: 401 });
  }

  const ciklus = kreirajEvolucijskiCiklus();
  const konfiguracija = getKonfiguracija();

  // Kreiranje GitHub Issues za svaku preporuku (ako je GITHUB_TOKEN dostupan)
  const githubToken = process.env.GITHUB_TOKEN;
  const githubRepo = process.env.GITHUB_REPOSITORY ?? 'spaja86/AI-IQ-SUPER-PLATFORMA';
  const kreiraniIssues: Array<{ naslov: string; broj?: number; status: string }> = [];

  if (githubToken) {
    for (const preporuka of ciklus.dijagnostika.preporuke.slice(0, konfiguracija.maxIssuePoDanu)) {
      try {
        const [owner, repo] = githubRepo.split('/');
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
          method: 'POST',
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: preporuka.githubIssueNaslov,
            body: preporuka.githubIssueTelo,
            labels: ['omega-evolucija', `prioritet:${preporuka.prioritet}`, `tip:${preporuka.tip}`],
          }),
        });

        if (response.ok) {
          const issue = await response.json() as { number: number };
          kreiraniIssues.push({
            naslov: preporuka.githubIssueNaslov,
            broj: issue.number,
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
    verzija: '1.0.0',
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
