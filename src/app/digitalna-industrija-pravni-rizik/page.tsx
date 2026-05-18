import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaPravniRizikSekvence } from '@/lib/sekvence/digitalna-industrija-pravni-rizik-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija Pravni Rizik',
  description: `Centralni registar pravnog rizika Digitalne Industrije — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaPravniRizikPage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaPravniRizikSekvence} />;
}
