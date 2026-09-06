// SpajaUltraOmegaCore -∞Ω+∞ — Digit Intelligence Engine API: /api/digit-engine/[digit]
// Kompanija SPAJA — Digitalna Industrija

import type { NextRequest } from 'next/server';
import { apiError, apiSuccess } from '@/lib/api/response';
import {
  getDigitDescriptor,
  DIGIT_ENGINE_CONTRACT_VERSION,
  DIGIT_ENGINE_MODULE_VERSION,
} from '@/lib/digit-engine';

export const dynamic = 'force-dynamic';

function setHeaders(res: Response): void {
  res.headers.set('X-DigitEngine-Contract-Version', DIGIT_ENGINE_CONTRACT_VERSION);
  res.headers.set('X-DigitEngine-Module-Version', DIGIT_ENGINE_MODULE_VERSION);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ digit: string }> },
) {
  const { digit: raw } = await params;
  const parsed = Number(raw);

  if (!/^\d$/.test(raw) || !Number.isInteger(parsed) || parsed < 0 || parsed > 9) {
    return apiError('NOT_FOUND', `Digit "${raw}" is not valid. Must be an integer 0–9.`, 404);
  }

  const descriptor = getDigitDescriptor(parsed);
  if (!descriptor) {
    return apiError('NOT_FOUND', `No descriptor found for digit ${parsed}`, 404);
  }

  const response = apiSuccess(descriptor, 200);
  setHeaders(response);
  return response;
}
