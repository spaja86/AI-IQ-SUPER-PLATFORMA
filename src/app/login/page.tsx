import type { Metadata } from 'next';
import LoginForma from '@/components/LoginForma';

export const metadata: Metadata = {
  title: 'Prijava — SPAJA Platforma',
  description:
    'Prijavite se na AI IQ SUPER PLATFORMA — pristup Digitalnoj Industriji, svim delatnostima, platformama, ekosistemu, Gaming platformi sa Otavnom Konstrukcijom Gejminga, SpajaPro AI, OMEGA AI i Dashboard-u.',
};

export default function LoginPage() {
  return <LoginForma />;
}
