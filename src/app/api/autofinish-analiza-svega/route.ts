import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { APP_VERSION, AUTOFINISH_COUNT } from '@/lib/constants';
import { checkRateLimitGlobal, rateLimitKey } from '@/lib/rate-limit';
import { buildAnalizaSvega } from '@/lib/analiza-svega';

const TRIGGER_TOKEN = process.env.AUTOFINISH_TRIGGER_TOKEN;

export async function POST(req: NextRequest) {
  if (!TRIGGER_TOKEN) {
    return NextResponse.json(
      {
        error: 'SERVICE_UNAVAILABLE',
        poruka: 'Autofinish ANALIZA SVEGA trigger nije konfigurisan. Podesite AUTOFINISH_TRIGGER_TOKEN.',
        verzija: APP_VERSION,
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }

  const authHeader = req.headers.get('authorization') ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token || token !== TRIGGER_TOKEN) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
        poruka: 'Validan Bearer token je obavezan za pokretanje autofinish ANALIZA SVEGA koraka.',
        verzija: APP_VERSION,
        timestamp: new Date().toISOString(),
      },
      { status: 401 },
    );
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const allowed = await checkRateLimitGlobal(rateLimitKey(ip, '/api/autofinish-analiza-svega'), 10, 60);
  if (!allowed) {
    return NextResponse.json(
      {
        error: 'Too Many Requests',
        poruka: 'Previše zahteva. Pokušajte ponovo za 60 sekundi.',
        verzija: APP_VERSION,
        timestamp: new Date().toISOString(),
      },
      { status: 429, headers: { 'Retry-After': '60' } },
    );
  }

  const analiza = await buildAnalizaSvega();
  const blocking = analiza.preporukeDetaljno.filter((p) => p.klasa === 'blocking');
  const githubToken = process.env.GITHUB_TOKEN;
  const githubRepo = process.env.GITHUB_REPOSITORY ?? 'spaja86/AI-IQ-SUPER-PLATFORMA';
  const [owner, repo] = githubRepo.split('/');
  const kreiraniIssues: Array<{ naslov: string; broj?: number; status: string }> = [];

  if (githubToken) {
    for (const preporuka of blocking) {
      const naslov = `[ANALIZA SVEGA] ${preporuka.poruka}`;
      const telo = [
        `Autofinish iteracija: #${AUTOFINISH_COUNT}`,
        `Prioritet: ${preporuka.prioritet}`,
        `Domeni: ${preporuka.domeni.join(', ')}`,
        '',
        'Izvor:',
        '- /api/analiza-svega',
      ].join('\n');
      try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
          method: 'POST',
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: naslov,
            body: telo,
            labels: ['autofinish', 'analiza-svega', `prioritet:${preporuka.prioritet}`],
          }),
        });
        if (response.ok) {
          const issue = (await response.json()) as Record<string, unknown>;
          kreiraniIssues.push({
            naslov,
            broj: typeof issue.number === 'number' ? issue.number : undefined,
            status: 'kreiran',
          });
        } else {
          kreiraniIssues.push({ naslov, status: `greska-${response.status}` });
        }
      } catch {
        kreiraniIssues.push({ naslov, status: 'greska-fetch' });
      }
    }
  }

  return NextResponse.json({
    status: 'ok',
    naziv: 'Autofinish Analiza Svega Trigger',
    verzija: APP_VERSION,
    autofinishIteracija: AUTOFINISH_COUNT,
    ukupanScore: analiza.ukupanScore,
    kriticniDomeni: analiza.kriticniDomeni,
    blockingPreporuke: blocking.map((p) => ({
      id: p.id,
      poruka: p.poruka,
      prioritet: p.prioritet,
      domeni: p.domeni,
    })),
    kreiraniIssues,
    timestamp: new Date().toISOString(),
  });
}

export async function GET() {
  return NextResponse.json(
    {
      error: 'Method Not Allowed',
      poruka: 'POST metoda je obavezna za autofinish ANALIZA SVEGA korak.',
      dozvoljeniMetodi: ['POST'],
      verzija: APP_VERSION,
      timestamp: new Date().toISOString(),
    },
    { status: 405 },
  );
}
