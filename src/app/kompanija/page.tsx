import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { kompanijaSekvence } from '@/lib/sekvence/kompanija-page';
import { BASE_URL, KOMPANIJA } from '@/lib/constants';

const OG_IMAGE_URL = `${BASE_URL}/api/og?title=${encodeURIComponent(KOMPANIJA)}&description=${encodeURIComponent('O maticnoj kompaniji SPAJA - Digitalna Industrija')}`;

export const metadata: Metadata = {
  title: KOMPANIJA,
  description: `O matičnoj kompaniji SPAJA — Digitalna Industrija`,
  openGraph: {
    title: KOMPANIJA,
    description: 'O matičnoj kompaniji SPAJA — Digitalna Industrija',
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: `${KOMPANIJA} — Digitalna Industrija` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: KOMPANIJA,
    description: 'O matičnoj kompaniji SPAJA — Digitalna Industrija',
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: `${KOMPANIJA} — Digitalna Industrija` }],
  },
};

const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: KOMPANIJA,
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.ico`,
  description: `Digitalna Industrija — ${KOMPANIJA}. SpajaPro Prompt Engine, OMEGA AI, Proksi mreža.`,
  foundingDate: '2024',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'support@spaja.rs',
    availableLanguage: ['Serbian', 'English'],
  },
  sameAs: [BASE_URL],
};

export default function KompanijaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
      />
      <StranicaRenderer sekvence={kompanijaSekvence} />
    </>
  );
}
