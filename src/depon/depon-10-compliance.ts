/**
 * 🛡️ DEPON-10 — Admin & Compliance
 *
 * HIPAA/GDPR/State law compliance engine, admin tools,
 * audit trails, and data governance for all 50 US states.
 *
 * Kompanija SPAJA — Digitalna Industrija
 */

import type { DeponId } from './depon-registry';

export const DEPON_ID: DeponId = 'DEPON-10';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ComplianceLaw =
  | 'HIPAA'
  | 'GDPR'
  | 'CCPA'
  | 'CPRA'
  | 'SHIELD'
  | 'NYDFS'
  | 'TDPSA'
  | 'VCDPA'
  | 'CPA'
  | 'CTDPA'
  | 'UCPA'
  | 'FDBR'
  | 'PCI-DSS'
  | 'SOC2';

export type AuditAction =
  | 'user.login'
  | 'user.logout'
  | 'user.register'
  | 'data.access'
  | 'data.export'
  | 'data.delete'
  | 'payment.processed'
  | 'admin.config-change'
  | 'compliance.review'
  | 'security.alert';

export type AuditEntry = {
  auditId: string;
  action: AuditAction;
  actorId: string;
  actorRole: string;
  targetId: string | null;
  targetType: string | null;
  stateCode: string;
  ipAddress: string;
  metadata: Record<string, unknown>;
  laws: ComplianceLaw[];
  timestamp: Date;
};

export type ComplianceCheck = {
  checkId: string;
  law: ComplianceLaw;
  stateCode: string;
  passed: boolean;
  findings: ComplianceFinding[];
  checkedAt: Date;
};

export type ComplianceFinding = {
  severity: 'info' | 'warning' | 'critical';
  code: string;
  description: string;
  remediation: string;
};

export type DataSubjectRequest = {
  requestId: string;
  type: 'access' | 'deletion' | 'portability' | 'correction' | 'opt-out';
  userId: string;
  stateCode: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  submittedAt: Date;
  completedAt: Date | null;
  deadline: Date;
};

// ─── Compliance Law to State Mapping ─────────────────────────────────────────

export const STATE_APPLICABLE_LAWS: Record<string, ComplianceLaw[]> = {
  CA: ['CCPA', 'CPRA', 'HIPAA', 'PCI-DSS'],
  NY: ['SHIELD', 'NYDFS', 'HIPAA', 'PCI-DSS'],
  TX: ['TDPSA', 'HIPAA', 'PCI-DSS'],
  VA: ['VCDPA', 'HIPAA', 'PCI-DSS'],
  CO: ['CPA', 'HIPAA', 'PCI-DSS'],
  CT: ['CTDPA', 'HIPAA', 'PCI-DSS'],
  UT: ['UCPA', 'HIPAA', 'PCI-DSS'],
  FL: ['FDBR', 'HIPAA', 'PCI-DSS'],
};

export const DSR_DEADLINE_DAYS: Record<DataSubjectRequest['type'], number> = {
  access: 30,
  deletion: 45,
  portability: 30,
  correction: 30,
  'opt-out': 15,
};

// ─── Service Functions ────────────────────────────────────────────────────────

export function buildAuditEntry(params: {
  action: AuditAction;
  actorId: string;
  actorRole: string;
  stateCode: string;
  ipAddress: string;
  targetId?: string;
  targetType?: string;
  metadata?: Record<string, unknown>;
}): AuditEntry {
  const laws = STATE_APPLICABLE_LAWS[params.stateCode.toUpperCase()] ?? ['HIPAA', 'PCI-DSS'];
  return {
    auditId: `aud_${params.action.replace(/\./g, '_')}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    action: params.action,
    actorId: params.actorId,
    actorRole: params.actorRole,
    targetId: params.targetId ?? null,
    targetType: params.targetType ?? null,
    stateCode: params.stateCode,
    ipAddress: params.ipAddress,
    metadata: params.metadata ?? {},
    laws,
    timestamp: new Date(),
  };
}

export function buildDSR(params: {
  type: DataSubjectRequest['type'];
  userId: string;
  stateCode: string;
}): DataSubjectRequest {
  const submittedAt = new Date();
  const deadlineDays = DSR_DEADLINE_DAYS[params.type];
  const deadline = new Date(submittedAt);
  deadline.setDate(deadline.getDate() + deadlineDays);

  return {
    requestId: `dsr_${params.type}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    type: params.type,
    userId: params.userId,
    stateCode: params.stateCode,
    status: 'pending',
    submittedAt,
    completedAt: null,
    deadline,
  };
}

export function getApplicableLaws(stateCode: string): ComplianceLaw[] {
  return STATE_APPLICABLE_LAWS[stateCode.toUpperCase()] ?? ['HIPAA', 'PCI-DSS'];
}

export function getHealthStatus(): {
  depon: string;
  status: 'ok';
  version: string;
  supportedLaws: ComplianceLaw[];
} {
  const allLaws = new Set<ComplianceLaw>();
  for (const laws of Object.values(STATE_APPLICABLE_LAWS)) {
    for (const law of laws) allLaws.add(law);
  }
  return { depon: DEPON_ID, status: 'ok', version: '1.0.0', supportedLaws: [...allLaws] };
}
