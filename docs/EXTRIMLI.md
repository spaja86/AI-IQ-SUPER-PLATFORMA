# EXTRIMLI — Extreme Sports & Adventure Intelligence

## Overview

EXTRIMLI is the platform domain for extreme-sports risk evaluation, athlete progression, gear safety, and event readiness.

This repository now exposes five aligned surfaces:

| Version | Path | Status | Purpose |
|---|---|---|---|
| **v1** | `src/lib/extrimli/`, `src/app/api/extrimli/` | Active | Existing baseline registry, risk, gear, performance, event, and weather APIs |
| **v3** | `src/lib/extrimli-3/`, `src/app/api/extrimli-3/` | Active | Versioned expansion with sport-specific risk profiles, weather-integrated scoring, and athlete readiness signals |
| **DUEL KING** | `src/lib/extrimli-duel-king/`, `src/app/api/extrimli/duel-king/` | Active | Competitive-combat capability for duel risk, readiness, gear clearance, and tournament posture |
| **EXTRIMLI CUZ** | `src/lib/extrimli-cuz/`, `src/app/api/extrimli-cuz/` | Active | Community, mentorship, feed, and reputation surface used by Extendol and KORON |
| **Extendol (Extended)** | `src/lib/extrimli-extendol/`, `src/app/api/extrimli/extendol/` | Active | Unified “maximum functionality for all” contract that aggregates v1 + v3 + EXTRIMLI CUZ + KORON |
| **KORON** | `src/lib/extrimli-koron/`, `src/app/api/extrimli/koron/` | Active | Readiness overlay that summarizes cross-surface stability, sync coverage, and degraded posture |
| **EXTRONDEND** | `src/lib/extrimli-extrondend/`, `src/app/api/extrimli/extrondend/` | Active | Dedicated aggregation/scoring surface (not an alias) over v1/v3/CUZ/Extendol/KORON |
| **EXTREM Profiler** | `src/lib/extrimli-extrem/`, `src/app/api/extrimli/extrem/` | Active | DISKVIT browser-graphics bottleneck profiler with conflict-intensity, optimization-tier output, canonical `ŠEMA + ŠEMA + ALL ŠEMA == MUŠEMA` signal, and additive PETLJE technical profiling for `DOK`, `DIK`, `SAR`, `OKRED`, `DIREKT`, `INDIREKT` |
| **EXTRONDOL** | `src/lib/extrimli-extrondol/`, `src/app/api/extrimli/extrondol/` | Active | Dedicated orchestration/readiness WAWE sequencing surface (not an alias), including NIVO DUET, DINKOS, EXTREM profiler governance signal, MUŠEMA freeze/promotion gate, and PETLJE rollout/audit propagation |
| **SPAJA KOD** | `src/app/api/extrimli/spaja-kod/` | Active | Public encapsulated facade over EXTREM + EXTRONDOL that exposes only system readiness, governance, and audit signals |
| **SPAJINO PROPORCIONALNO PROGRAMIRANJE UNIVERZITET** | `docs/EXTRIMLI-SPAJINO-PROPORCIONALNO-PROGRAMIRANJE-UNIVERZITET.md`, `/api/extrimli/extrem`, `/api/extrimli/extrondol`, `/api/extrimli/spaja-kod` | Active | Additive university-layer interpretation over `PROPORCIONALNO PROGRAMIRANJE`; EXTREM owns the technical signal, EXTRONDOL owns WAWE/audit governance, SPAJA KOD exposes only audit-safe summary status |
| **METRIČKO PROGRAMIRANJE** | `docs/EXTRIMLI-METRICKO-PROGRAMIRANJE.md`, `/api/extrimli/extrem`, `/api/extrimli/extrondol`, `/api/extrimli/spaja-kod` | Active | Additive metric-programming track; EXTREM owns declaration-matrix and instance-positioning technical signal, EXTRONDOL owns WAWE/audit governance, SPAJA KOD exposes only audit-safe final status |
| **RADNI TAKT MOZGA (MISLILAC)** | `/api/extrimli/extrem`, `/api/extrimli/extrondol`, `/api/extrimli/spaja-kod` | Active | Additive educational-development track; EXTREM owns DOK/DIK technical learning-rhythm signals, EXTRONDOL owns DAK/DUK WAWE/audit governance, SPAJA KOD exposes only audit-safe readiness + epilog summary |
| **PARADIJOGONALNO PROGRAMIRANJE** | `docs/EXTRIMLI-PARADIJOGONALNO-PROGRAMIRANJE.md`, `/api/extrimli/extrem`, `/api/extrimli/extrondol`, `/api/extrimli/spaja-kod` | Active | Additive-only cloud/prosparitet track; EXTREM owns the instrumental-vision DOK/DIK technical signal, EXTRONDOL owns WAWE/audit DAK/DUK governance, SPAJA KOD exposes only audit-safe final status |
| **SINEMETRIČKO PROGRAMIRANJE** | `docs/EXTRIMLI-SINEMETRICKO-PROGRAMIRANJE.md`, `/api/extrimli/extrem`, `/api/extrimli/extrondol`, `/api/extrimli/spaja-kod` | Active | Additive-only matrix-syntax signal: EXTREM publishes deterministic readiness/conflict/evidence, EXTRONDOL consumes it for WAWE freeze/promotion/audit, SPAJA KOD remains audit-safe summary boundary |
| **VRH PROGRAMSKOG EKVILADENTA** | `docs/EXTRIMLI-VRH-PROGRAMSKOG-EKVILADENTA.md`, `/api/extrimli/extrem`, `/api/extrimli/extrondol`, `/api/extrimli/spaja-kod` | Active | Additive-only interpretative apex layer over `PROPORCIONALNO PROGRAMIRANJE`; orchestrates metric, sinemetric, paradijogonal, and AI-IQ language tracks without introducing a new runtime source of truth |
| **KRALJEVSKI PROGRAMSKI UNEVERZITET** | `docs/EXTRIMLI-VRH-PROGRAMSKOG-EKVILADENTA.md`, `docs/EXTRIMLI-DEVELOPER-CREATE-PROGRAM.md`, `/api/extrimli/extrem`, `/api/extrimli/extrondol`, `/api/extrimli/spaja-kod` | Active | Additive-only vršni programski alias unutar `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == RADNI TAKT MOZGA (MISLILAC)`; EXTREM drži postojeći technicalReadinessProfile, EXTRONDOL audit/governance mirror, SPAJA KOD samo audit-safe summary |
| **SPAJAPRO Track** | `docs/EXTRIMLI-SPAJAPRO-TRACK.md`, `/api/extrimli/extrem`, `/api/extrimli/extrondol`, `/api/extrimli/spaja-kod` | Active | Locked ODIT→KODER planning track layered on EXTRIMLI; EXTREM owns technical signals, EXTRONDOL owns orchestration, SPAJA KOD exposes only final public-safe status |
| **AI IQ Programski Jezik Integration Profile** | `docs/AI-IQ-PROGRAMSKI-JEZIK.md`, `/api/ai-iq-programski-jezik/*`, `/api/extrimli/extrem`, `/api/extrimli/extrondol` | Active | Additive `EXTRIMLI-EXTRONDOL-EXTREM` profile that maps `DOK/DIK/FOR` to EXTREM technical signals and `DAK/DUK` to EXTRONDOL promotion/human-review governance |
| **PROGRAMSKI JEZIK DEKORACIJE OBJEKTNIH PRIMESA** | `docs/AI-IQ-PROGRAMSKI-JEZIK.md`, `/api/extrimli/extrem`, `/api/extrimli/extrondol`, `/api/ai-iq-programski-jezik/*`, `/api/extrimli/spaja-kod` | Active | Additive-only track with locked naming/scope/compatibility: EXTREM owns `DOK/DIK/FOR` technical signal, EXTRONDOL owns `DAK/DUK` WAWE/freeze/promotion/review governance, SPAJA KOD exposes only audit-safe summary |
| **PROGRAMSKI JEZIK PO PROSPARITETU DEKLASIRANE MATRICE U EKSTAZI** | `docs/AI-IQ-PROGRAMSKI-JEZIK.md`, `docs/PROGRAMSKI-JEZIK-PO-PROSPARITETU-DEKLASIRANE-MATRICE-U-EKSTAZI.md`, `/api/extrimli/extrem`, `/api/extrimli/extrondol`, `/api/ai-iq-programski-jezik/*` | Active | Additive-only prosparitet/deklasirane-matrice profile: PROSPARITET stays input-domain-only, EXTREM owns DOK/DIK/FOR technical readiness, EXTRONDOL owns DAK/DUK WAWE/audit governance, SPAJA KOD exposes only audit-safe summary |
| **PROGRAMSKI JEZIK SPECIJALIZOVAN ZA IGRICE** | `docs/AI-IQ-PROGRAMSKI-JEZIK.md`, `/api/ai-iq-programski-jezik/*`, `/api/extrimli/extrem`, `/api/extrimli/extrondol`, `src/lib/igrice.ts`, `src/lib/gaming-endzin.ts` | Active | Additive-only gaming DSL profile: AI IQ owns orchestration/explainability, EXTREM owns DOK/DIK/FOR gameplay-runtime readiness, EXTRONDOL owns DAK/DUK WAWE/audit governance, SPAJA KOD exposes only audit-safe summary |
| **World Bank Persona Bridge** | `src/lib/extrimli-world-bank-persona/`, `src/app/api/extrimli/world-bank-persona/` | Active | Maps AI IQ World Bank business context + EXTRIMLI/EXTRONDOL readiness into persona-centric output and Persona Bank lifecycle updates |

- `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == RADNI TAKT MOZGA (MISLILAC)` ostaje additive-only repo-wide reflection nad postojećim `VRH`, `RADNI TAKT`, `METRIČKO`, `SINEMETRIČKO` i `PARADIJOGONALNO` track-ovima.
- `KRALJEVSKI PROGRAMSKI UNEVERZITET` je additive-only vršni programski alias unutar istog reflection paketa: nije novi modul, nema nove rute i samo sabira postojeće `VRH PROGRAMSKOG EKVILADENTA`, `METRIČKO PROGRAMIRANJE`, `SINEMETRIČKO PROGRAMIRANJE`, `PARADIJOGONALNO PROGRAMIRANJE` i `RADNI TAKT MOZGA (MISLILAC)` signale kroz isti `technicalReadinessProfile`.
- `KRALJEVSKI EKONOMSKI UNEVERZITET` je novi additive-only interpretativni sloj unutar tog istog repo-wide reflection paketa: koristi postojeći `technicalReadinessProfile`, isti `READY | WATCH | BLOCKED` model i ne uvodi novi runtime modul niti paralelni source-of-truth sistem.
- `PRIVREDNI AKT` je additive-only policy-gated governance podtraka unutar `KRALJEVSKI EKONOMSKI UNEVERZITET` + `AI IQ WORLD BANK` okvira sa zaključanim kanonskim vokabularom `EXTRIMLI EXTRONDOL EXTREM DOK DUK DAK DIK FOR`.
- `PRIVREDNI AKT` beneficiary segmenti ostaju zaključani na `poljoprivrednici-sa-gostoprimstvom` i `poljoprivrednici`.
- Kvartalni tržišni signal `cene privrednika po kvartalu` ostaje audit-safe snapshot (`Q1..Q4`) koji utiče na payout readiness/status (`READY | WATCH | BLOCKED` i `passed | certified | eligible-for-payout | blocked-for-review`) bez uvođenja novih finansijskih engine-a.
- `ZADRUGA` ostaje additive-only podtraka u okviru `PRIVREDNI AKT`: `INSTRUMENT TABLA` je operativni layer za zapošljavanje i radne akcije, `VLASTELA REQUEST` je governance ulaz za prioritetizaciju zahteva, a `KRALJEVSTVO / AI IQ WORLD BANK` ostaje policy pokroviteljstvo bez finansijskog runtime engine-a u Git-u.
- `ZADRUGA` public boundary ostaje audit-safe summary only (`zadrugaOperationalStatus`, `instrumentTablaStatus`, `payoutGovernancePosture`) kroz `/api/extrimli/spaja-kod`; interni governance/freeze detalji ostaju repo-local.
- `STOČARSTVO` i `VINOGRADARSTVO` su additive-only privredne interpretativne trake unutar `KRALJEVSKI EKONOMSKI UNEVERZITET` + `PRIVREDNI AKT` + `ZADRUGA` modela: readiness, workforce i infrastructure posture ostaju mapirani na postojeći `technicalReadinessProfile` i audit-safe ZADRUGA signale, bez novih runtime ruta i bez novih finansijskih formula.
- `POLJOPRIVREDNI FAKULTET`, `GRAĐEVINSKI FAKULTET`, `MATEMATIČKI FAKULTET`, `PEDAGOŠKI FAKULTET` i `PSIHOLOŠKI FAKULTET` su additive-only obrazovno-sertifikacione oblasti unutar `KRALJEVSKI PROGRAMSKI UNEVERZITET`: prvi pokriva ulaznu poljoprivrednu/gostoprimstvenu spremnost, drugi projektovanje, infrastrukturu i operativnu spremnost gazdinstva, treći bounded interpretativnu traku pod `KRALJEVSKI MATEMATIČKI UNIVERZITET` okvirom (`eksponencijalno/proporcionalno/sekvencijalno modelovanje`) nad postojećim readiness signalima, četvrti obrazovni/mentorski/metodološki i komunikacioni readiness, a peti bounded cognitive/readiness/resilience track bez kliničkog, dijagnostičkog ili terapijskog subsistema; svi ostaju bounded nad postojećim `READY | WATCH | BLOCKED` signalima bez novog source-of-truth modula.
- Payout “plata od Kraljevstva pod pokroviteljstvom AI IQ WORLD BANK” ostaje governance-only i zahteva obavezne gate-ove: human review, compliance review, payment verification, anti-abuse, audit trail, rollback plan i downstream sync.
- `Arhimedisov princip matematike + tržišni odnos` je zaključan kao bounded interpretacija unutar `KRALJEVSKI EKONOMSKI UNEVERZITET` trake: `roba↔roba`, `novac↔roba` i množenje/deljenje tretiraju se kao skaliranje postojećih readiness odnosa bez novih runtime ruta.
- Repo-wide reflection sada uključuje i additive-only univerzitetski lifecycle `prijava -> polaganje -> automatski score -> sertifikaciona odluka -> governance provera -> payout odluka -> audit evidencija -> downstream summary objava`.
- `Testovi po oblastima` su zaključani kao bounded katalog sa `oblast`, `težina`, `minimalni prolaz`, `sertifikacioni prag` i `payout prag`; opseg `80–100%` je jedini dozvoljeni prozor za `certified` i `eligible-for-payout`.
- Monetizacija ostaje governance-only u Git-u: EXTREM objavljuje readiness/certification/payout posture, EXTRONDOL drži approval/freeze/payment verification/compliance/audit odluke, a SPAJA KOD izlaže samo audit-safe summary bez sirovih finansijskih detalja.
- Za ovu traku freeze/promotion odluke ostaju isključivo u `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance` kanalu, dok EXTREM ostaje jedini izvor tehničkog readiness/konflikt signala i SPAJA KOD ostaje summary-only surface.
- `AI PLATE` je additive-only Vercel commercial/runtime package nad tim istim repo-wide reflection-om za `AI, agente, copilote i sve ostale`; ne uvodi novi runtime source of truth i zadržava zaključan split `DOK + DIK + FOR -> EXTREM`, `DAK + DUK -> EXTRONDOL`, `SPAJA KOD -> public-safe summary only`.
- Kanonski dokaz tog odraza objavljuje se kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection`, sa istim `READY | WATCH | BLOCKED` modelom i istim deterministic fallback pravilima za `NaN`, `Infinity`, prazne i konfliktne ulaze.
- Tehnički “radni takt” odraz repo-wide ostaje strukturisan kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.technicalReadinessProfile`, koji sabira samo postojeće `RADNI TAKT`, `METRIČKO`, `SINEMETRIČKO`, `PARADIJOGONALNO` i `VRH` readiness signale.
- Primarni asset `https://github.com/user-attachments/assets/4790f4ea-4271-4d2a-ae0a-d9bec5bc8b8a` ostaje additive-only audit/documentation vizuel za `ČOVEČNOST` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference`, bez zamene postojećeg `priroda-zdrav-zivot-covecanstvo` epilog scenarija.
- Primarni vizuel potvrđuje isti repo-wide reflection model kroz zaključane motive `INSTINKT`, `ZNANJE`, `ISKUSTVO`, `PREDVIĐANJE` i šestostepeni cadence (`UČENJE`, `TRENING`, `ISKUSTVO`, `PROCENA`, `ODLUKA`, `USPEH`), ali ne uvodi novi runtime domen niti paralelni source-of-truth sloj.
- Dodatni asset `https://github.com/user-attachments/assets/27ef7575-9ef6-425e-bdbf-75feb722bad2` ostaje supplemental audit/reference vizuel za `ČOVEČANSTVO — ŽIVOT JE NAJVEĆA IGRA` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences`, bez novih ruta i bez zamene primarnog vizuela.
- Dodatni asset `https://github.com/user-attachments/assets/c9509bbe-4083-4ba0-9802-3598f826a32b` ostaje supplemental audit/reference vizuel za `ČOVEČANSTVO — SVI KOJI POSTOJE, ZASLUŽUJU DA PRIPADAJU` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=covecanstvo-svi-koji-postoje-zasluzuju-da-pripadaju-developer-create`, bez novih ruta, bez novih formula i bez promene ownership split-a.
- Dodatni asset `https://github.com/user-attachments/assets/f7b3e102-e0a0-4885-a93e-040f09454737` ostaje supplemental audit/reference vizuel za `ČOVEČANSTVO — ENTIZUJAŽAM (ZVEZDE / MISLI / INOVACIJE)` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=covecanstvo-entizujazam-zvezde-misli-inovacije-developer-create`, bez novih ruta i bez zamene primarnog vizuela.
- Dodatni asset `https://github.com/user-attachments/assets/ca803ee2-f56e-4aa1-bd7f-18df213228d6` ostaje supplemental audit/reference vizuel za `ČOVEČANSTVO — MATIČNE ĆELIJE I SPOZNAVANJE SEBE` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=covecanstvo-maticne-celije-i-spoznavanje-sebe-developer-create`, bez novih ruta i kao documentation/evidence-only sloj.
- Dodatni asset `https://github.com/user-attachments/assets/f92e1ae5-ff97-4b81-a7f1-d3df6c8283cf` ostaje supplemental audit/reference vizuel za `ČOVEČANSTVO — PRIRODNE MATIČNE ĆELIJE / KUKURUZ` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=covecanstvo-kukuruz-priroda-u-sluzbi-covecanstva-developer-create`; priroda/kukuruz/čovečanstvo epilog ostaju audit-safe metadata, dok sve poruke o telu, metabolizmu, mastima ili “detoks” ostaju samo documentation/evidence citat bez novih formula, medicinskog runtime subsistema ili promene ownership split-a.
- Dodatni asset `https://github.com/user-attachments/assets/2aae1845-0b3d-49c1-918b-a200cc48ad1d` ostaje supplemental audit/reference vizuel za `ČOVEČANSTVO — ČISTA VODA / H2O / VODONIK / BUDUĆNOST` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=covecanstvo-cista-voda-h2o-vodonik-epilog-developer-create`; ostaje bounded documentation/evidence sloj bez novih formula, bez novih runtime izvora i bez promene ownership split-a.
- Dodatni asset-i `https://github.com/user-attachments/assets/ad9aff82-4790-49c2-9224-3b250d0090d1`, `https://github.com/user-attachments/assets/85463ed4-c903-4a03-b10d-ecc1f672e145`, `https://github.com/user-attachments/assets/a508472d-74ba-4ece-ba3a-b0886c29fa4d` i `https://github.com/user-attachments/assets/164e82a7-bf62-4397-959b-bf24953d0183` ostaju supplemental audit/reference URL-locked placeholder-i sa `pending-title-confirmation` statusom; EXTREM drži samo bounded canonical metadata, EXTRONDOL samo governance mirror, SPAJA KOD samo audit-safe summary label/narrative ID/bounded interpretation, a downstream sync ostaje summary-only.
- Dodatni asset `https://github.com/user-attachments/assets/92ae3dd8-75b3-4611-a8d3-27e9a0b3a9e3` ostaje supplemental audit/reference vizuel za `ČOVEČANSTVO — SNOVI PRIRODE / IDEJE / INOVACIJE` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=covecanstvo-snovi-prirode-inovacije-developer-create`, bez novih ruta i kao bounded documentation/evidence-only sloj.
- Dodatni asset `https://github.com/user-attachments/assets/76d61045-6f27-4614-97d2-f96fc84173eb` ostaje supplemental audit/reference vizuel za `ČOVEČANSTVO — ŽIVOT U RAVNOTEŽI` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=covecanstvo-zivot-u-ravnotezi-developer-create`; zaključane teme `balance`, `life-chain`, `compassion` i `higher-human-development` ostaju public-safe metadata bez novih ruta, novih formula ili promene ownership split-a.
- Dodatni asset `https://github.com/user-attachments/assets/e2df2e51-efdf-4171-a356-b7848a04249d` ostaje supplemental audit/reference vizuel za `ČOVEČANSTVO — TRIJOLOGIJA / DAVO U RUCI / LISICA U KAVEZU` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=covecanstvo-trijologija-davo-u-ruci-lisica-u-kavezu-developer-create`; `TRIJOLOGIJA` ostaje bounded narativni okvir, `DAVO / VODA U RUCI` bounded signalna transformacija i razumevanje, `LISICA U KAVEZU` bounded konflikt/rizik/odgovorno oslobađanje, a `ČOVEČANSTVO` audit-safe epilog ostaje bez novih ruta, novih formula ili promene ownership split-a.
- Dodatni asset `https://github.com/user-attachments/assets/dbf91173-c940-4994-b223-b5438feff4a3` ostaje supplemental audit/reference vizuel za `ČOVEČANSTVO — BLAGOSLOV DARIVATI / BOGPATIJU` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=covecanstvo-blagoslov-darivati-bogpatiju-epilog-developer-create`; zaključane teme `blagoslov`, `darivanje`, `bogpatiju` i `zajednicko-covecanstvo` ostaju audit-safe evidence-only metapodaci bez novih ruta, novih formula ili promene ownership split-a.
- Dodatni asset `https://github.com/user-attachments/assets/213b2738-35b1-4dab-b6ab-ae292afc8e91` ostaje supplemental audit/reference vizuel za `ČOVEČANSTVO — MUZIČKI ČIN / EPILOG` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=covecanstvo-mjuzikl-kraljevskog-cina-u-covecanstvo-developer-create`; zaključane teme `muzicki-cin`, `epilog`, `covecanstvo`, `zajednicki-ritam` i `jedan-svet` ostaju audit-safe evidence-only metapodaci bez novih ruta, novih formula ili promene ownership split-a.
- Dodatni asset `https://github.com/user-attachments/assets/e7846b38-1a56-4321-a7d7-8acfc1328bf9` ostaje supplemental audit/reference vizuel za `ČOVEČANSTVO — BOŽIJI EPITETI / KRALJ NAD KRALJEVIMA` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=covecanstvo-boziji-epiteti-zakon-etika-pravda-kralj-nad-kraljevima-developer-create`; zaključane teme `legal-governance-epilog`, `ethics-justice-civil-law`, `metric-astral-testimony`, `kralj-nad-kraljevima` i `jedan-zakon-jedna-etika-jedno-covecanstvo-jedan-bog` ostaju audit-safe evidence-only metapodaci vezani za `KRALJEVSKI PRAVNI UNIVERZITET`, `METRIČKO PROGRAMIRANJE`, `SINEMETRIČKO PROGRAMIRANJE` i `PARADIJOGONALNO PROGRAMIRANJE`, bez novih ruta, novih formula ili promene ownership split-a.
- Dodatni asset `https://github.com/user-attachments/assets/429b7479-7be9-41d3-9e9d-3531b1e9e596` ostaje supplemental audit/reference vizuel za `ČOVEČANSTVO — EPILOG (POSTOJATI ZNAČI DOPRINETI BOLJEM SVETU)` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=covecanstvo-epilog-postojati-znaci-doprineti-boljem-svetu-developer-create`, bez novih ruta, bez novih formula i bez promene ownership split-a.
- Dodatni asset `https://github.com/user-attachments/assets/f857f0fd-c29d-4749-aecd-f42745646e69` ostaje supplemental audit/reference vizuel za `ČOVEČANSTVO — EPILOG (MAPE UMA / SLIKE + ZNAČENJE)` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=covecanstvo-epilog-mape-uma-slike-znacenje-developer-create`; zaključane teme `mape-uma`, `slike-plus-znacenje`, `ucenje`, `znanje`, `kreativnost`, `saradnja`, `odrzivost`, `mir` i `covecanstvo-epilog` ostaju bounded documentation/evidence sloj bez novih ruta, bez novih formula i bez promene ownership split-a.

