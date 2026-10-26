# PR #1364 — investigation of eight unstable files

Date: 24 October 2026 (Europe/Belgrade). Baseline: `f7d957af25029f059b7056266e0c417c760b5136`. Reason: owner's requested investigation of the eight remaining failures; `OKRID-2026-CI-COVERAGE-001`.

## Evidence recovered

The current `SPAJA-CI-testovi-2026-10-23.zip` contains the complete 1,765-file run, all eight original failing logs and all eight subsequent serial rechecks. Every failing log matches the SHA-256 in its original summary. All **109/109** archived changed source files match their Git blobs at `f7d957a`. The original run itself records the dirty parent `7d34702`; its source digest and publication provenance are retained, rather than relabeling it as a run on a clean commit.

The original result remains **1,757 passed / 8 failed / 0 pending**. No successful recheck replaces that result. Original CPU, cgroup, memory and scheduling measurements were not recorded. We cannot retrospectively prove an OOM, CPU quota event, contention level or precise cause of either original process timeout.

## Findings by file

| File | Original failure | Finding and confidence | Targeted change |
|---|---|---|---|
| `src/tests/api/ai-iq-programski-jezik-route.test.ts` | `/evaluate` 1179.4 ms > 200 ms | Confirmed real wall-clock budget failure. Prior serial 302.1 ms also exists in the original archive: parallelism alone is not a sufficient explanation. No new functional mismatch reproduced. | Exclusive execution within this runner; preserve real clock, cold invocation and 200 ms assertion. |
| `src/tests/api/digitron-route.test.ts` | `/health` 286.0 ms > 200 ms | Confirmed wall-clock sensitivity; concurrent CPU interference is plausible, not established by old telemetry. | Exclusive execution; unchanged assertions. |
| `src/tests/api/ekvivalent-network-route.test.ts` | `/health` 248.3 ms > 200 ms | Same distinction: latency failure is real; an application logic regression is not demonstrated. | Exclusive execution; unchanged assertions. |
| `src/tests/api/tru-route.test.ts` | `/evaluate` 1168.2 ms > 200 ms | Confirmed latency failure; no new functional mismatch reproduced. | Exclusive execution; unchanged assertions. |
| `src/tests/api/trikot-route.test.ts` | `/health` 336.6 ms > 200 ms | Confirmed latency failure; no new functional mismatch reproduced. | Exclusive execution; unchanged assertions. |
| `scripts/tests/all-tests-runner.test.mjs` | Supposedly short second fixture also hit 1500 ms | Confirmed fixture design coupled successful startup to the same short deadline used to force a hang. Separately reproduced a real SIGTERM readiness race in the runner on Node 24.22.1. | Fake-clock deadline boundary/cleanup/continuation regression plus real hanging-process kill integration. Register signal handlers before announcing readiness. |
| `src/tests/auth/login-route-security.test.ts` | Killed at 120095 ms; partial tests passed | Real repeated PBKDF2 (310000 iterations), token and MFA work. Fresh pinned run consumed about 10.8 CPU seconds and 10.9–11.9 s elapsed; original serial retry was 58.3 s. Resource/scheduling sensitivity is plausible. Original exhaustion is unproven. Real clocks also let lockout/MFA windows change with execution speed. | Exclusive execution and per-test controlled `Date.now`; explicit expiry test advances its own clock. All real password, TOTP and token checks retained. |
| `src/tests/autofinish/ekstremno-procesuiranje-svega-route.test.ts` | Killed at 127146 ms during rate-limit loop | Test generated up to 30 complete diagnostic reports while testing a real 60-second limit. This both repeats expensive work and allows the window to expire while counting. Original serial retry took 65.5 s. Exact original timeout cause is not conclusively reproduced. | Seed the real limiter for 29 requests, exercise the real route at requests 30/31, then test 59999/60000 ms boundaries using a controlled clock. Keep the real smoke snapshot. |

The eight files already ran in separate OS processes. Shared JavaScript globals between files are therefore not the demonstrated mechanism. Shared CPU/memory, concurrent external runs, and wall-clock windows remain distinct from shared application state. No evidence of cross-file port/file collisions or a functional application regression was found in this investigation. Production availability and application performance under arbitrary load remain unverified.

## Implemented safeguards

- `// @ci-isolation: exclusive` is an inventory annotation for these eight files. The scheduler drains earlier parallel work, runs an exclusive entry alone, then resumes the remaining inventory. Shard membership/counts are unchanged; no file is skipped or retried automatically. Isolation is within one runner invocation, not a reservation of the whole host or coordination across separate invocations.
- API 200 ms, engine 50 ms, process 120000 ms, crypto iteration counts, MFA and lockout policy remain unchanged. No clocks are mocked in real API performance tests.
- Timeout semantics are checked at 1499/1500 ms with a controlled timer and the actual deadline helper used by the runner. A real hanging process must still be killed with SIGKILL. A cancelled deadline cannot later kill a completed process.
- A newly reproduced cancellation race is fixed: signal handlers are installed before stdout announces readiness. The regression still sends SIGTERM as soon as that announcement arrives.
- Each run has an immutable `attempt-*` directory holding its summary/logs. The parent `summary.json` points to the latest report only. Original failures remain available after a subsequent passing run. Records include start/end timestamps, isolation mode, Node version, available parallelism and Linux cgroup CPU/memory snapshots where present. These cgroup measurements are host-group context, not per-test OOM attribution.

