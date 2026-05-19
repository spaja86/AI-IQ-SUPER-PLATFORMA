import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaPozicijeSekvence } from '@/lib/sekvence/digitalna-industrija-pozicije-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija Pozicije',
  description: `Centralni registar pozicija i kadrovskih potreba Digitalne Industrije u Srbiji — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaPozicijePage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaPozicijeSekvence} />;
}
