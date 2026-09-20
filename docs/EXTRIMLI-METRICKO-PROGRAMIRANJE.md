# EXTRIMLI — METRICKO PROGRAMIRANJE

## Canonical purpose

`METRIČKO PROGRAMIRANJE` je additive-only EXTRIMLI track za metričku procenu deklaracija koda i instanci bez otvaranja novih source-of-truth ruta.

- Source-of-truth rute ostaju zaključane na `/api/extrimli/extrem`, `/api/extrimli/extrondol` i `/api/extrimli/spaja-kod`.
- `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == RADNI TAKT MOZGA (MISLILAC)` ostaje repo-wide reflection i nad METRIČKO slojem.
- Centralni dokaz ostaje `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection`.

## Locked semantics

- `matrica` = deklaracije koda u izvornom opsegu
- `instance` = ekstremno pozicioniranje koda na elementarnom nivou
- `muvanje bez pogonskog akcenta` = neutralna/degradaciono-bezbedna deklarativna postura
- `sprega akcenata u odnosu na površinu zastupnjenog kodeksa` = instance-level coupling signal

## Ownership model

- **EXTREM**: tehnički signal, declaration-matrix scoring, instance-positioning scoring, degraded-safe posture i zaključani `DOK + DIK + FOR`
- **EXTRONDOL**: WAWE progression, promotion freeze, release audit summary, readiness scorecard, human-review/rollback coupling i zaključani `DAK + DUK` governance sloj nad metričkim signalom
- **SPAJA KOD**: audit-safe final status bez internih matrica i instance detalja

## Technical shape

EXTREM objavljuje `metrikoProgramiranje` signal sa dve jezgrene celine:

1. `declarationMatrix`
   - source-scope declaration readiness
   - neutral declaration posture
   - `DOK` tehnički dokaz
2. `instancePositioning`
   - elemental instance positioning
   - accent-surface coupling
   - `DIK` tehnički dokaz

Obe celine daju zbirni `score`, `READY | WATCH | BLOCKED` status, `watchReasons`, `blockerReasons` i `degraded` signal.

## Governance mapping

EXTRONDOL koristi isti signal za:

- WAWE progression
- promotion freeze
- release-audit summary
- readiness scorecard
- downstream sync reference
- human-review zahtev

`DAK` i `DUK` ostaju governance interpretacija metričkog signala i ne postaju tehnički izvor, dok `FOR` ostaje u EXTREM tehničkom ownership split-u zajedno sa `DOK + DIK`.

## Public boundary

`/api/extrimli/spaja-kod` objavljuje samo `metrikoProgramiranjeStatus`. Raw matrix/instance scoring ostaje unutar EXTREM + EXTRONDOL sloja.

## Repo-wide reflection lock

- `METRIČKO PROGRAMIRANJE` ostaje kanonski satnica/vremenski ritam sloj unutar `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == RADNI TAKT MOZGA (MISLILAC)` repo-wide reflection modela.
- Dnevni governance cadence koristi METRIČKO kao kanonski satnični sloj za `morning-startup`, `deep-focus-block`, `midday-checkpoint` i `end-of-day-closeout`.
- Dozvoljeni statusi ostaju `READY | WATCH | BLOCKED`.
- Deterministički fallback ostaje obavezan za `NaN`, `Infinity`, prazne i konfliktne ulaze.
- Nema novih runtime modula niti paralelnog source-of-truth sistema.

## Drift-zero lock

Ovaj track mora ostati usklađen kroz `docs + types + routes + tests + workflows` prema `docs/EXTRIMLI-DEVELOPER-CREATE-PROGRAM.md`.
