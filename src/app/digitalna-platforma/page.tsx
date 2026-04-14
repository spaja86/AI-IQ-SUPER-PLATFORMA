import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalnaPlatformaSekvence } from '@/lib/sekvence/digitalna-platforma-page';

export const metadata: Metadata = {
  title: 'Digitalna Platforma — SPAJA',
  description:
    'AI IQ SUPER PLATFORMA — kompletni digitalni ekosistem Kompanije SPAJA sa AI, finansijama, igricama, deploy infrastrukturom i vise.',
};

export default function DigitalnaPlatformaPage() {
  return <StranicaRenderer sekvence={digitalnaPlatformaSekvence} />;
}
