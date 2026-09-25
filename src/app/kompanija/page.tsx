import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { kompanijaSekvence } from '@/lib/sekvence/kompanija-page';
import { BASE_URL, KOMPANIJA } from '@/lib/constants';
import { getKontaktKanal } from '@/lib/kompanija-spaja-operativa';
import { osnivacProfil } from '@/lib/vizuelni-identitet';

const PAGE_TITLE = `${osnivacProfil.punoIme} — ${osnivacProfil.titula} | ${KOMPANIJA}`;
const PAGE_DESCRIPTION =
  `${osnivacProfil.punoIme} je osnivač i CEO Kompanije SPAJA i nosilac Digitalne Industrije — profesionalan profil sa pregledom projekata, platformi, AI sistema i poslovne saradnje.`;
const OG_IMAGE_URL = `${BASE_URL}/api/og?title=${encodeURIComponent(osnivacProfil.punoIme)}&description=${encodeURIComponent('Osnivač, developer i kreator digitalnog ekosistema Kompanije SPAJA')}`;
const supportKontakt = getKontaktKanal('support');
const businessKontakt = getKontaktKanal('business');

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: `${osnivacProfil.punoIme} — ${KOMPANIJA}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: `${osnivacProfil.punoIme} — ${KOMPANIJA}` }],
  },
};

const jsonLdGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: KOMPANIJA,
      url: BASE_URL,
      logo: `${BASE_URL}/favicon.ico`,
      description: 'Digitalna Industrija sa platformama, AI sistemima i profesionalnim operativnim okvirom.',
      foundingDate: '2024',
      founder: { '@id': `${BASE_URL}/kompanija#person` },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: supportKontakt?.email ?? 'support@spaja.rs',
          availableLanguage: ['Serbian', 'English'],
        },
        {
          '@type': 'ContactPoint',
          contactType: 'business',
          email: businessKontakt?.email ?? 'business@spaja.rs',
          availableLanguage: ['Serbian', 'English'],
        },
      ],
      sameAs: [BASE_URL],
    },
    {
      '@type': 'Person',
      '@id': `${BASE_URL}/kompanija#person`,
      name: osnivacProfil.punoIme,
      givenName: osnivacProfil.ime,
      familyName: osnivacProfil.prezime,
      jobTitle: osnivacProfil.titula,
      description:
        'Osnivač, developer i kreator digitalnog ekosistema Kompanije SPAJA sa fokusom na platforme, AI sisteme, operativnu koordinaciju i profesionalnu saradnju.',
      worksFor: { '@id': `${BASE_URL}/#organization` },
      image: osnivacProfil.fotografije[0]?.url,
      email: businessKontakt?.email ?? 'business@spaja.rs',
      url: `${BASE_URL}/kompanija`,
    },
    {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/kompanija#webpage`,
      name: PAGE_TITLE,
      url: `${BASE_URL}/kompanija`,
      description: PAGE_DESCRIPTION,
      about: { '@id': `${BASE_URL}/kompanija#person` },
      isPartOf: { '@id': `${BASE_URL}/#organization` },
    },
  ],
};

export default function KompanijaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
      />
      <StranicaRenderer sekvence={kompanijaSekvence} />
    </>
  );
}
