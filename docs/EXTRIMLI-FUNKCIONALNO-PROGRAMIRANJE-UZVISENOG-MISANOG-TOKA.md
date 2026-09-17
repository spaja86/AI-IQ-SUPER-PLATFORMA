# EXTRIMLI — FUNKCIONALNO PROGRAMIRANJE UZVIŠENOG MISANOG TOKA

## Purpose

Ovaj dokument zaključava značenje i governance model za **FUNKCIONALNO PROGRAMIRANJE UZVIŠENOG MISANOG TOKA** kao additive-only EXTRIMLI proširenje.

## Source-of-truth surfaces

- Technical signal: `/api/extrimli/extrem`
- Governance orchestration: `/api/extrimli/extrondol`
- Public-safe boundary: `/api/extrimli/spaja-kod`

## Canonical vocabulary and spelling lock

- Canonical term ostaje tačno `FUNKCIONALNO PROGRAMIRANJE UZVIŠENOG MISANOG TOKA`.
- Spelling decision je `exact-user-term-locked`: jedini kanonski oblik je `FUNKCIONALNO PROGRAMIRANJE UZVIŠENOG MISANOG TOKA`; varijante kao `FUNKCIONALNO PROGRAMIRANJE UZVIŠENOG MISAONOG TOKA` ili uklanjanje `UZVIŠENOG` nisu dozvoljene.
- `stabilnost uzvišenog misanog toka` = `profileInput.elevatedThoughtFlowStabilityPercent`
- `kohezija funkcionalnih transformacija` = `profileInput.functionalTransformationCohesionPercent`
- `determinističnost rezonovanja` = `profileInput.reasoningDeterminismPercent`
- `pritisak konflikta / degradacije` = `profileInput.conflictDegradationPressurePercent`
- Readiness posture ostaje zaključan na `READY`, `WATCH`, `BLOCKED`.

## Ownership split

- **EXTREM** objavljuje tehnički signal uzvišenog misanog toka.
- **EXTRONDOL** propagira signal u WAWE 1–5, promotion freeze, release audit summary, rollback, downstream reference i human-review zahteve.
- **SPAJA KOD** ostaje public-safe summary boundary i ne izlaže sirove signalne formulacije, scoring detalje ni interne rezonovane artefakte.

## WAWE impact

1. **WAWE-1** — termin, scope lock i ownership split moraju ostati eksplicitni.
2. **WAWE-2** — stabilnost uzvišenog misanog toka i determinističnost rezonovanja ostaju najmanje u WATCH posturi tokom build/staging prolaza.
3. **WAWE-3** — kohezija funkcionalnih transformacija i conflict/degradation pressure moraju biti audit-visible kroz EXTRONDOL governance.
4. **WAWE-4** — produkciona promocija zahteva READY ili eksplicitno odobren WATCH bez skrivenih blockera.
5. **WAWE-5** — post-release resilience zadržava rollback, downstream reference i human-review obaveze za ovaj track.

## Operator configuration defaults

- `EXTRIMLI_EXTREM_UZVISENI_MISANI_TOK_STABILITY_PERCENT` → default `91`
- `EXTRIMLI_EXTREM_UZVISENA_FUNKCIONALNA_TRANSFORMACIJA_COHESION_PERCENT` → default `87`
- `EXTRIMLI_EXTREM_UZVISENO_REZONOVANJE_DETERMINISM_PERCENT` → default `88`
- `EXTRIMLI_EXTREM_UZVISENI_CONFLICT_DEGRADATION_PRESSURE_PERCENT` → default `16`
- Backward-compatible alias: `EXTRIMLI_EXTREM_UZVISENI_DEGRADATION_PRESSURE_PERCENT` → accepted, ali nije kanonski naziv.
- Ako env vrednosti nedostaju, EXTREM koristi ove podrazumevane procente i zadržava additive-only fallback.

## Compatibility rules

- Nema novih javnih ruta ni breaking promena na `/api/extrimli/extrem`, `/api/extrimli/extrondol` i `/api/extrimli/spaja-kod`.
- Proširenje ostaje additive-only kroz docs, types, tests i route payload.
- Downstream consumer-i sinhronizuju samo audit-safe readiness/governance polja.
