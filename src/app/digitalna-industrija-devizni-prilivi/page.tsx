import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaDevizniPriliviSekvence } from '@/lib/sekvence/digitalna-industrija-devizni-prilivi-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija Devizni Prilivi',
  description: `Centralni registar deviznih priliva Digitalne Industrije — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaDevizniPriliviPage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaDevizniPriliviSekvence} />;
}
