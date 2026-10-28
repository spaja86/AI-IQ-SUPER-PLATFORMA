# Stripe FRAUD-01/02/03 correction — 27 October 2026

**FRAUD correction for draft PR #1377; production billing remains NO-GO. Unsigned development publication explicitly authorized by the owner on 28 October 2026; no merge or deployment authorized.**

This patch starts from PR #1377 head `8404697fb713d2515cab35961d42c136ae6174c6`, verified again against GitHub after implementation. It repairs the three remaining fraud cases, without replaying or rewriting the completed P0 work. The existing webhook handler, `stripe-p0-atomic.sql`, original 14 SQL regressions, and dependency lockfile are byte-for-byte unchanged.

## Behavior

| Case | Correction |
|---|---|
| FRAUD-01 | An authenticated request with a valid ingress attestation and an existing profile is recorded before body/plan validation or Stripe operations. One transaction counts actual requests in the rolling hour, including denied requests. |
| FRAUD-02 | Only an approved ingress HMAC can establish the source IP. Forwarded, X-Real-IP and provider-specific client headers are ignored. IPv6 and mapped IPv4 are canonicalized before fingerprinting; unique fingerprints are measured over a rolling 24 hours. |
| FRAUD-03 | The existing risk thresholds are evaluated from measured signals inside the admission transaction. Score >=60 blocks with 403; existing account billing locks also block. User limit 5/hour and IP limit 20/hour remain, now in durable SQL rather than a memory/KV fallback. |

The 30-day failed-payment signal is read from existing committed `stripe_billing_effects` joined to `stripe_billing_commits`, scoped to the user, applied `invoice.payment_failed` effects and source timestamps. The permanent business-effect key already deduplicates repeated deliveries of the same invoice attempt. Raw receipts and lifetime `profiles.failed_payment_count` are not treated as 30-day measurements. Existing soft-lock behavior and financial audit records remain intact.

Risk denial is reevaluated from rolling evidence on every new request; it does not permanently change a paid subscription or invent a new account lock. SQL and the existing TypeScript assessor must agree on the score and decision before the route can proceed.

## Trusted ingress contract

Next Request does not expose a trustworthy transport peer for this route. The route therefore requires a signed attestation; setting `X-Forwarded-For` or an environment flag that simply trusts it cannot authorize a request.

`src/lib/stripe/checkout-proxy.ts` supplies an adapter for a separately approved Node ingress that terminates the client connection directly. It derives the address from `IncomingMessage.socket.remoteAddress`, retains only Authorization, Content-Type and Idempotency-Key, strips client source/forwarding/tracing headers and mints a fresh UUID nonce for every incoming request. It is code for integrating into the selected ingress, **not a deployed or running proxy**. If that ingress sits behind another proxy, this direct-peer policy identifies that upstream proxy; approve a separate transport policy before use. Do not replace the socket value with an arbitrary HTTP header.

Application-only configuration (no real values added):

- `STRIPE_CHECKOUT_PROXY_ID`: approved signer identifier, 1–64 alphanumeric/underscore/hyphen characters.
- `STRIPE_CHECKOUT_PROXY_AUDIENCE`: deployment-specific identifier, same format; isolates staging/production.
- `STRIPE_CHECKOUT_PROXY_KEY`: 32 random bytes encoded as 64 lowercase hex characters, shared only with the ingress.
- `STRIPE_CHECKOUT_IP_HASH_KEY`: separate 32-byte random HMAC secret, application-only; never send to the ingress or browser.

Attestation fields are `x-spaja-source-proxy`, `x-spaja-source-time`, `x-spaja-source-nonce`, `x-spaja-source-ip`, and `x-spaja-source-signature`. HMAC-SHA256 binds protocol version, audience, signer, timestamp, nonce, canonical IP, POST, exact Checkout path, and SHA256 digests of the Authorization value, Idempotency-Key value and raw UTF-8 body. It expires after 60 seconds, permits at most 10 seconds of future clock skew, rejects duplicate/list/invalid fields, and compares signatures in constant time. The exact body is bounded at 16 KiB independently of Content-Length. TLS and private origin access are required when integrating this adapter. Never log or echo source attestations, signing keys or tokens.

## Atomicity, replay and interruption

