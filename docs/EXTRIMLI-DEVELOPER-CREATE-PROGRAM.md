# EXTRIMLI + EXTRONDOL + EXTREM — Developer/Create Program

> Program type: additive-only initiative (no breaking changes)  
> Source-of-truth routes: `/api/extrimli/extrem`, `/api/extrimli/extrondol`, `/api/extrimli/spaja-kod`
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
- `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == RADNI TAKT MOZGA (MISLILAC)` ostaje repo-wide reflection lock: isti `READY | WATCH | BLOCKED` jezik, isti deterministic fallback za `NaN`, `Infinity`, prazne i konfliktne ulaze i isti `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection` dokaz moraju važiti kroz docs + types + routes + tests + workflows.
- Primarni `ČOVEČNOST` vizuel (`https://github.com/user-attachments/assets/4790f4ea-4271-4d2a-ae0a-d9bec5bc8b8a`) zaključan je kao additive-only audit/reference sloj unutar postojećeg image-to-signal modela: `scenarioId=covecnost-developer-create-vrh-radni-takt` živi isključivo u `developerAndCreateRepoWideReflection.covecnostAuditVisualReference`, bez novih ruta i bez zamene postojećeg `priroda-zdrav-zivot-covecanstvo` epiloga.
- Vizuel ostaje bounded interpretacija postojećeg tehničkog profila: `INSTINKT`, `ZNANJE`, `ISKUSTVO` i `PREDVIĐANJE` ostaju audit-only narativni markeri, dok šest etapa (`UČENJE`, `TRENING`, `ISKUSTVO`, `PROCENA`, `ODLUKA`, `USPEH`) samo potvrđuju isti dnevni cadence i isti `READY | WATCH | BLOCKED` model.
- Dodatni `ČOVEČANSTVO — ŽIVOT JE NAJVEĆA IGRA` vizuel (`https://github.com/user-attachments/assets/27ef7575-9ef6-425e-bdbf-75feb722bad2`) ulazi samo kao supplemental audit/reference dokaz u `developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, bez menjanja source-of-truth modela i bez promene ownership split-a.
- Dodatni `ČOVEČANSTVO — ENTIZUJAŽAM (ZVEZDE / MISLI / INOVACIJE)` vizuel (`https://github.com/user-attachments/assets/f7b3e102-e0a0-4885-a93e-040f09454737`) ulazi samo kao supplemental audit/reference dokaz u `developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=covecanstvo-entizujazam-zvezde-misli-inovacije-developer-create`, bez menjanja source-of-truth modela i bez promene ownership split-a.
- Dodatni `ČOVEČANSTVO — EPILOG` vizuel (`https://github.com/user-attachments/assets/36ce7570-103e-4097-b903-fbe0efaf4026`) ulazi samo kao supplemental audit/reference dokaz u `developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=covecanstvo-epilog-rad-energija-stvaranja-developer-create`; rad, iskustvo, energija stvaranja i ljudsko jedinstvo ostaju audit-only epilog dokaz bez novih ruta, formula ili ownership drift-a.
- Dodatni `ČOVEČANSTVO — MATIČNE ĆELIJE I SPOZNAVANJE SEBE` vizuel (`https://github.com/user-attachments/assets/908ab1a4-5a00-4f93-971a-2cd8e331119d`) ulazi samo kao supplemental audit/reference dokaz u `developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=covecanstvo-maticne-celije-i-spoznavanje-sebe-developer-create`; ostaje documentation/evidence sloj bez novih ruta, formula ili ownership drift-a.
- `ČOVEČANSTVO / OSEĆAJ OSEBENOSTI` vizuel (`https://github.com/user-attachments/assets/9273c07f-5c03-4db4-a469-d22d456596f9`) zaključan je kao companion additive-only audit/reference sloj: `scenarioId=covecanstvo-osecaj-osebenosti-developer-create-vrh-radni-takt` živi isključivo u `developerAndCreateRepoWideReflection.covecnostAuditVisualReference.companionAuditVisualReferences` i sme da nosi samo audit-safe teme `self-knowledge`, `brain-and-mind-understanding`, `feeling`, `humanity`, `shared-world` i `epilog-guidance`.
- Repo-wide reflection sada obavezno nosi i dnevni operativni sloj kao governance artefakt: svaki dan mora imati task set vezan za jednu aktivnu roadmap fazu, prioritete `1–3`, merljiv izlaz, acceptance evidence i closeout status `completed | carried-over | blocked`.
- Dnevni cadence blokovi ostaju zaključani na `morning-startup`, `deep-focus-block`, `midday-checkpoint` i `end-of-day-closeout`, izvedeni iz postojećih modula, validatora i workflow-a bez novog runtime domena za taskove.
- V2–V5 lock za VRH je sekvencijalan: prvo docs + contract mapping, zatim EXTREM signal expansion, zatim deterministic governance hardening, pa tek onda EXTRONDOL release orchestration.