## Reproduction and limitations

Use the Node version pinned by the application workflow, **24.19.0**, with `npm ci --ignore-scripts --no-audit --no-fund`. A clean locked installation succeeded for this investigation. Initial exploratory runs used host Node 24.22.1; their version and the additional failure are retained separately. A first measurement harness launch failed before starting tests because `/usr/bin/time` was unavailable; it was replaced with a Python `wait4` resource collector. That setup failure is not counted as a test result.

```bash
node --import tsx --test --test-reporter=tap scripts/tests/all-tests-runner.test.mjs
node scripts/ci/run-all-tests.mjs --list
node scripts/ci/run-all-tests.mjs --concurrency=4
# CI normally runs each shard serially:
node scripts/ci/run-all-tests.mjs --shard=1/6
```

For a targeted replay, take the eight paths above and run `node --import tsx --test --test-reporter=tap PATH` individually, saving each invocation's exit code and output. The companion evidence archive includes the exact harness and per-process CPU/RSS measurements. Its targeted concurrency-4 runs invoke Node directly, intentionally bypassing the new scheduler annotations; the full inventory run exercises the scheduler itself.

To reproduce the original conditions, retain the exact original revision and Node 24.19.0, capture full-suite concurrency 4, cold/warm tsx state, CPU quota/pressure, memory events and external workload. The original eight failures have not all been reproduced in the present environment; successful reruns do not prove their old causes or waive the latency gates. If latency fails even in isolation, profile that handler on a controlled runner and keep the failure blocking.

## Validation

| Local check | Result |
|---|---|
| Original 23 October complete Node run | 1757 passed / 8 failed; retained |
| Fresh baseline, Node 24.19.0, eight files concurrent then serial | 8/8 + 8/8 passed; old failures not reproduced |
| Exploratory Node 24.22.1 serial replay | 7/8 passed; runner SIGTERM race failed and is retained |
| Fixed targeted Node 24.19.0, concurrency 4 twice | 16/16 passed |
| Fixed targeted Node 24.19.0, serial | 8/8 passed |
| Complete Node inventory, concurrency 4 with exclusive barriers | **1765 passed / 0 failed / 0 pending**, source stable |
| CI runner regressions | 18/18 passed, including deadline, barrier, immutable evidence and cancellation checks |
| Full TypeScript | Exit 0 |
| ESLint on all changed executable files | Exit 0, no diagnostics |
| Source-contract / route-response regressions | 117/117 passed |
| Python CI gate suite | 1/1 file passed |
| Build, JVM, Chromium, dependency audit | Not rerun for this test/tooling-only patch; previous results remain historical |

Full run: `2026-10-24T13:20:18.724Z` → `2026-10-24T13:24:25.080Z` (UTC). Source digest: `77784e7a7a0865c40cedf5c510d08298851f2e5f0fc8f817d0a60dc65cd91b2d`. The full suite ran under Node 24.19.0 using a fresh locked dependency installation; its application/test/runner source is the published candidate. Only the report/evidence documentation was added after this run. No source or test file was edited during the run.

The focused diagnostic test decreased from 14.19 s serial to 1.62 s serial in this environment. That measures reduced fixture work, not faster production application code. New runs show no increment in cgroup OOM/oom_kill counters; this cannot rule out resource pressure on 23 October.

Machine-readable original failures, repeated attempts, current metadata and checks: [CI-INSTABILITY-EVIDENCE-2026-10-24.json](CI-INSTABILITY-EVIDENCE-2026-10-24.json). Full logs and their hashes are retained in the companion investigation archive.


## Review and release

This is test/CI tooling only: no production source/configuration, dependency lockfile, billing, main-branch protection or linked repository changes. No merge, deployment or manual workflow rerun. Rollout: update existing draft #1364, obtain required remote checks and independent human review. Rollback: reviewed revert of this investigation's commits. Eight files become serial barriers in local concurrent runs, adding bounded scheduling time; normal serial CI shards retain their execution model. Downstream: none.

Remote application/security results remain separate from local verification. At baseline, application run `39984958532` has ten failed jobs and security run `39984958521` has five. The API returned no step lists; separately fetched representative test/CodeQL jobs returned empty step arrays. Existing PR documentation reports account billing lock. No remote success, CodeQL success or billing resolution is asserted.