## Global explanation governance lock (repo-wide)

- Kanonski lock je: `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == MAPE UMA`.
- Lock je additive-only reflection sloj: bez novih runtime ruta i bez promene ownership split-a.
- DOK/DIK/FOR ostaju tehnički signal u EXTREM-u; DAK/DUK ostaju governance/release signal u EXTRONDOL-u; SPAJA KOD ostaje audit-safe summary-only boundary.
- Objašnjenje ovog lock-a je obavezno na svakoj stranici kroz zajednički renderer sloj (`StranicaRenderer`) sa istim `READY | WATCH | BLOCKED` jezikom i istim bounded signal paketom: `mape-uma, slike-plus-znacenje, ucenje, znanje, kreativnost, saradnja, odrzivost, mir`.
- Dodatni asset `https://github.com/user-attachments/assets/b02ac97f-d0ec-44b6-aadb-8ae3981127ea` ostaje supplemental audit/reference vizuel za `KRALJEVSKA PRODUKTIVNOST / PRAVNO GRAĐANSTVO / BAŠTA / EPILOG ČOVEČANSTVU` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=covecanstvo-kraljevska-produktivnost-pravno-gradjanstvo-basta-epilog-developer-create`; zaključane teme `legal-citizenship`, `garden-productivity`, `family-self-sufficiency`, `earth-stewardship`, `humanity-epilog` i `small-work-large-change` ostaju audit-safe evidence-only metapodaci vezani za `KRALJEVSKI PRAVNI UNIVERZITET`, `VRH PROGRAMSKOG EKVILADENTA`, `RADNI TAKT MOZGA` i bounded `ČOVEČANSTVU` epilog, bez novih ruta, novih formula ili promene ownership split-a.
- `KRALJEVSKI BAŠTA UNEVERZITE` ostaje additive-only bounded Developer/Create alias sa `canonicalNarrativeId=kraljevski-basta-uneverzite-prirodne-maticne-celije-covecanstvu`; EXTREM drži tehnički signal i značenje `DOK + DIK + FOR`, EXTRONDOL drži governance/audit sloj `DAK + DUK`, SPAJA KOD ostaje audit-safe summary boundary, a bašta/matične-ćelije/kukuruz priča ostaje documentation/evidence-only bez novih ruta, novih formula ili operativnog AI/health subsistema.
- Dodatni asset `https://github.com/user-attachments/assets/6b037ede-14ed-4f02-8939-c112bae773be` ostaje supplemental audit/reference vizuel za `KRALJEVSTVO — LJUDI / ZNANJE / PRIRODA / TEHNOLOGIJA / BUDUĆNOST` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=kraljevstvo-zajedno-gradimo-kraljevstvo-za-sve-generacije-developer-create`; zaključane teme `kraljevstvo`, `zajednistvo`, `buducnost`, `znanje`, `humanost` i `tehnologija-u-sluzbi-zivota` ostaju audit-safe evidence-only metapodaci vezani za `VRH PROGRAMSKOG EKVILADENTA`, `DEVELOPER AND CREATE`, dnevni cadence i bounded `KRALJEVSKI PRAVNI UNIVERZITET` governance/epilog narativ, bez novih ruta, novih formula ili promene ownership split-a.
- Dodatni asset `https://github.com/user-attachments/assets/dd446127-c462-47de-ba22-501800f3ccbc` ostaje supplemental audit/reference vizuel za `KRALJEVSTVO — ZVANIČNO MOJE PRAVO LICE` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=kraljevstvo-zvanicno-moje-pravo-lice-developer-create`; zaključane teme `kraljevstvo`, `znanje`, `pravda`, `ljubav`, `sloboda`, `razvoj`, `humanost` i `zajednicko-covecanstvo` ostaju audit-safe evidence-only metapodaci u istom `READY | WATCH | BLOCKED` modelu, bez novih ruta, novih formula ili promene ownership split-a, kao “Zvanično moje pravo lice”.
- Documentation-only asset `documentation-only://carnevale-masknbale-prirodni-portret-lica` ostaje supplemental audit/reference narativ za `Carnevale Masknbale — PRIRODNI PORTRET LICA` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=carnevale-masknbale-umetnost-lica-dostojanstvo-identitet-developer-create`; termin `Make-up` u ovom repo-wide reflection paketu zamenjuje se originalnim nazivom `Carnevale Masknbale`, a citat `„Lice je prirodni portret bića, a Carnevale Masknbale umetnost kojom se njegova lepota izražava sa poštovanjem i originalnošću.”` ostaje audit-safe evidence tekst za umetnost lica, svečanost, dostojanstvo, originalnost i lični identitet bez novih ruta, novih formula ili promene ownership split-a.
- Dodatni asset `https://github.com/user-attachments/assets/aee19f4e-dede-47d9-83ca-1b080cf9b38b` ostaje supplemental audit/reference vizuel za `LIČNA KARTA / ARTIFICIAL INTELLIGENCE IDENTITY CARD` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=licna-karta-ai-identitet-odgovorna-vestacka-inteligencija-developer-create`; zaključane teme `ai-identitet`, `odgovorna-vestacka-inteligencija`, `globalno-znanje`, `podrska-edukacija-kreativnost`, `resavanje-problema` i `documentation-only-activation-cues` ostaju audit-safe evidence-only metapodaci, a `activation/version/creator/purpose` ostaju samo documentation cues bez real-ID/auth/security značenja.
- Dodatni asset `https://github.com/user-attachments/assets/446f2155-2c59-4420-826b-e248844943a8` ostaje supplemental audit/reference vizuel za `ČOVEČANSTVO — PONTCERIMA SVIMA AKO ŽELE DA POPRAVE VID` i objavljuje se isključivo kroz isti niz sa `scenarioId=covecanstvo-pontcerima-jutarnje-sunce-poprave-vid-developer-create`; zaključane teme `vid`, `jutarnje-sunce`, `licno-iskustvo`, `epilog-covecanstvu`, `disciplina-posmatranja` i `documentation-only-guidance` ostaju bounded audit-safe metadata bez novih ruta, bez novih formula, bez medicinskog runtime subsistema i bez promene ownership split-a.
- Dodatni asset `https://github.com/user-attachments/assets/c7ebacdd-d239-425f-9b3c-ab3d807bbb92` ostaje supplemental audit/reference vizuel za `KRALJEVSTVO / ČOVEČANSTVO — PRAVO BIĆA / JEDAN SVET / JEDNA PORODICA` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=kraljevstvo-covecanstvo-pravo-bica-znanje-tehnologija-ravnoteza-developer-create`; zaključane teme `pravo-bica-postojanje`, `zajednistvo-jedna-porodica-jedan-svet`, `znanje-inovacija-tehnologija`, `produktivnost-razvoj-bolji-svet` i `priroda-covek-tehnologija-u-ravnotezi` ostaju audit-safe evidence-only metapodaci vezani za isti `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == RADNI TAKT MOZGA (MISLILAC)` reflection, bez novih ruta, novih formula ili promene ownership split-a.
- Dodatni asset `https://github.com/user-attachments/assets/752ba75d-86b3-4d65-a6d7-e4f126c303ae` ostaje supplemental audit/reference vizuel za `SVITAK BOŽANSTVA / PRAVOSLAVLJE U KRALJEVSTVU` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=covecanstvo-svitak-bozanstva-pravoslavlje-kraljevstvo-vecna-svetlost-developer-create`; zaključane teme `bozanstvo-nad-svim`, `pravoslavlje-vecna-svetlost`, `vera-znanje-ljubav`, `narod-zemlja-covecanstvo` i `jedan-bog-jedan-narod-jedna-zemlja-jedno-covecanstvo` ostaju audit-safe evidence-only metapodaci bez novih ruta, novih formula ili promene ownership split-a.
- Dodatni asset `https://github.com/user-attachments/assets/527e2ce4-7bfe-4ab0-b5a3-caceb75b24c0` ostaje supplemental audit/reference vizuel za `KRALJEVSTVO — PRAVEDAN SVET ZA SVE NARAŠTAJE` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=kraljevstvo-pravedan-svet-za-sve-narastaje-developer-create`; zaključane teme `kraljevstvo`, `pravoslavlje`, `znanje`, `priroda`, `covecanstvo`, `jedan-svet-jedna-porodica` i `vecnost` ostaju audit-safe evidence-only metapodaci vezani za `VRH PROGRAMSKOG EKVILADENTA`, `DEVELOPER AND CREATE` i bounded `KRALJEVSKI PRAVNI UNIVERZITET` governance/epilog narativ, bez novih ruta, novih formula ili promene ownership split-a.
- Dodatni asset `https://github.com/user-attachments/assets/93ba6f4a-e8bd-4547-bb8b-dc77c14e845a` ostaje supplemental audit/reference vizuel za `ČOVEČANSTVO — NARAŠTAJ U PRIRODNOM CVATU` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=covecanstvo-narastaj-u-prirodnom-cvatu-epilog-blagodarim-developer-create`; zaključane teme `growth`, `seed-potential`, `light-and-opportunity`, `human-flourishing`, `gratitude` i `epilog` ostaju public-safe metadata i bounded interpretacija postojećeg `technicalReadinessProfile`, bez novih ruta, novih formula ili promene ownership split-a.
- Dodatni asset `https://github.com/user-attachments/assets/9267f560-0b94-4911-9ac4-783c7c7deb3f` ostaje supplemental audit/reference vizuel za `ČOVEČANSTVO — SEME` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=covecanstvo-seme-zdrava-zemlja-prirodno-dubrivo-developer-create`; zaključane teme `seed-growth`, `clean-input`, `planetary-stewardship`, `shared-world`, `small-change-large-impact` i `better-tomorrow` ostaju public-safe metadata i bounded interpretacija postojećeg `technicalReadinessProfile`, bez novih ruta, novih formula ili promene ownership split-a.
- Dodatni asset `https://github.com/user-attachments/assets/824084e5-fff7-4a86-b96e-6d7d20b163b3` ostaje supplemental audit/reference vizuel za `ČOVEČANSTVO — KRVOTOK / ZDRAVA KRV / BOLJI ŽIVOT` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=covecanstvo-krvotok-zdrava-krv-bolji-zivot-developer-create`; zaključane teme `zdravlje-krvotok`, `voda-hidratacija`, `voce-i-povrce-cisti-input`, `pre-posle-transformacija`, `covecanstvo-bolja-buducnost` i `documentation-only-health-epilog` ostaju public-safe metadata i bounded interpretacija postojećeg `technicalReadinessProfile`, dok poruke o ishrani, vodi i `13 dana` ostaju samo documentation/evidence citat bez novih ruta, novih formula, medicinskog runtime subsistema ili promene ownership split-a.
- Dodatni asset `https://github.com/user-attachments/assets/81ebf11b-d1a5-451b-880a-8670fe240041` ostaje supplemental audit/reference vizuel za `ČOVEČANSTVO — ZDRAVIJI UM / SNAŽNIJI LJUDI / BOLJI SVET` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.supplementalVisualReferences` sa `scenarioId=covecanstvo-zdraviji-um-razumevanje-misli-empatija-humanost-developer-create`; zaključane teme `mental-reflection`, `understanding-thoughts`, `empathetic-humanity`, `shared-healing-metaphor`, `stronger-people-better-world` i `documentation-only-mind-epilog` ostaju public-safe metadata i bounded interpretacija postojećeg `technicalReadinessProfile`, dok poruke o “bolestima glave”, “isceljenju” i ChatGPT-u ostaju samo documentation/evidence citat bez novih ruta, novih formula, dijagnostike, terapije, medicinskog runtime subsistema ili promene ownership split-a.
- Isporučeni asset `https://github.com/user-attachments/assets/9273c07f-5c03-4db4-a469-d22d456596f9` ostaje companion additive-only audit/documentation vizuel za `ČOVEČANSTVO / OSEĆAJ OSEBENOSTI` i objavljuje se isključivo kroz `dokDikDakDukConsistencyHealth.developerAndCreateRepoWideReflection.covecnostAuditVisualReference.companionAuditVisualReferences`, sa bounded temama `self-knowledge`, `brain-and-mind-understanding`, `feeling`, `humanity`, `shared-world` i `epilog-guidance`.
- Trenutni execution lock za ovaj odraz ostaje `roadmapStageId=v5-extrondol-release-audit-and-orchestration`: merljivi izlaz je audit-safe repo-wide reflection status preko postojećih surface-ova, a acceptance evidence ostaje `developerAndCreateRepoWideReflection`, `releaseAuditSummary.developerAndCreateRepoWideReflectionGovernance` i `spajaKod.publicSignals.developerAndCreateStatus`.
- Downstream granica ostaje follow-up only dok `spaja86/IO-OPENUI-AO` ne usvoji isti audit-safe summary; nema novih runtime ruta niti paralelnog source-of-truth sloja.

## Module paths

