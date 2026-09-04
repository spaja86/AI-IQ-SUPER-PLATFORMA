// SpajaUltraOmegaCore -∞Ω+∞ — Autokuća B2B Perpetual Subscription API
// Kompanija SPAJA — Digitalna Industrija
// GET  /api/billing-autokuca-subscription          — status svih autokuća pretplata
// POST /api/billing-autokuca-subscription          — generiši pun račun za ciklus
//
// Governance: docs/AUTOKUCA-PRETPLATA.md

import { NextRequest, NextResponse } from 'next/server';
import {
  getAllAutokucaSubscriptionStatuses,
  generateFullInvoice,
  buildAuditEntry,
  type AutokucaKlijentId,
} from '@/lib/billing/autokuca-subscription';

const VALID_KLIJENT_IDS: AutokucaKlijentId[] = ['AUTOKUCA-KG', 'AUTOKUCA-BG'];

export async function GET() {
  const statusi = getAllAutokucaSubscriptionStatuses();
  return NextResponse.json({
    sistem: 'Autokuća B2B Pretplata — SPAJA',
    opis: 'Beskonačan (perpetual recurring) pun račun u EUR — Kragujevac i Beograd Autokuća',
    pretplate: statusi,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Neispravan JSON u telu zahteva.' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Neispravan format zahteva.' }, { status: 400 });
  }

  const { klijentId, datumIzdavanja } = body as Record<string, unknown>;

  if (!klijentId || !VALID_KLIJENT_IDS.includes(klijentId as AutokucaKlijentId)) {
    return NextResponse.json(
      { error: `Nepoznat klijentId. Dozvoljene vrednosti: ${VALID_KLIJENT_IDS.join(', ')}` },
      { status: 400 },
    );
  }

  const datum = typeof datumIzdavanja === 'string' && datumIzdavanja
    ? datumIzdavanja
    : new Date().toISOString().slice(0, 10);

  const id = klijentId as AutokucaKlijentId;
  const faktura = generateFullInvoice(id, datum);

  if (!faktura) {
    return NextResponse.json(
      {
        error: 'Račun nije mogao biti generisan.',
        razlog: 'Pretplata nije aktivna ili iznos nije definisan. Status: blocked-until-validated.',
        governance: 'docs/AUTOKUCA-PRETPLATA.md',
      },
      { status: 422 },
    );
  }

  // Build audit entry (in production: write to omega-audit middleware / financial_audit_log)
  const audit = buildAuditEntry(id, faktura.datumIzdavanja, faktura.datumDospeca);

  return NextResponse.json({
    success: true,
    faktura,
    audit,
    timestamp: new Date().toISOString(),
  });
}
