import { NextResponse } from 'next/server';
import { suportDepartmani, getMejloviPoDepartmanu } from '@/lib/omega-ai-suport-mejlovi';

/**
 * 📧 OMEGA AI Industrijski Suport Mejlovi — Departmani API
 *
 * Svi departmani sa osobljem i kontekstom rada za dopisivanje.
 */
export async function GET() {
  return NextResponse.json({
    sistem: 'OMEGA AI Suport — Departmani',
    ukupnoDepartmana: suportDepartmani.length,
    departmani: suportDepartmani.map((d) => {
      const mejlovi = getMejloviPoDepartmanu(d.id);
      return {
        id: d.id,
        naziv: d.naziv,
        ikona: d.ikona,
        opis: d.opis,
        glavniMejl: d.glavniMejl,
        osobljeBroj: d.osoblje.length,
        mejloviBroj: mejlovi.length,
        kontekst: d.kontekst,
        tipoviUpita: d.tipoviUpita,
        osoblje: mejlovi.map((m) => ({
          persona: m.personaNaziv,
          ikona: m.personaIkona,
          mejl: m.mejlAdresa,
          vremeOdgovora: m.prosecnoVremeOdgovora,
        })),
      };
    }),
    timestamp: new Date().toISOString(),
  });
}
