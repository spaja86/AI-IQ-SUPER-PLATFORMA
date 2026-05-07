// SpajaUltraOmegaCore -∞Ω+∞ — Admin: Automated PII Scan of Audit Metadata (#93)
// Kompanija SPAJA — Digitalna Industrija
// GET /api/admin/billing-pii-scan
//
// Skenira financial_audit_log.metadata polja i traži PII pattern-e
// (email, IBAN, kartice, ime-prezime) koji ne bi smeli biti u audit metapodacima.

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient, verifyUserFromToken } from '@/lib/supabase/server';

const PII_PATTERNS: Array<{ name: string; pattern: RegExp }> = [
  { name: 'email', pattern: /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g },
  { name: 'card_number', pattern: /\b(?:\d[ -]?){13,16}\b/g },
  { name: 'iban', pattern: /\b[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}([A-Z0-9]?){0,16}\b/g },
  { name: 'phone', pattern: /(?:\+\d{1,3}[\s\-]?)?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}/g },
  // Zabranjeni raw UUID koji izgleda kao SSN/personal number
  { name: 'ssn_like', pattern: /\b\d{3}-\d{2}-\d{4}\b/g },
];

function scanForPii(value: unknown, path = ''): Array<{ path: string; piiType: string; snippet: string }> {
  if (typeof value === 'string') {
    const hits: Array<{ path: string; piiType: string; snippet: string }> = [];
    for (const { name, pattern } of PII_PATTERNS) {
      const matches = value.match(pattern);
      if (matches) {
        for (const m of matches) {
          hits.push({ path, piiType: name, snippet: m.slice(0, 20) + (m.length > 20 ? '…' : '') });
        }
      }
    }
    return hits;
  }

  if (Array.isArray(value)) {
    return value.flatMap((v, i) => scanForPii(v, `${path}[${i}]`));
  }

  if (value !== null && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).flatMap(([k, v]) =>
      scanForPii(v, path ? `${path}.${k}` : k),
    );
  }

  return [];
}

function isAdminUser(user: { user_metadata?: Record<string, unknown> } | null): boolean {
  if (!user) return false;
  const roles = user.user_metadata?.['roles'];
  if (Array.isArray(roles)) return roles.includes('admin') || roles.includes('superadmin');
  return false;
}

export async function GET(request: NextRequest) {
  const user = await verifyUserFromToken(request.headers.get('authorization'));
  if (!isAdminUser(user as Parameters<typeof isAdminUser>[0])) {
    return NextResponse.json({ error: 'Forbidden — admin pristup obavezan.' }, { status: 403 });
  }

  const supabase = getSupabaseServerClient();
  const limit = Number(request.nextUrl.searchParams.get('limit') ?? '200');
  const since = request.nextUrl.searchParams.get('since');

  let query = supabase
    .from('financial_audit_log')
    .select('id, action, metadata, created_at')
    .order('created_at', { ascending: false })
    .limit(Math.min(limit, 500));

  if (since) {
    query = query.gte('created_at', since);
  }

  const { data: entries, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const violations: Array<{
    auditEntryId: string;
    action: string;
    piiFindings: Array<{ path: string; piiType: string; snippet: string }>;
    createdAt: string;
  }> = [];

  for (const entry of entries ?? []) {
    const findings = scanForPii(entry.metadata);
    if (findings.length > 0) {
      violations.push({
        auditEntryId: entry.id,
        action: entry.action,
        piiFindings: findings,
        createdAt: entry.created_at,
      });
    }
  }

  return NextResponse.json({
    scannedEntries: (entries ?? []).length,
    violationCount: violations.length,
    violations,
    piiPatternsChecked: PII_PATTERNS.map((p) => p.name),
    timestamp: new Date().toISOString(),
  });
}
