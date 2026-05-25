import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { getAnalizaSvegaSekvence } from '@/lib/sekvence/analiza-svega-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Analiza Svega — Digitalna Industrija',
  description: `Celokupna analiza ekosistema: ekosistem, infrastruktura, finansije, bezbednost, operativa, autofinish i protokoli — ${KOMPANIJA}`,
};

export default async function AnalizaSvegaPage() {
  const sekvence = await getAnalizaSvegaSekvence();
  return <StranicaRenderer sekvence={sekvence} />;
}
