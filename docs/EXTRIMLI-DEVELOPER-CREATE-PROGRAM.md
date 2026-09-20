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
- `docs/EXTRIMLI-VRH-PROGRAMSKOG-EKVILADENTA.md`
- `src/lib/extrimli-extrem/**`
- `src/lib/extrimli-extrondol/**`
- `src/app/api/extrimli/extrem/route.ts`
- `src/app/api/extrimli/extrondol/route.ts`
- `src/tests/lib/extrimli-extrem.test.ts`
- `src/tests/lib/extrimli-extrondol.test.ts`
- `src/tests/api/extrimli-route.test.ts`

Ownership hard lock:

- `EXTRIMLI` = bazni runtime domen
- `EXTREM` = tehnički signal i profiler
- `EXTRONDOL` = WAWE orkestracija, audit, freeze/promotion
- `DOK + DIK + FOR` ostaju u EXTREM tehničkom sloju
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
- DOK/DIK/DAK/DUK/FOR signalni model ostaje zaključan: **DOK+DIK+FOR** u EXTREM tehničkom sloju, **DAK+DUK** u EXTRONDOL governance sloju.
- `METRIČKO PROGRAMIRANJE` koristi isti ownership model i ne uvodi paralelni governance source izvan postojećih ruta.
- Svaki rollout mora izložiti jedinstveni `dokDikDakDukConsistencyHealth` izlaz i test konzistentnosti između tehničkog i governance sloja.
- SINEMETRIČKO PROGRAMIRANJE ostaje additive-only signal (bez novih ruta): EXTREM objavljuje readiness/conflict/evidence, EXTRONDOL koristi signal za WAWE freeze/promotion i release-audit odluke.
- `PROGRAMSKI JEZIK ANALIZA (ispitivanje eskalacije kodesnog zapleta)` je obavezni additive audit sloj u `dokDikDakDukConsistencyHealth`: mora objediniti tehničke conflict/readiness indikatore i governance freeze/promotion/escalation odluke u jedan score/status izlaz.
- `PROGRAMSKI JEZIK PROUČAVANJA` je obavezni additive laboratorijski sloj: ulazni profil slučaja + determinističke metrike + konsolidovani status (`READY | WATCH | BLOCKED`) uz zaključan ownership split (`DOK/DIK/FOR` tehnički, `DAK/DUK` governance).
- `PROGRAMSKI EKANALOG (razumevanje logike)` je obavezni audit-ready interpretacioni sloj nad laboratorijskim rezultatima bez novih source-of-truth ruta.
- `VRH PROGRAMSKOG EKVILADENTA` ostaje additive-only interpretativni vršni sloj nad `PROPORCIONALNO PROGRAMIRANJE`: satnica se mapira na `METRIČKO PROGRAMIRANJE`, vokalni/narativni deo na `SINEMETRIČKO PROGRAMIRANJE`, a instrument tabla na `PARADIJOGONALNO PROGRAMIRANJE` (`docs/EXTRIMLI-PARADIJOGONALNO-PROGRAMIRANJE.md`), bez uvođenja novih runtime ruta.

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

## 3.2) PR execution lock (obavezno mapiranje)

- Svaki PR mora mapirati **tačno jednu** roadmap fazu (`Verzija 1` do `Verzija 7`).
- Svaki PR mora sadržati jedan jasno merljiv izlaz: `roadmapStageId`, `measurableOutput`, `acceptanceEvidence`.
- PR bez ove mape se tretira kao governance drift i ne ide u promotion.

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
- za DOK/DIK/DAK/DUK/FOR promene dodatno je obavezna sinhronizacija kroz **docs + types + routes + tests + workflows** bez drift-a
- nema merge-a ako postoji drift između tih slojeva
- governance conformance workflow je obavezni enforcement sloj
- Marker: `PROGRAM_LOCK_DRIFT_ZERO`

## 10) Maksimalni dodatni predlozi (program expansion)

1. Canary ring dashboard za WAWE i freeze razloge  
2. Automatski single-pane release-readiness izvoz u PR summary  
3. Formalni contract evolution log (additive-only history)  
4. Incident rehearsal (simulirani freeze/rollback) pre većih release-eva  
5. KPI budget alarms (`eval/api/build`) sa trend praćenjem po verziji

## 10.1) Standardizovani operativni audit paket (PR opis)

Svaka veća izmena mora imati audit-ready PR opis sa obaveznim poljima:

- `rolloutPlan`
- `rollbackPlan`
- `kpiImpact`
- `humanReviewStatus`
- `downstreamReference`

Bez kompletnog audit paketa release ostaje u freeze režimu.

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

## PROGRAMSKI JEZIK INFORMACIONIH TOKOVA LOCK

