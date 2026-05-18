import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaIndustrijaSifraDelatnostiSekvence } from '@/lib/sekvence/digitalna-industrija-sifra-delatnosti-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Digitalna Industrija Šifra Delatnosti',
  description: `Centralni registar šifara delatnosti Digitalne Industrije — ${KOMPANIJA}`,
};

export default function DigitalnaIndustrijaSifraDelatnostiPage() {
  return <StranicaRenderer sekvence={digitalnaIndustrijaSifraDelatnostiSekvence} />;
}
