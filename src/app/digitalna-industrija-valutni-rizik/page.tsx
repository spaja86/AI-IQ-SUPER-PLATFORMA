import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaValutniRizikSekvence } from '@/lib/sekvence/digitalna-industrija-valutni-rizik-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija Valutni Rizik',
  description: `Centralni registar valutnog rizika Digitalne Industrije — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaValutniRizikPage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaValutniRizikSekvence} />;
}
