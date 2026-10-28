import { NextResponse } from 'next/server';
import { getDevelopmentNetworkMapping } from '@/lib/deploy/spaja-network-development';

export const dynamic = 'force-dynamic';

/** No fetch, DNS mutation, TLS issuance or deployment. Exact logical ID lookup only. */
export async function GET(request: Request) {
  const mapping = getDevelopmentNetworkMapping();
  const id = new URL(request.url).searchParams.get('id');
  const application = id === null ? null : mapping.applications.find(app => app.spajaId === id);
  if (id !== null && !application) {
    return NextResponse.json({ error: 'Unknown SPAJA ID' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
  }
  return NextResponse.json(id === null ? mapping : { networkId: mapping.networkId, application }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
