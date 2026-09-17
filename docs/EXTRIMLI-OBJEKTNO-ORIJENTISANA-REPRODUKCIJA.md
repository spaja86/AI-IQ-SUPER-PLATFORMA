# EXTRIMLI — Objektno orijentisana reprodukcija

## Purpose

Ovaj dokument zaključava značenje i governance model za **Objektno orijentisanu reprodukciju** kao additive-only EXTRIMLI proširenje.

## Source-of-truth surfaces

- Technical signal: `/api/extrimli/extrem`
- Governance orchestration: `/api/extrimli/extrondol`
- Public-safe boundary: `/api/extrimli/spaja-kod`

## Meaning lock

- **Objektna reprodukcija** potvrđuje da se stanje i ponašanje mogu deterministički ponoviti bez curenja internih detalja.
- **Reproduktivno stanje** čuva auditabilne atribute potrebne za proveru ponovljivosti.
- **Metodska determinističnost** potvrđuje da iste ulazne vrednosti daju isti izlaz i isti governance signal.
- **Replay konzistentnost instance** meri da li lifecycle prolaz ostaje stabilan kroz ponovljene evaluacije.
- **Delegaciona stabilnost** proverava da odgovornosti ostaju dosledno raspoređene.
- **Kompoziciona bezbednost** potvrđuje da složeni objekti zadržavaju bounded i audit-safe izlaz.

## Ownership split

- **EXTREM** objavljuje tehnički signal za reproduktivnost objekt-stanja i ponašanja.
- **EXTRONDOL** mapira signal u WAWE 1–5, freeze/promotion, release audit, rollback i human-review gate.
- **SPAJA KOD** ostaje nepromenjen javni boundary; ova promena ne dodaje nove sirove reproduktivne detalje na `/api/extrimli/spaja-kod`.

## WAWE impact

1. **WAWE-1** — termin, scope i source-of-truth lock moraju biti eksplicitni.
2. **WAWE-2** — state reproducibility i method determinism ostaju najmanje u WATCH posturi tokom build/staging prolaza.
3. **WAWE-3** — replay konzistentnost, delegacija i kompozicija moraju biti audit-visible kroz governance signale.
4. **WAWE-4** — produkciona promocija zahteva READY ili eksplicitno odobren WATCH bez skrivenih blokera.
5. **WAWE-5** — post-release resilience zadržava rollback i human-review obaveze za reproduktivni signal.

## Compatibility rules

- Nema breaking promena na `/api/extrimli/extrem` i `/api/extrimli/extrondol`.
- Proširenje ostaje additive-only kroz docs, types, tests i route payload.
- Public boundary ostaje enkapsuliran kroz `SPAJA KOD`.
- Downstream consumer-i sinhronizuju samo audit-safe readiness i governance polja.
