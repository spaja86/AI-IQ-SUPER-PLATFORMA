# OPKONGO — Opportunity Progression & Commitment Guidance

## Purpose

OPKONGO is a deterministic opportunity-progression module for evaluating whether a conversation should stay in preparation, move to first outreach, escalate into a negotiation step, or push toward commitment.
Version 1 intentionally ships as an API-first module with no UI surface so the contract, validation rules, and quality gate can stabilize first.

## Scope boundaries

- **In scope**: canonical `opkongo` slug, deterministic readiness/alignment/timing/pressure scoring, recommendation logic, disclaimer, health/KPI report, API routes, tests, docs, and validator workflow.
- **Out of scope**: CRM persistence, live messaging integrations, pricing/legal approval workflows, AI-generated outreach text, and cross-repo runtime coupling.

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
| Display name | `OPKONGO` |
| Canonical slug | `opkongo` |
| Contract version | `v1` |
| Module version | `1.0.0` |
| Persona | `opkongo-commit-core` |
| Octave / hipermreza node | `8 / 65` |
| Routes | `/api/opkongo/evaluate`, `/api/opkongo/health` |
| Linked-repo impact | `none` |

## Input model

Each evaluation accepts:

- `objective` — `OUTREACH | NEGOTIATION | FOLLOW_UP | CLOSING`
- `channel` — `EMAIL | CALL | MEETING | ASYNC`
- `relationshipTemperature` — `COLD | WARM | HOT`
- `clarityScore` — finite bounded score `0..100`
- `leverageScore` — finite bounded score `0..100`
- `trustScore` — finite bounded score `0..100`
- `urgencyLevel` — finite bounded score `0..100`
- `followUpCount` — integer bounded `0..12`
- `timeWindowHours` — integer positive hours `1..168`

## Output model

- `readinessScore` — clarity/leverage/trust readiness estimate
- `alignmentScore` — channel + relationship suitability estimate
- `timingScore` — horizon fitness against the objective window
- `pressureScore` — urgency/follow-up pressure resilience estimate
- `overallScore` — weighted deterministic summary score
- `status` — `HOLD | PREP | ENGAGE | COMMIT`
- `recommendedAction` — `REFINE_BRIEF | SEND_OUTREACH | BOOK_CALL | CLOSE_NEXT_STEP`
- `recommendedWindowHours` — bounded timing guidance derived from action and current status
- `warnings` — explicit trust/urgency/follow-up warnings
- `disclaimer` — always present, because OPKONGO is guidance and not legal, financial, or emergency advice

## Validation strategy

- Reject malformed objects and missing required fields
- Reject unsupported objective/channel/relationship identifiers
- Reject `NaN`, `Infinity`, negative values, out-of-range bounds, zero-hour windows, and non-integer follow-up counts
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

- No linked repo runtime change is required for OPKONGO v1.
- Downstream documentation or label synchronization can be tracked later in `/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA/docs/MULTI-REPO-LINKS.md` if another repository adopts the contract.
