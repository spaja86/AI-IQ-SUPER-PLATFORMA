# EXTRIMLI — FUNKCIONALNO PROGRAMIRANJE EKSPLICITNOG MISAONOG TOKA

## Purpose

Ovaj dokument zaključava značenje i governance model za **FUNKCIONALNO PROGRAMIRANJE EKSPLICITNOG MISAONOG TOKA** kao additive-only EXTRIMLI proširenje.

## Source-of-truth surfaces

- Technical signal: `/api/extrimli/extrem`
- Governance orchestration: `/api/extrimli/extrondol`
- Public-safe boundary: `/api/extrimli/spaja-kod`

## Canonical vocabulary and spelling lock

- Canonical term ostaje tačno `FUNKCIONALNO PROGRAMIRANJE EKSPLICITNOG MISAONOG TOKA`.
- Spelling decision je `exact-user-term-locked`: dozvoljen je samo gore navedeni kanonski string, bez alternativnih spellings ili skraćenja.
- `sledljivost eksplicitnog misaonog toka` = `profileInput.explicitThoughtFlowTraceabilityPercent`
- `kohezija funkcionalnih eksplicitnih transformacija` = `profileInput.functionalExplicitTransformationCohesionPercent`
- `determinističnost eksplicitnog rezonovanja` = `profileInput.explicitReasoningDeterminismPercent`
- `poravnanje kanonskog vokabulara` = `profileInput.vocabularyAlignmentPercent`
- `konfliktni pritisak` = `profileInput.conflictPressurePercent`
- Readiness posture ostaje zaključan na `READY`, `WATCH`, `BLOCKED`.

## Ownership split

- **EXTREM** objavljuje tehnički signal eksplicitnog misaonog toka.
- **EXTRONDOL** propagira signal u WAWE 1–5, promotion freeze, release audit summary, rollback, downstream reference i human-review zahteve.
- **SPAJA KOD** ostaje public-safe summary boundary i ne izlaže sirove signalne formulacije, scoring detalje ni interne eksplicitne tokove.

## WAWE impact

1. **WAWE-1** — termin, scope lock i ownership split moraju ostati eksplicitni.
2. **WAWE-2** — sledljivost eksplicitnog misaonog toka i determinističnost rezonovanja ostaju najmanje u WATCH posturi tokom build/staging prolaza.
3. **WAWE-3** — kohezija funkcionalnih eksplicitnih transformacija, poravnanje vokabulara i conflict pressure moraju biti audit-visible kroz EXTRONDOL governance.
4. **WAWE-4** — produkciona promocija zahteva READY ili eksplicitno odobren WATCH bez skrivenih blockera.
5. **WAWE-5** — post-release resilience zadržava rollback, downstream reference i human-review obaveze za ovaj track.

## Operator configuration defaults

Canonical EXTREM operator surface for this track consists of exactly these five primary env variables:

- `EXTRIMLI_EXTREM_EKSPLICITNI_MISAONI_TOK_TRACEABILITY_PERCENT` → default `90`
- `EXTRIMLI_EXTREM_EKSPLICITNA_FUNKCIONALNA_TRANSFORMACIJA_COHESION_PERCENT` → default `86`
- `EXTRIMLI_EXTREM_EKSPLICITNO_REZONOVANJE_DETERMINISM_PERCENT` → default `88`
- `EXTRIMLI_EXTREM_EKSPLICITNI_VOCABULARY_ALIGNMENT_PERCENT` → default `89`
- `EXTRIMLI_EXTREM_EKSPLICITNI_CONFLICT_PRESSURE_PERCENT` → default `17`
- Ako env vrednosti nedostaju ili su nevalidne, EXTREM koristi podrazumevane procente i zadržava additive-only degraded fallback bez 500 greške.

## Compatibility rules

- Nema novih javnih ruta ni breaking promena na `/api/extrimli/extrem`, `/api/extrimli/extrondol` i `/api/extrimli/spaja-kod`.
- Proširenje ostaje additive-only kroz docs, types, tests i route payload.
- Downstream consumer-i sinhronizuju samo audit-safe readiness/governance polja.
