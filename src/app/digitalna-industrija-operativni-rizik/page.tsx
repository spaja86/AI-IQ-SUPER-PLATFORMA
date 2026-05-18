import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaOperativniRizikSekvence } from '@/lib/sekvence/digitalna-industrija-operativni-rizik-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija Operativni Rizik',
  description: `Centralni registar operativnog rizika Digitalne Industrije — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaOperativniRizikPage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaOperativniRizikSekvence} />;
}
