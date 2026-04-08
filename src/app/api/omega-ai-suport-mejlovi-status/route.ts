import { NextResponse } from 'next/server';
import { industrijskiMejlSistem, getAktivniMejlovi, getUkupnoOsoblja } from '@/lib/omega-ai-suport-mejlovi';

/**
 * 📧 OMEGA AI Industrijski Suport Mejlovi — Status API
 *
 * Zdravlje i status sistema industrijskih suport mejlova.
 */
export async function GET() {
  const aktivni = getAktivniMejlovi();

  return NextResponse.json({
    sistem: 'OMEGA AI Suport Mejlovi — Status',
    status: industrijskiMejlSistem.status,
    zdravlje: {
      ukupnoMejlova: industrijskiMejlSistem.ukupnoMejlova,
      aktivnihMejlova: aktivni.length,
      neaktivnihMejlova: industrijskiMejlSistem.ukupnoMejlova - aktivni.length,
      ukupnoDepartmana: industrijskiMejlSistem.ukupnoDepartmana,
      ukupnoOsoblja: getUkupnoOsoblja(),
      domen: industrijskiMejlSistem.domen,
      radnoVreme: industrijskiMejlSistem.radnoVreme,
      prosecnoVremeOdgovora: industrijskiMejlSistem.prosecnoVremeOdgovora,
    },
    sviAktivni: aktivni.length === industrijskiMejlSistem.ukupnoMejlova,
    timestamp: new Date().toISOString(),
  });
}
