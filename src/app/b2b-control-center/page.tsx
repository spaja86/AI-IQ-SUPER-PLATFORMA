import type { Metadata } from 'next';
import AuthGuard from '@/components/AuthGuard';
import DigitalniKompjuterControlCenter from '@/components/DigitalniKompjuterControlCenter';

export const metadata: Metadata = {
  title: 'B2B Control Center | Digitalni Kompjuter',
  description: 'Read-only pregled deklarisanog statusa Digitalnog Kompjutera.',
};

export default function B2BControlCenterPage() {
  return <AuthGuard stranica="B2B Control Center-u"><DigitalniKompjuterControlCenter /></AuthGuard>;
}
