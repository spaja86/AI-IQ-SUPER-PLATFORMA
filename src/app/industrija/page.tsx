import type { Metadata } from 'next';
import { StranicaRenderer } from '@/components/sekvence';
import { industrijaSekvence } from '@/lib/sekvence/industrija';
import AuthGuard from '@/components/AuthGuard';
import { KOMPANIJA } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Industrija',
  description: `O digitalnoj industriji — ${KOMPANIJA}`,
};

export default function Industrija() {
  return (
    <AuthGuard stranica="Digitalnu Industriju">
      <StranicaRenderer sekvence={industrijaSekvence} />
    </AuthGuard>
  );
}
