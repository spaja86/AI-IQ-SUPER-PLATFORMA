import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { proksiSekvence } from '@/lib/sekvence/proksi-page';

export const metadata: Metadata = {
  title: 'Proksi',
  description: 'Proksi mreža i signali',
};

export default function Proksi() {
  return <StranicaRenderer sekvence={proksiSekvence} />;
}
