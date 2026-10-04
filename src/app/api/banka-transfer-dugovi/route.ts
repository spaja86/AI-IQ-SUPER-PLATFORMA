import { NextResponse } from 'next/server';
import { buildBankPrototypeSummary } from '@/lib/bank-prototype';

/** Read-only prototype status; never claims that a bank transfer occurred. */
export async function GET() {
  return NextResponse.json({
    ...buildBankPrototypeSummary(),
    transfer: null,
    dugovi: { confirmedAmount: null, source: 'unverified', notice: 'Proveriti stvarne Vercel fakture u Billing/Invoices.' },
  });
}
