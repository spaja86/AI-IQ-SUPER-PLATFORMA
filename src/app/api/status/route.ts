import { NextResponse } from 'next/server';
import { getStatistike } from '@/lib/statistika';
import { runDiagnostics } from '@/lib/auto-repair';
import { getDispatchSummary } from '@/lib/omega-ai-dispatch';
import { getAktivneVerzije, spajaProVerzije } from '@/lib/spaja-pro';
import { getBrojPromptova, getPromptKategorije } from '@/lib/prompt';
import { getDeployStatistike, proksiGitHubDeploySistem } from '@/lib/proksi-github-deploy';
import { APP_VERSION, TOTAL_API_ROUTES, AUTOFINISH_COUNT } from '@/lib/constants';
import { spajaBaza } from '@/lib/spaja-baza';
import { autentifikacijaSistem } from '@/lib/autentifikacija';
import { profesionalniMejlSistem } from '@/lib/spaja-profesionalni-mejl';
import { spajaPlatniSistem } from '@/lib/spaja-platni-sistem';
import { spajaRealtimeSistem } from '@/lib/spaja-realtime';

export async function GET() {
  const stats = getStatistike();
  const diagnostics = runDiagnostics();
  const dispatch = getDispatchSummary();
  const aktivneVerzije = getAktivneVerzije();

  return NextResponse.json({
    status: 'operational',
    platforma: 'AI IQ SUPER PLATFORMA',
    kompanija: 'SPAJA',
    verzija: APP_VERSION,
    arhitektura: 'sekvence + omega-evolucija + proksi + mobilna-mreza + prompt + spajapro + eksterni-sajt + proksi-github-deploy + spaja-baza + autentifikacija + profesionalni-mejl + platni-sistem + realtime',
    timestamp: new Date().toISOString(),
    statistike: stats,
    zdravlje: diagnostics.zdravlje,
    stranice: stats.ukupnoStranica,
    apiRute: TOTAL_API_ROUTES,
    autofinish: AUTOFINISH_COUNT,
    omegaAI: {
      persone: dispatch.ukupnoPersona,
      oktave: dispatch.ukupnoOktava,
      dispatchStatus: dispatch.status,
      promptIntegracija: 'potpuna',
    },
    spajaPro: {
      status: 'aktivan',
      ukupnoVerzija: spajaProVerzije.length,
      aktivnihVerzija: aktivneVerzije.length,
      najnovija: aktivneVerzije[aktivneVerzije.length - 1]?.naziv ?? 'N/A',
      zamenaZa: 'ChatGPT',
      izvor: 'Kompanija-SPAJA',
      integracija: 'IO-OPENUI-AO + AI-IQ-SUPER-PLATFORMA',
    },
    prompt: {
      status: 'aktivan',
      ukupnoPromptova: getBrojPromptova(),
      kategorija: getPromptKategorije().length,
      engine: 'SpajaPro 6-15',
      svuda: true,
    },
    autoPopravka: 'aktivan',
    proksi: {
      status: 'aktivan',
      kapacitet: '10²²⁸ TB',
      topologija: 'hibridna',
    },
    mobilnaMreza: {
      status: 'aktivna',
      pozivniBrojevi: ['+38177', '+38188', '+38178', '+38187'],
      centrale: 4,
      servisi: 5,
      proksiIntegracija: 'potpuna',
    },
    proksiGitHubDeploy: {
      status: 'aktivan',
      verzija: proksiGitHubDeploySistem.verzija,
      spektar: proksiGitHubDeploySistem.spektar,
      baznoDeploySistem: proksiGitHubDeploySistem.baznoDeploySistem,
      proksiIntegracija: proksiGitHubDeploySistem.proksiIntegracija,
      ukupniKapacitet: proksiGitHubDeploySistem.ukupniKapacitet,
      ...getDeployStatistike(),
    },
    backendInfrastruktura: {
      spajaBaza: {
        status: spajaBaza.status,
        kolekcija: spajaBaza.kolekcije.length,
        tip: spajaBaza.tip,
      },
      autentifikacija: {
        status: autentifikacijaSistem.status,
        dozvola: autentifikacijaSistem.dozvole.length,
        oauth: autentifikacijaSistem.konfiguracija.oauthProvajderi,
      },
      profesionalniMejl: {
        status: profesionalniMejlSistem.status,
        sablona: profesionalniMejlSistem.sabloni.length,
        domena: profesionalniMejlSistem.domeni.length,
      },
      platniSistem: {
        status: spajaPlatniSistem.status,
        proizvoda: spajaPlatniSistem.stripeProizvodi.length,
        integracija: 'Stripe',
      },
      realtime: {
        status: spajaRealtimeSistem.status,
        kanala: spajaRealtimeSistem.kanali.length,
        tehnologije: spajaRealtimeSistem.tehnologije,
      },
    },
  });
}
