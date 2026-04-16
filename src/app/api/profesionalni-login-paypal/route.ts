import { NextRequest, NextResponse } from 'next/server';
import {
  paypalRuta,
  getMejlRuteZaProvajdera,
  getVerifikacioniSistemZaProvajdera,
  verifikujMejl,
} from '@/lib/profesionalni-login-platni-sistem';
import { APP_VERSION, KOMPANIJA } from '@/lib/constants';

/**
 * 🅿️ Profesionalni Login — PayPal Ruta
 *
 * GET  — Pregled PayPal rute sa poslovnim mejlovima od AI IQ World Bank
 * POST — Verifikacija poslovnog mejla koji stize na PayPal rutu
 *
 * Autofinish #334
 */

export async function GET() {
  const mejlRute = getMejlRuteZaProvajdera('paypal');
  const verifSistem = getVerifikacioniSistemZaProvajdera('paypal');

  return NextResponse.json({
    sistem: 'Profesionalni Login — PayPal Ruta',
    opis: 'PayPal ruta za profesionalni login sa poslovnim mejlovima od AI IQ World Bank. Svaki mejl koji stigne prolazi kroz kompletnu verifikaciju svih informacija.',
    verzija: APP_VERSION,
    izvor: KOMPANIJA,
    ruta: {
      id: paypalRuta.id,
      provajder: paypalRuta.provajder,
      naziv: paypalRuta.naziv,
      ikona: paypalRuta.ikona,
      poslovniMejlDomen: paypalRuta.poslovniMejlDomen,
      status: paypalRuta.status,
    },
    mejlRute: mejlRute.map((r) => ({
      id: r.id,
      mejlAdresa: r.mejlAdresa,
      kategorija: r.kategorija,
      naziv: r.naziv,
      opis: r.opis,
      verifikacijePolja: r.verifikacijePolja,
      aktivan: r.aktivan,
    })),
    verifikacioniSistem: {
      id: verifSistem.id,
      naziv: verifSistem.naziv,
      ukupnoProvera: verifSistem.ukupnoProvera,
      automatska: verifSistem.automatska,
      koraci: verifSistem.koraci,
    },
    mogucnosti: paypalRuta.mogucnosti,
    statistika: {
      ukupnoMejlRuta: mejlRute.length,
      aktivnihMejlRuta: mejlRute.filter((r) => r.aktivan).length,
      ukupnoVerifikacionihKoraka: verifSistem.ukupnoProvera,
    },
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, string>;

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { greska: 'Nevalidan zahtev — ocekivan JSON objekat sa mejl podacima.' },
        { status: 400 },
      );
    }

    const rezultat = verifikujMejl('paypal', body);

    return NextResponse.json({
      sistem: 'Profesionalni Login — PayPal Mejl Verifikacija',
      verzija: APP_VERSION,
      izvor: KOMPANIJA,
      verifikacija: rezultat,
      poruka: rezultat.rezultat === 'uspesno'
        ? 'Poslovni mejl od AI IQ World Bank uspesno verifikovan na PayPal ruti.'
        : 'Verifikacija poslovnog mejla neuspesna — proverite podatke.',
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { greska: 'Neispravan format zahteva — ocekivan JSON.' },
      { status: 400 },
    );
  }
}
