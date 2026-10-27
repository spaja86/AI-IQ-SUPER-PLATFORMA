# Stripe Checkout/webhook P0 correction — 27 October 2026

**Development patch; production billing remains NO-GO.** No real or sandbox Stripe HTTP operations, payments, deployments, merges or remote database changes were performed. The nine P0 expectations from #1372 now pass locally. The full strict route suite remains red because three previously documented anti-fraud P1 expectations are still unresolved.

Source: #1372 at `da7a1e96443eee107538531a013981f8fdacb200`; current main checked as `f6c2be5b25d5849193c9067b1f3f5aa67480d4ef`. New work is isolated from both existing branches. Original audit evidence is retained unchanged.

## Changes

- Checkout fails closed on missing/unreadable profiles, resolved Supabase errors and unconfirmed/zero-row customer linking. Customer creation uses a stable per-user Stripe idempotency key, and linking uses compare-and-set. Billing lock, authentication, rate limits, cooldown, kill switches, currency and session limits remain enforced. Active recurring configured prices and amounts are checked before customer/session creation.
- Idempotency validation precedes mutations; long namespaced keys use a full SHA-256 digest. Session metadata uses a stable operation identifier so an HTTP retry with a new tracing request ID does not change Stripe parameters.
- Both completed and asynchronous Checkout success require subscription mode, `payment_status=paid`, configured paid plan, matching profile/customer/subscription, and the current Stripe subscription with matching Price/quantity, `active` status and a paid latest invoice. Expanded Stripe objects use `.id`. Trial/free/no-payment-required policy is deliberately not inferred.
- Subscription updates/deletions and failed invoices must match the profile's bound subscription. An update cannot bootstrap an unpaid entitlement. Current subscription/invoice state is retrieved before changes; obsolete paid invoice failures do not lock the account.
- `withRetry` checks resolved `{ error }` results as well as rejected promises. An unavailable database circuit fails closed. Every unconfirmed critical operation returns 503 even when diagnostic DLQ recording succeeds or fails.
- PostgreSQL `commit_stripe_billing_event` commits profile, audit chain, business-effect key, event receipt and completion together. Transaction rollback leaves failed delivery retryable. Event-ID replay and different IDs for the same activation are idempotent. Subscription-scoped source timestamps and profile revisions prevent stale state writes. The audit chain head is checked under the same transaction lock; conflicting snapshots require a fresh delivery.
- Quarantine is acknowledged only when its receipt and DLQ record commit together. Optional user notifications run after financial commit. Existing latency fields, metadata masking, tracing and grace-period behavior are retained.
- RPC uses SECURITY INVOKER with service-role-only execution. New ledger tables have RLS and no anon/authenticated access. The original broad profile UPDATE grant also allowed direct client billing-field changes; the SQL proposal revokes billing-column writes while preserving existing safe personal-preference columns.
- `test:billing` now includes the strict isolated suite after its existing TypeScript suites. Known failures remain failures, not skipped tests or rewritten expectations.

## Results and evidence

| Check | Result | Scope |
|---|---|---|
| Original 65 tests before changes | 45 pass / 20 fail | Reproduced locally, same audit SHA |
| Same original criteria after changes | 62 pass / 3 fail | All nine original P0 cases pass; invoice fixture now includes the subscription binding it must prove |
| Expanded isolated route suite | **103 pass / 3 fail / 0 skip / 0 TODO** | Original 65 + 41 new cases; real Next request/response and Stripe signature verification, simulated Stripe HTTP/Supabase |
| SQL transaction suite | **14/14 pass** | Actual PostgreSQL execution via PGlite 0.5.10, fault triggers, rollback/retry, ACLs, duplicate effects and scoped ordering |
| Existing billing suites via Node loader | **10/10 files pass** | Includes the pre-existing hardening 9/9 and orchestration 27/27 assertions; file counts are not assertion counts |
| Standard `npm run test:billing` | Blocked before test execution | Existing tsx CLI IPC `listen EPERM`; equivalent TypeScript files executed with `node --import tsx --test` |
| TypeScript / targeted ESLint | **Pass / pass (0 warnings)** | Full application typecheck; lint only changed JS/TS |
| Dependency audit | **55 findings: 21 high, 19 moderate, 15 low, 0 critical** | Existing lockfile unchanged; not a clean security gate |
| Full app test/build/smoke/predeploy | Not executed | This is not a release candidate |

[Strict route JSON and source hashes](evidence/stripe-p0-2026-10-27.json) · [Route TAP](evidence/stripe-p0-2026-10-27.tap) · [SQL TAP](evidence/stripe-p0-sql-2026-10-27.tap) · [Validation summary](evidence/stripe-p0-validation-2026-10-27.json).