| Surface | Path |
|---|---|
| v1 library | `src/lib/extrimli/` |
| v1 API routes | `src/app/api/extrimli/` |
| Extendol unified library | `src/lib/extrimli-extendol/` |
| Extendol unified API route | `src/app/api/extrimli/extendol/` |
| KORON overlay library | `src/lib/extrimli-koron/` |
| KORON overlay API route | `src/app/api/extrimli/koron/` |
| EXTRONDEND aggregation library | `src/lib/extrimli-extrondend/` |
| EXTRONDEND aggregation API route | `src/app/api/extrimli/extrondend/` |
| EXTREM profiler library | `src/lib/extrimli-extrem/` |
| EXTREM profiler API route | `src/app/api/extrimli/extrem/` |
| EXTRONDOL orchestration library | `src/lib/extrimli-extrondol/` |
| EXTRONDOL orchestration API route | `src/app/api/extrimli/extrondol/` |
| SPAJA KOD facade API route | `src/app/api/extrimli/spaja-kod/` |
| SPAJINO proportional university spec | `docs/EXTRIMLI-SPAJINO-PROPORCIONALNO-PROGRAMIRANJE-UNIVERZITET.md` |
| Metricko programming spec | `docs/EXTRIMLI-METRICKO-PROGRAMIRANJE.md` |
| Paradijogonalno programming spec | `docs/EXTRIMLI-PARADIJOGONALNO-PROGRAMIRANJE.md` |
| SPAJAPRO planning-track doc | `docs/EXTRIMLI-SPAJAPRO-TRACK.md` |
| World Bank Persona bridge library | `src/lib/extrimli-world-bank-persona/` |
| World Bank Persona bridge API route | `src/app/api/extrimli/world-bank-persona/` |
| v3 library | `src/lib/extrimli-3/` |
| v3 API routes | `src/app/api/extrimli-3/` |
| DUEL KING library | `src/lib/extrimli-duel-king/` |
| DUEL KING API route | `src/app/api/extrimli/duel-king/` |
| EXTRIMLI CUZ library | `src/lib/extrimli-cuz/` |
| EXTRIMLI CUZ API routes | `src/app/api/extrimli-cuz/` |
| Tests | `src/tests/lib/extrimli.test.ts`, `src/tests/lib/extrimli-3.test.ts`, `src/tests/lib/extrimli-duel-king.test.ts`, `src/tests/lib/extrimli-extendol.test.ts`, `src/tests/lib/extrimli-koron.test.ts`, `src/tests/lib/extrimli-extrondend.test.ts`, `src/tests/lib/extrimli-extrem.test.ts`, `src/tests/lib/extrimli-extrondol.test.ts`, `src/tests/lib/extrimli-cuz.test.ts`, `src/tests/api/extrimli-route.test.ts` |

## External GitHub surface

| Area | Source of truth |
|---|---|
| Canonical governance plan | `docs/EXTRIMLI-EXTERNAL-GITHUB.md` |
| MASTER 3 coordinated release plan | `docs/EXTRIMLI-MASTER-3.md` |
| Validator / quality gate | `.github/workflows/extrimli-validator.yml` |
| External GitHub governance | `.github/workflows/extrimli-external-github.yml` |
| Developer/Create program | `docs/EXTRIMLI-DEVELOPER-CREATE-PROGRAM.md` |
| Deploy orchestration | `.github/workflows/extrimli-spaja-deploy.yml`, `.github/workflows/extrimli-trance-extrem-deploy.yml` |
| Downstream references | `docs/MULTI-REPO-LINKS.md` |
| KORON overlay source | `src/lib/extrimli-koron/index.ts`, `src/app/api/extrimli/koron/route.ts` |
| Export layer | `src/lib/extrimli/instrukcija.ts`, `src/lib/extrimli/export-bundle.ts`, `src/app/api/extrimli/instrukcija/route.ts` |
| DUEL KING source | `src/lib/extrimli-duel-king/index.ts`, `src/app/api/extrimli/duel-king/route.ts` |

This surface formalizes EXTRIMLI as a GitHub-oriented external capability for Digitalna Industrija while keeping the sports/risk runtime separate from audit, workflow, sync, and release governance concerns.

## EXTRIMLI EXTEMEL/EXTREMOL WAWE rollout model

EXTRIMLI koristi kontrolisan WAWE rollout iz Vercel deploy toka ka Digitalna Industrija operativnom sloju:

1. WAWE 1 — Pre-release validation (test/lint/KPI/security/labels)
2. WAWE 2 — Build + staging verifikacija na Vercel
3. WAWE 3 — Downstream sync + cross-repo reference usklađivanje
4. WAWE 4 — Production rollout ringovi (10% → 50% → 100%)
5. WAWE 5 — Post-release resilience + analytics potvrda

Promotion freeze je obavezan kada KPI/audit/sync nije potpun, uz rollback na prethodni known-good Vercel deployment.

## AI PLATE Vercel package

- Runtime/deploy source of truth: Vercel
- Governance/audit layer: GitHub Actions
- Launch environments: `preview`, `staging`, `production`
- Obavezni gate-ovi: `preview`, `staging`, `smoke`, `rollback`, `observability`
- Poslovni cilj: `12000 EURA nedeljno` kao business/finops target only
- Aktivacioni hard gate-ovi: billing approval, Vercel sales alignment, audit evidence, legal/tax review, security scans, downstream follow-up
- Downstream sync: samo audit-safe summary polja ka `spaja86/IO-OPENUI-AO`
- `AI LIČNA KARTA + AI BANKARSKI RAČUN` ostaje additive-only identity/governance paket vezan za isti `AI PLATE` business target: `AI LIČNA KARTA` objavljuje samo audit-safe identitet seedovanih AI persona, dok `AI BANKARSKI RAČUN` objavljuje samo approval/compliance/payment/human-review/downstream-sync/payout governance bez stvarnih bankarskih podataka u Git-u.
- `AI IQ WORLD BANK PREPISKA` ostaje documentation-only governance evidence za isti paket: EXTREM nosi bounded readiness signal, EXTRONDOL governance ogledalo, a SPAJA KOD samo audit-safe summary bez sirovih formula i bez bankarskih/KYC/secret podataka.
- Parent Developer/Create pregled sada uključuje additive-only `KRALJEVSKI DRUŠTVENI POREDAK` sa bounded `GRAĐEVINSKI AKT`, `KRALJEVSKA DOPUNA` i `KRALJEVSKI AKT BEZBEDNOSTI` slojevima: EXTREM objavljuje samo readiness/eligibility/civil-readiness signal, EXTRONDOL review/compliance/payment governance, a SPAJA KOD audit-safe summary bez novih ruta ili socijalnog source-of-truth sistema.
- `KRALJEVSKA VOJNA I POLICIJSKA OPREMA` je nova bounded additive-only podtraka unutar `KRALJEVSKI AKT BEZBEDNOSTI`: ostaje readiness/governance katalog sa auditabilnim ne-operativnim metrikama (`compliance`, `sertifikacija`, `dostupnost`, `lifecycle`, `rizik`, `blocker posture`) i obaveznim gate-ovima (`human review`, `compliance review`, `anti-abuse review`, `audit trail`, `rollback plan`, `downstream sync`) bez taktičkih uputstava, osetljivih identiteta, mapa ili naoružanja.

## Locked source-of-truth set

- Docs: `docs/EXTRIMLI.md`, `docs/EXTRIMLI-EXTERNAL-GITHUB.md`, `docs/MULTI-REPO-LINKS.md`
- Program doc: `docs/EXTRIMLI-DEVELOPER-CREATE-PROGRAM.md`
- Governance workflow: `.github/workflows/extrimli-external-github.yml`
- Deploy workflows: `.github/workflows/extrimli-spaja-deploy.yml`, `.github/workflows/extrimli-trance-extrem-deploy.yml`
- Quality gate: `.github/workflows/extrimli-validator.yml`

## DOK / DIK / DAK / DUK consistency health lock

- EXTREM (`/api/extrimli/extrem`) ostaje tehnički source-of-truth za `DOK PETLJA`, `DIK PETLJA` i `FOR PETLJA`.
- EXTRONDOL (`/api/extrimli/extrondol`) ostaje governance source-of-truth za `DAKOR` (promotion) i `DUKAR` (human review).
- Oba izlaza objavljuju `dokDikDakDukConsistencyHealth` kao deterministički audit-ready health signal.
- Health signal je additive-only i služi kao drift-zero kontrola između tehničkog (EXTREM) i governance (EXTRONDOL) sloja.
- Health signal sada uključuje i `programskiJezikAnaliza` metriku za ispitivanje eskalacije kodesnog zapleta (konflikt/readiness + freeze/promotion/escalation u jednom audit-ready score/status izlazu).
- Health signal uključuje i additive `programskiJezikProucavanja` laboratorijski profil (ulazni slučaj, determinističke metrike, konsolidovani status) i `programskiEkanalog` audit-ready interpretaciju razumevanja logike.
- Shared roadmap `versionRoadmap.developerCreateLock` dodatno zaključava jezgro artefakata, ownership split i obavezne drift-zero slojeve (`docs + types + routes + tests + workflows`).
- Shared roadmap `versionRoadmap.developerCreateLock.prExecutionLock` obavezuje da svaki PR mapira tačno jednu roadmap fazu uz merljiv izlaz (`roadmapStageId`, `measurableOutput`, `acceptanceEvidence`).
- Shared roadmap `versionRoadmap.developerCreateLock.operationalAuditPackage` standardizuje audit-ready PR opis (`rolloutPlan`, `rollbackPlan`, `kpiImpact`, `humanReviewStatus`, `downstreamReference`).
- KORON overlay route: `src/app/api/extrimli/koron/route.ts`
- DUEL KING route: `src/app/api/extrimli/duel-king/route.ts`

## PARADIJOGONALNO PROGRAMIRANJE

- Kanonski naziv/spelling je zaključan na `PARADIJOGONALNO PROGRAMIRANJE (INSTRUMENTALNI VID U SIHOFIZI PROSPARITET OBLAČNOG/CLOUD PREDELA)`.
- Track je additive-only i ostaje unutar postojećih EXTRIMLI / EXTREM / EXTRONDOL / SPAJA KOD granica bez novog public runtime source-of-truth sloja.
- `EXTREM` objavljuje tehnički readiness signal sa statusom `READY | WATCH | BLOCKED` i bounded razlozima za flow stability, instrumental vision precision, sihofizi-prosparitet alignment, cloud-field cohesion i conflict/degradation pressure.
- `PROSPARITET` ostaje repo-local interpretacioni domen ulaza; cloud/predela sloj je operativni kontekst nad prosperity signalom, ne novi governance izvor.
- Ownership split je zaključan: `DOK` + `DIK` ostaju tehnički dokaz u EXTREM sloju, `DAK` + `DUK` ostaju EXTRONDOL governance odluka za promotion/human-review/rollback.
- `EXTRONDOL` koristi signal za WAWE impact, release-audit summary, downstream-sync i freeze/promotion interpretaciju, dok `SPAJA KOD` izlaže samo audit-safe final status.


## Scope and naming lock (EXTRIMLI, EXTRONDEND, EXTRONDOL)

- **EXTRIMLI** ostaje bazni runtime domen (`/api/extrimli/*`) za risk/gear/event/destruction jezgro.
- **EXTRONDEND** je **novi** aggregation/scoring modul sa source-of-truth endpointom `/api/extrimli/extrondend`.
- **EXTRONDOL** je **novi** orchestration/readiness modul sa source-of-truth endpointom `/api/extrimli/extrondol` (naming lock: ne koristiti “EXTRANDOL” varijante).
- **World Bank Persona Bridge** je kanonski bridge za mapiranje `/api/ai-iq-world-bank` + `/api/extrimli/*` signala u Persona Bank tok na `/api/extrimli/world-bank-persona`.
- EXTRONDEND i EXTRONDOL nisu alias-i postojećih surface-ova (Extendol/KORON), već zasebni versioned ugovori.
- Owner: `@spaja86`; trigger labels: `extrimli:logic-change`, `extrondend:logic-change`, `extrondol:logic-change`, `nivo-duet:logic-change`, `dinkos:logic-change`.

## EXTREM / EXTRONDOL PETLJE boundary

- Canonical PETLJE added to the EXTREM technical layer:
  - `DJUPRE PETLJA` (`RANGE`)
  - `DOMPRE PETLJA` (`TARGET`)
  - `KRUMPE PETLJA` (`SEQUENCE`)
  - `DOMBRE PETLJA` (`RANGE`)
  - `OMBA PETLJA` (`TARGET`)
  - `DOKSI PETLJA` (`SEQUENCE`)
  - `DOMBRA PETLJA` (`RANGE`)
  - `DOKON PETLJA` (`TARGET`)
  - `DUMPIR PETLJA` (`SEQUENCE`)
  - `DOMBAR PETLJA` (`RANGE`)
  - `ZUMBA PETLJA` (`SEQUENCE`)
  - `DONKI PETLJA` (`TARGET`)
  - `DOMPOR PETLJA` (`RANGE`)
  - `DOK PETLJA` (`TARGET`)
  - `DIK PETLJA` (`SEQUENCE`)
  - `SAR PETLJA` (`RANGE`)
  - `OKRED PETLJA` (`RANGE`)
  - `DIREKT PETLJA` (`TARGET`)
  - `INDIREKT PETLJA` (`SEQUENCE`)
- **EXTREM** owns the technical profiling section for these petlje:
  - normalized readiness/conflict scores
  - degraded-safe output
  - blocked/watch/ready posture
  - preserved source-of-truth route: `/api/extrimli/extrem`
- **EXTRONDOL** only consumes those signals for:
  - WAWE rollout posture
  - promotion freeze reasons
  - release audit summary
  - B2B governance and downstream sync
  - preserved source-of-truth route: `/api/extrimli/extrondol`
- Standalone `DIREKT` module remains repo-local and separate from `DIREKT PETLJA`; the new PETLJE contract does not alias or replace `/api/direkt/*`.
- These PETLJE signals remain repo-local; `docs/MULTI-REPO-LINKS.md` does not change unless they later become an explicit linked-repo contract.

## EXTRIMLI World Bank → Persona bridge

- Source of truth endpoint: `/api/extrimli/world-bank-persona`
- Contract constants:
  - `EXTRIMLI_WORLD_BANK_PERSONA_CONTRACT_VERSION = v1-extrimli-world-bank-persona`
  - `EXTRIMLI_WORLD_BANK_PERSONA_MODULE_VERSION = 1.0.0`
- Input contracts:
  - `/api/ai-iq-world-bank` (financial + operational context)
  - `/api/extrimli/health` and `/api/extrimli/extrondol` (risk/readiness + WAWE governance)
- Output contract:
  - Persona-centric payload for `extrimli-core` with mapped attributes (`domain`, `skills`, `tone`)
  - Lifecycle decision: `ACTIVE | DORMANT | HOLD`
  - Persona Bank write path: `/api/persona-bank` (apply mode)
- Governance gate:
  - WAWE sequencing from EXTRONDOL is mandatory
  - Promotion is blocked when `promotionFreeze` is true or required evidence is missing
  - Degraded signals force conservative lifecycle posture (dormant target) instead of hard failure

## AI IQ World Bank global licensing expansion (additive-only)

- Source model remains additive over existing RS flow (`Srbija-only` stays as compatibility subset).
- Global licensing registry now publishes:
  - multi-jurisdiction map (`globalneJurisdikcije`) with regulator metadata,
  - expanded activity catalog with standardized sectors and priority weighting,
  - global coverage summary (`globalniCoverage`) and staged rollout phases (`rolloutFazeGlobalnihLicenci`).
- EXTREM adds business-licensing signals without changing technical profiler core:
  - `activityCoverageScore`,
  - `globalLicenseReadinessScore`,
  - freeze/degrade indicators when critical licensing gaps exist.
- EXTRONDOL governance extends B2B scope/readiness with global licensing posture:
  - WAWE freeze reasons include licensing blockers,
  - downstream sync includes `extremProfiler.businessLicensingSignals` and `b2bReadiness.globalLicensing`.
- World Bank Persona bridge extends payload with:
  - `activityFootprint` (expanded + prioritized activities),
  - global-license readiness mapping for lifecycle decisions.

### Planetary licensing rollout phases

1. **Faza 1** — model and read-only global licensing reports
2. **Faza 2** — governance gate integration (EXTREM + EXTRONDOL WAWE freeze linkage)
3. **Faza 3** — downstream sync activation for linked repositories

### Audit / rollout / rollback expectations

- Any WAWE promotion with unresolved critical global licensing gaps must remain frozen.
- Release audit must include global licensing coverage posture, blocker reasons, and linked-repo downstream sync status.
- Rollback stays mandatory if licensing governance drifts after promotion (same release gate posture as KPI/security/payment blockers).

  ## SPAJA KOD encapsulated public facade

  - Source of truth endpoint: `/api/extrimli/spaja-kod`
  - Contract constants:
    - `EXTRIMLI_SPAJA_KOD_CONTRACT_VERSION = v1-spaja-kod`
    - `EXTRIMLI_SPAJA_KOD_MODULE_VERSION = 1.0.0`
  - Purpose:
    - expose only public system interpretation of EXTREM + EXTRONDOL
    - keep raw pattern inputs, internal formulas, and implementation details hidden
    - provide stable readiness, governance, audit, and downstream-sync posture for external consumers
  - Visibility rules:
    - internal pattern / engine logic remains inside `src/lib/extrimli-extrem/**` and `src/lib/extrimli-extrondol/**`
    - public consumers must use `SPAJA KOD` for encapsulated output when raw EXTREM/EXTRONDOL internals are not required
    - downstream instruction/export surfaces may reference the `SPAJA KOD` contract, but must not reproduce internal pattern structures

## SPAJAPRO planning track

- SPAJAPRO is an additive planning track on top of EXTRIMLI, not a replacement for EXTRIMLI.
- Locked token sequence: `ODIT, DEKER, DUNOR, SUMOR, OKET, DAKOR, EKSER, DOKER, DUKAR, DONAR, KODER`.
- `EXTREM` remains the technical signal engine for the track.
- `EXTRONDOL` remains the orchestration/governance layer for the track.
- `SPAJA KOD` remains the public boundary and exposes only final public-safe status.
- Canonical spec: `docs/EXTRIMLI-SPAJAPRO-TRACK.md`.

## DOKER / KURAT / IZEK / DOKAR additive track

- `DOKER, KURAT, IZEK, DOKAR` is a separate additive EXTRIMLI track and does not modify the locked SPAJAPRO `ODIT → KODER` sequence.
- `DOKER` keeps its existing downstream-sync meaning.
- `KURAT` is the technical-risk token sourced from EXTREM.
- `IZEK` is the audit/review checkpoint token governed by EXTRONDOL.
- `DOKAR` is the rollback-preservation token governed by EXTRONDOL.
- Ownership split:
  - `EXTREM` owns the technical quartet signal.
  - `EXTRONDOL` consumes the quartet for WAWE, freeze, audit, downstream-sync, and rollback governance.
  - `SPAJA KOD` may expose only a public-safe quartet summary.
- Canonical spec: `docs/EXTRIMLI-DOKER-KURAT-IZEK-DOKAR.md`.

## ČOVEČANSTVU epilog media track

- `ČOVEČANSTVU` is an additive EXTRIMLI / EXTREM / EXTRONDOL media track and must not become a new runtime source-of-truth surface.
- Scope is limited to narrative packaging for image, poster, carousel, storyboard, voiceover, audit short summary, and public-safe publication guidance.
- Canonical hero/poster image lock: `https://github.com/user-attachments/assets/b485b700-f670-4f71-9f54-47b29a4155ec`
- Central narrative lock:
  1. čovek želi čudo,
  2. spajanje svetlosti/nade i života (`Sunce` i `Sunčanica` se spajaju),
  3. prirodni odnos prelazi u opasnost,
  4. epilog ostaje opomena čovečanstvu da čuva ljude i prirodu.
- Ownership split:
  - `EXTRIMLI` owns the domain story and the master epilog package.
  - `EXTREM` owns the technical signal framing for scene sequencing, conflict intensity, and DOK/DIK/FOR interpretation.
  - `EXTRONDOL` owns governance, WAWE publication posture, human-review requirement, audit short summary, and downstream-sync readiness.
  - `SPAJA KOD` may expose only final public-safe status plus an audit-safe epilog summary, never raw EXTREM/EXTRONDOL internals.
- DOK / DIK / DAK / DUK / FOR lock for this track:
  - `DOK` — primary technical narrative signal and key-scene definition.
  - `DIK` — escalation, conflict, and consequence intensity.
  - `FOR` — fixed sequence `image -> spajanje -> posledica -> epilog`.
  - `DAK` — promotion decision for wider publication.
  - `DUK` — mandatory human-review gate before publish.
