# EXTRIMLI + EXTRONDOL + EXTREM — Developer/Create Program

> Program type: additive-only initiative (no breaking changes)  
> Source-of-truth routes: `/api/extrimli/extrem`, `/api/extrimli/extrondol`
> Marker: `PROGRAM_LOCK_SOURCE_OF_TRUTH`

## 1) Unified goal and scope

Ovaj program standardizuje **developer/create** rad nad EXTRIMLI + EXTRONDOL + EXTREM slojevima kao additive-only model:

- bez breaking promena na zaključanim rutama i payload ugovorima
- sa eksplicitnim governance, audit i rollback disciplinama
- sa downstream usklađivanjem prema `spaja86/IO-OPENUI-AO`

## 2) Roadmap lock (Verzije 1–7)

Program je zaključan na postojeći roadmap:

1. **V1** — core EXTRIMLI stabilizacija  
2. **V2** — canonical integration layer  
3. **V3** — advanced readiness/profiler expansion  
4. **V4** — EXTREM governance hardening  
5. **V5** — EXTRONDOL release orchestration  
6. **V6** — multi-repo + persona sync  
7. **V7** — enterprise operating model  

## 2.1) Locked implementation nucleus

Sledeći artefakti ostaju zaključano jezgro Developer/Create programa:

- `docs/EXTRIMLI.md`
- `docs/EXTRIMLI-DEVELOPER-CREATE-PROGRAM.md`
- `docs/EXTRIMLI-SINEMETRICKO-PROGRAMIRANJE.md`
- `src/lib/extrimli-extrem/**`
- `src/lib/extrimli-extrondol/**`
- `src/app/api/extrimli/extrem/route.ts`
- `src/app/api/extrimli/extrondol/route.ts`
- `src/tests/lib/extrimli-extrem.test.ts`
- `src/tests/lib/extrimli-extrondol.test.ts`

Ownership hard lock:

- `EXTRIMLI` = bazni runtime domen
- `EXTREM` = tehnički signal i profiler
- `EXTRONDOL` = WAWE orkestracija, audit, freeze/promotion
- `DOK + DIK` ostaju u EXTREM tehničkom sloju
- `DAK + DUK` ostaju u EXTRONDOL governance sloju
- `SPAJA KOD` ostaje javni audit-safe boundary bez internih detalja

## 3) Implementation backlog (developer/create tokovi)

### Stream A — Domain model i tipovi
- EXTREM/EXTRONDOL tipovi ostaju versioned, additive-only i backward-compatible.
- Svaka nova obavezna semantika mora biti dokumentovana u docs + types + routes + tests + workflow slojevima.
- `METRIČKO PROGRAMIRANJE` prati isti additive-only nucleus: declaration-matrix + instance-positioning signal u EXTREM, governance interpretacija u EXTRONDOL, audit-safe summary u SPAJA KOD.

### Stream B — API surface stabilnost i degradacija
- Održati `partial-payload-no-500` politiku.
- Nema mutacije postojećih obaveznih polja bez additive kompatibilnosti.

### Stream C — Governance freeze/promotion signali
- Freeze i promotion odluke ostaju determinističke i auditabilne.
- WAWE gate razlozi ostaju eksplicitni i traceable.
- DOK/DIK/DAK/DUK signalni model ostaje zaključan: **DOK+DIK** u EXTREM tehničkom sloju, **DAK+DUK** u EXTRONDOL governance sloju.
- `METRIČKO PROGRAMIRANJE` koristi isti ownership model i ne uvodi paralelni governance source izvan postojećih ruta.
- Svaki rollout mora izložiti jedinstveni `dokDikDakDukConsistencyHealth` izlaz i test konzistentnosti između tehničkog i governance sloja.
- SINEMETRIČKO PROGRAMIRANJE ostaje additive-only signal (bez novih ruta): EXTREM objavljuje readiness/conflict/evidence, EXTRONDOL koristi signal za WAWE freeze/promotion i release-audit odluke.
- `PROGRAMSKI JEZIK ANALIZA (ispitivanje eskalacije kodesnog zapleta)` je obavezni additive audit sloj u `dokDikDakDukConsistencyHealth`: mora objediniti tehničke conflict/readiness indikatore i governance freeze/promotion/escalation odluke u jedan score/status izlaz.

