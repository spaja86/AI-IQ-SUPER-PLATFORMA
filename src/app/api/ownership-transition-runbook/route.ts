// Ownership Transition Runbook — API ruta
// Kompanija SPAJA — Digitalna Industrija
//
// GET /api/ownership-transition-runbook

import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/lib/constants';
import { getOwnershipRunbookStatus } from '@/lib/ownership-transition-runbook';

export async function GET() {
  try {
    const runbookStatus = getOwnershipRunbookStatus();
    return NextResponse.json({
      status: 'aktivan',
      verzija: APP_VERSION,
      opis:
        'Formalni runbook za GitHub ownership tranziciju: spaja86_model → github_org_priprema → github_org_transfer → enterprise_governance. Sadrži go/no-go checklist, uloge, Vercel/domain impact i rollback planove po fazi.',
      ...runbookStatus,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Greška pri čitanju runbook statusa', detalji: String(error) },
      { status: 500 },
    );
  }
}
