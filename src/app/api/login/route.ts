import { NextResponse } from 'next/server';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';

/**
 * POST /api/login — Autentifikacija korisnika
 *
 * Prihvata email i lozinku, validira i vraca sesiju.
 * Vlasnik (spajicn@yahoo.com) ima VIP pristup.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, lozinka } = body as { email?: string; lozinka?: string };

    if (!email || !lozinka) {
      return NextResponse.json(
        { greska: 'Email i lozinka su obavezni.' },
        { status: 400 },
      );
    }

    if (!email.includes('@') || !email.includes('.') || email.length < 5) {
      return NextResponse.json(
        { greska: 'Neispravan format email adrese.' },
        { status: 400 },
      );
    }

    if (lozinka.length < 6) {
      return NextResponse.json(
        { greska: 'Lozinka mora imati najmanje 6 karaktera.' },
        { status: 400 },
      );
    }

    // Odredjivanje uloge na osnovu email-a
    const jeVlasnik = email.toLowerCase() === 'spajicn@yahoo.com';
    const uloga = jeVlasnik ? 'vlasnik' : 'korisnik';
    const plan = jeVlasnik ? 'Unlimited VIP' : 'Starter';

    const sesija = {
      id: `ses-${Date.now()}`,
      korisnikId: `usr-${Date.now()}`,
      email,
      uloga,
      plan,
      token: `jwt-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      istice: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      kreirana: new Date().toISOString(),
    };

    return NextResponse.json({
      uspesno: true,
      poruka: jeVlasnik
        ? `Dobrodosli, vlasniku! VIP pristup aktiviran. ${KOMPANIJA} — Digitalna Industrija.`
        : `Uspesno prijavljivanje! Dobrodosli u ${KOMPANIJA} ekosistem.`,
      sesija,
      verzija: APP_VERSION,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { greska: 'Neispravan format zahteva.' },
      { status: 400 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    sistem: 'Login — Digitalna Industrija',
    opis: 'POST /api/login sa { email, lozinka } za prijavljivanje',
    verzija: APP_VERSION,
    kompanija: KOMPANIJA,
    metode: ['email', 'google', 'github', 'telefon'],
    status: 'aktivan',
    timestamp: new Date().toISOString(),
  });
}
