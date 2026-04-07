import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { proksiWifiAntenaSekvence } from '@/lib/sekvence/proksi-wifi-antena-page';

export const metadata: Metadata = {
  title: 'WiFi Antena',
  description: 'Proksi WiFi Antena sistem',
};

export default function ProksiWifiAntena() {
  return <StranicaRenderer sekvence={proksiWifiAntenaSekvence} />;
}
