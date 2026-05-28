import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaInflacijeSekvence } from '@/lib/sekvence/digitalna-industrija-inflacije-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija Inflacije',
  description: `Centralni registar inflacije Digitalne Industrije — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaInflacijePage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaInflacijeSekvence} />;
}
