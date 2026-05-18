import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaReputacioniRizikSekvence } from '@/lib/sekvence/digitalna-industrija-reputacioni-rizik-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija Reputacioni Rizik',
  description: `Centralni registar reputacionog rizika Digitalne Industrije — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaReputacioniRizikPage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaReputacioniRizikSekvence} />;
}
