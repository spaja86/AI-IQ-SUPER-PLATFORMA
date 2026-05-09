import { NextRequest, NextResponse } from 'next/server';
import { ΩAuthProvider } from '@/lib/auth/omega-auth';
import { ΩClearanceLevel } from '@/lib/auth/types';
import { APP_VERSION } from '@/lib/constants';
import {
  buildKomunikacioniSablon,
  createB2BProcurementCase,
  getB2BProcurementCases,
  getB2BProcurementSummary,
  getB2BWorkflowMeta,
  patchB2BProcurementCase,
} from '@/lib/b2b-procurement-workflow';

async function requireIdentity(request: NextRequest, minClearance = ΩClearanceLevel.USER) {
  const token = ΩAuthProvider.extractTokenFromHeader(request.headers.get('authorization'));
  if (!token) return { ok: false as const, response: NextResponse.json({ error: 'Token je obavezan.' }, { status: 401 }) };
  const identity = await ΩAuthProvider.verifyIdentity(token);
  if (!identity) {
    return { ok: false as const, response: NextResponse.json({ error: 'Nevažeći token.' }, { status: 401 }) };
  }
  if (identity.clearanceLevel < minClearance) {
    return { ok: false as const, response: NextResponse.json({ error: 'Nedovoljan clearance.' }, { status: 403 }) };
  }
  return { ok: true as const, identity };
}

export async function GET(request: NextRequest) {
  const auth = await requireIdentity(request, ΩClearanceLevel.USER);
  if (!auth.ok) return auth.response;

  const includeSensitive =
    request.nextUrl.searchParams.get('includeSensitive') === '1' &&
    auth.identity.clearanceLevel >= ΩClearanceLevel.ADMIN;

  const cases = await getB2BProcurementCases({ includeSensitive });
  const summary = await getB2BProcurementSummary(includeSensitive);

  return NextResponse.json({
    status: 'aktivan',
    naziv: 'B2B Procurement Workflow',
    verzija: APP_VERSION,
    meta: getB2BWorkflowMeta(),
    summary,
    slucajevi: cases,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  const auth = await requireIdentity(request, ΩClearanceLevel.ADMIN);
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Nevalidan JSON payload.' }, { status: 400 });
  }

  const payload = (body ?? {}) as {
    partner?: { naziv?: string; tip?: string; trziste?: string; kanalKontakta?: string };
    vozilo?: {
      marka?: string;
      model?: string;
      oprema?: string;
      trziste?: string;
      budzet?: number;
      valuta?: 'EUR' | 'USD' | 'RSD';
      prioritet?: 'nizak' | 'srednji' | 'visok' | 'kritican';
      rok?: string | null;
    };
    paymentSource?: string;
    deliveryAddress?: string;
    deliveryContact?: string;
    privateOwnerName?: string;
    privatePhone?: string;
  };

  if (!payload.partner?.naziv || !payload.vozilo?.marka || !payload.vozilo?.model) {
    return NextResponse.json(
      { error: 'Obavezna polja: partner.naziv, vozilo.marka, vozilo.model.' },
      { status: 422 },
    );
  }
  if (!payload.deliveryAddress || !payload.privatePhone || !payload.privateOwnerName) {
    return NextResponse.json(
      { error: 'Obavezna polja: deliveryAddress, privatePhone, privateOwnerName.' },
      { status: 422 },
    );
  }

  const created = await createB2BProcurementCase({
    partner: {
      naziv: payload.partner.naziv,
      tip: (payload.partner.tip as 'proizvodjac' | 'ovlasceni_diler' | 'posrednik' | 'tehnoloski_partner') ?? 'ovlasceni_diler',
      trziste: payload.partner.trziste ?? 'Srbija',
      kanalKontakta: payload.partner.kanalKontakta ?? 'sales@spaja.rs',
    },
    vozilo: {
      marka: payload.vozilo.marka,
      model: payload.vozilo.model,
      oprema: payload.vozilo.oprema ?? 'FULL OPREMA',
      trziste: payload.vozilo.trziste ?? 'Srbija',
      budzet: Number(payload.vozilo.budzet ?? 0),
      valuta: payload.vozilo.valuta ?? 'EUR',
      prioritet: payload.vozilo.prioritet ?? 'visok',
      rok: payload.vozilo.rok ?? null,
    },
    paymentSource: payload.paymentSource ?? 'AI IQ World Bank',
    deliveryAddress: payload.deliveryAddress,
    deliveryContact: payload.deliveryContact ?? 'interni-kontakt',
    privateOwnerName: payload.privateOwnerName,
    privatePhone: payload.privatePhone,
  });

  return NextResponse.json(
    {
      status: 'kreirano',
      poruka: 'B2B slučaj je kreiran.',
      slucaj: created,
      sabloni: {
        inicijalniUpit: buildKomunikacioniSablon('inicijalni_upit', created),
        zahtevFullOprema: buildKomunikacioniSablon('zahtev_full_oprema', created),
      },
      timestamp: new Date().toISOString(),
      verzija: APP_VERSION,
    },
    { status: 201 },
  );
}

export async function PATCH(request: NextRequest) {
  const auth = await requireIdentity(request, ΩClearanceLevel.ADMIN);
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Nevalidan JSON payload.' }, { status: 400 });
  }

  const payload = (body ?? {}) as {
    caseId?: string;
    action?: {
      type?: string;
      payload?: Record<string, unknown>;
    };
  };
  if (!payload.caseId || !payload.action?.type) {
    return NextResponse.json({ error: 'Obavezna polja: caseId, action.type.' }, { status: 422 });
  }

  const result = await patchB2BProcurementCase({
    caseId: payload.caseId,
    action: {
      type: payload.action.type as
        | 'offer_upsert'
        | 'negotiation_add'
        | 'document_update'
        | 'approval_update'
        | 'payment_update'
        | 'delivery_update'
        | 'status_transition',
      payload: (payload.action.payload ?? {}) as never,
    },
  });

  if (result.error || !result.updated) {
    return NextResponse.json(
      {
        status: 'greska',
        poruka: result.error ?? 'Ažuriranje nije uspelo.',
        verzija: APP_VERSION,
        timestamp: new Date().toISOString(),
      },
      { status: 422 },
    );
  }

  return NextResponse.json({
    status: 'azurirano',
    poruka: 'B2B slučaj je ažuriran.',
    slucaj: result.updated,
    timestamp: new Date().toISOString(),
    verzija: APP_VERSION,
  });
}
