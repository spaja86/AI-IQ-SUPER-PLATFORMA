# AGENTS

Ovo je dokument koji opisuje agente, njihove uloge i pravila korišćenja u ovom repozitorijumu za mega-platformu.

## Purpose / Svrha
- Define agent roles, responsibilities, and how they should be used in CI / automation.
- Koordinacija između više povezanih repozitorijuma (IO-OPENUI-AO, gaming calculator, itd.)
- Održavanje stabilnosti i sigurnosti kroz multi-repo sinhronizaciju.

## Open Code Program / Program otvorenog koda

- Javno u repozitorijumu ostaju: aplikacioni kod, dokumentacija, workflow definicije, agent pravila i PR proces.
- Linked-repo promene prema `spaja86/IO-OPENUI-AO` moraju imati jasan downstream opis u PR-u i referencu u `docs/MULTI-REPO-LINKS.md`.
- Operativne kontrole ostaju van repozitorijuma: GitHub Secrets, Vercel secrets, deploy hook URL-ovi, privatni ključevi i produkcioni kredencijali.
- Delivery model prati XP principe: kratke iteracije, kontinuirana integracija, test-first za rizične promene, mala/frekventna izdanja i obavezan human-review.

## Agent Roles / Uloge Agenta

### human-review
- Zahteva ljudsku proveru pre merge-a.
- Komentiše na PR-u sa detaljnim povratnim informacijama.
- Odgovoran za quality assurance na svim kritičnim promenama.

### ci-bot
- Automatska provera i formatiranje (lint, tests).
- Proverava TypeScript, JavaScript, Python zavisnosti.
- Pokušava automatsku ispravku manjих problema (format, linting).
- **Multi-repo scope**: Pokreće testove u svim povezanim repozitorijumima.

### deploy-bot
- Obavlja deploy kada su testovi prošli.
- Ne može deploy-ovati bez green status od ci-bot-a.
- Ostavlja audit log u PR komentar.
- **Multi-repo scope**: Sinhronizuje deploymente između povezanih platformi.

### security-scanner
- **Role**: Automated security scanning (dependencies, secrets, SAST)
- **Scope**: Sva repozitorijuma u organizaciji i multi-repo linkovi
- **Trigger**: Na svakom PR-u, svakodnevni nightly scans
- **Actions**: 
  - Auto-label PRs sa `security:review-needed` ako ima kritičnog nalaza
  - Blokira merge ako je pronađena kritična ranjivost
  - Skenira za lozinke, tokene, sekrete u kodu
  - Proverava zavisnosti (npm audit, pip audit, cargo audit)
  - **Multi-repo check**: Skenira sve linkove između repozitorijuma

### multi-repo-sync-agent (NEW)
- **Role**: Sinhronizacija konfiguracije i status između povezanih repozitorijuma
- **Scope**: AI-IQ-SUPER-PLATFORMA ↔ IO-OPENUI-AO i drugi povezani repo-ji
- **Trigger**: Na Push-u na main branch, weekly sync, manual trigger
- **Actions**:
  - Proverava verzije zavisnosti koherencije
  - Sinhronizuje `.agent-config.json` između repozitorijuma
  - Ažurira README references i inter-repo links
  - Sinhronizuje labels, milestones, i project status
  - Ostavlja detailed audit log sa linkovima između PRs

### calculator-validator-agent (NEW)
- **Role**: Validacija logike gaming calculator-a (IO-OPENUI-AO)
- **Scope**: Samo IO-OPENUI-AO i calculator-specific branches
- **Trigger**: PR sa labelom `calculator:logic-change`, push na `calc-*` branches
- **Actions**:
  - Pokreće custom test suite za calculator logiku
  - Verifikuje matematičke rezultate i edge cases
  - Proverava performance (execution time < 100ms)
  - Skenira za nedoslednosti u kodu (NaN, Infinity, division by zero)
  - Auto-labels sa `calculator:validated` ili `calculator:needs-review`

### analytics-bot (NEW)
- **Role**: Tracking agent performance, metrics, i automation health
- **Scope**: Sva repozitorijuma, nema ograničenja
- **Trigger**: Nightly, weekly summary, on-demand
- **Actions**:
  - Broji number of automated reviews, deployments, security findings
  - Prati average PR review time
  - Generiše monthly reports u Issues ili Discussions
  - Identifikuje failing patterns (which tests fail most often)
  - Sinhronizuje metrics između repozitorijuma

### nova-generacija-agent (NEW)
- **Role**: Autonomna orkestracija i koordinacija Nova Generacija platforme
- **Scope**: Svi repozitorijumi — SUPER-PLATFORMA, IO-OPENUI-AO i budući linked repo-ji
- **Trigger**: PR sa labelom `nova-generacija`, push koji dira `nova-generacija` putanje, weekly sync
- **Actions**:
  - Validira sva `nova-generacija` Nova Generacija Nova Generacija modula pre aktivacije
  - Proverava SpajaPro 16 Hipermreza (16×16, 256 čvorova) integritet
  - Pokreće Nova Generacija Gaming fairness provere
  - Sinhronizuje Nova Generacija feature flag status između repozitorijuma
  - Verifikuje cross-platform persona sinhronizaciju (50 persona / 16 oktava)
  - Enforces performance KPI: evaluacija ≤ 50ms, build ≤ 3 min
  - Auto-labels PRs sa `nova-generacija:validated` ili `nova-generacija:needs-review`
  - Pokreće self-healing dijagnostiku kada se detektuju anomalije
  - Koordinira industrijska konvergencija između platformi
  - Ostavlja audit log sa svim Nova Generacija metrikama

### gigatron-validator-agent (NEW)
- **Role**: Validacija GIGATRON IT & Elektronika procurement logike, affiliate kalkulacija i inventory integriteta
- **Scope**: GIGATRON putanje u AI-IQ-SUPER-PLATFORMA (`src/lib/gigatron/**`, `src/app/api/gigatron/**`)
- **Trigger**: PR sa labelom `gigatron:logic-change`, push koji dira `gigatron` putanje
- **Actions**:
  - Pokreće unit test suite za katalog logiku (cene, kategorije, SKU validacija)
  - Verifikuje procurement model (narudžbine, edge cases: nulte zalihe, cenovni limiti, PDV)
  - Proverava affiliate provizija kalkulator (% komisija, kumulativno tracking)
  - Proverava performance: API response ≤ 200ms
  - Skenira za nedoslednosti u kodu (negativne cene, neispravan PDV, nevalidni SKU)
  - Auto-labels PRs sa `gigatron:validated` ili `gigatron:needs-review`
  - Ostavlja audit log u PR komentaru

