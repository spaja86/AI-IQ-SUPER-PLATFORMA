import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import {
  ioOpenUIAOLaboratorija,
  simulacije,
  laboratorijskiAlati,
  getAktivneSimulacije,
  getLaboratorijaStatistika,
} from '@/lib/io-openui-ao-laboratorija-simulacije';
import {
  ioOpenUIAOGamingPlatforma,
  endzinNadIgricama,
  gamingStatistika,
  gamingKonfiguracija,
  IOOPENUIAO_URL,
} from '@/lib/io-openui-ao-gaming-platforma';

export async function GET() {
  const labStatistika = getLaboratorijaStatistika();
  const aktivnihSim = getAktivneSimulacije().length;

  return NextResponse.json({
    sistem: 'IO/OPENUI/AO Platforma — Kompletan Pregled',
    verzija: APP_VERSION,
    url: IOOPENUIAO_URL,
    domen: gamingKonfiguracija.domen,
    status: 'aktivan',
    gamingPlatforma: {
      naziv: ioOpenUIAOGamingPlatforma.naziv,
      verzija: ioOpenUIAOGamingPlatforma.verzija,
      ukupnoIgrica: endzinNadIgricama.length,
      aktivnihIgrica: gamingStatistika.aktivnihIgrica,
      prevucenoEndžinom: gamingStatistika.prevucenoEndžinom,
      ukupnoKategorija: gamingStatistika.ukupnoKategorija,
      prosecnaOptimizacija: `${gamingStatistika.prosecnaOptimizacija}%`,
      igrice: endzinNadIgricama.map((e) => ({
        naziv: e.igricaNaziv,
        kategorija: e.igricaKategorija,
        endzinId: e.endzinId,
        optimizacija: `${e.optimizacija}%`,
      })),
    },
    laboratorija: {
      naziv: ioOpenUIAOLaboratorija.naziv,
      verzija: ioOpenUIAOLaboratorija.verzija,
      ukupnoSimulacija: simulacije.length,
      aktivnihSimulacija: aktivnihSim,
      ukupnoAlata: laboratorijskiAlati.length,
      prosecnaPreciznost: `${labStatistika.prosecnaPreciznost}%`,
      simulacije: simulacije.map((s) => ({
        naziv: s.naziv,
        kategorija: s.kategorija,
        status: s.status,
        preciznost: `${s.preciznost}%`,
      })),
      alati: laboratorijskiAlati.map((a) => ({
        naziv: a.naziv,
        tip: a.tip,
        ikona: a.ikona,
      })),
    },
    endpointi: [
      '/api/io-openui-ao-gaming-platforma',
      '/api/io-openui-ao-gaming-platforma-pregled',
      '/api/io-openui-ao-gaming-platforma-igrice',
      '/api/io-openui-ao-gaming-platforma-endzin',
      '/api/io-openui-ao-gaming-platforma-status',
      '/api/io-openui-ao-laboratorija',
      '/api/io-openui-ao-laboratorija-alati',
      '/api/io-openui-ao-laboratorija-pregled',
      '/api/io-openui-ao-laboratorija-simulacije',
      '/api/io-openui-ao-laboratorija-status',
      '/api/io-openui-ao-analitika',
      '/api/io-openui-ao-pregled',
    ],
    timestamp: new Date().toISOString(),
  });
}
