import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { reaktSekvence } from '@/lib/sekvence/reakt-page';

export const metadata: Metadata = {
  title: 'REAKT | SPAJA Gaming',
  description: 'Igra refleksa i reakcionog vremena — dimenzionalni stimulusi, streak sistem, distraktori. Kliktaj što brže u SPAJA Gaming ekosistemu (360D–5760D).',
};

export default function Reakt() {
  return <StranicaRenderer sekvence={reaktSekvence} />;
}
