# Digitalni Kompjuter: verified foundation

## Implemented in this change
- Six public catalog APIs identify their output as declaration-only, not measured runtime health.
- Activation does not claim resource provisioning.
- Joysticks are included consistently in inventory and statistics.
- B2B authorization uses server-managed Supabase app_metadata, never user-editable user_metadata.
- Contract tests reject HTTP errors and assert catalog consistency, trusted authorization and declaration-only responses.
- Local CLI: `npm run digitalni-kompjuter -- inventory|status|check|test`.
  These commands do not deploy, connect a bank, create a card, or transfer funds.

## Authorization rollout (required before merging)
Existing users with clearance only in user_metadata will lose B2B access intentionally.
An administrator must independently verify entitlement and set an integer
`app_metadata.clearanceLevel` through trusted server-side administration.
Do not copy client-provided claims automatically. Never expose a service-role key.
This PR does not change remote users or configuration.

## Remaining work, in order
1. Review UI wording and all downstream catalog consumers for compatibility.
2. Validate whole-project typecheck/build and integration-level 401/403 behavior.
3. Consolidate monitoring credentials and use verified project IDs with a timeout;
   keep UNKNOWN when unavailable. Presence of a token is not proof of live health.
4. Review AI-IQ-WORLD-BANK once repository access is available. Public catalog links
   do not integrate sessions, balances or financial operations.
5. Define sandbox integration with an authorized bank/payment provider. Internal
   account IDs and virtual balances are not bank accounts or settled funds.
6. Separate read-only diagnosis from any future write CLI. Payments require explicit
   approval, idempotency, provider confirmation and reconciliation.

No production deployment, payment or financial credential changes are included.

## Validation recorded for this PR
- New contract suite: passed.
- Six catalog route suites: 24 checks passed.
- CLI `check`: passed; runtimeVerified remains false.
- ESLint on new CLI/test, catalog, authorization and six routes: passed.
- `git diff --check`: passed.
- Whole-project `tsc --noEmit --incremental false`: failed with 300 diagnostics
  in other modules (including extrimli and AI identity finance). No full build or
  production readiness is claimed. Baseline comparison has not been performed.

## Follow-up compiler cleanup
Removed duplicate identical canonicalAlias/flowLock declarations, corrected the
identity-status type import to its defining module, and imported the missing
PersonaRegistrationInput type. No runtime financial behavior was added.
Whole-project diagnostics decreased from 300 to 293. New catalog contracts,
ESLint on the three touched modules, and diff check passed. Remaining diagnostics
include schema drift in large EXTRONDOL/EXTREM reporting models; these require
contract-focused review rather than casts, disabled checking or invented data.
