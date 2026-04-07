import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { dimenzijeSekvence } from '@/lib/sekvence/dimenzije-page';

export const metadata: Metadata = {
  title: 'Dimenzije',
  description: 'Dimenzionalni sistem 360D-5760D',
};

export default function Dimenzije() {
  return <StranicaRenderer sekvence={dimenzijeSekvence} />;
}
