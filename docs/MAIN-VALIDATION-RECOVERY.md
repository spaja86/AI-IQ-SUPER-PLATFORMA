# Main validation recovery

OKRID: `OKRID-2026-GOV-001` — release governance. Status: **blocked**.
Reason: PRs #1360/#1361 merged without recorded human approvals or confirmed CI.
Baseline: `f6c2be5b25d5849193c9067b1f3f5aa67480d4ef`.

## Active protection

The repository rulesets `SPAJA-main-review-and-checks` (25514062) and
`SPAJA-main-validation-hold` (25513933) target `refs/heads/main`, are active,
and have empty bypass lists. The hold blocks main updates even when review
and checks pass. Administrators can still edit rulesets; that is not a merge
bypass and must be separately authorized and recorded.

This change does not remove the hold, merge changes, rerun cleanup, alter
billing, invite reviewers, or deploy anything.

## Proposed validation

`application-validation.yml` runs on every pull request to main, with no path
filter, and on pushes to main. It tests `github.sha`: the PR test merge revision
or pushed commit. It checks that the checkout SHA matches and records the tree,
parents, PR head/base, Node/npm versions, commands, exit codes and log hashes.

Four isolated jobs cover:

- Full project and pilot TypeScript, repository lint, CI guard regressions.
- Existing `test:ci` suites (including both login routes) and `test:vrh`.
- Smoke, mandatory predeploy source contracts and production build.
- The real SUOC Chromium/loopback-HTTP scenarios, using separately locked
  Playwright 1.62.1 tooling under `tools/ci-browser`.

`SPAJA application gate` has `always()` and all four jobs in `needs`. Only four
explicit `success` results pass. Missing, malformed, skipped, cancelled,
neutral, failed and unexpected results fail. Its reporting job has no checkout
and no token permissions.

`SPAJA security gate` similarly checks the four existing Security Scanner jobs.
Every PR must successfully execute Dependency Review, Secret Heuristics,
npm audit and CodeQL. Only non-PR push/scheduled/manual events permit the
intentional Dependency Review skip. The other scans may never be skipped.
Security scans remain in their existing workflow; the application gate alone
does not certify security or authorize release.

All new action references use verified full commit SHAs. Eight previously
unpinned references in FinOps, Engine Registry and Branch Cleanup are pinned.
The cleanup workflow's existing deletion behavior is unchanged; do not rerun
it to test this patch. CI Health now distinguishes workflow/configuration
errors from account/runner blocks instead of attributing all startup failures
to infrastructure. Its free-form note is passed through an environment value.

The shared test runner now fails when a required test directory is missing or
empty, and reports discovered/completed file counts. File counts are not
individual assertion counts; individual test reporters remain in the logs.

Artifacts contain only `.ci-evidence/`, retained for 14 days. That directory is
gitignored. These records aid review; code running in a job can modify its own
artifacts, so hashes are not independent attestations. No production secrets,
deployment hooks or GitHub status-writing token are passed to validation code.

## Predeploy scope

The existing predeploy command exits zero in non-strict mode even when critical
contracts are false. The new wrapper requires all five mandatory source
contracts to be explicitly true, including when production environment values
are absent. It parses the command's separate stdout, not a log mixed with
stderr warnings. It does not substitute dummy production credentials.

Production configuration remains a separate operator check:
`npm run predeploy:check -- --strict` in the approved deployment environment.
Never expose production secrets to a PR to make branch CI green. Passing
branch CI is not proof of hosting, billing, service availability or deployment.

## Local verification on 2026-10-21

Node 24.19.0; locked install with lifecycle scripts disabled.

| Check | Observed result |
|---|---|
| Full TypeScript | Passed |
| Login security regression suite | 29/29 passed |
| `npm run test:vrh` | Passed, including durable pilot and reference profiles |
| Direct smoke invocation (`node --import tsx`) | 43/43 passed |
| Next.js production build | Exit 0; 1,421 static pages generated |
| Repository lint | 31 errors, 91 warnings in existing files |
| New/modified CI helper JavaScript lint | Passed |
| New CI guard regression tests | 8 Python tests (98 result cases) and 13 Node tests passed |
| Dependency audit | 51 affected dependency entries: 15 high, 20 moderate, 16 low; 0 critical |
| Standard `npm run test:ci` and `test:smoke` | Blocked before tests by local tsx IPC `listen EPERM` |
| Full predeploy source report | Five mandatory `contractReady` flags false; new wrapper correctly fails |
| Browser setup | Chromium archive download/extraction failed locally; browser scenarios NOT executed in this review |
| Remote CI | Successful execution NOT established |

