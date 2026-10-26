# GitHub PR import — SUPEROMEGATRAJEKTORIJUM

## Purpose and source

Owner request: import and implement the PR archive referenced by
https://chatgpt.com/share/6ad9bade-bd78-83eb-b855-34247d14b535 and build the platform.
The source is a metadata/body archive, not a bundle of PR code changes.
This feature lets the owner inspect that archive at `/github-pr-import`, reached
from `/omegatrojektorijum`. It does not merge PRs, execute imported commands, or
claim current CI/deployment status from historical metadata.

Source snapshot: 2026-10-22, 1,254 PRs across 14 repositories with PRs (18 checked).
Counts: 72 open, 1,159 merged, 23 closed unmerged; 36 open drafts;
1,226 public records and 28 private records. Snapshot statuses are historical.

Source ZIP SHA-256:
`bef4cffda03287d57fb03ab955ca1bea10655cc0b82407a049e15532c4f5aa13`

Source `pull-requests.json` SHA-256:
`f1c9f42890d5ed5bfab1963186e84b37605ed111f99b3ffb026f2b26ec227b50`

Private source data is not checked into this public repository, embedded in the
application bundle, or sent to a server by the import feature. Only synthetic
fixtures belong in tests. Unknown metadata fields are discarded from normalized
exports; preserve the original archive separately for lossless archival use.

## Use

1. Extract `SPAJA-GitHub-PR/pull-requests.json` from the owner's ZIP archive.
2. Open **GitHub PR uvoz**, choose the JSON, and inspect the summary.
3. Combine text, repository, status, visibility and open-draft filters.
4. Browse 20 records per page. Details display descriptions as literal text,
   with branch names, SHAs, labels and retrieval timestamps.
5. Export the filtered records as a JSON file which can be imported again.
   Public-only selections download immediately. If the selection contains private,
   internal or unknown visibility records, a native browser confirmation shows
   their combined count and the total number of selected records, and explicitly
   says those records will be included in the downloaded JSON. Choose OK to export
   or Cancel to leave without creating a file. The inline notice also shows the
   non-public count. Counts include all matching pages, not just the visible page.

Confirmation is required on every non-public export. Consent is not stored or
reused after filter changes, reset, replacement imports or clearing data. The
synchronous check uses the current filtered selection and happens before JSON
serialization, Blob creation and object URL creation. If the browser suppresses
the confirmation and returns false, the export is cancelled.

Data lives only in React memory. Clear, reload or leave the route to remove it.
Service-worker controller changes do not reload this route because that would
erase an in-progress import. Manual reload still updates the application.
Other routes retain their existing service-worker behavior.

Select controls have explicit accessible names. The shared desktop navigation
uses a bounded horizontal scroll area so its large link catalog cannot expand
the whole page beyond the viewport. Browser checks cover desktop and mobile widths.

## Offline CLI

```sh
node --import tsx scripts/import-github-prs.mts /private/pull-requests.json /private/validated-prs.json
```

The CLI validates and writes only normalized data outside the checkout. Existing
outputs are not overwritten; new outputs use mode 0600. Its printed report has
counts and provenance dates, not PR descriptions. It makes no API calls.

## Validation boundaries

- Envelope: schema 1.0, owner spaja86, exact total; at most 16 MiB and 10,000 PRs.
- Positive integer IDs/numbers; duplicate ID and repository/number rejection.
- Restricted repository names, canonical HTTPS GitHub PR links, UTC dates,
  state/status/date consistency, branch SHAs, labels, typed fields and lengths.
- HTML, Markdown, shell commands and arbitrary extra metadata remain inert.
- Unknown or missing visibility is treated as non-public for export confirmation.

## Checks

```sh
node --import tsx --test src/tests/lib/github-pr-import.test.ts src/tests/lib/omegatrojektorijum.test.ts src/tests/lib/omegatrojektorijum-projects.test.ts
node node_modules/eslint/bin/eslint.js src/lib/github-pr-import.ts src/app/github-pr-import src/components/PWARegistration.tsx src/app/omegatrojektorijum/page.tsx src/tests/lib/github-pr-import.test.ts scripts/import-github-prs.mts
npm run build
```

Browser acceptance tests use Playwright and a local production server. Supply
Playwright/Chromium from a development environment; they are not production
dependencies. The full-archive test is explicitly skipped without the private
snapshot path. Do not add the real snapshot to public test fixtures.

```sh
PR_IMPORT_START_SERVER=1 PR_IMPORT_TEST_URL=http://127.0.0.1:3218 \
PR_IMPORT_PLAYWRIGHT_MODULE=/absolute/playwright/index.mjs \
PR_IMPORT_CHROME_PATH=/absolute/chromium \
node --test scripts/github-pr-import-browser.test.mjs
```

The command above runs synthetic fixtures only. Do not set `PR_IMPORT_SNAPSHOT`
in public CI; the existing optional full-archive check is skipped by default.

