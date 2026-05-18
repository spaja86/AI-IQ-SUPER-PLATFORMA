import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaPoreskiRizikSekvence } from '@/lib/sekvence/digitalna-industrija-poreski-rizik-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija Poreski Rizik',
  description: `Centralni registar poreskog rizika Digitalne Industrije — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaPoreskiRizikPage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaPoreskiRizikSekvence} />;
}
