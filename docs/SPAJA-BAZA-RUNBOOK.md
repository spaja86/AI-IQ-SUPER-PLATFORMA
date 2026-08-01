# SPAJA BAZA Knowledge Runbook

## 1) Dodavanje izvora
- API: `POST /api/spaja-baza-knowledge/sources`
- Body:
```json
{
  "name": "github.com",
  "url": "https://github.com",
  "trustScore": 0.9,
  "language": "en",
  "category": "docs"
}
```
- URL mora proći allowlist/denylist politiku.

## 2) Start crawl/ingest
- API: `POST /api/spaja-baza-knowledge/crawl`
- Body:
```json
{
  "urls": [
    "https://docs.github.com/en/actions",
    "https://github.com/features/actions"
  ]
}
```
- Rezultat vraća `jobId`, `succeeded/failed` i greške.

## 3) Praćenje statusa
- Jobovi: `GET /api/spaja-baza-knowledge/crawl`
- Health: `GET /api/spaja-baza-knowledge/health`
- Metrike: `GET /api/spaja-baza-knowledge/metrics`
- Index status: `GET /api/spaja-baza-knowledge/index`
- Pokretanje index batch-a: `POST /api/spaja-baza-knowledge/index`
- UI: `/spaja-baza-control`

## 4) Pretraga i citati
- Search: `GET /api/spaja-baza-knowledge/search?q=<query>&limit=5`
- Citation details: `POST /api/spaja-baza-knowledge/citations`

## 5) Incident procedura
1. Proveri `health` i broj failed job-ova.
2. Proveri dead letters (`knowledge_dead_letters`) i poruke o grešci.
3. Pauziraj problematičan source (`knowledge_sources.status = paused`).
4. Re-run crawl sa manjim setom URL-ova.
5. Proveri citation rate i latenciju u `metrics`.

## 7) INDEKSIRANJE 2 (v2 pipeline)

### Pokretanje v2 indeksiranja (novi chunk-ovi)
- API: `POST /api/spaja-baza-knowledge/index`
- Body:
```json
{
  "indexVersion": "v2",
  "batchSize": 25,
  "maxBatches": 4
}
```
- Indeksira chunk-ove sa `embedding_status IN (not_indexed, failed)` koristeći v2 pipeline.

### Upgrade postojećih v1 chunk-ova na v2
- API: `POST /api/spaja-baza-knowledge/index`
- Body:
```json
{
  "indexVersion": "v2",
  "upgradeToV2": true,
  "batchSize": 25,
  "maxBatches": 10
}
```
- `upgradeToV2: true` odabira i već v1-indeksirane chunk-ove za re-procesiranje.
- Chunk-ovi koji su već na v2 (`index_version = 'v2'`) se automatski preskačaju.

### v2 vs v1 scoring
- **v1** (lexical 60% + trust 25% + indexCoverage 15%): binarni gate signal.
- **v2** (lexical 45% + termFrequency 20% + trust 20% + keywordDensity 15%):
  - `termFrequency`: nagrađuje chunk-ove gde se termini upita višestruko pojavljuju.
  - `keywordDensity`: nagrađuje chunk-ove s bogatim vokabularom (visok udeo jedinstvenih reči).

### Praćenje v1/v2 pokrivenosti
- `GET /api/spaja-baza-knowledge/index` vraća `status.queue.indexedV1` i `status.queue.indexedV2`.
- UI: `/spaja-baza-control` prikazuje "Indexed v1" i "Indexed v2" karticama.

### Rollout faze
| Faza | Opis |
|------|------|
| 1 – Dark launch | `upgradeToV2: false` — novi chunk-ovi odmah idu na v2; v1 ostaje primarni reader |
| 2 – Dual read | Servis vraća i v1 i v2 rezultate; porede se latencija i citation rate |
| 3 – v2 primary | Pošto je >80% chunk-ova na v2 i metrici stabilni, v2 postaje primarni |
| 4 – Stabilizacija | Monitoring 7 dana, pa opciono gašenje v1 upgrade puta |

### Rollback
- Ako v2 scoring daje lošije citation rate od v1 baseline-a, pokrenite `/index` sa `indexVersion: v1, forceReindex: true` da sve chunk-ove vratite na v1.
- Alternativno: env var `SPAJA_BAZA_INDEX_VERSION=v1` se može dodati kao kill-switch u budućoj iteraciji.

### Nove DB kolone (migracija 013)
| Kolona | Tip | Opis |
|--------|-----|------|
| `keyword_density` | NUMERIC(8,4) | Udeo jedinstvenih tokena u ukupnom broju (0–1) |
| `unique_term_count` | INTEGER | Broj distinktnih tokena dužine > 2 |

