import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { getMaksimusSvegaSekvence } from '@/lib/sekvence/maksimus-svega-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Maksimus Svega — Digitalna Industrija',
  description: `Master signal svih ključnih "svega" domena za ${KOMPANIJA}: analiza, potencijal, procesuiranje i autofinish orkestracija.`,
};

export default async function MaksimusSvegaPage() {
  const sekvence = await getMaksimusSvegaSekvence();
  return <StranicaRenderer sekvence={sekvence} />;
}
