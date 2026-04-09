import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { aiIqMonitoringSekvence } from '@/lib/sekvence/ai-iq-monitoring-page';

export const metadata: Metadata = {
  title: 'SPAJA AI IQ Monitoring',
  description: 'SPAJA AI IQ Monitoring — Pracenje gresaka, alerti i AI auto-popravka',
};

export default function AiIqMonitoringPage() {
  return <StranicaRenderer sekvence={aiIqMonitoringSekvence} />;
}
