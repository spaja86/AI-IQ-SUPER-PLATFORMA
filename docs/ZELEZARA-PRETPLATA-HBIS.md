# ŽELEZARA / HBIS — EXTRIMLI EXTRONDOL EXTREM pretplata governance

**Status:** `blocked-until-identity-and-payment-validated`  
**Datum:** 2026-09-18  
**Owner:** Kompanija SPAJA / Digitalna Industrija  
**OKRID:** `OKRID-2026-ZELEZARA-001`

---

## Svrha i poslovni model

Ovaj dokument definiše additive-only B2B enterprise pretplata track za klijenta koji se u operativnim ulazima može pojaviti kao `HBIS/Hibis ... Smederevo`, dok programski kanonski identitet ostaje `Železara d.o.o. Smederevo`.

Bez potvrđenog identiteta, ugovora, uplate, onboarding-a, downstream sync-a i human review-a:

- nema aktivacije
- nema WAWE promocije
- nema public-safe finalnog statusa bez blocker razloga

---

## Identitet ugovornih strana

- Provider: `Kompanija SPAJA / Digitalna Industrija`
- Kanonsko pravno ime pretplatnika u ovom programu: `Železara d.o.o. Smederevo`
- Operativni/current naziv za intake i alias matching: `HBIS / Hibis Smederevo`
- Stari/istorijski naziv za obavezni povrat u izlazu kada je traženo: `Železara`

---

## Nazivni i alias režim

Dozvoljeni alias-i:

- `Železara d.o.o. Smederevo`
- `Železara`
- `HBIS`
- `Hibis`
- `HBIS Smederevo`
- `Hibis Smederevo`

Hard pravila:

- `HBIS/Hibis` i `Železara` ne smeju biti tretirani kao dva odvojena klijenta.
- Ako je restore-old-name označen kao poslovni uslov, javni i audit-safe izlazi moraju vratiti naziv `Železara`.
- Naming konflikt ili split-client interpretacija ostavljaju predmet u statusu `blocked`.

---

## Dozvoljeni model naplate

Dozvoljeni model ostaje repo-local EXTRONDOL B2B model:

- controlled periodic subscription
- mesečna ili godišnja naplata
- aktivacija tek posle `payment-confirmed`
- nema aktivacije po proformi bez potvrđene uplate

---

## Pravna, poreska i billing validacija

Pre aktivacije moraju biti potvrđeni:

1. ugovorni identitet pretplatnika
2. ovlašćeni potpisnik
3. pravni osnov usluge
4. poreski tretman i billing owner
5. payment verification dokazni paket

Ako bilo koji od ovih elemenata nedostaje, status ostaje `blocked` ili `legal-review`.

---

## Status model

| Status | Značenje |
| --- | --- |
| `intake` | Predmet otvoren, alias identitet još nije potvrđen |
| `identity-review` | Proverava se da li svi nazivi mapiraju isti entitet |
| `contract-review` | U toku pravna i billing potvrda |
| `payment-pending` | Ugovor završen, čeka se potvrda uplate |
| `onboarding` | Uplata potvrđena, onboarding i downstream sync u toku |
| `activation-ready` | Svi hard gate-ovi zatvoreni, čeka human review |
| `active` | Pretplata aktivirana |
| `rollback` | Aktivacija vraćena zbog rizika, spora ili regression-a |
| `blocked` | Naming, payment, compliance ili audit blocker aktivan |

---

## EXTREM signal i EXTRONDOL governance

- **EXTREM** proverava identity consistency, alias coverage, naming conflict i restore-old-name completion.
- **EXTRONDOL** orkestrira procurement flow, contract approval, onboarding completion, downstream sync, human review i payment verification.
- **SPAJA KOD** prikazuje samo konačni audit-safe subscription/governance status.

Ako `restoreOldNameCompleted = false`, `namingConflictDetected = true` ili `splitClientRiskDetected = true`, EXTRONDOL mora zadržati explicit freeze reason.

---

## Rollback i audit pravila

Rollback se aktivira kada postoji:

- povučena ili osporena uplata
- kontradiktoran ugovorni identitet
- povreda pravila da izlaz vrati `Železara`
- neuspešan downstream sync

Audit trag mora da sadrži:

- intake naziv i mapirani alias
- kanonski identitet
- restore-old-name zahtev i status izvršenja
- payment verification dokaze
- human review dokaz
- downstream reference prema `spaja86/IO-OPENUI-AO` kada je relevantno

---

## Acceptance criteria

- nijedna aktivacija bez potvrđene uplate
- nijedna aktivacija bez potvrđenog ugovornog identiteta
- `HBIS/Hibis` i `Železara` ostaju jedan klijent
- izlaz vraća `Železara` kada je restore-old-name obavezan
- payment verification i human review ostaju hard gate
- rollout freeze i rollback pravila su audit-ready