`record_stripe_checkout_attempt` uses the **same transaction-scoped advisory lock** as the P0 financial transaction, followed by the profile lock. It requires READ COMMITTED isolation and samples database time after the lock is acquired. All measurements and the decision are committed as one admission row. Missing schema, failed reads/writes, unconfirmed RPC results or inconsistent response fields fail closed with 503 before Stripe calls.

Each HTTP invocation gets a server-generated attempt UUID. A retry of that RPC after an ambiguous commit reuses the UUID and returns its exact persisted result, without incrementing again. A new HTTP request counts again even when the Stripe Idempotency-Key is unchanged. Reusing a signed proxy nonce in another HTTP invocation is rejected. Database receipt retries and HTTP retries are deliberately distinct.

No runtime fallback to process memory is available for Checkout admission. No application wall-clock override or client-supplied counter is accepted by SQL. Windows are `(database_now - duration, database_now]`; current request counts are included. Existing Stripe idempotency continues to protect customer/session creation.

## Privacy and retention

Transient admission rows store user UUID, random attempt/nonce IDs, request digest, keyed IP fingerprint, database observation time and decision/counts. They do not store raw IPs, raw Authorization, request bodies, Idempotency-Key values or client trace strings. Checkout diagnostics use server-owned trace IDs and generic dependency errors. HMAC fingerprints are pseudonymous data, not anonymous data.

`prune_stripe_checkout_attempts()` deletes up to 1,000 admission rows older than 25 hours per invocation. An approved maintenance worker must run it hourly and repeat while 1,000 rows are returned; nominal retention is 25 hours plus scheduling delay. **The worker schedule is not installed here.** Validate deletion latency, backlog alerts, backup/log retention and restricted operator access before enabling the gate. This function never deletes billing commits, business effects or financial audits. User deletion cascades only the transient attempt rows; existing financial-table constraints remain unchanged.

RLS is enabled; PUBLIC/anon/authenticated have no access to the transient tables or functions. Functions use SECURITY INVOKER, empty search_path and service-role-only grants/checks. The application service role can read but cannot modify the approval policy. The schema creates the policy disabled with history unverified. An authorized database owner must first reconcile prior 30-day payment evidence and then approve the policy with the SHA256 of the configured IP-HMAC hex secret. A changed fingerprint key fails closed instead of silently resetting counters. Key rotation needs an ingress stop and a reviewed overlap/reconciliation plan; no seamless rotation claim is made.

## Actual local results

| Check | Result | Meaning |
|---|---|---|
| Reproduced baseline at `8404697` | 103 PASS / 3 FAIL, 106 total | FRAUD-01/02/03 failed as reported. |
| Existing 106 expectations after repair | 106 PASS / 0 FAIL | All original P0 expectations remain passing. FRAUD fixtures now use a signed transport identity and dated verified failure evidence. No safety assertion was weakened or skipped. |
| Expanded strict route suite | **140 PASS / 0 FAIL / 0 skipped / 0 TODO** | Includes forged headers, source/body/auth/key binding, freshness, body limits, nonce replay, HTTP vs RPC retries, lost responses, database errors, 50 parallel simulated requests, clock boundaries and privacy checks. |
| SQL and recovery suite | **34 PASS / 0 FAIL** | 14 unchanged P0 tests + 18 new fraud tests + 2 disk-backed crash tests, PGlite 0.5.10. Includes 48 risk combinations, 25 queued admissions, 12 fresh route instances connected to SQL, ACLs, rollback, retention and high-risk blocking. |
| Existing billing TypeScript suite | **10/10 files PASS** | `node --import tsx --test src/tests/billing/*.test.ts`; file counts are not assertion counts. |
| Full application TypeScript | **PASS** | `tsc --noEmit --incremental false`. |
| Targeted ESLint / diff whitespace | **PASS, 0 warnings / PASS** | Changed JS/TS files only. |
| Standard `npm run test:billing` | **BLOCKED before execution** | Existing tsx CLI IPC `listen EPERM`; equivalent TypeScript files and strict suite were executed separately. |
| Dependency audit | **55 existing findings: 21 high, 19 moderate, 15 low, 0 critical** | Dependencies and lockfile unchanged. This is not a clean release gate. |
| Full app tests/build/smoke/predeploy | Not executed | No release-readiness claim. |