- `PROGRAM_LOCK_SOURCE_OF_TRUTH`: `PROGRAMSKI JEZIK INFORMACIONIH TOKOVA` koristi samo `/api/extrimli/extrem` i `/api/extrimli/extrondol` kao source-of-truth rute.
- `PROGRAM_LOCK_DRIFT_ZERO`: docs + types + routes + tests + workflows moraju ostati usklađeni za `FOR` signal i `DOK/DIK/DAK/DUK/FOR` ownership split.
- `PROGRAM_LOCK_MACHINE_DOD`: acceptance zahteva deterministički izlaz za iste numeričke tokove, audit-ready konsolidovani status i samo audit-safe downstream reference.
- `PROGRAMSKI JEZIK PROUČAVANJA`, `PROGRAMSKI EKANALOG` i `PROGRAMSKI JEZIK INFORMACIONIH TOKOVA` dele additive-only governance model bez paralelnog runtime-a.
- Realization sequence ostaje: documentation lock, contract/type alignment, health/readiness outputs, test + governance conformance, downstream sync + public summary.


## PROGRAMSKI JEZIK PARADIGMA I OBLIKOVANJE TELA LOCK

- `PROGRAM_LOCK_SOURCE_OF_TRUTH`: `PROGRAMSKI JEZIK PARADIGMA I OBLIKOVANJE TELA` koristi samo `/api/extrimli/extrem` i `/api/extrimli/extrondol` kao source-of-truth rute.
- `PROGRAM_LOCK_DRIFT_ZERO`: docs + types + routes + tests + workflows moraju ostati poravnati za `programskiJezikParadigmaOblikovanjeTela` contract, release audit i SPAJA KOD summary.
- `PROGRAM_LOCK_MACHINE_DOD`: obavezni dokaz ostaju `src/tests/lib/extrimli-extrem.test.ts`, `src/tests/lib/extrimli-extrondol.test.ts`, `src/tests/api/extrimli-route.test.ts` i `.github/workflows/extrimli-governance-conformance.yml`.
- `PROGRAMSKI JEZIK PARADIGMA I OBLIKOVANJE TELA` deli additive-only governance model sa `PROGRAMSKI JEZIK INFORMACIONIH TOKOVA`, `PROGRAMSKI JEZIK PRETPOSTAVKA`, `PROGRAMSKI JEZIK PROUČAVANJA` i `PROGRAMSKI EKANALOG`.

## VRH PROGRAMSKOG EKVILADENTA LOCK

- `PROGRAM_LOCK_SOURCE_OF_TRUTH`: `VRH PROGRAMSKOG EKVILADENTA` koristi samo `/api/extrimli/extrem`, `/api/extrimli/extrondol` i `/api/extrimli/spaja-kod` kao postojeće surface-ove bez novih runtime ruta.
- `PROGRAM_LOCK_PARENT_CHILD`: track ostaje interpretativni vršni sloj iznad `PROPORCIONALNO PROGRAMIRANJE`, ne zaseban paralelni sistem.
- `PROGRAM_LOCK_ROLE_SPLIT`: `PROPORCIONALNO PROGRAMIRANJE` ostaje parent disciplina, `METRIČKO PROGRAMIRANJE` nosi satnicu i deklarativno-instancijsku metriku, `SINEMETRIČKO PROGRAMIRANJE` nosi vokalni/narativni audit-safe sloj, a `PARADIJOGONALNO PROGRAMIRANJE` iz `docs/EXTRIMLI-PARADIJOGONALNO-PROGRAMIRANJE.md` ostaje instrument tabla za pregled i signalnu kontrolu.
- `PROGRAM_LOCK_CONTRACT_MAPPING`: analize, proučavanja, informacioni tokovi, pretpostavke, apstrakcije, paradigmijalno oblikovanje tela, ekstremne igrice, prosparitetne matrice i dekoracija primesa moraju ostati mapirani na postojeće AI IQ / EXTRIMLI kontrakte bez novog source-of-truth sloja.
- `PROGRAM_LOCK_OWNERSHIP`: `EXTREM` zadržava `DOK + DIK + FOR` tehničko vlasništvo, `EXTRONDOL` zadržava `DAK + DUK` governance vlasništvo, a `SPAJA KOD` ostaje samo audit-safe summary boundary.
- `PROGRAM_LOCK_MACHINE_DOD`: bilo koja buduća realizacija sme biti samo additive proširenje kroz EXTREM tehnički izveštaj, EXTRONDOL `releaseAuditSummary`, SPAJA KOD summary i prateće docs/tests slojeve uz deterministički `READY | WATCH | BLOCKED` izlaz i fallback za `NaN`, `Infinity`, prazne ili konfliktne ulaze; ako track pređe iz documentation-only u enforced contract stanje, tada obavezni validation artefakti postaju `src/tests/lib/extrimli-extrem.test.ts`, `src/tests/lib/extrimli-extrondol.test.ts`, `src/tests/api/extrimli-route.test.ts` i `.github/workflows/extrimli-governance-conformance.yml`.
