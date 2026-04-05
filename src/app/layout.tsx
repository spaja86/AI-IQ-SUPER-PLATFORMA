import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { APP_VERSION, APP_NAME, KOMPANIJA, BASE_URL } from '@/lib/constants';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: APP_NAME,
  url: BASE_URL,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  softwareVersion: APP_VERSION,
  author: {
    '@type': 'Organization',
    name: KOMPANIJA,
    url: BASE_URL,
  },
  description: 'Digitalna Industrija — Kompanija SPAJA. SpajaPro Prompt Engine v6-15, 21 OMEGA AI persona, 95 igrica, Proksi mreža, SPAJA Mobilna Mreža.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a1a',
};

export const metadata: Metadata = {
  title: {
    template: '%s | AI IQ SUPER PLATFORMA',
    default: 'AI IQ SUPER PLATFORMA — Kompanija SPAJA',
  },
  description: 'Digitalna Industrija — Kompanija SPAJA. SpajaPro Prompt Engine v6-15, 21 OMEGA AI persona, 95 igrica, Proksi mreža, SPAJA Mobilna Mreža. Unified platforma za upravljanje svim AI i IT projektima.',
  keywords: ['AI', 'IQ', 'SUPER PLATFORMA', 'Kompanija SPAJA', 'SpajaPro', 'OMEGA AI', 'Digitalna Industrija', 'Prompt Engine', 'Proksi', 'Mobilna Mreža'],
  authors: [{ name: 'Kompanija SPAJA' }],
  creator: 'Kompanija SPAJA',
  publisher: 'Kompanija SPAJA',
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: 'website',
    locale: 'sr_Latn',
    siteName: 'AI IQ SUPER PLATFORMA',
    title: 'AI IQ SUPER PLATFORMA — Kompanija SPAJA',
    description: 'Digitalna Industrija sa SpajaPro Prompt Engine-om, 21 OMEGA AI persona, 95 igrica i Proksi mrežom.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI IQ SUPER PLATFORMA — Kompanija SPAJA',
    description: 'Digitalna Industrija sa SpajaPro Prompt Engine-om, 21 OMEGA AI persona, 95 igrica i Proksi mrežom.',
    creator: '@KompanijaSPAJA',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr-Latn">
      <body className="flex min-h-screen flex-col bg-gray-950 text-white antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white">
          Preskoči na sadržaj
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navigation />
        <main id="main-content" className="flex-1" role="main">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
