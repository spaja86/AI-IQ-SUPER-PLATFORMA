import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { wolletSekvence } from '@/lib/sekvence/wollet-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'AI IQ World Bank Wollet — Digitalni Poslovni Novčanik',
  description: `AI IQ World Bank Wollet — multi-valutni poslovni novčanik sa Polygon blockchain verifikacijom, RSD/EUR/USD računima i NBS/AML/SEPA usklađenošću — ${KOMPANIJA}`,
};

export default function WolletPage() {
  return <StranicaRenderer sekvence={wolletSekvence} />;
}
