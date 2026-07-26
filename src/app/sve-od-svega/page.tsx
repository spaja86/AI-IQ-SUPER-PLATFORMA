import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { getSveOdSvegaSekvence } from '@/lib/sekvence/sve-od-svega-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'SVE OD SVEGA — Digitalna Industrija',
  description: `Ultimativni mega-signal koji agregira sve "svega" domene ${KOMPANIJA}: analiza, potencijal, procesuiranje i autofinish orkestracija.`,
};

export default async function SveOdSvegaPage() {
  const sekvence = await getSveOdSvegaSekvence();
  return <StranicaRenderer sekvence={sekvence} />;
}
