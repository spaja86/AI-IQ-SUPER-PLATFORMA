# DINOSAURUS-Trexar

## Purpose
DINOSAURUS-Trexar module provides deterministic readiness evaluation for Trexar operational state.
It standardizes score computation, status/tier mapping, and response contract for internal API consumers.

## Scope
- Engine logic: `src/lib/dinosaurus-trexar/*`
- API endpoints:
  - `POST /api/dinosaurus-trexar/evaluate`
  - `GET /api/dinosaurus-trexar/health`
- Tests:
  - `src/tests/lib/dinosaurus-trexar.test.ts`
  - `src/tests/api/dinosaurus-trexar-route.test.ts`

## Input Contract (`TrexarInput`)
- `referenceId?: string`
- `profile`:
  - `specimenId?: string`
  - `ageCategory: 'JUVENILE' | 'ADULT' | 'ELDER'`
  - `massKg: number (1..15000)`
- `signals`:
  - `stamina: 0..100`
  - `aggression: 0..100`
  - `focus: 0..100`
  - `threatLevel: 0..100`
  - `terrainFriction: 0..100`
  - `packSupport: 0..100`
  - `reactionMs: 0..600`

## Output Contract (`TrexarResult`)
- `referenceId: string`
- `specimenId: string`
- `trexarScore: number (0..100)`
- `status: 'APEX' | 'HUNT_READY' | 'ADAPTIVE' | 'STRESSED' | 'CRITICAL'`
- `tier: 'S' | 'A' | 'B' | 'C'`
- `recommendation: string`
- `valid: boolean`
- `warnings: string[]`
- `durationMs: number`

## Scoring Rules
`trexarScore` is weighted from stamina/aggression/focus/threat/terrain/pack/reaction signals:
- stamina 20%
- aggression 15%
- focus 20%
- inverse threat 15%
- terrain friction 10%
- pack support 10%
- reaction score 10%

Adjustments:
- age adjustment: juvenile `-5`, elder `-3`, adult `0`
- instability penalty: `-10` when `threatLevel > 85` and `packSupport < 20`

## Status & Tier Mapping
Status by score:
- `>=85` → `APEX`
- `>=70` → `HUNT_READY`
- `>=50` → `ADAPTIVE`
- `>=30` → `STRESSED`
- `<30` → `CRITICAL`

Tier by score:
- `>=90` → `S`
- `>=75` → `A`
- `>=55` → `B`
- `<55` → `C`

## Edge-Case Policy
- Reject non-object payloads.
- Reject non-finite values (`NaN`, `Infinity`) through route/engine validation.
- Reject negative/out-of-range values for profile/signals.
- Invalid domain input returns `valid: false` and API `422`.
- Invalid JSON/shallow schema mismatch returns API `400`.

## Performance KPIs
- Engine evaluation target: `<= 50ms`
- API response target: `<= 200ms`

## Audit / Release Notes Guidance
PRs that modify this module should include:
- rollout strategy
- rollback strategy
- KPI impact
- downstream reference format (if linked changes exist):

`AI-IQ-SUPER-PLATFORMA#dinosaurus-trexar -> IO-OPENUI-AO#<optional follow-up>`
