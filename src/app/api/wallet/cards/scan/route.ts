import { type NextRequest } from 'next/server';
import { apiError, apiSuccess, apiInternalError } from '@/lib/api/response';
import { evaluateScanPayload } from '@/lib/wallet/camera-scan';

interface ScanBody {
  consent?: boolean;
  scanSessionId?: string;
  extracted?: {
    maskedNumber?: string;
    last4?: string;
    expiryMonth?: number;
    expiryYear?: number;
    confidence?: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ScanBody;

    if (!body.scanSessionId || typeof body.scanSessionId !== 'string') {
      return apiError('BAD_REQUEST', 'scanSessionId je obavezan.');
    }

    if (body.extracted?.maskedNumber) {
      const compact = body.extracted.maskedNumber.replace(/[\s\-]/g, '');
      const unmasked = compact.replace(/\*/g, '');
      const hasMasking = compact.includes('*');
      if (!hasMasking || unmasked.length > 10 || /\d{8,}/.test(unmasked)) {
        return apiError('BAD_REQUEST', 'Dozvoljen je isključivo bezbedno maskirani broj kartice (maks. first6+last4).');
      }
    }

    const result = evaluateScanPayload({
      consent: !!body.consent,
      scanSessionId: body.scanSessionId,
      extracted: body.extracted && body.extracted.last4 && typeof body.extracted.confidence === 'number'
        ? {
          maskedNumber: body.extracted.maskedNumber ?? `******${body.extracted.last4}`,
          last4: body.extracted.last4,
          expiryMonth: body.extracted.expiryMonth,
          expiryYear: body.extracted.expiryYear,
          confidence: body.extracted.confidence,
        }
        : undefined,
    });

    return apiSuccess({
      scanSessionId: body.scanSessionId,
      result,
      nextStep: result.requiresManualEntry ? 'manual-card-entry' : 'confirm-and-tokenize',
    });
  } catch (error) {
    return apiInternalError('wallet-card-scan', error);
  }
}