### Incident: v2 chunk-ovi ne popunjavaju bazu
1. Proveri `GET /api/spaja-baza-knowledge/index` → `status.queue.indexedV2`.
2. Proveri posljednjih 20 jobova u `latestJobs` → filter na `status = failed`.
3. Pokreni upgrade sa manjim `batchSize` (npr. 10) i `maxBatches: 2`.
4. Provjeri `knowledge_dead_letters` za ozbiljne greške.

## 8) Operativne smernice

- Držati ingest u legalnom opsegu (robots/TOS).
- Koristiti trusted izvore (visok `trust_score`).
- Ograničiti batch URL-ova po job-u.
- Ograničiti index batch (`batchSize`, `maxBatches`) da se izbegne overload.
- Redovno pratiti trendove failed job-ova i retrieval kvaliteta.

## 9) INDEKSIRANJE 3 (v3 pipeline)

### Pokretanje v3 indeksiranja (novi chunk-ovi)
- API: `POST /api/spaja-baza-knowledge/index`
- Body:
```json
{
  "indexVersion": "v3",
  "batchSize": 25,
  "maxBatches": 4
}
```
- Indeksira chunk-ove sa `embedding_status IN (not_indexed, failed)` koristeći v3 pipeline.

### Upgrade postojećih v1/v2 chunk-ova na v3
- API: `POST /api/spaja-baza-knowledge/index`
- Body:
```json
{
  "indexVersion": "v3",
  "upgradeToV3": true,
  "batchSize": 25,
  "maxBatches": 10
}
```
- `upgradeToV3: true` odabira i već v1/v2-indeksirane chunk-ove za re-procesiranje.
- Chunk-ovi koji su već na v3 (`index_version = 'v3'`) se automatski preskačaju.

### v3 vs v2 vs v1 scoring
- **v1** (lexical 60% + trust 25% + indexCoverage 15%): binarni gate signal.
- **v2** (lexical 45% + termFrequency 20% + trust 20% + keywordDensity 15%):
  - `termFrequency`: nagrađuje chunk-ove gde se termini upita višestruko pojavljuju.
  - `keywordDensity`: nagrađuje chunk-ove s bogatim vokabularom.
- **v3** (lexical 35% + termFrequency 25% + trust 20% + keywordDensity 15% + positionScore 5%):
  - FTS `textSearch` (AND semantika, GIN indeks) za primarnu pretragu — svi termini upita moraju biti prisutni.
  - `positionScore`: eksponencijalni decay po `chunk_index` (`exp(-idx*0.1)`) — nagrađuje ranije chunk-ove (naslov, uvod).

### Praćenje v1/v2/v3 pokrivenosti
- `GET /api/spaja-baza-knowledge/index` vraća `status.queue.indexedV1`, `indexedV2`, i `indexedV3`.
- UI: `/spaja-baza-control` prikazuje "Indexed v1", "Indexed v2", i "Indexed v3" karticama.

### Rollout faze
| Faza | Opis |
|------|------|
| 1 – Dark launch | `upgradeToV3: false` — novi chunk-ovi odmah idu na v3; v1/v2 ostaju primarni reader |
| 2 – Upgrade batches | `upgradeToV3: true` konvertuje v1/v2 chunk-ove |
| 3 – Dual read | Servis vraća i v2 i v3 rezultate; porede se latencija i citation rate |
| 4 – Stabilizacija | Monitoring 7 dana, pa opciono gašenje v1/v2 upgrade puta |

### Rollback
- Ako v3 scoring daje lošije citation rate od v2 baseline-a, pokrenite `/index` sa `indexVersion: v2, upgradeToV2: true` da sve chunk-ove vratite na v2.
- Alternativno: pokrenite `/index` sa `indexVersion: v1, forceReindex: true` za povratak na v1.

### Nove DB kolone (migracija 014)
| Kolona | Tip | Opis |
|--------|-----|------|
| `position_score` | NUMERIC(8,4) | Eksponencijalni decay score po chunk_index (0–1); `exp(-chunk_index * 0.1)` |

### FTS fallback logika
- Primarna pretraga koristi `textSearch` (PostgreSQL plainto_tsquery, 'simple' config, AND semantika).
- Ako FTS vrati 0 rezultata, automatski se prelazi na single-term `ilike` — transparentno za consumer-a.

