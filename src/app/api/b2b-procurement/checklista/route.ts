import { NextRequest, NextResponse } from 'next/server';
import { ΩAuthProvider } from '@/lib/auth/omega-auth';
import { ΩClearanceLevel } from '@/lib/auth/types';
import { APP_VERSION } from '@/lib/constants';
import {
  getB2BProcurementCases,
  getB2BProcurementChecklist,
  getB2BWorkflowMeta,
} from '@/lib/b2b-procurement-workflow';

async function requireInternal(request: NextRequest) {
  const token = ΩAuthProvider.extractTokenFromHeader(request.headers.get('authorization'));
  if (!token) return { ok: false as const, response: NextResponse.json({ error: 'Token je obavezan.' }, { status: 401 }) };
  const identity = await ΩAuthProvider.verifyIdentity(token);
  if (!identity || identity.clearanceLevel < ΩClearanceLevel.USER) {
    return { ok: false as const, response: NextResponse.json({ error: 'Nevažeći pristup.' }, { status: 403 }) };
  }
  return { ok: true as const };
}

export async function GET(request: NextRequest) {
  const auth = await requireInternal(request);
  if (!auth.ok) return auth.response;

  const caseId = request.nextUrl.searchParams.get('caseId');
  if (caseId) {
    const checklist = await getB2BProcurementChecklist(caseId);
    return NextResponse.json({
      status: 'aktivan',
      verzija: APP_VERSION,
      checklista: checklist,
      timestamp: new Date().toISOString(),
    });
  }

  const cases = await getB2BProcurementCases({ includeSensitive: false });
  const checklist = await Promise.all(cases.map((item) => getB2BProcurementChecklist(item.id)));
  return NextResponse.json({
    status: 'aktivan',
    naziv: 'B2B Missing Checklist',
    verzija: APP_VERSION,
    meta: getB2BWorkflowMeta(),
    stavke: checklist,
    summary: {
      ukupno: checklist.length,
      readyForPayment: checklist.filter((item) => item.readyForPayment).length,
      notReady: checklist.filter((item) => !item.readyForPayment).length,
    },
    timestamp: new Date().toISOString(),
  });
}
