import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaNagradeSekvence } from '@/lib/sekvence/digitalna-industrija-nagrade-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija Nagrade',
  description: `Centralni registar nagrada, bonusa i premija Digitalne Industrije u Srbiji — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaNagradePage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaNagradeSekvence} />;
}
