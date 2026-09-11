import { ΩAuditLogger } from '@/middleware/omega-audit';
import type { PretplataSnapshot } from './login-pretplata';

interface AuditLoginPretplataParams {
  userId: string;
  resource: string;
  ip: string;
  userAgent: string;
  clearanceLevel: number;
  pretplata: PretplataSnapshot;
}

export function auditLoginPretplataEvents(params: AuditLoginPretplataParams): void {
  ΩAuditLogger.log({
    userId: params.userId,
    action: 'LOGIN_SUCCESS',
    resource: params.resource,
    ip: params.ip,
    userAgent: params.userAgent,
    outcome: 'SUCCESS',
    details: { clearanceLevel: params.clearanceLevel },
  });

  ΩAuditLogger.log({
    userId: params.userId,
    action: 'SUBSCRIPTION_STATUS_EVALUATED',
    resource: params.resource,
    ip: params.ip,
    userAgent: params.userAgent,
    outcome: 'SUCCESS',
    details: {
      status: params.pretplata.status,
      plan: params.pretplata.plan,
      goNoGo: params.pretplata.goNoGo,
      source: params.pretplata.source,
    },
  });

  if (!params.pretplata.dozvole.industrija) {
    ΩAuditLogger.log({
      userId: params.userId,
      action: 'INDUSTRY_ACCESS_DENIED_SUBSCRIPTION',
      resource: params.resource,
      ip: params.ip,
      userAgent: params.userAgent,
      outcome: 'DENIED',
      details: {
        status: params.pretplata.status,
        plan: params.pretplata.plan,
        razlog: params.pretplata.razlog,
      },
    });
  }
}
