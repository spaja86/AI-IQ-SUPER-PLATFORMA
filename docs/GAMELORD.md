# GAMELORD — GAMES Standalone Mode

## Purpose

GAMELORD is a deterministic standalone game-mode contract for `GAMES (GAMELORD)` focused on strategy dominance scoring, operational guardrails, and API-first validation.

## Scope boundaries

- **In scope**: canonical slug `gamelord`, deterministic scoring/state rules, warnings, API routes, tests, validator workflow, and governance wiring.
- **Out of scope**: chat persistence, real-money mechanics, autonomous moderation, and cross-repo runtime coupling.
- **Module type**: standalone game mode (not catalog-only expansion).

## KPI targets

| KPI | Target |
|---|---|
| Engine evaluation | ≤ 50ms |
| API response | ≤ 200ms |
| Score bounds | 0..100 |
| Determinism | Same input → same output |

## Contracts

| Field | Value |
|---|---|
| Display name | `GAMES (GAMELORD)` |
| Canonical slug | `gamelord` |
| Contract version | `v1` |
| Module version | `1.0.0` |
| Scope | `standalone-game-mode` |
| Routes | `/api/gamelord/evaluate`, `/api/gamelord/health` |
| Linked-repo impact | `No linked repo change required` |

## Input model

- `mode` — `SOLO | DUO | SQUAD`
- `strategyScore` — finite bounded score `0..100`
- `executionScore` — finite bounded score `0..100`
- `consistencyScore` — finite bounded score `0..100`
- `riskControlScore` — finite bounded score `0..100`
- `penaltyPoints` — finite bounded score `0..100`
- `anomalyCount` — integer bounded `0..20`
- `matchDurationMs` — finite bounded `0..1800000`
- `referenceId` — optional correlation id

## Output model

- `dominanceScore` — weighted deterministic final score
- `disciplineScore` — score impact of penalties and anomaly count
- `stabilityScore` — consistency/risk blend with mode stabilization factor
- `status` — `UNRANKED | CONTENDER | WARMASTER | GAMELORD`
- `recommendedAction` — `TRAIN_CORE | STABILIZE | PRESS_ADVANTAGE | HOLD_THRONE`
- `warnings` — explicit threshold warnings
- `disclaimer` — always present
- Invalid domain evaluations return `valid: false` with status `UNRANKED` and action `TRAIN_CORE`

## Required outputs and rollout guardrails

### Required outputs
- `catalog-entry`
- `runner-compatibility`
- `api-summary`
- `analytics-fields`
- `rollout-guardrails`

### Rollout guardrails
- `feature-flag-staged-rollout`
- `deterministic-evaluation-only`
- `no-secrets-in-payload`
- `422-on-invalid-domain-input`

## Validation strategy

- Reject malformed objects and missing required fields
- Reject unsupported mode identifiers
- Reject `NaN`, `Infinity`, negative values, out-of-range bounds, and invalid integer fields
- Keep deterministic scoring and explicit warnings
- Cover unit + route tests and catalog regression test

## Security and operations

- No secrets or credentials in module/API code
- No silent fallback on invalid domain inputs
- Health route returns aggregate metrics only
- Changes must pass lint, tests, secret scanning, and security checks
