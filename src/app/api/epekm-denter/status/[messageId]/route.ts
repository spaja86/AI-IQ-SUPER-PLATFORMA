// SpajaUltraOmegaCore -∞Ω+∞ — EPEKM-D API: GET /api/epekm-denter/status/[messageId]
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiInternalError, apiSuccess } from '@/lib/api/response';
import { getEmailDeliveryStatus, EPEKM_CONTRACT_VERSION } from '@/lib/epekm-denter';

export const dynamic = 'force-dynamic';

/**
 * GET /api/epekm-denter/status/[messageId]
 *
 * Returns the delivery status of a specific message.
 * Returns 404 if the messageId is not found.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ messageId: string }> },
) {
  const { messageId } = await params;

  if (!messageId || messageId.trim() === '') {
    return apiError('BAD_REQUEST', 'messageId path parameter is required');
  }

  try {
    const record = getEmailDeliveryStatus(messageId);
    if (!record) {
      return apiError('NOT_FOUND', `Delivery record not found: ${messageId}`);
    }
    const response = apiSuccess(record, 200);
    response.headers.set('X-Epekm-Contract-Version', EPEKM_CONTRACT_VERSION);
    return response;
  } catch (error) {
    return apiInternalError('epekm-denter/status', error);
  }
}
