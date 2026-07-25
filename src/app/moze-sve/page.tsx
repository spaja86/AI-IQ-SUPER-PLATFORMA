import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { mozeSveSekvence } from '@/lib/sekvence/moze-sve-page';
import { BASE_URL, KOMPANIJA } from '@/lib/constants';

const OG_IMAGE_URL = `${BASE_URL}/api/og?title=${encodeURIComponent('MOŽE SVE — SPAJA Super Hub')}&description=${encodeURIComponent('SpajaPro · OMEGA AI · Proksi · Mobilna 1873G · Auto-Popravka · Evolucija')}`;

export const metadata: Metadata = {
  title: 'MOŽE SVE — SPAJA Super Hub',
  description: `Svih 6 core modula ${KOMPANIJA} u jednom pogledu: SpajaPro Engine, OMEGA AI, Proksi, Mobilna 1873G, Auto-Popravka i Autonomna Evolucija.`,
  openGraph: {
    title: 'MOŽE SVE — SPAJA Super Hub',
    description: 'SpajaPro · OMEGA AI · Proksi · Mobilna 1873G · Auto-Popravka · Evolucija — sve u jednom',
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: 'MOŽE SVE — SPAJA Super Hub' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MOŽE SVE — SPAJA Super Hub',
    description: 'SpajaPro · OMEGA AI · Proksi · Mobilna 1873G · Auto-Popravka · Evolucija — sve u jednom',
    images: [{ url: OG_IMAGE_URL, width: 1200, height: 630, alt: 'MOŽE SVE — SPAJA Super Hub' }],
  },
};

export default function MozeSvePage() {
  return <StranicaRenderer sekvence={mozeSveSekvence} />;
}
