import { NextResponse } from 'next/server';
import { vizuelniIdentitetSistem } from '@/lib/vizuelni-identitet';
import { APP_VERSION } from '@/lib/constants';

/**
 * 🎨 Vizuelni Identitet API
 *
 * Logo, slike osnivača, brend smernice.
 */
export async function GET() {
  return NextResponse.json({
    sistem: 'Vizuelni Identitet — Kompanija SPAJA',
    verzija: APP_VERSION,
    vizuelniIdentitet: vizuelniIdentitetSistem,
    timestamp: new Date().toISOString(),
  });
}
