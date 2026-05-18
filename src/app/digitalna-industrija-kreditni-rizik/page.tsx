import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaKreditniRizikSekvence } from '@/lib/sekvence/digitalna-industrija-kreditni-rizik-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija Kreditni Rizik',
  description: `Centralni registar kreditnog rizika Digitalne Industrije — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaKreditniRizikPage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaKreditniRizikSekvence} />;
}
