# ADR: SPAJA BAZA Google Ingest Policy (Legal + Controlled)

## Status
Accepted

## Kontekst
Originalni zahtev „usisati ceo Google“ nije legalno ni operativno održiv. Potreban je kontrolisan ingestion koji je usklađen sa robots/TOS pravilima, sa audit tragom i fallback mehanizmima.

## Odluka
1. **Nema full-crawl Google-a** niti masovnog scrape-ovanja.
2. Discovery sloj koristi dozvoljene API/mehanizme i ručno odobrene izvore.
3. Ingestion radi samo nad **allowlist domenima** i aktivnim izvorima.
4. Svaki dokument prolazi:
   - canonicalization URL-a,
   - deduplikaciju preko `content_hash`,
   - chunking i safety sanitizaciju.
5. Retrieval vraća citate sa URL-ovima i izvorom.
6. Ako nema pouzdanih rezultata, SpajaPro radi standardan fallback bez fabriciranja izvora.

## Posledice
- Predvidljiv i pravno bezbedniji ingestion model.
- Smanjen rizik od prompt-injection napada kroz untrusted sadržaj.
- Lakša operativa kroz job status, dead-letter i metrike.

## Implementirano
- `supabase/migrations/004_spaja_baza_knowledge.sql`
- `src/lib/spaja-baza-knowledge.ts`
- `src/app/api/spaja-baza-knowledge/*`
- Integracija retrieval-a u `POST /api/spaja-pro/chat`

