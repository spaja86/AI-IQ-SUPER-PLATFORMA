import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaLikvidnosniRizikSekvence } from '@/lib/sekvence/digitalna-industrija-likvidnosni-rizik-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija Likvidnosni Rizik',
  description: `Centralni registar likvidnosnog rizika Digitalne Industrije — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaLikvidnosniRizikPage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaLikvidnosniRizikSekvence} />;
}
