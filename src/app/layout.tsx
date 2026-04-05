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
  metadataBase: new URL('https://ai-iq-super-platforma.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'sr_Latn',
    siteName: 'AI IQ SUPER PLATFORMA',
    title: 'AI IQ SUPER PLATFORMA — Kompanija SPAJA',
    description: 'Digitalna Industrija sa SpajaPro Prompt Engine-om, 21 OMEGA AI persona, 95 igrica i Proksi mrežom.',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navigation />
        <div id="main-content" className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
