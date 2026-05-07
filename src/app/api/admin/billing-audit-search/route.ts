// SpajaUltraOmegaCore -∞Ω+∞ — Admin: Billing Audit Search
// Kompanija SPAJA — Digitalna Industrija
// GET /api/admin/billing-audit-search — pretraga audit loga po korisniku/eventu (#37)
//
// Query params:
//   userId    — filter po user_id
//   eventId   — filter po stripe_event_id
//   action    — filter po action tipu (npr. payment.failed)
//   from      — ISO8601 datum od
//   to        — ISO8601 datum do
//   page      — paginacija (default 1)
//   limit     — broj rezultata (default 50, max 200)

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { verifyUserFromToken } from '@/lib/supabase/server';

function isAdminUser(user: { user_metadata?: Record<string, unknown> } | null): boolean {
  if (!user) return false;
  const roles = user.user_metadata?.['roles'];
  if (Array.isArray(roles)) return roles.includes('admin') || roles.includes('superadmin');
  return false;
}

export async function GET(request: NextRequest) {
  const user = await verifyUserFromToken(request.headers.get('authorization'));
  if (!isAdminUser(user as Parameters<typeof isAdminUser>[0])) {
    return NextResponse.json({ error: 'Forbidden — samo admini mogu pretraživati audit log.' }, { status: 403 });
  }

  const { searchParams } = request.nextUrl;
  const userId = searchParams.get('userId');
  const eventId = searchParams.get('eventId');
  const action = searchParams.get('action');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') ?? '50', 10)));
  const offset = (page - 1) * limit;

  const supabase = getSupabaseServerClient();

  let query = supabase
    .from('financial_audit_log')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (userId) query = query.eq('user_id', userId);
  if (eventId) query = query.eq('stripe_event_id', eventId);
  if (action) query = query.eq('action', action);
  if (from) query = query.gte('created_at', from);
  if (to) query = query.lte('created_at', to);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: 'Greška pri pretraživanju audit loga.', details: error.message }, { status: 500 });
  }

  return NextResponse.json({
    total: count ?? 0,
    page,
    limit,
    results: data ?? [],
  });
}
