# DIGITRON — Successor Digit Intelligence Module

## Purpose

DIGITRON is a deterministic successor module to `digit-engine`.
It introduces a compatibility-aware `digitron` contract with explicit LEGACY/NATIVE/HYBRID modes while preserving stable 0–9 symbolic lookup behavior.

## Scope boundaries

- **In scope**: `src/lib/digitron/**`, `src/app/api/digitron/**`, tests, validator workflow, persona mapping, and cross-repo sync notes.
- **Out of scope**: removal or mutation of existing `digit-engine` runtime contracts.
- **Successor policy**: DIGITRON succeeds `digit-engine` for new integrations; existing `digit-engine` consumers remain supported.

## Contract lock

| Field | Value |
|---|---|
| Display name | `DIGITRON` |
| Canonical slug | `digitron` |
| Successor of | `digit-engine` |
| Contract version | `v1` |
| Module version | `1.0.0` |
| Persona | `digitron-core` |
| Octave / hipermreza node | `10 / 81` |
| Routes | `/api/digitron/evaluate`, `/api/digitron/health` |
| Linked repo impact | `digitron-registry-sync` |

## KPI targets

| KPI | Target |
|---|---|
| Descriptor lookup | ≤ 10ms |
| Engine evaluation | ≤ 50ms |
| API response | ≤ 200ms |
| Determinism | Same input → same output |

## Input model

- `digit` — integer `0..9`
- `mode` — `LEGACY | NATIVE | HYBRID`
- `signalStrength` — finite score `0..100`
- `syncScore` — finite score `0..100`
- `resilienceScore` — finite score `0..100`
- `latencyMs` — finite score `0..200`

## Output model

- `descriptor` — resolved DIGITRON descriptor for the selected digit
- `coherenceScore`, `stabilityScore`, `latencyScore`, `overallScore` — bounded deterministic scores
- `status` — `LEGACY_FALLBACK | TRANSITIONAL | SYNCHRONIZED | STELLAR`
- `recommendedAction` — `FALLBACK_COMPAT | RECALIBRATE | LOCK_SYNC | SCALE_NATIVE`
- `warnings` — additive compatibility/performance warnings
- `disclaimer` — always present

Invalid domain inputs return `valid: false` with explicit warning payload and `422` route status.

## Validation strategy

- Reject malformed objects and missing required fields at route boundary (`400`).
- Reject invalid domain values (`NaN`, `Infinity`, bounds violations, unsupported modes, invalid digit) in engine layer (`422`).
- Validate contract headers:
  - `X-Digitron-Contract-Version`
  - `X-Digitron-Module-Version`
  - `X-Digitron-Successor-Of`

## Rollout / rollback / KPI impact

- **Rollout**: enable DIGITRON for new consumers while retaining `digit-engine`.
- **Rollback**: consumers can fall back to `digit-engine` because DIGITRON is additive and isolated.
- **KPI impact**: DIGITRON keeps lookup and API thresholds aligned with existing platform validator gates.

## Security and operations

- No secrets are stored in DIGITRON module or API code.
- Validator workflow enforces lint, typecheck, tests, and security scan.
- Linked-repo synchronization remains metadata-only (`digitron-registry` snapshots).
