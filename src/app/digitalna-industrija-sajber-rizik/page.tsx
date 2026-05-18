import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaSajberRizikSekvence } from '@/lib/sekvence/digitalna-industrija-sajber-rizik-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija Sajber Rizik',
  description: `Centralni registar sajber bezbednosnih rizika Digitalne Industrije u Srbiji — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaSajberRizikPage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaSajberRizikSekvence} />;
}
