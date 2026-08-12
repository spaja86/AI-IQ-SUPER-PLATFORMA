import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  buildGigatronAuditEntry,
  generateGigatronInvoice,
  getGigatronSubscriptionOverview,
} from '@/lib/billing/gigatron-subscription';

export async function GET() {
  return NextResponse.json({
    sistem: 'GIGATRON d.o.o. Pretplata — SPAJA',
    opis: 'Repo-local governance i guardovani model za GIGATRON RSD pretplatu — 1 beskonačan račun po pravu Republike Srbije.',
    overview: getGigatronSubscriptionOverview(),
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

  const { datumIzdavanja } = body as Record<string, unknown>;
  const datum =
    typeof datumIzdavanja === 'string' && datumIzdavanja ? datumIzdavanja : new Date().toISOString().slice(0, 10);

  const faktura = generateGigatronInvoice(datum);
  if (!faktura) {
    return NextResponse.json(
      {
        error: 'Račun nije mogao biti generisan.',
        razlog:
          'Pretplata nije u statusu approved-for-invoice/payment-pending ili nedostaju pravni/poreski elementi. Status ostaje blocked-until-validated.',
        governance: '/docs/GIGATRON-PRETPLATA-BESKONACNI-RACUN.md',
      },
      { status: 422 },
    );
  }

  const audit = buildGigatronAuditEntry(faktura.datumIzdavanja, faktura.datumDospeca);

  return NextResponse.json({
    success: true,
    faktura,
    audit,
    timestamp: new Date().toISOString(),
  });
}
