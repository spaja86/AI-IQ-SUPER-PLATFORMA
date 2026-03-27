import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    template: '%s | AI IQ SUPER PLATFORMA',
    default: 'AI IQ SUPER PLATFORMA — Kompanija SPAJA',
  },
  description: 'Digitalna Industrija — Kompanija SPAJA. Unified platforma za upravljanje svim AI i IT projektima.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr">
      <body className="flex min-h-screen flex-col bg-gray-950 text-white antialiased">
        <Navigation />
        <div id="main-content" className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
