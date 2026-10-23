# Predeploy source contract correction — PR #1364

Date: 2026-10-21. Change driver: [PR #1364](https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA/pull/1364), OKRID-2026-GOV-001.
Prepared against PR head `68685f804024440c8374cdb50f268baa3d8acc5b`, with base/main `f6c2be5b25d5849193c9067b1f3f5aa67480d4ef`.

## Finding and scope

The previous checker required literal API URLs inside `src/app/sitemap.ts`. That file deliberately excludes `api` and discovers public pages. All five mandatory flags were false; the unchanged CI wrapper rejected that report with exit 1. This was a false negative in source validation, not evidence of five failed live endpoints.

The checker now reads the actual `src/app/api/<route>/route.ts` files and corresponding `src/lib/<module>.ts` files. It uses the already pinned TypeScript parser; no package or lockfile change is needed. Full validation requires installed development dependencies. Fast mode still skips source validation and is still rejected by the CI wrapper.

For each contract it verifies readable, parseable source; an exported GET implementation; a call to the expected builder imported from the correct library; exported contract/model versions; matching source-of-truth and version metadata in the builder or called local helpers; both version-header assignments in GET or called local helpers; and the existing public navigation href. Comments, type declarations and uncalled header helpers do not satisfy these checks. Missing files produce per-contract `failures` rather than an unstructured read exception.

## Individual findings

Each library below is `src/lib/<canonical route>.ts`; each endpoint maps to `src/app<endpoint>/route.ts`.

| Required report field | Endpoint(s) checked | Contract / model | Previous cause | New source result |
| --- | --- | --- | --- | --- |
| `analizaSvega` | `/api/analiza-svega` | v2 / 2.0.0 | API absent from public sitemap | Pass; existing GET, builder metadata and both headers |
| `potencijalSvegaOvogaDoSada` | `/api/potencijal-svega-ovoga-do-sada` | v1 / 1.0.0 | API absent from public sitemap | Pass; existing GET, builder metadata and both headers |
| `ekstremnoProcesuiranjeSvega` | `/api/procesuiranje-svega` and `/api/ekstremno-procesuiranje-svega` | v2 / 2.1.0 | API absent from public sitemap | Pass for both routes; shared canonical source `/api/procesuiranje-svega` |
| `procesuiranje3` | `/api/procesuiranje-3` | v3 / 3.0.0 | API absent from public sitemap | Pass; existing GET, builder metadata and both headers |
| `maksimusSvega` | `/api/maksimus-svega` | v1 / 1.0.0 | API absent from public sitemap | Pass; existing GET, builder metadata and both headers |

No missing source implementation was found among these five contracts. No API implementation was added or changed. The shared extreme/canonical mapping is deliberate, not a redirect or claim that the two responses are identical. `maksimus2` and `maksimus3` use the same corrected checker and retain their existing nonblocking policy.

## Regression coverage and local validation

- 101 source/CLI regression tests: positive repository sources, no sitemap read, missing/empty/unparseable routes, nonexported GET, wrong method, comment-only decoys, bad headers, incorrect header values/imports/source of truth/version metadata, missing libraries/navigation, quote/whitespace variations, canonical-route removal, unused helper rejection, warning-only contracts and strict/fast behavior. Every mandatory contract is individually mutated and passed to the unchanged wrapper, which must return exit 1 for both a missing route and a malformed contract.
- 16 response tests execute the actual six route bodies with deterministic mocked collaborators: successful JSON responses and version metadata/headers, rate limiting, ANALIZA raw/JSON/CSV formats, and extreme degraded fallback. They never import the application dependency graph, access external services, send alerts or write application caches. These are handler tests, not production HTTP integration tests.
- The application workflow runs both suites before source-contract evaluation. Its job dependencies, aggregate gate logic and `scripts/ci/check-predeploy-contracts.mjs` are unchanged.

Environment: Node 24.19.0, npm 11.9.0. Dependencies reused from the existing local checkout after confirming byte-identical `package-lock.json`; no fresh `npm ci` was claimed. The initial shared node_modules symlink was replaced with a local copy for the build, since Turbopack rejects a target outside its project root.

| Local check | Result |
| --- | --- |
| New predeploy regressions | 117/117 pass |
| Existing CI helper regressions | 13/13 pass |
| Existing application/security gate tests | 8/8 pass |
| Full TypeScript (`--noEmit --incremental false`) | Exit 0 |
| Lint of all four changed/new JavaScript modules | Exit 0 |
| Full source report + unchanged wrapper | Exit 0; all five mandatory contracts true |
| Strict predeploy without production credentials | Exit 1 as required; seven required variables absent |
| Direct smoke (`node --import tsx src/tests/smoke/smoke.test.ts`) | 43/43 pass |
| Standard `npm run test:smoke` and `npm run test:ci` | Exit 1 before test execution: local `tsx` IPC `listen EPERM` |
| Full repository lint | Exit 1: 31 errors, 91 warnings (same counts recorded at the initial PR head) |
| Production build, without deployment | Exit 0; 1,421 static pages generated. Existing Edge Runtime and missing token warnings remain. |
| Workflow YAML parsing and whitespace | Pass |

Command/exit records and hashed stdout/stderr logs were generated locally with `scripts/ci/run-check.mjs` under `.ci-evidence/`. Local runs used the worktree based on the head above, including this change; they are not remote commit check results. The smoke suite's generic “ready for go-live” message is not a release approval.

## Limits and remaining blockers

`validation: source-only` is explicit in each result. This is a bounded syntax/structure checker, not a complete TypeScript type checker or a symbolic proof of every control-flow branch. It supports the current named exported functions, named imports, metadata objects and header setters. A structural refactor can require a reviewed checker update; missing evidence must not be coerced to true. The separate type check, response tests, build, smoke and deployment-time configuration checks remain necessary. Live routing, authentication, upstream services and production availability are not established here.

All seven production environment values are absent locally, so overall predeploy status remains `warning` and strict mode remains blocked. Existing `deployPlatforma.ready=false` also remains in the report; that separate heuristic is outside this correction. The existing repository/security findings and human-review requirements from [MAIN-VALIDATION-RECOVERY.md](MAIN-VALIDATION-RECOVERY.md) are not cleared by this change.

Remote evidence at the initial PR head: [application run 39520762034](https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA/actions/runs/39520762034) lists five failed jobs with no executed steps. The PR's recorded diagnosis is account lock due to billing. No successful remote validation is claimed; this change does not alter billing or request a rerun/dispatch. PR-triggered checks on the updated head must be inspected separately.

## Review, rollout and rollback

Keep PR #1364 draft until its remaining validation and independent human-review requirements are satisfied. Both `SPAJA-main-review-and-checks` (25514062) and `SPAJA-main-validation-hold` (25513933) were read as active, main-only, with empty bypass lists; no ruleset was modified. No merge or production deployment is part of this change.

- Rollout: review this branch delta; obtain successful required validation on the exact updated PR revision after account/runner blockers are resolved. Hold release and deployment remain separately authorized actions.
- Rollback: reviewed revert of this source-check correction and its test step; retain the existing CI wrapper and all main protections. A rollback restores the known sitemap false negatives, so it does not authorize promotion.
- KPI impact: five diagnosed false negatives removed; negative regression cases continue to block. No readiness percentage or production availability claim.
- Cost impact: one additional short regression step in the existing build job; no new hosted job, paid capacity or infrastructure.
- Downstream: none; no linked repository or `spaja86/IO-OPENUI-AO` code/configuration changes.

## Reviewed source fingerprints

SHA-256 of the locally tested code and workflow files; compare these with the published branch contents.

| File | SHA-256 |
| --- | --- |
| `scripts/predeploy-check.mjs` | `d8a45cda20cba2364ffcf41a9cee66a95cefdbe4aaa04b946277a1069eb252bc` |
| `scripts/predeploy-source-contracts.mjs` | `598230ea9b624106aaa854e7f6785ef759d87e32515c1ce38ae647d2b4dd7ebf` |
| `scripts/tests/predeploy-source-contracts.test.mjs` | `a67557ad3fb762ea6e6eaa15bd458b0c3a13f708217ab5cd633f9b604e6892ef` |
| `scripts/tests/predeploy-route-responses.test.mjs` | `4dceb934c551c9b995e5020ddce817a8357b2f22d1a7654e703891e423acea12` |
| `.github/workflows/application-validation.yml` | `9d1fafdfbbccecc836a31fb0f443ed85f7be04bef3858384ba700009f34f9ef1` |