### Stream D — B2B readiness + payment verification
- `b2bScope`, `b2bReadiness`, `paymentVerification` ostaju hard gate sloj pre promocije.
- Human review i onboarding/downstream evidence ostaju obavezni.

### Stream E — Downstream sync artefakti
- Obavezno ažuriranje `docs/MULTI-REPO-LINKS.md` za sve EXTRIMLI/EXTREM/EXTRONDOL promene.
- Obavezna referenca za `spaja86/IO-OPENUI-AO` follow-up.

## 3.1) Redosled realizacije

1. dokumentacioni lock i roadmap
2. terminološko i ownership usklađivanje
3. type/contract usklađivanje
4. route i health izlazi
5. test i governance conformance
6. dnevni task cadence
7. downstream sync i public-safe summary

## 3.2) PR execution lock (obavezno mapiranje)

- Svaki PR mora mapirati **tačno jednu** roadmap fazu (`Verzija 1` do `Verzija 7`).
- Svaki PR mora sadržati jedan jasno merljiv izlaz: `roadmapStageId`, `measurableOutput`, `acceptanceEvidence`.
- Svaki dnevni task set mora pratiti isti PR/governance model: prioritet `1`, `2` i `3` moraju biti vezani za istu aktivnu roadmap fazu.
- PR bez ove mape se tretira kao governance drift i ne ide u promotion.

## 3.3) Dnevni operativni cadence lock

- Dnevni zadaci nisu novi paralelni sistem, već governance artefakt izveden iz postojećih modula, validatora i workflow-a.
- Svaki dan obavezno sadrži:
  - `morning-startup`
  - `deep-focus-block`
  - `midday-checkpoint`
  - `end-of-day-closeout`
- Svaki dnevni task mora imati:
  - `priority` = `1 | 2 | 3`
  - `roadmapStageId`
  - `measurableOutput`
  - `acceptanceEvidence`
- Kraj dana obavezno zatvara status:
  - `completed`
  - `carried-over`
  - `blocked`
- `EXTREM` nosi tehničke signale radnog takta i dnevne discipline, `EXTRONDOL` nosi governance odluku `READY | WATCH | BLOCKED`, a centralni dokaz ostaje `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection`.
## 3.3) Current implementation phase lock

