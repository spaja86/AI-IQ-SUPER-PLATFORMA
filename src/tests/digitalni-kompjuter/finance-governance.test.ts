import assert from 'node:assert/strict';
import { buildAiIdentityFinanceGovernancePackage } from '../../lib/ai-identity-finance-governance';
for (const readinessStatus of ['READY', 'WATCH', 'BLOCKED'] as const) {
  for (const promotionFreeze of [false, true]) {
    const report = buildAiIdentityFinanceGovernancePackage({ readinessStatus, readinessScore: 50, deterministicFallbackRequired: true, promotionFreeze });
    assert.equal(report.aiIqWorldBankPrepiska.noRuntimeAuthority, true);
    assert.equal(report.aiIqWorldBankPrepiska.sourceMaterialPolicy, 'documentation-only');
    assert(report.aiIqWorldBankPrepiska.allowedEvidence.includes('bezpovratne-subvencije-status'));
    for (const persona of report.personas) {
      assert(['READY', 'WATCH', 'BLOCKED'].includes(persona.identityCard.readinessStatus));
      if (promotionFreeze || readinessStatus === 'BLOCKED') assert.equal(persona.identityCard.readinessStatus, 'BLOCKED');
    }
  }
}
console.log('PASS: governance evidence and freeze remain non-operational across six scenarios');
