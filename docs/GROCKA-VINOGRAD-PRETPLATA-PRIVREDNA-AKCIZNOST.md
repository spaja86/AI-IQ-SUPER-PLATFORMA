# GROCKA VINOGRAD d.o.o. — Pretplata po Privrednoj Akciznosti

**Status:** `blocked-until-validated`  
**Datum:** 2026-08-15  
**Owner:** Kompanija SPAJA / Digitalna Industrija  
**OKRID:** `OKRID-2026-GROCKA-001`

---

## Svrha

Ovaj dokument definiše repo-local governance/compliance model za zahtev `PRETPLATA za GROCKA VINOGRAD d.o.o. po privrednoj akciznosti`.

Predmet se tretira kao compliance i billing governance tok, ne kao automatska naplata.

Bez potvrđenog pravnog osnova, validiranog poresko-računovodstvenog i akciznog tretmana, bankarski izvršivog toka i kompletne dokumentacije:

- ne izdaje se finalna faktura
- ne knjiži se prihod kao konačno realizovan
- ne aktivira se pretplata
- proces ostaje `blocked-until-validated`

---

## Intake — Obavezni ulazni podaci

Pre pokretanja billing toka moraju biti identifikovani i dokumentovani:

1. puno pravno ime: `GROCKA VINOGRAD d.o.o.`
2. sedište, PIB i matični broj
3. identitet i ovlašćenje potpisnika
4. kontakt podaci (email, telefon, adresa)
5. opis usluge, prava i benefita pretplate
6. datum početka i pravila raskida/izmene/mirovanja
7. obračunski period (mesečno, kvartalno, godišnje)
8. valuta
9. iznos ili ugovorena metodologija obračuna
10. način plaćanja i bankarski izvršive instrukcije

Ako bilo koji element nedostaje, status ostaje `incomplete-intake`.

---

## Pravna kvalifikacija modela

Pre odobrenja fakturisanja obavezno je potvrditi pravnu prirodu odnosa:

- pretplata
- avans
- članarina
- druga ugovorna naknada

Mora postojati ugovorno izvršiv odnos po pravu Republike Srbije, sa jasno definisanim predmetom, periodom, obračunom i pravima/obavezama strana.

Bez završene pravne kvalifikacije status ostaje `legal-review`.

---

## Poresko-računovodstvena kvalifikacija (akciznost + PDV + eFaktura)

Pre `approved-for-invoice` mora biti dokumentovano:

- da li i kada nastaje akcizna obaveza u konkretnom modelu
- poreska kvalifikacija transakcije i PDV tretman
- obaveza izdavanja eFakture kada je primenljivo
- da li je uplata avans ili konačni obračun
- trenutak priznavanja prihoda
- pravila evidencije avansa, storna i naknadnih obračuna

Ako akcizni ili poresko-računovodstveni tretman nije potvrđen, status ostaje `tax-review`.

---

## Dozvoljeni billing model

Dozvoljeni model u ovom repozitorijumu podrazumeva:

- periodični obračun po ciklusu
- zaseban obračunski dokument za svaki period
- bankarski izvršivu uplatu
- pun audit trag po ciklusu
- aktivaciju usluge tek nakon `payment-confirmed`

Nije dozvoljeno:

- aktivirati pretplatu pre potvrde uplate
- knjižiti konačni prihod bez validnog obračuna i poreskog osnova
- voditi neodređenu obavezu bez jasnog obračunskog perioda

---

## Kontrolne tačke pre `approved-for-invoice`

Moraju biti potvrđeni svi uslovi:

1. kompletna intake i ugovorna dokumentacija
2. pravna kvalifikacija modela završena
3. validiran poresko-računovodstveni tretman
4. validirana akcizna analiza i odluka
5. definisan obračunski period i iznos/metod obračuna
6. bankarski izvršive instrukcije
7. potvrđen ugovorni paket i approval evidencija

Ako je bilo koji uslov neispunjen, predmet ostaje `blocked-until-validated`.

---

## Statusni workflow

| Status | Značenje |
|---|---|
| `draft` | Predmet otvoren |
| `incomplete-intake` | Nedostaju ključni podaci i dokumentacija |
| `legal-review` | U toku pravna kvalifikacija i ugovorna analiza |
| `tax-review` | U toku poresko-računovodstvena i akcizna potvrda |
| `approved-for-invoice` | Dozvoljeno izdavanje obračunskog dokumenta |
| `payment-pending` | Dokument izdat, čeka se uplata |
| `payment-confirmed` | Uplata potvrđena |
| `service-active` | Pretplata aktivirana |
| `rollback` | Proces vraćen zbog rizika/spora/neusaglašenosti |
| `blocked-until-validated` | Blokirano zbog nevalidiranog modela |
| `closed` | Predmet zatvoren |

---

## Audit trag

Za svaki ciklus mora postojati audit zapis sa najmanje sledećim poljima:

- broj dokumenta
- obračunski period
- iznos
- valuta
- poreska/akcizna odluka
- approval evidencija
- potvrda uplate
- istorija statusnih promena
- timestamp i odgovorno lice

Audit trag mora dokazivati `payment-confirmed before service-active`.

---

## Formalni izlaz

Završni poslovni rezultat mora biti:

- ugovor o pretplati, ili
- okvirni ugovor sa aneksom koji eksplicitno pokriva privrednu akciznost, poreski tretman, ciklus obračuna i pravila aktivacije.

Tek nakon formalnog ugovornog paketa dozvoljeno je planirati runtime fakturisanje.

---

## Tehnička granica implementacije

Ovaj repozitorijum trenutno implementira governance okvir za `GROCKA VINOGRAD d.o.o.`.

Ne implementira automatsku pravnu validaciju, automatsku akciznu procenu niti stvarnu bankarsku realizaciju. Predmet ostaje blokiran dok poslovno-pravni input ne bude potpun i proverljiv.

---

## Cross-repo napomena

Ovaj governance tok je repo-local za `spaja86/AI-IQ-SUPER-PLATFORMA`.

`spaja86/IO-OPENUI-AO` trenutno nema obaveznu downstream izmenu za ovaj dokumentovani proces.

---
