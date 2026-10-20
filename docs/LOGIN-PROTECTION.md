# SPAJA login protection parity

Change driver: Nikola Spajić's request on 2026-10-20 to align both login routes after security PR #1357. Reviewed base: `84bab3d1b3b16ce7452ee9df9b0519e69f6e4c65`.

## Verified behavior before this change

| Layer | Actual behavior | Sufficient replacement for login protection? |
| --- | --- | --- |
| Root `middleware.ts` (the active Next middleware) | Counts all requests: 200/minute anonymously; 1,000/minute with any `Bearer ` prefix, without token verification. Uses KV REST when configured, otherwise an in-memory map. Reads the leftmost X-Forwarded-For value, then X-Real-IP, then loopback. | No. It does not observe authentication outcomes or implement the five-failure login block. |
| `src/middleware/omega-security.ts` | Exports separate login failure counters. Its `omegaSecurityMiddleware` function is not invoked by the root middleware. | Only routes that call the login helpers receive this protection. |
| `ΩAuthProvider.login` | Verifies the password and, when enabled, the TOTP before issuing access/refresh tokens. Does not count or block failed attempts. | No. Password/MFA verification and throttling are separate controls. The OAuth bypass fixed in #1357 remains closed. |
| `/api/auth/login` | Checks, records and resets login failures keyed by an unverified forwarded IP or shared loopback fallback. | Has dedicated protection, but header rotation can change its key unless ingress sanitizes headers. |
| `/api/login` | Validates legacy credentials and delegates to the provider, without login failure accounting. Does not forward `totpCode`. | No. Correct MFA logins also cannot complete through this route. |

The regression suite invokes the real root middleware, both route handlers, the real provider and password/TOTP verification. It exercises both the in-memory middleware path and the KV branch with a local fake REST transport. This is not a claim that a live KV service or production proxy was tested.

## Changed behavior and compatibility

- Both routes call `createLoginProtection`. An email normalized with `trim().toLowerCase()` always has the same SHA-256 account key across both routes. Unknown accounts receive the same failure accounting and generic responses.
- A verified-by-configuration client IP adds an independent IP key. Rotating headers or genuine client addresses cannot reset the account key. Changing accounts cannot reset the configured IP key.
- Existing policy is retained: five accumulated failed authentications start a 15-minute block; subsequent valid-shaped attempts return 429 before demo seeding, password/MFA verification or token issuance. This is **not** a rolling five-attempt/15-minute observation window: before a block, failures accumulate until success. Success resets that account's and current trusted IP's counters. Expiry at the exact deadline now starts a fresh cycle.
- Password and missing/invalid TOTP failures count identically. A valid TOTP cannot bypass a wrong password or an active block. The provider's cryptographic behavior is unchanged.
- Legacy `{ email, lozinka }` and `{ email, password }` remain supported, with the same password-field precedence. Optional string `totpCode` is forwarded. Invalid JSON/object/credential/MFA types return 400 without tokens.
- Success response fields, subscription/industry/gaming access, legacy `sesija`, and the refresh cookie (`HttpOnly`, `SameSite=Strict`, `/api/auth`, 30 days, `Secure` in production) remain unchanged. Error fields remain `error` on the primary route and `greska` on the compatible route.
- Both routes log `LOGIN_FAILED` and `LOGIN_BLOCKED_BRUTE_FORCE` without credentials/TOTP. Untrusted IPs are recorded as `unknown`, not as verified loopback or an attacker-supplied address.

## Proxy trust configuration

By default **neither X-Forwarded-For nor X-Real-IP is trusted for login protection**. Next's Request interface does not supply a verified socket peer. The fallback is the account counter, never one shared `unknown` counter that would lock every user out.

`OMEGA_LOGIN_TRUSTED_PROXY_HOPS` is optional and defaults to unset. Only configure a positive decimal integer from 1 through 16 after the operator has verified that:

1. The origin is reachable exclusively through the controlled proxy chain; direct access is blocked by network policy.
2. Each trusted hop appends its observed peer or the ingress overwrites the header with a verified address, and the hop count is fixed across all allowed paths.
3. Client-supplied prefixes cannot occupy the configured trusted position.

The selected address is the Nth entry from the right, where N is the configured number of trusted hops. For two trusted proxies, `forged-prefix, client, edge-proxy` selects `client`. For one sanitizing ingress, use `1` with a single verified client address. Do not enable trust merely because a hosting/provider environment variable exists.

Missing, malformed, oversized, incomplete or invalid-address input falls back to account protection. X-Real-IP is never a fallback. IPv6 spellings and IPv4-mapped IPv6 are canonicalized. A syntactically valid address alone does not prove its provenance; the network constraints above are essential. No deployment configuration is changed by this PR.