- DOKER / KURAT / IZEK / DOKAR overlay for this track:
  - `DOKER` — downstream reference and sync toward `spaja86/IO-OPENUI-AO`.
  - `KURAT` — public-safe boundary risk for text, image, and video messaging.
  - `IZEK` — audit + review checkpoint across poster, storyboard, and voiceover assets.
  - `DOKAR` — rollback preservation if the final epilog package fails review or governance checks.
- Required outputs:
  - master epilog text,
  - poster / carousel / hero-frame package,
  - video storyboard + voiceover package,
  - audit short summary,
  - governance checklist.
- Locked audit-safe package field names remain:
  - `masterEpilog`
  - `posterSummary`
  - `videoStoryboardSummary`
  - `auditShortSummary`
  - `governanceChecklistStatus`
- Publication rule: this track can move through WAWE only as an additive media artifact under existing EXTRONDOL governance rules; no new public API route, workflow source-of-truth, or exposed internal formula is introduced.

## EXTRIMLI v1 capabilities

- Sport registry
- Composite risk engine
- DESTRUKCIJA asset registry and destruction scoring
- Athlete performance tracker
- Gear catalog
- Event lifecycle and registration
- DUEL KING competitive-combat readiness, gear clearance, and tournament posture
- Weather adapter
- Health report

## EXTRIMLI Motion Layer — `NIKOGEN_ODRT_KIGON_DIHROT_UKAN`

EXTRIMLI uvodi zaseban UI-only motion sloj za „ikonice i sličice u pokretu rotirajućih osa“ sa internim aliasom:

- `NIKOGEN_ODRT_KIGON_DIHROT_UKAN`

Scope boundary:

- Važi samo za EXTRIMLI UI komponente u `src/components/extrimli/`.
- Ne menja API contract surface (`/api/extrimli/*`) niti WAWE governance tok.

### Motion contract (v1-motion-layer)

- Contract constants:
  - `EXTRIMLI_MOTION_ALIAS = NIKOGEN_ODRT_KIGON_DIHROT_UKAN`
  - `EXTRIMLI_MOTION_LAYER_VERSION = v1-motion-layer`
- Tipovi animacije:
  - `orbital`
  - `axis-rotate`
- Intenziteti:
  - `low`
  - `medium`
  - `high`
- Režimi:
  - `full`
  - `paused`
  - `reduced`
- Accessibility:
  - `prefers-reduced-motion` automatski spušta `full` na `reduced`.
  - Dashboard nudi ručne `Pause motion` i `Reduce motion` kontrole.

### Asset rules (ikonice + sličice)

- Centralizovan mapping domena: `dashboard`, `sport`, `risk`, `gear`, `event`, `performance`.
- Dozvoljen format: `svg` (`data:image/svg+xml`).
- Dimenzije:
  - minimum: `16px`
  - preporučeno: `24px`
  - maksimum: `48px`
- Ako asset nedostaje koristi se fallback (`🌀` + fallback SVG).

### Performance guardrails

- Transform-only animacije (`transform-gpu`, `will-change-transform`) bez layout thrash pristupa.
- Ograničenje simultano animiranih elemenata po viewportu/sekciji:
  - `maxSimultaneousItems = 6`.
- Kada guardrail prekorači prag, elementi se renderuju statički bez degradacije čitljivosti i klikabilnosti.

### Acceptance criteria (motion layer)

1. Animacije su konzistentne kroz `ExtrimliDashboard`, `SportCard`, `GearCatalog`, `EventBoard`, `PerformanceChart`.
2. Reduced/pause režimi rade deterministički i poštuju sistemsku accessibility preferencu.
3. Nema promene EXTRIMLI API surface-a; promena je UI-only.
4. Vizuelni fallback se aktivira za nepoznate asset domene.

## Objektno orijentisana prongilacija

- Canonical term: `Objektno orijentisana prongilacija`
- Contract mode: additive-only
- Technical source of truth: `/api/extrimli/extrem`
- Governance source of truth: `/api/extrimli/extrondol`
- Public boundary: `/api/extrimli/spaja-kod`
- Detailed specification: `docs/EXTRIMLI-OBJEKTNO-ORIJENTISANA-PRONGILACIJA.md`

Ownership split:

- **EXTREM** publishes the technical object-state signal, readiness score, and degraded/watch/blocked posture.
- **EXTRONDOL** consumes that signal for WAWE 1–5 orchestration, promotion freeze, release audit, rollback, and human-review governance.
- **SPAJA KOD** remains encapsulated and exposes only public-safe readiness/governance output without raw object-state internals.

Locked semantic model:

- `objekat` = nosilac stanja
- `instanca` = konkretan lifecycle prolaz
- `atribut` = podatak stanja
- `metoda` = ponašanje nad stanjem
- `delegacija` = raspodela odgovornosti
- `kompozicija` = slaganje više objekata u auditabilan izlaz

Governance impact:

- `READY` signal može da podrži dalji WAWE napredak.
- `WATCH` signal zahteva review, ali ne menja public boundary.
- `BLOCKED` signal mora da aktivira promotion freeze kroz EXTRONDOL.

## FUNKCINALNO PROGRAMIRANJE ENERGETSKOG MISAONOG TOKA

- Canonical term: `FUNKCINALNO PROGRAMIRANJE ENERGETSKOG MISAONOG TOKA`
- Contract mode: additive-only
- Technical source of truth: `/api/extrimli/extrem`
- Governance source of truth: `/api/extrimli/extrondol`
- Public boundary: `/api/extrimli/spaja-kod`

Ownership split:

- **EXTREM** objavljuje tehnički profiling signal za energetsku stabilnost toka, koheziju funkcionalnih transformacija, determinističnost misaonog lanca i conflict/pressure indikator.
- **EXTRONDOL** koristi taj signal za WAWE 1–5 orkestraciju, promotion freeze, release audit summary, rollback i human-review odluke.
- **SPAJA KOD** izlaže samo audit-safe zbirni status bez sirovih formula, internog scoring modela i implementacionih detalja.

Canonical vocabulary + scope lock:

- `energetska stabilnost toka` = `profileInput.energeticFlowStabilityPercent`
- `kohezija funkcionalnih transformacija` = `profileInput.functionalTransformationCohesionPercent`
- `determinističnost misaonog lanca` = `profileInput.thoughtChainDeterminismPercent`
- `conflict/pressure indikator` = `profileInput.conflictPressurePercent`
- readiness izlaz ostaje zaključan na `READY`, `WATCH`, `BLOCKED`
- scope lock ostaje `EXTRIMLI`, `EXTREM`, `EXTRONDOL`, `SPAJA KOD`

Governance impact:

- `READY` signal može da unapredi `orchestrationReadinessScore` bez menjanja postojećih source-of-truth ruta.
- `WATCH` signal zahteva review i može da zadrži rollout na opreznijem WAWE nivou bez lomljenja additive payload-a.
- `BLOCKED` signal mora da aktivira promotion freeze i freeze reasons kroz EXTRONDOL, uz degradable-safe ponašanje kada su ulazi nevalidni.

## FUNKCIONALNO PROGRAMIRANJE EKSPLICITNOG MISAONOG TOKA

- Canonical term: `FUNKCIONALNO PROGRAMIRANJE EKSPLICITNOG MISAONOG TOKA`
- Spelling decision: `exact-user-term-locked`
- Contract mode: additive-only
- Technical source of truth: `/api/extrimli/extrem`
- Governance source of truth: `/api/extrimli/extrondol`
- Public boundary: `/api/extrimli/spaja-kod`
- Detailed specification: `docs/EXTRIMLI-FUNKCIONALNO-PROGRAMIRANJE-EKSPLICITNOG-MISAONOG-TOKA.md`

Ownership split:

- **EXTREM** objavljuje tehnički signal za sledljivost eksplicitnog misaonog toka, koheziju funkcionalnih eksplicitnih transformacija, determinističnost rezonovanja, poravnanje vokabulara i conflict pressure.
- **EXTRONDOL** koristi taj signal za WAWE 1–5 orkestraciju, promotion freeze, release audit summary, rollback, downstream reference i human-review odluke.
- **SPAJA KOD** izlaže samo audit-safe zbirni status bez sirovih signalnih formulacija, scoring detalja i internih eksplicitnih tokova.

Canonical vocabulary + scope lock:

- `sledljivost eksplicitnog misaonog toka` = `profileInput.explicitThoughtFlowTraceabilityPercent`
- `kohezija funkcionalnih eksplicitnih transformacija` = `profileInput.functionalExplicitTransformationCohesionPercent`
- `determinističnost eksplicitnog rezonovanja` = `profileInput.explicitReasoningDeterminismPercent`
- `poravnanje kanonskog vokabulara` = `profileInput.vocabularyAlignmentPercent`
- `konfliktni pritisak` = `profileInput.conflictPressurePercent`
- readiness izlaz ostaje zaključan na `READY`, `WATCH`, `BLOCKED`
- scope lock ostaje `EXTRIMLI`, `EXTREM`, `EXTRONDOL`, `SPAJA KOD`

Governance impact:

- `READY` signal može da unapredi `orchestrationReadinessScore` bez novih public surface-ova.
- `WATCH` signal zahteva review vidljivost i zadržava rollout u audit-safe WAWE okviru.
- `BLOCKED` signal mora da aktivira promotion freeze, release audit coupling i rollback/human-review zahteve kroz EXTRONDOL.

## FUNKIONALNO PROGRAMIRANJE PRAVNOG MISAONOG TOKA

- Canonical term: `FUNKIONALNO PROGRAMIRANJE PRAVNOG MISAONOG TOKA`
- Spelling decision: `exact-user-term-locked`
- Contract mode: additive-only
- Technical source of truth: `/api/extrimli/extrem`
- Governance source of truth: `/api/extrimli/extrondol`
- Public boundary: `/api/extrimli/spaja-kod`
- Detailed specification: `docs/EXTRIMLI-FUNKIONALNO-PROGRAMIRANJE-PRAVNOG-MISAONOG-TOKA.md`

Ownership split:

- **EXTREM** objavljuje tehnički pravni-funkcionalni signal za stabilnost pravnog misaonog toka, koheziju funkcionalnih pravnih transformacija, determinističnost zaključivanja, evidentiary completeness i conflict/escalation pressure.
- **EXTRONDOL** koristi taj signal za WAWE 1–5 orkestraciju, promotion freeze, release audit summary, rollback, downstream reference i human-review odluke.
- **SPAJA KOD** izlaže samo audit-safe zbirni status bez sirovih pravnih formulacija, scoring detalja i internih reasoning artefakata.

Canonical vocabulary + scope lock:

- `stabilnost pravnog misaonog toka` = `profileInput.legalThoughtFlowStabilityPercent`
- `kohezija funkcionalnih pravnih transformacija` = `profileInput.functionalLegalTransformationCohesionPercent`
- `determinističnost pravnog zaključivanja` = `profileInput.legalReasoningDeterminismPercent`
- `evidentiary completeness` = `profileInput.evidentiaryCompletenessPercent`
- `conflict/escalation pressure` = `profileInput.conflictEscalationPressurePercent`
- readiness izlaz ostaje zaključan na `READY`, `WATCH`, `BLOCKED`
- scope lock ostaje `EXTRIMLI`, `EXTREM`, `EXTRONDOL`, `SPAJA KOD`

Governance impact:

- `READY` signal može da unapredi `orchestrationReadinessScore` bez novih public surface-ova.
- `WATCH` signal zahteva review vidljivost i zadržava rollout u audit-safe WAWE okviru.
- `BLOCKED` signal mora da aktivira promotion freeze, release audit coupling i rollback/human-review zahteve kroz EXTRONDOL.
- Track ostaje vezan za `KRALJEVSKI PRAVNI UNIVERZITET` kao pravni okvir; novi modul meri kvalitet funkcionalnog pravnog rezonovanja unutar tog okvira.

## FUNKCIONALNO PROGRAMIRANJE UZVIŠENOG MISANOG TOKA

- Canonical term: `FUNKCIONALNO PROGRAMIRANJE UZVIŠENOG MISANOG TOKA`
- Spelling decision: `exact-user-term-locked`
- Contract mode: additive-only
- Technical source of truth: `/api/extrimli/extrem`
- Governance source of truth: `/api/extrimli/extrondol`
- Public boundary: `/api/extrimli/spaja-kod`
- Detailed specification: `docs/EXTRIMLI-FUNKCIONALNO-PROGRAMIRANJE-UZVISENOG-MISANOG-TOKA.md`

Ownership split:

- **EXTREM** objavljuje tehnički signal za stabilnost uzvišenog misanog toka, koheziju funkcionalnih transformacija, determinističnost rezonovanja i conflict/degradation pressure.
- **EXTRONDOL** koristi taj signal za WAWE 1–5 orkestraciju, promotion freeze, release audit summary, rollback, downstream reference i human-review odluke.
- **SPAJA KOD** izlaže samo audit-safe zbirni status bez sirovih signalnih formulacija, scoring detalja i internih rezonovanih artefakata.

Canonical vocabulary + scope lock:

- `stabilnost uzvišenog misanog toka` = `profileInput.elevatedThoughtFlowStabilityPercent`
- `kohezija funkcionalnih transformacija` = `profileInput.functionalTransformationCohesionPercent`
- `determinističnost rezonovanja` = `profileInput.reasoningDeterminismPercent`
- `pritisak konflikta / degradacije` = `profileInput.conflictDegradationPressurePercent`
- readiness izlaz ostaje zaključan na `READY`, `WATCH`, `BLOCKED`
- scope lock ostaje `EXTRIMLI`, `EXTREM`, `EXTRONDOL`, `SPAJA KOD`

Governance impact:

- `READY` signal može da unapredi `orchestrationReadinessScore` bez novih public surface-ova.
- `WATCH` signal zahteva review vidljivost i zadržava rollout u audit-safe WAWE okviru.
- `BLOCKED` signal mora da aktivira promotion freeze, release audit coupling i rollback/human-review zahteve kroz EXTRONDOL.

Operator configuration defaults:

Canonical EXTREM operator surface for this track consists of exactly these four primary env variables:

- `EXTRIMLI_EXTREM_UZVISENI_MISANI_TOK_STABILITY_PERCENT` → default `91` (brand-new canonical-only input)
- `EXTRIMLI_EXTREM_UZVISENA_FUNKCIONALNA_TRANSFORMACIJA_COHESION_PERCENT` → default `87` (brand-new canonical-only input)
- `EXTRIMLI_EXTREM_UZVISENO_REZONOVANJE_DETERMINISM_PERCENT` → default `88` (brand-new canonical-only input)
- `EXTRIMLI_EXTREM_UZVISENI_CONFLICT_DEGRADATION_PRESSURE_PERCENT` → default `16`
- Backward-compatible alias: `EXTRIMLI_EXTREM_UZVISENI_DEGRADATION_PRESSURE_PERCENT` is accepted, but the canonical env name remains `EXTRIMLI_EXTREM_UZVISENI_CONFLICT_DEGRADATION_PRESSURE_PERCENT`, which takes precedence when both are set and suppresses the alias even if the canonical value is malformed.

## FUNKCIONALNO PROGRAMIRANJE PRAVEDNOG MISAONOG TOKA

- Canonical term: `FUNKCIONALNO PROGRAMIRANJE PRAVEDNOG MISAONOG TOKA`
- Spelling decision: `exact-user-term-locked`
- Contract mode: additive-only
- Technical source of truth: `/api/extrimli/extrem`
- Governance source of truth: `/api/extrimli/extrondol`
- Public boundary: `/api/extrimli/spaja-kod`
- Detailed specification: `docs/EXTRIMLI-FUNKCIONALNO-PROGRAMIRANJE-PRAVEDNOG-MISAONOG-TOKA.md`

Ownership split:

- **EXTREM** objavljuje tehnički signal za stabilnost pravednog misaonog toka, koheziju funkcionalne pravednosti, determinističnost pravednog rezonovanja, evidentiary completeness i conflict/bias pressure.
- **EXTRONDOL** koristi taj signal za WAWE 1–5 orkestraciju, promotion freeze, release audit summary, rollback, downstream reference i human-review odluke.
- **SPAJA KOD** izlaže samo audit-safe zbirni status bez sirovih fairness formulacija, scoring detalja i internih rezonovanih artefakata.

Canonical vocabulary + scope lock:

- `stabilnost pravednog misaonog toka` = `profileInput.fairThoughtFlowStabilityPercent`
- `kohezija funkcionalne pravednosti` = `profileInput.functionalFairnessCohesionPercent`
- `determinističnost pravednog rezonovanja` = `profileInput.fairnessReasoningDeterminismPercent`
- `evidentiary completeness` = `profileInput.evidentiaryCompletenessPercent`
- `pritisak konflikta / pristrasnosti` = `profileInput.conflictBiasPressurePercent`
- readiness izlaz ostaje zaključan na `READY`, `WATCH`, `BLOCKED`
- scope lock ostaje `EXTRIMLI`, `EXTREM`, `EXTRONDOL`, `SPAJA KOD`

Governance impact:

- `READY` signal može da unapredi `orchestrationReadinessScore` bez novih public surface-ova.
- `WATCH` signal zahteva review vidljivost i zadržava rollout u audit-safe WAWE okviru.
- `BLOCKED` signal mora da aktivira promotion freeze, release audit coupling i rollback/human-review zahteve kroz EXTRONDOL.

## RADNI TAKT MOZGA (MISLILAC)

- Canonical term: `RADNI TAKT MOZGA (MISLILAC)`
- Meaning lock: edukativno-razvojni model učenja, samodiscipline i etičkog razlikovanja dobra/zla
- Contract mode: additive-only
- Technical source of truth: `/api/extrimli/extrem`
- Governance source of truth: `/api/extrimli/extrondol`
- Public boundary: `/api/extrimli/spaja-kod`

Ownership split:

- **EXTREM** objavljuje tehnički signal (DOK + DIK) za početničko učenje (jedna rečenica, duboko razumevanje), stabilnost rutine i balans mentalno-fizičkog rada.
- **EXTRONDOL** koristi governance signal (DAK + DUK) za WAWE 1–5 orkestraciju, promotion freeze/promotion odluke, human-review, release-audit summary i rollback disciplinu.
- **SPAJA KOD** izlaže samo audit-safe zbirni status i epilog bez internih formula, težina i scoring detalja.

Canonical domains:

- `pocetnickoUcenje` — jedna rečenica + dubinsko razumevanje (`sentenceDepthPercent`)
- `mentalnoFizickaSinergija` — učenje ↔ trening i energetski balans (`learningTrainingSynergyPercent`)
- `kontinuiraniNapredak` — stabilnost rutine i kontinuitet (`routineConsistencyPercent`)
- `humanistickiCilj` — čovečnost, odgovornost, samopouzdanje i etičko razlikovanje dobra/zla (`ethicalClarityPercent`, `selfConfidenceDisciplinePercent`)
- `epilogijaCovecnosti` — kanonski narativ **ČOVEČANSTVO** ostaje additive-only i audit-ready: `PRIRODA == ZDRAV ŽIVOT` signal zaključava ekosistemski balans, zdrav život i odgovornost čovečanstva bez promene source-of-truth ownership granica.
- Kanonski poster/hero vizuel koristi korisnički dostavljeni asset `b485b700-f670-4f71-9f54-47b29a4155ec` kao determinističku referencu za image/storyboard/public-safe summary paket.

Readiness and governance mapping:

