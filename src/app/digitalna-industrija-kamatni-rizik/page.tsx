import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaKamatniRizikSekvence } from '@/lib/sekvence/digitalna-industrija-kamatni-rizik-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija Kamatni Rizik',
  description: `Centralni registar kamatnog rizika Digitalne Industrije — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaKamatniRizikPage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaKamatniRizikSekvence} />;
}
