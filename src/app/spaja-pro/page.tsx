import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { spajaProSekvence } from '@/lib/sekvence/spaja-pro-page';
import SpajaProPromptKonzolaWrapper from '@/components/SpajaProPromptKonzolaWrapper';
import { APP_VERSION, BASE_URL, KOMPANIJA } from '@/lib/constants';

const OG_IMAGE_URL = `${BASE_URL}/api/og?title=${encodeURIComponent('SpajaPro Engine')}&description=${encodeURIComponent('SpajaPro Engine verzije 6-15 sa aktivnim Prompt UI-jem')}`;

export const metadata: Metadata = {
  title: 'SpajaPro Engine — Prompt Konzola',
  description: 'SpajaPro Engine verzije 6-15 sa aktivnim Prompt UI-jem',
  openGraph: {
    title: 'SpajaPro Engine — Prompt Konzola',
    description: 'SpajaPro Engine verzije 6-15 sa aktivnim Prompt UI-jem',
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: 'SpajaPro Engine — AI Prompt Konzola' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpajaPro Engine — Prompt Konzola',
    description: 'SpajaPro Engine verzije 6-15 sa aktivnim Prompt UI-jem',
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: 'SpajaPro Engine — AI Prompt Konzola' }],
  },
};

const jsonLdSoftware = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SpajaPro Engine',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  softwareVersion: APP_VERSION,
  description: 'SpajaPro Prompt Engine verzije 6-15 — multifunkcionalni AI endžin sa beskonačnim sesijama',
  author: { '@type': 'Organization', name: KOMPANIJA },
  url: `${BASE_URL}/spaja-pro`,
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '29',
    highPrice: '999',
    priceCurrency: 'USD',
  },
};

import SpajaChatInterface from '@/components/SpajaChatInterface';

export default function SpajaProPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
      />
      <StranicaRenderer sekvence={spajaProSekvence} />
      <SpajaChatInterface />
      <SpajaProPromptKonzolaWrapper />
    </>
  );
}