The general middleware's existing header trust and Bearer-prefix behavior are documented above, not treated as verified authentication. This patch scopes the new trust policy to login protection and login audit records.

## Operational boundaries

This reuses the existing in-memory failure store. Counters do not survive a restart and are not shared between separate processes/instances. An async login already admitted before the threshold is reached can complete; this is not an atomic distributed admission limiter. Production multi-instance protection needs a shared, atomic store and verified ingress configuration; the middleware KV request limiter does not provide those failure counters. These limitations must not be represented as a production-wide brute-force guarantee.

Account lockouts can be induced by someone who knows an email; this is the existing temporary-block policy applied consistently, with unrelated accounts isolated when no trusted IP is available. Successful login clears only its account/current-IP keys, not other account counters.

## Review and rollout

- Isolated review branch; no automatic merge or production deployment.
- Human security review, release gates and staging verification precede promotion. Verify actual proxy topology before opting into IP trust; default account protection requires no new environment variable.
- Rollback only through a reviewed revert: reverting restores the compatibility-route throttling gap and drops its TOTP support. It must not revert #1357's password verification fix.
- No dependency changes, paid service, billing behavior or linked-repository code change. Downstream reference: `docs/MULTI-REPO-LINKS.md`; no IO-OPENUI-AO synchronization change is needed.
- OKRID: `OKRID-2026-AUTH-001`, continuing the proposed initiative referenced by #1357; registration/owner approval is not asserted. Scope: initiative; roadmap: authentication hardening; owner/security approver: maintainer to assign. KPI: equal route failure accounting, no token issuance on rejected credentials, preserved success contract. Remote CI and production deployment remain separate gates.

## Validation

Local validation on 2026-10-20 with Node.js 24.19.0 and the unchanged package lock:

| Check | Result |
| --- | --- |
| Initial 24-scenario regression run on unchanged routes | 11 passed, 13 failed; includes the unthrottled compatible route, rotating-header/account failures, MFA compatibility and the shared-loopback failure cascade. |
| `node --import tsx --test src/tests/auth/login-route-security.test.ts` | **29/29 passed** after the fix, including proxy validation, audit records and exact block-expiry boundary. Token issuance is observed on the real provider, not replaced with a fake authenticator. |
| `node --import tsx src/tests/auth/omega-auth.test.ts` | **69/69 passed**. |
| `node --import tsx src/tests/api/login-pretplata-route.test.ts` | **6/6 passed**, preserving existing subscription/access responses. |
| Remaining `test:core` files via `node --import tsx` | SUOC core 7/7; lifecycle 17/17; VRH 49/49; main engine 61/61; API contracts 48/48. With the auth suites, **280/280 core checks passed** using this launcher. |
| `node --import tsx src/tests/smoke/smoke.test.ts` | **43/43 passed**. |
| `node node_modules/typescript/bin/tsc --noEmit` | Passed, no diagnostics. |
| ESLint on all changed JavaScript/TypeScript files | Passed, no diagnostics. |
| `npm run build` | Passed, **1,421/1,421 prerender targets**. Existing Edge Runtime deprecation and missing autofinish-trigger-token warnings remain. Initial attempts using a symlinked dependency directory failed Turbopack's root restriction; the final build used an isolated local copy of the same installed dependencies. |
| `node src/tests/auth/login-http-security.mjs` after build | **6/6 production HTTP scenarios passed** on a temporary loopback server: both success/cookie contracts, both thresholds, legacy alias, and shared account counter across compiled bundles. The script stops its server and never deploys. Port 4319 must be free. |
| `node scripts/predeploy-check.mjs` | Passed with existing non-blocking MAKSIMUS contract warnings. |
| `git diff --check` | Passed. |
| `npm run test:core` / standard full-suite gate | Standard core launcher is blocked by `tsx` CLI IPC `listen EPERM`; this is the first gate in `npm test`. Direct Node execution above succeeds; full `npm test` is not claimed green. |
| `npm run lint` | 31 errors / 91 warnings, all errors outside the changed paths. |
| `npm audit --json` | 51 existing dependency findings: 15 high, 20 moderate, 16 low, 0 critical. No dependency/lockfile changes or audit remediation in this patch. |

The expanded handler suite is already part of `test:core`; no workflow or package changes are necessary. HTTP checks run separately after a build. No production account, public deployment, browser UI or live proxy/KV configuration was tested. Full remote CI is a separate, unconfirmed release gate; local results do not imply release approval.

References informing the account and header policy:

- [OWASP Authentication Cheat Sheet — login throttling](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#login-throttling)
- [MDN X-Forwarded-For — selecting an address for security use](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Forwarded-For#selecting_an_ip_address)
