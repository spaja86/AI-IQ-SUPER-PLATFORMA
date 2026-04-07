import { NextResponse } from 'next/server';
import { industrijskiMejlSistem, getSviMejlovi, getSviDepartmanskiMejlovi } from '@/lib/omega-ai-suport-mejlovi';

/**
 * 📧 OMEGA AI Industrijski Suport Mejlovi — Detaljan Pregled API
 *
 * Detaljan pregled svih mejlova, departmana, konteksta rada i tipova upita.
 */
export async function GET() {
  return NextResponse.json({
    sistem: 'OMEGA AI Suport Mejlovi — Detaljan Pregled',
    domen: industrijskiMejlSistem.domen,
    sviPersonalniMejlovi: getSviMejlovi(),
    sviDepartmanskiMejlovi: getSviDepartmanskiMejlovi(),
    mejloviDetalji: industrijskiMejlSistem.mejlovi.map((m) => ({
      persona: m.personaNaziv,
      ikona: m.personaIkona,
      mejl: m.mejlAdresa,
      departmani: m.departmani,
      opis: m.opis,
      kontekstRada: m.kontekstRada,
      radnoVreme: m.radnoVreme,
      vremeOdgovora: m.prosecnoVremeOdgovora,
      aktivan: m.aktivan,
    })),
    departmaniDetalji: industrijskiMejlSistem.departmani.map((d) => ({
      id: d.id,
      naziv: d.naziv,
      ikona: d.ikona,
      mejl: d.glavniMejl,
      opis: d.opis,
      osoblje: d.osoblje,
      kontekst: d.kontekst,
      tipoviUpita: d.tipoviUpita,
    })),
    timestamp: new Date().toISOString(),
  });
}
