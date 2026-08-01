import type { Sekvenca } from '@/lib/types';
import { deployRegistry } from '@/lib/deploy/deploy-registry';

const ukupno = deployRegistry.length;
const triggable = deployRegistry.filter((p) => p.manualTriggerEnabled).length;
const saHealthCheck = deployRegistry.filter((p) => p.healthUrl !== null).length;

export const deployPlatformaSekvence: Sekvenca[] = [
  {
    id: 'deploy-platforma-hero',
    tip: 'hero',
    naslov: '🚀 Deploy Platforma',
    podnaslov: 'Centralni hub za upravljanje deploymentima',
    ikona: '🚀',
    redosled: 1,
    podaci: {
      opis: 'Unified deploy management surface za sve platforme u ekosistemu. Live Vercel status, ručno pokretanje i audit log u jednom mestu.',
    },
  },
  {
    id: 'deploy-platforma-statistika',
    tip: 'statistika',
    naslov: 'Pregled platformi',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Platforme', vrednost: ukupno, ikona: '🌐' },
        { naziv: 'Triggable', vrednost: triggable, ikona: '🚀' },
        { naziv: 'Health Check', vrednost: saHealthCheck, ikona: '🩺' },
        { naziv: 'API Rute', vrednost: 4, ikona: '🔌' },
      ],
    },
  },
  {
    id: 'deploy-platforma-platforme',
    tip: 'kartice',
    naslov: '📦 Registrovane platforme',
    redosled: 3,
    podaci: {
      kartice: deployRegistry.map((p) => ({
        naslov: p.naziv,
        opis: p.opis,
        ikona: p.ikona,
        oznake: [
          p.framework,
          p.manualTriggerEnabled ? 'manual trigger' : 'auto',
          p.healthUrl ? 'health check' : 'no health check',
        ],
        eksterniLink: p.produktionUrl,
      })),
    },
  },
  {
    id: 'deploy-platforma-api',
    tip: 'lista',
    naslov: '🔌 API Rute',
    redosled: 4,
    podaci: {
      stavke: [
        {
          naslov: 'GET /api/deploy-platforma/status',
          opis: 'Live status svih platformi sa Vercel API-ja',
          ikona: '📊',
        },
        {
          naslov: 'POST /api/deploy-platforma/trigger',
          opis: 'Pokretanje deploymenta (zahteva confirmToken za production)',
          ikona: '🚀',
        },
        {
          naslov: 'GET /api/deploy-platforma/history/[platformId]',
          opis: 'Istorija deploymenta za datu platformu (do 20 stavki)',
          ikona: '📜',
        },
        {
          naslov: 'GET /api/deploy-platforma/health/[platformId]',
          opis: 'HTTP health check prema konfiguriranom health URL-u platforme',
          ikona: '🩺',
        },
      ],
    },
  },
  {
    id: 'deploy-platforma-bezbednost',
    tip: 'tekst',
    naslov: '🛡️ Bezbednost i gating',
    redosled: 5,
    podaci: {
      sadrzaj: 'Deploy platforma koristi višeslojnu zaštitu: rate limiting, CSRF zaštita, IP blocking i production gate token.',
      istaknuteStavke: [
        'Production deploy zahteva confirmToken = DEPLOY_PRODUCTION',
        'Svaki deploy se audit-loguje sa platformId, okruženjem i triggerom',
        'Vercel token validan samo server-side (nikad ne odlazi klijentu)',
        'Deploy hook URL-ovi čuvani isključivo u GitHub Secrets',
        'OMEGA JWT middleware štiti sve trigger endpoint-e',
      ],
    },
  },
  {
    id: 'deploy-platforma-cta',
    tip: 'cta',
    naslov: '🚀 Deploy Management',
    redosled: 6,
    podaci: {
      opis: 'Upravljajte deploymentima svih platformi iz jednog mesta.',
      dugmad: [
        { tekst: 'Deploy Status API', href: '/api/deploy-platforma/status' },
        { tekst: 'Stari Deploy', href: '/deploy', stil: 'sekundarno' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
      ],
    },
  },
];
