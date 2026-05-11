import { apiSuccess } from '@/lib/api/response';
import { walletKpiBaseline, walletComplianceRequirements } from '@/lib/wallet/compliance';

export async function GET() {
  return apiSuccess({
    sistem: 'Poslovni Novčanik — Status',
    status: 'aktivan',
    kpi: walletKpiBaseline,
    compliance: {
      ukupno: walletComplianceRequirements.length,
      implementirano: walletComplianceRequirements.filter((r) => r.status === 'implemented').length,
      uToku: walletComplianceRequirements.filter((r) => r.status === 'in_progress').length,
      planirano: walletComplianceRequirements.filter((r) => r.status === 'planned').length,
    },
  });
}
