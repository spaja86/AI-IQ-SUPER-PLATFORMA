import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaKapitalniRizikSekvence } from '@/lib/sekvence/digitalna-industrija-kapitalni-rizik-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija Kapitalni Rizik',
  description: `Centralni registar adekvatnosti kapitala (CAR, CET1, Tier1/Tier2 i kapitalnih bafera) Digitalne Industrije — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaKapitalniRizikPage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaKapitalniRizikSekvence} />;
}
