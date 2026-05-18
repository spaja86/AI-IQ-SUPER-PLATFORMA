import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaDevizniOdliviSekvence } from '@/lib/sekvence/digitalna-industrija-devizni-odlivi-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija Devizni Odlivi',
  description: `Centralni registar deviznih odliva Digitalne Industrije — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaDevizniOdliviPage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaDevizniOdliviSekvence} />;
}
