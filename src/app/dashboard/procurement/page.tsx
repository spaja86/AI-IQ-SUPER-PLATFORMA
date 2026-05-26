import type { Metadata } from 'next';
import ProcurementB2BDashboardKlijent from '@/components/ProcurementB2BDashboardKlijent';
import ProcurementSistemKpiKlijent from '@/components/ProcurementSistemKpiKlijent';

export const metadata: Metadata = {
  title: 'Dashboard / Prkitandejrski sistem',
  description:
    'Unified procurement sistem — B2B nabavke, enterprise ugovori, licencni procurement — KPI i operativni status.',
};

export default function DashboardProcurementPage() {
  return (
    <main className="mx-auto max-w-6xl space-y-10 px-6 py-10">
      <ProcurementSistemKpiKlijent />
      <hr className="border-slate-200" />
      <ProcurementB2BDashboardKlijent />
    </main>
  );
}
