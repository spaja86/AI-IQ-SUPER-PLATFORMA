# KONVENCIONALNI ODNOSI — Specification

## Purpose

KONVENCIONALNI ODNOSI je deterministički domen za procenu kvaliteta konvencionalnih međuljudskih odnosa kroz standardne dimenzije kao što su poverenje, komunikacija, poštovanje, reciprocitet, stabilnost i granice.

## Scope boundaries

- **In scope**: scoring/evaluacija odnosa, detekcija fokus oblasti, upozorenja za neuravnoteženost, health/KPI report, API exposure i validator workflow.
- **Out of scope**: trajno čuvanje odnosa, spoljne integracije, automatizovane akcije nad korisnicima i psihološko/pravno savetovanje.

## KPI targets

| KPI | Target |
|---|---|
| Engine evaluation | ≤ 50ms |
| API response | ≤ 200ms |
| Score bounds | 0..100 |
| Consistency | Deterministic output for same input |

## Contracts

| Field | Value |
|---|---|
| Contract version | `v1` |
| Module version | `1.0.0` |
| Persona | `konvencionalni-odnosi-core` |
| Routes | `/api/konvencionalni-odnosi/evaluate`, `/api/konvencionalni-odnosi/health` |

## Validation strategy

- Unit tests za konstante, deterministički score/tier model i health report
- Edge-case testovi za `NaN`, `Infinity`, negativne vrednosti, vrednosti iznad 100 i prazne ulaze
- Upozorenja za kritično niske dimenzije, neuravnoteženost i nekonzistentne obrasce
- Route testovi za validne zahteve, loš JSON, missing fields i invalid payload
- Validator workflow sa standardnim quality gate šablonom: lint → typecheck → tests → security

## Rollout plan

1. **Canary 20%** — interni promet i proveravanje KPI/metrika.
2. **Staged 50%** — šira upotreba nakon stabilnog perioda bez regresija.
3. **Full 100%** — puna aktivacija posle green validator rezultata i human review-a.

## Security and operations

- Nema sekreta u modulu ili API kodu.
- Svi score ulazi se validiraju pre evaluacije.
- Cross-repo uticaj trenutno ne postoji; modul ostaje lokalni runtime domen.
