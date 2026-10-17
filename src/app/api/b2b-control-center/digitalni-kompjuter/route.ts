import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { canReadB2BControlCenter } from '@/lib/b2b-control-center-auth';
import { getSveKomponente, getKompjuterStatistika } from '@/lib/spaja-digitalni-kompjuter';

export async function GET(request: NextRequest) {
  const user = await verifyUserFromToken(request.headers.get('authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Prijava je obavezna.' }, { status: 401 });
  }
  if (!canReadB2BControlCenter(user)) {
    return NextResponse.json({ error: 'B2B read-only pristup nije odobren.' }, { status: 403 });
  }

  const statistika = getKompjuterStatistika();
  const deklarisaneKomponente = getSveKomponente();

  return NextResponse.json({
    naziv: 'Digitalni Kompjuter — B2B Control Center',
    rezim: 'read-only',
    napomena: 'Ovo je prikaz deklarisane konfiguracije iz aplikacionog koda. Nije dokaz fizičkog hardvera, cloud kapaciteta ili izvršavanja poslova.',
    statistika: {
      ukupnoKomponenti: statistika.ukupnoKomponenti,
      deklarisanoAktivnihKomponenti: statistika.deklarisanoAktivnihKomponenti,
      aktivnihKomponenti: statistika.aktivnihKomponenti,
      ukupnoKompjutera: statistika.ukupnoKompjutera,
      ukupnoKonzola: statistika.ukupnoKonzola,
    },
    komponente: deklarisaneKomponente.map(({ id, naziv, status, statusScope }) => ({ id, naziv, status, statusScope })),
    timestamp: new Date().toISOString(),
  });
}
