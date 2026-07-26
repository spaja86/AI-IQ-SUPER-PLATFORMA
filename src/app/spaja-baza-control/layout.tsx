import type { Metadata } from 'next';
import AuthGuard from '@/components/AuthGuard';

export const metadata: Metadata = {
  title: 'Spaja Baza Control',
  description: 'Kontrolni centar Spaja baze znanja — status indeksiranja, zdravlje sistema i monitoring chunk-ova.',
};

export default function SpajaBazaControlLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard stranica="Spaja Baza Control">{children}</AuthGuard>;
}
