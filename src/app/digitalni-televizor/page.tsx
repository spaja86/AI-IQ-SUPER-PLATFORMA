import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { digitalniTelevizorSekvence } from '@/lib/sekvence/digitalni-televizor-page';

export const metadata: Metadata = {
  title: 'SPAJA Digitalni Televizor',
  description: 'SPAJA Digitalni Televizor — Streaming kanali u najvišem kvalitetu',
};

export default function DigitalniTelevizorPage() {
  return <StranicaRenderer sekvence={digitalniTelevizorSekvence} />;
}
