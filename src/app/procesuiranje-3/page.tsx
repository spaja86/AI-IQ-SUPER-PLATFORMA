import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { procesuiranje3Sekvence } from '@/lib/sekvence/procesuiranje-3-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Procesuiranje 3 — Digitalna Industrija',
  description: `Kanonski v3 pipeline procesiranja za ${KOMPANIJA}: dual-run kompatibilnost sa v2, SLA pragovi, trend i history snapshot-i.`,
};

export default function Procesuiranje3Page() {
  return <StranicaRenderer sekvence={procesuiranje3Sekvence} />;
}
