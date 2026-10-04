# Bank prototype safety boundary

Reason: user-approved banking audit follow-up. Requires human review; no production promotion or payments.

## Contract
- Public GET /api/ai-iq-world-bank uses an explicit allowlist, never the legacy identity builder.
- Public GET /api/banka, /api/erste-banka-racuni and /api/banka-transfer-dugovi no longer return identities or claim settlement.
- GET /api/bank-prototype/session requires a server-verified Bearer identity. It ignores caller-provided user IDs and returns only that verified ID plus read-only simulation capabilities. Responses use private, no-store and Vary: Authorization. There are no payment or account issuance mutations.
- /bank-prototype uses the existing platform session and same-origin requests. The static bank site links here; no cross-origin token transfer, pasted token, CORS relaxation or shared credential storage is introduced.
- Legacy bank/processing builders declare simulation and unverified settlement; bank pages display a prominent simulation notice. This does not verify partner relationships, bank accounts or advertised KPI/interest values.
- Identity fields in the central builder are redacted; example account numbers are explicitly non-bank identifiers. Git history and all other unrelated financial routes need a separate exposure review. This change does not remove historical copies or claim a complete site-wide security audit.

## Local checks
npm run test:bank-prototype
npm run digitalni-kompjuter -- bank-status

## Rollout and rollback
Review backend PR together with spaja86/Ai-Iq-World-Bank frontend PR. Deploy backend first, verify login/401/no-store and redacted public responses, then enable the frontend link. Keep payments disabled. Do not roll back to identity-leaking payloads; revert UI separately or disable affected routes instead.

## Deferred prerequisites
Production credentials, bank/issuing/IPS provider selection, legal owner and compliance, MFA/authorization review, durable precise ledger and provider reconciliation remain required. Existing Omega session storage is reused only for read-only prototype checks; it is not approval for live financial authority. No invoices have been inspected or paid by this change.

## Verification recorded for this PR
- New prototype safety and HTTP-route regression tests: pass.
- Existing bank module suite: 24 passed, 0 failed.
- Existing digital computer catalog and finance-governance suites: pass.
- Targeted ESLint for changed runtime modules: pass.
- predeploy:check exits 0 with non-blocking contract warnings; this is not proof of production readiness.
- Full TypeScript check exits 2 with 290 diagnostics. A clean archive of the unchanged base commit produced a byte-identical diagnostic log; no new TypeScript diagnostic was introduced in that comparison.
- Production Next build was started but intentionally stopped during compilation after sandbox resource contention. Build is NOT verified. Full suite and browser/network E2E are not verified.
- npm audit reports 53 findings: 13 low, 21 moderate, 18 high, 1 critical. Critical direct dependency: Next 16.2.4; audit suggests 16.3.8. Dependency remediation requires a separate tested update; no blind audit fix was applied.
- This is a draft PR, not approval for deployment or live financial operations.
