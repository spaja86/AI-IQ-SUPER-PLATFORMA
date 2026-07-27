import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { getMirorSekvence } from '@/lib/sekvence/miror-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'MIROR — Modularna Inteligentna Refleksija Operativnih Ritmova',
  description: `Cross-domain refleksioni engine kroz 6 operativnih domena za ${KOMPANIJA}.`,
};

export default function MirorPage() {
  const sekvence = getMirorSekvence();
  return <StranicaRenderer sekvence={sekvence} />;
}
