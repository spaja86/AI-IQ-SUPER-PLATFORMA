import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { getMaksimus3Sekvence } from '@/lib/sekvence/maksimus-3-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Maksimus 3 — Digitalna Industrija',
  description: `V3 master signal svih ključnih domena za ${KOMPANIJA}: analiza, potencijal, procesuiranje, ekstremno procesuiranje, operativna spremnost, autofinish orkestracija, SpajaPro engine i gejming industrija — sa per-domain SLA pragovima i multi-snapshot istorijom.`,
};

export default async function Maksimus3Page() {
  const sekvence = await getMaksimus3Sekvence();
  return <StranicaRenderer sekvence={sekvence} />;
}
