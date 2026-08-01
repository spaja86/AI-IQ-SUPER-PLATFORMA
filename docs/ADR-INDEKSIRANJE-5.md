# ADR: INDEKSIRANJE 5 — Orkestracija svakog stupnja (Staged Auto-Promotion)

**Status:** Accepted  
**Datum:** 2026-08-01  
**Autori:** AI Copilot (na osnovu plana spaja86)

---

## Kontekst

Sistem SPAJA BAZA ima četvorostepeni indexing pipeline (v1→v2→v3→v4):

| Stupanj | Mehanizam | Scoring signali |
|---------|-----------|-----------------|
| v1 | `ilike` (prvi termin) | lexical·0.6 + trust·0.25 + coverage·0.15 |
| v2 | `ilike` + bigrams + keyword_density | lexical·0.45 + termFreq·0.20 + trust·0.20 + kwDensity·0.15 |
| v3 | FTS `textSearch` (AND) + position_score | lexical·0.35 + termFreq·0.25 + trust·0.20 + kwDensity·0.15 + pos·0.05 |
| v4 | pgvector cosine similarity + hybrid | semanticSim·0.35 + lexical·0.20 + termFreq·0.15 + trust·0.15 + kwDensity·0.10 + pos·0.05 |

**Problem:** Svaki batch upgrade pokreće se ručno (`upgradeToVN: true`). Nema:
1. Centralizovanog mehanizma koji garantuje da svaki chunk dostigne ciljni stupanj.
2. Monitoring dashboarda koji prikazuje distribuciju po stupnju u realnom vremenu.
3. Quality gates koji blokiraju promociju chunk-ova koji ne zadovoljavaju minimalne zahteve.
4. Audit trail koji prati svaku tranziciju između stupnjeva.

---

## Odluka

Implementira se **INDEKSIRANJE 5** kao meta-pipeline koji orkestira automatsku promociju svakog stupnja:

### Komponente

1. **`knowledge_index_stage_log`** tabela — audit trail za svaku tranziciju chunk-a između stupnjeva, sa `batch_id`, `job_id`, `success` i `blocked_reason`.

2. **`knowledge_index_stage_summary`** view — agregatni pregled po verziji (count, pct_of_total, indexed_count, failed_count, last_indexed_at).

3. **`computeStageBreakdown` / `getKnowledgeStageBreakdown`** — funkcija koja vraća `KnowledgeStageBreakdown` (v1/v2/v3/v4 count, total, targetVersion, completionPct).

4. **`promoteAll: true`** parametar u `POST /api/spaja-baza-knowledge/index` — pokreće staged auto-promotion svakog stupnja u jednom API pozivu, uz cooldown između stupnjeva.

5. **`GET /api/spaja-baza-knowledge/index-status`** — novi endpoint koji vraća `stageBreakdown`, queue status i jobs24h za observability dashboard.

6. **Quality gates** po stupnju:
   - **v1→v2**: `content.length ≥ 100` (vredni bigrams)
   - **v2→v3**: `chunk_index ≥ 0` (validan position_score)
   - **v3→v4**: `OPENAI_API_KEY` je postavljen (embedding API dostupan)

7. **`scripts/index-auto-promote.ts`** — CLI skripta za pokretanje iz GitHub Actions ili ručno.

8. **`.github/workflows/index-auto-promote.yml`** — nightly cron (03:00 UTC) koji pokreće staged auto-promotion.

9. **`.agent-config.json` `indeksiranje` sekcija** — config za `targetIndexVersion`, `autopromotion`, quality gates i monitoring.

---

## Arhitektonske odluke

### 1. `promoteAll` kao nezavisni put u `runKnowledgeIndexing`
`promoteAll: true` uzima kontrolu pre normalnog batch loop-a i delegira na `runStagedAutoPromotion`. Backward compatibility nije narušena — existirajući `upgradeToVN` parametri rade kao pre.

*Alternativa odbačena:* posebna funkcija `runAutoPromotion` van `runKnowledgeIndexing`. Odbačena da se sačuva jedan API entrypoint i centralizovano logovanje jobova.