- Za repo-wide reflection implementaciju aktivni execution lock ostaje `roadmapStageId=v5-extrondol-release-audit-and-orchestration`.
- `measurableOutput` ostaje: audit-safe repo-wide reflection status se objavljuje isključivo kroz postojeće `/api/extrimli/extrem`, `/api/extrimli/extrondol` i `/api/extrimli/spaja-kod` surface-ove.
- `acceptanceEvidence` ostaje: `developerAndCreateRepoWideReflection`, `developerAndCreateRepoWideReflection.covecnostAuditVisualReference`, `developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, `developerAndCreateRepoWideReflection.covecnostAuditVisualReference.companionAuditVisualReferences`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance`, `spajaKod.publicSignals.developerAndCreateStatus`.
- EXTREM zadržava tehnički `technicalReadinessProfile` za “radni takt”, dok EXTRONDOL zadržava samo WAWE/freeze/promotion/audit/rollback/human-review interpretaciju tog istog signala.
- Novi `ČOVEČNOST` vizuel mora ostati vezan za isti `technicalReadinessProfile`, isti `DOK/DIK/FOR` naspram `DAK/DUK` ownership split i isti execution lock `v5-extrondol-release-audit-and-orchestration`.
- Isti execution lock pokriva audit vizuelni paket ČOVEČNOST + ČOVEČANSTVO: EXTREM objavljuje bounded readiness/conflict signal, EXTRONDOL ga prenosi samo kao governance evidence, a SPAJA KOD ga objavljuje samo kroz audit-safe public summary.
- Isti execution lock pokriva i `ČOVEČANSTVO — EPILOG` supplemental audit vizuel: EXTREM ga vezuje za isti `technicalReadinessProfile`, EXTRONDOL ga prenosi samo kao release-audit evidence, a SPAJA KOD ga objavljuje samo kroz audit-safe public summary metadata.
- Isti execution lock pokriva i `ČOVEČANSTVO — MATIČNE ĆELIJE I SPOZNAVANJE SEBE` supplemental audit vizuel: EXTREM ga vezuje za isti `technicalReadinessProfile`, EXTRONDOL ga prenosi samo kao release-audit evidence, a SPAJA KOD ga objavljuje samo kroz audit-safe public summary metadata.
- Isti execution lock pokriva i companion `ČOVEČANSTVO / OSEĆAJ OSEBENOSTI` audit vizuel: EXTREM objavljuje bounded readiness/conflict signal, EXTRONDOL ga prenosi samo kao governance evidence, a SPAJA KOD ga objavljuje samo kroz audit-safe public metadata.
- Dok linked repo `spaja86/IO-OPENUI-AO` ne usvoji isti audit-safe summary, downstream boundary ostaje eksplicitno `follow-up-only-until-io-openui-ao-adopts-audit-safe-summary`.

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
- Dnevni task set postoji za svaku aktivnu fazu i zatvara se sa `completed`, `carried-over` ili `blocked`

## PROGRAMSKI JEZIK INFORMACIONIH TOKOVA LOCK

- `PROGRAM_LOCK_SOURCE_OF_TRUTH`: `PROGRAMSKI JEZIK INFORMACIONIH TOKOVA` koristi samo `/api/extrimli/extrem`, `/api/extrimli/extrondol` i `/api/extrimli/spaja-kod` kao source-of-truth surface-ove (tehnički signal + governance + audit-safe javni boundary).
- `PROGRAM_LOCK_DRIFT_ZERO`: docs + types + routes + tests + workflows moraju ostati usklađeni za `FOR` signal i `DOK/DIK/DAK/DUK/FOR` ownership split.
- `PROGRAM_LOCK_MACHINE_DOD`: acceptance zahteva deterministički izlaz za iste numeričke tokove, audit-ready konsolidovani status i samo audit-safe downstream reference.
- `PROGRAMSKI JEZIK PROUČAVANJA`, `PROGRAMSKI EKANALOG` i `PROGRAMSKI JEZIK INFORMACIONIH TOKOVA` dele additive-only governance model bez paralelnog runtime-a.
- Realization sequence ostaje: documentation lock, contract/type alignment, health/readiness outputs, test + governance conformance, downstream sync + public summary.


## PROGRAMSKI JEZIK PARADIGMA I OBLIKOVANJE TELA LOCK

- `PROGRAM_LOCK_SOURCE_OF_TRUTH`: `PROGRAMSKI JEZIK PARADIGMA I OBLIKOVANJE TELA` koristi samo `/api/extrimli/extrem`, `/api/extrimli/extrondol` i `/api/extrimli/spaja-kod` kao source-of-truth surface-ove.
- `PROGRAM_LOCK_DRIFT_ZERO`: docs + types + routes + tests + workflows moraju ostati poravnati za `programskiJezikParadigmaOblikovanjeTela` contract, release audit i SPAJA KOD summary.
- `PROGRAM_LOCK_MACHINE_DOD`: obavezni dokaz ostaju `src/tests/lib/extrimli-extrem.test.ts`, `src/tests/lib/extrimli-extrondol.test.ts`, `src/tests/api/extrimli-route.test.ts` i `.github/workflows/extrimli-governance-conformance.yml`.
- `PROGRAMSKI JEZIK PARADIGMA I OBLIKOVANJE TELA` deli additive-only governance model sa `PROGRAMSKI JEZIK INFORMACIONIH TOKOVA`, `PROGRAMSKI JEZIK PRETPOSTAVKA`, `PROGRAMSKI JEZIK PROUČAVANJA` i `PROGRAMSKI EKANALOG`.

