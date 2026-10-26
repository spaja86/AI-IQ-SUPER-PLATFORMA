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

### Export-confirmation validation — 2026-10-24

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
Baseline: `7d34702cafe8e38e218a3f53b96e6bfcb4715284`, PR #1364,
`fix/main-ci-validation-20261021`. This change is reviewed as a stacked draft
against that branch; it does not absorb the independent registry PR #1366.
No dependencies, infrastructure, billing, database, CI or authorization settings
change. No linked-repository writes are required. Rollback: revert this feature,
its workspace link, route-specific PWA guard and navigation containment fix.
The export-hardening follow-up can be reverted separately, but that restores
the earlier warning-only behavior and should not be promoted without review.

Local validation does not replace the existing human-review, CI, security and
deployment gates. No production promotion is part of this PR. Record actual
check results and remaining blockers in its description.
