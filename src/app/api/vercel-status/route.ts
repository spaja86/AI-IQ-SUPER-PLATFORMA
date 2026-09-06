/**
 * GET /api/vercel-status
 *
 * Živi status Vercel priključenosti:
 *  - Da li su VERCEL_TOKEN i VERCEL_PROJECT_ID postavljeni
 *  - Da li KV store odgovara
 *  - Status poslednjeg deploymenta (ako je VERCEL_DEPLOYMENT_ID dostupan)
 *  - Checklist konfiguracije
 *
 * Autofinish — VERCEL PRIKLJUČENJE
 */

import { NextResponse } from 'next/server';
import { APP_VERSION, OWNER_PHONE_DEFAULT, OWNER_PHONE_NUMBER_ENV_KEY } from '@/lib/constants';
import { getVercelHealthCheck, probeVercelDeployment } from '@/lib/deploy-diagnostics';
import { FUNNEL_EVENTS } from '@/lib/analytics-events';
import { getOwnerPhoneVerifikacijaStatus } from '@/lib/owner-phone-auth';

export const dynamic = 'force-dynamic';

export function resolveOwnerPhone(env: Record<string, string | undefined>): string {
  const configuredPhone = env[OWNER_PHONE_NUMBER_ENV_KEY]?.trim();
  return configuredPhone && configuredPhone.length > 0 ? configuredPhone : OWNER_PHONE_DEFAULT;
}

export function buildVercelPretplataStatus(
  env: Record<string, string | undefined>,
  {
    tokenKonfigurisan,
    projectIdKonfigurisan,
    phoneVerified,
  }: {
    tokenKonfigurisan: boolean;
    projectIdKonfigurisan: boolean;
    phoneVerified: boolean;
  },
) {
  const enterpriseRequestReady = /^(1|true|yes)$/i.test(env.SPAJA_VERCEL_ENTERPRISE_REQUEST_READY ?? '');
  const enterpriseRequestRequested = /^(1|true|yes)$/i.test(env.SPAJA_VERCEL_ENTERPRISE_REQUESTED ?? '');
  const enterpriseRequestSubmitted = /^(1|true|yes)$/i.test(env.SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED ?? '');
  const enterpriseRequestStarted = enterpriseRequestRequested || enterpriseRequestSubmitted;
  const teamConfigured =
    Boolean(env.VERCEL_TEAM_ID?.trim())
    || Boolean(env.VERCEL_ORG_ID?.trim());
  const blokatori = [
    ...(!tokenKonfigurisan ? ['Nedostaje VERCEL_TOKEN.'] : []),
    ...(!projectIdKonfigurisan ? ['Nedostaje VERCEL_PROJECT_ID.'] : []),
    ...(!teamConfigured ? ['Nedostaje VERCEL_TEAM_ID ili VERCEL_ORG_ID.'] : []),
    ...(!phoneVerified ? ['Telefon vlasnika nije verifikovan (OTP).'] : []),
    ...(!enterpriseRequestReady ? ['Enterprise zahtev nije označen kao spreman (set-ready).'] : []),
    ...(!enterpriseRequestStarted ? ['Enterprise zahtev nije pokrenut (REQUESTED/SUBMITTED).'] : []),
    ...(!enterpriseRequestSubmitted ? ['Enterprise zahtev nije označen kao poslat (set-submitted).'] : []),
  ];

  return {
    status: blokatori.length === 0 ? 'service-active' : 'blocked-until-validated',
    blokatori,
    ownership: {
      phoneVerified,
      enterpriseRequestReady,
      enterpriseRequestRequested,
      enterpriseRequestSubmitted,
    },
    sledeciKoraci: [
      'POST /api/owner-phone-auth/request-otp',
      'POST /api/owner-phone-auth/verify-otp',
      'POST /api/owner/vercel-ownership { "akcija": "set-ready" }',
      'POST /api/owner/vercel-ownership { "akcija": "set-submitted" }',
    ],
  };
}

