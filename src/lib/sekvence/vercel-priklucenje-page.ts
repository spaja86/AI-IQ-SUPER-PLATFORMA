// SpajaUltraOmegaCore -∞Ω+∞ — Vercel Priključenje Sekvence
// Kompanija SPAJA — Digitalna Industrija
//
// Sekvence za /vercel-priklucenje stranicu.
// Prikazuje status Vercel konekcije, checklist i uputstvo za priključenje.

import type { Sekvenca } from '@/lib/types';

export const vercelPriključenjeSekvence: Sekvenca[] = [
  {
    id: 'vercel-priklucenje-hero',
    tip: 'hero',
    naslov: '▲ Vercel Priključenje',
    podnaslov: 'Konfiguracija Vercel infrastrukture za AI IQ SUPER PLATFORMA',
    ikona: '▲',
    redosled: 1,
    podaci: {
      opis: 'Upravljanje Vercel deployment infrastrukturom — API token, KV store, deploy hook-ovi, i ownership prenos. Priključite platformu na Vercel produkcijsko okruženje.',
      dugmad: [
        { tekst: 'Deploy', href: '/deploy' },
        { tekst: 'Owner Identity', href: '/api/owner-identity', stil: 'sekundarno' },
        { tekst: 'Vercel Status API', href: '/api/vercel-status', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'vercel-priklucenje-statistika',
    tip: 'statistika',
    naslov: '📊 Vercel Checklist Pregled',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Env Varijable', vrednost: '5+', ikona: '🔑' },
        { naziv: 'Deploy Hook-ovi', vrednost: '3', ikona: '🪝' },
        { naziv: 'Cron Job-ovi', vrednost: '5', ikona: '⏱️' },
        { naziv: 'KV Store', vrednost: '1', ikona: '🗄️' },
      ],
    },
  },
  {
    id: 'vercel-priklucenje-koraci',
    tip: 'lista',
    naslov: '🚀 Koraci Priključenja',
    redosled: 3,
    podaci: {
      stavke: [
        {
          naslov: 'Personal Access Token',
          opis: 'Vercel → Account Settings → Tokens → Create Token → dodaj kao VERCEL_TOKEN env var',
          ikona: '🔑',
        },
        {
          naslov: 'Project ID',
          opis: 'Vercel → Project → Settings → General → Project ID → dodaj kao VERCEL_PROJECT_ID',
          ikona: '🆔',
        },
        {
          naslov: 'GitHub Integracija',
          opis: 'Vercel → Project → Settings → Git → Connect GitHub (spaja86/AI-IQ-SUPER-PLATFORMA, branch: main)',
          ikona: '🔗',
        },
        {
          naslov: 'Vercel KV Store',
          opis: 'Vercel → Storage → Create KV Store → Connect to Project (automatski dodaje KV_REST_API_URL + KV_REST_API_TOKEN)',
          ikona: '🗄️',
        },
        {
          naslov: 'Deploy Hook — AI IQ',
          opis: 'Vercel → Project → Settings → Git → Deploy Hooks → Create Hook (branch: main) → dodaj kao VERCEL_DEPLOY_HOOK_AI_IQ',
          ikona: '🪝',
        },
        {
          naslov: 'Deploy Hook — IO-OPENUI-AO',
          opis: 'Isto za IO-OPENUI-AO projekat → dodaj kao VERCEL_DEPLOY_HOOK_IO_OPENUI_AO',
          ikona: '🪝',
        },
      ],
    },
  },
  {
    id: 'vercel-priklucenje-env',
    tip: 'tekst',
    naslov: '⚙️ Environment Varijable',
    redosled: 4,
    podaci: {
      sadrzaj: 'Sve environment varijable se dodaju u Vercel → Project → Settings → Environment Variables. Važno: varijable treba dodati za sve okruženja (Production, Preview, Development).',
      istaknuteStavke: [
        'VERCEL_TOKEN — Personal Access Token (OBAVEZAN za API pristup)',
        'VERCEL_PROJECT_ID — ID projekta iz Vercel dashboard-a',
        'VERCEL_TEAM_ID — Team/Org ID (opciono, za timske projekte)',
        'KV_REST_API_URL — Vercel KV URL (automatski nakon kreiranja KV store-a)',
        'KV_REST_API_TOKEN — Vercel KV Token (automatski nakon kreiranja KV store-a)',
        'VERCEL_DEPLOY_HOOK_AI_IQ — Deploy Hook URL za AI IQ projekat',
        'VERCEL_DEPLOY_HOOK_IO_OPENUI_AO — Deploy Hook URL za IO-OPENUI-AO',
        'VERCEL_DEPLOY_HOOK_KOMPANIJA — Deploy Hook URL za Kompanija SPAJA',
        'SPAJA_VERCEL_ENTERPRISE_REQUEST_READY — true kada je zahtev spreman',
        'SPAJA_VERCEL_ENTERPRISE_REQUEST_SUBMITTED — true kada je zahtev poslat',
      ],
    },
  },
  {
    id: 'vercel-priklucenje-api',
    tip: 'kartice',
    naslov: '🔌 API Endpoint-i',
    redosled: 5,
    podaci: {
      kartice: [
        {
          naslov: 'Vercel Status',
          opis: 'GET /api/vercel-status — živi status Vercel konekcije i checklist',
          ikona: '📊',
          oznake: ['GET', 'health-check', 'checklist'],
        },
        {
          naslov: 'Brouvzer Deploy',
          opis: 'POST /api/brouvzer-deploy { "projekat": "ai-iq" } — pokretanje deploy hook-a',
          ikona: '🚀',
          oznake: ['POST', 'deploy', 'hook'],
        },
        {
          naslov: 'Owner Vercel Ownership',
          opis: 'GET/POST /api/owner/vercel-ownership — ownership prenos i enterprise request',
          ikona: '👑',
          oznake: ['GET', 'POST', 'ownership'],
        },
        {
          naslov: 'Deploy Diagnostics',
          opis: 'GET /api/deploy-diagnostics — kompletna dijagnostika + vercelPriključenost',
          ikona: '🔍',
          oznake: ['GET', 'diagnostics', 'vercel'],
        },
        {
          naslov: 'Owner Identity',
          opis: 'GET /api/owner-identity — identitet vlasnika + Vercel ownership checklist',
          ikona: '🪪',
          oznake: ['GET', 'owner', 'identity'],
        },
      ],
    },
  },
  {
    id: 'vercel-priklucenje-cron',
    tip: 'lista',
    naslov: '⏱️ Vercel Cron Job-ovi',
    redosled: 6,
    podaci: {
      stavke: [
        {
          naslov: 'Zdravlje',
          opis: '/api/cron/zdravlje — svaki 30 min | Praćenje zdravlja sistema',
          ikona: '🩺',
        },
        {
          naslov: 'Evolucija',
          opis: '/api/cron/evolucija — svaki 6h | Autonomna evolucija platforme',
          ikona: '🧬',
        },
        {
          naslov: 'Protokoli Verifikacija',
          opis: '/api/cron/protokoli-verifikacija — svaki 15 min | Verifikacija protokola',
          ikona: '🔒',
        },
        {
          naslov: 'Ekstremno Procesuiranje',
          opis: '/api/cron/ekstremno-procesuiranje-svega — svaki 20 min | Batch procesuiranje',
          ikona: '⚡',
        },
        {
          naslov: 'Analiza Refresh',
          opis: '/api/analiza-svega-refresh — 10,30,50 min | Osvežavanje analitike',
          ikona: '📊',
        },
      ],
    },
  },
  {
    id: 'vercel-priklucenje-ownership',
    tip: 'tekst',
    naslov: '👑 Vercel Ownership Prenos',
    redosled: 7,
    podaci: {
      sadrzaj: 'Ownership prenos Vercel naloga zahteva telefonsku verifikaciju vlasnika. Nakon verifikacije, šalje se Vercel Enterprise zahtev za prenos naloga.',
      istaknuteStavke: [
        '1. Pokrenuti OTP: POST /api/owner-phone-auth/request-otp',
        '2. Verifikovati OTP: POST /api/owner-phone-auth/verify-otp',
        '3. Označiti spreman: POST /api/owner/vercel-ownership { "akcija": "set-ready" }',
        '4. Kontaktirati Vercel Enterprise tim za ownership prenos',
        '5. Označiti poslato: POST /api/owner/vercel-ownership { "akcija": "set-submitted" }',
        '6. Pratiti status na: /api/owner/vercel-ownership',
      ],
    },
  },
  {
    id: 'vercel-priklucenje-cta',
    tip: 'cta',
    naslov: '▲ Priključite se na Vercel',
    redosled: 8,
    podaci: {
      opis: 'Pratite korake priključenja i konfigurišite sve Vercel env varijable za punu funkcionalnost platforme.',
      dugmad: [
        { tekst: 'Vercel Status', href: '/api/vercel-status' },
        { tekst: 'Deploy', href: '/deploy', stil: 'sekundarno' },
        { tekst: 'Owner Identity', href: '/api/owner-identity', stil: 'sekundarno' },
      ],
    },
  },
];
