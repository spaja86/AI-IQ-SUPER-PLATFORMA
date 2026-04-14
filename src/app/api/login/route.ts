import { NextResponse } from 'next/server';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { getSveKomponente, spajaDigitalniKompjuterSistem } from '@/lib/spaja-digitalni-kompjuter';
import { ΩCryptoEngine } from '@/lib/auth/omega-crypto';

/**
 * POST /api/login — Autentifikacija korisnika
 *
 * Prihvata email i lozinku, validira i vraca sesiju.
 * Vlasnik (spajicn@yahoo.com) ima VIP pristup.
 *
 * Svako ko se loguje dobija aktiviran Digitalni Kompjuter
 * sa svim komponentama pokretanim od SPAJA Generator za Endzine.
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

    // Generisanje kriptografski sigurnog tokena
    const secureToken = ΩCryptoEngine.generateSecureToken(32);

    const sesija = {
      id: `ses-${ΩCryptoEngine.generateId()}`,
      korisnikId: `usr-${ΩCryptoEngine.generateId()}`,
      email,
      uloga,
      plan,
      token: secureToken,
      istice: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      kreirana: new Date().toISOString(),
    };

    // Aktivacija Digitalnog Kompjutera za svakog ulogovanog korisnika
    const sistem = spajaDigitalniKompjuterSistem;
    const sveKomponente = getSveKomponente();
    const digitalniKompjuter = {
      aktiviran: true,
      naziv: 'SPAJA Digitalni Kompjuter',
      opis: 'Kompletni digitalni kompjuter aktiviran za korisnika — sve komponente pokretane od SPAJA Generator za Endzine',
      generatorLink: sistem.generatorLink,
      statistika: sistem.statistika,
      komponente: sveKomponente.map((k) => ({
        id: k.id,
        naziv: k.naziv,
        ikona: k.ikona,
        status: k.status,
        link: k.link,
        generatorLink: k.generatorLink,
      })),
      konzole: sistem.konzole.map((k) => ({
        id: k.id,
        naziv: k.naziv,
        tip: k.tip,
        status: k.status,
        link: k.link,
      })),
      dzojstici: {
        id: sistem.dzojstici.id,
        naziv: sistem.dzojstici.naziv,
        status: sistem.dzojstici.status,
        link: sistem.dzojstici.link,
      },
    };

    return NextResponse.json({
      uspesno: true,
      poruka: jeVlasnik
        ? `Dobrodosli, vlasniku! VIP pristup aktiviran. ${KOMPANIJA} — Digitalna Industrija. Digitalni Kompjuter aktiviran.`
        : `Uspesno prijavljivanje! Dobrodosli u ${KOMPANIJA} ekosistem. Digitalni Kompjuter aktiviran.`,
      sesija,
      digitalniKompjuter,
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
    opis: 'POST /api/login sa { email, lozinka } za prijavljivanje — svaki korisnik dobija aktiviran Digitalni Kompjuter sa svim komponentama',
    verzija: APP_VERSION,
    kompanija: KOMPANIJA,
    metode: ['email', 'google', 'github', 'telefon'],
    digitalniKompjuter: 'Automatski se aktivira pri loginu — SPAJA Maticna Ploca, Server, Procesor, Cip, Procesor 2, Cip 2, BIOS, Hard Disk, RAM, GPU, Graficka, Graficka 1, Tastatura i Mis, Monitoring Live',
    status: 'aktivan',
    timestamp: new Date().toISOString(),
  });
}
