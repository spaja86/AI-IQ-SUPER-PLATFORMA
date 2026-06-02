# ADR: PERTENIZACIJA 2 — Personalization v2

**Status:** Accepted  
**Datum:** 2026-06-02  
**Autori:** AI Copilot (na osnovu plana spaja86)

---

## Kontekst

SpajaPro v1 personalizacija je implicitna i bazira se isključivo na `custom_instructions` i `memory` string polju u profilu.  
Ne postoji:
- eksplicitna klasifikacija preferencija (ton, detaljnost, tematika),  
- v2 confidence score za personalizacione signale,  
- opt-out/opt-in kontrola po korisniku,  
- observability payload koji objašnjava zašto je odgovor personalizovan.

Potrebna je **PERTENIZACIJA 2** iteracija koja uvodi eksplicitni v2 personalizacioni engine uz pun fallback na v1 ponašanje.

---

## Odluka

Implementira se **PERTENIZACIJA 2** kao novi personalizacioni sloj koji:

### Šta je v2?

- **Strukturirani profil** (`stable_preferences` JSONB, `contextual_preferences` JSONB, `personalization_confidence`, `personalization_version`, `personalization_enabled`, `personalization_opt_out`) u `profiles` tabeli.
- **Personalization Engine v2** (`src/lib/personalizacija/engine-v2.ts`): čisti TypeScript modul koji kompajluje signale iz profila i vraća `PersonalizationSignals`.
- **Safe-merge pravilo**: v2 injection se uvek dodaje iza baznog system prompta i security instrukcija — nikad ih ne zamenjuje.
- **Pre-routing hook**: v2 `routingHint.preferredModel` informiše Smart Model Router pre model selekcije.
- **Knowledge hint**: `preferredTopics` signal je dostupan za buduću integraciju u RAG sloj (trenutno priprema infrastrukture).
- **Explainability endpoint** (`GET /api/spaja-pro/personalizacija-explain`): vraća `PersonalizationExplainability` payload.
- **Observability**: v2 adoption i opt-out metrike dostupne na `/api/spaja-baza-knowledge/metrics`.

### Feature flag

Env var `PERSONALIZATION_V2_ENABLED=false` isključuje v2 engine globalno (dark launch / kill-switch).  
Individualni kill-switch: `personalization_opt_out: true` ili `personalization_enabled: false` u profilu.

---

## Rollout faze

| Faza | Opis | Uslov za prelaz |
|------|------|-----------------|
| Dark launch | `personalization_version = 'v1'` za sve korisnike; engine aktivan ali nema efekta | - |
| Shadow compare | Subset korisnika sa `personalization_version = 'v2'`; logovanje signala bez promene odgovora | confidence metrike stabilne |
| Parcijalni rollout | Pro/enterprise korisnici dobijaju `v2` verziju; praćenje quality score | quality score ≥ v1 baseline |
| Full rollout | Svi korisnici sa `personalization_version = 'v2'` | opt-out rate < 5% |

---

## Rollback uslovi i kill-switch

- **Globalni kill-switch**: `PERSONALIZATION_V2_ENABLED=false` — vraća sve na v1 bez deploymenta.
- **Per-user rollback**: PUT `/api/spaja-pro/settings` sa `{ resetPersonalization: true }` ili `{ personalizationOptOut: true }`.
- **Automatski rollback**: Ako v2 adoption rate padne ispod 70% pro/enterprise baze u 24h.

---

## KPI metrike uspeha

| Metrika | v1 baseline | v2 cilj |
|---------|-------------|---------|
| citation rate | ~35% | ≥ 45% |
| fallback rate | ~12% | ≤ 8% |
| quality score (avg) | 0.65 | ≥ 0.72 |
| opt-out rate | N/A | < 5% |
| avg v2 confidence | N/A | ≥ 0.6 |

---

## Pravila privatnosti i retention

- `stable_preferences` i `contextual_preferences` sadrže samo strukturirane, anonymized preferencije (ne PII).
- Korisnik može resetovati sve v2 podatke u bilo kom trenutku (`resetPersonalization: true`).
- Retention policy: identična sa ostatkom `profiles` tabele.
- v2 preferences su vidljive korisniku kroz GET `/api/spaja-pro/settings` i explainability endpoint.

---

## Implikovane promene

| Artefakt | Promena |
|----------|---------|
| `supabase/migrations/016_pertenizacija_v2.sql` | Novi JSONB/boolean koloni u `profiles` |
| `src/lib/supabase/types.ts` | v2 polja u Row/Insert/Update tipovima |
| `src/lib/personalizacija/engine-v2.ts` | Novi core modul |
| `src/app/api/spaja-pro/chat/route.ts` | v2 hooks pre-routing, pre-prompt, response payload |
| `src/app/api/spaja-pro/settings/route.ts` | v2 fields u GET/PUT + explainability |
| `src/app/api/spaja-pro/personalizacija-explain/route.ts` | Novi explainability endpoint |
| `src/app/api/spaja-baza-knowledge/metrics/route.ts` | v2 adoption metrike |
| `src/tests/autofinish/pertenizacija-v2-route.test.ts` | Autofinish #1420 test suite |
| `src/lib/constants.ts` | APP_VERSION → 59.74.0, AUTOFINISH_COUNT → 1420 |

---

## Alternativne opcije

| Opcija | Razlog odbijanja |
|--------|-----------------|
| Integracija u `memory` string polje | Nije strukturirano; nema confidence/opt-out; ne skalira |
| Zasebna `personalization_profiles` tabela | Prevelik overhead za fazu 1; JSONB u `profiles` je dovoljan |
| ML model za inference preferencija | Van scope za PERTENIZACIJA 2; priprema infrastrukture |
