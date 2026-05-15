import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import AuthGuard from '@/components/AuthGuard';
import { KOMPANIJA } from '@/lib/constants';
import { mozakLogikaSekvence } from '@/lib/sekvence/mozak-logika-page';

export const metadata: Metadata = {
  title: 'MOZAK LOGIKA',
  description:
    `Inteligentni podsistem Glavnog Endžina — non-stop analiza, ideje, projektni planovi i povratni odaziv za Digitalnu Industriju — ${KOMPANIJA}`,
};

export default function MozakLogika() {
  return (
    <AuthGuard stranica="MOZAK LOGIKA">
      <StranicaRenderer sekvence={mozakLogikaSekvence} />
    </AuthGuard>
  );
}
