import { NextRequest, NextResponse } from 'next/server';
import { verifyUserFromToken } from '@/lib/supabase/server';
import { canReadB2BControlCenter } from '@/lib/b2b-control-center-auth';
import { getAktivneKomponente, getKompjuterStatistika } from '@/lib/spaja-digitalni-kompjuter';
import { getAiiqVrhProgramskogEkviladentaProfile } from '@/lib/ai-iq-programski-jezik';
import { getAktivniModuli, getBrouvzerStatistika, spajaDigitalniBrouvzer } from '@/lib/spaja-digitalni-brouvzer';

export async function GET(request: NextRequest) {
  const user = await verifyUserFromToken(request.headers.get('authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Prijava je obavezna.' }, { status: 401 });
  }
  if (!canReadB2BControlCenter(user)) {
    return NextResponse.json({ error: 'B2B read-only pristup nije odobren.' }, { status: 403 });
  }

  const statistika = getKompjuterStatistika();
  const aktivneKomponente = getAktivneKomponente();
  const aiIqVrh = getAiiqVrhProgramskogEkviladentaProfile();
  const brouvzerStatistika = getBrouvzerStatistika();
  const aktivniBrouvzerModuli = getAktivniModuli();

  return NextResponse.json({
    naziv: 'Digitalni Kompjuter — B2B Control Center',
    rezim: 'read-only',
    napomena: 'Ovo je prikaz deklarisane konfiguracije iz aplikacionog koda. Nije dokaz fizičkog hardvera, cloud kapaciteta ili izvršavanja poslova.',
    statistika: {
      ukupnoKomponenti: statistika.ukupnoKomponenti,
      aktivnihKomponenti: statistika.aktivnihKomponenti,
      ukupnoKompjutera: statistika.ukupnoKompjutera,
      ukupnoKonzola: statistika.ukupnoKonzola,
    },
    komponente: aktivneKomponente.map(({ id, naziv, status }) => ({ id, naziv, status })),
    aiIqVrh,
    digitalniBrouvzer: {
      naziv: spajaDigitalniBrouvzer.naziv,
      verzija: spajaDigitalniBrouvzer.verzija,
      ekstremniRezim: spajaDigitalniBrouvzer.ekstremniRezim,
      aktivnihModula: aktivniBrouvzerModuli.length,
      ukupnoModula: brouvzerStatistika.ukupnoModula,
      gamingIntegration: 'deklarisana browser-integracija sa postojećim gaming endžinom',
      browserUrl: '/spaja-digitalni-brouvzer',
      gamingUrl: '/io-openui-ao-gaming-platforma',
      napomena: 'Ovo je deklarisana aplikaciona integracija. Ne predstavlja fizičku instalaciju, niti potvrdu da konkretna igra ili VR naočare rade na uređaju.',
    },
    timestamp: new Date().toISOString(),
  });
}
