# EXTRIMLI — Objektno orijentisana prongilacija

## Purpose

Ovaj dokument zaključava značenje i governance model za **Objektno orijentisanu prongilaciju** kao additive-only EXTRIMLI proširenje.

## Source-of-truth surfaces

- Technical signal: `/api/extrimli/extrem`
- Governance orchestration: `/api/extrimli/extrondol`
- Public-safe boundary: `/api/extrimli/spaja-kod`

## Meaning lock

- **Objekat** nosi stanje i source-of-truth pravila.
- **Instanca** predstavlja konkretan lifecycle prolaz kroz readiness, watch i blocked stanja.
- **Atribut** modeluje stanje koje mora ostati auditabilno.
- **Metoda** realizuje ponašanje nad stanjem objekta.
- **Delegacija** prenosi specijalizovane odgovornosti bez rasipanja pravila.
- **Kompozicija** sklapa manje objekte u stabilan signal bez breaking promena.

## Ownership split

- **EXTREM** objavljuje tehnički object-state signal, score i readiness status.
- **EXTRONDOL** mapira signal u WAWE 1–5, freeze/promotion, release audit, rollback i human-review gate.
- **SPAJA KOD** ne izlaže sirove object-state strukture, već samo javno bezbedan readiness/governance ishod.

## WAWE impact

1. **WAWE-1** — termin, scope i source-of-truth lock moraju biti eksplicitni.
2. **WAWE-2** — metoda/instanca kohezija ostaje najmanje u WATCH posturi tokom build/staging prolaza.
3. **WAWE-3** — delegacija, kompozicija i downstream sync moraju biti audit-visible.
4. **WAWE-4** — produkciona promocija zahteva READY ili eksplicitno odobren WATCH bez blokera.
5. **WAWE-5** — post-release resilience zadržava rollback i human-review obaveze.

## Compatibility rules

- Nema breaking promena na `/api/extrimli/extrem` i `/api/extrimli/extrondol`.
- Proširenje ostaje additive-only kroz docs, types, tests i route payload.
- Public boundary ostaje enkapsuliran kroz `SPAJA KOD`.
