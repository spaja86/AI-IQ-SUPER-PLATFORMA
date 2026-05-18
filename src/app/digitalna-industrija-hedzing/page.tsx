import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaHedzingSekvence } from '@/lib/sekvence/digitalna-industrija-hedzing-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija Hedzing',
  description: `Centralni registar hedzing ugovora Digitalne Industrije — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaHedzingPage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaHedzingSekvence} />;
}