## VRH PROGRAMSKOG EKVILADENTA LOCK

- `PROGRAM_LOCK_SOURCE_OF_TRUTH`: `VRH PROGRAMSKOG EKVILADENTA` koristi samo `/api/extrimli/extrem`, `/api/extrimli/extrondol` i `/api/extrimli/spaja-kod` kao postojeće surface-ove bez novih runtime ruta.
- `PROGRAM_LOCK_TERMINOLOGY`: `DOK + DIK + FOR` su EXTREM technical ownership; `DAK + DUK` su EXTRONDOL governance ownership; ChatGPT/share materijal ostaje documentation-only.
- `PROGRAM_LOCK_VRH_TRACKS`: eksponencijalne funkcije, oktavna topologija, sekvencijalna oktavna reprodukcija, exposure i torque moraju biti mapirani na postojeće EXTREM/EXTRONDOL discipline, a `KRALJEVSKI MATEMATIČKI UNIVERZITET`, `KRALJEVSKA FIZIKA UNIVERZITET` i `KRALJEVSKI MAŠINSKI UNIVERZITET` smeju postojati samo kao interpretativne trake.
- `PROGRAM_LOCK_PARENT_CHILD`: track ostaje interpretativni vršni sloj iznad `PROPORCIONALNO PROGRAMIRANJE`, ne zaseban paralelni sistem.
- `PROGRAM_LOCK_ROLE_SPLIT`: `PROPORCIONALNO PROGRAMIRANJE` ostaje parent disciplina, `METRIČKO PROGRAMIRANJE` nosi satnicu i deklarativno-instancijsku metriku, `SINEMETRIČKO PROGRAMIRANJE` nosi vokalni/narativni audit-safe sloj, a `PARADIJOGONALNO PROGRAMIRANJE` iz `docs/EXTRIMLI-PARADIJOGONALNO-PROGRAMIRANJE.md` ostaje instrument tabla za pregled i signalnu kontrolu.
- `PROGRAM_LOCK_REPO_WIDE_REFLECTION`: `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == RADNI TAKT MOZGA (MISLILAC)` sme postojati samo kao additive reflection preko postojećih `VRH`, `RADNI TAKT`, `METRIČKO`, `SINEMETRIČKO` i `PARADIJOGONALNO` track-ova, uz centralni dokaz u `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection`.
- `PROGRAM_LOCK_DAILY_CADENCE`: isti repo-wide reflection mora nositi dnevni governance cadence sa `morning-startup`, `deep-focus-block`, `midday-checkpoint`, `end-of-day-closeout`, prioritetima `1–3` i closeout statusima `completed | carried-over | blocked`.
- `PROGRAM_LOCK_CONTRACT_MAPPING`: analize, proučavanja, informacioni tokovi, pretpostavke, apstrakcije, paradigmijalno oblikovanje tela, ekstremne igrice, prosparitetne matrice i dekoracija primesa moraju ostati mapirani na postojeće AI IQ / EXTRIMLI kontrakte bez novog source-of-truth sloja.
- `PROGRAM_LOCK_OWNERSHIP`: `EXTREM` zadržava `DOK + DIK + FOR` tehničko vlasništvo, `EXTRONDOL` zadržava `DAK + DUK` governance vlasništvo, a `SPAJA KOD` ostaje samo audit-safe summary boundary.
- `PROGRAM_LOCK_MACHINE_DOD`: bilo koja buduća realizacija sme biti samo additive proširenje kroz EXTREM tehnički izveštaj, EXTRONDOL `releaseAuditSummary`, SPAJA KOD summary i prateće docs/tests slojeve uz deterministički `READY | WATCH | BLOCKED` izlaz i fallback za `NaN`, `Infinity`, prazne ili konfliktne ulaze; ako track pređe iz documentation-only u enforced contract stanje, tada obavezni validation artefakti postaju `src/tests/lib/extrimli-extrem.test.ts`, `src/tests/lib/extrimli-extrondol.test.ts`, `src/tests/api/extrimli-route.test.ts` i `.github/workflows/extrimli-governance-conformance.yml`.