The predeploy results are contract-check findings, not proof that all five
application endpoints fail at runtime. The current checker requires literal
API entries in a sitemap that currently lists public pages; reconcile this
contract deliberately and retain meaningful endpoint/navigation checks.
Do not bypass the failing check or manufacture a success result.

The successful build and targeted tests do not override the incomplete suite,
lint failures, missing browser execution, security scans or absent human review.
The dependency counts are npm audit entries, not 51 distinct root exploits.
No automatic `npm audit fix --force` was used: suggested changes include a major
version rollback for eslint-config-next and require separate compatibility review.

## Human security review and CODEOWNERS

The current CODEOWNERS file covers billing and only names `@spaja86`. It does
not yet provide qualified ownership of authentication, SUOC or CI changes.
An author cannot approve their own PR. Another account operated by the author
or an AI assistant does not establish independent human review.

Before releasing the hold, the owner must name a real, qualified GitHub reviewer
with verified write access and acceptance of the role. Granting new access is a
separate authorization. Do not insert a guessed username or an unusable team.
Preserve existing billing ownership, then add the verified reviewer to:

```text
/src/app/api/auth/
/src/app/api/login/
/src/lib/auth/
/src/lib/owner-identity.ts
/src/lib/rate-limit.ts
/src/middleware/
/src/lib/suoc-pilot/
/src/lib/spaja-ultra-core/
/pilot/suoc/
/scripts/suoc-pilot.ts
/src/tests/auth/
/src/tests/spaja-ultra/
/.github/
/.agent-config.json
/AGENTS.md
/scripts/ci/
/scripts/tests/
/scripts/run-tsx-tests.mjs
/scripts/predeploy-check.mjs
/tools/ci-browser/
/package.json
/package-lock.json
/docs/MAIN-VALIDATION-RECOVERY.md
/docs/LOGIN-PROTECTION.md
/docs/SUOC-DURABLE-PILOT-REVIEW.md
```

This is a path inventory, not a functional CODEOWNERS file. Each entry needs a
verified owner, and changes require review. CI files and CODEOWNERS itself must
be protected against changing gate logic, removing coverage or duplicating a
required check name. Binding a check to the GitHub Actions App does not bind it
to a single immutable workflow.

## Recovery and hold exit

1. Resolve the GitHub account/runner restriction through the account owner or
   support. A self-hosted runner is not assumed to bypass an account lock.
   Keep local work on review branches. No fabricated statuses or admin bypass.
2. Fix and review the recorded lint/contract findings; run the full suite and
   real browser scenarios in an available standard Node 24 environment.
3. Obtain a qualified human approval of the latest reviewable push and the
   security-sensitive paths. Verify CODEOWNERS coverage and review identity.
4. Obtain real successful PR-triggered runs on the current head/base and test
   merge revision. Confirm all required jobs actually executed. A manual-only
   run, local report, screenshot or AI review is insufficient.
5. After the new checks are observed and verified, add `SPAJA application gate`
   and `SPAJA security gate` to the required checks, sourced from GitHub Actions
   (App 15368), preserving the existing five checks and strict up-to-date policy.
6. Verify negative cases in a disposable review PR: absent review, new push,
   failure/cancellation/skip/missing check, wrong source App and stale base all
   block. Verify the hold still blocks a PR with otherwise passing conditions.
7. Only a separate explicit approval may disable the hold. Confirm the other
   ruleset remains active with no bypass. Merge and deployment authorization
   are separate decisions. If merge queue is adopted, add and verify merge_group
   handling before use.

An alternative external validator requires its own approved trust, access and
evidence model and an authenticated dedicated GitHub App. It must validate the
exact head/base/merge tree in an isolated worker; reporting credentials and the
decision to publish success must stay outside untrusted test code. It is not a
way to evade account restrictions. Until that exists, retain the hold.

## Rollout, rollback and cost

Rollout: draft review branch, human security review, real CI, required-check
configuration, separately approved hold release. Rollback: revert only this CI
change through a reviewed PR; keep main protection and the hold in place.
KPI targets: zero successful gates with absent/failed required jobs, exact
revision evidence, qualified review coverage. Targets are not claimed achieved
remotely. Cost: four new hosted validation jobs (timeouts 20/30/45/20 minutes)
plus two small reporting jobs and 14-day evidence retention; no paid capacity
or billing settings are authorized or changed. Existing Security Scanner and
other workflow costs are additional. Owner: repository owner with the designated
human reviewer still to be named. Downstream: no `IO-OPENUI-AO` code/config change.

## References

- https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks
- https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-jobs
- https://playwright.dev/docs/ci
- https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA/pull/1360
- https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA/pull/1361
