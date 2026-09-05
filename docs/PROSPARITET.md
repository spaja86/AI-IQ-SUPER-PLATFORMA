# PROSPARITET — Prosperity Readiness & Allocation Guidance

## Purpose

PROSPARITET is a deterministic prosperity-readiness module for evaluating whether a profile should stabilize the base, build stronger reserves, optimize current allocations, or scale with confidence.
Version 1 ships as an API-first module so the contract, validation behavior, and quality gates can stabilize before UI coupling.

## Scope boundaries

- **In scope**: canonical `prosparitet` slug, deterministic scoring and status mapping, recommendation logic, disclaimer, health/KPI report, API routes, tests, docs, and validator workflow.
- **Out of scope**: account persistence, investment execution, banking integrations, tax/legal automation, and cross-repo runtime coupling.

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
| Display name | `PROSPARITET` |
| Canonical slug | `prosparitet` |
| Contract version | `v1` |
| Module version | `1.0.0` |
| Persona | `prosparitet-core` |
| Octave / hipermreza node | `9 / 73` |
| Routes | `/api/prosparitet/evaluate`, `/api/prosparitet/health` |
| Linked-repo impact | `none` |

## Input model

Each evaluation accepts:

- `objective` — `CASHFLOW | SAVINGS | INVESTMENT | EXPANSION`
- `horizon` — `SHORT | MEDIUM | LONG`
- `riskAppetite` — `LOW | MEDIUM | HIGH`
- `revenueStabilityScore` — finite bounded score `0..100`
- `marginScore` — finite bounded score `0..100`
- `liquidityScore` — finite bounded score `0..100`
- `debtLoadScore` — finite bounded score `0..100`
- `disciplineScore` — finite bounded score `0..100`
- `horizonMonths` — integer positive months `1..120`

## Output model

- `stabilityScore` — base stability estimate
- `growthScore` — controlled growth potential estimate
- `resilienceScore` — downside resilience estimate
- `efficiencyScore` — allocation efficiency estimate
- `overallScore` — weighted deterministic summary score
- `status` — `CRITICAL | STABLE | GROWING | PROSPER`
- `recommendedAction` — `STABILIZE_BASE | BUILD_BUFFER | OPTIMIZE_ALLOCATION | SCALE_CONFIDENTLY`
- `warnings` — explicit debt/liquidity/horizon/risk cautions
- `disclaimer` — always present because PROSPARITET is guidance and not legal, financial, tax, or emergency advice

## Validation strategy

- Reject malformed objects and missing required fields
- Reject unsupported objective/horizon/risk identifiers
- Reject `NaN`, `Infinity`, negative values, out-of-range scores, zero-month horizons, and non-integer `horizonMonths`
- Return explicit invalid results for engine-level domain failures
- Cover unit + route tests, including headers, health behavior, and shallow-shape guards

## Rollout plan

1. **Repo-local v1** — module, routes, tests, docs, and validator workflow.
2. **Internal consumers** — integrate only after contract stability is proven.
3. **Cross-repo follow-up** — sync labels/persona/docs in linked repositories only if an external consumer adopts the surface.

## Security and operations

- No secrets or credentials in module/API code.
- Invalid inputs fail explicitly; there is no silent fallback.
- Runtime health report is aggregate-only and stores no input payloads.
- Changes must pass lint, tests, secret scanning, code review, and security scanning.

## Linked repos

- No linked repo runtime change is required for PROSPARITET v1.
- Downstream documentation can be tracked later in `docs/MULTI-REPO-LINKS.md` if another repository adopts the contract.
