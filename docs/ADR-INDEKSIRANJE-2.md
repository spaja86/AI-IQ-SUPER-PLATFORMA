# ADR: INDEKSIRANJE 2 — v2 Indexing Pipeline

**Status:** Accepted  
**Datum:** 2026-06-02  
**Autori:** AI Copilot (na osnovu plana spaja86)

---

## Kontekst

Sistem SPAJA BAZA koristi v1 indeksni pipeline (`KNOWLEDGE_INDEX_VERSION = 'v1'`) koji:
- Normalizuje sadržaj (`normalizeIndexText`) i upisuje u `indexed_content`.
- Rangira rezultate po formuli: `lexical*0.6 + trust*0.25 + indexCoverage*0.15`.
- `indexCoverage` je binarni signal (0 ili 1) — nema granulacije.

V1 je funkcionalan ali ima ograničenja:
1. Ne nagrađuje chunk-ove gde se termini upita višestruko ponavljaju.
2. Ignoriše bogatstvo vokabulara izvora (npr. specijalizovani vs. generički sadržaj).
3. `indexed_content` ne sadrži phrase-level signale (bigrame) koji bi poboljšali višerečne upite.

---

## Odluka

Implementira se **INDEKSIRANJE 2** kao prošireni lexical+metadata v2 pipeline, **dual-mode** (v1 i v2 koegzistiraju) uz kontrolu verzije po chunk-u.

### Šta je v2?
- **Enhanced `indexed_content`**: normalizovani tekst + top bigrams (adjacent word pairs), poboljšava višerečno poklapanje bez vektorskih embedding-a.
- **`keyword_density`**: pre-izračunata gustina jedinstvenih tokena (0–1), meri bogatstvo vokabulara.
- **`unique_term_count`**: broj distinktnih tokena; operativna metrika kvaliteta indeksiranja.
- **Novi scoring**: `lexical*0.45 + termFrequency*0.20 + trust*0.20 + keywordDensity*0.15`.

### Šta v2 NIJE?
- **Nije** semantičko vektorsko indeksiranje (pgvector/OpenAI embeddings) — nema konfiguracije embedding API-ja u ovom repo-u.
- **Nije** zamena za v1 — v1 ostaje aktivan tokom rollout-a i može se ponovo aktivirati.

---

## Arhitektonske odluke

### 1. Dual-mode s per-chunk verzionisanjem
Svaki chunk nosi `index_version` (`v1` ili `v2`). `searchKnowledge` automatski bira scoring formulu na osnovu verzije chunk-a. Nema global switch — migracija je inkrementalna.

*Alternativa odbačena:* globalni feature flag (`SPAJA_BAZA_INDEX_VERSION` env var). Odbačena jer bi zahtevala re-index svih chunk-ova odjednom i onemogućila dual-read poređenje.

### 2. `upgradeToV2` kao eksplicitni parametar
Upgrade v1→v2 chunk-ova je **opt-in** kroz `POST /api/spaja-baza-knowledge/index { upgradeToV2: true }`. Default mode ne dira postojeće v1 chunk-ove.

*Zašto:* sprečava nenamerni mass re-index koji bi blokirao tekući ingest i zauzimao bazu.

### 3. Bigrams u `indexed_content` umesto posebne kolone
Bigrams se dodaju u existirajuću `indexed_content` kolonu (u v2 sadržaju). Time se ne dodaje nova kolona za v2 tekst, a `ilike` pretraga ostaje ista.

*Kompromis:* `indexed_content` za v2 chunk-ove je malo veći (max 6000 chars, isti cap). Gubitak: v2 `indexed_content` nije čisto "normalizovani tekst" — ali to je OK jer se verzija prati kroz `index_version`.

### 4. Novi DB indeksi bez promene RLS politike
Dodaju se parcijalni indeksi (`WHERE embedding_status = 'indexed'`) koji ne menjaju pristupnu politiku. RLS ostaje `service_role only` kao u `004_spaja_baza_knowledge.sql`.

### 5. Backward compatibility API-ja
`/api/spaja-baza-knowledge/search` i `/index` response shape se ne menjaju (nova polja su additivna). Downstream consumer (`/api/spaja-pro/chat`) ne zahteva izmene.

---

## Rollout plan

| Faza | Opis | Exit kriterijum |
|------|------|-----------------|
| 1 – Dark launch | Novi chunk-ovi indexiraju se na v2; v1 chunk-ovi ostaju nedirnutu | v2 count > 0 u `indexedV2` metrici |
| 2 – Upgrade batches | `upgradeToV2: true` batches konvertuju v1 chunk-ove | `indexedV2 / indexed > 50%` |
| 3 – Dual-read monitoring | Prate se citation rate i latencija za v2 vs v1 chunk-ove | v2 citation rate ≥ v1 baseline, latencija ≤ 110% v1 |
| 4 – Stabilizacija | v2 je primarni za sve pretrage, v1 path ostaje kao fallback | 7 dana bez degradacije |

---

## Posledice

**Pozitivne:**
- Bolja relevantnost za višerečne upite (bigrams).
- Granularniji signal kvaliteta (keyword density) umjesto binarnog coverage signala.
- Inkrementalna migracija bez downtime.
- Operativna vidljivost (v1/v2 breakdown u `/index` API-ju i control panelu).

**Negativne/rizici:**
- Kratkotrajno: chunk-ovi u mešanom stanju (neke v1, neke v2) tokom rollout-a.
- `computeTermFrequencyScore` koristi `RegExp` per-term — za very large corpora može biti sporije od čistog `includes`. Rizik nizak pri current chunk cap (6000 chars, limit 80).
- Bigrams povećavaju `indexed_content` volumen; treba pratiti DB storage trend.

---

## Reference

- `src/lib/spaja-baza-knowledge.ts` — core implementacija
- `supabase/migrations/013_spaja_baza_indeksiranje_v2.sql` — schema
- `docs/SPAJA-BAZA-RUNBOOK.md` §7 — operativni vodič
- `src/tests/autofinish/spaja-baza-knowledge-v2-indexing.test.ts` — autofinish #1408
