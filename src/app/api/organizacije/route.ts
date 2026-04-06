import { NextResponse } from 'next/server';
import { organizations, getActiveOrganizations } from '@/lib/organizations';

export async function GET() {
  const active = getActiveOrganizations();

  return NextResponse.json({
    status: 'operational',
    ukupno: organizations.length,
    aktivnih: active.length,
    organizacije: organizations.map((o) => ({
      id: o.id,
      name: o.name,
      type: o.type,
      status: o.status,
      icon: o.icon,
      mission: o.mission,
      platforms: o.platformIds.length,
      capabilities: o.capabilities.length,
    })),
    timestamp: new Date().toISOString(),
  });
}
