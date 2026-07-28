import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { KOMPANIJA } from '@/lib/constants';
import { getIndukcijaSekvence } from '@/lib/sekvence/indukcija-page';

export const metadata: Metadata = {
  title: 'INDUKCIJA — Inteligentni Napredni Detektor Unificiranih Koherentnih Ciklusa i Jezgra Automatizacije',
  description: `Cross-domain indukcioni engine kroz 6 operativnih domena za ${KOMPANIJA}.`,
};

export default function IndukcijaPage() {
  const sekvence = getIndukcijaSekvence();
  return <StranicaRenderer sekvence={sekvence} />;
}