### Incident: v3 chunk-ovi ne popunjavaju bazu
1. Proveri `GET /api/spaja-baza-knowledge/index` → `status.queue.indexedV3`.
2. Proveri posljednjih 20 jobova u `latestJobs` → filter na `status = failed`.
3. Pokreni upgrade sa manjim `batchSize` (npr. 10) i `maxBatches: 2`.
4. Provjeri `knowledge_dead_letters` za ozbiljne greške.

## 10) INDEKSIRANJE 4 (v4 semantic + hybrid pipeline)

### Pokretanje v4 indeksiranja (novi chunk-ovi)
- API: `POST /api/spaja-baza-knowledge/index`
- Body:
```json
{
  "indexVersion": "v4",
  "batchSize": 25,
  "maxBatches": 4
}
```

### Upgrade postojećih v1/v2/v3 chunk-ova na v4
- API: `POST /api/spaja-baza-knowledge/index`
- Body:
```json
{
  "indexVersion": "v4",
  "upgradeToV4": true,
  "batchSize": 25,
  "maxBatches": 10
}
```
- `upgradeToV4: true` odabira i već indeksirane v1/v2/v3 chunk-ove.
- Chunk-ovi koji su već na v4 (`index_version = 'v4'`) se automatski preskaču.

### v4 retrieval i fallback
- Primarna pretraga: semantic vector retrieval (`match_knowledge_chunks_v4`).
- Fallback #1: v3 FTS (`textSearch`, `simple` config).
- Fallback #2: `ilike` pretraga kada FTS vrati 0 rezultata.

### v4 scoring
- **v4**: semanticSimilarity 35% + lexical 20% + termFrequency 15% + trust 15% + keywordDensity 10% + positionScore 5%.

### Praćenje v4 pokrivenosti
- `GET /api/spaja-baza-knowledge/index` vraća `status.queue.indexedV4`.
- UI: `/spaja-baza-control` prikazuje "Indexed v4" karticu.

### Metrike po retrieval verziji
- `GET /api/spaja-baza-knowledge/metrics` vraća:
  - `metrics24h.retrievalByVersion`
  - `metrics24h.semanticUsageRate`

### Incident: v4 embedding pipeline ne indeksira
1. Proveri `OPENAI_API_KEY` i embedding model konfiguraciju.
2. Proveri `GET /api/spaja-baza-knowledge/index` → `indexedV4` i failed trend.
3. Pokreni manji batch (`batchSize: 10`, `maxBatches: 2`) sa `upgradeToV4`.
4. Ako je potrebno, privremeno vrati indexing na `indexVersion: v3`.

### Rollback
- Za rollback retrieval-a na lexical putanje, pokrenite indexiranje sa `indexVersion: v3` i pratite metric baseline.
- v4 kolone ostaju u šemi (rollback-safe), bez gubitka postojećih podataka.

---

## 11) INDEKSIRANJE 5 — Staged Auto-Promotion (Orkestracija svakog stupnja)

### Šta je INDEKSIRANJE 5?

Meta-pipeline koji automatski promovira svaki chunk kroz sve stupnjeve (v1→v2→v3→v4), uz quality gates i audit log po stupnju.

### API: Pokretanje staged auto-promotion (promoteAll)

- API: `POST /api/spaja-baza-knowledge/index`
- Body:
```json
{
  "promoteAll": true,
  "batchSize": 50,
  "maxBatches": 10,
  "promoteCooldownMs": 500
}
```
- Pokreće sve stupnjeve redom (v1→v2, v2→v3, v3→v4), uz cooldown između stupnjeva.
- Vraća `stageBreakdown` u response-u sa stanjem posle promocije.
- Zahteva `Authorization` header (autentifikovan korisnik).

### API: Stage Distribution Dashboard

- API: `GET /api/spaja-baza-knowledge/index-status`
- Vraća:
```json
{
  "sistem": "SPAJA BAZA Knowledge Index — Stage Distribution",
  "stageBreakdown": {
    "v1": 12,
    "v2": 8,
    "v3": 45,
    "v4": 80,
    "total": 145,
    "targetVersion": "v4",
    "completionPct": 55.17
  },
  "queue": { "notIndexed": 5, "indexed": 145, "failed": 2, ... },
  "jobs24h": { ... },
  "timestamp": "..."
}
```

### Nightly Auto-Promotion (GitHub Actions)

Workflow `.github/workflows/index-auto-promote.yml` pokreće se automatski svake noći u 03:00 UTC.

Ručno pokretanje:
```bash
# Iz GitHub UI: Actions → "Indeksiranje — Staged Auto-Promotion" → Run workflow
# Ili direktno:
NEXT_PUBLIC_SUPABASE_URL=<url> SUPABASE_SERVICE_ROLE_KEY=<key> OPENAI_API_KEY=<key> \
  npx tsx scripts/index-auto-promote.ts
```

