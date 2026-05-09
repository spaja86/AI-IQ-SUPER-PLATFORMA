import type { Metadata } from 'next';
import ProcurementB2BDashboardKlijent from '@/components/ProcurementB2BDashboardKlijent';

export const metadata: Metadata = {
  title: 'Dashboard / B2B Procurement',
  description: 'Interni B2B procurement workflow — partnerstva, ponude, dokumentacija, plaćanje i isporuka.',
};

export default function DashboardProcurementPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <ProcurementB2BDashboardKlijent />
    </main>
  );
}
