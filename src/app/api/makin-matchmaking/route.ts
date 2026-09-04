import { NextRequest, NextResponse } from 'next/server';
import {
  dodajURedCekanja,
  ukloniIzRedaCekanja,
  statusMatchmaking,
  pronadjiMatch,
  getMatchmakingStatistike,
  pocetniElo,
  MATCHMAKING_KONFIG_PO_IGRICI,
  MATCHMAKING_KONFIG_PODRAZUMEVANO,
} from '@/lib/makin-matchmaking';
import type { MatchmakingIgrac, RegionTip } from '@/lib/makin-matchmaking';
import type { DimenzijaNivo } from '@/lib/dimenzije';

// ─── GET /api/makin-matchmaking?userId=xxx ────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const userId = searchParams.get('userId');
  const stats = searchParams.get('stats');

  // Statistike zahtev
  if (stats === 'true') {
    return NextResponse.json({
      status: 'ok',
      statistike: getMatchmakingStatistike(),
      timestamp: new Date().toISOString(),
    });
  }

  if (!userId) {
    return NextResponse.json(
      { error: 'userId parametar je obavezan' },
      { status: 400 },
    );
  }

  const stavka = statusMatchmaking(userId);
  if (!stavka) {
    return NextResponse.json(
      { status: 'nije-u-redu', poruka: 'Igrač nije u redu čekanja' },
      { status: 404 },
    );
  }

  return NextResponse.json({
    status: stavka.status,
    matchId: stavka.matchId,
    error: stavka.greska,
    uRedOd: stavka.uRedOd,
    cekanjeSekundi: Math.round((Date.now() - stavka.uRedOd) / 1000),
    timestamp: new Date().toISOString(),
  });
}

// ─── POST /api/makin-matchmaking ──────────────────────────────────────────────

interface JoinBody {
  action: 'join';
  userId: string;
  igricaId: string;
  dimenzija: DimenzijaNivo;
  elo?: number;
  region?: RegionTip;
  displayName?: string;
}

export async function POST(request: NextRequest) {
  let body: JoinBody;

  try {
    body = await request.json() as JoinBody;
  } catch {
    return NextResponse.json({ error: 'Neispravan JSON body' }, { status: 400 });
  }

  if (body.action !== 'join') {
    return NextResponse.json(
      { error: `Nepoznat action: ${body.action}` },
      { status: 400 },
    );
  }

  const { userId, igricaId, dimenzija, elo, region, displayName } = body;

  if (!userId || !igricaId || !dimenzija) {
    return NextResponse.json(
      { error: 'userId, igricaId i dimenzija su obavezni' },
      { status: 400 },
    );
  }

  const igrac: MatchmakingIgrac = {
    userId,
    igricaId,
    dimenzija,
    elo: elo ?? pocetniElo(),
    region: region ?? 'global',
    timestamp: Date.now(),
    displayName,
  };

  const stavka = dodajURedCekanja(igrac);

  // Odmah pokušaj da pronađeš match
  const konfig = MATCHMAKING_KONFIG_PO_IGRICI[igricaId] ?? MATCHMAKING_KONFIG_PODRAZUMEVANO;
  const match = pronadjiMatch(igrac, konfig);

  return NextResponse.json({
    status: stavka.status,
    matchId: match?.id ?? null,
    match: match ?? null,
    uRedOd: stavka.uRedOd,
    timestamp: new Date().toISOString(),
  });
}

// ─── DELETE /api/makin-matchmaking ────────────────────────────────────────────

export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { error: 'userId parametar je obavezan' },
      { status: 400 },
    );
  }

  const uspeh = ukloniIzRedaCekanja(userId);
  return NextResponse.json({
    status: uspeh ? 'uklonjen' : 'nije-bio-u-redu',
    userId,
    timestamp: new Date().toISOString(),
  });
}