### decibil-validator-agent (NEW)
- **Role**: Validacija DECIBIL audio/signal measurement logike, dBFS kalkulacija i edge case integriteta
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/decibil/**`, `src/app/api/decibil/**`, `src/components/decibil/**`
- **Trigger**: PR sa labelom `decibil:logic-change`, push koji dira `decibil` putanje
- **Actions**:
  - Pokreće unit test suite za DECIBIL logiku (RMS, peak, dBFS konverzija, status, history)
  - Verifikuje matematičke rezultate i edge cases (NaN, Infinity, division by zero, prazni nizovi)
  - Proverava performance KPI: evaluacija ≤ 50ms, API response ≤ 200ms
  - Skenira za nedoslednosti u kodu (negativne dBFS iznad 0, nevalidni uzorci)
  - Auto-labels PRs sa `decibil:validated` ili `decibil:needs-review`
  - Ostavlja audit log u PR komentaru
  - **Nova Generacija integration**: Audio fairness provere u gaming kontekstu

### discount-telecom-validator-agent (NEW)
- **Role**: Validacija Discount Telecom logike — globalni operator katalog, discount kalkulacija, eligibility i edge case integritet
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/discount-telecom/**`, `src/app/api/discount-telecom/**`, `src/components/discount-telecom/**`
- **Trigger**: PR sa labelom `discount-telecom:logic-change`, push koji dira `discount-telecom` putanje
- **Actions**:
  - Pokreće unit test suite za Discount Telecom logiku (operator registry, discount engine, stacking, cap, eligibility)
  - Verifikuje matematičke rezultate i edge cases (NaN, Infinity, negativne cene, nulte cene, nevalidni operatori)
  - Proverava performance KPI: evaluacija ≤ 50ms, API response ≤ 200ms
  - Skenira za nedoslednosti u kodu (negativni discount %, nevalidni network type)
  - Auto-labels PRs sa `discount-telecom:validated` ili `discount-telecom:needs-review`
  - Ostavlja audit log u PR komentaru
  - **Persona**: `discount-telecom-global` (octave: 8, hipermreza node: 64)
  - **Multi-repo sync**: Sinhronizuje operator catalog snapshots ka `spaja86/IO-OPENUI-AO`

### mirikl-validator-agent (NEW)
- **Role**: Validacija MIRIKL governance logike — GitHub quality gate orkestracija, Vercel deploy boundary i cross-repo audit integritet
- **Scope**: AI-IQ-SUPER-PLATFORMA — `docs/MIRIKL.md`, `.agent-config.json`, `.github/workflows/mirikl-validator.yml`, `.github/workflows/vercel-deploy.yml`, `docs/MULTI-REPO-LINKS.md`
- **Trigger**: PR sa labelom `mirikl:logic-change`, push koji dira MIRIKL governance putanje
- **Actions**:
  - Pokreće release gate validaciju (build, lint, test, smoke, predeploy, security)
  - Verifikuje da je Vercel Git integracija primarni deploy source of truth
  - Verifikuje da GitHub Actions ostaje governance/audit layer
  - Proverava rollout/rollback i KPI audit sekcije u summary izlazu
  - Auto-labels PRs sa `mirikl:validated` ili `mirikl:needs-review`
  - Ostavlja audit log u workflow summary-ju
  - **OKRID**: `OKRID-2026-MIRIKL-001`
  - **Tracking Issue**: `#920`

### great-sumbion-validator-agent (NEW)
- **Role**: Validacija GREAT SUMBION logike — weighted score orkestracija, tier klasifikacija i edge case integritet
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/great-sumbion/**`, `src/app/api/great-sumbion/**`, `src/components/great-sumbion/**`
- **Trigger**: PR sa labelom `great-sumbion:logic-change`, push koji dira `great-sumbion` putanje
- **Actions**:
  - Pokreće unit test suite za GREAT SUMBION logiku (score engine, tier mapping, health)
  - Verifikuje matematičke rezultate i edge cases (NaN, Infinity, negativne vrednosti, division by zero)
  - Proverava performance KPI: evaluacija ≤ 50ms, API response ≤ 200ms
  - Skenira za nedoslednosti u kodu i sekrete
  - Auto-labels PRs sa `great-sumbion:validated` ili `great-sumbion:needs-review`
  - Ostavlja audit log u PR komentaru
  - **Persona**: `great-sumbion-core` (octave: 9, hipermreza node: 72)

### konvencionalni-odnosi-validator-agent (NEW)
- **Role**: Validacija KONVENCIONALNI ODNOSI logike — scoring kvaliteta odnosa, balans dimenzija i integritet edge case-ova
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/konvencionalni-odnosi/**`, `src/app/api/konvencionalni-odnosi/**`
- **Trigger**: PR sa labelom `konvencionalni-odnosi:logic-change`, push koji dira `konvencionalni-odnosi` putanje
- **Actions**:
  - Pokreće unit i route test suite za KONVENCIONALNI ODNOSI logiku
  - Verifikuje determinističke rezultate, tier/status mapping i upozorenja za nekonzistentne obrasce
  - Proverava edge case-ove (`NaN`, `Infinity`, negativne vrednosti, prazni ulazi, score > 100)
  - Proverava performance KPI: evaluacija ≤ 50ms, API response ≤ 200ms
  - Skenira za nedoslednosti u kodu i sekrete
  - Auto-labels PRs sa `konvencionalni-odnosi:validated` ili `konvencionalni-odnosi:needs-review`
  - Ostavlja audit log u PR komentaru
  - **Persona**: `konvencionalni-odnosi-core` (octave: 14, hipermreza node: 112)

### trenazer-validator-agent (NEW)
- **Role**: Validacija TRENAŽER logike — training readiness scoring, intensity preporuke i duration integritet
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/trenazer/**`, `src/app/api/trenazer/**`, `src/components/trenazer/**`
- **Trigger**: PR sa labelom `trenazer:logic-change`, push koji dira `trenazer` putanje
- **Actions**:
  - Pokreće unit i route test suite za TRENAŽER logiku
  - Verifikuje determinističke readiness rezultate i edge cases (`NaN`, `Infinity`, negativne vrednosti, sleep > 24h, duration cap)
  - Proverava performance KPI: evaluacija ≤ 50ms, API response ≤ 200ms
  - Skenira za nedoslednosti u kodu i sekrete
  - Auto-labels PRs sa `trenazer:validated` ili `trenazer:needs-review`
  - Ostavlja audit log u PR komentaru
  - **Persona**: `trenazer-coach-core` (octave: 6, hipermreza node: 48)

### dumbir-validator-agent (NEW)
- **Role**: Validacija ÐUMBIR logike — ginger wellness scoring, potency/comfort balans i API contract integritet
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/dumbir/**`, `src/app/api/dumbir/**`
- **Trigger**: PR sa labelom `dumbir:logic-change`, push koji dira `dumbir` putanje
- **Actions**:
  - Pokreće unit i route test suite za ÐUMBIR logiku
  - Verifikuje determinističke rezultate i edge cases (`NaN`, `Infinity`, negativne vrednosti, unsupported addons, serving bounds)
  - Proverava performance KPI: evaluacija ≤ 50ms, API response ≤ 200ms
  - Skenira za nedoslednosti u kodu i sekrete
  - Auto-labels PRs sa `dumbir:validated` ili `dumbir:needs-review`
  - Ostavlja audit log u PR komentaru
  - **Persona**: `dumbir-wellness-core` (octave: 12, hipermreza node: 96)

### mrkli-mrak-validator-agent (NEW)
- **Role**: Validacija MRKLI MRAK logike — darkness readiness scoring, status klasifikacija i edge-case integritet
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/mrkli-mrak/**`, `src/app/api/mrkli-mrak/**`
- **Trigger**: PR sa labelom `mrkli-mrak:logic-change`, push koji dira `mrkli-mrak` putanje
- **Actions**:
  - Pokreće unit i route test suite za MRKLI MRAK logiku
  - Verifikuje determinističke rezultate i edge cases (`NaN`, `Infinity`, invalid ranges, prazni payload)
  - Proverava performance KPI: evaluacija ≤ 50ms, API response ≤ 200ms
  - Skenira za nedoslednosti u kodu i sekrete
  - Auto-labels PRs sa `mrkli-mrak:validated` ili `mrkli-mrak:needs-review`
  - Ostavlja audit log u PR komentaru
  - **Persona**: `mrkli-mrak-core` (octave: 11, hipermreza node: 89)

### paraksil-validator-agent (NEW)
- **Role**: Validacija PARAKSIL logike — generički sandbox za testiranje modula, scoring validacije i release gate klasifikaciju
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/paraksil/**`, `src/app/api/paraksil/**`
- **Trigger**: PR sa labelom `paraksil:logic-change`, push koji dira `paraksil` putanje
- **Actions**:
  - Pokreće unit i route test suite za PARAKSIL logiku
  - Verifikuje determinističke rezultate i edge cases (`NaN`, `Infinity`, negativne vrednosti, mismatch totals, unsupported suite)
  - Proverava performance KPI: evaluacija ≤ 50ms, API response ≤ 200ms
  - Skenira za nedoslednosti u kodu i sekrete
  - Auto-labels PRs sa `paraksil:validated` ili `paraksil:needs-review`
  - Ostavlja audit log u PR komentaru
  - **Persona**: `paraksil-validator-core` (octave: 6, hipermreza node: 49)

### madagaskar-validator-agent (NEW)
- **Role**: Validacija MADAGASKAR logike — egzotična tržišna inteligencija, rarity premium kalkulacija, sustainability scoring i procurement integritet (v1 + v2: FX, aukcije, traceability, basket)
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/madagaskar/**`, `src/app/api/madagaskar/**`, `src/components/madagaskar/**`, `src/lib/madagaskar-2/**`, `src/app/api/madagaskar-2/**`
- **Trigger**: PR sa labelom `madagaskar:logic-change` ili `madagaskar-2:logic-change`, push koji dira `madagaskar` ili `madagaskar-2` putanje
- **Actions**:
  - Pokreće unit test suite za MADAGASKAR logiku (registry, engine, utils — v1 + v2: fx, auction, traceability, basket, engine)
  - Verifikuje matematičke rezultate i edge cases (NaN, Infinity, negativne količine, nevalidni IDs)
  - Proverava performance KPI: evaluacija ≤ 50ms, API response ≤ 200ms
  - Skenira za nedoslednosti u kodu (negativne cene, nevalidni rarity, nevalidni sustainability score)
  - Auto-labels PRs sa `madagaskar:validated` / `madagaskar-2:validated` ili `madagaskar:needs-review` / `madagaskar-2:needs-review`
  - Ostavlja audit log u PR komentaru
  - **Persona**: `madagaskar-exotic-market` (octave: 5, hipermreza node: 40)
  - **Multi-repo sync**: Sinhronizuje exotic goods catalog snapshots (v1 + v2) ka `spaja86/IO-OPENUI-AO`

### extrimli-validator-agent (NEW)
- **Role**: Validacija EXTRIMLI logike — extreme sports risk scoring, athlete performance tracking, gear catalog integrity i event management
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/extrimli/**`, `src/app/api/extrimli/**`, `src/components/extrimli/**`
- **Trigger**: PR sa labelom `extrimli:logic-change`, push koji dira `extrimli` putanje
- **Actions**:
  - Pokreće unit test suite za EXTRIMLI logiku (registry, risk-engine, performance-tracker, gear-catalog, event-engine, weather-adapter)
  - Verifikuje matematičke rezultate i edge cases (NaN, Infinity, negativne cene, nulti stock, division by zero)
  - Proverava performance KPI: evaluacija ≤ 50ms, API response ≤ 200ms
  - Skenira za nedoslednosti u kodu (negativni risk score, nevalidni SKU, neispravni gear)
  - Auto-labels PRs sa `extrimli:validated` ili `extrimli:needs-review`
  - Ostavlja audit log u PR komentaru
  - **Persona**: `extrimli-core` (octave: 7, hipermreza node: 56)
  - **Multi-repo sync**: Sinhronizuje gear catalog snapshots ka `spaja86/IO-OPENUI-AO`

### extrimli-cuz-validator-agent (NEW)
- **Role**: Validacija EXTRIMLI CUZ logike — community & social hub, crew formation, mentorship matching, community feed i peer reputation
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/extrimli-cuz/**`, `src/app/api/extrimli-cuz/**`, `src/components/extrimli-cuz/**`
- **Trigger**: PR sa labelom `extrimli-cuz:logic-change`, push koji dira `extrimli-cuz` putanje
- **Actions**:
  - Pokreće unit test suite za EXTRIMLI CUZ logiku (crew-engine, mentor-engine, feed-engine, reputation-engine)
  - Verifikuje matematičke rezultate i edge cases (NaN, Infinity, prazni nizovi, division by zero, self-rating, duplicate votes)
  - Proverava performance KPI: evaluacija ≤ 50ms, API response ≤ 200ms
  - Skenira za nedoslednosti u kodu (nevalidni experienceLevel, negativni score, nevalidni ratingovi)
  - Auto-labels PRs sa `extrimli-cuz:validated` ili `extrimli-cuz:needs-review`
  - Ostavlja audit log u PR komentaru
  - **Persona**: `extrimli-cuz-social` (octave: 7, hipermreza node: 57)
  - **Multi-repo sync**: Sinhronizuje crew/mentor catalog snapshots ka `spaja86/IO-OPENUI-AO`

### digit-engine-validator-agent (NEW)
- **Role**: Validacija Digit Intelligence Engine logike — 10-cifreni simbolički slojevi, registar, API integritet i performanse
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/digit-engine/**`, `src/app/api/digit-engine/**`
- **Trigger**: PR sa labelom `digit-engine:change`, push koji dira `digit-engine` putanje
- **Actions**:
  - Pokreće unit test suite za Digit Engine logiku (registry, getDigitDescriptor, getDigitByNode, listAllDigits)
  - Verifikuje da su sva 10 cifara (0–9) registrovana sa ispravnim poljima
  - Proverava performance KPI: lookup ≤ 10ms, bulk list ≤ 50ms, API response ≤ 200ms
  - Verifikuje edge cases: digit = -1, digit = 10, NaN, Infinity → undefined/404
  - Skenira za nedoslednosti u kodu i sekrete
  - Auto-labels PRs sa `digit-engine:validated` ili `digit-engine:needs-review`
  - Ostavlja audit log u PR komentaru
  - **Persona**: `digit-engine-core` (octave: 10, hipermreza node: 80)
  - **Multi-repo sync**: Sinhronizuje digit registry snapshots ka `spaja86/IO-OPENUI-AO`

### maksimus-validator-agent (NEW)
- **Role**: Validacija MAKSIMUS logike — analitička orkestracija, razvojna strategija, platforma koordinacija i cross-agent handoff integritet
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/maksimus/**`, `src/app/api/maksimus/**`
- **Trigger**: PR sa labelom `maksimus:logic-change`, push koji dira `maksimus` putanje, weekly schedule (sreda 04:00 UTC)
- **Actions**:
  - Pokreće unit test suite za MAKSIMUS logiku (identity, orchestrator, handoff, store)
  - Verifikuje persona sinhronizaciju i handoff logiku ka ANOTHER MAKS
  - Proverava performance KPI: evaluacija ≤ 50ms, build ≤ 3 min
  - Skenira za nedoslednosti i sekrete u MAKSIMUS modulima
  - Auto-labels PRs sa `maksimus:validated` ili `maksimus:needs-review`
  - Ostavlja audit log u PR komentaru
  - **Specijalizacija**: Analitička orkestracija, razvojna strategija, platforma koordinacija
  - **Linked agent**: ANOTHER MAKS (kreativni agent)
  - **Nova Generacija integration**: Hipermreza node 128, octave 13, persona sync aktivan

### epekm-denter-validator-agent (NEW)
- **Role**: Validacija EPEKM-D logike — permanentni email identiteti, dostava poruka, alias rezolucija i integritet orchestratora
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/epekm-denter/**`, `src/app/api/epekm-denter/**`, `src/components/epekm-denter/**`
- **Trigger**: PR sa labelom `epekm-denter:logic-change`, push koji dira `epekm-denter` putanje
- **Actions**:
  - Pokreće unit test suite za EPEKM-D logiku (identity-registry, routing-engine, email-engine, delivery-tracker, denter-orchestrator)
  - Verifikuje matematičke rezultate i edge cases (NaN, Infinity, prazni alias, duplikat identiteta, null agentRef, dostava na arhivirani identitet)
  - Proverava performance KPI: evaluacija ≤ 50ms, API response ≤ 200ms, delivery ack ≤ 500ms
  - Skenira za nedoslednosti u kodu i sekrete
  - Auto-labels PRs sa `epekm-denter:validated` ili `epekm-denter:needs-review`
  - Ostavlja audit log u PR komentaru
  - **Persona**: `epekm-denter-core` (octave: 11, hipermreza node: 88)
  - **Multi-repo sync**: Sinhronizuje email identity snapshots ka `spaja86/IO-OPENUI-AO`
  - **Linked agents**: MAKSIMUS, ANOTHER MAKS, persona-bank-agent

### dijagnoza-validator-agent (NEW)
- **Role**: Validacija DIJAGNOZA logike — health diagnostic scoring, izračunavanje diferencijalnih dijagnoza, urgency triage i edge case integritet
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/dijagnoza/**`, `src/app/api/dijagnoza/**`, `src/components/dijagnoza/**`
- **Trigger**: PR sa labelom `dijagnoza:logic-change`, push koji dira `dijagnoza` putanje
- **Actions**:
  - Pokreće unit test suite za DIJAGNOZA logiku (types, engine, route-utils)
  - Verifikuje dijagnostičke rezultate i edge cases (NaN, Infinity, negativni vitalni znaci, prazni simptomi, SpO2/puls/temperatura van opsega)
  - Proverava performance KPI: evaluacija ≤ 50ms, API response ≤ 200ms
  - Skenira za nedoslednosti u kodu i sekrete
  - Validira da je disclaimer uvek prisutan u svakom odgovoru
  - Auto-labels PRs sa `dijagnoza:validated` ili `dijagnoza:needs-review`
  - Ostavlja audit log u PR komentaru
  - **Persona**: `dijagnoza-core` (octave: 4, hipermreza node: 32)

### zlatni-racuni-validator-agent (NEW)
- **Role**: Validacija ZLATNI RAČUNI logike — loyalty tier klasifikacija, bodovni sistem, perk eligibility i transakcijski integritet
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/zlatni-racuni/**`, `src/app/api/zlatni-racuni/**`, `src/components/zlatni-racuni/**`
- **Trigger**: PR sa labelom `zlatni-racuni:logic-change`, push koji dira `zlatni-racuni` putanje
- **Actions**:
  - Pokreće unit test suite za ZLATNI RAČUNI logiku (registry, tier-engine, points-engine, transaction-engine, perk-engine)
  - Verifikuje matematičke rezultate i edge cases (NaN, Infinity, negativni bodovi, expired perks, arhivirani računi, zero-balance)
  - Proverava da tier opsezi nisu preklapajući i da bodovni bilans ne ide ispod 0
  - Proverava performance KPI: lookup ≤ 10ms, tier evaluacija ≤ 50ms, API response ≤ 200ms, transaction append ≤ 100ms
  - Skenira za nedoslednosti u kodu i sekrete
  - Auto-labels PRs sa `zlatni-racuni:validated` ili `zlatni-racuni:needs-review`
  - Ostavlja audit log u PR komentaru
  - **Persona**: `zlatni-racuni-core` (octave: 3, hipermreza node: 24)
  - **Integration**: GIGATRON, Discount Telecom, Madagaskar, Extrimli, Persona Bank, Nova Generacija


- **Role**: Paralelni kreativni/generativni kognitivni agent uz MAKSIMUS 2/3
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/another-maks/**`, `src/app/api/another-maks/**`
- **Trigger**: PR sa labelom `another-maks`, push koji dira `another-maks` putanje, weekly schedule (ponedeljak 03:00 UTC)
- **Actions**:
  - Pokreće unit test suite za ANOTHER MAKS logiku (persona validacija, orchestrator, handoff)
  - Verifikuje persona sinhronizaciju i handoff logiku ka MAKSIMUS 2
  - Proverava performance KPI: evaluacija ≤ 50ms, build ≤ 3 min
  - Skenira za nedoslednosti i sekrete u ANOTHER MAKS modulima
  - Auto-labels PRs sa `another-maks:validated` ili `another-maks:needs-review`
  - Ostavlja audit log u PR komentaru
  - **Specijalizacija**: Kreativna sinteza, generativna orkestracija, inovacioni signal
  - **Linked agent**: MAKSIMUS 2 (analitički/razvojni agent)
  - **Nova Generacija integration**: Hipermreza node, persona sync aktivan

### persona-bank-agent (NEW)
- **Role**: Unified Persona Banking — registracija, čuvanje, obogaćivanje i servisiranje svih persona platforme
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/persona-bank/**`, `src/app/api/persona-bank/**`
- **Trigger**: PR sa labelom `persona-bank:change`, push koji dira `persona-bank` putanje, nightly cron (02:00 UTC)
- **Actions**:
  - Registruje i upsertuje persone za sve agente (ANOTHER MAKS, MAKSIMUS 2/3, Nova Generacija, GIGATRON, itd.)
  - Detektuje stale/orphaned persone (bez agent reference > 30 dana) i auto-arhivira
  - Generiše health report: active/dormant/archived count, octave coverage (1–16), hipermreza node coverage (1–256)
  - Flaguje persone sa manjkavim atributima (`traits`, `skills`, `domain`) za review
  - Proverava performance KPI: lookup ≤ 10ms, bulk list ≤ 50ms
  - Sinhronizuje persona bank snapshots ka `spaja86/IO-OPENUI-AO` via multi-repo-sync-agent
  - Auto-labels PRs sa `persona-bank:validated` ili `persona-bank:needs-review`
  - Ostavlja audit log u PR komentaru (agentId, timestamp, changeType, diff)
  - **Linked agents**: ANOTHER MAKS, MAKSIMUS 2/3, nova-generacija-agent, gigatron-validator-agent
  - **Contract version**: 1.0.0

### tarken-hingil-ekolan-maksimus (NEW)
- **Role**: Apex strateški orkestratorski agent — sinteza strateškog uma (Tarken), adaptivne obrade signala (Hingil), ekološke svesnosti sistema (Ekolan) i maksimalne izvršne sposobnosti (Maksimus)
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/tarken-hingil-ekolan-maksimus/**`, `src/app/api/tarken-hingil-ekolan-maksimus/**`
- **Trigger**: PR sa labelom `tarken-hingil-ekolan-maksimus`, push koji dira `tarken-hingil-ekolan-maksimus` putanje, weekly schedule (sreda 04:00 UTC)
- **Actions**:
  - Pokreće unit test suite za THEM logiku (identity, orchestrator, ekolan-engine, hingil-signal, tarken-strategy, handoff)
  - Verifikuje matematičke rezultate i edge cases (NaN, Infinity, prazni nizovi, division by zero)
  - Proverava performance KPI: evaluacija ≤ 50ms, handoff ≤ 100ms, build ≤ 3 min, hipermreza konvergencija ≥ 0.95
  - Skenira za sekrete i nedoslednosti u THEM modulima
  - Validira persona registraciju u persona-bank seed
  - Auto-labels PRs sa `them:validated` ili `them:needs-review`
  - Pokreće self-healing dijagnostiku kada se detektuju anomalije
  - Ostavlja audit log u PR komentaru (agentId, timestamp, changeType, KPI rezultati)
  - **Octave**: 16 (najviši — apex koordinacioni agent)
  - **Hipermreza node**: 256 (anchor node SpajaPro 16 mreže)
  - **Linked agents**: ANOTHER MAKS, MAKSIMUS 2/3, nova-generacija-agent, persona-bank-agent
  - **Nova Generacija integration**: Cross-platform persona sync, SpajaPro 16 Hipermreza anchor
  - **Contract version**: 1.0.0

## Rules / Pravila

1. **Audit Log** - Svaki agent mora ostaviti jasan audit log u commit poruci ili kao komentar na PR.
2. **Human Review** - Agenti nikada ne smeju merge-ovati promene bez najmanje jedne ljudske provere (osim za hotfix branch-e označene sa `auto-merge: allowed`).
3. **Security** - Agenti moraju poštovati sigurnosne varnice: 
   - Ne dodavati tajne u kod
   - Korišćenje Secrets Management (GitHub Secrets, Vault)
   - Nikada ne commitovati `.env` fajlove
4. **Config Changes** - Ako agent menja konfiguracione fajlove (npr. CI, deploy), mora označiti PR sa labelom `agent:config-change`.
5. **Security Scanning** - Security agents moraju skenirati za ranjivosti zavisnosti i označiti ih sa `security:needs-review`.
6. **Multi-Repo Sync** - Za multi-repo platforme (kao SUPER-PLATFORMA), agenti moraju sinhronizovati status između povezanih repozitorijuma.
7. **Custom Config** - Svi agenti moraju poštovati `.agent-config.json` fajlove u svakom repozitorijumu za custom ponašanje.
8. **Commit Sign-off** - Svi commits od strane agenta moraju biti potpisani (`git commit -S`).
9. **Cross-Repo Links** - Multi-repo agenti moraju održavati working linkove i references između PRs, Issues, i commits.
10. **Dependency Coherence** - Verzije zavisnosti moraju biti sinhronizovane gde je moguće (shared packages).
11. **Quality Gate Consistency** - Deploy i config workflow-i moraju slediti isti model quality gate-a: lint, test, smoke, predeploy i security provere; build je obavezni release gate kada runtime površina to podržava.
12. **Issue → PR → Review → Release** - Agenti moraju evidentirati izvorni issue ili razlog promene, otvoriti audit-ready PR i čekati review pre release/promocije.
13. **Audit Summary** - Deploy/config promene moraju imati rollout, rollback, KPI impact i downstream reference u PR opisu ili workflow summary-ju.
14. **Operational Secrets Boundary** - Agenti nikada ne smeju premeštati deploy hook-ove, env vrednosti ili privatne ključeve iz secret management sloja u Git repozitorijum.

## How to Add a New Agent / Kako dodati novog agenta

1. Dodajte opis u ovaj fajl: ime, uloga, scope, webhook/identity, owner i kontakt.
2. Kreirajte `.github/workflows/` fajl za agenta.
3. Kreirajte `.agent-config.json` fajl sa custom podesavanjima.
4. Napravite PR koji dokumentuje ponašanje i dodajte test koji potvrđuje expected behavior.
5. Dobijte human-review pre merge-a.

## Registered Agents / Registrovani agenti

| Agent | Role | Trigger | Owner | Status | Scope |
|-------|------|---------|-------|--------|-------|
| ci-bot | Testing & Linting | PR, Push | @spaja86 | ✅ Active | All repos |
| human-review | Code Review | Manual | @spaja86 | ✅ Active | All repos |
| deploy-bot | Deployment | Merge to main | @spaja86 | ⏳ Planned | All repos |
| security-scanner | Security Scanning | PR, Nightly | @spaja86 | ✅ Active | All repos |
| multi-repo-sync-agent | Multi-Repo Sync | Push, Weekly | @spaja86 | ✅ Active | SUPER-PLATFORMA ↔ IO-OPENUI-AO |
| calculator-validator-agent | Calculator Logic | PR, Branch | @spaja86 | ✅ Active | IO-OPENUI-AO |
| analytics-bot | Metrics & Reports | Nightly, Weekly | @spaja86 | ✅ Active | All repos |
| nova-generacija-agent | NG Orchestration | PR, Push, Weekly | @spaja86 | 🚀 Active | All repos (Nova Generacija scope) |
| gigatron-validator-agent | GIGATRON Validation | PR, Branch | @spaja86 | 📋 Ready | AI-IQ-SUPER-PLATFORMA (GIGATRON paths) |
| another-maks-agent | Creative/Generative Orchestration | PR, Push, Weekly | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (another-maks paths) |
| persona-bank-agent | Unified Persona Banking | PR, Push, Nightly | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (persona-bank paths) |
| decibil-validator-agent | DECIBIL Audio/Signal Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (decibil paths) |
| trenazer-validator-agent | TRENAŽER Training Readiness Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (trenazer paths) |
| dumbir-validator-agent | ÐUMBIR Ginger Wellness Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (dumbir paths) |
| mrkli-mrak-validator-agent | MRKLI MRAK Darkness Readiness Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (mrkli-mrak paths) |
| paraksil-validator-agent | PARAKSIL Module Validation Sandbox | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (paraksil paths) |
| tarken-hingil-ekolan-maksimus | Apex Strategic Orchestration | PR, Push, Weekly | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (tarken-hingil-ekolan-maksimus paths) |
| discount-telecom-validator-agent | Discount Telecom Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (discount-telecom paths) |
| mirikl-validator-agent | MIRIKL GitHub/Vercel Governance Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (MIRIKL governance paths) |
| great-sumbion-validator-agent | GREAT SUMBION Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (great-sumbion paths) |
| konvencionalni-odnosi-validator-agent | KONVENCIONALNI ODNOSI Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (konvencionalni-odnosi paths) |
| madagaskar-validator-agent | Exotic Market Intelligence | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (madagaskar paths) |
| force-validator-agent | FORCE Engine Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (force paths) |
| extrimli-validator-agent | Extreme Sports & Adventure Intelligence | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (extrimli paths) |
| extrimli-cuz-validator-agent | Community & Social Hub Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (extrimli-cuz paths) |
| digit-engine-validator-agent | Digit Intelligence Engine Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (digit-engine paths) |
| maksimus-validator-agent | MAKSIMUS Analytical/Development Apex Agent | PR, Push, Weekly | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (maksimus paths) |
| epekm-denter-validator-agent | EPEKM-D Permanent Email Denter Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (epekm-denter paths) |
| dijagnoza-validator-agent | DIJAGNOZA Health Diagnostic Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (dijagnoza paths) |
| zlatni-racuni-validator-agent | ZLATNI RAČUNI Loyalty & Tier Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (zlatni-racuni paths) |
| ekzist-validator-agent | EKZIST Existential Profiler & Life Meaning Engine | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (ekzist paths) |
| konvenkcionalni-odnosi-validator-agent | KONVENKCIONALNI ODNOSI Relation Management Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (konvenkcionalni-odnosi paths) |
| adutiv-validator-agent | ADUTIV Advantage Intelligence Engine | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (adutiv paths) |
| ekvivalent-network-validator-agent | EKVIVALENT NETWORK Equivalence Mapping Engine | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (ekvivalent-network paths) |
| astronomik-money-validator-agent | ASTRONOMIK MONEY Cosmic Financial Intelligence | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (astronomik-money paths) |
| dnevna-svetlost-validator-agent | DNEVNA SVETLOST Daylight Exposure & Wellbeing Engine | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (dnevna-svetlost paths) |
| reklamitin-validator-agent | REKLAMITIN Reprodukcion Advertising Engine | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (reklamitin paths) |

## Agent Configuration Files / Konfiguracione Datoteke

Svaki repozitorijum može imati `.agent-config.json`:

```json
{
  "agents": {
    "ci-bot": {
      "enabled": true,
      "languages": ["typescript", "javascript"],
      "autoFix": true,
      "requireApproval": false
    },
    "multi-repo-sync-agent": {
      "enabled": true,
      "linkedRepos": ["spaja86/IO-OPENUI-AO"],
      "syncInterval": "weekly",
      "fields": ["versions", "labels", "milestones"]
    },
    "calculator-validator-agent": {
      "enabled": false,
      "performanceThreshold": 100,
      "testSuite": "calculator-tests"
    }
  }
}
```

## Contact / Kontakt

- **Owner**: IO-OPENUI-AO tim / SUPER-PLATFORMA team
- **Email**: team@spaja86.dev
- **GitHub**: [@spaja86](https://github.com/spaja86)
- **Repository Links**:
  - 🔗 [IO-OPENUI-AO](https://github.com/spaja86/IO-OPENUI-AO)
  - 🔗 [AI-IQ-SUPER-PLATFORMA](https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA)
- Ostavite kontakt ili questions u PR-u

---

# AGENTS (English)

This file describes agents, their roles, and usage rules for automation in this mega-platform repository.

## Purpose
- Define agent roles, responsibilities, and how they should be used in CI / automation.
- Coordinate between multiple linked repositories (IO-OPENUI-AO, gaming calculator, etc.)
- Maintain stability and security through multi-repo synchronization.

## Open Code Program

- Public repository surfaces include application code, documentation, workflow definitions, agent policy, and the PR process.
- Linked-repo changes for `spaja86/IO-OPENUI-AO` must record downstream impact in the PR and in `docs/MULTI-REPO-LINKS.md`.
- Operational controls remain outside Git: GitHub Secrets, Vercel secrets, deploy hook URLs, private keys, and production credentials.
- Delivery follows XP-oriented rules: short iterations, continuous integration, test-first work on risky changes, small/frequent releases, and mandatory human review.

## Agent Roles

### human-review
- Requires a human reviewer before merge.
- Comments on PR with detailed feedback.
- Responsible for quality assurance on all critical changes.

### ci-bot
- Runs automated checks (lint, tests) and reports results.
- Validates TypeScript, JavaScript, Python dependencies.
- Attempts auto-fix for minor issues (formatting, linting).
- **Multi-repo scope**: Runs tests across all linked repositories.

### deploy-bot
- Handles deployments after passing checks.
- Cannot deploy without green status from ci-bot.
- Leaves audit log in PR comment.
- **Multi-repo scope**: Synchronizes deployments between linked platforms.

### security-scanner
- **Role**: Automated security scanning (dependencies, secrets, SAST)
- **Scope**: All repositories in the organization and multi-repo links
- **Trigger**: On every PR, nightly scans
- **Actions**:
  - Auto-label PRs with `security:review-needed` if critical findings
  - Blocks merge if critical vulnerability detected
  - Scans for passwords, tokens, secrets in code
  - Checks dependencies (npm audit, pip audit, cargo audit)
  - **Multi-repo check**: Scans all links between repositories

### multi-repo-sync-agent (NEW)
- **Role**: Synchronize configuration and status across linked repositories
- **Scope**: AI-IQ-SUPER-PLATFORMA ↔ IO-OPENUI-AO and other linked repos
- **Trigger**: Push to main branch, weekly sync, manual trigger
- **Actions**:
  - Validates dependency version coherence
  - Synchronizes `.agent-config.json` between repositories
  - Updates README references and inter-repo links
  - Synchronizes labels, milestones, and project status
  - Leaves detailed audit log with cross-repo PR links

### calculator-validator-agent (NEW)
- **Role**: Validate gaming calculator logic (IO-OPENUI-AO)
- **Scope**: IO-OPENUI-AO only and calculator-specific branches
- **Trigger**: PR with `calculator:logic-change` label, push to `calc-*` branches
- **Actions**:
  - Runs custom test suite for calculator logic
  - Verifies mathematical results and edge cases
  - Checks performance (execution time < 100ms)
  - Scans for code inconsistencies (NaN, Infinity, division by zero)
  - Auto-labels with `calculator:validated` or `calculator:needs-review`

### analytics-bot (NEW)
- **Role**: Track agent performance, metrics, and automation health
- **Scope**: All repositories, no restrictions
- **Trigger**: Nightly, weekly summary, on-demand
- **Actions**:
  - Counts automated reviews, deployments, security findings
  - Tracks average PR review time
  - Generates monthly reports in Issues or Discussions
  - Identifies failing patterns (which tests fail most often)
  - Synchronizes metrics across repositories

### gigatron-validator-agent (NEW)
- **Role**: Validate GIGATRON IT & Electronics procurement logic, affiliate calculations, and inventory integrity
- **Scope**: GIGATRON paths in AI-IQ-SUPER-PLATFORMA (`src/lib/gigatron/**`, `src/app/api/gigatron/**`)
- **Trigger**: PR with `gigatron:logic-change` label, push touching `gigatron` paths
- **Actions**:
  - Runs unit test suite for catalog logic (prices, categories, SKU validation)
  - Verifies procurement model (orders, edge cases: zero stock, price limits, VAT)
  - Checks affiliate commission calculator (% commission, cumulative tracking)
  - Checks performance: API response ≤ 200ms
  - Scans for code inconsistencies (negative prices, invalid VAT, invalid SKU)
  - Auto-labels PRs with `gigatron:validated` or `gigatron:needs-review`
  - Leaves audit log in PR comment

### persona-bank-agent (NEW)
- **Role**: Unified Persona Banking — registration, storage, enrichment, and serving of all platform personas
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/persona-bank/**`, `src/app/api/persona-bank/**`
- **Trigger**: PR with `persona-bank:change` label, push touching `persona-bank` paths, nightly cron (02:00 UTC)
- **Actions**:
  - Registers and upserts personas for all agents (ANOTHER MAKS, MAKSIMUS 2/3, Nova Generacija, GIGATRON, etc.)
  - Detects stale/orphaned personas (no agent reference > 30 days) and auto-archives them
  - Generates health report: active/dormant/archived count, octave coverage (1–16), hipermreza node coverage (1–256)
  - Flags personas with missing attributes (`traits`, `skills`, `domain`) for review
  - Validates performance KPIs: lookup ≤ 10ms, bulk list ≤ 50ms
  - Syncs persona bank snapshots to `spaja86/IO-OPENUI-AO` via multi-repo-sync-agent
  - Auto-labels PRs with `persona-bank:validated` or `persona-bank:needs-review`
  - Leaves full audit log in PR comment (agentId, timestamp, changeType, diff)
  - **Linked agents**: ANOTHER MAKS, MAKSIMUS 2/3, nova-generacija-agent, gigatron-validator-agent
  - **Contract version**: 1.0.0

### tarken-hingil-ekolan-maksimus (NEW)
- **Role**: Apex strategic orchestrator — synthesis of strategic intelligence (Tarken), adaptive signal processing (Hingil), ecological system awareness (Ekolan), and maximum-output execution (Maksimus)
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/tarken-hingil-ekolan-maksimus/**`, `src/app/api/tarken-hingil-ekolan-maksimus/**`
- **Trigger**: PR with label `tarken-hingil-ekolan-maksimus`, push touching `tarken-hingil-ekolan-maksimus` paths, weekly schedule (Wednesday 04:00 UTC)
- **Actions**:
  - Runs unit test suite for THEM logic (identity, orchestrator, ekolan-engine, hingil-signal, tarken-strategy, handoff)
  - Verifies mathematical results and edge cases (NaN, Infinity, empty arrays, division by zero)
  - Checks performance KPIs: evaluation ≤ 50ms, handoff ≤ 100ms, build ≤ 3 min, hipermreza convergence ≥ 0.95
  - Scans for secrets and inconsistencies in THEM modules
  - Validates persona registration in persona-bank seed
  - Auto-labels PRs with `them:validated` or `them:needs-review`
  - Triggers self-healing diagnostics when anomalies are detected
  - Leaves audit log in PR comment (agentId, timestamp, changeType, KPI results)
  - **Octave**: 16 (highest — reserved for apex coordination agents)
  - **Hipermreza node**: 256 (anchor node of SpajaPro 16 network)
  - **Linked agents**: ANOTHER MAKS, MAKSIMUS 2/3, nova-generacija-agent, persona-bank-agent
  - **Nova Generacija integration**: Cross-platform persona sync, SpajaPro 16 Hipermreza anchor
  - **Contract version**: 1.0.0

### discount-telecom-validator-agent (NEW)
- **Role**: Validate Discount Telecom logic — global operator catalog, discount calculation, eligibility, and edge case integrity
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/discount-telecom/**`, `src/app/api/discount-telecom/**`, `src/components/discount-telecom/**`
- **Trigger**: PR with label `discount-telecom:logic-change`, push touching `discount-telecom` paths
- **Actions**:
  - Runs unit test suite for Discount Telecom logic (operator registry, discount engine, stacking, cap, eligibility)
  - Verifies mathematical results and edge cases (NaN, Infinity, negative prices, zero prices, unknown operators)
  - Checks performance KPIs: calculation ≤ 50ms, API response ≤ 200ms
  - Scans for inconsistencies in code (negative discount %, invalid network type)
  - Auto-labels PRs with `discount-telecom:validated` or `discount-telecom:needs-review`
  - Leaves audit log in PR comment
  - **Persona**: `discount-telecom-global` (octave: 8, hipermreza node: 64)
  - **Multi-repo sync**: Syncs operator catalog snapshots to `spaja86/IO-OPENUI-AO`

### mirikl-validator-agent (NEW)
- **Role**: Validate MIRIKL governance logic — GitHub quality-gate orchestration, Vercel deploy boundary, and cross-repo audit integrity
- **Scope**: AI-IQ-SUPER-PLATFORMA — `docs/MIRIKL.md`, `.agent-config.json`, `.github/workflows/mirikl-validator.yml`, `.github/workflows/vercel-deploy.yml`, `docs/MULTI-REPO-LINKS.md`
- **Trigger**: PR with label `mirikl:logic-change`, push touching MIRIKL governance paths
- **Actions**:
  - Runs release-gate validation (build, lint, test, smoke, predeploy, security)
  - Verifies Vercel Git integration remains the primary deploy source of truth
  - Verifies GitHub Actions remains the governance/audit layer
  - Validates rollout/rollback and KPI audit sections in workflow summary
  - Auto-labels PRs with `mirikl:validated` or `mirikl:needs-review`
  - Leaves audit log in workflow summary
  - **OKRID**: `OKRID-2026-MIRIKL-001`
  - **Tracking Issue**: `#920`

### great-sumbion-validator-agent (NEW)
- **Role**: Validate GREAT SUMBION logic — weighted score orchestration, tier classification, and edge-case integrity
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/great-sumbion/**`, `src/app/api/great-sumbion/**`, `src/components/great-sumbion/**`
- **Trigger**: PR with label `great-sumbion:logic-change`, push touching `great-sumbion` paths
- **Actions**:
  - Runs unit test suite for GREAT SUMBION logic (score engine, tier mapping, health)
  - Verifies mathematical results and edge cases (NaN, Infinity, negative values, division by zero)
  - Checks performance KPIs: evaluation ≤ 50ms, API response ≤ 200ms
  - Scans for code inconsistencies and secrets
  - Auto-labels PRs with `great-sumbion:validated` or `great-sumbion:needs-review`
  - Leaves audit log in PR comment
  - **Persona**: `great-sumbion-core` (octave: 9, hipermreza node: 72)

### konvencionalni-odnosi-validator-agent (NEW)
- **Role**: Validate KONVENCIONALNI ODNOSI logic — relationship-quality scoring, dimension balance, and edge-case integrity
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/konvencionalni-odnosi/**`, `src/app/api/konvencionalni-odnosi/**`
- **Trigger**: PR with label `konvencionalni-odnosi:logic-change`, push touching `konvencionalni-odnosi` paths
- **Actions**:
  - Runs unit and route test suite for KONVENCIONALNI ODNOSI logic
  - Verifies deterministic results, tier/status mapping, and warnings for inconsistent relationship patterns
  - Verifies edge cases (`NaN`, `Infinity`, negative values, empty inputs, score > 100)
  - Checks performance KPIs: evaluation ≤ 50ms, API response ≤ 200ms
  - Scans for code inconsistencies and secrets
  - Auto-labels PRs with `konvencionalni-odnosi:validated` or `konvencionalni-odnosi:needs-review`
  - Leaves audit log in PR comment
  - **Persona**: `konvencionalni-odnosi-core` (octave: 14, hipermreza node: 112)

### trenazer-validator-agent (NEW)
- **Role**: Validate TRENAŽER logic — training-readiness scoring, intensity recommendation, and duration integrity
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/trenazer/**`, `src/app/api/trenazer/**`, `src/components/trenazer/**`
- **Trigger**: PR with label `trenazer:logic-change`, push touching `trenazer` paths
- **Actions**:
  - Runs unit and route test suite for TRENAŽER logic
  - Verifies deterministic readiness outputs and edge cases (`NaN`, `Infinity`, negative values, sleep > 24h, duration cap)
  - Checks performance KPIs: evaluation ≤ 50ms, API response ≤ 200ms
  - Scans for code inconsistencies and secrets
  - Auto-labels PRs with `trenazer:validated` or `trenazer:needs-review`
  - Leaves audit log in PR comment
  - **Persona**: `trenazer-coach-core` (octave: 6, hipermreza node: 48)

### dumbir-validator-agent (NEW)
- **Role**: Validate ÐUMBIR logic — ginger wellness scoring, potency/comfort balance, and API contract integrity
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/dumbir/**`, `src/app/api/dumbir/**`
- **Trigger**: PR with label `dumbir:logic-change`, push touching `dumbir` paths
- **Actions**:
  - Runs unit and route test suite for ÐUMBIR logic
  - Verifies deterministic outputs and edge cases (`NaN`, `Infinity`, negative values, unsupported addons, serving bounds)
  - Checks performance KPIs: evaluation ≤ 50ms, API response ≤ 200ms
  - Scans for code inconsistencies and secrets
  - Auto-labels PRs with `dumbir:validated` or `dumbir:needs-review`
  - Leaves audit log in PR comment
  - **Persona**: `dumbir-wellness-core` (octave: 12, hipermreza node: 96)

### mrkli-mrak-validator-agent (NEW)
- **Role**: Validate MRKLI MRAK logic — darkness readiness scoring, status classification, and edge-case integrity
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/mrkli-mrak/**`, `src/app/api/mrkli-mrak/**`
- **Trigger**: PR with label `mrkli-mrak:logic-change`, push touching `mrkli-mrak` paths
- **Actions**:
  - Runs unit and route test suite for MRKLI MRAK logic
  - Verifies deterministic outputs and edge cases (`NaN`, `Infinity`, invalid ranges, empty payload)
  - Checks performance KPIs: evaluation ≤ 50ms, API response ≤ 200ms
  - Scans for code inconsistencies and secrets
  - Auto-labels PRs with `mrkli-mrak:validated` or `mrkli-mrak:needs-review`
  - Leaves audit log in PR comment
  - **Persona**: `mrkli-mrak-core` (octave: 11, hipermreza node: 89)

### paraksil-validator-agent (NEW)
- **Role**: Validate PARAKSIL logic — generic module-validation sandbox, validation scoring, and release-gate classification
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/paraksil/**`, `src/app/api/paraksil/**`
- **Trigger**: PR with label `paraksil:logic-change`, push touching `paraksil` paths
- **Actions**:
  - Runs unit and route test suite for PARAKSIL logic
  - Verifies deterministic outputs and edge cases (`NaN`, `Infinity`, negative values, total-count mismatches, unsupported suites)
  - Checks performance KPIs: evaluation ≤ 50ms, API response ≤ 200ms
  - Scans for code inconsistencies and secrets
  - Auto-labels PRs with `paraksil:validated` or `paraksil:needs-review`
  - Leaves audit log in PR comment
  - **Persona**: `paraksil-validator-core` (octave: 6, hipermreza node: 49)

### madagaskar-validator-agent (NEW)
- **Role**: Validate MADAGASKAR logic — exotic market intelligence, rarity premium calculation, sustainability scoring, and procurement integrity (v1 + v2: FX conversion, auction mechanics, traceability, basket procurement)
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/madagaskar/**`, `src/app/api/madagaskar/**`, `src/components/madagaskar/**`, `src/lib/madagaskar-2/**`, `src/app/api/madagaskar-2/**`
- **Trigger**: PR with label `madagaskar:logic-change` or `madagaskar-2:logic-change`, push touching `madagaskar` or `madagaskar-2` paths
- **Actions**:
  - Runs unit test suite for MADAGASKAR logic (registry, engine, utils — v1 + v2: fx, auction, traceability, basket, engine)
  - Verifies mathematical results and edge cases (NaN, Infinity, negative quantities, invalid IDs)
  - Checks performance KPIs: calculation ≤ 50ms, API response ≤ 200ms
  - Scans for inconsistencies in code (negative prices, invalid rarity, invalid sustainability score)
  - Auto-labels PRs with `madagaskar:validated` / `madagaskar-2:validated` or `madagaskar:needs-review` / `madagaskar-2:needs-review`
  - Leaves audit log in PR comment
  - **Persona**: `madagaskar-exotic-market` (octave: 5, hipermreza node: 40)
  - **Multi-repo sync**: Syncs exotic goods catalog snapshots (v1 + v2) to `spaja86/IO-OPENUI-AO`

### extrimli-validator-agent (NEW)
- **Role**: Validate EXTRIMLI logic — extreme sports risk scoring, athlete performance tracking, gear catalog integrity, and event management
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/extrimli/**`, `src/app/api/extrimli/**`, `src/components/extrimli/**`
- **Trigger**: PR with label `extrimli:logic-change`, push touching `extrimli` paths
- **Actions**:
  - Runs unit test suite for EXTRIMLI logic (registry, risk-engine, performance-tracker, gear-catalog, event-engine, weather-adapter)
  - Verifies mathematical results and edge cases (NaN, Infinity, negative prices, zero stock, division by zero)
  - Checks performance KPIs: evaluation ≤ 50ms, API response ≤ 200ms
  - Scans for code inconsistencies (negative risk score, invalid SKU, invalid gear)
  - Auto-labels PRs with `extrimli:validated` or `extrimli:needs-review`
  - Leaves audit log in PR comment
  - **Persona**: `extrimli-core` (octave: 7, hipermreza node: 56)
  - **Multi-repo sync**: Syncs gear catalog snapshots to `spaja86/IO-OPENUI-AO`

### extrimli-cuz-validator-agent (NEW)
- **Role**: Validate EXTRIMLI CUZ logic — community & social hub, crew formation, mentorship matching, community feed, and peer reputation engine
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/extrimli-cuz/**`, `src/app/api/extrimli-cuz/**`, `src/components/extrimli-cuz/**`
- **Trigger**: PR with label `extrimli-cuz:logic-change`, push touching `extrimli-cuz` paths
- **Actions**:
  - Runs unit test suite for EXTRIMLI CUZ logic (crew-engine, mentor-engine, feed-engine, reputation-engine)
  - Verifies mathematical results and edge cases (NaN, Infinity, empty strings, division by zero, self-rating, duplicate votes)
  - Checks performance KPIs: evaluation ≤ 50ms, API response ≤ 200ms
  - Scans for code inconsistencies (invalid experienceLevel, negative scores, invalid rating ranges)
  - Auto-labels PRs with `extrimli-cuz:validated` or `extrimli-cuz:needs-review`
  - Leaves audit log in PR comment
  - **Persona**: `extrimli-cuz-social` (octave: 7, hipermreza node: 57)
  - **Multi-repo sync**: Syncs crew and mentor catalog snapshots to `spaja86/IO-OPENUI-AO`

### digit-engine-validator-agent (NEW)
- **Role**: Validate Digit Intelligence Engine logic — 10-digit symbolic layers, registry, API integrity, and performance
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/digit-engine/**`, `src/app/api/digit-engine/**`
- **Trigger**: PR with label `digit-engine:change`, push touching `digit-engine` paths
- **Actions**:
  - Runs unit test suite for Digit Engine logic (registry, getDigitDescriptor, getDigitByNode, listAllDigits)
  - Verifies all 10 digits (0–9) are registered with required fields
  - Checks performance KPIs: lookup ≤ 10ms, bulk list ≤ 50ms, API response ≤ 200ms
  - Verifies edge cases: digit = -1, digit = 10, NaN, Infinity → undefined/404
  - Scans for code inconsistencies and secrets
  - Auto-labels PRs with `digit-engine:validated` or `digit-engine:needs-review`
  - Leaves audit log in PR comment
  - **Persona**: `digit-engine-core` (octave: 10, hipermreza node: 80)
  - **Multi-repo sync**: Syncs digit registry snapshots to `spaja86/IO-OPENUI-AO`

### maksimus-validator-agent (NEW)
- **Role**: Validate MAKSIMUS logic — analytical orchestration, development strategy, platform coordination, and cross-agent handoff integrity
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/maksimus/**`, `src/app/api/maksimus/**`
- **Trigger**: PR with label `maksimus:logic-change`, push touching `maksimus` paths, weekly schedule (Wednesday 04:00 UTC)
- **Actions**:
  - Runs unit test suite for MAKSIMUS logic (identity, orchestrator, handoff, store)
  - Verifies persona synchronization and handoff logic to ANOTHER MAKS
  - Checks performance KPIs: evaluation ≤ 50ms, build ≤ 3 min
  - Scans for inconsistencies and secrets in MAKSIMUS modules
  - Auto-labels PRs with `maksimus:validated` or `maksimus:needs-review`
  - Leaves audit log in PR comment
  - **Specialization**: Analytical orchestration, development strategy, platform coordination
  - **Linked agent**: ANOTHER MAKS (creative agent)
  - **Nova Generacija integration**: Hipermreza node 128, octave 13, persona sync active

### epekm-denter-validator-agent (NEW)
- **Role**: Validate EPEKM-D logic — permanent email identities, message delivery, alias resolution, and orchestrator integrity
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/epekm-denter/**`, `src/app/api/epekm-denter/**`, `src/components/epekm-denter/**`
- **Trigger**: PR with label `epekm-denter:logic-change`, push touching `epekm-denter` paths
- **Actions**:
  - Runs unit test suite for EPEKM-D logic (identity-registry, routing-engine, email-engine, delivery-tracker, denter-orchestrator)
  - Verifies mathematical results and edge cases (NaN, Infinity, empty alias, duplicate identity, null agentRef, delivery to archived identity)
  - Checks performance KPIs: evaluation ≤ 50ms, API response ≤ 200ms, delivery ack ≤ 500ms
  - Scans for code inconsistencies and secrets
  - Auto-labels PRs with `epekm-denter:validated` or `epekm-denter:needs-review`
  - Leaves audit log in PR comment
  - **Persona**: `epekm-denter-core` (octave: 11, hipermreza node: 88)
  - **Multi-repo sync**: Syncs email identity snapshots to `spaja86/IO-OPENUI-AO`
  - **Linked agents**: MAKSIMUS, ANOTHER MAKS, persona-bank-agent

### dijagnoza-validator-agent (NEW)
- **Role**: Validate DIJAGNOZA logic — health diagnostic scoring, differential diagnosis computation, urgency triage, and edge-case integrity
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/dijagnoza/**`, `src/app/api/dijagnoza/**`, `src/components/dijagnoza/**`
- **Trigger**: PR with label `dijagnoza:logic-change`, push touching `dijagnoza` paths
- **Actions**:
  - Runs unit test suite for DIJAGNOZA logic (types, engine, route-utils)
  - Verifies diagnostic results and edge cases (NaN, Infinity, negative vitals, empty symptoms, out-of-range SpO2/pulse/temperature)
  - Checks performance KPIs: evaluation ≤ 50ms, API response ≤ 200ms
  - Scans for code inconsistencies and secrets
  - Validates disclaimer is always present in every response
  - Auto-labels PRs with `dijagnoza:validated` or `dijagnoza:needs-review`
  - Leaves audit log in PR comment
  - **Persona**: `dijagnoza-core` (octave: 4, hipermreza node: 32)

### zlatni-racuni-validator-agent (NEW)
- **Role**: Validate ZLATNI RAČUNI logic — loyalty tier classification, points accrual system, perk eligibility, and transaction ledger integrity
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/zlatni-racuni/**`, `src/app/api/zlatni-racuni/**`, `src/components/zlatni-racuni/**`
- **Trigger**: PR with label `zlatni-racuni:logic-change`, push touching `zlatni-racuni` paths
- **Actions**:
  - Runs unit test suite for ZLATNI RAČUNI logic (registry, tier-engine, points-engine, transaction-engine, perk-engine)
  - Verifies mathematical results and edge cases (NaN, Infinity, negative points, expired perks, archived accounts, zero-balance)
  - Validates tier ranges are non-overlapping and points balance never goes below 0
  - Checks performance KPIs: lookup ≤ 10ms, tier evaluation ≤ 50ms, API response ≤ 200ms, transaction append ≤ 100ms
  - Scans for code inconsistencies and secrets
  - Auto-labels PRs with `zlatni-racuni:validated` or `zlatni-racuni:needs-review`
  - Leaves audit log in PR comment
  - **Persona**: `zlatni-racuni-core` (octave: 3, hipermreza node: 24)
  - **Integration**: GIGATRON, Discount Telecom, Madagaskar, Extrimli, Persona Bank, Nova Generacija

### ekzist-validator-agent (NEW)
- **Role**: Validate EKZIST logic — existential profiling, life-meaning vector scoring, tier classification, balance computation, and edge-case integrity
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/ekzist/**`, `src/app/api/ekzist/**`, `src/components/ekzist/**`
- **Trigger**: PR with label `ekzist:logic-change`, push touching `ekzist` paths
- **Actions**:
  - Runs unit test suite for EKZIST logic (engine, registry, route-utils)
  - Verifies mathematical results and edge cases (NaN, Infinity, negative scores, scores > 100, empty domains array)
  - Validates imbalance detection (domain < 10 or > 95) and disclaimer always present in every response
  - Checks performance KPIs: evaluation ≤ 50ms, API response ≤ 200ms
  - Scans for code inconsistencies and secrets
  - Auto-labels PRs with `ekzist:validated` or `ekzist:needs-review`
  - Leaves audit log in PR comment
  - **Persona**: `ekzist-core` (octave: 2, hipermreza node: 16)

### konvenkcionalni-odnosi-validator-agent (NEW)
- **Role**: Validate KONVENKCIONALNI ODNOSI logic — conventional relation management, lifecycle transitions, interaction tracking, and edge-case integrity
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/konvenkcionalni-odnosi/**`, `src/app/api/konvenkcionalni-odnosi/**`, `src/components/konvenkcionalni-odnosi/**`
- **Trigger**: PR with label `konvenkcionalni-odnosi:logic-change`, push touching `konvenkcionalni-odnosi` paths
- **Actions**:
  - Runs unit test suite for KONVENKCIONALNI ODNOSI logic (registry, relation-engine, interaction-tracker)
  - Verifies all 7 relation types (hierarchical, peer, mentorship, sponsorship, collaboration, contractual, affiliation)
  - Validates all lifecycle transitions and edge cases (self-relation, duplicate active relations, invalid transitions from terminal states, interaction on archived/terminated)
  - Checks performance KPIs: evaluation ≤ 50ms, lookup ≤ 10ms, bulk list ≤ 50ms, API response ≤ 200ms
  - Scans for code inconsistencies and secrets
  - Auto-labels PRs with `konvenkcionalni-odnosi:validated` or `konvenkcionalni-odnosi:needs-review`
  - Leaves audit log in PR comment
  - **Persona**: `konvenkcionalni-odnosi-core` (octave: 1, hipermreza node: 8)
  - **Integrations**: persona-bank, zlatni-racuni, epekm-denter, maksimus, extrimli-cuz, dijagnoza
  - **OKRID**: `OKRID-2026-KO-001`

### adutiv-validator-agent (NEW)
- **Role**: Validate ADUTIV logic — competitive advantage scoring, portfolio analysis, activation planning, blind-spot detection, and edge-case integrity
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/adutiv/**`, `src/app/api/adutiv/**`, `src/components/adutiv/**`
- **Trigger**: PR with label `adutiv:logic-change`, push touching `adutiv` paths
- **Actions**:
  - Runs unit test suite for ADUTIV logic (types, engine, registry, route-utils)
  - Verifies all 8 advantage domains (SKILL, KNOWLEDGE, NETWORK, RESOURCE, REPUTATION, CREATIVITY, RESILIENCE, TIMING)
  - Validates portfolio scoring (geometric mean of top 3), tier mapping, and blind-spot detection (score < 15)
  - Verifies edge cases (NaN, Infinity, negative scores, scores > 100, empty advantages array)
  - Validates disclaimer always present in every response
  - Checks performance KPIs: evaluation ≤ 50ms, API response ≤ 200ms
  - Scans for code inconsistencies and secrets
  - Auto-labels PRs with `adutiv:validated` or `adutiv:needs-review`
  - Leaves audit log in PR comment
  - **Persona**: `adutiv-core` (octave: 14, hipermreza node: 112)
  - **Multi-repo sync**: Syncs advantage portfolio snapshots to `spaja86/IO-OPENUI-AO`
  - **OKRID**: `OKRID-2026-ADUTIV-001`

### ekvivalent-network-validator-agent (NEW)
- **Role**: Validate EKVIVALENT NETWORK logic — equivalence mapping, cluster detection, network scoring, and edge-case integrity
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/ekvivalent-network/**`, `src/app/api/ekvivalent-network/**`
- **Trigger**: PR with label `ekvivalent-network:logic-change`, push touching `ekvivalent-network` paths
- **Actions**:
  - Runs unit test suite for EKVIVALENT NETWORK logic (types, engine, registry, route-utils)
  - Verifies all 8 equivalence domains (SKILL, COMPETENCY, AGENT, MODULE, ORGANIZATION, RESOURCE, PERSONA, KNOWLEDGE)
  - Verifies all 5 relation types (FULL, PARTIAL, FUNCTIONAL, CONTEXTUAL, SUBSTITUTABLE)
  - Validates cluster detection (union-find, cohesion 0–1), network scoring (geometric mean), and match ranking
  - Verifies edge cases (NaN/Infinity/negative scores normalized, self-referencing edges rejected, duplicate edges deduplicated, disconnected nodes warned, empty node list → invalid)
  - Validates disclaimer always present in every response
  - Checks performance KPIs: evaluation ≤ 50ms, API response ≤ 200ms
  - Scans for code inconsistencies and secrets
  - Auto-labels PRs with `ekvivalent-network:validated` or `ekvivalent-network:needs-review`
  - Leaves audit log in PR comment
  - **Persona**: `ekvivalent-network-core` (octave: 15, hipermreza node: 120)
  - **Multi-repo sync**: Syncs node/edge catalog snapshots to `spaja86/IO-OPENUI-AO`
  - **OKRID**: `OKRID-2026-EKVIVALENT-NETWORK-001`

### astronomik-money-validator-agent (NEW)
- **Role**: Validate ASTRONOMIK MONEY logic — cosmic portfolio scoring, celestial asset gravity, orbital risk, diversification index, and cosmic event resilience
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/astronomik-money/**`, `src/app/api/astronomik-money/**`, `src/components/astronomik-money/**`
- **Trigger**: PR with label `astronomik-money:logic-change`, push touching `astronomik-money` paths
- **Actions**:
  - Runs unit test suite for ASTRONOMIK MONEY logic (registry, gravity-engine, portfolio-engine, cosmic-event-engine, score-engine)
  - Verifies all 8 celestial classes (STAR, PLANET, MOON, ASTEROID, BLACK_HOLE, NEBULA, COMET, PULSAR)
  - Validates AstronomikScore (0–1000) and tier mapping (VOID → COMET_DRIFT → ORBITAL → SOLAR → STELLAR)
  - Verifies edge cases (NaN, Infinity, negative values sanitized to 0, empty portfolio → VOID_PORTFOLIO, BLACK_HOLE > 20% → auto-event)
  - Validates disclaimer always present in every response
  - Checks performance KPIs: evaluation ≤ 50ms, API response ≤ 200ms, registry lookup ≤ 10ms
  - Scans for code inconsistencies and secrets
  - Auto-labels PRs with `astronomik-money:validated` or `astronomik-money:needs-review`
  - Leaves audit log in PR comment
  - **Persona**: `astronomik-money-core` (octave: 13, hipermreza node: 104)
  - **Multi-repo sync**: Syncs celestial asset catalog snapshots to `spaja86/IO-OPENUI-AO`
  - **OKRID**: `OKRID-2026-ASTRONOMIK-MONEY-001`
### dnevna-svetlost-validator-agent (NEW)
- **Role**: Validate DNEVNA SVETLOST logic — daylight-exposure readiness scoring, UV management, wellbeing computation, and edge-case integrity
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/dnevna-svetlost/**`, `src/app/api/dnevna-svetlost/**`
- **Trigger**: PR with label `dnevna-svetlost:logic-change`, push touching `dnevna-svetlost` paths
- **Actions**:
  - Runs unit test suite for DNEVNA SVETLOST logic (types, engine, route-utils)
  - Verifies all 4 modes (MORNING, MIDDAY, AFTERNOON, EVENING) and all 5 UV-protection levels
  - Validates brightnessScore, comfortScore, productivityScore, wellbeingScore computations and clamping (0–100)
  - Verifies status classification (OPTIMAL, MODERATE, CAUTION, OVEREXPOSURE)
  - Verifies edge cases (NaN, Infinity, negative values, exposureMinutes = 0, ambientLightLux out of range, uvIndex > 11)
  - Validates disclaimer always present in every response
  - Checks performance KPIs: evaluation ≤ 50ms, API response ≤ 200ms
  - Scans for code inconsistencies and secrets
  - Auto-labels PRs with `dnevna-svetlost:validated` or `dnevna-svetlost:needs-review`
  - Leaves audit log in PR comment
  - **Persona**: `dnevna-svetlost-core` (octave: 11, hipermreza node: 90)
  - **Complementary pair**: MRKLI MRAK (octave: 11, hipermreza node: 89) — together they cover the full ambient-light spectrum
### reklamitin-validator-agent (NEW)
- **Role**: Validate REKLAMITIN logic — radical-level reproduction advertising, broadcast engine, reach calculation, and edge-case integrity
- **Scope**: AI-IQ-SUPER-PLATFORMA — `src/lib/reklamitin/**`, `src/app/api/reklamitin/**`
- **Trigger**: PR with label `reklamitin:logic-change`, push touching `reklamitin` paths
- **Actions**:
  - Runs unit test suite for REKLAMITIN logic (types, registry, level-engine, broadcast-engine, reach-engine, reklamitin-engine)
  - Verifies all 4 radical levels (STANDARD, ELEVATED, AGGRESSIVE, RADICAL) and escalation logic
  - Validates RADICAL level: zeroCap = true, frequencyCapHz = 0, intensityScore = 1000
  - Verifies edge cases (NaN, Infinity, negative budgetScore/durationSeconds, empty broadcastTargets, invalid audienceSegment)
  - Validates disclaimer always present in every response ("Reklamitin rezultati su automatski generisani.")
  - Checks performance KPIs: evaluation ≤ 50ms, API response ≤ 200ms, broadcast dispatch ≤ 100ms
  - Scans for code inconsistencies and secrets
  - Auto-labels PRs with `reklamitin:validated` or `reklamitin:needs-review`
  - Leaves audit log in PR comment
  - **Persona**: `reklamitin-core` (octave: 9, hipermreza node: 72)
  - **OKRID**: `OKRID-2026-REKLAMITIN-14856`
  - **Note**: 14856
  - **Multi-repo sync**: Syncs reproduction-ad catalog snapshots to `spaja86/IO-OPENUI-AO`

## Rules

1. **Audit Logs** - Agents must leave clear audit logs either in commit messages or PR comments.
2. **Human Review** - Agents must not merge changes without at least one human review (except branches marked `auto-merge: allowed`).
3. **Security** - Agents must not introduce secrets into the repo; use GitHub Secrets or a secret manager.
   - Never commit `.env` files
   - Use GitHub Secrets for sensitive data
4. **Config Changes** - Agents that modify configuration must label PRs with `agent:config-change`.
5. **Security Scanning** - Security agents must scan for vulnerable dependencies and flag them with `security:needs-review`.
6. **Multi-Repo Sync** - For multi-repo platforms (like SUPER-PLATFORMA), agents must sync status across all linked repos.
7. **Custom Config** - All agents must respect `.agent-config.json` files in each repo for custom behavior.
8. **Commit Sign-off** - All agent commits must be signed (`git commit -S`).
9. **Cross-Repo Links** - Multi-repo agents must maintain working links and references between PRs, Issues, and commits.
10. **Dependency Coherence** - Dependency versions must be synchronized where possible (shared packages).
11. **Quality Gate Consistency** - Deploy and configuration workflows must follow the same gate model: lint, test, smoke, predeploy, and security checks; build remains a required release gate when the runtime surface supports it.
12. **Issue → PR → Review → Release** - Agents must record the originating issue or reason for change, open an audit-ready PR, and wait for review before release/promotion.
13. **Audit Summary** - Deploy/config changes must include rollout, rollback, KPI impact, and downstream references in the PR description or workflow summary.
14. **Operational Secrets Boundary** - Agents must never move deploy hooks, env values, or private keys from secret-management systems into the Git repository.

## How to Add a New Agent

1. Add an entry here with name, role, scope, identity/webhook, owner and contact.
2. Create a `.github/workflows/` file for the agent.
3. Create a `.agent-config.json` file with custom settings.
4. Open a PR documenting behavior and add tests that validate expected behavior.
5. Get human-review before merging.

## Registered Agents

| Agent | Role | Trigger | Owner | Status | Scope |
|-------|------|---------|-------|--------|-------|
| ci-bot | Testing & Linting | PR, Push | @spaja86 | ✅ Active | All repos |
| human-review | Code Review | Manual | @spaja86 | ✅ Active | All repos |
| deploy-bot | Deployment | Merge to main | @spaja86 | ⏳ Planned | All repos |
| security-scanner | Security Scanning | PR, Nightly | @spaja86 | ✅ Active | All repos |
| multi-repo-sync-agent | Multi-Repo Sync | Push, Weekly | @spaja86 | ✅ Active | SUPER-PLATFORMA ↔ IO-OPENUI-AO |
| calculator-validator-agent | Calculator Logic | PR, Branch | @spaja86 | ✅ Active | IO-OPENUI-AO |
| analytics-bot | Metrics & Reports | Nightly, Weekly | @spaja86 | ✅ Active | All repos |
| gigatron-validator-agent | GIGATRON Validation | PR, Branch | @spaja86 | 📋 Ready | AI-IQ-SUPER-PLATFORMA (GIGATRON paths) |
| persona-bank-agent | Unified Persona Banking | PR, Push, Nightly | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (persona-bank paths) |
| decibil-validator-agent | DECIBIL Audio/Signal Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (decibil paths) |
| trenazer-validator-agent | TRENAŽER Training Readiness Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (trenazer paths) |
| dumbir-validator-agent | ÐUMBIR Ginger Wellness Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (dumbir paths) |
| mrkli-mrak-validator-agent | MRKLI MRAK Darkness Readiness Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (mrkli-mrak paths) |
| paraksil-validator-agent | PARAKSIL Module Validation Sandbox | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (paraksil paths) |
| tarken-hingil-ekolan-maksimus | Apex Strategic Orchestration | PR, Push, Weekly | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (tarken-hingil-ekolan-maksimus paths) |
| discount-telecom-validator-agent | Discount Telecom Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (discount-telecom paths) |
| mirikl-validator-agent | MIRIKL GitHub/Vercel Governance Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (MIRIKL governance paths) |
| great-sumbion-validator-agent | GREAT SUMBION Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (great-sumbion paths) |
| konvencionalni-odnosi-validator-agent | KONVENCIONALNI ODNOSI Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (konvencionalni-odnosi paths) |
| madagaskar-validator-agent | Exotic Market Intelligence | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (madagaskar paths) |
| force-validator-agent | FORCE Engine Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (force paths) |
| extrimli-validator-agent | Extreme Sports & Adventure Intelligence | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (extrimli paths) |
| extrimli-cuz-validator-agent | Community & Social Hub Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (extrimli-cuz paths) |
| digit-engine-validator-agent | Digit Intelligence Engine Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (digit-engine paths) |
| maksimus-validator-agent | MAKSIMUS Analytical/Development Apex Agent | PR, Push, Weekly | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (maksimus paths) |
| epekm-denter-validator-agent | EPEKM-D Permanent Email Denter Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (epekm-denter paths) |
| dijagnoza-validator-agent | DIJAGNOZA Health Diagnostic Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (dijagnoza paths) |
| zlatni-racuni-validator-agent | ZLATNI RAČUNI Loyalty & Tier Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (zlatni-racuni paths) |

| ekzist-validator-agent | EKZIST Existential Profiler & Life Meaning Engine | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (ekzist paths) |
| konvenkcionalni-odnosi-validator-agent | KONVENKCIONALNI ODNOSI Relation Management Validation | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (konvenkcionalni-odnosi paths) |
| adutiv-validator-agent | ADUTIV Advantage Intelligence Engine | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (adutiv paths) |
| ekvivalent-network-validator-agent | EKVIVALENT NETWORK Equivalence Mapping Engine | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (ekvivalent-network paths) |
| astronomik-money-validator-agent | ASTRONOMIK MONEY Cosmic Financial Intelligence | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (astronomik-money paths) |
| dnevna-svetlost-validator-agent | DNEVNA SVETLOST Daylight Exposure & Wellbeing Engine | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (dnevna-svetlost paths) |
| reklamitin-validator-agent | REKLAMITIN Reprodukcion Advertising Engine | PR, Branch | @spaja86 | 🚀 Active | AI-IQ-SUPER-PLATFORMA (reklamitin paths) |
## Agent Configuration Files

Each repository can have a `.agent-config.json`:
{
  "agents": {
    "ci-bot": {
      "enabled": true,
      "languages": ["typescript", "javascript"],
      "autoFix": true,
      "requireApproval": false
    },
    "multi-repo-sync-agent": {
      "enabled": true,
      "linkedRepos": ["spaja86/IO-OPENUI-AO"],
      "syncInterval": "weekly",
      "fields": ["versions", "labels", "milestones"]
    },
    "calculator-validator-agent": {
      "enabled": false,
      "performanceThreshold": 100,
      "testSuite": "calculator-tests"
    }
  }
}
```

## Contact

- **Owner**: IO-OPENUI-AO team / SUPER-PLATFORMA team
- **Email**: team@spaja86.dev
- **GitHub**: [@spaja86](https://github.com/spaja86)
- **Repository Links**:
  - 🔗 [IO-OPENUI-AO](https://github.com/spaja86/IO-OPENUI-AO)
  - 🔗 [AI-IQ-SUPER-PLATFORMA](https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA)
- Leave feedback or questions in a PR
