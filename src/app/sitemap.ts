import { readdirSync, existsSync } from 'fs';
import { join } from 'path';
import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/constants';

// ─── Exclude list ─────────────────────────────────────────────────────────────
// Direktorijumi u src/app koji NISU javne stranice i ne treba da budu u sitemap-u
const EXCLUDE_DIRS = new Set([
  'api',
  'fonts',
  '(auth)',
  '(admin)',
  '_meta',
]);

// ─── Priority config ──────────────────────────────────────────────────────────
const HIGH_PRIORITY = new Set(['/', '/dashboard', '/ekosistem', '/moze-sve', '/sve-od-svega']);
const MEDIUM_HIGH_PRIORITY = new Set([
  '/platforme', '/palasterizacija', '/perkolizonik', '/polimerzacija', '/polimerizacija-2',
  '/harmonizacija', '/kristalizacija', '/vektorizacija', '/sintetizacija', '/rezonancija',
  '/modulacija', '/demodulacija', '/eksosistzdacija', '/omega-ai', '/spaja-pro', '/igrice',
  '/gejming-industrija', '/gejming-likovi', '/it-proizvodi', '/analiza-svega',
  '/maksimus-svega', '/procesuiranje-svega', '/autofinish', '/autofinish-nexus',
]);

// ─── Recently updated pages ───────────────────────────────────────────────────
const RECENTLY_UPDATED = new Set([
  '/', '/dashboard', '/ai-iq-world-bank', '/omega-projekat-plasiranje',
  '/omega-projekat-zvanicno-otvaranje', '/oktavne-eksponencijalne-funkcije', '/blog',
  '/glavni-endzin', '/mozak-logika', '/glavni-sistem-nabavka', '/reklame-i-partnerstva',
  '/dnevna-raspodela-zarade', '/spaja-ultra-repl', '/digitalna-platforma', '/login',
  '/zaboravljena-lozinka', '/oktavni-gpu-ram', '/spaja-digitalni-kompjuter',
  '/digitalni-prozor', '/eksponat-glavnog-jezgra', '/digitalni-vorteks',
  '/generator-za-poslovne-racune', '/validator-poslovnih-racuna', '/licencni-budzet-srbija',
  '/digitalna-industrija-pib-mb', '/digitalna-industrija-sifra-delatnosti',
  '/digitalna-industrija-regulatorni-rokovi', '/digitalna-industrija-izvoz-faktura',
  '/digitalna-industrija-devizni-prilivi', '/digitalna-industrija-devizni-odlivi',
  '/digitalna-industrija-devizni-saldo', '/digitalna-industrija-kursna-lista',
  '/digitalna-industrija-kursne-razlike', '/digitalna-industrija-inflacije',
  '/digitalna-industrija-valutni-rizik', '/digitalna-industrija-hedzing',
  '/digitalna-industrija-kamatni-rizik', '/digitalna-industrija-kreditni-rizik',
  '/digitalna-industrija-likvidnosni-rizik', '/digitalna-industrija-operativni-rizik',
  '/digitalna-industrija-reputacioni-rizik', '/bar-kod',
  '/digitalna-industrija-strateski-rizik', '/digitalna-industrija-pravni-rizik',
  '/digitalna-industrija-poreski-rizik', '/digitalna-industrija-compliance-rizik',
  '/digitalna-industrija-esg-rizik', '/digitalna-industrija-diskriminacija',
  '/digitalna-industrija-sajber-rizik', '/digitalna-industrija-kapitalni-rizik',
  '/digitalna-industrija-pozicije', '/digitalna-industrija-plate',
  '/digitalna-industrija-beneficije', '/digitalna-industrija-nagrade',
  '/digitalna-industrija-licencni-portfolio', '/issuer-license-control-center',
  '/moze-sve', '/sve-od-svega', '/autofinish', '/autofinish-nexus',
  '/protokoli', '/pametni-ugovori', '/spaja-baza-control', '/vercel-priklucenje',
  '/ekstrimli-ekstrem', '/pentracija', '/panetracija-2',
]);

const CORE_ROUTES = new Set([
  '/ekosistem', '/eksosistzdacija', '/omega-ai', '/spaja-pro', '/industrija',
  '/platforme', '/palasterizacija', '/pricing', '/it-proizvodi', '/igrice',
  '/gejming-industrija', '/omega-ai-suport', '/spaja-digitalni-brouvzer',
]);

// ─── Date constants ───────────────────────────────────────────────────────────
const DATE_RECENT = new Date('2026-07-26');
const DATE_CORE = new Date('2026-04-19');
const DATE_STANDARD = new Date('2026-04-14');

/**
 * Automatically discovers all public pages in src/app by scanning for page.tsx files.
 * Excludes API routes, special Next.js directories, and non-page directories.
 */
function discoverPageRoutes(): string[] {
  const appDir = join(process.cwd(), 'src', 'app');
  const routes: string[] = [];

  function scanDir(dir: string, routePrefix: string) {
    let entries: string[];
    try {
      entries = readdirSync(dir, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .map((e) => e.name);
    } catch {
      return;
    }

    for (const entry of entries) {
      if (EXCLUDE_DIRS.has(entry) || entry.startsWith('_') || entry.startsWith('.')) continue;
      const fullPath = join(dir, entry);
      const route = `${routePrefix}/${entry}`;
      if (existsSync(join(fullPath, 'page.tsx'))) {
        routes.push(route);
      }
      // Recurse into subdirectories (but not too deep to avoid [slug] dynamic routes)
      scanDir(fullPath, route);
    }
  }

  // Root page
  if (existsSync(join(appDir, 'page.tsx'))) {
    routes.push('/');
  }

  scanDir(appDir, '');
  return routes.sort();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = discoverPageRoutes();

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: RECENTLY_UPDATED.has(route)
      ? DATE_RECENT
      : CORE_ROUTES.has(route)
        ? DATE_CORE
        : DATE_STANDARD,
    changeFrequency: route === '/' ? ('daily' as const) : ('weekly' as const),
    priority: HIGH_PRIORITY.has(route)
      ? 1
      : MEDIUM_HIGH_PRIORITY.has(route)
        ? 0.9
        : 0.8,
    alternates: {
      languages: {
        'sr-Latn': `${BASE_URL}${route}`,
      },
    },
  }));
}

