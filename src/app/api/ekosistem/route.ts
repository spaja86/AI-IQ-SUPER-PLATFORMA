import { NextResponse } from 'next/server';
import { getStatistike } from '@/lib/statistika';
import { runDiagnostics } from '@/lib/auto-repair';
import { getDispatchSummary } from '@/lib/omega-ai-dispatch';
import { getAktivneVerzije } from '@/lib/spaja-pro';
import { getBrojPromptova, getPromptKategorije } from '@/lib/prompt';
import { getEvolucijskaIstorija } from '@/lib/evolucija';
import { platforme } from '@/lib/platforme';
import { igrice } from '@/lib/igrice';
import { navigation } from '@/lib/navigation';

export async function GET() {
  const stats = getStatistike();
  const dijagnostika = runDiagnostics();
  const dispatch = getDispatchSummary();
  const aktivneVerzije = getAktivneVerzije();
  const evolucija = getEvolucijskaIstorija();

  return NextResponse.json({
    platforma: 'AI IQ SUPER PLATFORMA',
    kompanija: 'Kompanija SPAJA',
    verzija: '6.6.0',
    status: 'operational',
    timestamp: new Date().toISOString(),

    // Ekosistem pregled
    ekosistem: {
      platforme: {
        ukupno: stats.ukupnoPlatformi,
        aktivnih: stats.aktivnihPlatformi,
        spremnih: stats.spremnihPlatformi,
        uRazvoju: stats.platformeURazvoju,
        lista: platforme.map((p) => ({
          id: p.id,
          naziv: p.naziv,
          status: p.status,
          progres: p.progres,
          kategorija: p.kategorija,
        })),
      },
      proizvodi: stats.ukupnoProizvoda,
      igrice: {
        ukupno: stats.ukupnoIgrica,
        kategorija: stats.kategorijaIgrica,
      },
      omegaAI: {
        persone: dispatch.ukupnoPersona,
        aktivnih: stats.aktivnihOmegaPersona,
        oktave: dispatch.ukupnoOktava,
        status: dispatch.status,
      },
      spajaPro: {
        verzija: aktivneVerzije.length,
        najnovija: aktivneVerzije[aktivneVerzije.length - 1]?.naziv ?? 'N/A',
      },
      prompt: {
        ukupno: getBrojPromptova(),
        kategorija: getPromptKategorije().length,
      },
    },

    // Zdravlje
    zdravlje: {
      procenat: dijagnostika.zdravlje,
      provere: dijagnostika.ukupnoProvera,
      uspesnih: dijagnostika.uspesnih,
      upozorenja: dijagnostika.upozorenja,
      gresaka: dijagnostika.gresaka,
    },

    // Evolucija
    evolucija: {
      ukupnoCiklusa: evolucija.ukupnoCiklusa,
      uspesnihCiklusa: evolucija.uspesnihCiklusa,
      poslednjiCiklus: evolucija.poslednjiCiklus,
      sledeciCiklus: evolucija.sledeciCiklus,
    },

    // Navigacija
    navigacija: {
      stranice: navigation.length,
      ukupnoRuta: 43,
      igrice: igrice.length,
    },

    // Autofinish
    autofinish: {
      broj: 9,
      poslednji: 'Autofinish #9 — v6.6.0',
    },
  });
}
