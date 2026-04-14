import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { blogFaqSekvence } from '@/lib/sekvence/blog-faq-page';
import { spajaBlogFaq } from '@/lib/spaja-blog-faq';
import { BASE_URL } from '@/lib/constants';

const OG_IMAGE_URL = `${BASE_URL}/api/og?title=${encodeURIComponent('SPAJA Blog & FAQ')}&description=${encodeURIComponent('Clanci, vodici i odgovori na pitanja')}`;

export const metadata: Metadata = {
  title: 'SPAJA Blog & FAQ',
  description: 'SPAJA Blog & FAQ — Clanci, vodiči i odgovori na pitanja',
  openGraph: {
    title: 'SPAJA Blog & FAQ',
    description: 'SPAJA Blog & FAQ — Clanci, vodiči i odgovori na pitanja',
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: 'SPAJA Blog & FAQ — Kompanija SPAJA' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SPAJA Blog & FAQ',
    description: 'SPAJA Blog & FAQ — Clanci, vodiči i odgovori na pitanja',
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: 'SPAJA Blog & FAQ — Kompanija SPAJA' }],
  },
};

const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: spajaBlogFaq.faqPitanja.map((faq) => ({
    '@type': 'Question',
    name: faq.pitanje,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.odgovor,
    },
  })),
};

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <StranicaRenderer sekvence={blogFaqSekvence} />
    </>
  );
}
