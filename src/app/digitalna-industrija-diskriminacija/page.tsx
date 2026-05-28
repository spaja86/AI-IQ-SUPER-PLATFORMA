import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaDiskriminacijaSekvence } from '@/lib/sekvence/digitalna-industrija-diskriminacija-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija Diskriminacija',
  description: `Centralni registar diskriminacionog rizika Digitalne Industrije — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaDiskriminacijaPage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaDiskriminacijaSekvence} />;
}