Coverage: pagination/filter combinations, invalid-import recovery, clear/reload,
keyboard details, confirmed private export, cancellation with zero Blobs/object
URLs/downloads, immediate public export, mixed visibility across pages, repeated
consent, filter/reset changes, replacement imports, hostile body text, worker
activation retention, mobile layout and navigation. Browser tests block unexpected
external network requests and fail on page errors. A dedicated synthetic case
observes fetch, XMLHttpRequest, sendBeacon, WebSocket and EventSource calls during
import/filter/cancel/export and rejects archive transport calls, including to the
same origin. Body-free Next.js prefetch GETs for pre-existing local navigation
links are distinguished from archive transport; the harness aborts these unrelated
prefetches to avoid flooding the test server. All unexpected external requests
remain blocked and fail the test. This checks the feature's local data flow; it
is not an audit of all unrelated platform routes or extensions.

### Historical stacked-branch validation — 2026-10-24

- New cancellation regression reproduced the original problem before the fix:
  one Blob and one object URL were created instead of zero.
- Local production Chromium: **9 synthetic scenarios passed, 0 failed**; the
  optional private-snapshot scenario was skipped. No real archive was read.
- Targeted parser/workspace regressions: **11/11 passed**.
- `npm run build`: passed, including TypeScript and **1,422 static pages**.
- Changed-file ESLint: **0 errors, 0 warnings**.
- `npm run test:smoke`: **43/43 passed**; `test:dependencies`: **8/8 passed**.
- `predeploy:check`: exit 0, **warning / runtime readiness false**. This is not
  production-readiness approval. Full `npm test` was not rerun for this scoped
  change; earlier full-suite timing failures remain recorded in PR #1369.
- Static review of the importer/parser/CLI found no imported-data network sink;
  the browser regression observed zero archive transport calls. The imported
  records remain in React memory; confirmed downloads use a local Blob URL.
- Remote CI and independent human review are separate outstanding release gates;
  consult the PR's current checks rather than treating local passes as remote CI.

## Review and rollout

Change driver: owner's shared-chat import/build request, plus the 2026-10-24
request to require explicit non-public export confirmation in draft PR #1369.
Export hardening: `OKRID-2026-PRIVACY-001` (initiative; owner area: Platform +
Automation; status: active, awaiting human review and remote CI). Roadmap item:
GitHub PR import export privacy. KPI targets: confirmation for every non-public
selection, zero files on cancellation, public-only export in one click, zero
imported-data transport calls. Scope: this repository's local import UI only;
downstream impact: none, including `spaja86/IO-OPENUI-AO`.
KPI: 1,254 validated records available locally; zero imported code executions.
Original stacked baseline: `7d34702cafe8e38e218a3f53b96e6bfcb4715284`, PR #1364.
The independent extraction described below targets `main` directly and does not
absorb PR #1364 or the independent registry PR #1366.
No dependencies, infrastructure, billing, database, CI or authorization settings
change. No linked-repository writes are required. Rollback: revert this feature,
its workspace link, route-specific PWA guard and navigation containment fix.
Roll back the complete feature together; do not remove export consent while
leaving private-data export available.

Local validation does not replace the existing human-review, CI, security and
deployment gates. No production promotion is part of this PR. Record actual
check results and remaining blockers in its description.

## Independent extraction from main — 2026-10-26

Change driver: the owner's request to separate #1369 from #1364 without repeating
or weakening the completed export-confirmation work. Candidate branch:
`codex/github-pr-import-main-20261026`; target: `main`.

### Pinned comparison

| Reference | Commit | Meaning |
|---|---|---|
| main | `f6c2be5b25d5849193c9067b1f3f5aa67480d4ef` | Independent branch base |
| PR #1369 | `f22e4550025b5b0abca01699bc905035a4d81ab8` | Complete importer including export consent |
| Initially inspected PR #1364 | `096850e0c62140a5654b9e224fee6d01255a669d` | CI recovery and timing stabilization |
| Latest PR #1364 at final comparison | `83e86280a2c15b47f0c18d45c53213c5a5ef10ef` | Four additional Actions-pinning commits |
| Shared ancestor of both PRs | `7d34702cafe8e38e218a3f53b96e6bfcb4715284` | Start of importer-only delta |

Initially #1369 was 12 commits ahead / 31 behind #1364. During extraction #1364
received four Actions-pinning commits (TRU, ChatGPT Katalog, MADAGASKAR and DECIBIL);
at the final pinned comparison #1369 is **12 ahead / 35 behind**. Its direct
comparison with main still includes 46 commits and 67 changed files. The importer-only
three-dot delta contains **13 files**. Latest #1364 changes **173 files** relative to
main; its changed-path intersection with those 13 files is **empty**. The added
commits do not modify the generic runner or application-validation workflow.

The 13-file delta applies cleanly to main. All nine executable/test files retain
the exact Git blob contents of #1369 (parser, page, panel, workspace link,
navigation, PWA guard, CLI, Node tests and browser tests). The four documentation
files retain provenance and privacy governance and explain the extraction.
No runtime dependency, package manifest, lockfile, workflow, authorization setting
or generic test runner is copied from #1364.

### Dependency decision

