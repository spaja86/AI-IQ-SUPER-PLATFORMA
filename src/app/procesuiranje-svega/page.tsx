import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { procesuiranjeSvegaSekvence } from '@/lib/sekvence/procesuiranje-svega-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Procesuiranje Svega — Digitalna Industrija',
  description: `Aktivni pipeline procesiranja svih domena ${KOMPANIJA}: bankarski, AI, finansijski, licencni, ekosistem, autofinish, bezbednosni i analitički procesi`,
};

export default function ProcesuiranjeSvegaPage() {
  return <StranicaRenderer sekvence={procesuiranjeSvegaSekvence} />;
}