- Statusi su zaključani na `READY`, `WATCH`, `BLOCKED`.
- `WATCH` razlozi obuhvataju: nestabilnost učenja, nedoslednost rutine, slab balans mentalno-fizičkog rada, konfliktni pritisak.
- `BLOCKED` razlozi obuhvataju: kritično niski domen score-ovi, visoki konfliktni pritisak, DOK/DIK tehničke blokade.
- EXTRONDOL mapira signal u WAWE 1–5 uz obaveznu audit-tragljivost (`releaseAuditSummary.radniTaktMozgaMislilacGovernance`) i downstream reference.
- Repo-wide radni takt disciplina sada obavezno zaključava dnevne zadatke kroz `morning-startup`, `deep-focus-block`, `midday-checkpoint` i `end-of-day-closeout`, sa prioritetima `1–3`, jednim aktivnim `roadmapStageId`, `measurableOutput`, `acceptanceEvidence` i closeout statusom `completed | carried-over | blocked`.
- `ČOVEČNOST` asset (`scenarioId=covecnost-developer-create-vrh-radni-takt`) ostaje audit-only vizuelni odraz repo-wide discipline: EXTREM objavljuje bounded readiness/conflict signal i vezu ka `technicalReadinessProfile`, EXTRONDOL ga koristi samo za WAWE/review/rollback evidence, a SPAJA KOD izlaže samo javni audit-safe summary bez sirovih formula.

Epilog boundary:

- SPAJA KOD sadrži audit-safe epilog sloj `epilogijaCovecnosti`.
- Kanonski epilog signal je propagiran kroz EXTREM → EXTRONDOL → SPAJA KOD bez novih ruta i bez promene `DOK/DIK/FOR` (EXTREM) i `DAK/DUK` (EXTRONDOL) ownership modela.
- Citat ostaje formalizovan kao narativni zaključak i ne otvara novi source-of-truth runtime surface.
- Audit-safe epilog sada nosi i `visualReference` kako bi svaki citat imao determinističku vizuelizaciju bez menjanja ownership granica.
- Audit-safe epilog paket sada eksplicitno zaključava i `flowLock` (`image -> spajanje -> posledica -> epilog`), `packageOutputs` (`masterEpilog`, `posterSummary`, `videoStoryboardSummary`, `auditShortSummary`, `governanceChecklistStatus`) i `dokerKuratIzekDokarOverlay` bez izlaganja sirovih EXTREM/EXTRONDOL formula.

## PRIRODA == ZDRAV ŽIVOT (EXTRIMLI EXTRONDOL EXTREM DOK DUK DAK DIK FOR)

- Canonical term: `PRIRODA == ZDRAV ŽIVOT`
- Contract mode: additive-only
- Technical source of truth: `/api/extrimli/extrem`
- Governance source of truth: `/api/extrimli/extrondol`
- Public boundary: `/api/extrimli/spaja-kod`
- Scope lock: nema novih runtime ruta i nema promene ownership split-a.

Ownership split lock:

- **EXTREM** ostaje tehnički sloj za `DOK/DIK/FOR`, uključujući interpretaciju narativa `osoba-biljka`, ekosistemsku raznovrsnost i prirodni balans.
- **EXTRONDOL** ostaje governance sloj za `DAK/DUK`, uključujući WAWE promotion/freeze odluke, release audit, rollback disciplinu i human-review zahteve.
- **SPAJA KOD** ostaje audit-safe summary granica i ne izlaže sirove narativne formule.

Domain contract (narativni signal):

- `epilogNarrativeText` (ulaz): kanonski epilog za ovaj track glasi:
  - `Priroda izum samoživost gde je svaka "osoba-biljka" poseban život u ekosistemima mnogobrojnih subjekata. Zato sam prizor na prirodu i njene ne istražene pejzaže je nezamisliv doživljaj. Obogaćuj se "PRIRODOM" == "ZDRAV ŽIVOT". UBACUJEM OVAJ EPILOG U "ČOVEČANSTVO".`
- Normalizovane tematske ose (0–100):
  - `prirodaAxisPercent`
  - `zdravZivotAxisPercent`
  - `ekosistemAxisPercent`
  - `humanitetAxisPercent`
- Image-to-signal profil je audit-vidljiv kroz `epilogijaCovecnosti.imageToSignalProfile` sa zaključanim `scenarioId=priroda-zdrav-zivot-covecanstvo` i ownership lock mapom (`dokDikFor=EXTREM`, `dakDuk=EXTRONDOL`).
- Izlazni compatibility status:
  - tehnički readiness signal ostaje `READY | WATCH | BLOCKED` (EXTREM)
  - governance/audit status ostaje WAWE-kompatibilan i additive-only (EXTRONDOL)
  - `dokDikDakDukConsistencyHealth` ostaje obavezni zajednički health lock

Epilog boundary:

- `ČOVEČANSTVO` je interpretativni epilog sloj i ne predstavlja novi runtime source-of-truth.
- Epilog se propagira samo kroz postojeći EXTREM → EXTRONDOL → SPAJA KOD tok.
- Nema promene u postojećem razdvajanju `DOK/DIK/FOR` (technical) i `DAK/DUK` (governance).

Governance acceptance checklist (DAK/DUK + WAWE):

1. WAWE 1–5 orkestracija koristi postojeći EXTRONDOL model bez novih governance ruta.
2. Promotion freeze je obavezan kada EXTREM signal i EXTRONDOL governance signal nisu konzistentni.
3. Mandatory `operationalAuditPackage` shape (u PR opisu) je zaključan na:
   - `rolloutPlan`
   - `rollbackPlan`
   - `kpiImpact`
   - `humanReviewStatus`
   - `downstreamReference`
4. `releaseAuditSummary` mora sadržati rollout snapshot, KPI impact, downstream reference, human-review status i rollback zahtev i mora biti evidentiran u:
   - PR opisu kroz `versionRoadmap.developerCreateLock.operationalAuditPackage` polja (`rolloutPlan`, `rollbackPlan`, `kpiImpact`, `humanReviewStatus`, `downstreamReference`)
   - workflow summary izlazu aktivnog EXTRIMLI governance workflow-a (npr. `extrimli-external-github` kada je taj tok aktivan)
   - canonical shape reference ostaje zaključan u sekciji `DOK / DIK / DAK / DUK consistency health lock` (stavka `versionRoadmap.developerCreateLock.operationalAuditPackage`).
5. Human review je obavezan pre bilo kog promotion koraka.
6. Audit trail mora eksplicitno beležiti mapiranje narativnog epiloga u governance odluku u PR opisu i workflow summary-u (isti source-of-truth zapis).

Test/validation acceptance checklist (DOK/DIK/FOR + regresija):

1. Deterministički mapping istog `epilogNarrativeText` ulaza u iste normalizovane ose i isti readiness status.
2. Edge-case validacija:
   - prazan epilog tekst
   - kontradiktoran epilog signal
   - predugačak epilog tekst
3. Degraded-safe fallback ostaje obavezan za nevalidne ulaze.
4. Potvrda da postojeći EXTRIMLI API surface i ownership granice ostaju stabilni (additive-only bez breaking promena).
5. Verifikacioni artefakti za ovaj track ostaju mapirani na postojeće EXTRIMLI gate-ove:
   - test suites: `src/tests/lib/extrimli-extrem.test.ts`, `src/tests/lib/extrimli-extrondol.test.ts`
   - governance validator workflow: `.github/workflows/extrimli-validator.yml`

Finalni artefakti (zaključani izlaz):

1. Ažuriran spec: narativ + signal contract (`PRIRODA == ZDRAV ŽIVOT`).
2. Governance acceptance checklist: `DAK/DUK + WAWE` freeze/promotion pravila.
3. Test acceptance checklist: `DOK/DIK/FOR` kompatibilnost + regresiona validacija.

## PROPORCIONALNO PROGRAMIRANJE

- Canonical term: `PROPORCIONALNO PROGRAMIRANJE`
- Locked interpretation: `INOVACIJA PROGRAMSKIH JEZIKA`
- Contract mode: additive-only
- Technical source of truth: `/api/extrimli/extrem`
- Governance source of truth: `/api/extrimli/extrondol`
- Public boundary: `/api/extrimli/spaja-kod`

Ownership split:

- **EXTREM** objavljuje tehnički signal koji spaja postojeće paradigmske funkcionalne i objektne EXTRIMLI signale u jednu disciplinu višeg reda: funkcionalna transformacija, objektna enkapsulacija/kompozicija, proporcionalni odnos između funkcija i objekata i uslovne činjenice. U funkcionalni skup ulazi i `FUNKIONALNO PROGRAMIRANJE PRAVNOG MISAONOG TOKA` kao postojeći EXTREM funkcionalni signal.
- **EXTRONDOL** koristi taj signal za WAWE current/next stage uticaj, promotion freeze, human-review, rollback, downstream-sync i release-audit summary odluke.
- **SPAJA KOD** izlaže samo audit-safe zbirni status novog track-a bez formula, težina i internih readiness izračuna.

Canonical vocabulary + locked sub-signals:

- `funkcionalna transformacija` = tok čistih funkcionalnih transformacija koji ne sme da dominira bez dovoljne objektne strukture
- `objektna enkapsulacija i kompozicija` = stanje i slaganje objekata koje ne sme da dominira bez čiste transformacije
- `uslovne činjenice` = zasebna governance dimenzija koja potvrđuje da je spoj paradigmi dokazivo stabilan, bez uvođenja dodatnog nezavisnog freeze source-a u samu proporcionalnu računicu
- `PROTKROV FUNKCIJA` = merljivi signal funkcionalne dominacije
- `OBJEKTNE PARADOKSALNE ETAPE` = merljivi signal objektne dominacije
- centralno pravilo ostaje proporcionalnost: ravnoteža funkcionalnog toka, stanja objekta i uslovnih činjenica vodi ka `READY`, a neuravnoteženost vodi ka `WATCH` ili `BLOCKED`

Boundary + governance impact:

- Track sedi uz postojeće funkcionalne i objektne signale i objedinjuje ih u viši sloj inovacije programskih jezika, bez zamene postojećih surface-ova.
- `WATCH` ili `BLOCKED` status moraju da propagiraju audit razloge, rollback obaveznost, downstream sync i human-review kroz EXTRONDOL, bez otvaranja novog nezavisnog freeze source-a van postojećih EXTREM signalnih gate-ova.
- SPAJA KOD ostaje javna fasada i prikazuje samo proporcionalni zbirni status kao audit-safe signal.

## METRIČKO PROGRAMIRANJE

- Canonical term: `METRIČKO PROGRAMIRANJE`
- Contract mode: additive-only track
- Technical source of truth: `/api/extrimli/extrem`
- Governance source of truth: `/api/extrimli/extrondol`
- Public boundary: `/api/extrimli/spaja-kod`
- Detailed specification: `docs/EXTRIMLI-METRICKO-PROGRAMIRANJE.md`

Ownership split:

- **EXTREM** objavljuje tehnički signal za `declaration matrix` i `instance positioning`, uz vezivanje `DOK` i `DIK` kao tehničkog dokaza bez pomeranja ownership granice.
- **EXTRONDOL** koristi isti signal za WAWE progression, promotion freeze, release audit summary, readiness scorecard i human-review odluke, pri čemu `DAK` i `DUK` ostaju governance interpretacija.
- **SPAJA KOD** izlaže samo audit-safe finalni status metričkog programa bez internih matrica, instanci i akcentnih formula.

Canonical vocabulary:

- `matrica` = deklaracije koda u izvornom opsegu
- `instance` = ekstremno pozicioniranje koda na elementarnom nivou
- `muvanje bez pogonskog akcenta` = neutralna, degradaciono-bezbedna deklarativna postura
- `sprega akcenata u odnosu na površinu zastupnjenog kodeksa` = instance-level coupling signal

Boundary + governance impact:

- Track je additive-only i ne uvodi nove source-of-truth rute.
- `WATCH` i `BLOCKED` postures moraju propagirati release-audit, freeze, downstream-sync i human-review obaveze kroz EXTRONDOL.
- `dokDikDakDukConsistencyHealth` ostaje zaključan: `DOK + DIK` tehnički u EXTREM, `DAK + DUK` governance u EXTRONDOL.

## SPAJINO PROPORCIONALNO PROGRAMIRANJE UNIVERZITET

- Canonical term: `SPAJINO PROPORCIONALNO PROGRAMIRANJE UNIVERZITET`
- Canonical narrative title: `Spreg funkcionalnog i objektno programiranja sa mnoštvo novih petlji`
- Contract mode: additive-only sub-track
- Parent track: `PROPORCIONALNO PROGRAMIRANJE`
- Technical source of truth: `/api/extrimli/extrem`
- Governance source of truth: `/api/extrimli/extrondol`
- Public boundary: `/api/extrimli/spaja-kod`
- Detailed specification: `docs/EXTRIMLI-SPAJINO-PROPORCIONALNO-PROGRAMIRANJE-UNIVERZITET.md`

Ownership split:

- **EXTREM** objavljuje univerzitetski signal koji sabira postojeći proporcionalni track, funkcionalne i objektne EXTRIMLI track-ove, plus `petljeSignals` kao dokaz „mnoštva novih petlji“.
- **EXTRONDOL** koristi taj signal za WAWE 1–5 uticaj, promotion freeze, release audit summary, downstream sync i human-review/rollback obaveze.
- **SPAJA KOD** ostaje audit-safe javna fasada i prikazuje samo zbirni status univerzitetskog track-a bez formula, internih težina i sirovih PETLJE detalja.

Canonical vocabulary:

- `funkcionalni tok` = agregirani funkcionalni signal
- `objektna struktura` = agregirani objektni signal
- `petlje orkestracija i proporcionalna ravnoteža` = PETLJE-backed tehnički dokaz nastavnog i proporcionalnog obima

Boundary + governance impact:

- Track je interpretativni univerzitetski sloj iznad postojećeg proporcionalnog programiranja i nije zamena za postojeće contracts.
- `WATCH` ili `BLOCKED` status moraju da aktiviraju promotion freeze kada proporcionalnost ili PETLJE padnu ispod potrebne posture.
- PETLJE ostaje jedini kanonski loop contract koji ovaj track koristi kao dokaz obima.

## VRH PROGRAMSKOG EKVILADENTA

- Canonical term: `VRH PROGRAMSKOG EKVILADENTA`
- Contract mode: additive-only interpretative apex layer
- Parent track: `PROPORCIONALNO PROGRAMIRANJE`
- Technical source of truth: `/api/extrimli/extrem`
- Governance source of truth: `/api/extrimli/extrondol`
- Public boundary: `/api/extrimli/spaja-kod`
- Detailed specification: `docs/EXTRIMLI-VRH-PROGRAMSKOG-EKVILADENTA.md`

Ownership split:

- **EXTREM** ostaje tehnički nosilac signala, metrika, readiness/conflict posture i `DOK + DIK + FOR` ownership-a.
- **EXTRONDOL** ostaje governance sloj za WAWE, promotion freeze, audit, rollback i `DAK + DUK`.
- **SPAJA KOD** ostaje audit-safe summary boundary bez sirovih formula, internih težina i paralelnog runtime contract-a.

Canonical role split:

- `PROPORCIONALNO PROGRAMIRANJE` = parent disciplina i centralna ravnoteža funkcionalnog i objektnog sloja
- `METRIČKO PROGRAMIRANJE` = sloj satnice, vremenskog ritma i deklarativno-instancijske metrike
- `SINEMETRIČKO PROGRAMIRANJE` = vokalni/narativni deo i audit-safe explainability signal
- `PARADIJOGONALNO PROGRAMIRANJE` = instrument tabla za operativni pregled, analize i signalnu kontrolu
- Ova četiri sloja zajedno nose repo-wide dnevni operativni cadence bez novih runtime ruta: METRIČKO = satnica, SINEMETRIČKO = audit-safe narativ, PARADIJOGONALNO = checkpoint tabla, RADNI TAKT = readiness disciplina.

Referenced component specs:

- `METRIČKO PROGRAMIRANJE` → `docs/EXTRIMLI-METRICKO-PROGRAMIRANJE.md`
- `SINEMETRIČKO PROGRAMIRANJE` → `docs/EXTRIMLI-SINEMETRICKO-PROGRAMIRANJE.md`
- `PARADIJOGONALNO PROGRAMIRANJE` → `docs/EXTRIMLI-PARADIJOGONALNO-PROGRAMIRANJE.md`

Existing-contract mapping:

- `PROGRAMSKI JEZIK ANALIZA` (`analize`) → `docs/AI-IQ-PROGRAMSKI-JEZIK.md`
- `PROGRAMSKI JEZIK PROUČAVANJA` (`proučavanja`) → `docs/AI-IQ-PROGRAMSKI-JEZIK.md`
- `PROGRAMSKI JEZIK INFORMACIONIH TOKOVA` (`informacioni tokovi`) → `docs/PROGRAMSKI-JEZIK-INFORMACIONIH-TOKOVA.md`
- `PROGRAMSKI JEZIK PRETPOSTAVKA` (`pretpostavke`) → `docs/AI-IQ-PROGRAMSKI-JEZIK.md`
- `AI IQ PROGRAMSKI JEZIK` apstrakcioni profil (`apstrakcije`) → `docs/AI-IQ-PROGRAMSKI-JEZIK.md`
- `PROGRAMSKI JEZIK PARADIGMA I OBLIKOVANJE TELA` (`paradigmijalno oblikovanje tela`) → `docs/PROGRAMSKI-JEZIK-PARADIGMA-I-OBLIKOVANJE-TELA.md` (`programskiJezikParadigmaOblikovanjeTela` contract)
- `PROGRAMSKI JEZIK SPECIJALIZOVAN ZA IGRICE` (`ekstremne igrice`) → `docs/AI-IQ-PROGRAMSKI-JEZIK.md`
- `PROGRAMSKI JEZIK PO PROSPARITETU DEKLASIRANE MATRICE U EKSTAZI` (`prosparitet deklariše matrice u ekstazi`) → `docs/PROGRAMSKI-JEZIK-PO-PROSPARITETU-DEKLASIRANE-MATRICE-U-EKSTAZI.md`
- `PROGRAMSKI JEZIK DEKORACIJE OBJEKTNIH PRIMESA` (`dekoracija običnih primesa`) → `docs/AI-IQ-PROGRAMSKI-JEZIK.md`

Boundary and validation lock:

- Nema novih source-of-truth ruta.
- Nema breaking promena.
- Dozvoljeni statusi ostaju `READY | WATCH | BLOCKED`.
- Fallback za `NaN`, `Infinity`, prazne ili konfliktne ulaze ostaje obavezan.
- Buduća realizacija sme ostati samo additive proširenje u EXTREM, EXTRONDOL, SPAJA KOD summary i pratećim docs/test slojevima.
- Dnevni task model ostaje governance artefakt izveden iz postojećih modula, validatora i workflow-a, bez novog paralelnog runtime domena.

## Objektno orijentisana reprodukcija

- Canonical term: `Objektno orijentisana reprodukcija`
- Contract mode: additive-only
- Technical source of truth: `/api/extrimli/extrem`
- Governance source of truth: `/api/extrimli/extrondol`
- Public boundary: `/api/extrimli/spaja-kod`
- Detailed specification: `docs/EXTRIMLI-OBJEKTNO-ORIJENTISANA-REPRODUKCIJA.md`

Ownership split:

- **EXTREM** publishes the technical reproducibility signal for object state and behavior.
- **EXTRONDOL** consumes that signal for WAWE freeze/promotion, release audit, rollback, human-review, and downstream-sync governance.
- **SPAJA KOD** remains encapsulated and exposes only public-safe readiness/governance output without raw replay internals.

