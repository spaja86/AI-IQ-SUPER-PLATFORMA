import { apiSuccess } from '@/lib/api/response';
import { walletComplianceRequirements, walletDataClassification } from '@/lib/wallet/compliance';

export async function GET() {
  return apiSuccess({
    requirements: walletComplianceRequirements,
    dataClassification: walletDataClassification,
    threatModelScope: [
      'manual-card-entry',
      'camera-scan-consent',
      'token-lifecycle',
      'webhook-processing',
      'refund-dispute-flows',
    ],
  });
}
