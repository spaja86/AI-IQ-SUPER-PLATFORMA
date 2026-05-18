import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaStrateskiRizikSekvence } from '@/lib/sekvence/digitalna-industrija-strateski-rizik-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija Strateški Rizik',
  description: `Centralni registar strateškog rizika Digitalne Industrije — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaStrateskiRizikPage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaStrateskiRizikSekvence} />;
}