The three remaining failed cases are **FRAUD-01, FRAUD-02 and FRAUD-03**: measured Checkout attempts, distinct trusted IPs, and blocking the resulting high-risk account. Their placeholder inputs remain unchanged. This patch does not claim distributed abuse protection or a verified rolling 30-day payment-failure counter. Required follow-up: trusted proxy policy and durable/atomic counters with bounded retention; do not substitute another constant.

## Database integration boundary

`supabase/sql/stripe-p0-atomic.sql` is a **review-only transactional schema proposal**, not an installed production migration. The Supabase CLI is not available here; no migration history was fabricated. Before promotion, generate a migration with the CLI against an isolated target and include this reviewed SQL, inspect/apply it there, run advisors and repeat the application-to-PostgREST checks. Deploy schema and v3 handler together with ingress/Checkout stopped during the handover. Missing RPC/ledger schema fails closed with 503.

The repository has references to `stripe_webhook_events` and `financial_audit_log` but lacks their original CREATE TABLE statements. SQL tests explicitly construct those prerequisites and use the actual initial `profiles` definition. They prove behavior on that documented local schema, not the unknown deployed database. Verify target grants, policies, triggers, existing status constraint names and column types before migration. Reconcile legacy event rows: old receipts do not prove successful processing and are deliberately not auto-marked complete.

PGlite executes real PostgreSQL SQL and rollback, but its single-connection test runner is **not proof of multi-process contention, Supabase PostgREST transport, physical-host durability or production failover**. The route fault simulator is likewise not a database. Notifications remain best-effort and are not a durable financial outbox. The transaction uses one global billing advisory lock for correctness; throughput must be measured before release. Do not prune activation-effect keys as ordinary transient webhook logs.

## Reproduction

```sh
npm ci
npm run test:stripe:isolated        # expected exit 1: 103 pass, 3 remaining fraud failures
node --import tsx --test src/tests/billing/*.test.ts
npx tsc --noEmit --incremental false

# Disposable test-only tool installation, separate from app dependencies:
npm install --prefix /tmp/stripe-sql-test --no-save --ignore-scripts @electric-sql/pglite@0.5.10
PGLITE_MODULE=/tmp/stripe-sql-test/node_modules/@electric-sql/pglite/dist/index.js npm run test:stripe:sql
```

No Stripe keys or Supabase URLs are needed for these tests. The isolated route runner excludes host credentials; the SQL suite creates a local database. Do not point these tests at a remote project.

## Remote CI and review

The pre-existing audit head has failed/stopped remote checks: FinOps `startup_failure`, failed Security Scanner/Omega Sync Safety/VRH workflows, and two Vercel statuses reporting account deployment blocked. Security Scanner run `40106768147` lists four failed jobs with **no steps or logs**. These are not results of this patch or its new strict regression gate, and no successful CI execution is claimed. New publication uses `[skip ci]`. Draft PR #1377 was opened. At published code head `8b37771e6e4a4e21cf37679b814c66737595126c`, GitHub Actions reported **zero PR-triggered runs** and two Vercel statuses reported account deployment blocked. Local/remote tree hashes matched exactly before subsequent evidence formatting updates; final head observations are maintained in the PR description.

**Open repository gate:** GitHub reports the newly created commits as `unsigned`. [AGENTS.md](../AGENTS.md) requires signed commits. The available publishing API did not produce signatures; a non-mutating CLI push check failed because CLI authentication is unavailable. No signing identity or approval is invented. Re-sign the development changes through an authorized signing setup before merge. This is separate from code/test results.

Reason: owner's explicit request to repair #1372 P0 findings. Proposed tracking ID `OKRID-2026-STRIPE-P0-001`, status proposed, review owner maintainer (no sign-off inferred). Cross-repo impact: no IO-OPENUI-AO API or source changes. This is a security-sensitive draft requiring human/security review before merge. No production billing approval.

Rollback: stop billing ingress/Checkout before reverting any runtime/schema change. Preserve completion/effect/audit records; do not delete them or silently resume the old vulnerable handler. Review and reconcile in-flight and legacy events in an isolated environment first. No new paid infrastructure or Stripe operations were used.

## Documentation checked

- https://docs.stripe.com/webhooks — signatures, duplicate delivery, retry behavior.
- https://docs.stripe.com/checkout/fulfillment — payment-gated fulfillment and asynchronous payments.
- https://docs.stripe.com/billing/subscriptions/webhooks — paid invoices and subscription state.
- https://docs.stripe.com/api/subscriptions/object — subscription, Price and expanded invoice shape.
- https://supabase.com/docs/reference/javascript/maybesingle — distinguish zero rows from database errors.
- https://supabase.com/docs/guides/database/functions — RPC and function security.
- https://supabase.com/changelog — current changes reviewed; no dependency upgrade included in this repair.
