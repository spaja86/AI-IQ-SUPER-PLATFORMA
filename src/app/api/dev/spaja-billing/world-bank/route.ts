import { handleTestLedger } from '@/lib/billing-world-bank/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) { return handleTestLedger(request, 'GET'); }
export async function POST(request: Request) { return handleTestLedger(request, 'POST'); }
