# EXTRIMLI — FUNKIONALNO PROGRAMIRANJE PRAVNOG MISAONOG TOKA

## Purpose

Ovaj dokument zaključava značenje i governance model za **FUNKIONALNO PROGRAMIRANJE PRAVNOG MISAONOG TOKA** kao additive-only EXTRIMLI proširenje.

## Source-of-truth surfaces

- Technical signal: `/api/extrimli/extrem`
- Governance orchestration: `/api/extrimli/extrondol`
- Public-safe boundary: `/api/extrimli/spaja-kod`

## Canonical vocabulary and spelling lock

- Canonical term ostaje tačno `FUNKIONALNO PROGRAMIRANJE PRAVNOG MISAONOG TOKA`.
- Spelling decision je `exact-user-term-locked` i ne prepisuje postojeći typo-locked termin `FUNKCINALNO PROGRAMIRANJE ENERGETSKOG MISAONOG TOKA`.
- `stabilnost pravnog misaonog toka` = `profileInput.legalThoughtFlowStabilityPercent`
- `kohezija funkcionalnih pravnih transformacija` = `profileInput.functionalLegalTransformationCohesionPercent`
- `determinističnost pravnog zaključivanja` = `profileInput.legalReasoningDeterminismPercent`
- `evidentiary completeness` = `profileInput.evidentiaryCompletenessPercent`
- `conflict/escalation pressure` = `profileInput.conflictEscalationPressurePercent`
- Readiness posture ostaje zaključan na `READY`, `WATCH`, `BLOCKED`.

## Ownership split

- **EXTREM** objavljuje tehnički legal-functional reasoning signal.
- **EXTRONDOL** propagira signal u WAWE 1–5, promotion freeze, release audit summary, rollback, downstream reference i human-review zahteve.
- **SPAJA KOD** ostaje public-safe summary boundary i ne izlaže sirove pravne formulacije, scoring detalje ni reasoning artefakte.

## Legal boundary coupling

- Track ostaje pod pravnim okvirom `KRALJEVSKI PRAVNI UNIVERZITET`.
- `POVELJA O ZAKONODAVNOM PRAVU` ostaje primary charter.
- `PRAVNI POREDAK PO PRAVU GRAĐANSTVA` ostaje neutral civic-order rule set.
- Legal vocabulary, charter boundary, citizenship-order rules i evidence requirements ostaju definisani u postojećem legal-governance track-u; ovaj modul meri kvalitet funkcionalnog pravnog rezonovanja unutar tog okvira.

## WAWE impact

1. **WAWE-1** — termin, scope lock i ownership split moraju ostati eksplicitni.
2. **WAWE-2** — legal thought-flow stability i legal reasoning determinism ostaju najmanje u WATCH posturi tokom build/staging prolaza.
3. **WAWE-3** — evidentiary completeness i conflict/escalation pressure moraju biti audit-visible kroz EXTRONDOL governance.
4. **WAWE-4** — produkciona promocija zahteva READY ili eksplicitno odobren WATCH bez skrivenih pravnih blockera.
5. **WAWE-5** — post-release resilience zadržava rollback, downstream reference i human-review obaveze za ovaj track.

## Compatibility rules

- Nema novih javnih ruta ni breaking promena na `/api/extrimli/extrem`, `/api/extrimli/extrondol` i `/api/extrimli/spaja-kod`.
- Proširenje ostaje additive-only kroz docs, types, tests i route payload.
- `KRALJEVSKI PRAVNI UNIVERZITET` ostaje netaknut kao legal-governance root track.
- Downstream consumer-i sinhronizuju samo audit-safe readiness/governance polja.
