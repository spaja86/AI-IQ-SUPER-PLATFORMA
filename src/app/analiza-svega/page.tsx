import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { analizaSvegaSekvence } from '@/lib/sekvence/analiza-svega-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Analiza Svega — Digitalna Industrija',
  description: `Celokupna analiza ekosistema: ekosistem, infrastruktura, finansije, bezbednost, operativa, autofinish i protokoli — ${KOMPANIJA}`,
};

export default function AnalizaSvegaPage() {
  return <StranicaRenderer sekvence={analizaSvegaSekvence} />;
}
