import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { getEkstrendendSekvence } from '@/lib/sekvence/ekstrendend-page';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'EKSTRENDEND — Ekstremni Trend Endzin',
  description: `Cross-domain trend velocity, momentum i projektovana readiness svih 8 domena za ${KOMPANIJA}.`,
};

export default async function EkstrendendPage() {
  const sekvence = await getEkstrendendSekvence();
  return <StranicaRenderer sekvence={sekvence} />;
}
