import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { itProizvodiSekvence } from '@/lib/sekvence/it-proizvodi-page';
import { BASE_URL } from '@/lib/constants';

const OG_IMAGE_URL = `${BASE_URL}/api/og?title=${encodeURIComponent('IT Proizvodi')}&description=${encodeURIComponent('Svi IT proizvodi digitalne industrije')}`;

export const metadata: Metadata = {
  title: 'IT Proizvodi',
  description: 'Svi IT proizvodi digitalne industrije',
  openGraph: {
    title: 'IT Proizvodi — AI IQ SUPER PLATFORMA',
    description: 'Svi IT proizvodi digitalne industrije',
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: 'IT Proizvodi — Digitalna Industrija' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IT Proizvodi — AI IQ SUPER PLATFORMA',
    description: 'Svi IT proizvodi digitalne industrije',
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: 'IT Proizvodi — Digitalna Industrija' }],
  },
};

const jsonLdProduct = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'IT Proizvodi — Digitalna Industrija',
  description: 'Svi IT proizvodi digitalne industrije — Kompanija SPAJA',
  brand: { '@type': 'Organization', name: 'Kompanija SPAJA' },
  url: `${BASE_URL}/it-proizvodi`,
};

export default function ITProizvodi() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduct) }}
      />
      <StranicaRenderer sekvence={itProizvodiSekvence} />
    </>
  );
}
