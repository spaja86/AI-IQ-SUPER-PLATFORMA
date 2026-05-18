import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaPibMbSekvence } from '@/lib/sekvence/digitalna-industrija-pib-mb-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija PIB/M/B',
  description: `Centralni PIB/M/B registar Digitalne Industrije sa hitnom procedurom za APR i Poresku upravu — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaPibMbPage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaPibMbSekvence} />;
}