### Stream D — B2B readiness + payment verification
- `b2bScope`, `b2bReadiness`, `paymentVerification` ostaju hard gate sloj pre promocije.
- Human review i onboarding/downstream evidence ostaju obavezni.

### Stream E — Downstream sync artefakti
- Obavezno ažuriranje `docs/MULTI-REPO-LINKS.md` za sve EXTRIMLI/EXTREM/EXTRONDOL promene.
- Obavezna referenca za `spaja86/IO-OPENUI-AO` follow-up.

## 3.1) Redosled realizacije

1. dokumentacioni lock i roadmap
2. type/contract usklađivanje
3. route i health izlazi
4. test i governance conformance
5. downstream sync i public-safe summary

## 4) EXTREM priorities

- Održati DISKVIT conflict profil i resolution readiness signal set.
- Održati `semaMuSemaFormula` i mobilna-linija signal contract.
- Jasno odvojiti **warning** od **blocked** uslova koji aktiviraju freeze.
- Održati KPI observability (`evaluation`, `api`, `build` gde je primenljivo).

## 5) EXTRONDOL priorities

- Održati WAWE 1–5 orkestraciju.
- Održati `releaseAuditSummary`, `releaseReadinessScorecard`, `contractDriftReport`, `governanceConformance`.
- Održati NIVO DUET + DINKOS + `distanceRatioEkvilaterTable` kao obavezne orkestracione signale.

## 6) CI/CD i quality gate lock

Koristi se postojeći governance set:

- `.github/workflows/extrimli-validator.yml`
- `.github/workflows/extrimli-governance-conformance.yml`

Gate redosled je zaključan: **lint → test → smoke → predeploy → security**.  
Human review je hard gate pre produkcione promocije.

## 7) Trance/Release operacija

Operativni tok ostaje usklađen sa `docs/EXTRIMLI-TRANCE-EXTREM.md`:

- pre-check
- build
- staging
- multi-repo sync
- production rollout
- post-resilience

Rollback procedura i audit konvencija moraju biti spremni pre svake promocije.

## 8) Multi-repo obaveze

- Svaka promena koja utiče na EXTRIMLI/EXTREM/EXTRONDOL mora imati downstream mapiranje.
- Referenca ka `spaja86/IO-OPENUI-AO` je obavezna u `docs/MULTI-REPO-LINKS.md`.

## 9) Drift-zero governance disciplina

Uvodi se pravilo **drift-zero**:

- svaka contract promena mora biti sinhronizovana kroz **docs + types + routes + workflows**
- za DOK/DIK/DAK/DUK promene dodatno je obavezna sinhronizacija kroz **docs + types + routes + tests + workflows** bez drift-a
- nema merge-a ako postoji drift između tih slojeva
- governance conformance workflow je obavezni enforcement sloj
- Marker: `PROGRAM_LOCK_DRIFT_ZERO`

## 10) Maksimalni dodatni predlozi (program expansion)

1. Canary ring dashboard za WAWE i freeze razloge  
2. Automatski single-pane release-readiness izvoz u PR summary  
3. Formalni contract evolution log (additive-only history)  
4. Incident rehearsal (simulirani freeze/rollback) pre većih release-eva  
5. KPI budget alarms (`eval/api/build`) sa trend praćenjem po verziji

## 11) Definition of Done

### Machine-checked DoD (enforced by workflows/tests)

- EXTRIMLI/EXTREM/EXTRONDOL testovi prolaze
- Governance conformance je green
- Source-of-truth routes i drift-zero pravila ostaju usklađeni
- docs, types, routes, tests i workflows ostaju međusobno usklađeni
- Marker: `PROGRAM_LOCK_MACHINE_DOD`

### Operational DoD (human governance gate)

- Dokumentacija + downstream linkovi su ažurni
- Human review je potvrđen
- Rollback plan + audit summary su kompletni
- Security i secret-scan disciplina ostaju potvrđeni pre promocije
