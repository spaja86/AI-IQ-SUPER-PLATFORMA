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

## Report-contract follow-up
Finance governance types now describe the existing subsidy-status evidence;
persona readiness has an explicit status-union annotation. WATCH-summary entries
are readonly tuples so their message lookup remains a string, not boolean|string.
Six finance governance scenarios pass, including promotion freezes and
non-operational evidence boundaries. Catalog contracts and targeted lint pass.
Whole-project TypeScript diagnostics: 291; compilation remains blocked.

## Typed persona records
Seed mapping now has an explicit AiIdentityFinanceGovernancePersonaRecord return
contract. This context preserves literal fields without casts or widening the
contract. The declared weekly target is unchanged and is not a balance or payout.
Catalog and six finance scenarios pass; targeted ESLint and diff check pass.
Whole-project diagnostics: 290. No diagnostics remain in
ai-identity-finance-governance.ts in this run; overall compilation still fails.

## Deterministic fallback propagation
Evaluate/compile now pass the existing decoration-track fallback requirement,
matching the other integration calls. The public-boundary switch captures its
status before narrowing, preserving exhaustive typing and fail-closed behavior.
Catalog/finance diagnostics and targeted lint pass. TypeScript diagnostics: 286,
none in the two touched modules in this run. Overall compilation still fails.
Language suite: 10 pass, 1 determinism assertion fails. A comparison run with the
pre-change engine also produces 10 pass / the same 1 failure. This is not a clean
language-suite pass and requires a separate investigation.

## Timing-aware determinism tests
Observed identical input scores/status, but cold-start evaluation produced
sinemetricko BLOCKED followed by READY on warm calls. The integration profile
intentionally includes measured duration in its performance guard.
The deterministic test now uses a fixed clock restored in finally; a separate
controlled slow-clock test asserts sinemetricko and overall remain BLOCKED.
Language suite: 12 passed, 0 failed; targeted ESLint and diff check passed.
Production timing and guards are unchanged. Full-project compilation remains
blocked; no new full typecheck was run for this test-only follow-up.

## Innovation registry contract
Registry construction is contextually checked against its full model. The target
count has a literal constant and tests verify it equals clusterCount times
innovationsPerCluster and the materialized inventory count. Summary/full cache
separation and deep freezing are tested. These are catalog records, not proof of
implemented capabilities. Diagnostic suites and targeted lint pass. Whole-project
TypeScript diagnostics: 281; compiler still fails, with none in this registry.

## Roadmap cadence comparison
The comparable roadmap lock previously omitted dailyOperationalCadence, rejecting
its own canonical keyset. Comparison now includes it; tests prove canonical and
cloned locks align, modified task focus is rejected, and the canonical remains
unchanged. All diagnostic suites and targeted lint pass. Whole-project TypeScript
diagnostics: 280; compilation still fails. No production deployment performed.

## Readonly health and rollout ring contracts
Both health snapshot interfaces accept the readonly tuples their producers
already return. Rollout ring selection is contextually typed against the existing
B2B ring union. Runtime statuses and thresholds are unchanged. Diagnostic suites,
targeted ESLint and diff check pass. Whole-project diagnostics: 276 (still a
failed compilation). No full build or production deployment performed.

## Duplicate EXTRONDOL fields
AST inspection confirmed three identical duplicate property initializers:
kraljevskiDrustveniPoredak, covecnostAuditVisualReference and repoWideReflection.
Removed the earlier copies; the effective last values remain unchanged.
All diagnostic suites and targeted lint pass. Whole-project diagnostics: 273;
compilation still fails. No runtime status, payments or deployments changed.

## Wave alias compatibility
Prongilacija and sinemetricko governance outputs now include canonical currentWave
and eligibleNextWave alongside existing currentWawe/eligibleNextWawe fields.
Both pairs derive from the same parameters; legacy fields are retained explicitly
in the contract. Diagnostic suites, targeted lint and diff check pass. Whole-project
TypeScript diagnostics: 271; compilation remains blocked. Full EXTRONDOL runtime
integration has not been verified by this change.

## Workshop wave and distribution token types
ALATI/RADIONICA now includes canonical wave names alongside legacy spellings,
with the same values. Distribution coverage uses a readonly token tuple preserving
its literal union. Diagnostic suites pass; targeted lint has 0 errors and 11
unused-variable warnings. Whole-project diagnostics: 268, still failing.
Full report-runtime validation, build and production deployment remain unverified.

## Unreachable status comparisons
Removed comparisons that cannot match their local producer unions: a READY/BLOCKED
implementation package was compared with WATCH, and a READY/WATCH dispute status
was compared with BLOCKED. No producer status or meaningful guard changed.
Diagnostic suites pass; targeted ESLint has 0 errors / 11 warnings. Whole-project
diagnostics: 266, compilation still fails. Broader runtime behavior unverified.
