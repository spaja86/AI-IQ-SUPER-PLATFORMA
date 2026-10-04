import { NextResponse } from 'next/server';
import { buildBankPrototypeSummary } from '@/lib/bank-prototype';

/** Public allowlisted prototype only; legacy identities/accounts are not returned. */
export async function GET() {
  return NextResponse.json(buildBankPrototypeSummary());
}
