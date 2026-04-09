import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { monitoringLiveSekvence } from '@/lib/sekvence/monitoring-live-page';

export const metadata: Metadata = {
  title: 'SPAJA Monitoring Live',
  description: 'SPAJA Monitoring Live — Platforma za streaming uzivo',
};

export default function MonitoringLivePage() {
  return <StranicaRenderer sekvence={monitoringLiveSekvence} />;
}
