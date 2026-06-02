# ADR: INDEKSIRANJE 3 — PostgreSQL FTS + Position Signal Pipeline

**Status:** Accepted  
**Datum:** 2026-06-02  
**Autori:** AI Copilot (na osnovu plana spaja86)

---

## Kontekst

Sistem SPAJA BAZA koristi dual-mode indeksni pipeline (v1 i v2):

| Verzija | Query mehanizam | Signali |
|---------|-----------------|---------|
| v1 | `ilike(indexed_content, '%term0%')` — samo prvi termin | lexical, trust, binarni indexCoverage |
| v2 | `ilike(indexed_content, '%term0%')` — samo prvi termin | + bigrams, keyword_density, termFrequency |

Oba imaju zajednički strukturni problem:
- **Samo prvi termin** višerečnog upita se koristi za SQL pretragu — ostali termini se evaluiraju tek u TypeScript scoring fazi, ali ne smanjuju skup kandidata.
- **Pozicija chunk-a** unutar dokumenta je ignorisana — chunk koji je na kraju dokumenta dobija isti tretman kao uvodni paragraf.

---

## Odluka

Implementira se **INDEKSIRANJE 3** kao PostgreSQL FTS + position signal v3 pipeline, **tri-mode** (v1, v2, v3 koegzistiraju) uz kontrolu verzije po chunk-u.

### Šta je v3?

- **Multi-term FTS query**: `textSearch('indexed_content', query, { type: 'plain', config: 'simple' })` zamenjuje `ilike` za primarnu pretragu. Koristi već-postojeći GIN FTS indeks iz migracije 012. PostgreSQL `plainto_tsquery('simple', ...)` pretražuje SVE terme upita (AND logika).
- **FTS fallback**: kada FTS vrati 0 rezultata (kratki upiti, stopwords), automatski se pada na single-term `ilike` — bez promene za consumer-a.
- **`position_score`**: pre-izračunati eksponencijalni score koji nagrađuje chunk-ove bliže početku dokumenta. Formula: `exp(-chunk_index * 0.1)`. chunk 0 → 1.0; chunk 10 → ≈0.37; chunk 20 → ≈0.14.
- **Novi scoring v3**: `lexical*0.35 + termFrequency*0.25 + trust*0.20 + keywordDensity*0.15 + positionScore*0.05`.

### Šta v3 NIJE?

- **Nije** semantičko vektorsko indeksiranje (pgvector/OpenAI embeddings) — nema konfiguracije embedding API-ja u ovom repo-u. To ostaje za v4.
- **Nije** zamena za v1/v2 — svi tri moda ostaju aktivni tokom rollout-a i mogu se ponovo aktivirati.
- **Nije** nova shema `indexed_content` — v3 rekoristi isti `indexed_content` format kao v2 (bigrams + normalized), jer GIN indeks već postoji.

---

## Arhitektonske odluke

### 1. `textSearch` s `'simple'` konfiguracijom
Koristi se isti `'simple'` dictionary koji je korišćen pri kreiranju GIN indeksa u migraciji 012 (`to_tsvector('simple', indexed_content)`). Nema stemming-a — svi jezici tretiraju se uniformno.

*Alternativa odbačena:* `'english'` ili `'serbian'` config sa stemmingom. Odbačena jer bi zahtevala novi GIN indeks i nije kompatibilna sa višejezičnim sadržajem u bazi.

### 2. FTS → ilike fallback unutar `searchKnowledge`
Kada FTS ne vrati rezultate (npr. upiti sa samo jednom rečju dužinom ≤ 2, ili svi termini su stopwords), automatski se prelazi na single-term `ilike`. Consumer (`/api/spaja-pro/chat`) ne mora da zna o ovom fallback-u.

*Alternativa odbačena:* vraćanje praznog rezultata i zahtevanje retry-a od consumer-a. Odbačena jer uvodi nepotrebnu latenciju i kompleksnost u consumer logici.

### 3. `position_score` kao pre-izračunata kolona
Umesto da se `chunk_index` čita i formula računa u TypeScript-u za svaki search, `position_score` se jednom upisuje pri indexiranju. Pretraga ga samo čita.

*Kompromis:* vrednost je statična od trenutka indeksiranja. Ako se chunk_index promeni (re-ingest dokumenta), chunk mora biti re-indeksiran na v3 da bi `position_score` bio ažuran.

### 4. `upgradeToV3` konvertuje i v1 i v2 chunk-ove
Isključuje se samo `index_version = 'v3'` (već konvertovani). v1 i v2 chunk-ovi oba dobijaju v3 signal.

*Razlog:* v3 je nadskup v2 — radi sve što v2 radi plus position signal. Nema smisla zadržati v2 kao "intermediate" posle v3 rollout-a.

### 5. Backward compatibility API-ja
`/api/spaja-baza-knowledge/search` i `/index` response shape se ne menjaju (nova polja su additivna). Downstream consumer (`/api/spaja-pro/chat`) ne zahteva izmene.

---

## Rollout plan

| Faza | Opis | Exit kriterijum |
|------|------|-----------------|
| 1 – Dark launch | Novi chunk-ovi indexiraju se na v3; v1/v2 chunk-ovi ostaju nedirnutu | v3 count > 0 u `indexedV3` metrici |
| 2 – Upgrade batches | `upgradeToV3: true` batches konvertuju v1/v2 chunk-ove | `indexedV3 / indexed > 50%` |
| 3 – Dual-read monitoring | Prate se citation rate i latencija za v3 vs v2 chunk-ove | v3 citation rate ≥ v2 baseline, latencija ≤ 110% v2 |
| 4 – Stabilizacija | v3 je primarni za sve pretrage, v1/v2 path ostaje kao fallback | 7 dana bez degradacije |

---

## Posledice

**Pozitivne:**
- FTS `textSearch` (AND semantika) značajno smanjuje lažne pogotke za višerečne upite.
- GIN indeks se koristi u oba smera: pri indexiranju (insert/update) i pri pretragi — bez troška kreiranja novog indeksa.
- `position_score` daje prednost relevantnim "uvod/naslov" chunk-ovima.
- Inkrementalna migracija bez downtime.
- Operativna vidljivost (v1/v2/v3 breakdown u `/index` API-ju i control panelu).

**Negativne/rizici:**
- FTS AND semantika može vratiti 0 rezultata za upite s retkim ili specifičnim terminima — fallback na ilike osigurava da pretraga uvek nešto vrati, ali može biti manje precizna.
- `position_score` je statičan — stari v3 chunk-ovi (čiji je source re-crawled) imaće pogrešan score dok se ne re-indeksiraju.
- Trostruki mod (v1/v2/v3) povećava branch kompleksnost u scoring logici, ali je jasno odvojen per-chunk verzionim oznakamat.

---

## Reference

- `src/lib/spaja-baza-knowledge.ts` — core implementacija
- `supabase/migrations/014_spaja_baza_indeksiranje_v3.sql` — schema
- `docs/SPAJA-BAZA-RUNBOOK.md` §9 — operativni vodič
- `src/tests/autofinish/spaja-baza-knowledge-v3-indexing.test.ts` — autofinish #1411