Crash tests initialize a filesystem-backed local PostgreSQL/WASM database, kill a separate process with SIGKILL after COMMIT or before COMMIT, then reopen and verify exact recovery/retry. This proves recovery in that local PGlite filesystem setup. It does **not** establish production storage durability, replication/failover, native PostgreSQL multi-connection contention or real PostgREST behavior. PGlite serializes concurrent submissions on one connection. A native PostgreSQL install was unavailable in this execution environment (package-manager identity-switching permissions); no native contention test is claimed.

[Route JSON/source hashes](evidence/stripe-fraud-2026-10-27.json) · [Route TAP](evidence/stripe-fraud-2026-10-27.tap) · [SQL/recovery TAP](evidence/stripe-fraud-sql-2026-10-27.tap) · [Validation summary](evidence/stripe-fraud-validation-2026-10-27.json).

## Reproduction

```sh
npm ci --ignore-scripts
npm run test:stripe:isolated
node --import tsx --test src/tests/billing/*.test.ts
npx tsc --noEmit --incremental false
# Disposable local test tool only; application lockfile is unchanged:
npm install --prefix /tmp/stripe-sql-test --no-save --ignore-scripts @electric-sql/pglite@0.5.10
PGLITE_MODULE=/tmp/stripe-sql-test/node_modules/@electric-sql/pglite/dist/index.js npm run test:stripe:sql
```

All test credentials, identities and payment data are synthetic. No Stripe sandbox/live HTTP operations, remote database changes, production migrations, deployment, merge, message/comment or account configuration changes were made during local validation. The later authorized publication changes only this draft PR branch and its review metadata.

## Publication and promotion gates

The development patch was prepared against `8404697` and its complete 23-file package was restored and verified against tree `88ca3cd7b47b2d2365fea5eb462c5f114738a7fb` before publication. All runtime/test source SHA256 values exactly match the locally tested package; only this publication note changes afterward. [AGENTS.md](../AGENTS.md) requires signed agent commits. On **28 October 2026**, the owner explicitly approved an exception for this unsigned development commit in existing draft PR #1377: “Da — objavi patch bez merge-a i deploymenta”. This limited exception does not change the general repository signing policy, authorize merge/deployment, or constitute security/release sign-off. The commit uses `[skip ci]`; no deployment command or workflow dispatch is issued. The PR description records the published commit and observed remote state.

Remote observation at that unchanged head: zero PR-triggered GitHub Actions runs, and two failed Vercel account-blocked statuses. These do not validate this local follow-up. No remote CI was triggered.

Before promotion: this specific unsigned development publication has the owner exception above; human/security review remains required; generated/reviewed migration against an isolated target; verification of the actual prerequisite schemas, grants and history; approved real ingress deployment and key management; scheduled retention; native PostgreSQL contention tests including simultaneous webhook/admission traffic; real Supabase/PostgREST plus Stripe sandbox end-to-end validation; required release gates and green remote CI. No production approval is implied.

Both SQL files remain review-only proposals, not installed migrations. Missing or disabled policy intentionally blocks Checkout. Global serialization favors correctness and needs capacity/load validation. Rollback must stop billing ingress, preserve the permanent financial ledger and reconcile in-flight attempts; do not resume the old header-trusting route. No linked-repository API change or new paid infrastructure is introduced.

Change driver: owner's explicit request to continue #1377 and repair FRAUD-01/02/03. Proposed tracking remains `OKRID-2026-STRIPE-P0-001`, initiative scope, maintainer review pending. KPI: all three fraud expectations and all original P0 expectations pass locally. Cross-repo impact: none.

## Documentation reviewed

- https://docs.stripe.com/webhooks — signature and duplicate-delivery handling; webhook code retained.
- https://supabase.com/docs/guides/database/functions — RPC security and execution privileges.
- https://supabase.com/changelog.md — reviewed current changes.
- https://supabase.com/changelog/cbc-tls-ciphers-deprecated — upcoming HTTP TLS change; no dependency/network downgrade introduced.
- https://www.postgresql.org/docs/current/explicit-locking.html — transaction-scoped advisory locking.

The signed ingress protocol and retention/approval policy above are this patch's design decisions, not claims that those vendors have configured them for this project.
