# ADR: INDEKSIRANJE 4 — Semantic Vector Retrieval + Hybrid Scoring

**Status:** Accepted  
**Datum:** 2026-06-02  
**Autori:** AI Copilot (na osnovu plana spaja86)

---

## Kontekst

Posle v3 (FTS + position signal), retrieval je i dalje pretežno lexical i može propustiti semantički srodne rezultate koji nemaju direktno terminološko preklapanje.

Potrebna je v4 iteracija koja:
- uvodi semantic retrieval kao primarni put,
- zadržava fallback na postojeći v3 FTS/ilike tok,
- ostaje kompatibilna sa postojećim v1/v2/v3 podacima i API ugovorima.

---

## Odluka

Implementira se **INDEKSIRANJE 4** kao **pgvector + embeddings** pipeline uz **hybrid scoring** i fallback lanac.

### Šta je v4?

- **Embedding indexiranje chunk-ova** (`embedding_vector vector(1536)`) sa model verzijom i timestamp metapodacima.
- **Primarna semantic pretraga** kroz `match_knowledge_chunks_v4` RPC (cosine similarity).
- **Hybrid scoring v4**: semanticSimilarity + lexical + termFrequency + trust + keywordDensity + positionScore.
- **Fallback lanac**: v4 semantic → v3 FTS (`textSearch`) → ilike fallback.
- **Observability**: `indexedV4` u index statusu i `retrieval_index_version` + `semantic_retrieval_used` u retrieval metricama.

### Šta v4 NIJE?

- Nije zamena koja gasi v1/v2/v3 odmah; sve verzije koegzistiraju tokom rollout-a.
- Nije breaking promena za `search` i `chat` response shape.

---

## Arhitektonske odluke

### 1) pgvector kao baza za semantic retrieval
Koristi se `vector(1536)` i parcijalni ivfflat indeks samo za `index_version = 'v4'` i `embedding_status = 'indexed'`.

### 2) Security-definer RPC za retrieval
Dodaje se `match_knowledge_chunks_v4(query_embedding_text, match_count, min_similarity)` kako bi retrieval ostao centralizovan i stabilan.

### 3) Inkrementalni upgrade model
`upgradeToV4` omogućava batch konverziju postojećih v1/v2/v3 chunk-ova bez masovnog prekida rada.

### 4) Metrike po verziji retrieval-a
`knowledge_retrieval_metrics` dobija `retrieval_index_version` i `semantic_retrieval_used` za A/B poređenje v3-v4.

---

## Rollout plan

| Faza | Opis | Exit kriterijum |
|------|------|-----------------|
| 1 – Dark launch | Novi chunk-ovi na v4, bez masovnog upgrade-a | `indexedV4 > 0` |
| 2 – Upgrade batches | `upgradeToV4: true` u kontrolisanim batch-evima | `indexedV4 / indexed > 50%` |
| 3 – Dual-read | Prati se quality/citation/latency po `retrieval_index_version` | v4 ne degradira SLA |
| 4 – v4 primary | Semantic path postaje primarni, v3 ostaje fallback | stabilan trend 7 dana |
| 5 – Stabilizacija | Odluka o eventualnom gašenju legacy upgrade putanja | bez incidenata |

---

## Posledice

**Pozitivne:**
- Bolji recall za semantički slične upite.
- Kontrolisan rollback i kompatibilnost sa postojećim API-jem.
- Jasniji operativni uvid u v3/v4 performanse.

**Rizici:**
- Zavisi od embedding provider-a i API dostupnosti.
- Dodatni trošak i latencija pri embedding generisanju.
- Dimenzija embedding modela mora ostati usklađena sa `vector(1536)` kolonom.

---

## Reference

- `src/lib/spaja-baza-knowledge.ts` — core implementacija
- `supabase/migrations/015_spaja_baza_indeksiranje_v4.sql` — schema + RPC
- `docs/SPAJA-BAZA-RUNBOOK.md` §10 — operativni vodič
- `src/tests/autofinish/spaja-baza-knowledge-v4-indexing.test.ts` — strukturna pokrivenost
