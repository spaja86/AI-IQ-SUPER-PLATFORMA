# PARAKSIL — Module Validation Sandbox

## Purpose

PARAKSIL is a deterministic module-validation sandbox for testing whether a repo-local module is ready for rollout, needs review, or must be blocked.

## Scope boundaries

- **In scope**: module test-run scoring, invalid-input guards, status classification, KPI exposure, API routes, validator workflow, and audit-ready documentation.
- **Out of scope**: test execution orchestration, flaky-test retries, persistent history, linked-repo rollout automation, and direct CI cancellation logic.

## Product definition

- **Domain**: generic validator for module test results
- **Primary route**: `POST /api/paraksil/evaluate`
- **Health route**: `GET /api/paraksil/health`
- **Primary result states**: `READY`, `NEEDS_REVIEW`, `BLOCKED`
- **Cross-repo impact**: no linked repo change required for initial repo-local v1

## Input contract

```json
{
  "referenceId": "run-001",
  "target": {
    "moduleId": "trenazer",
    "moduleVersion": "1.0.0",
    "suite": "API"
  },
  "metrics": {
    "totalChecks": 16,
    "passedChecks": 16,
    "failedChecks": 0,
    "avgLatencyMs": 80,
    "errorRatePct": 0,
    "coveragePct": 96
  }
}
```

## Output contract

- `validationScore` — bounded `0..100`
- `status` — `READY | NEEDS_REVIEW | BLOCKED`
- `passRate` — derived from `passedChecks / totalChecks`
- `withinLatencyBudget` — deterministic boolean by suite budget
- `warnings` — explicit signals for failures, coverage drift, error-rate drift, and latency overruns

## Validation strategy

- Unit tests for constants, deterministic scoring, invalid metrics, status resolution, and health metrics
- Route tests for health headers, valid responses, invalid JSON, shallow-shape guards, and invalid domain payloads
- Edge-case guards for `NaN`, `Infinity`, negative values, bad totals, empty module IDs, and unsupported suites
- Validator workflow using the shared lint → typecheck → tests → security template

## KPI targets

| KPI | Target |
|---|---|
| Engine evaluation | ≤ 50ms |
| API response | ≤ 200ms |
| Coverage target | ≥ 80% |
| Error-rate warning | > 5% |
| Error-rate block | > 20% |
| Suite latency budgets | UNIT 50ms · API 200ms · INTEGRATION 300ms · FULL 500ms |

## Rollout plan

1. **CI-gated activation** — repo-local v1 activates after PARAKSIL tests and validator workflow pass.
2. **Internal adoption** — other repo-local modules can submit summarized validation metrics to `POST /api/paraksil/evaluate`.
3. **Expanded scope** — only add stored history or cross-repo routing after explicit product need and KPI stability.

## Security and operations

- No secrets in module or API code.
- Invalid inputs degrade to explicit validation failures; no silent pass-through status is returned.
- Health metrics are process-local best-effort summaries for the active runtime, not a globally synchronized store.
- Downstream coupling with `spaja86/IO-OPENUI-AO` requires a follow-up issue before any shared-consumer rollout.
