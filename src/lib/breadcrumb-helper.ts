// SpajaUltraOmegaCore -∞Ω+∞ — Breadcrumb Schema Helper
// Kompanija SPAJA — Digitalna Industrija
//
// Generiše JSON-LD BreadcrumbList Schema.org za SEO i vizuelne breadcrumbs.
//
// Upotreba:
//   const breadcrumbs = generisiBreadcrumbs('/digitalna-industrija-valutni-rizik');
//   // Vraća: [{ naslov: 'Početna', href: '/' }, { naslov: 'Digitalna Industrija', href: '/industrija' }, ...]

import { BASE_URL } from '@/lib/constants';

export interface BreadcrumbStavka {
  naslov: string;
  href: string;
}

/** Mapa roditeljskih ruta za grupisanje */
const RODITELJI: Record<string, BreadcrumbStavka> = {
  '/digitalna-industrija': { naslov: 'Digitalna Industrija', href: '/industrija' },
  '/laureatski': { naslov: 'Laureatski Signali', href: '/glavni-endzin' },
  '/omega-projekat': { naslov: 'OMEGA Projekat', href: '/omega-ai' },
  '/io-openui-ao': { naslov: 'IO OpenUI AO', href: '/platforme' },
  '/ai-iq-world-bank': { naslov: 'AI IQ World Bank', href: '/ai-iq-world-bank' },
  '/spaja': { naslov: 'SPAJA', href: '/industrija' },
  '/proksi': { naslov: 'Proksi', href: '/proksi' },
  '/gaming': { naslov: 'Gaming', href: '/igrice' },
  '/maksimus': { naslov: 'Maksimus', href: '/maksimus-svega' },
};

/** Naslov za poznate rute */
const NASLOVI: Record<string, string> = {
  '/': 'Početna',
  '/dashboard': 'Dashboard',
  '/industrija': 'Industrija',
  '/platforme': 'Platforme',
  '/omega-ai': 'OMEGA AI',
  '/spaja-pro': 'SpajaPro',
  '/igrice': 'Igrice',
  '/banka': 'Banka',
  '/proksi': 'Proksi',
  '/mobilna-mreza': 'Mobilna Mreža',
  '/ekosistem': 'Ekosistem',
  '/analiza-svega': 'Analiza Svega',
  '/autofinish': 'Autofinish',
  '/moze-sve': 'MOŽE SVE',
  '/sve-od-svega': 'SVE OD SVEGA',
  '/deploy': 'Deploy',
  '/auto-popravka': 'Auto-Popravka',
  '/blockchain': 'Blockchain',
  '/menjacnica': 'Menjačnica',
  '/ai-iq-world-bank': 'AI IQ World Bank',
  '/ai-iq-world-bank-procesiranje': 'AI IQ World Bank Procesiranje',
  '/glavni-endzin': 'Glavni Engine',
  '/blog': 'Blog',
};

/**
 * Generiše niz breadcrumb stavki za datu URL putanju.
 * Uvek počinje sa "Početna" i završava sa trenutnom stranicom.
 */
export function generisiBreadcrumbs(putanja: string): BreadcrumbStavka[] {
  const stavke: BreadcrumbStavka[] = [
    { naslov: 'Početna', href: '/' },
  ];

  // Proveri da li putanja ima roditeljski prefiks
  for (const [prefiks, roditelj] of Object.entries(RODITELJI)) {
    if (putanja.startsWith(prefiks) && putanja !== prefiks && putanja !== roditelj.href) {
      // Dodaj roditeljski page ako nije već tu
      if (roditelj.href !== '/' && !stavke.find((s) => s.href === roditelj.href)) {
        stavke.push(roditelj);
      }
      break;
    }
  }

  // Dodaj trenutnu stranicu
  if (putanja !== '/') {
    const naslov = NASLOVI[putanja] ?? formatujPutanjuKaoNaslov(putanja);
    // Izbegni duplikat ako je roditeljska stranica ista kao trenutna
    if (!stavke.find((s) => s.href === putanja)) {
      stavke.push({ naslov, href: putanja });
    }
  }

  return stavke;
}

/**
 * Generiše JSON-LD BreadcrumbList objekat za Schema.org.
 * Prosleđuje se u <script type="application/ld+json"> tag.
 */
export function generisiBreadcrumbJsonLd(putanja: string): object {
  const stavke = generisiBreadcrumbs(putanja);
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: stavke.map((stavka, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: stavka.naslov,
      item: `${BASE_URL}${stavka.href}`,
    })),
  };
}

/** Formatuje URL slug u čitljiv naslov (npr. 'digitalna-industrija-rizik' → 'Digitalna Industrija Rizik') */
function formatujPutanjuKaoNaslov(putanja: string): string {
  return putanja
    .replace(/^\//, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
