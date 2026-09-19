# EXTRIMLI SINEMETRIČKO PROGRAMIRANJE — Additive Signal Specification

## Scope lock

- Canonical term: `SINEMETRIČKO PROGRAMIRANJE`
- Model: additive-only extension over existing EXTRIMLI/EXTREM/EXTRONDOL surfaces
- No new routes:
  - `/api/extrimli/extrem`
  - `/api/extrimli/extrondol`
  - `/api/extrimli/spaja-kod`
- No breaking changes on existing payload contracts.

## Canonical vocabulary

- `matrične sintakse` → scaling legal/conventional acts in deterministic syntax form
- `sekvence u oktavnom dimenzionalnom prostoru` → octaval sequence readiness model
- `matrična jedinjenja` → persona and strelična/miš/tastaturna encryption composition
- `pixel cadence` → deterministic 1ms baseline (watch/blocked when cadence drifts)

## Ownership and boundary rules

- **EXTREM** owns technical signal publishing (`readiness`, `conflict`, `evidence`).
- **EXTRONDOL** owns governance consumption (WAWE freeze/promotion, human review, release-audit coupling).
- **SPAJA KOD** remains public audit-safe boundary and must not expose raw matrices/formulas.
- Signal split lock remains immutable:
  - `DOK + DIK` in EXTREM
  - `DAK + DUK` in EXTRONDOL

## Acceptance criteria

- Deterministic output on identical inputs.
- NaN/Infinity/invalid-range inputs degrade safely without route breakage.
- Oktavni sequencing and 1ms cadence constraints are validated.
- DOK/DIK/DAK/DUK consistency health remains aligned across EXTREM and EXTRONDOL.

## Audit-safe downstream sync

For downstream (`spaja86/IO-OPENUI-AO`), sync only audit-safe summarized fields:

- `extremProfiler.sinemetrickoProgramiranje.readiness`
- `sinemetrickoProgramiranje.waweImpact`
- `releaseAuditSummary.sinemetrickoProgramiranjeGovernance`

Do not sync raw matrix formulas or internal derivation details.
