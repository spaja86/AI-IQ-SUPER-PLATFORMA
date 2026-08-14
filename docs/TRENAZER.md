# TRENAZER — Training Readiness Module

## Purpose

TRENAZER is a deterministic training-readiness and session-recommendation module for evaluating whether a trainee should run a recovery, moderate, or intensive session.

## Scope boundaries

- **In scope**: readiness scoring, invalid-input guards, recommendation intensity/duration, health/KPI report, API exposure, validator workflow, and audit-ready docs.
- **Out of scope**: persistent history, wearable integrations, workout catalogs, autonomous scheduling, and cross-repo runtime coupling.

## Product definition

- **Domain**: fitness/training coaching engine
- **Primary route**: `POST /api/trenazer/evaluate`
- **Health route**: `GET /api/trenazer/health`
- **UI v1**: minimal summary card only
- **Cross-repo impact**: no linked repo change required for initial repo-local v1

## Input contract

```json
{
  "referenceId": "session-001",
  "profile": {
    "traineeId": "athlete-1",
    "goal": "STRENGTH",
    "experienceLevel": "INTERMEDIATE"
  },
  "metrics": {
    "energy": 82,
    "focus": 76,
    "soreness": 25,
    "stress": 20,
    "sleepHours": 7.5,
    "availableMinutes": 70
  }
}
```

## Output contract

- `readinessScore` — bounded `0..100`
- `readiness` — `RECOVERY | MODERATE | INTENSIVE`
- `recommendedIntensity` — `LOW | MEDIUM | HIGH`
- `recommendedDurationMinutes` — capped by readiness and experience level
- `focusAreas` — deterministic per goal

## Validation strategy

- Unit tests for constants, deterministic scoring, warnings, and health metrics
- Route tests for health headers, valid responses, invalid JSON, shallow-shape guards, and invalid domain payloads
- Edge-case guards for `NaN`, `Infinity`, negative values, out-of-range scores, sleep above 24h, and duration above max cap
- Validator workflow using shared lint → typecheck → tests → security template

## KPI targets

| KPI | Target |
|---|---|
| Engine evaluation | ≤ 50ms |
| API response | ≤ 200ms |
| Readiness score bounds | 0..100 |
| Available minutes max | 300 |

## Rollout plan

1. **CI-gated activation** — repo-local v1 available after tests and validator workflow pass.
2. **Canary consumer adoption** — optional internal consumers can adopt `POST /api/trenazer/evaluate`.
3. **Expanded surface** — add history/workout catalog only after KPI stability and product need are proven.

## Security and operations

- No secrets in module or API code.
- Invalid inputs degrade to explicit validation failures; no silent fallback recommendations.
- Downstream runtime coupling with `spaja86/IO-OPENUI-AO` requires a follow-up issue before any shared-consumer rollout.
