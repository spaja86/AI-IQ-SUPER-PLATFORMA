import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { getMaksimus2Sekvence } from '@/lib/sekvence/maksimus-2-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Maksimus 2 — Digitalna Industrija',
  description: `V2 master signal svih ključnih domena za ${KOMPANIJA}: analiza, potencijal, procesuiranje, ekstremno procesuiranje, operativna spremnost i autofinish orkestracija.`,
};

export default async function Maksimus2Page() {
  const sekvence = await getMaksimus2Sekvence();
  return <StranicaRenderer sekvence={sekvence} />;
}
