import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { getEktrimliEkstremSekvence } from '@/lib/sekvence/ekstrimli-ekstrem-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Ekstrimli Ekstrem — Digitalna Industrija',
  description: `V4 apsolutni master signal svih 10 domena za ${KOMPANIJA}: MOŽE SVE — Analiza, Potencijal, Procesuiranje, Autofinish, OMEGA AI, Proksi i više.`,
};

export default async function EktrimliEkstremPage() {
  const sekvence = await getEktrimliEkstremSekvence();
  return <StranicaRenderer sekvence={sekvence} />;
}
