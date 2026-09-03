# AKTIVITI ALL — Activity Readiness Module

## Purpose

AKTIVITI ALL is a deterministic activity-readiness module that evaluates one activity context and returns a stable readiness score, status, warnings, and recommendation.

## Scope boundaries

- **In scope**: activity contract, input validation, deterministic scoring, edge-case handling, evaluate/health API, tests, validator workflow, and release docs.
- **Out of scope**: persistent activity history, external wearable integrations, autonomous scheduling, and downstream runtime coupling.

## Product definition

- **Domain**: multi-activity readiness
- **Primary route**: `POST /api/aktiviti-all/evaluate`
- **Health route**: `GET /api/aktiviti-all/health`
- **UI v1**: API-first; no dedicated UI page in this change set
- **Cross-repo impact**: no linked repo change required for initial repo-local v1

## Activities included

- `FOCUS`
- `FITNESS`
- `LEARNING`
- `SOCIAL`
- `RECOVERY`

## Input contract

```json
{
  "referenceId": "aktiviti-001",
  "activity": "FOCUS",
  "durationMinutes": 90,
  "energyLevel": 80,
  "focusLevel": 88,
  "stressLevel": 20,
  "completionRate": 70
}
```

## Output contract

- `readinessScore` — bounded `0..100`
- `status` — `READY | STEADY | RECOVER | BLOCKED`
- `recommendation` — deterministic status/activity guidance
- `warnings` — deterministic warning list for degraded situations
- `valid` — false when input contract is invalid
- `disclaimer` — always included

## Scoring and status rules

`readinessScore` is computed from weighted factors:

- energy (`25%`)
- focus (`20%`)
- inverse stress (`20%`)
- completion (`25%`)
- normalized duration (`10%`)

The baseline score is blended with activity-profile fit and then clamped to `0..100`.

Status mapping:

- `READY` ≥ 80
- `STEADY` ≥ 60 and < 80
- `RECOVER` ≥ 40 and < 60
- `BLOCKED` < 40

## Edge-case behavior

- Invalid body shape or invalid JSON → API `400 BAD_REQUEST`
- Unsupported activity and domain-invalid values (`NaN`, `Infinity`, negatives, out-of-range, non-integer duration) → result `valid=false`, API `422`
- `durationMinutes = 0` remains valid with warning
- High stress and very low completion generate warnings

## Validation strategy

- Unit tests for deterministic scoring, warnings, status mapping, metrics, and edge cases
- Health metrics track both valid and invalid evaluations; invalid evaluations are recorded as `BLOCKED` with score `0` and update timestamp/evaluation count
- Route tests for health headers, valid path, invalid JSON, shallow-shape mismatch, unsupported activity, and domain-invalid payload handling
- Validator workflow via shared lint → typecheck → tests → security template

## KPI targets

| KPI | Target |
|---|---|
| Engine evaluation | ≤ 50ms |
| API response | ≤ 200ms |
| Readiness score bounds | 0..100 |
| Duration bounds | 0..300 minutes |

## Rollout plan

1. Enable repo-local API + tests + validator workflow.
2. Monitor KPI stability and warning distributions.
3. Introduce downstream consumers only via explicit follow-up issue/PR.

## Security and operations

- No secrets in module/API code.
- Deterministic error/warning policy; no hidden fallbacks.
- Human review required before merge.
