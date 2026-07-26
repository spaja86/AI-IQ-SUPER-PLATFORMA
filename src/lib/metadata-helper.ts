// SpajaUltraOmegaCore -∞Ω+∞ — Metadata Generator Helper
// Kompanija SPAJA — Digitalna Industrija
//
// Generisanje standardizovanih Next.js Metadata objekata za sve stranice.
// Automatski generiše OG tags, Twitter cards i canonical URL.
//
// Upotreba:
//   export const metadata = generisiMetadata('Naslov Stranice', 'Opis stranice', '/putanja');

import type { Metadata } from 'next';
import { BASE_URL, APP_NAME, KOMPANIJA } from '@/lib/constants';

interface MetadataOpcije {
  /** Naslov stranice (prikazuje se kao "Naslov | APP_NAME") */
  naslov: string;
  /** Kratki opis za meta description, OG i Twitter */
  opis: string;
  /** URL putanja stranice (npr. '/dashboard') — koristi se za canonical URL i OG URL */
  putanja: string;
  /** Opcioni custom OG image URL — ako nije prosleđen, generiše se automatski iz /api/og */
  ogSlikaUrl?: string;
  /** Opciono: ne dodavaj sufiks "| APP_NAME" naslovu */
  bezSufiksa?: boolean;
}

/**
 * Generiše standardizovani Metadata objekat za Next.js App Router.
 * Uključuje OG tags, Twitter cards i canonical URL.
 */
export function generisiMetadata({
  naslov,
  opis,
  putanja,
  ogSlikaUrl,
  bezSufiksa = false,
}: MetadataOpcije): Metadata {
  const puniNaslov = bezSufiksa ? naslov : `${naslov} | ${APP_NAME}`;
  const canonicalUrl = `${BASE_URL}${putanja}`;
  const ogSlika =
    ogSlikaUrl ??
    `${BASE_URL}/api/og?title=${encodeURIComponent(naslov)}&description=${encodeURIComponent(opis)}`;

  return {
    title: puniNaslov,
    description: opis,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'sr-Latn': canonicalUrl,
      },
    },
    openGraph: {
      title: puniNaslov,
      description: opis,
      url: canonicalUrl,
      siteName: `${APP_NAME} — ${KOMPANIJA}`,
      images: [
        {
          url: ogSlika,
          width: 1200,
          height: 630,
          alt: naslov,
        },
      ],
      locale: 'sr_Latn',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: puniNaslov,
      description: opis,
      images: [{ url: ogSlika, width: 1200, height: 630, alt: naslov }],
    },
  };
}
