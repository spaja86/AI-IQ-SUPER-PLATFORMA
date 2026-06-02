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

## 6) Operativne smernice
- Držati ingest u legalnom opsegu (robots/TOS).
- Koristiti trusted izvore (visok `trust_score`).
- Ograničiti batch URL-ova po job-u.
- Ograničiti index batch (`batchSize`, `maxBatches`) da se izbegne overload.
- Redovno pratiti trendove failed job-ova i retrieval kvaliteta.
