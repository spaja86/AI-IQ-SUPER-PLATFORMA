import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { barKodSekvence } from '@/lib/sekvence/bar-kod-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'BAR KOD — Digitalna Industrija',
  description: `Integer-only BAR KOD registar za sve platforme Digitalne Industrije — ${KOMPANIJA}`,
};

export default function BarKodPage() {
  return <StranicaRenderer sekvence={barKodSekvence} />;
}
