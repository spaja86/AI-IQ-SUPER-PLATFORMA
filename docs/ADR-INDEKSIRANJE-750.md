# ADR: INDEKSIRANJE 750 — KPI-Driven Auto-Promotion Control Layer

**Status:** Accepted  
**Datum:** 2026-08-01  
**Autori:** AI Copilot (na osnovu plana spaja86)

## Kontekst

INDEKSIRANJE 5 već orkestrira v1→v2→v3→v4 promociju i stage audit, ali nije eksplicitno fokusirano na KPI cilj i degradacione alarme za operativni režim.

## Odluka

Uvodi se **INDEKSIRANJE 750** kao feature-flag režim nad postojećim staged auto-promotion tokom, sa fokusom na:

1. **KPI cilj:** `completionPct` za v4 sa podrazumevanim target-om `75%`.
2. **Degradation guard:** alarm kada completion delta padne ispod praga (`7.5pp` default).
3. **Safe stop:** kontrolisano gašenje promocije bez izmena chunk stanja.
4. **Audit trail:** novi zapis po run-u u `knowledge_index_750_audit`.
5. **Alert view:** `knowledge_index_750_alerts` za brzi monitoring otvorenih rizika.

## Scope implementacije

- `src/lib/spaja-baza-knowledge.ts`
  - nova 750 opcija (`indeksiranje750`, KPI pragovi, safe stop)
  - evaluacija completion pre/posle run-a
  - upis 750 audit zapisa
- `src/app/api/spaja-baza-knowledge/index/route.ts`
  - podrška za 750 API parametre bez breaking promene
- `src/app/api/spaja-baza-knowledge/index-status/route.ts`
  - izvoz 750 monitoring signala
- `supabase/migrations/022_indeksiranje_750.sql`
  - `knowledge_index_750_audit`
  - `knowledge_index_750_alerts`
- `scripts/index-auto-promote.ts` + `.github/workflows/index-auto-promote.yml`
  - periodični 750 režim i safe-stop kontrola
- `.agent-config.json`
  - 750 feature-flag i KPI kontrole

## Rollback

- Isključiti `INDEX_750_MODE` ili API `indeksiranje750`.
- Aktivirati `safeStop750` / `INDEX_750_SAFE_STOP=true` za bezbedno zaustavljanje.
- Povratak na standardni INDEKSIRANJE 5 tok ne zahteva rollback šeme.

## Rizici

- Lažni degradacioni alarmi pri malim uzorcima batch-eva.
- Rast `knowledge_index_750_audit` tabele kroz vreme.

## Reference

- `docs/ADR-INDEKSIRANJE-5.md`
- `docs/SPAJA-BAZA-RUNBOOK.md`
- `supabase/migrations/022_indeksiranje_750.sql`