| Surface | Required from #1364? | Reason |
|---|---|---|
| Parser/filter/summary/export | No | Standalone TypeScript and platform APIs |
| Client panel and route | No | React and Next.js already exist on main; only local parser import |
| Workspace navigation | No | Existing main OMEGA components remain compatible |
| PWA memory retention | No | Small route guard; existing APP_VERSION export is already available |
| CLI and Node regressions | No | Node built-ins and existing tsx; main test:lib discovers the parser test |
| Browser regressions | No for explicit local execution | Playwright/Chromium are external development tooling |
| Full-platform recovery and release gates | Separate prerequisite for release | Full test, build, security and remote CI gates remain unresolved; extraction is not a waiver |

### Exact CI integration work when combining with #1364

There is a tooling interaction despite the disjoint paths. At `83e8628` (unchanged
from `096850e`), the
inventory in `scripts/ci/run-all-tests.mjs` recognizes only
`src/tests/spaja-ultra/pilot-browser.test.mjs` as browser. It therefore classifies
`scripts/github-pr-import-browser.test.mjs` as **node**. A Node shard installs
only root dependencies, where Playwright is absent; the importer test would not
run in the intended browser environment. The current browser job also configures
only `SUOC_PLAYWRIGHT_MODULE` and does not build/start the Next.js application.

Before integrating both branches, a small follow-up on #1364 must:

1. Classify `scripts/github-pr-import-browser.test.mjs` as browser and add an
   inventory regression proving it is absent from Node shards and present in the
   browser suite. Keep every test required; do not rename it to evade discovery.
2. Provide `PR_IMPORT_PLAYWRIGHT_MODULE` pointing to the installed Playwright
   `index.mjs` (the importer uses dynamic ESM import), install Chromium, and build
   the exact tested merge revision in the browser job or transfer a verified
   build artifact for that same revision.
3. Run the existing importer acceptance command with a loopback URL and
   `PR_IMPORT_START_SERVER=1`; keep `PR_IMPORT_SNAPSHOT` unset. Retain the nine
   synthetic passes, the single optional private-archive skip, failures and logs.
4. Require successful browser and Node checks at the combined commit. Existing
   green local results on either branch alone do not validate that combination.

This CI follow-up is intentionally not folded into the standalone importer: doing
so would pull in the runner, its scheduling module, workflow and tooling changes
that this extraction is intended to separate. Original #1364 and #1369 stay
unchanged and draft.

### Recommended integration order

Review this independent importer diff first. Complete #1364's CI recovery plus
the browser registration/startup follow-up, obtain actual successful required
remote checks and human review, and integrate that recovery when authorized.
Then refresh/retest this importer against the resulting main, verify all nine
browser scenarios and merge only this feature branch when authorized. Treat
#1369 as the provenance/alternative for the same feature, not an additional
feature to merge a second time. No merge or production deployment is authorized
by this extraction report.

### Fresh validation on the independent candidate

Environment: Node 24.22.1, Next.js 16.4.1, TypeScript 5.9.3. Dependencies were
reused from an existing installation with a byte-identical package lock; installed
overlapping package versions were checked against that lock. This is not a fresh
`npm ci` result and does not replace CI installation checks.

| Check | Fresh result on main plus the extracted feature |
|---|---|
| Parser + both OMEGA suites, `node --import tsx --test` | 11/11 pass |
| Smoke suite through `node --import tsx --test` | 43/43 assertions pass |
| API contracts through `node --import tsx --test` | 48/48 pass |
| Full TypeScript, `tsc --noEmit --incremental false` | Pass |
| ESLint on all nine executable/test files | Zero errors; one unchanged Navigation warning from main |
| Synthetic CLI checks | Normalized private-data round trip, mode 0600, no body in console, no overwrite, repository-output rejection and invalid-input rejection all pass |
| `npm run predeploy:check` | Exit 0 with warnings; runtime readiness and production promotion remain unproven |
| `npm test` | Blocked before tests: tsx CLI Unix IPC socket `listen EPERM`; direct Node invocations above are separate scoped checks |
| Full `npm run build -- --webpack` | First attempt exhausted the default roughly 2 GiB V8 heap. Retry with `NODE_OPTIONS=--max-old-space-size=6144` reached the 900-second timeout (exit 124) during compilation; no successful full build is claimed |
| Source preservation | All nine executable/test Git blobs exactly match #1369 |
| Latest CI compatibility | Three-way Git merge of the code candidate with #1364 is conflict-free; actual runner inventory reproduces the browser-as-node defect described above |

The historical 2026-10-24 build/browser results above belong to the stacked branch
and are not substituted for fresh results on this independent branch. Full build,
browser and remote CI outcomes are recorded below and in the draft PR. All browser
checks use synthetic data; no real PR archive is added to this branch.

Remote checks inspected on 2026-10-26 are not green: the pinned #1369 head has
13 completed Actions runs (failure/startup_failure), and the pinned #1364 head
initially had 17 (failure/startup_failure); the final `83e8628` head has 17 completed
failing runs, including application validation and the
security scanner. These conclusions do not establish a code vulnerability or a
specific test regression; they establish that successful remote validation has
not been obtained. This extraction neither changes billing/account settings nor
disables failing checks.
