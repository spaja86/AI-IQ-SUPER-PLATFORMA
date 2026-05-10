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
      <div className="spaja-shell flex min-h-[80vh] items-center justify-center" role="status" aria-live="polite">
        <div className="text-slate-300">Učitavanje...</div>
      </div>
    }>
      <LoginForma />
    </Suspense>
  );
}
