# EXTRIMLI — Extreme Sports & Adventure Intelligence

## Overview

EXTRIMLI is the platform domain for extreme-sports risk evaluation, athlete progression, gear safety, and event readiness.

This repository now exposes two aligned surfaces:

| Version | Path | Status | Purpose |
|---|---|---|---|
| **v1** | `src/lib/extrimli/`, `src/app/api/extrimli/` | Active | Existing baseline registry, risk, gear, performance, event, and weather APIs |
| **v3** | `src/lib/extrimli-3/`, `src/app/api/extrimli-3/` | Active | Versioned expansion with sport-specific risk profiles, weather-integrated scoring, and athlete readiness signals |

## Module paths

| Surface | Path |
|---|---|
| v1 library | `src/lib/extrimli/` |
| v1 API routes | `src/app/api/extrimli/` |
| v3 library | `src/lib/extrimli-3/` |
| v3 API routes | `src/app/api/extrimli-3/` |
| Tests | `src/tests/lib/extrimli.test.ts`, `src/tests/lib/extrimli-3.test.ts` |

## EXTRIMLI v1 capabilities

- Sport registry
- Composite risk engine
- Athlete performance tracker
- Gear catalog
- Event lifecycle and registration
- Weather adapter
- Health report

## EXTRIMLI 3 contract

### New capabilities

| Capability | Description |
|---|---|
| **Sport-specific risk profiles** | Each sport has its own multiplier, minimum experience, weighting priorities, and risk bias |
| **Integrated weather-aware risk** | Weather data is normalized and directly influences v3 risk scoring |
| **Athlete readiness signal** | Existing athlete session history is transformed into a readiness score and progress snapshot |
| **Richer health reporting** | v3 health includes profile count, evaluation count, last risk score, and last readiness score |

### Backward compatibility

- All v1 routes under `/api/extrimli/*` remain unchanged.
- EXTRIMLI 3 lives beside v1 as `/api/extrimli-3/*`.
- Existing EXTRIMLI tests continue to validate v1 behavior independently.

### Performance and validation rules

| KPI | Target |
|---|---|
| Risk evaluation | ≤ 50ms |
| API response | ≤ 200ms |
| Weather-sensitive sport without weather payload | Invalid |
| Unsupported sport / invalid numeric range | Invalid |
| NaN / Infinity / negative range leakage | 0 |

## EXTRIMLI 3 library modules

| Module | File | Responsibility |
|---|---|---|
| Types | `src/lib/extrimli-3/types.ts` | v3 contract, profile, readiness, and health types |
| Profiles | `src/lib/extrimli-3/profiles.ts` | Sport-specific multipliers, weighting, and validation |
| Risk Engine | `src/lib/extrimli-3/risk-engine.ts` | Weather-aware risk scoring and athlete readiness integration |
| Index | `src/lib/extrimli-3/index.ts` | Public API surface |

## EXTRIMLI 3 API routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/extrimli-3/risk` | Weather-aware risk evaluation with optional `athleteId` history |
| GET | `/api/extrimli-3/sports` | List v3 sport risk profiles with linked sport metadata |
| GET | `/api/extrimli-3/health` | v3 health report |

All v3 routes respond with headers:
- `X-Extrimli3-Contract-Version: v3`
- `X-Extrimli3-Module-Version: 3.0.0`

## EXTRIMLI 3 risk input

```json
{
  "sportId": "paragliding",
  "athleteExperience": 8,
  "terrainDifficulty": 4,
  "gearQualityIndex": 9,
  "athleteId": "ath-123",
  "weatherData": {
    "windSpeedKph": 12,
    "precipitationMm": 0,
    "temperatureC": 18,
    "visibilityKm": 10
  },
  "referenceId": "risk-check-001"
}
```

## Contract version

| Field | Value |
|---|---|
| `EXTRIMLI_CONTRACT_VERSION` | `v1` |
| `EXTRIMLI_MODULE_VERSION` | `1.0.0` |
| `EXTRIMLI3_CONTRACT_VERSION` | `v3` |
| `EXTRIMLI3_MODULE_VERSION` | `3.0.0` |
| `EXTRIMLI3_PERSONA_ID` | `extrimli-core` |
| Trigger labels | `extrimli:logic-change` |
| Octave | 7 |
| Hipermreza node | 56 |

## Audit reference

```
AI-IQ-SUPER-PLATFORMA#EXTRIMLI-003 -> IO-OPENUI-AO#<follow-up issue>
```
