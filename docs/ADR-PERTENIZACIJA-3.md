# ADR: PERTENIZACIJA 3 — Personalization v3

**Status:** Accepted  
**Datum:** 2026-06-03  
**Autori:** AI Copilot (na osnovu plana spaja86)

---

## Kontekst

PERTENIZACIJA 2 uvela je strukturirani personalizacioni engine (`engine-v2.ts`) sa:
- Eksplicitnim stable/contextual preferencijama (ton, detaljnost, jezički stil, tematike),
- Confidence scoreom (0–1),
- Per-user opt-out/opt-in i globalnim kill-switchem,
- Explainability endpointom koji objašnjava zašto je odgovor personalizovan.

v2 je statičan: preferencije se ne ažuriraju automatski kroz sesije, ne postoji signal o kvalitetu personalizacije iz korisničkih reakcija, a temperature routing nije kontekstualno adaptivan.

Potrebna je **PERTENIZACIJA 3** iteracija koja uvodi:
- **Adaptivno učenje** iz istorije sesija (automatski updateovane topic weights, session tempo),
- **Feedback signale** (thumbs-up/down za personalizacioni kvalitet),
- **Kompozitni v3 score** koji kombinuje v2 confidence, adaptivne signale i feedback ratio,
- **Hard fallback na v2/v1** kada je kill-switch ili opt-out aktivan.

---

## Odluka

Implementira se **PERTENIZACIJA 3** kao novi personalizacioni sloj iznad v2 koji:

### Šta je v3?

- **Adaptivne preferencije** (`adaptive_preferences` JSONB): topic weights (per-topic score 0–1), session tempo (`fast`/`deep`), session count i lastAdaptedAt.
- **Feedback signale** (`personalization_feedback` JSONB): positiveCount, negativeCount, lastFeedbackAt.
- **v3 Composite Score** (`personalization_v3_score` NUMERIC(4,3)):  
  `score = confidence×0.5 + adaptiveScore×0.3 + feedbackRatio×0.2`  
  Gde `adaptiveScore = sessionNorm×0.6 + topicRichness×0.4` (oba normalizovana 0–1).
- **Personalization Engine v3** (`src/lib/personalizacija/engine-v3.ts`): TypeScript modul koji:
  - Importuje i wrappuje v2 engine,
  - Generiše v3-specifične signale (adaptive topics, session tempo instruction, adaptive temperature),
  - Vraća isti `PersonalizationSignals` tip sa `version: 'v3'` markerom,
  - Hard fallback: ako `PERSONALIZATION_V3_ENABLED=false` ili profil nije `v3`, delegira na v2 pipeline.
- **Dedupliciran knowledge hint**: top topics iz stable + contextual + adaptive, bez duplikata.
- **Adaptive temperature**: deep sesije dobijaju temperature=0.7 (osim ako je tonStyle=technical → ostaje 0.3).

### Feature flag

Env var `PERSONALIZATION_V3_ENABLED=false` isključuje v3 engine globalno.  
Individualni kill-switch: `personalization_opt_out: true` ili `personalization_enabled: false`.  
v2 kill-switch `PERSONALIZATION_V2_ENABLED=false` ostaje nezavisan.

---

## Rollout faze

| Faza | Opis | Uslov za prelaz |
|------|------|-----------------|
| Dark launch | `personalization_version = 'v2'` za sve; v3 aktivan ali ne aktivira se | — |
| Shadow mode | Subset Pro/Enterprise korisnika sa `personalization_version = 'v3'`; merenje v3Score distribucije | avgV3Score ≥ 0.5 |
| Parcijalni rollout | Pro/Enterprise + high-confidence korisnici dobijaju v3; praćenje quality score i opt-out rate | quality score ≥ v2 baseline i opt-out < 5% |
| Full rollout | Svi korisnici sa aktivnom personalizacijom premešteni na v3 | opt-out rate < 5% |

---

## Rollback uslovi i kill-switch

- **Globalni kill-switch**: `PERSONALIZATION_V3_ENABLED=false` — vraća sve na v2/v1 bez deploymenta.
- **Per-user rollback**: PUT `/api/spaja-pro/settings` sa `{ resetPersonalizationV3: true }` ili `{ personalizationVersion: 'v2' }`.
- **Full reset**: PUT sa `{ resetPersonalization: true }` briše i v2 i v3 podatke, vraća na v1.
- **Automatski rollback**: Ako v3 adoption rate padne ispod 60% pro/enterprise baze u 24h.

---

## KPI metrike uspeha

| Metrika | v2 cilj | v3 cilj |
|---------|---------|---------|
| citation rate | ≥ 45% | ≥ 50% |
| fallback rate | ≤ 8% | ≤ 6% |
| quality score (avg) | ≥ 0.72 | ≥ 0.76 |
| opt-out rate | < 5% | < 5% |
| avg v3 composite score | N/A | ≥ 0.55 |
| avg v2 confidence | ≥ 0.6 | ≥ 0.6 |

---

## Compat mode — v1/v2 kompatibilnost

- Svi profili koji nisu eksplicitno `v3` prolaze kroz v2 pipeline bez promene.
- `engine-v3.ts` re-exportuje sve v2 helpere (`mergePersonalizationIntoPrompt`, `applyStablePreferenceUpdate`, `buildExplainabilityPayload`, itd.) — consumer kod koji je koristio engine-v2 može graditi na engine-v3 bez promena.
- `PersonalizationVersion` type u engine-v3 proširuje v2 tip na `'v1' | 'v2' | 'v3'`.

---

## Pravila privatnosti i retention

- `adaptive_preferences` i `personalization_feedback` sadrže samo strukturirane signale (ne PII).
- Korisnik može resetovati sve v3 podatke kroz `resetPersonalizationV3: true`.
- `resetPersonalization: true` briše i v2 i v3 podatke i vraća na v1.
- Retention policy: identična sa ostatkom `profiles` tabele.

---

## Implikovane promene

| Artefakt | Promena |
|----------|---------|
| `supabase/migrations/017_pertenizacija_v3.sql` | Novi JSONB/numeric kolone u `profiles` |
| `src/lib/supabase/types.ts` | v3 polja u Row/Insert/Update tipovima |
| `src/lib/personalizacija/engine-v3.ts` | Novi core modul (v3 layer nad v2) |
| `src/app/api/spaja-pro/chat/route.ts` | v3 hooks pre-routing, pre-prompt, response payload |
| `src/app/api/spaja-pro/settings/route.ts` | v3 fields u GET/PUT + v3 explainability |
| `src/app/api/spaja-pro/personalizacija-explain/route.ts` | v3 explainability path |
| `src/app/api/spaja-baza-knowledge/metrics/route.ts` | v3 adoption + avgV3Score metrike |
| `src/tests/autofinish/pertenizacija-v3-route.test.ts` | Autofinish #1423 test suite |
| `src/lib/constants.ts` | APP_VERSION → 59.76.0, AUTOFINISH_COUNT → 1423 |
| `docs/SPAJA-BAZA-RUNBOOK.md` | Operativna sekcija za PERTENIZACIJA 3 |

---

## Alternativne opcije

| Opcija | Razlog odbijanja |
|--------|-----------------|
| ML model za real-time inference | Van scope za v3; priprema infrastrukture je dovoljna |
| Zasebna `personalization_adaptive` tabela | Overhead nije opravdan; JSONB u `profiles` je dovoljan za fazu v3 |
| v3 integrisati direktno u v2 engine | Narušava kompatibilnost i SRP; bolje kao zasebni v3 layer |
