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

- Držati ingest u legalnom opsegu (robots/TOS).
- Koristiti trusted izvore (visok `trust_score`).
- Ograničiti batch URL-ova po job-u.
- Ograničiti index batch (`batchSize`, `maxBatches`) da se izbegne overload.
- Redovno pratiti trendove failed job-ova i retrieval kvaliteta.
