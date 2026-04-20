import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { promptSekvence } from '@/lib/sekvence/prompt-page';
import SpajaProPromptKonzolaWrapper from '@/components/SpajaProPromptKonzolaWrapper';
import SpajaProPromptAppWrapper from '@/components/SpajaProPromptAppWrapper';
import { APP_VERSION, BASE_URL, KOMPANIJA, SPAJA_PRO_RANGE } from '@/lib/constants';

const OG_IMAGE_URL = `${BASE_URL}/api/og?title=${encodeURIComponent('SpajaPro Prompt Aplikacija')}&description=${encodeURIComponent(`Centralna Prompt Aplikacija — SpajaPro v${SPAJA_PRO_RANGE} Engine`)}`;

export const metadata: Metadata = {
  title: 'Prompt Aplikacija — SpajaPro v6-15',
  description: `Centralna Prompt Aplikacija sa SpajaPro v${SPAJA_PRO_RANGE} engine-om — Builder, Biblioteka, AI Chat, Analitika`,
  openGraph: {
    title: 'SpajaPro Prompt Aplikacija',
    description: `Centralna Prompt Aplikacija sa SpajaPro v${SPAJA_PRO_RANGE} engine-om`,
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: 'SpajaPro Prompt Aplikacija' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpajaPro Prompt Aplikacija',
    description: `Centralna Prompt Aplikacija sa SpajaPro v${SPAJA_PRO_RANGE} engine-om`,
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: 'SpajaPro Prompt Aplikacija' }],
  },
};

const jsonLdSoftware = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SpajaPro Prompt Aplikacija',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web',
  softwareVersion: APP_VERSION,
  description: `Centralna Prompt Aplikacija — SpajaPro v${SPAJA_PRO_RANGE} — Builder, Biblioteka, AI Chat, Analitika`,
  author: { '@type': 'Organization', name: KOMPANIJA },
  url: `${BASE_URL}/prompt`,
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '0',
    highPrice: '999',
    priceCurrency: 'USD',
  },
};

export default function PromptPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
      />
      <SpajaProPromptAppWrapper />
      <SpajaProPromptKonzolaWrapper />
      <StranicaRenderer sekvence={promptSekvence} />
    </>
  );
}
