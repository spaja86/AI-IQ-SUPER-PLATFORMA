import { NextResponse } from 'next/server';
import { getKnowledgeHealth } from '@/lib/spaja-baza-knowledge';

export const runtime = 'nodejs';

export async function GET() {
  const health = await getKnowledgeHealth();
  return NextResponse.json({
    sistem: 'SPAJA BAZA Knowledge Health',
    ...health,
    timestamp: new Date().toISOString(),
  });
}