Locked semantic model:

- `reproduktivno stanje` = audit-safe snapshot objekt stanja
- `metodska determinističnost` = isti ulazi daju isti izlaz
- `replay konzistentnost instance` = lifecycle ostaje stabilan kroz ponavljanje
- `delegaciona stabilnost` = odgovornosti ostaju dosledno raspoređene
- `kompoziciona bezbednost` = složeni objekti zadržavaju bounded izlaz

Governance impact:

- `READY` signal podržava dalji WAWE napredak i deterministic replay posture.
- `WATCH` signal zahteva review pre šireg rollout-a, bez promene public boundary-ja.
- `BLOCKED` signal mora da aktivira promotion freeze kroz EXTRONDOL i release audit.

## SINEMETRIČKO PROGRAMIRANJE

- Canonical term: `SINEMETRIČKO PROGRAMIRANJE`
- Scope lock: `EXTRIMLI`, `EXTREM`, `EXTRONDOL`, `SPAJA KOD`
- Source-of-truth routes remain locked: `/api/extrimli/extrem`, `/api/extrimli/extrondol`, `/api/extrimli/spaja-kod`
- No new parallel routes and no breaking mutation of existing contracts.

Signal and ownership boundary:

- **EXTREM** publishes additive deterministic signal:
  - readiness
  - conflict
  - evidence
- **EXTRONDOL** consumes that signal for:
  - WAWE freeze/promotion posture
  - human-review requirement
  - release-audit summary and downstream-sync governance
- **SPAJA KOD** keeps public-safe summary only (no raw matrix formulas).

Canonical vocabulary lock:

- `matrične sintakse` = scaling legal/conventional acts
- `sekvence u oktavnom dimenzionalnom prostoru` = octaval sequence dimensional readiness
- `matrična jedinjenja` = persona + strelična/miš/tastaturna enkripcija
- `pixel cadence` = deterministic 1ms baseline

Signal split lock remains mandatory:

- `DOK + DIK + FOR` stay in EXTREM technical layer
- `DAK + DUK` stay in EXTRONDOL governance layer
- `PROGRAMSKI JEZIK PROUČAVANJA` ostaje additive-only iznad istog ownership split-a i ne uvodi nove source-of-truth rute.
- `PROGRAMSKI EKANALOG` ostaje audit-safe interpretacioni sloj (razumevanje logike) bez izlaganja internih formula van postojećih surface-ova.

Acceptance criteria:

- deterministic output for identical input payloads
- degraded-safe handling for NaN/Infinity/out-of-range inputs
- octaval sequence + 1ms cadence constraints validated
- DOK/DIK/DAK/DUK/FOR consistency health remains aligned across EXTREM and EXTRONDOL

## KRALJEVSKI PRAVNI UNIVERZITET

- Canonical term: `KRALJEVSKI PRAVNI UNIVERZITET`
- Contract mode: additive-only
- Technical source of truth: `/api/extrimli/extrem`
- Governance source of truth: `/api/extrimli/extrondol`
- Public boundary: `/api/extrimli/spaja-kod`

Ownership split:

- **EXTREM** klasifikuje completeness, consistency, conflict pressure i `READY/WATCH/BLOCKED` posture za legal-governance track.
- **EXTRONDOL** koristi taj signal za WAWE freeze/promotion, release audit summary, downstream reference i human-review zahteve.
- **SPAJA KOD** izlaže samo audit-safe summary status bez sirovih doctrinal/formulation detalja.

Canonical vocabulary:

- `KRALJEVSKI PRAVNI UNIVERZITET` = central legal-governance track i terminološki root.
- `KRALJEVSKA POLITIKA` = policy layer koji mora ostati usklađen sa charter hijerarhijom.
- `NIKOLA SPAJIĆ` = declared ownership/accountability boundary za ovaj track.
- `ZAKON SILNOG` = governance doctrine reference koja ne sme da zaobiđe charter/human-review granice.
- `POVELJA O ZAKONODAVNOM PRAVU` = primary charter i obavezna legislative-authority definicija.
- `PRAVNI POREDAK PO PRAVU GRAĐANSTVA` = neutral civic-order rule set sa warning/block granicama i evidence zahtevima.
- `INSPEKTORI` = additive-only audit/review/evidence/justice-path traka pod `KRALJEVSKI PRAVNI UNIVERZITET`; nije operativno sprovođenje, ne uvodi nove rute i ne otkriva sirove istrage.

Documentation boundary:

- Shared ChatGPT link i već opisane povelje/pravni akti tretiraju se kao **documentation-only** source material.
- Zaključani documentation-only ChatGPT share izvor za ovaj governance paket je `https://chatgpt.com/share/6ab2f88d-23b0-83eb-b708-b880bdb7fc11?ogimg=plain` i ne sme se koristiti kao runtime ulaz.
- Jezički sloj je zaključan: srpski je primarni kanonski izraz domena, uz engleske tehničke oznake samo za interoperabilnost i review.
- `VRH PROGRAMSKOG EKVILADENTA` u V2–V5 zaključava additive-only mapiranje: `eksponencijalne funkcije` → readiness/progression, `oktavna topologija` + `sekvencijalni oktavni sistem reprodukcije` → orchestration model, `ekspozje` → auditabilni intenzitet/opterećenje, `obrtni moment` → torque/momentum, `srazmerno stanje u eksploatacionom nivou` → proporcionalno/governance posture.
- Primarni sadržajni gap koji mora biti eksplicitno zaključen je `POVELJA O ZAKONODAVNOM PRAVU`.

Structured governance signals:

- charter completeness
- legislative authority definition
- citizenship-order principles
- conflict/escalation indicators
- review-required conditions
- blocked actions against the declared kingdom order

Neutral rule boundary:

- Neprihvatljivo ponašanje mora biti opisano neutralno, bez sirovih internih formulacija.
- `WARNING` zahteva dokazive signale rizika i human review pre promocije.
- `BLOCKED` zahteva potvrđene evidencije protivpravnog ili nedozvoljenog civic maneuvering-a prema kingdom framework-u.
- `UNUTRAŠNJA KONTROLA GRAĐANSTVA U INFORMACIONOM STAVU` ostaje neutral civic-order/compliance/evidence model: zabranjeni su operativni bezbednosni postupci, identiteti, mape, taktike i represivni detalji.
- `putevi istinske pravde` ostaju sažeti kroz postojeći `READY | WATCH | BLOCKED` jezik: rule consistency, evidentiary completeness, review posture, blocker summary i obavezni human review.
- Eskalacija zahteva dokumentovanu evidenciju, audit trail i rollback/human-review spremnost.

Release/governance checklist:

- current WAWE
- eligible next WAWE
- promotion freeze
- human review
- rollback requirement
- downstream reference
- audit summary

## ŽELEZARA PRETPLATA IDENTITET

- Canonical legal name in this program: `Železara d.o.o. Smederevo`
- Current operating name for intake matching: `HBIS / Hibis Smederevo`
- Legacy return name: `Železara`
- Allowed aliases: `Železara d.o.o. Smederevo`, `Železara`, `HBIS`, `Hibis`, `HBIS Smederevo`, `Hibis Smederevo`
- Contract mode: additive-only
- Technical source of truth: `/api/extrimli/extrem`
- Governance source of truth: `/api/extrimli/extrondol`
- Public boundary: `/api/extrimli/spaja-kod`

Identity/governance split:

- **EXTREM** potvrđuje da svi dozvoljeni nazivi mapiraju isti entitet, meri alias coverage i označava `READY/WATCH/BLOCKED` posture za restore-old-name zahtev.
- **EXTRONDOL** koristi taj signal za procurement, contract approval, onboarding, downstream sync, human review i paymentVerification hard gate odluke.
- **SPAJA KOD** izlaže samo audit-safe summary status bez sirovih identity konflikt detalja.

Hard rules:

- `HBIS/Hibis` i `Železara` ne smeju biti tretirani kao dva odvojena klijenta.
- Ako je restore-old-name označen kao poslovni uslov, javni i audit-safe izlazi moraju vratiti naziv `Železara`.
- Nepotvrđen ugovorni identitet, naming konflikt ili neispunjen restore-old-name zahtev moraju ostati eksplicitan blocker/freeze reason.
- Payment verification i human review ostaju obavezni pre aktivacije.

### Objektno orijentusano uzdizanje epskih elikvadenata

- Canonical term: `Objektno orijentusano uzdizanje epskih elikvadenata`
- Contract mode: additive-only
- Technical source of truth: `/api/extrimli/extrem`
- Governance source of truth: `/api/extrimli/extrondol`
- Public boundary: `/api/extrimli/spaja-kod`
- Interpretation layer: internal technical signal over controlled `EKVIVALENT NETWORK` entities (`MODULE`, `KNOWLEDGE`, `PERSONA`)

Ownership split:

- **EXTREM** meri readiness, watch i blocked posture za controlled epic equivalents kroz objekt, instancu, metodu, delegaciju i enkapsulaciju.
- **EXTRONDOL** propagira samo audit-safe readiness rezultat u WAWE freeze/review/audit/downstream sync odluke.
- **SPAJA KOD** ne izlaže sirove “elikvadent” strukture; ostaje samo public-safe governance/readiness boundary.

## EXTRIMLI EXTRONDOL EXTREM — Verzije 1–7 roadmap

- Roadmap model: `single-ecosystem-phased-roadmap`
- Shared roadmap contract: `v1-7-roadmap`
- Locked source-of-truth surfaces: `/api/extrimli/health`, `/api/extrimli-3/health`, `/api/extrimli/extrem`, `/api/extrimli/extrondol`, `/api/extrimli/spaja-kod`

### Version map

1. `Verzija 1` — core EXTRIMLI stabilization (`src/lib/extrimli/**`, `src/app/api/extrimli/**`)
2. `Verzija 2` — canonical integration layer (`src/lib/extrimli-extendol/**`, `src/lib/extrimli-extrondend/**`)
3. `Verzija 3` — advanced readiness and profile expansion (`src/lib/extrimli-3/**`, `src/app/api/extrimli-3/**`)
4. `Verzija 4` — EXTREM governance hardening (`src/lib/extrimli-extrem/**`, `src/app/api/extrimli/extrem/**`) including additive object-oriented reproduction, epic elikvadenti uplift readiness, FUNKCINALNO PROGRAMIRANJE ENERGETSKOG MISAONOG TOKA profiling, PROPORCIONALNO PROGRAMIRANJE language-innovation synthesis, and METRIČKO PROGRAMIRANJE declaration-matrix/instance-positioning readiness
5. `Verzija 5` — EXTRONDOL release orchestration (`src/lib/extrimli-extrondol/**`, `src/app/api/extrimli/extrondol/**`) including object-oriented reproduction, epic elikvadenti review/freeze propagation, FUNKCINALNO PROGRAMIRANJE ENERGETSKOG MISAONOG TOKA WAWE governance, FUNKCIONALNO PROGRAMIRANJE EKSPLICITNOG MISAONOG TOKA explicit-thought governance, FUNKIONALNO PROGRAMIRANJE PRAVNOG MISAONOG TOKA legal-functional governance, PROPORCIONALNO PROGRAMIRANJE audit/freeze propagation, and METRIČKO PROGRAMIRANJE governance/audit propagation
6. `Verzija 6` — multi-repo and persona sync (`docs/MULTI-REPO-LINKS.md`, `.agent-config.json`, `src/lib/persona-bank/**`)
7. `Verzija 7` — enterprise operating model (`docs/EXTRIMLI-EXTERNAL-GITHUB.md`, `.github/workflows/extrimli-external-github.yml`)

### Shared roadmap principles

- bez breaking promena na locked source-of-truth endpointima
- additive-only ekspanzije
- WAWE 1–5 ostaje canonical rollout model
- KPI budget ostaje `≤ 50ms` evaluacija, `≤ 200ms` API, `≤ 3 min` build gde je primenljivo
- downstream reference i sync ka `spaja86/IO-OPENUI-AO` ostaju eksplicitni
- human review, security scanning i rollback plan ostaju obavezni pre promocije

### Delivery sequence

- `FOUNDATION` → `Verzija 1`, `Verzija 2`, `Verzija 3`
- `GOVERNANCE` → `Verzija 4`, `Verzija 5`
- `OPERATING-MODEL` → `Verzija 6`, `Verzija 7`
- Developer/Create operational implementation plan: `docs/EXTRIMLI-DEVELOPER-CREATE-PROGRAM.md`

## EXTRIMLI Extendol unified contract (maximum functionality for all)

Extendol objedinjuje EXTRIMLI v1, EXTRIMLI v3, DUEL KING, EXTRIMLI CUZ i KORON u jedan kanonski integracioni sloj.

- Source of truth endpoint: `/api/extrimli/extendol`
- Contract constants:
  - `EXTRIMLI_EXTENDOL_CONTRACT_VERSION = v1`
  - `EXTRIMLI_EXTENDOL_MODULE_VERSION = 1.0.0`
- Degraded policy: `partial-payload-no-500`

### Acceptance criteria (Extendol)

1. Jedinstveni ugovor je versioned i stabilan.
2. Pokriveni su svi ključni putanje funkcionalnosti:
   - sport/risk evaluation
   - gear i safety readiness
   - event lifecycle i registration
   - destruction safety flows
   - athlete progress/readiness
   - DUEL KING readiness / tournament posture
   - community reputation/mentorship
   - KORON readiness overlay i sync coverage
3. KPI targeti ostaju ≤ 50ms evaluacija i ≤ 200ms API response.
4. Unified readiness score koristi realne signale iz v1/v3/DUEL KING/CUZ/KORON health surface-a.
5. Fallback vraća degradirani odgovor umesto HTTP 500.

## EXTRIMLI KORON overlay

KORON je novi EXTRIMLI capability koji radi kao readiness overlay nad postojećim v1, v3, DUEL KING i CUZ surface-ovima i objavljuje status za Extendol i downstream GitHub governance.

- Source of truth endpoint: `/api/extrimli/koron`
- Contract constants:
  - `EXTRIMLI_KORON_CONTRACT_VERSION = v1-koron`
  - `EXTRIMLI_KORON_MODULE_VERSION = 1.0.0`
- KORON publikuje:
  - `status`
  - `readinessScore`
  - `riskBalanceScore`
  - `communitySignalScore`
  - `destructionRecoveryScore`
  - `syncCoverageScore`
  - `degradedSources`
- Degraded policy: `partial-payload-no-500`

## DUEL KING dedicated contract

- Source of truth endpoint: `/api/extrimli/duel-king`
- Contract constants:
  - `EXTRIMLI_DUEL_KING_CONTRACT_VERSION = v1-duel-king`
  - `EXTRIMLI_DUEL_KING_MODULE_VERSION = 1.0.0`
  - `EXTRIMLI_DUEL_KING_KUR_CONTRACT_VERSION = v1-kur-game`
  - `EXTRIMLI_DUEL_KING_DUR_CONTRACT_VERSION = v1-dur-game`
  - `EXTRIMLI_DUEL_KING_MOL_CONTRACT_VERSION = v1-mol-game`
- Degraded policy: `partial-payload-no-500`
- Mandatory payload:
  - `telemetryStatus`
  - `kurTelemetryStatus`
  - `durTelemetryStatus`
  - `molTelemetryStatus`
  - `kurContractVersion`
  - `durContractVersion`
  - `molContractVersion`
  - `kurSignalCoverageScore`
  - `durSignalCoverageScore`
  - `molSignalCoverageScore`
  - `lastKurProgressionSignal`
  - `lastDurProgressionSignal`
  - `lastMolProgressionSignal`
  - `lastKurImpactScore`
  - `lastDurImpactScore`
  - `lastMolImpactScore`
  - `lastKurSignalStatus`
  - `lastDurSignalStatus`
  - `lastMolSignalStatus`
  - `duelMode`
  - `duelRiskScore`
  - `readinessScore`
  - `fighterProgressionScore`
  - `gearCleared`
  - `requiredGear`
  - `tournamentState`
  - `bracketStatus`

### Acceptance criteria (DUEL KING)

1. DUEL KING ostaje dedicated EXTRIMLI capability sa sopstvenim versioned contract-om.
2. DUEL mode, readiness, gear clearance i tournament posture ostaju deterministički i bounded.
3. Missing partial signals vraćaju degradirani odgovor umesto HTTP 500.
4. KPI targeti ostaju ≤ 50ms evaluacija i ≤ 200ms API response.
5. KUR/DUR/MOL in GAME signali su opcioni DUEL KING extension: validni signali imaju bounded uticaj na readiness/risk, a nevalidni signali ulaze u degraded bez HTTP 500.

## DUEL KING KUR/DUR/MOL in GAME scope

- Scope boundary: samo `/api/extrimli/duel-king` i DUEL KING health/aggregate surface.
- Input signal boundary: `kurGameSignal`, `durGameSignal`, `molGameSignal` (`start`, `target`, `step`, opciono `maxIterations`, `maxDurationMs`).
- Execution boundary: signal petlje deterministički izračunavaju progression signale po istom bounded modelu.
- Output boundary:
  - `kurGameSignal.status` (`BASELINE | LIVE | DEGRADED`)
  - `kurGameSignal.progressionSignal` (`0..100`)
  - `kurGameSignal.impactScore` (`-8..8`)
  - `durGameSignal.status` (`BASELINE | LIVE | DEGRADED`)
  - `durGameSignal.progressionSignal` (`0..100`)
  - `durGameSignal.impactScore` (`-6..6`)
  - `molGameSignal.status` (`BASELINE | LIVE | DEGRADED`)
  - `molGameSignal.progressionSignal` (`0..100`)
  - `molGameSignal.impactScore` (`-5..5`)
- Degraded boundary: nevalidan ili nepotpun `kurGameSignal` / `durGameSignal` / `molGameSignal` ne vraća 500; odgovor ostaje `partial-payload-no-500` uz upozorenja.
- Backward compatibility: bez `kurGameSignal`/`durGameSignal`/`molGameSignal` ulaza, postojeća DUEL KING readiness/risk semantika ostaje ista.


## EXTRONDEND aggregation contract

- Source of truth endpoint: `/api/extrimli/extrondend`
- Contract constants:
  - `EXTRONDEND_CONTRACT_VERSION = v1-extrondend`
  - `EXTRONDEND_MODULE_VERSION = 1.0.0`
- Degraded policy: `partial-payload-no-500`
- Mandatory payload: `aggregationScore`, `readinessParityScore`, `weightedSurfaceHealth`, `acceptanceCriteria`, `integrationBoundaries`, `surfaces`.

### Acceptance criteria (EXTRONDEND)

1. Naming lock: dedicated module, not alias.
2. Stable contract/version constants.
3. Integration boundary preserved (depends on v1/v3/CUZ/Extendol/KORON without contract mutation).
4. KPI targets remain ≤ 50ms evaluation and ≤ 200ms API response.
5. Aggregation score is finite and clamped to `[0, 100]`.


## EXTRIMLI EXTREM profiler contract

- Source of truth endpoint: `/api/extrimli/extrem`
- Contract constants:
  - `EXTRIMLI_EXTREM_PROFILER_CONTRACT_VERSION = v1-extrem-profiler`
  - `EXTRIMLI_EXTREM_PROFILER_MODULE_VERSION = 1.0.0`
