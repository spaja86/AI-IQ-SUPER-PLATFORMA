import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaEsgRizikSekvence } from '@/lib/sekvence/digitalna-industrija-esg-rizik-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija ESG Rizik',
  description: `Centralni registar ESG rizika Digitalne Industrije u Srbiji — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaEsgRizikPage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaEsgRizikSekvence} />;
}
