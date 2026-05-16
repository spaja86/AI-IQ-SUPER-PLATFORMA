import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { gejmingIndustrijaSekvence } from '@/lib/sekvence/gejming-industrija-page';
import { KOMPANIJA, TOTAL_IGRICA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Gejming Industrija',
  description: `Nad-sloj gejming industrije za ${TOTAL_IGRICA} igrica — ${KOMPANIJA}`,
};

export default function GejmingIndustrijaPage() {
  return <StranicaRenderer sekvence={gejmingIndustrijaSekvence} />;
}