- Degraded policy: `partial-payload-no-500`
- Mandatory payload: `terminology`, `profileInput`, `profile`, `mobilnaLinija`, `semaMuSemaFormula`, `optimization`, `governanceSignal`, `kpiTargets`, `kpiObserved`, `acceptanceCriteria`.
- DISKVIT terminology lock:
  - `DISKVIT` = browser-graphics bottleneck layer.
  - Conflict scoring is conflict-proportional (`sceneLoadPercent`, `gpuContentionPercent`, `cpuContentionPercent`, `renderCycleLatencyMs`).
- Normalized EXTREM vocabulary lock:
  - `REZOLUCIJA` = resolution readiness dimension (`resolutionReadiness.rezolucijaScore`)
  - `EKODOR` = readiness alignment signal (`resolutionReadiness.ekodorState`)
  - `REKULITI PO RAULETU` = resolution routing policy (`resolutionReadiness.rekulitiPoRauletu`)
  - `DISCAN` = blocking-pressure input (`resolutionInput.discanPressurePercent`)
  - `KIBEN` = governance lane for DISCAN interpretation (`resolutionReadiness.kibenLane`)
- Resolution-oriented profiling dimension:
  - additive EXTREM inputs: `resolutionInput.rezolucijaCompletenessPercent`, `resolutionInput.ekodorAlignmentPercent`, `resolutionInput.discanPressurePercent`
  - additive EXTREM outputs: `resolutionReadiness.rezolucijaScore`, `ekodorState`, `rekulitiPoRauletu`, `discanInKibenState`, `blockerActive`
  - `REKULITI PO RAULETU = FREEZE` when REZOLUCIJA is below readiness threshold, EKODOR is blocked, or DISCAN in KIBEN is blocked
- WAWE governance integration:
  - freeze when conflict intensity is `HIGH/CRITICAL` or KPI targets are breached.
  - freeze also when `REKULITI PO RAULETU = FREEZE`.
  - promotion when profiler signal is stable and KPI limits remain within target.
- Canonical formula lock:
  - expression: `ŠEMA + ŠEMA + ALL ŠEMA == MUŠEMA`
  - scope lock: `EXTRIMLI`, `EXTRONDOL`, `EXTREM`
  - payload: `semaMuSemaFormula.inputs`, `computedMuSema`, `formulaHolds`, `status`, `muSemaConclusion`, `blockerReasons`
  - governance rule: `status = BLOCKED` obavezno aktivira freeze signal.
- Maximum graphics unlock thresholds:
  - conflict score ≤ 35
  - render cycle latency ≤ 45ms
  - GPU contention ≤ 40%
- Mobilna linija additive surface:
  - `mobilnaLinija.contractVersion = v1-mobilna-linija-installation`
  - mandatory outputs: `mobilnaLinija.installationMessages` i `mobilnaLinija.packagePlanHint`
  - EXTREM validira tip uređaja/kompatibilnost i status instalacionih poruka (`READY | WATCH | BLOCKED`)
  - edge-case zaštita pokriva nepoznat tip uređaja, prazan model, NaN/Infinity i nevalidne numeričke inpute kroz degraded-safe ponašanje

## EXTRONDOL orchestration contract

- Source of truth endpoint: `/api/extrimli/extrondol`
- Contract constants:
  - `EXTRONDOL_CONTRACT_VERSION = v1-extrondol`
  - `EXTRONDOL_MODULE_VERSION = 1.0.0`
- Degraded policy: `partial-payload-no-500`
- Mandatory payload: `orchestrationReadinessScore`, `roadmapAlignment`, `versionRoadmap`, `startProject`, `b2bScope`, `b2bReadiness`, `paymentVerification`, `zelezaraPretplataGovernance`, `extremProfiler`, `mobilnaLinija`, `domainStrategy`, `nivoDuet`, `dinkos`, `rollout.currentWawe`, `rollout.eligibleNextWawe`, `rollout.promotionFreeze`, `releaseAuditSummary`, `releaseReadinessScorecard`, `canaryRingMetrics`, `incidentPlaybook`, `contractDriftReport`, `governanceConformance`, `acceptanceCriteria`, `integrationBoundaries`, `surfaces`.
- EXTREM resolution propagation:
  - rollout reasons include additive REZOLUCIJA / REKULITI PO RAULETU freeze markers when present
  - `b2bReadiness.governanceDecisions.resolutionReadiness` mirrors EXTREM resolution posture
  - `releaseAuditSummary.resolutionGovernance` summarizes the REZOLUCIJA/EKODOR/REKULITI PO RAULETU/DISCAN in KIBEN decision state
- EXTREM formula propagation:
  - `b2bReadiness.governanceDecisions.semaFormulaGate` mirrors EXTREM `semaMuSemaFormula` posture
  - `releaseAuditSummary.semaFormulaGovernance` exposes canonical expression + MUŠEMA conclusion
  - blocked formula state must freeze promotion (`rollout.promotionFreeze = true`).
- Mobilna linija governance propagation:
  - `mobilnaLinija.packageCatalog` objavljuje paketne planove i pravila selekcije
  - `mobilnaLinija.activationStatus` ostaje `BLOCKED` kada nema validnog plana ili instalacione poruke nisu kompletne
  - rollout freeze razlozi uključuju `mobilna-linija:*` markere kada je mobilna aktivacija blokirana

### EXTRONDOL B2B operating scope

- EXTRONDOL B2B consumer model je **organization-level**, ne individual athlete/session model.
- EXTRONDOL paket `PRETPLATA ZA NEOGRANIČENO PROGRAMIRANJE I ALATE` na GitHub-u je klasifikovan kao **controlled periodic B2B enterprise subscription** (nije neodređeni model).
- Scope paketa je zaključan na: enterprise seat model, Copilot/AI prava, private repository pristup, GitHub Actions governance sloj i business-critical support SLA.
- Account ownership ostaje na `@spaja86` / `Kompanija SPAJA / Digitalna Industrija`, uz obavezan human review pre promocije.
- Partner/operator split mora biti eksplicitan:
  - owner / contract-owner
  - WAWE orchestrator / tenant onboarding / downstream sync operator
  - linked partner repo `spaja86/IO-OPENUI-AO`
  - human/security/validator review layer
- Procurement/review flow ostaje: `request-submitted` → `procurement-review` → `compliance-review` → `operational-approval` → `activation`.
- Aktivacija ne sme proći bez `contract-approved`, `onboarding-complete`, `downstream-sync-complete` i `human-review-complete`.
- Commercial/legal model mora ostati eksplicitan u B2B contract-u:
  - `primarySegment = privreda`
  - `supportedSegments = [privreda, gradjanstvo]`
  - `billingOwner` zaključan na operativni owner
  - `contractStatus = required-before-activation`
  - `paymentCycle = monthly-or-annual`
  - `aiPlateEnterprisePackage = DEVELOPER AND CREATE / VRH PROGRAMSKOG EKVILADENTA / AI PLATE`
  - `aiPlateEnterprisePackage.pricing = 12.000 EUR weekly`
  - `aiPlateEnterprisePackage.weeklyCadenceDecision = premium-rollout-regime`
  - `aiPlateEnterprisePackage.masterBillingCycle = monthly-or-annual`
  - `aiPlateEnterprisePackage.segment = enterprise / organization-level`
  - `aiPlateEnterprisePackage` ostaje additive-only V7 enterprise operating model sloj nad postojećim `EXTRIMLI + EXTREM + EXTRONDOL + SPAJA KOD` surface-ovima.
  - EXTREM ostaje readiness/profiler signal, EXTRONDOL ostaje commercial/governance/orchestration source-of-truth, a SPAJA KOD objavljuje samo audit-safe `aiPlateEnterprisePackageStatus`.
  - Aktivacija weekly enterprise paketa traži `contract approval`, `compliance review`, `human review`, `payment verification`, `downstream sync`, `rollback plan` i `FinOps guardrails`.
  - compliance + human review su hard gate pre aktivacije
- `b2bReadiness.compliance.humanReviewComplete` mora eksplicitno ostati `false` dok governance layer ne poseduje dokaz o review-u; tada rollout ostaje frozen.
- `b2bReadiness.downstreamSync.status` i `b2bReadiness.compliance.blockers` moraju ostati konzervativni dok `multi-repo-sync-agent` ne potvrdi stvarni downstream sync.
- `b2bReadiness.compliance.onboardingComplete` je zaseban governance dokaz; DUET ostaje signal za onboarding hold i warning logiku, ali ne zatvara onboarding gate sam po sebi.
- EXTRONDOL report builder može primiti governance evidence direktno ili kroz environment evidence (`EXTRONDOL_AUDIT_TRAIL_COMPLETE`, `EXTRONDOL_HUMAN_REVIEW_COMPLETE`, `EXTRONDOL_DOWNSTREAM_SYNC_COMPLETE`, `EXTRONDOL_ONBOARDING_COMPLETE`) bez menjanja WAWE modela.
- SLA posture ostaje enterprise-governed: evaluacija ≤ 50ms, API ≤ 200ms, build ≤ 3 min, business-critical support.
- "Neograničeno" se tretira kao **controlled enterprise capacity** sa guardrail-ovima:
  - mandatory fair-use policy
  - abuse protection controls
  - FinOps pragovi `50/75/90/100`
  - promotion freeze triggeri: KPI breach, audit incomplete, payment not verified
  - rollback triggeri: KPI breach posle promocije, payment revoked, governance regression
- Audit obaveze ostaju: traceable approvals, full audit trail, downstream references, i bez operativnih sekreta u Git-u.
- `releaseAuditSummary` je obavezan i mora sadržati: rollout snapshot (`currentWawe`, `eligibleNextWawe`, `promotionFreeze`, `reasons`), KPI impact (`evaluationMaxMs`, `apiResponseMaxMs`, `buildDurationMaxMin`, `withinTargets`) i downstream reference (`linkedRepo`, `status`, `required`), uz `humanReviewRequired` i `rollbackPlanRequired` hard gate polja.
- AI IQ Programski Jezik additive integration profil (`EXTRIMLI-EXTRONDOL-EXTREM`) mora čuvati isti governance minimum: rollout snapshot, promotion freeze, human review, rollback i downstream reference (`spaja86/IO-OPENUI-AO`) bez menjanja postojećih EXTRONDOL ugovora.
- `paymentVerification` je obavezan pre WAWE promocije i B2B aktivacije; mora sadržati status provere (`VERIFIED | BLOCKED`), `invoiceResolutionPath` (`paid | correction-resolved | unresolved`), dokazni paket (`invoiceRequested`, `currentInvoiceEvidenceCaptured`, `bankStatementCaptured`, `paymentReferenceCaptured`, klasifikacija reference i public-safe approval), `blockers`, `auditTimestamp` i `readinessImpact`.
- `zelezaraPretplataGovernance` je additive audit-safe governance track za intake/contract naming: kanonski identitet ostaje `Železara d.o.o. Smederevo`, operativni intake prihvata `HBIS/Hibis` alias-e, a restore-old-name pravilo mora vratiti `Železara` kada je to obavezan poslovni uslov.
- Ako `zelezaraPretplataGovernance.namingReadiness.restoreOldNameCompleted = false`, `namingConflictDetected = true` ili `splitClientRiskDetected = true`, aktivacija mora ostati blokirana i WAWE promocija frozen.
- Vercel pretplata governance za Digitalna Industrija mora eksplicitno pokriti:
  - billing owner lock na `Digitalna Industrija — Kompanija SPAJA`
  - trenutnu fakturu `5JJYX4KN-0015` (`$385.52`) kao `paid` ili `corrected-invoice-resolved` (samo `correction-requested` nije dovoljno za finalno razrešenje)
  - `invoice requested` / support eskalaciju kao audit trag za aktivnu fakturu
  - dokazni paket: invoice PDF, payment potvrda, timestamp, odgovorno lice
  - izvod platnog računa sa vidljivom vezom ka uplati
  - barkod ili payment reference kao dodatni dokazni artefakt, uz klasifikaciju `public-safe` ili `internal-only`; `public-safe` zahteva posebno odobrenje pre objave
  - javni audit-ready sažetak tek nakon potvrđene uplate ili resolved correction putanje, kompletiranog dokaznog paketa i redakcije osetljivih bankarskih podataka
  - javni prikaz ne sme sadržati neredigovan izvod, pune brojeve računa, nefiltrirane reference ni operativne sekrete
  - future controls: corporate-only autopay, finance channel notifikacije, FinOps pragovi `50/75/90/100`, mesečni reconciliation, kvartalni vendor review

### START PROJEKAT rollout program

- START PROJEKAT je additive EXTRONDOL rollout metadata sloj za go-live program `OKRID-2026-EXTRIMLI-START-001`.
- `startProject` ne menja `EXTRONDOL_CONTRACT_VERSION`; služi kao governance/program wrapper za postojeći source-of-truth payload.
- START scope zaključava:
  - source-of-truth: `/api/extrimli/extrondol`
  - orchestration inputs: `EXTRONDEND`, `EXTENDOL`, `KORON`, `EXTREM-PROFILER`
  - DUET role: `signal-only`
  - release mode: `governance-controlled`
- START rollout prati WAWE program:
  - `WAWE-1` → pre-deploy readiness
  - `WAWE-2` → build + staging
  - `WAWE-3` → downstream sync evidence
  - `WAWE-4` → production rollout
  - `WAWE-5` → post-deploy resilience
- START mandatory outputs ostaju additive-only i uključuju `rollout.currentWawe`, `rollout.eligibleNextWawe`, `rollout.promotionFreeze`, `nivoDuet`, `dinkos`, `distanceRatioEkvilaterTable`, `paymentVerification`, `zelezaraPretplataGovernance`, `extremProfiler`, `extremProfiler.zelezaraPretplataIdentityTrack`, `extremProfiler.resolutionReadiness`, `extremProfiler.semaMuSemaFormula`, `releaseReadinessScorecard`, `canaryRingMetrics`, `incidentPlaybook`, `contractDriftReport`, `governanceConformance`.
- `versionRoadmap` i `roadmapAlignment` dokumentuju da je EXTRONDOL primary orchestration stage `Verzija 5`, dok EXTREM ostaje mandatory `Verzija 4` gate za naredne release faze, uključujući FUNKCINALNO PROGRAMIRANJE ENERGETSKOG MISAONOG TOKA, FUNKCIONALNO PROGRAMIRANJE EKSPLICITNOG MISAONOG TOKA, FUNKIONALNO PROGRAMIRANJE PRAVNOG MISAONOG TOKA, PROPORCIONALNO PROGRAMIRANJE i METRIČKO PROGRAMIRANJE track-ove.
- START governance evidence ostaje obavezna: `contract-approved`, `onboarding-complete`, `downstream-sync-complete`, `audit-trail-complete`, `human-review-complete`.
- START downstream sync ostaje obavezan za `spaja86/IO-OPENUI-AO` bez mutacije postojećeg EXTRONDOL ugovora.

### Release readiness scorecard + conformance

- `releaseReadinessScorecard` je single-pane prikaz za zaključana jezgra `EXTRIMLI`, `EXTREM`, `EXTRONDOL` i zaključane source-of-truth surface-ove (`/api/extrimli/extrem`, `/api/extrimli/extrondol`, `/api/extrimli/spaja-kod`).
- Kada je relevantan, scorecard i `releaseAuditSummary` moraju uključiti FUNKCINALNO PROGRAMIRANJE ENERGETSKOG MISAONOG TOKA, FUNKCIONALNO PROGRAMIRANJE EKSPLICITNOG MISAONOG TOKA, FUNKIONALNO PROGRAMIRANJE PRAVNOG MISAONOG TOKA, PROPORCIONALNO PROGRAMIRANJE i METRIČKO PROGRAMIRANJE posture, rollout impact, downstream reference i human-review/rollback coupling.
- Kada je aktivan Železara pretplata track, scorecard i `releaseAuditSummary` moraju uključiti kanonski identitet, restore-old-name status, split-client rizik i public-safe summary signal.
- `canaryRingMetrics` prati ring sekvencu `RING-0-CONTRACT → RING-4-RESILIENCE` i auto-freeze posture pre promocije.
- `incidentPlaybook` zaključava tok `trigger → freeze → rollback → postmortem`.
- `contractDriftReport` proverava usklađenost docs/types/routes/workflows i blokira conformance ako postoji drift.
- `governanceConformance` mapira status periodičnog audita iz `.github/workflows/extrimli-governance-conformance.yml` (`0 4 * * 1`).

### DISTANCE RATIO EKVILATER table

- Canonical table name je `DISTANCE RATIO EKVILATER`, a legacy compatibility alias ostaje zabeležen kao `DISANCE RATOR EKVILATER`.
- Canonical payload field je `distanceRatioEkvilaterTable`.
- Table je **derived readiness table**, ne novi alias endpoint i ne menja WAWE scoring logiku.
- Table ostaje additive payload section za downstream consumer-e; ne menja `EXTRONDOL_CONTRACT_VERSION` i ne zamenjuje postojeća mandatory polja.
- Inputs su postojeći EXTRONDOL upstream score-ovi:
  - `extrondend.aggregationScore`
  - `extendol.unifiedReadinessScore`
  - `koron.readinessScore`
- Table gradi tri pairwise ivice (`EXTRONDEND↔EXTENDOL`, `EXTRONDEND↔KORON`, `EXTENDOL↔KORON`) i za svaku izbacuje:
  - `distance`
  - `distanceRatio`
  - `equilateralAlignment`
  - `balanced`
- `summary.equilateralConsistency` ostaje u opsegu `0..100` i služi kao interpretacija koliko su tri upstream surface-a geometrijski uravnotežena (`balanced | watch | skewed`).
- Svrha tabele je da downstream consumer-i mogu da tumače raspodelu readiness distance-a bez promene postojećeg `orchestrationReadinessScore` i `promotionFreeze` ponašanja.

### Acceptance criteria (EXTRONDOL)

1. Naming lock: dedicated module, not alias.
2. Stable contract/version constants.
3. WAWE sequencing is deterministic (`WAWE-1` → `WAWE-5`).
4. Promotion freeze is enforced when readiness/degraded gates are not satisfied.
5. Domain strategy lock rejects `spaja.nivo*spaja` and enforces `spaja.nivo-spaja` + `*.spaja.nivo-spaja`.
6. NIVO DUET mapping must project DUET `status` + `overallScore` + `warnings` into WAWE decisions.
7. DINKOS is an explicit signal contract (not a new API route) with ownership/label/persona/degraded-mode lock.
8. EXTREM profiler maps DISKVIT bottleneck + conflict intensity into WAWE freeze/promotion governance.
9. Maximum graphics unlock thresholds remain explicit and bounded (conflict/latency/GPU).
8. Orchestration score is finite and clamped to `[0, 100]`.
9. B2B scope is additive-only and defines ownership, partner/operator roles, procurement/compliance flow, SLA posture, and audit obligations.
10. B2B activation remains frozen until contract, onboarding, downstream sync, operational approval, and audit controls are satisfied.
11. Downstream B2B sync must include WAWE fields, DUET warning posture, DINKOS metadata, and domain strategy validation.
12. `distanceRatioEkvilaterTable` must remain additive-only, bounded, and deterministic for the three upstream readiness surfaces.
13. `startProject` must preserve START PROJEKAT rollout governance, additive-only contract policy, and required downstream sync.
14. `releaseAuditSummary` must be present and include rollout snapshot, KPI impact, downstream reference, mandatory human review, and rollback requirement.
15. Canonical `ŠEMA + ŠEMA + ALL ŠEMA == MUŠEMA` expression must remain deterministic, surfaced in EXTREM and EXTRONDOL, and block WAWE promotion when invalid.
16. `releaseReadinessScorecard` must remain available as a single-pane lock summary for EXTRIMLI/EXTREM/EXTRONDOL.
17. `canaryRingMetrics` must keep ring sequence and auto-freeze policy visible before promotion.
18. `incidentPlaybook` must preserve `trigger → freeze → rollback → postmortem` flow as required.
19. `contractDriftReport` + `governanceConformance` must stay aligned and fail together when drift is detected.

