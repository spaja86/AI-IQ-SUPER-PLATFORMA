import { NextResponse } from 'next/server';
import { industrijskiMejlSistem } from '@/lib/omega-ai-suport-mejlovi';
import { APP_VERSION } from '@/lib/constants';

/**
 * 📧 OMEGA AI Industrijski Suport Mejlovi — Glavni API
 *
 * Kompletan pregled sistema industrijskih mejlova za dopisivanje sa korisnicima.
 */
export async function GET() {
  return NextResponse.json({
    sistem: industrijskiMejlSistem.naziv,
    verzija: APP_VERSION,
    opis: industrijskiMejlSistem.opis,
    ikona: industrijskiMejlSistem.ikona,
    domen: industrijskiMejlSistem.domen,
    ukupnoMejlova: industrijskiMejlSistem.ukupnoMejlova,
    ukupnoDepartmana: industrijskiMejlSistem.ukupnoDepartmana,
    radnoVreme: industrijskiMejlSistem.radnoVreme,
    prosecnoVremeOdgovora: industrijskiMejlSistem.prosecnoVremeOdgovora,
    status: industrijskiMejlSistem.status,
    mejlovi: industrijskiMejlSistem.mejlovi.map((m) => ({
      persona: m.personaNaziv,
      ikona: m.personaIkona,
      mejl: m.mejlAdresa,
      departmani: m.departmani,
      vremeOdgovora: m.prosecnoVremeOdgovora,
    })),
    departmani: industrijskiMejlSistem.departmani.map((d) => ({
      id: d.id,
      naziv: d.naziv,
      ikona: d.ikona,
      mejl: d.glavniMejl,
      osobljeBroj: d.osoblje.length,
    })),
    timestamp: new Date().toISOString(),
  });
}
