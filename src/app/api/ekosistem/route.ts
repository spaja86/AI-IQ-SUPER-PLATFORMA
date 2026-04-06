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
import { APP_VERSION, AUTOFINISH_COUNT, TOTAL_ROUTES, TOTAL_API_ROUTES } from '@/lib/constants';

export async function GET() {
  const stats = getStatistike();
  const dijagnostika = runDiagnostics();
  const dispatch = getDispatchSummary();
  const aktivneVerzije = getAktivneVerzije();
  const evolucija = getEvolucijskaIstorija();

  return NextResponse.json({
    platforma: 'AI IQ SUPER PLATFORMA',
    kompanija: 'Kompanija SPAJA',
    verzija: APP_VERSION,
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
      ukupnoRuta: TOTAL_ROUTES,
      apiRuta: TOTAL_API_ROUTES,
      igrice: igrice.length,
    },

    // Autofinish
    autofinish: {
      broj: AUTOFINISH_COUNT,
      poslednji: `Autofinish #${AUTOFINISH_COUNT} — v${APP_VERSION}`,
      cilj: '3×10¹⁷',
    },
  });
}
