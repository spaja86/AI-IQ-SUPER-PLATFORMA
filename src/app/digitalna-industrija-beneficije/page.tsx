import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaBeneficijeSekvence } from '@/lib/sekvence/digitalna-industrija-beneficije-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija Beneficije',
  description: `Centralni registar beneficija i paketa pogodnosti Digitalne Industrije u Srbiji — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaBeneficijePage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaBeneficijeSekvence} />;
}
