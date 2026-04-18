import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoginForma from '@/components/LoginForma';

export const metadata: Metadata = {
  title: 'Prijava — SPAJA Platforma',
  description:
    'Prijavite se na AI IQ SUPER PLATFORMA — pristup Digitalnoj Industriji, svim delatnostima, platformama, ekosistemu, Gaming platformi sa Otavnom Konstrukcijom Gejminga, SpajaPro AI, OMEGA AI i Dashboard-u.',
};

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
        <div className="text-gray-400">Učitavanje...</div>
      </div>
    }>
      <LoginForma />
    </Suspense>
  );
}
