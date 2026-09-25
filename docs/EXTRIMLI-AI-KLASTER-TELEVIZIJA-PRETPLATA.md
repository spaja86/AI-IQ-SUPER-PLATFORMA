# EXTRIMLI — AI KLASTER / TELEVIZIJA pretplata governance (Legacy / Deprecated)

**Status:** `documentation-only-bounded-plan` + `deprecated-standalone-surface`  
**Owner:** Kompanija SPAJA / Digitalna Industrija  
**Parent lock:** `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA`  
**Replacement surfaces:** `docs/EXTRIMLI-DEVELOPER-CREATE-PROGRAM.md`, `docs/EXTRIMLI-EXTERNAL-GITHUB.md`

---

## 1. Kanonski scope

`DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == TELEVIZIJA` ostaje additive-only bounded media/distribution alias unutar postojećeg `EXTRIMLI / EXTREM / EXTRONDOL / SPAJA KOD` modela.

Ovaj paket:

- ne uvodi nove runtime rute
- ne uvodi paralelni source-of-truth sistem
- ne uvodi obavezno emitovanje
- ne uvodi bypass ili provider-lockout logiku
- ne garantuje kanal br. `1`, već dozvoljava samo zakonit `requested-prominence` komercijalni zahtev

---

## 2. Ownership split

- **EXTREM** — tehnička spremnost distribucije, provider intake, region/jezik matrix, fallback posture
- **EXTRONDOL** — ugovori, compliance, review, rollout/rollback, payment verification, provider governance, pretplata
- **SPAJA KOD** — audit-safe summary status i downstream reference

Zaključani ownership split ostaje:

- `DOK + DIK + FOR` -> `EXTREM`
- `DAK + DUK` -> `EXTRONDOL`
- `SPAJA KOD` -> `summary-only`

---

## 3. Requested-prominence provider plan

Kanonski provider plan ostaje **requested-prominence-only**.

Dozvoljeni ciljevi:

1. **Primarni cilj** — `prominence request`
2. **Sekundarni cilj** — `premium-news / featured / category placement`
3. **Tercijarni cilj** — `branded landing / promotional slot`

Nije dozvoljeno:

- modelovati “kanal 1” kao zagarantovan ishod
- modelovati distribuciju kao neuklonjivu
- uvoditi prinudni placement ili provider enforcement
- uvoditi nove izvršne ili pravne mehanizme van postojećeg governance okvira

Ako linearni TV uslov ne prođe, kanonski fallback ostaje:

- `OTT/web/app mirror`
- rezervni cadence za `radio/social/web`
- isti `READY | WATCH | BLOCKED` status jezik

---

## 4. Provider governance matrica

| Oblast | EXTREM tehnički signal | EXTRONDOL governance | SPAJA KOD summary |
|---|---|---|---|
| Provider intake | tehnički intake completeness | provider onboarding review | intake status |
| Pravna spremnost | bounded legal-readiness cues | ugovor, licensing, content-rights | legal posture |
| Distribucija | kanal paketi, region/jezik matrix | rollout/freeze/promote odluka | distribution status |
| Komercijala | requested rank target + fallback | invoice/payment verification | commercial posture |
| Fallback | OTT/web/app mirror readiness | fallback approval | fallback summary |

Obavezni status model ostaje:

`draft -> legal-review -> approved-for-invoice -> payment-confirmed -> service-active`

Po potrebi mogu ostati aktivni i postojeći zaštitni statusi:

- `payment-pending`
- `rollback`
- `blocked-until-validated`

---

## 5. AI KLASTER pretplata paket

`AI KLASTER` ostaje enterprise subscription governance paket bez aktivacije dok nisu potvrđeni ugovor i plaćanje.

Obavezne celine:

- seats / prava pristupa
- build nivo
- deploy nivo
- analytics nivo
- SLA / support nivo
- mesečni budžeti
- warning pragovi
- payment verification
- ownership i admin backup

Bez `payment-confirmed` i bez validiranog ugovornog osnova:

- nema aktivacije
- nema enterprise benefita
- nema provider rollout promocije

---

## 6. Audit evidence paket

Za `TELEVIZIJA` traku obavezni su sledeći audit-safe elementi:

- cadence po kanalima
- regioni/jezici
- review/compliance posture
- rollout plan
- rollback plan
- downstream reference

Sirovi pregovori, cenovni detalji, provider-formule, privatni kontakti i operativni kredencijali ostaju van javnog sloja i van downstream sync-a.

---

## 7. Downstream boundary prema `IO-OPENUI-AO`

Downstream sync ostaje strogo summary-only.

Dozvoljeno je sinhronizovati samo:

- status distribucije
- blocker/watch reason
- review posture
- downstream reference
- bounded provider-plan summary

Nije dozvoljeno sinhronizovati:

- sirove provider formule
- interne pregovore
- komercijalne ili pravne nacrte
- operativne kontakte i pristupe
- enforcement ili “ne mogu da me uklone” logiku

---

## 8. Acceptance kriterijumi

- nema novih runtime ruta
- nema paralelnog source-of-truth sistema
- nema obaveznog emitovanja
- nema prisilnog EPG plasmana
- nema bypass/provider-lockout logike
- svi izlazi ostaju `READY | WATCH | BLOCKED`
- TV/radio/social ostaju audit-safe media strategy, ne enforcement sistem

---

## 9. WAWE + B2B gate obaveze

- Aktivacija je dozvoljena samo uz: `contract-approval`, `compliance-review`, `human-review`, `payment-verification`, `downstream-reference`.
- WAWE 1–5 redosled je obavezan (`wawe-1-pre-release-validation`, `wawe-2-build-and-staging`, `wawe-3-downstream-sync`, `wawe-4-progressive-rollout`, `wawe-5-resilience-and-final-audit`).

---

## 10. Povezani dokumenti

- `/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA/docs/EXTRIMLI-DEVELOPER-CREATE-PROGRAM.md`
- `/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA/docs/EXTRIMLI-VRH-PROGRAMSKOG-EKVILADENTA.md`
- `/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA/docs/MULTI-REPO-LINKS.md`
- `/home/runner/work/AI-IQ-SUPER-PLATFORMA/AI-IQ-SUPER-PLATFORMA/docs/GITHUB-VERCEL-PRETPLATA-SEGMENTACIJA.md`