export async function GET() {
  const health = await getVercelHealthCheck();
  const env = process.env as Record<string, string | undefined>;
  const phone = resolveOwnerPhone(env);
  const phoneVerified = getOwnerPhoneVerifikacijaStatus(phone) === 'verifikovan';
  const pretplataVercel = buildVercelPretplataStatus(env, {
    tokenKonfigurisan: health.tokenKonfigurisan,
    projectIdKonfigurisan: health.projectIdKonfigurisan,
    phoneVerified,
  });

  // Pokušaj dohvatiti deployment ID iz Vercel env (automatski postavljeno)
  const deploymentId = process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_GIT_COMMIT_SHA;
  const vercelProbe = deploymentId
    ? await probeVercelDeployment(deploymentId)
    : null;

  const checklist = {
    tokenKonfigurisan: {
      status: health.tokenKonfigurisan,
      opis: 'VERCEL_TOKEN env varijabla',
      uputstvo: 'Vercel → Account Settings → Tokens → Create Token',
    },
    projectIdKonfigurisan: {
      status: health.projectIdKonfigurisan,
      opis: 'VERCEL_PROJECT_ID env varijabla',
      uputstvo: 'Vercel → Project → Settings → General → Project ID',
    },
    kvKonfigurisan: {
      status: health.kvKonfigurisan,
      opis: 'Vercel KV store (KV_REST_API_URL + KV_REST_API_TOKEN)',
      uputstvo: 'Vercel → Storage → Create KV Store → Connect to Project',
    },
    kvOdgovara: {
      status: health.kvOdgovara,
      opis: 'KV store je dostupan i odgovara na ping',
      uputstvo: health.kvKonfigurisan ? 'Proverite KV store u Vercel dashboard-u' : 'Prvo konfigurisati KV store',
    },
    deployHookKonfigurisan: {
      status: Boolean(process.env.VERCEL_DEPLOY_HOOK_AI_IQ),
      opis: 'VERCEL_DEPLOY_HOOK_AI_IQ (za ručni deploy trigger)',
      uputstvo: 'Vercel → Project → Settings → Git → Deploy Hooks → Create Hook',
    },
  };

  const ukupnoKonfigurisan = Object.values(checklist).filter((c) => c.status).length;
  const ukupnoProvera = Object.keys(checklist).length;

  // Analytics event (pasivno — ne blokira odgovor)
  const eventTip = health.vercelPriključeno
    ? FUNNEL_EVENTS.VERCEL_CONNECTED
    : FUNNEL_EVENTS.ERROR_ENCOUNTERED;

  return NextResponse.json({
    status: health.vercelPriključeno ? 'priključeno' : 'nije-priključeno',
    vercelPriključeno: health.vercelPriključeno,
    verzija: APP_VERSION,
    checklist,
    progres: {
      konfigurisan: ukupnoKonfigurisan,
      ukupno: ukupnoProvera,
      procenat: Math.round((ukupnoKonfigurisan / ukupnoProvera) * 100),
    },
    deployment: vercelProbe
      ? {
          deploymentId,
          status: vercelProbe.status,
          url: vercelProbe.url,
          available: vercelProbe.available,
          signal: vercelProbe.signal,
        }
      : null,
    pretplataVercel,
    uputstvo: {
      korak1: 'Kreirati Personal Access Token na Vercel → Account Settings → Tokens',
      korak2: 'Dodati VERCEL_TOKEN u Vercel → Project → Settings → Environment Variables',
      korak3: 'Dodati VERCEL_PROJECT_ID iz Vercel → Project → Settings → General',
      korak4: 'Kreirati KV Store: Vercel → Storage → Create KV Store',
      korak5: 'Kreirati Deploy Hook: Vercel → Project → Settings → Git → Deploy Hooks',
    },
    analyticsEvent: eventTip,
    timestamp: new Date().toISOString(),
  }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-App-Version': APP_VERSION,
    },
  });
}
