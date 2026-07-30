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
  getGamingDomenSnapshot,
} from '@/lib/io-openui-ao-gaming-platforma';

export async function GET() {
  const labStatistika = getLaboratorijaStatistika();
  const aktivnihSim = getAktivneSimulacije().length;
  const gamingSnapshot = getGamingDomenSnapshot();

  return NextResponse.json({
    sistem: 'IO/OPENUI/AO Analitika',
    verzija: APP_VERSION,
    url: gamingSnapshot.konfiguracija.standardniUrl,
    gaming: {
      ukupnoIgrica: endzinNadIgricama.length,
      aktivnihIgrica: gamingSnapshot.statistika.aktivnihIgrica,
      prevucenoEndžinom: gamingSnapshot.statistika.prevucenoEndžinom,
      ukupnoKategorija: gamingSnapshot.statistika.ukupnoKategorija,
      prosecnaOptimizacija: `${gamingSnapshot.statistika.prosecnaOptimizacija}%`,
      domen: gamingSnapshot.konfiguracija.domen,
      healthSignal: gamingSnapshot.healthSignal,
      funkcionalnostObim: gamingSnapshot.funkcionalnostObim,
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
      gamingZdravlje: `${gamingSnapshot.statistika.prosecnaOptimizacija}%`,
      labZdravlje: `${labStatistika.prosecnaPreciznost}%`,
      platformaStatus: gamingSnapshot.status,
    },
    timestamp: new Date().toISOString(),
  });
}
