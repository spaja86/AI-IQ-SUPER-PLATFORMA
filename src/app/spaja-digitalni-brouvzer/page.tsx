import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { spajaDigitalniBrouvzerSekvence } from '@/lib/sekvence/spaja-digitalni-brouvzer-page';

export const metadata: Metadata = {
  title: 'SPAJA Digitalni Brouvzer — EKSTREMNI',
  description: 'EKSTREMNI DIGITALNI BROUZER sa sopstvenim motorom, bekendom i providnim frontendom — deploy, import, export, SPAJA BAZA integracija',
};

export default function SpajaDigitalniBrouvzerPage() {
  return <StranicaRenderer sekvence={spajaDigitalniBrouvzerSekvence} />;
}
