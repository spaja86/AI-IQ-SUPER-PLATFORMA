import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import {
  simulacije,
  laboratorijskiAlati,
  getAktivneSimulacije,
  getLaboratorijaStatistika,
} from '@/lib/io-openui-ao-laboratorija-simulacije';
import {
  endzinNadIgricama,
  gamingStatistika,
  gamingKonfiguracija,
  IOOPENUIAO_URL,
} from '@/lib/io-openui-ao-gaming-platforma';

export async function GET() {
  const labStatistika = getLaboratorijaStatistika();
  const aktivnihSim = getAktivneSimulacije().length;

  return NextResponse.json({
    sistem: 'IO/OPENUI/AO Analitika',
    verzija: APP_VERSION,
    url: IOOPENUIAO_URL,
    gaming: {
      ukupnoIgrica: endzinNadIgricama.length,
      aktivnihIgrica: gamingStatistika.aktivnihIgrica,
      prevucenoEndžinom: gamingStatistika.prevucenoEndžinom,
      ukupnoKategorija: gamingStatistika.ukupnoKategorija,
      prosecnaOptimizacija: `${gamingStatistika.prosecnaOptimizacija}%`,
      domen: gamingKonfiguracija.domen,
    },
    laboratorija: {
      ukupnoSimulacija: simulacije.length,
      aktivnihSimulacija: aktivnihSim,
      ukupnoAlata: laboratorijskiAlati.length,
      ukupnoKategorija: labStatistika.ukupnoKategorija,
      prosecnaPreciznost: `${labStatistika.prosecnaPreciznost}%`,
    },
    kombinovano: {
      ukupnoModula: endzinNadIgricama.length + simulacije.length + laboratorijskiAlati.length,
      gamingZdravlje: `${gamingStatistika.prosecnaOptimizacija}%`,
      labZdravlje: `${labStatistika.prosecnaPreciznost}%`,
      platformaStatus: 'aktivan',
    },
    timestamp: new Date().toISOString(),
  });
}
