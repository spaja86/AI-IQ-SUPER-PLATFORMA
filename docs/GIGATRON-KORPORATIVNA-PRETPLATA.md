# GIGATRON — Korporativna Pretplata i Uplata Velike Vrednosti

**Status:** `blocked-until-validated`  
**Datum:** 2026-08-02  
**Owner:** Kompanija SPAJA / Digitalna Industrija  
**OKRID:** `OKRID-2026-GIGATRON-001`

---

## Svrha

Ovaj dokument definiše obavezni governance model za `pretplata Korporacija Gigatron` i svaku GIGATRON B2B uplatu ekstremno velike vrednosti.

Bez potvrđenog pravnog osnova, validiranog iznosa, KYC/AML provere, poreskog modela i bankarski prihvatljivog platnog toka:

- ne izdaje se finalna faktura
- ne aktivira se pretplata
- ne puštaju se benefiti/usluge
- proces ostaje u statusu `blocked`

---

## Kritični stop-uslov

Ako iznos poput `800 zijardi evra` nije stvaran, dokaziv, ugovorno potvrđen i operativno obradiv kroz bankarski/regulatorni okvir, proces se odmah zaustavlja i vraća u fazu redefinisanja komercijalnih uslova.

Do razjašnjenja iznosa i ugovorne ekonomije nije dozvoljeno:

- slanje payment link-a
- slanje finalne fakture
- knjiženje prihoda
- aktivacija enterprise pogodnosti

---

## Obavezni ulazni podaci

Pre otvaranja billing toka moraju postojati:

1. potvrđen predmet pretplate i opis usluge
2. identitet ugovorne strane i ovlašćenog potpisnika
3. period važenja pretplate
4. stvaran i dokaziv iznos obaveze
5. valuta, model plaćanja i predlog tranši

Ako bilo koji od ovih elemenata nedostaje, predmet se vodi kao `incomplete-intake`.

---

## Pravna dokumentacija

Obavezni dokument paket:

- glavni ugovor
- aneks/specifikacija pretplate
- opis usluge i komercijalni obim
- SLA
- uslovi raskida i refund politike
- merodavno pravo i nadležnost
- potvrda ovlašćenja potpisnika obe strane

Dokument paket mora biti pregledan od strane internog owner-a i eksternog pravnog savetnika kada je vrednost transakcije van standardnog operativnog opsega.

---

## KYC / AML / Korporativna provera

Pre fakturisanja moraju biti završeni:

- identifikacija pravnog lica
- provera stvarnog vlasnika
- provera zastupnika i ovlašćenja
- AML/KYC screening
- sanctions screening
- PEP screening
- provera porekla sredstava

Status provere mora biti jedan od:

- `approved`
- `approved-with-conditions`
- `rejected`

Status `pending` ili `rejected` blokira naplatu i aktivaciju.

---

## Regulatorni i poreski pregled

Obavezno je dokumentovati:

- da li se primenjuju pravila deviznog poslovanja
- da li postoji obaveza prijave velike transakcije
- da li postoje ograničenja po osnovu kapitalnih tokova ili sektorskih dozvola
- PDV tretman i mesto prometa
- eventualni withholding tax
- transfer pricing implikacije
- kursna pravila i valuta fakturisanja
- obavezne poreske evidencije

Bez zaključenog regulatornog i poreskog mišljenja proces ne može preći u `approved-for-invoice`.

---

## Finansijska struktura

Za GIGATRON korporativnu pretplatu velike vrednosti nije dozvoljena jedna nedefinisana uplata.

Dozvoljeni modeli:

- milestone tranše
- escrow aranžman
- bankarska garancija
- kombinovani model uz pisani approval

Svaka tranša mora imati:

- iznos
- datum dospeća
- uslov aktivacije
- dokaz ispunjenja milestone-a
- approval evidenciju

---

## Bankarski i platni kanal

Pre slanja instrukcija za uplatu potrebno je:

- unapred najaviti banci/platnoj instituciji očekivani tok
- dostaviti ugovor, proformu/fakturu i ekonomsku svrhu transakcije
- evidentirati očekivani obim i dinamiku uplata
- pripremiti monitoring plan za sumnjive ili blokirane tokove

Bez bankarskog readiness statusa `confirmed` uplata se ne pokreće.

---

## Approval tok

Minimalni approval lanac:

1. Business owner
2. Legal
3. Finance
4. Tax
5. Risk / Compliance
6. Uprava / nadzor za ekstremno veliku vrednost

Operativni tim ne sme samostalno odobriti aktivaciju ili naplatu ovakvog aranžmana.

### Status model

| Status | Značenje |
|---|---|
| `draft` | Predmet otvoren, bez potpune dokumentacije |
| `blocked-until-validated` | Iznos/predmet nije potvrđen |
| `legal-review` | U toku ugovor i pravna analiza |
| `compliance-review` | U toku KYC/AML/regulatorni pregled |
| `approved-for-invoice` | Dozvoljeno izdavanje proforme/fakture |
| `payment-pending` | Faktura izdata, čeka se uplata |
| `payment-confirmed` | Sredstva potvrđena i usklađena |
| `service-active` | Pretplata aktivirana |
| `rollback` | Proces vraćen zbog rizika/spora |
| `closed` | Predmet završen ili odbačen |

---

## Fakturisanje i naplata

Obavezni artefakti:

- proforma
- finalna faktura
- jedinstveni referentni broj
- opis usluge/pretplate
- period pretplate
- valuta
- instrukcije za uplatu
- potvrda prijema sredstava

Nijedna finalna faktura se ne izdaje dok status nije `approved-for-invoice`.

---

## Audit trag

Centralni audit registar mora čuvati:

- sve verzije komercijalnih uslova
- sva odobrenja i potpise
- KYC/AML rezultate
- regulatorna i poreska mišljenja
- proforme i fakture
- potvrde banke
- potvrde prijema sredstava
- komunikaciju o sporovima, refund-u i rollback-u

Audit trag mora biti dovoljan da pokaže `B2B-first`, `payment confirmed before activation` i `full traceability`.

---

## Operativna aktivacija

Pretplata može preći u `service-active` isključivo kada su istovremeno ispunjeni svi uslovi:

- pravni paket kompletan
- KYC/AML i regulatorni pregled odobren
- poreski model potvrđen
- approval lanac kompletan
- uplata evidentirana i potvrđena
- audit registar ažuriran

Bez statusa `payment-confirmed` nema aktivacije benefita, pristupa, SLA obaveza ni enterprise prava.

---

## Sporovi i rollback

Moraju biti unapred definisani postupci za:

- odbijenu uplatu
- regulatorni zastoj
- raskid ugovora
- delimičan ili pun refund
- blokadu banke
- neusaglašenost dokumentacije
- sumnju na AML/sanctions rizik

Svaki od ovih događaja vraća predmet najmanje u `rollback`, a po potrebi u `closed`.

---

## Tehnička granica implementacije u ovom repozitorijumu

Ovaj repozitorijum trenutno implementira governance okvir, ne runtime naplatu za ovu specifičnu korporativnu transakciju.

Tek nakon potvrde pravnog i finansijskog okvira dozvoljeno je planirati zasebnu tehničku implementaciju za:

- corporate subscription model
- invoice/audit status polja
- compliance checkpoints
- GIGATRON B2B workflow aktivaciju

---

## Cross-repo napomena

Ovaj governance tok je repo-local za `spaja86/AI-IQ-SUPER-PLATFORMA`.

`spaja86/IO-OPENUI-AO` trenutno nema obaveznu downstream izmenu za ovaj dokumentovani proces.