Env varijable:
| Varijabla | Obavezna | Opis |
|-----------|----------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Da | Supabase URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Da | Service role key |
| `OPENAI_API_KEY` | Za v4 | Embedding API ključ |
| `PROMOTE_ALL_BATCH_SIZE` | Ne | Default: 50 |
| `PROMOTE_ALL_MAX_BATCHES` | Ne | Default: 10 |
| `PROMOTE_ALL_COOLDOWN_MS` | Ne | Default: 500 |

### Quality Gates

| Tranzicija | Gate | Opis |
|-----------|------|------|
| v1→v2 | `content.length ≥ 100` | Sadržaj mora biti dovoljno dug za korisne bigrame |
| v2→v3 | `chunk_index ≥ 0` | `chunk_index` mora biti postavljen za position_score |
| v3→v4 | `OPENAI_API_KEY` je postavljen | Embedding API mora biti dostupan |

Blokirani chunk-ovi ostaju na trenutnom stupnju. Razlog blokiranja se loguje u `knowledge_index_stage_log.blocked_reason`.

### Audit Log

Svaka tranzicija logovana je u `knowledge_index_stage_log`:
```sql
SELECT chunk_id, from_version, to_version, success, blocked_reason, promoted_at
FROM knowledge_index_stage_log
WHERE batch_id = '<batch_id>'
ORDER BY promoted_at DESC;
```

Sumarni pregled po stupnju:
```sql
SELECT * FROM knowledge_index_stage_summary;
```

### Monitoring: Chunk-ovi koji nisu na ciljnoj verziji

```sql
-- Broji chunk-ove koji nisu na v4 (ciljni stupanj)
SELECT COUNT(*) FROM knowledge_chunks
WHERE index_version <> 'v4' AND embedding_status = 'indexed';
```

### Incident: completionPct ne raste

1. Proveri `GET /api/spaja-baza-knowledge/index-status` → `stageBreakdown.completionPct`.
2. Proveri `knowledge_index_stage_log` za `success = false` i `blocked_reason`.
3. Ako je v3→v4 blokiran: proveri `OPENAI_API_KEY` konfiguraciju.
4. Ako je v1→v2 blokiran: proveri da li chunk-ovi imaju `content.length ≥ 100`.
5. Pokreni `promoteAll` ručno sa manjim `batchSize` (npr. 10) i `maxBatches: 2`.
6. Provjeri GitHub Actions log za workflow `index-auto-promote.yml`.

### Rollback

- Za zaustavljanje auto-promotion: onemogućite workflow `.github/workflows/index-auto-promote.yml`.
- Za rollback stupnja: pokrenite indexiranje sa `indexVersion: v3, upgradeToV3: true`.
- Audit log (`knowledge_index_stage_log`) ostaje nepromenjiv — bez gubitka podataka.

### Nove DB objekte (migracija 021)

| Objekat | Tip | Opis |
|---------|-----|------|
| `knowledge_index_stage_log` | Tabela | Audit trail za svaku tranziciju chunk-a |
| `knowledge_index_stage_summary` | View | Agregati po verziji |
| `idx_kc_not_v4` | Parcijalni indeks | Brzi upit za chunk-ove koji nisu na v4 |
| `idx_kc_below_v3` | Parcijalni indeks | Brzi upit za chunk-ove ispod v3 |

---

## PERTENIZACIJA 2 — Operativni koraci

### Aktivacija v2 po korisniku
```bash
# Ažurirati korisnikov profil direktno (admin SQL) ili kroz API:
PUT /api/spaja-pro/settings
Body: { "personalizationVersion": "v2" }
```

### Praćenje adoption metrika
```bash
GET /api/spaja-baza-knowledge/metrics
# Prati: personalizacijaV2.v2AdoptionRate, averageConfidence, optOutCount
```

### Explainability (zašto je odgovor personalizovan)
```bash
GET /api/spaja-pro/personalizacija-explain
# Headers: Authorization: ******
```

### Reset personalizacije za korisnika
```bash
PUT /api/spaja-pro/settings
Body: { "resetPersonalization": true }
# Briše stable_preferences, contextual_preferences, confidence; vraća na v1
```

### Opt-out (isključuje v2 za korisnika)
```bash
PUT /api/spaja-pro/settings
Body: { "personalizationOptOut": true }
```

### Globalni kill-switch
```bash
# U .env / Vercel env vars:
PERSONALIZATION_V2_ENABLED=false
# Odmah vraća sve korisnike na v1 bez deploymenta
```

