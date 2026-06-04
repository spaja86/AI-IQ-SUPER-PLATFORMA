import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { harmonizacijaSekvence } from '@/lib/sekvence/harmonizacija-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Harmonizacija',
  description: `Harmonizacija — sinhronizacija procesnih slojeva i optimizacija protoka podataka — ${KOMPANIJA}`,
};

export default function HarmonizacijaPage() {
  return <StranicaRenderer sekvence={harmonizacijaSekvence} />;
}