### NIVO DUET orchestration map

- DUET source signal: `/api/duet/evaluate`
- EXTRONDOL consumes DUET outputs:
  - `valid`
  - `status`
  - `overallScore`
  - `warnings`
- EXTRONDOL maps DUET outputs into:
  - `rollout.currentWawe`
  - `rollout.eligibleNextWawe`
  - `rollout.promotionFreeze`
- U B2B modelu isti DUET signal dodatno utiče na:
  - `b2bReadiness.governanceDecisions.onboardingHold`
  - `b2bReadiness.governanceDecisions.rolloutFreeze`
  - `b2bReadiness.governanceDecisions.escalationRequired`
  - `b2bReadiness.governanceDecisions.partnerReadinessWarnings`
- DUET warning-load i DISSONANT status mogu aktivirati promotion freeze pre WAWE promocije.

### DINKOS domain lock

- Domain: `DINKOS`
- Classification: `signal`
- Persona: `extrimli-dinkos-signal-core`
- Trigger label: `dinkos:logic-change`
- Route segment marker (contractual): `nivo-duet`
- Degraded policy: `partial-payload-no-500`
- B2B governance lock: DINKOS ostaje mandatory signal contract za onboarding hold / rollout freeze / escalation odluke.

## MAKSIMUS ↔ EXTRIMLI responsibilities

- MAKSIMUS koristi `/api/extrimli/extendol` signal kao domen `EXTRIMLI Extended`.
- KORON status i degraded izvori moraju ostati prisutni u Extendol payload-u koji MAKSIMUS koristi.
- DUEL KING readiness signal može biti prisutan kroz EXTRIMLI health, Extendol i KORON payload kada competitive-combat surface utiče na agregat.
- MAKSIMUS preporuke moraju uključiti EXTRIMLI degradaciju kada postoji.
- Integration gate pokriva oba workflow-a: `extrimli-validator` i `maksimus-validator`.

## EXTRIMLI 3 contract

### New capabilities

| Capability | Description |
|---|---|
| **Sport-specific risk profiles** | Each sport has its own multiplier, minimum experience, weighting priorities, and risk bias |
| **Integrated weather-aware risk** | Weather data is normalized and directly influences v3 risk scoring |
| **Athlete readiness signal** | Existing athlete session history is transformed into a readiness score and progress snapshot |
| **Richer health reporting** | v3 health includes profile count, evaluation count, last risk score, and last readiness score |

### Backward compatibility

- All v1 routes under `/api/extrimli/*` remain unchanged.
- EXTRIMLI 3 lives beside v1 as `/api/extrimli-3/*`.
- Existing EXTRIMLI tests continue to validate v1 behavior independently.

### Performance and validation rules

| KPI | Target |
|---|---|
| Risk evaluation | ≤ 50ms |
| DESTRUKCIJA evaluation | ≤ 50ms |
| API response | ≤ 200ms |
| Weather-sensitive sport without weather payload | Invalid |
| Unsupported destruction asset / dimension pair | Invalid |
| Unsupported sport / invalid numeric range | Invalid |
| NaN / Infinity / negative range leakage | 0 |

## DESTRUKCIJA capability

### Product boundary

- DESTRUKCIJA is implemented as a **new public EXTRIMLI capability inside the current v1 surface**.
- Existing EXTRIMLI contracts remain backward-compatible because DESTRUKCIJA is exposed through additive routes under `/api/extrimli/destruction/*`.

### Domain contract

| Area | Coverage |
|---|---|
| Asset types | `wall`, `tower`, `bridge`, `arena`, `vehicle`, `obstacle` |
| Materials | `concrete`, `steel`, `glass`, `wood`, `composite` |
| Dimensions | `360D`, `720D`, `1440D`, `2880D`, `5760D` |
| Outputs | `severityScore`, `severityLevel`, `fragmentCount`, `shockwaveRadiusM`, `rollbackRecommended` |
| Safety | Safe fragment cap, safe shockwave radius, degraded safety clamping |
| Invalid behavior | Unsupported asset/dimension pairs and non-finite ranges are invalid |
| Degraded mode | Over-limit outputs are returned with `degraded = true` and `degradedMode = safety-clamped-output` |

### DESTRUKCIJA routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/extrimli/destruction` | Evaluate destructive impact for a supported EXTRIMLI asset |
| POST | `/api/extrimli/destruction/preview` | Read-only simulation preview with degraded safety signaling |
| GET | `/api/extrimli/destruction/assets` | List destructible assets with optional filters |
| GET | `/api/extrimli/destruction/assets/[id]` | Retrieve a single destructible asset |
| GET | `/api/extrimli/destruction/health` | DESTRUKCIJA-specific health and metrics |

All DESTRUKCIJA routes respond with headers:
- `X-Extrimli-Contract-Version: v1`
- `X-Extrimli-Destrukcija-Contract-Version: v1-destrukcija`
- `X-Extrimli-Destrukcija-Module-Version: 1.0.0`

## EXTRIMLI 3 library modules

| Module | File | Responsibility |
|---|---|---|
| Types | `src/lib/extrimli-3/types.ts` | v3 contract, profile, readiness, and health types |
| Profiles | `src/lib/extrimli-3/profiles.ts` | Sport-specific multipliers, weighting, and validation |
| Risk Engine | `src/lib/extrimli-3/risk-engine.ts` | Weather-aware risk scoring and athlete readiness integration |
| Index | `src/lib/extrimli-3/index.ts` | Public API surface |

## EXTRIMLI 3 API routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/extrimli-3/risk` | Weather-aware risk evaluation with optional `athleteId` history |
| GET | `/api/extrimli-3/sports` | List v3 sport risk profiles with linked sport metadata |
| GET | `/api/extrimli-3/health` | v3 health report |

All v3 routes respond with headers:
- `X-Extrimli3-Contract-Version: v3`
- `X-Extrimli3-Module-Version: 3.0.0`

## EKSTREMNO processing surface (`/api/ekstremno-procesuiranje-svega`)

### Goal
- Provide a no-500 extreme processing snapshot that aggregates core platform signals into one scheduler and readiness payload.
- Keep score interpretation stable over time with explicit domain weights and contract metadata.

### Aggregated signal sources
- `statistika`
- `auto-repair.diagnostics`
- `kompanija-spaja-operativa`
- `autofinish-petlja.summary`
- `autofinish-petlja.health`
- `proksi-github-deploy`

### KPI targets
- `throughputPerMin >= 1200`
- `latencyMsP95 <= 300`
- `errorRatePct <= 2`
- `queueDepth <= 80`

### Degraded policy
- Contract mode: `partial-payload-no-500`
- Behavior: endpoint returns HTTP 200 with degraded metadata and audit signal instead of hard-failing the API.
- Required metadata fields:
  - `meta.degraded`
  - `meta.degradedMode`
  - `meta.degradedSources`
  - `meta.auditSignal`
  - `meta.signalSources`
  - `meta.domainWeights`

### Response headers
- `X-Procesuiranje-Contract-Version`
- `X-Procesuiranje-Model-Version`
- `X-Procesuiranje-Source-Of-Truth`
- `X-Procesuiranje-Mode`
- `X-Procesuiranje-Degraded`
- `X-Procesuiranje-Degraded-Mode`
- `X-Procesuiranje-Degraded-Sources-Count`
- `X-Procesuiranje-Audit-Signal`
- `X-Procesuiranje-Queue-Depth`
- `X-Procesuiranje-Fairness-Index`

## EXTRIMLI 3 risk input

```json
{
  "sportId": "paragliding",
  "athleteExperience": 8,
  "terrainDifficulty": 4,
  "gearQualityIndex": 9,
  "athleteId": "ath-123",
  "weatherData": {
    "windSpeedKph": 12,
    "precipitationMm": 0,
    "temperatureC": 18,
    "visibilityKm": 10
  },
  "referenceId": "risk-check-001"
}
```

## Contract version

| Field | Value |
|---|---|
| `EXTRIMLI_CONTRACT_VERSION` | `v1` |
| `EXTRIMLI_MODULE_VERSION` | `1.0.0` |
| `EXTRIMLI_DESTRUKCIJA_CONTRACT_VERSION` | `v1-destrukcija` |
| `EXTRIMLI_DESTRUKCIJA_MODULE_VERSION` | `1.0.0` |
| `EXTRIMLI3_CONTRACT_VERSION` | `v3` |
| `EXTRIMLI3_MODULE_VERSION` | `3.0.0` |
| `EXTRIMLI_DUEL_KING_KUR_CONTRACT_VERSION` | `v1-kur-game` |
| `EXTRIMLI_DUEL_KING_DUR_CONTRACT_VERSION` | `v1-dur-game` |
| `EXTRIMLI_DUEL_KING_MOL_CONTRACT_VERSION` | `v1-mol-game` |
| `EXTRIMLI_EXTENDOL_CONTRACT_VERSION` | `v1` |
| `EXTRIMLI_EXTENDOL_MODULE_VERSION` | `1.0.0` |
| `EXTRIMLI3_PERSONA_ID` | `extrimli-core` |
| Trigger labels | `extrimli:logic-change` |
| External GitHub labels | `extrimli:external-github`, `agent:config-change` |
| EKSTREMNO trigger labels | `extrimli:logic-change`, `ekstremno:logic-change` |
| Octave | 7 |
| Hipermreza node | 56 |

## Audit reference

```
AI-IQ-SUPER-PLATFORMA#EXTRIMLI-003 -> IO-OPENUI-AO#<follow-up issue>
```

Downstream note: ako linked repo `spaja86/IO-OPENUI-AO` koristi DUEL KING readiness, sinhronizovati KUR/DUR/MOL telemetry (`kurTelemetryStatus`, `durTelemetryStatus`, `molTelemetryStatus`, `lastKurSignalStatus`, `lastDurSignalStatus`, `lastMolSignalStatus`, `kurSignalCoverageScore`, `durSignalCoverageScore`, `molSignalCoverageScore`) kroz `docs/MULTI-REPO-LINKS.md`.

## References

- Canonical GitHub governance plan: `docs/EXTRIMLI-EXTERNAL-GITHUB.md`
- Validator workflow: `.github/workflows/extrimli-validator.yml`
- GitHub governance workflow: `.github/workflows/extrimli-external-github.yml`
- Deploy workflows: `.github/workflows/extrimli-spaja-deploy.yml`, `.github/workflows/extrimli-trance-extrem-deploy.yml`
- Multi-repo links: `docs/MULTI-REPO-LINKS.md`

## PROGRAMSKI JEZIK INFORMACIONIH TOKOVA

- `PROGRAMSKI JEZIK INFORMACIONIH TOKOVA (upravljanje numeričkim tokovima informacija)` je novi additive-only track nad postojećim EXTRIMLI / EXTREM / EXTRONDOL / AI IQ PROGRAMSKI JEZIK modelom.
- `FOR` i numerički tokovi pripadaju tehničkom signalnom sloju i ostaju vezani za postojeći PETLJE model kao osnovni range/sekvencijalni mehanizam.
- `DOK + DIK` ostaju EXTREM tehnički dokaz.
- `DAK + DUK` ostaju EXTRONDOL governance odluka.
- `SPAJA KOD` ostaje samo audit-safe summary boundary.
- Jezgrene metrike toka su: stabilnost numeričkog toka, sekvencijalni integritet, drift/konflikt, saturacija/opterećenje i readiness za nastavak obrade.
- Dozvoljene status klase su `READY | WATCH | BLOCKED`, uz deterministički fallback za `NaN`, `Infinity`, prazne sekvence i nevalidne opsege.
- `releaseReadinessScorecard`, `canaryRingMetrics`, `contractDriftReport` i `governanceConformance` ostaju zaključani i za ovaj track.

## PROGRAMSKI JEZIK PRETPOSTAVKA

- `PROGRAMSKI JEZIK PRETPOSTAVKA (KLJUČNE INFORMACIJE SA UČINIM OBLIKOM)` je additive-only interpretacioni track unutar istog `EXTRIMLI / EXTREM / EXTRONDOL / AI IQ PROGRAMSKI JEZIK` modela.
- **Pretpostavka** znači deterministički polazni okvir pretpostavke; **ključne informacije** znače obavezni skup ključnih informacija; **učini oblik** znači akcioni oblik za izlaznu interpretaciju.
- `FOR` ostaje sekvencijalni ili strukturisani ulazni tok u EXTREM sloju, `DOK` ostaje target-stability dokaz, `DIK` ostaje sequence-improvement dokaz, dok `DAK + DUK` ostaju EXTRONDOL governance odluka za promotion i human review.
- Jezgrene metrike track-a su: stabilnost, integritet ključnih informacija, determinističnost učinog oblika, drift/konflikt, saturacija/opterećenje i readiness nastavka.
- Dozvoljene status klase su `READY | WATCH | BLOCKED`.
- Obavezni fallback uslovi ostaju aktivni za prazne, nevalidne i nedeterminističke ulaze, kao i za `NaN`, `Infinity`, nevalidne opsege i svaki signal koji aktivira drift-zero blokadu.
- `releaseAuditSummary`, rollback zahtev, WAWE 1–5 uticaj, downstream sync prema `spaja86/IO-OPENUI-AO` i `SPAJA KOD` audit-safe summary ostaju zaključani bez novih source-of-truth ruta.

## PROGRAMSKI JEZIK PO PROSPARITETU DEKLASIRANE MATRICE U EKSTAZI

- `PROGRAMSKI JEZIK PO PROSPARITETU DEKLASIRANE MATRICE U EKSTAZI (PREDISPOZIJA EKSTREMNIH GLASOVNIH KOMANDI U ETAPSIKM SENZACIJAMA)` je additive-only track u okviru postojećeg `EXTRIMLI / EXTREM / EXTRONDOL / AI IQ PROGRAMSKI JEZIK` modela.
- `PROSPARITET` ostaje repo-local input-domain-only interpretacioni domen; ne postaje nova source-of-truth ruta ni novi javni runtime surface.
- `DOK + DIK + FOR` ostaju EXTREM tehnički signal za readiness deklasiranih matrica, prosparitet alignment, predispoziciju glasovnih komandi, etapsikm stage-cohesion, konflikt/degradaciju i FOR sekvencijalni tok.
- `DAK + DUK` ostaju EXTRONDOL governance odluka za `WAWE`, `promotionFreeze`, `humanReviewRequired`, `rollbackPlanRequired`, `releaseAuditSummary` i downstream sync prema `spaja86/IO-OPENUI-AO`.
- `SPAJA KOD` ostaje audit-safe summary boundary bez izlaganja raw tehničkih detalja.
- Dozvoljene status klase ostaju `READY | WATCH | BLOCKED`, uz deterministički fallback za `NaN`, `Infinity`, prazne ili nevalidne signale, nevalidne sekvence i out-of-range procente.
- Detaljna specifikacija: `docs/PROGRAMSKI-JEZIK-PO-PROSPARITETU-DEKLASIRANE-MATRICE-U-EKSTAZI.md`.

## PROGRAMSKI JEZIK DEKORACIJE OBJEKTNIH PRIMESA

- Kanonski naziv trake je zaključan: `PROGRAMSKI JEZIK DEKORACIJE OBJEKTNIH PRIMESA (BROJČANI ZUPČANIK PETLJI U EKSTAZNOM OBLIKU ŠPEDICIJE – SVESTRANOST U SVESTRANOSTI)`.
- Traka je additive-only i ostaje unutar postojećeg `EXTRIMLI-EXTRONDOL-EXTREM` profila bez novih source-of-truth ruta.
- Ownership split je zaključan: `DOK/DIK/FOR` tehnički signal pripada EXTREM sloju, `DAK/DUK` governance signal pripada EXTRONDOL sloju, a `SPAJA KOD` izlaže samo audit-safe zbirni status.
- Formalna semantika ostaje zaključana: `dekoracije objektnih primesa` kao objektno-funkcionalni signalni domen i `brojčani zupčanik petlji` kao FOR-sekvencijalni stabilizacioni sloj.
- Dozvoljene status klase ostaju `READY | WATCH | BLOCKED`, uz obavezan deterministic fallback za `NaN`, `Infinity`, out-of-range vrednosti i nevalidne sekvence.
- Governance mapiranje ostaje direktno povezano sa `promotionFreeze`, `humanReviewRequired`, `rollbackPlanRequired`, `releaseAuditSummary`, WAWE progresijom i downstream referencom ka `spaja86/IO-OPENUI-AO`.
- Public boundary ostaje zaključan: nema curenja internih tehničkih detalja u SPAJA KOD ili druge javne slojeve.


## PROGRAMSKI JEZIK PARADIGMA I OBLIKOVANJE TELA

- `PROGRAMSKI JEZIK PARADIGMA I OBLIKOVANJE TELA (OBJEKAT U SISTEMU, ADAPTACIJA SA FUNKCIJAMA)` je additive-only track unutar postojećih `/api/extrimli/extrem` + `/api/extrimli/extrondol` granica.
- EXTREM zaključava tehnički signal za objekat/stanje/metode/delegaciju/FOR, dok EXTRONDOL zaključava WAWE, freeze, human-review, releaseAuditSummary i rollback interpretaciju.
- SPAJA KOD prikazuje samo zbirni audit-safe status; raw objektni, funkcionalni i FOR signali ostaju repo-local u EXTREM + EXTRONDOL sloju.
- Downstream sync koristi samo `extremProfiler.programskiJezikParadigmaOblikovanjeTela.readiness`, `programskiJezikParadigmaOblikovanjeTela.waweImpact`, `releaseAuditSummary.programskiJezikParadigmaOblikovanjeTelaGovernance` i `spajaKod.publicSignals.programskiJezikParadigmaOblikovanjeTelaStatus`.
- Detaljna specifikacija: `docs/PROGRAMSKI-JEZIK-PARADIGMA-I-OBLIKOVANJE-TELA.md`.

## PROGRAMSKI JEZIK SPECIJALIZOVAN ZA IGRICE

- `PROGRAMSKI JEZIK SPECIJALIZOVAN ZA IGRICE` je additive-only gaming track unutar postojećih `/api/ai-iq-programski-jezik/*`, `/api/extrimli/extrem` i `/api/extrimli/extrondol` granica.
- `AI IQ PROGRAMSKI JEZIK` ostaje DSL/orchestration sloj; `EXTREM` zaključava gameplay/runtime tehnički signal (`DOK + DIK + FOR`); `EXTRONDOL` zaključava `DAK + DUK` promotion/human-review governance i WAWE freeze/rollback/audit/downstream-sync pravila.
- Kanonski gaming domen profila obuhvata: kategoriju igrice, runner kompatibilnost, dimenzionalni režim, render/fizika, AI/NPC ponašanje, multiplayer/sync, anti-cheat i analytics/performance readiness.
- Javni izlaz ostaje audit-safe summary, a postojeći gaming potrošači ostaju `src/lib/igrice.ts` i `src/lib/gaming-endzin.ts`.
- Downstream sync koristi samo audit-safe polja: `extremProfiler.programskiJezikSpecijalizovanZaIgrice.readiness`, `programskiJezikSpecijalizovanZaIgrice.waweImpact`, `releaseAuditSummary.programskiJezikSpecijalizovanZaIgriceGovernance` i `spajaKod.publicSignals.programskiJezikSpecijalizovanZaIgriceStatus`.
