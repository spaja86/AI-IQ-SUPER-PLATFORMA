import type { Sekvenca } from '@/lib/types';
import { platforme } from '@/lib/platforme';

const aktivni = platforme.filter((p) => p.deploy.status === 'aktivan').length;
const uPripremi = platforme.filter((p) => p.deploy.status === 'u_pripremi').length;

export const deploySekvence: Sekvenca[] = [
  {
    id: 'deploy-hero',
    tip: 'hero',
    naslov: '🚀 Deploy Status',
    podnaslov: 'Vercel Produkcija',
    ikona: '🚀',
    redosled: 1,
    podaci: { opis: 'Status deploya svih platformi na Vercel infrastrukturu.' },
  },
  {
    id: 'deploy-statistika',
    tip: 'statistika',
    naslov: 'Deploy pregled',
    redosled: 2,
    podaci: {
      stavke: [
        { naziv: 'Aktivni', vrednost: aktivni, ikona: '✅' },
        { naziv: 'U pripremi', vrednost: uPripremi, ikona: '🔨' },
        { naziv: 'Neaktivni', vrednost: platforme.length - aktivni - uPripremi, ikona: '⏸️' },
        { naziv: 'Ukupno', vrednost: platforme.length, ikona: '🌐' },
      ],
    },
  },
  {
    id: 'deploy-kartice',
    tip: 'kartice',
    naslov: '📦 Deploy status po platformi',
    redosled: 3,
    podaci: {
      kartice: platforme.map((p) => ({
        naslov: p.naziv,
        opis: `Status: ${p.deploy.status} | Framework: ${p.deploy.framework}`,
        ikona: p.ikona,
        progres: p.progres,
        oznake: [p.deploy.status, p.deploy.framework],
      })),
    },
  },
  {
    id: 'deploy-lista',
    tip: 'lista',
    naslov: '📋 Deploy koraci',
    redosled: 4,
    podaci: {
      stavke: [
        { naslov: 'Build', opis: 'npx next build — kompajliranje aplikacije', ikona: '🔨' },
        { naslov: 'Test', opis: 'Verifikacija TypeScript tipova i linting', ikona: '🧪' },
        { naslov: 'Deploy', opis: 'Push na Vercel putem Git integracije', ikona: '🚀' },
        { naslov: 'Verify', opis: 'Provera produkcijskog URL-a i performansi', ikona: '✅' },
      ],
    },
  },
  {
    id: 'deploy-vercel-priklucenje',
    tip: 'tekst',
    naslov: '▲ Vercel Priključenje',
    redosled: 5,
    podaci: {
      sadrzaj: 'Platforma je konfigurisana za deployment na Vercel. Za upravljanje Vercel konekcijom, deployment hook-ovima i ownership prenosom posetite Vercel Priključenje stranicu.',
      istaknuteStavke: [
        'Vercel Status: GET /api/vercel-status — živu status priključenosti',
        'Ručni Deploy: POST /api/brouvzer-deploy { "projekat": "ai-iq" }',
        'Deploy Diagnostics: GET /api/deploy-diagnostics?deploymentId=<id>',
        'Owner Vercel Ownership: GET /api/owner/vercel-ownership',
        'Deploy Platforma Hub: /deploy-platforma — live status, trigger, health check',
      ],
      dugmad: [
        { tekst: 'Vercel Priključenje', href: '/vercel-priklucenje' },
        { tekst: 'Deploy Platforma Hub', href: '/deploy-platforma' },
        { tekst: 'Vercel Status API', href: '/api/vercel-status', stil: 'sekundarno' },
      ],
    },
  },
  {
    id: 'deploy-cta',
    tip: 'cta',
    naslov: '▲ Vercel Deploy',
    redosled: 6,
    podaci: {
      opis: 'Sve platforme se deployuju na Vercel sa automatskim CI/CD.',
      dugmad: [
        { tekst: 'Deploy Platforma Hub', href: '/deploy-platforma' },
        { tekst: 'Dashboard', href: '/dashboard', stil: 'sekundarno' },
        { tekst: 'Vercel Priključenje', href: '/vercel-priklucenje', stil: 'sekundarno' },
        { tekst: 'Pocetna', href: '/', stil: 'sekundarno' },
      ],
    },
  },
];
