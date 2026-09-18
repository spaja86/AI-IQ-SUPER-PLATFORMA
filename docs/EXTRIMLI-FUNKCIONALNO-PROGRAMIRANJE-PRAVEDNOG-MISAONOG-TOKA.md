# EXTRIMLI — FUNKCIONALNO PROGRAMIRANJE PRAVEDNOG MISAONOG TOKA

## Purpose

Ovaj dokument zaključava značenje i governance model za **FUNKCIONALNO PROGRAMIRANJE PRAVEDNOG MISAONOG TOKA** kao additive-only EXTRIMLI proširenje.

## Source-of-truth surfaces

- Technical signal: `/api/extrimli/extrem`
- Governance orchestration: `/api/extrimli/extrondol`
- Public-safe boundary: `/api/extrimli/spaja-kod`

## Canonical vocabulary and spelling lock

- Canonical term ostaje tačno `FUNKCIONALNO PROGRAMIRANJE PRAVEDNOG MISAONOG TOKA`.
- Spelling decision je `exact-user-term-locked` i ne prepisuje postojeće `PRAVNOG` i `UZVIŠENOG` track-ove.
- `stabilnost pravednog misaonog toka` = `profileInput.fairThoughtFlowStabilityPercent`
- `kohezija funkcionalne pravednosti` = `profileInput.functionalFairnessCohesionPercent`
- `determinističnost pravednog rezonovanja` = `profileInput.fairnessReasoningDeterminismPercent`
- `evidentiary completeness` = `profileInput.evidentiaryCompletenessPercent`
- `conflict/bias pressure` = `profileInput.conflictBiasPressurePercent`
- Readiness posture ostaje zaključan na `READY`, `WATCH`, `BLOCKED`.

## Ownership split

- **EXTREM** objavljuje tehnički fairness-oriented thought-flow signal.
- **EXTRONDOL** propagira signal u WAWE 1–5, promotion freeze, release audit summary, rollback, downstream reference i human-review zahteve.
- **SPAJA KOD** ostaje public-safe summary boundary i ne izlaže sirove fairness formulacije, scoring detalje ni interne reasoning artefakte.

## WAWE impact

1. **WAWE-1** — termin, scope lock i ownership split moraju ostati eksplicitni.
2. **WAWE-2** — fair thought-flow stability i fairness reasoning determinism ostaju najmanje u WATCH posturi tokom build/staging prolaza.
3. **WAWE-3** — evidentiary completeness i conflict/bias pressure moraju biti audit-visible kroz EXTRONDOL governance.
4. **WAWE-4** — produkciona promocija zahteva READY ili eksplicitno odobren WATCH bez skrivenih fairness blockera.
5. **WAWE-5** — post-release resilience zadržava rollback, downstream reference i human-review obaveze za ovaj track.

## Compatibility rules

- Nema novih javnih ruta ni breaking promena na `/api/extrimli/extrem`, `/api/extrimli/extrondol` i `/api/extrimli/spaja-kod`.
- Proširenje ostaje additive-only kroz docs, types, tests i route payload.
- `FUNKCIONALNO PROGRAMIRANJE PRAVEDNOG MISAONOG TOKA` ostaje odvojen od `FUNKIONALNO PROGRAMIRANJE PRAVNOG MISAONOG TOKA` i `FUNKCIONALNO PROGRAMIRANJE UZVIŠENOG MISANOG TOKA`.
- Downstream consumer-i sinhronizuju samo audit-safe readiness/governance polja.
