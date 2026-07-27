import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { ekslatacijaProizvodaSekvence } from '@/lib/sekvence/ekslatacija-proizvoda-page';
import { BASE_URL, APP_NAME, KOMPANIJA } from '@/lib/constants';

const OG_IMAGE_URL = `${BASE_URL}/api/og?title=${encodeURIComponent('Ekslatacija Proizvoda')}&description=${encodeURIComponent('Komercijalni lifecycle IT proizvoda Digitalne Industrije')}`;

export const metadata: Metadata = {
  title: 'Ekslatacija Proizvoda',
  description: `Komercijalni lifecycle IT proizvoda Digitalne Industrije — faze ekslatacije, modeli, kanali i potencijal prihoda — ${KOMPANIJA}`,
  openGraph: {
    title: `Ekslatacija Proizvoda — ${APP_NAME}`,
    description: 'Komercijalni lifecycle IT proizvoda Digitalne Industrije',
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: 'Ekslatacija Proizvoda — Digitalna Industrija',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Ekslatacija Proizvoda — ${APP_NAME}`,
    description: 'Komercijalni lifecycle IT proizvoda Digitalne Industrije',
    images: [
      {
        url: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: 'Ekslatacija Proizvoda — Digitalna Industrija',
      },
    ],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Ekslatacija Proizvoda — Digitalna Industrija',
  description: `Komercijalni lifecycle IT proizvoda — ${KOMPANIJA}`,
  url: `${BASE_URL}/ekslatacija-proizvoda`,
  provider: { '@type': 'Organization', name: KOMPANIJA },
};

export default function EkslatacijaProizvoda() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StranicaRenderer sekvence={ekslatacijaProizvodaSekvence} />
    </>
  );
}
