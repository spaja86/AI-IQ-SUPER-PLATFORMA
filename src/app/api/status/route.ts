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
import { getOperativnaSpremnost } from '@/lib/kompanija-spaja-operativa';
import { buildEkstremnoProcesuiranjeSvega } from '@/lib/procesuiranje-svega';

export async function GET() {
  const stats = getStatistike();
  const diagnostics = runDiagnostics();
  const dispatch = getDispatchSummary();
  const aktivneVerzije = getAktivneVerzije();
  const operativa = getOperativnaSpremnost();
  const ekstremno = buildEkstremnoProcesuiranjeSvega();

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
    analizaSvega: {
      sourceOfTruth: '/api/analiza-svega',
      contractVersion: 'v2',
      modelVersion: '2.0.0',
    },
    potencijalSvegaOvogaDoSada: {
      sourceOfTruth: '/api/potencijal-svega-ovoga-do-sada',
      contractVersion: 'v1',
      modelVersion: '1.0.0',
    },
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
    operativa: {
      status: operativa.spremnost.status,
      ukupanScore: operativa.spremnost.ukupanScore,
      modelStanja: operativa.spremnost.modelStanja,
      acceptanceCriteria: operativa.spremnost.acceptanceCriteria,
      primarniNalog: operativa.primarniOperativniNalog.email,
      fallbackKontakt: operativa.primarniOperativniNalog.email,
      javniKontakti: operativa.javniKontakti.map((kanal) => ({
        id: kanal.id,
        email: kanal.email,
        rokOdgovora: kanal.rokOdgovora,
        status: kanal.status,
      })),
      mail: operativa.spremnost.mail,
      vercel: {
        ...operativa.spremnost.vercel,
        primarniPosiljalac: operativa.vercelEnterprisePaket.primarniPosiljalac,
        trazeneOpcije: operativa.vercelEnterprisePaket.trazeneOpcije,
      },
      github: {
        ...operativa.spremnost.github,
        owner: operativa.githubGovernanceModel.owner,
        billingOwner: operativa.githubGovernanceModel.billingOwner,
      },
      support: operativa.spremnost.support,
      enterprise: operativa.spremnost.enterprise,
      kastlerTv: operativa.spremnost.kastlerTv,
      enterpriseZahtevi: operativa.enterpriseZahtevi.map((paket) => ({
        id: paket.id,
        podtip: paket.podtip,
        provajder: paket.provajder,
        status: paket.status,
        posiljalac: paket.posiljalac,
        kanal: paket.kanalPodnosenja.url,
      })),
      enterprisePodzahtevi: operativa.enterprisePodzahtevi.map((paket) => ({
        id: paket.id,
        podtip: paket.podtip,
        provajder: paket.provajder,
        status: paket.status,
        envSignal: paket.envSignal,
        kanal: paket.kanalPodnosenja.url,
      })),
      missingEnv: operativa.spremnost.missingEnv,
      missingKastlerEnv: operativa.spremnost.missingKastlerEnv,
      missingVercelEnv: operativa.spremnost.missingVercelEnv,
      missingVercelCdnEnv: operativa.spremnost.missingVercelCdnEnv,
      kastlerTvPaket: {
        id: operativa.kastlerTvPaket.id,
        statusRikvesta: operativa.kastlerTvPaket.statusRikvesta,
        signalLifecycle: operativa.kastlerTvPaket.signalLifecycle,
        monetizacijaStatus: operativa.kastlerTvPaket.monetizacijaStatus,
        trazenihKanala: operativa.kastlerTvPaket.trazeniKanali.length,
      },
    },
    ekstremnoProcesuiranje: {
      sourceOfTruth: '/api/ekstremno-procesuiranje-svega',
      contractVersion: ekstremno.meta.contractVersion,
      modelVersion: ekstremno.meta.modelVersion,
      ukupanProcenat: ekstremno.ukupanProcenat,
      queueDepth: ekstremno.scheduler.queueDepth,
      saturacijaPct: ekstremno.scheduler.saturacijaPct,
      fairnessIndex: ekstremno.scheduler.fairnessIndex,
      starvationRizik: ekstremno.scheduler.starvationRizik,
      emergencyOverride: ekstremno.scheduler.emergencyOverride,
      degraded: ekstremno.meta.degraded,
    },
  });
}
