import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaPibMbSekvence } from '@/lib/sekvence/digitalna-industrija-pib-mb-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija PIB/MB',
  description: `Centralni registar PIB i matičnih brojeva Digitalne Industrije — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaPibMbPage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaPibMbSekvence} />;
}
