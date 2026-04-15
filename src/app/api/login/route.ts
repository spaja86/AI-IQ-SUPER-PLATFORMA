import { NextResponse } from 'next/server';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';
import { getSveKomponente, spajaDigitalniKompjuterSistem } from '@/lib/spaja-digitalni-kompjuter';
import { ΩCryptoEngine } from '@/lib/auth/omega-crypto';
import { getGlobalVault } from '@/lib/auth/omega-identity';
import { ensureDemoSeeded } from '@/lib/auth/omega-auth';
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

    if (lozinka.length < 8) {
      return NextResponse.json(
        { greska: 'Lozinka mora imati najmanje 8 karaktera.' },
        { status: 400 },
      );
    }

    // Osiguraj da je demo nalog kreiran pre logina
    await ensureDemoSeeded();

    // Verifikacija lozinke — pronadji korisnika u ΩIdentityVault
    const vault = getGlobalVault();
    const allIds = vault.listIds();
    let identityFound = false;
    let passwordValid = false;

    for (const id of allIds) {
      const candidate = vault.retrieveIdentity(id);
      if (candidate?.email === email) {
        identityFound = true;
        if (candidate.passwordHash) {
          passwordValid = await ΩCryptoEngine.verifyPassword(lozinka, candidate.passwordHash);
        }
        break;
      }
    }

    // Ako korisnik postoji u vault-u, lozinka mora biti ispravna
    if (identityFound && !passwordValid) {
      return NextResponse.json(
        { greska: 'Neispravna lozinka.' },
        { status: 401 },
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

    return NextResponse.json({
      uspesno: true,
      poruka: jeVlasnik
        ? `Dobrodosli, vlasniku! VIP pristup aktiviran. ${KOMPANIJA} — Digitalna Industrija. Digitalni Kompjuter aktiviran. Pristup industriji i svim delatnostima odobren.`
        : `Uspesno prijavljivanje! Dobrodosli u ${KOMPANIJA} ekosistem. Digitalni Kompjuter aktiviran. Pristup industriji i svim delatnostima odobren.`,
      sesija,
      digitalniKompjuter,
      industrijaPristup,
      gamingPristup,
      verzija: APP_VERSION,
      timestamp: new Date().toISOString(),
    });
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
    opis: 'POST /api/login sa { email, lozinka } za prijavljivanje — svaki korisnik dobija aktiviran Digitalni Kompjuter sa svim komponentama, pristup industriji i svim delatnostima, platformama, ekosistemu, i gaming platformi sa Otavnom Konstrukcijom Gejminga',
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
