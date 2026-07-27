import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { KOMPANIJA } from '@/lib/constants';
import { getAutoSekvence } from '@/lib/sekvence/auto-page';

export const metadata: Metadata = {
  title: 'AUTO — Autonomna Upravljačka Transformativna Orkestracija',
  description: `Cross-domain engine kroz 6 domena autonomnih operativnih procesa za ${KOMPANIJA}.`,
};

export default function AutoPage() {
  const sekvence = getAutoSekvence();
  return <StranicaRenderer sekvence={sekvence} />;
}