### Incident: v2 engine generiše neočekivane odgovore
1. Isključi globalni kill-switch: `PERSONALIZATION_V2_ENABLED=false`.
2. Proveri explainability payload za pogođenog korisnika (`GET /api/spaja-pro/personalizacija-explain`).
3. Resetuj korisnikove preference: PUT `/api/spaja-pro/settings` sa `{ "resetPersonalization": true }`.
4. Analiza: provjeri `stable_preferences` i `contextual_preferences` JSONB direktno u Supabase.
5. Rollback: set `personalization_version = 'v1'` u SQL za pogođene korisnike.

### Rollback na v1
- Globalni rollback: `PERSONALIZATION_V2_ENABLED=false` (bez deploymenta).
- Per-user rollback: PUT `/api/spaja-pro/settings` sa `{ "resetPersonalization": true }`.
- v2 kolone ostaju u šemi (rollback-safe); nema gubitka v1 podataka.

### KPI praćenje (metrike uspeha)
| Metrika | Endpoint | Cilj |
|---------|----------|------|
| v2 adoption rate | `/api/spaja-baza-knowledge/metrics` → `personalizacijaV2.v2AdoptionRate` | ≥ 0.7 |
| avg confidence | `/api/spaja-baza-knowledge/metrics` → `personalizacijaV2.averageConfidence` | ≥ 0.6 |
| opt-out rate | `optOutCount / totalProfiles` | < 0.05 |
| citation rate | `metrics24h.citationRate` | ≥ 0.45 |


## 14) PERTENIZACIJA 3 — Personalization v3

### Pregled

PERTENIZACIJA 3 uvodi adaptivno učenje (topic weights, session tempo), feedback signale i kompozitni v3 score iznad v2 temelja.  
ADR: `docs/ADR-PERTENIZACIJA-3.md`  
Engine: `src/lib/personalizacija/engine-v3.ts`

### Aktivacija v3 per korisniku

```json
PUT /api/spaja-pro/settings
{
  "personalizationVersion": "v3"
}
```

### Ažuriranje adaptivnih preferencija

```json
PUT /api/spaja-pro/settings
{
  "adaptivePreferences": {
    "topicWeights": { "AI": 0.9, "TypeScript": 0.75 },
    "sessionTempo": "deep"
  }
}
```

### Reset samo v3 podataka (zadržava v2)

```json
PUT /api/spaja-pro/settings
{
  "resetPersonalizationV3": true
}
```

### Full reset (v2 + v3 → v1)

```json
PUT /api/spaja-pro/settings
{
  "resetPersonalization": true
}
```

### Kill-switch

- **Globalni v3 kill-switch**: `PERSONALIZATION_V3_ENABLED=false` — vraća sve na v2/v1 bez deploymenta.
- **Globalni v2 kill-switch**: `PERSONALIZATION_V2_ENABLED=false` — isključuje i v2 i v3.
- **Per-user**: `{ "personalizationOptOut": true }` ili `{ "personalizationEnabled": false }`.

### Incident / rollback procedura

1. Proveriti avg v3 score i citation rate u `/api/spaja-baza-knowledge/metrics` → `personalizacijaV2`.
2. Ako citation rate padne ispod v2 baseline-a: setovati `PERSONALIZATION_V3_ENABLED=false`.
3. Za par-usera koji imaju degradiranu personalizaciju: PUT sa `{ "resetPersonalizationV3": true }`.
4. Za pun rollback na v1: PUT sa `{ "resetPersonalization": true }`.
5. Re-deploy sa env varom kada je uzrok otklonjen; postepeno ponovo aktivirati v3.

### KPI praćenje (v3 metrike)

| Metrika | Endpoint | Cilj |
|---------|----------|------|
| v3 adoption rate | `/api/spaja-baza-knowledge/metrics` → `personalizacijaV2.v3AdoptionRate` | ≥ 0.5 (parcijalni rollout) |
| avg v3 score | `personalizacijaV2.averageV3Score` | ≥ 0.55 |
| opt-out rate | `optOutCount / totalProfiles` | < 0.05 |
| citation rate | `metrics24h.citationRate` | ≥ 0.50 |

### DB kolone (migracija 017)

| Kolona | Tip | Opis |
|--------|-----|------|
| `adaptive_preferences` | JSONB | Learned adaptive preferences (topic weights, session tempo) |
| `personalization_feedback` | JSONB | Feedback signali (positiveCount, negativeCount, lastFeedbackAt) |
| `personalization_v3_score` | NUMERIC(4,3) | Kompozitni v3 score 0–1 |
