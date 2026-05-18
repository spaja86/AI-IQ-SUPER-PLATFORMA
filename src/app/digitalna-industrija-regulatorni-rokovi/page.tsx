import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaRegulatorniRokoviSekvence } from '@/lib/sekvence/digitalna-industrija-regulatorni-rokovi-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija Regulatorni Rokovi',
  description: `Centralni registar regulatornih rokova Digitalne Industrije — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaRegulatorniRokoviPage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaRegulatorniRokoviSekvence} />;
}
