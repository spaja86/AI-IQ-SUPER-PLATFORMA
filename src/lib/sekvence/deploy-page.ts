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
    id: 'deploy-cta',
    tip: 'cta',
    naslov: '▲ Vercel Deploy',
    redosled: 5,
    podaci: {
      opis: 'Sve platforme se deployuju na Vercel sa automatskim CI/CD.',
      dugmad: [
        { tekst: 'Dashboard', href: '/dashboard' },
        { tekst: 'Pocetna', href: '/', stil: 'sekundarno' },
      ],
    },
  },
];