### 2. Quality gates kao pre-podmjenljiva logika, ne kao DB trigger
Gates se proveravaju u TypeScript pre svake promocije. `blocked_reason` se loguje u `knowledge_index_stage_log` kada je gate blokiran. Chunk ostaje na trenutnom stupnju.

*Zašto:* DB triggeri bi otežali rollback i debug. TypeScript gates su testabilni i čitljivi.

### 3. `knowledge_index_stage_log` kao INSERT-only audit log
Tabela se nikada ne ažurira — svaki pokušaj promocije kreira novi red. Ovo garantuje nepromenjivost audit traga i omogućava vremensku analitiku po chunk-u.

### 4. `computeStageBreakdown` kao eksportovana funkcija
Pored `getKnowledgeIndexStatus` (koja uključuje stageBreakdown), eksportovana je i `getKnowledgeStageBreakdown` za direktnu upotrebu u skriptama bez pune status pretrage.

### 5. Backward-compatible API proširenja
- `stageBreakdown` je additivno polje u `KnowledgeIndexingResult` (optional)
- `GET /api/spaja-baza-knowledge/index-status` je novi endpoint, ne menja `/index`
- Downstream consumer (`/api/spaja-pro/chat`) ne zahteva izmene

---

## Rollout plan

| Faza | Opis | Exit kriterijum |
|------|------|-----------------|
| 1 — Dashboard | `index-status` endpoint aktivan | `GET /index-status` vraća `stageBreakdown` |
| 2 — API | `promoteAll: true` aktivan | Single API call pokreće sve stupnjeve |
| 3 — Quality gates | Gates blokiraju nevalidne promocije | `blocked_reason` u logu za nevalidne chunk-ove |
| 4 — Schema | Migracija 021 primenjena | `knowledge_index_stage_log` i view dostupni |
| 5 — Cron | Nightly workflow aktivan | `index-auto-promote.yml` se uspešno pokreće |
| 6 — Monitoring | `completionPct` raste prema 100% | Dashboard prikazuje napredak |

---

## Posledice

**Pozitivne:**
- Svaki chunk automatski napreduje prema ciljnom stupnju (v4) bez ručnih intervencija.
- Kompletna observability: `completionPct`, stageBreakdown, audit log po chunk-u.
- Quality gates sprečavaju nevalidne promocije i loguju `blocked_reason`.
- Nightly cron osigurava konstantan napredak čak i bez ručnih API poziva.
- Backward-compatible: existirajuće API površine se ne menjaju.

**Negativne/rizici:**
- `knowledge_index_stage_log` tabela raste sa vremenom — pratiti storage trend.
- v3→v4 promocija zavisi od OpenAI API dostupnosti. Ako API nije dostupan, v3 chunk-ovi ostaju blokirani dok se API ne vrati.
- Nightly cron + embedding API može povećati troškove pri velikom korpusu. Pratiti FinOps metrike.
- `any` cast na `knowledge_index_stage_log` insert dok se ne regenerišu Supabase TypeScript tipovi iz migracije 021.

---

## Reference

- `src/lib/spaja-baza-knowledge.ts` — core implementacija (promoteAll, stageBreakdown, quality gates)
- `src/app/api/spaja-baza-knowledge/index/route.ts` — prošireni index endpoint
- `src/app/api/spaja-baza-knowledge/index-status/route.ts` — novi status endpoint
- `scripts/index-auto-promote.ts` — CLI skripta za auto-promotion
- `.github/workflows/index-auto-promote.yml` — nightly cron workflow
- `supabase/migrations/021_indeksiranje_svakog_stupnja.sql` — schema
- `.agent-config.json` § `indeksiranje` — operativna konfiguracija
- `docs/SPAJA-BAZA-RUNBOOK.md` §11 — operativni vodič za auto-promotion
- `docs/ADR-INDEKSIRANJE-2.md` — v2 pipeline referenca
- `docs/ADR-INDEKSIRANJE-3.md` — v3 pipeline referenca
- `docs/ADR-INDEKSIRANJE-4.md` — v4 pipeline referenca
