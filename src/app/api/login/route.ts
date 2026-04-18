import { NextResponse } from 'next/server';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { getSveKomponente, spajaDigitalniKompjuterSistem } from '@/lib/spaja-digitalni-kompjuter';
import { ΩAuthProvider, ensureDemoSeeded } from '@/lib/auth/omega-auth';
import { REFRESH_TOKEN_TTL } from '@/lib/auth/types';
import { digitalnaIndustrija, getIndustrijaStats } from '@/lib/industrija';
import { platforme } from '@/lib/platforme';
import {
  gamingStatistika,
  gamingKonfiguracija,
  gejmingKonstrukcija,
  getAktivneIgriceSaEndzinom,
  IOOPENUIAO_URL,
} from '@/lib/io-openui-ao-gaming-platforma';

/**
 * POST /api/login — Autentifikacija korisnika (kompatibilna ruta)
 *
 * Prihvata { email, lozinka } ILI { email, password } — oba formata.
 * Delegira autentifikaciju na centralni Omega Auth sistem.
 * Svako ko se loguje dobija aktiviran Digitalni Kompjuter
 * sa svim komponentama pokretanim od SPAJA Generator za Endzine.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Podrži oba formata: { email, lozinka } i { email, password }
    const email = body.email as string | undefined;
    const password = (body.password ?? body.lozinka) as string | undefined;

    if (!email || !password) {
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

    if (password.length < 8) {
      return NextResponse.json(
        { greska: 'Lozinka mora imati najmanje 8 karaktera.' },
        { status: 400 },
      );
    }

    // Osiguraj da je demo nalog kreiran pre logina
    await ensureDemoSeeded();

    // Delegiraj na centralni Omega Auth sistem
    const result = await ΩAuthProvider.login({ email, password });

    if (!result) {
      return NextResponse.json(
        { greska: 'Neispravni podaci za prijavu.' },
        { status: 401 },
      );
    }

    // Odredjivanje uloge na osnovu email-a
    const jeVlasnik = email.toLowerCase() === 'spajicn@yahoo.com';

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

    // Pristup industriji i svim delatnostima nakon logovanja
    const industrijaStats = getIndustrijaStats();
    const aktivneIgrice = getAktivneIgriceSaEndzinom();
    const industrijaPristup = {
      aktiviran: true,
      naziv: digitalnaIndustrija.name,
      opis: digitalnaIndustrija.description,
      misija: digitalnaIndustrija.mission,
      vizija: digitalnaIndustrija.vision,
      statistika: industrijaStats,
      platforme: platforme.map((p) => ({
        id: p.id,
        naziv: p.naziv,
        kategorija: p.kategorija,
        url: `https://${p.deploy.domen}`,
        status: p.deploy.status,
      })),
      delatnosti: [
        'Digitalna Industrija',
        'Gaming Platforma',
        'AI Platforma',
        'Finansije',
        'Proksi Mreza',
        'Mobilna Mreza',
        'IT Proizvodi',
        'SpajaPro Engine',
        'SPAJA Generator za Endzine',
        'OpenAI Platforma',
      ],
    };

    // Gaming platforma i Otavna Konstrukcija Gejminga
    const gamingPristup = {
      aktiviran: true,
      platforma: gamingKonfiguracija.platformaNaziv,
      url: IOOPENUIAO_URL,
      domen: gamingKonfiguracija.domen,
      ukupnoIgrica: gamingStatistika.ukupnoIgrica,
      aktivnihIgrica: aktivneIgrice.length,
      kategorija: gamingStatistika.ukupnoKategorija,
      optimizacija: `${gamingStatistika.prosecnaOptimizacija}%`,
      gejmingKonstrukcija: {
        id: gejmingKonstrukcija.id,
        naziv: gejmingKonstrukcija.naziv,
        opis: gejmingKonstrukcija.opis,
        ektodanariKapacitet: gejmingKonstrukcija.ektodanariKapacitet,
        aktivna: gejmingKonstrukcija.aktivna,
      },
    };

    // Vraćamo i Omega Auth token i legacy format za kompatibilnost
    const response = NextResponse.json({
      uspesno: true,
      poruka: jeVlasnik
        ? `Dobrodosli, vlasniku! VIP pristup aktiviran. ${KOMPANIJA} — Digitalna Industrija. Digitalni Kompjuter aktiviran. Pristup industriji i svim delatnostima odobren.`
        : `Uspesno prijavljivanje! Dobrodosli u ${KOMPANIJA} ekosistem. Digitalni Kompjuter aktiviran. Pristup industriji i svim delatnostima odobren.`,
      // Omega Auth token (primarni format)
      token: result.token,
      identity: {
        id: result.identity.id,
        did: result.identity.did,
        roles: result.identity.roles,
        clearanceLevel: result.identity.clearanceLevel,
        digitalIndustryAccess: result.identity.digitalIndustryAccess,
      },
      expiresAt: result.expiresAt,
      // Legacy format za kompatibilnost
      sesija: {
        id: result.identity.id,
        korisnikId: result.identity.id,
        email,
        uloga: jeVlasnik ? 'vlasnik' : (result.identity.roles[0] ?? 'korisnik'),
        plan: jeVlasnik ? 'Unlimited VIP' : 'Starter',
        token: result.token.value,
        istice: new Date(result.expiresAt * 1000).toISOString(),
        kreirana: new Date().toISOString(),
      },
      pristup: {
        industrija: true,
        platforme: true,
        ekosistem: true,
        gamingPlatforma: true,
        delatnosti: true,
        gejmingKonstrukcija: true,
      },
      digitalniKompjuter,
      industrijaPristup,
      gamingPristup,
      verzija: APP_VERSION,
      timestamp: new Date().toISOString(),
    });

    // Postavi httpOnly kolačić za refresh token
    response.cookies.set('omega-refresh', result.refreshToken.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: REFRESH_TOKEN_TTL,
      path: '/api/auth',
    });

    return response;
  } catch (err) {
    console.error('[OMEGA-LOGIN] /api/login error:', err);
    return NextResponse.json(
      { greska: 'Neispravan format zahteva.' },
      { status: 400 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    sistem: 'Login — Digitalna Industrija',
    opis: 'POST /api/login sa { email, lozinka } ili { email, password } za prijavljivanje — svaki korisnik dobija aktiviran Digitalni Kompjuter sa svim komponentama, pristup industriji i svim delatnostima, platformama, ekosistemu, i gaming platformi sa Otavnom Konstrukcijom Gejminga',
    verzija: APP_VERSION,
    kompanija: KOMPANIJA,
    metode: ['email', 'google', 'github', 'telefon'],
    digitalniKompjuter: 'Automatski se aktivira pri loginu — SPAJA Maticna Ploca, Server, Procesor, Cip, Procesor 2, Cip 2, BIOS, Hard Disk, RAM, GPU, Graficka, Graficka 1, Tastatura i Mis, Monitoring Live',
    industrijaPristup: 'Logovanjem se dobija pristup industriji i svim delatnostima, platformama, ekosistemu i svemu ostalom',
    gamingPristup: 'Gaming platforma sa Otavnom Konstrukcijom Gejminga — ektodanari kapacitet globalnog koda prema referentnoj ekskalaciji matricnog jedinjenja',
    status: 'aktivan',
    timestamp: new Date().toISOString(),
  });
}
