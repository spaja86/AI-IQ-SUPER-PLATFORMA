import type { Metadata } from 'next';
import LoginForma from '@/components/LoginForma';

export const metadata: Metadata = {
  title: 'Prijava — SPAJA Platforma',
  description:
    'Prijavite se na AI IQ SUPER PLATFORMA — pristup SpajaPro AI, OMEGA AI, Dashboard i celom ekosistemu Kompanije SPAJA.',
};

export default function LoginPage() {
  return <LoginForma />;
}
