# GIGATRON d.o.o. — Pretplata i „1 Beskonačan Račun" po Pravu Republike Srbije

**Status:** `blocked-until-validated`  
**Datum:** 2026-08-12  
**Owner:** Kompanija SPAJA / Digitalna Industrija  
**OKRID:** `OKRID-2026-GIGATRON-SUB-001`

---

## Svrha

Ovaj dokument definiše repo-local governance model za `GIGATRON d.o.o.` pretplatu u dinarima (RSD), sa fokusom na pravni osnov, računovodstvenu prihvatljivost i bankarski izvršivu uplatu.

Pojam **„1 beskonačnog računa"** nije dozvoljeno tumačiti kao neograničenu ili neodređenu novčanu obavezu. U ovom okviru on se prevodi isključivo u pravno dozvoljen oblik:

- okvirni ugovor o pretplati (framework agreement)
- periodični obračun u RSD po obračunskom ciklusu
- pojedinačna proforma i/ili faktura po ciklusu
- `endDate: null` = perpetual ugovorni odnos sa pravom raskida

Bez potvrđenog pravnog osnova, validiranog modela naplate, identiteta ugovornih strana, poreskog tretmana i bankarski prihvatljivog toka:

- ne izdaje se finalna faktura
- ne knjiži se prihod kao konačno realizovan
- ne aktivira se pretplata
- proces ostaje `blocked-until-validated`

---

## Tumačenje poslovnog modela

Za potrebe ovog repozitorijuma `pretplata` za `GIGATRON d.o.o.` može biti samo jedan od sledećih modela:

1. ugovorna pretplata sa periodičnim fakturisanjem (mesečno ili godišnje)
2. avansna uplata za buduće usluge uz kasniji obračun
3. jednokratna uplata po posebnom ugovornom osnovu
4. trajni poslovni odnos sa mesečnim ili godišnjim obračunom

Model **nije dozvoljeno** voditi kao:

- beskonačan račun bez iznosa
- trajnu neograničenu novčanu obavezu bez obračunskog perioda
- otvoreni dug bez ugovora, fakture ili druge verifikovane dokumentacije

---

## Dozvoljeni model „beskonačnog računa"

U ovom okviru izraz „1 beskonačan račun" znači samo:

- `endDate: null` na nivou ugovornog odnosa
- `autoRenew: true` — automatska obnova po isteku svakog ciklusa
- periodično izdavanje zasebnih obračunskih dokumenata (proforma/faktura)
- mogućnost raskida ili izmene prema ugovoru

Ne znači:

- jedan jedini račun bez kraja i bez iznosa
- neograničeni iznos
- automatsko priznavanje prihoda bez pojedinačnog obračuna

---

## Obavezni ulazni podaci

Pre otvaranja billing toka moraju postojati:

1. potvrđen predmet pretplate i opis usluge
2. identitet ugovorne strane (`GIGATRON d.o.o.`) i ovlašćenog potpisnika
3. period važenja pretplate (interval: mesečno/godišnje)
4. stvaran i dokaziv iznos obaveze u RSD
5. PDV tretman i primenljiva stopa
6. valuta (`RSD`), model plaćanja i predlog tranši

Ako bilo koji od ovih elemenata nedostaje, predmet se vodi kao `incomplete-intake`.

---

## Pravna dokumentacija

Obavezni dokument paket:

- glavni ugovor ili okvirni ugovor o pretplati
- aneks/specifikacija usluge i komercijalnih uslova
- opis usluge i komercijalni obim
- SLA
- uslovi raskida i refund politike
- merodavno pravo i nadležnost (Republika Srbija)
- potvrda ovlašćenja potpisnika obe strane

---

## KYC / Korporativna provera

Pre fakturisanja moraju biti završeni:

- identifikacija pravnog lica (`GIGATRON d.o.o.`, PIB, MB)
- provera zastupnika i ovlašćenja
- osnovna AML/KYC provera

Status provere mora biti jedan od: `approved`, `approved-with-conditions`. Status `pending` ili `rejected` blokira naplatu i aktivaciju.

---

## Poreski i računovodstveni tretman

Pre aktivacije mora biti dokumentovano:

- PDV status i primenjiva stopa (standardno 20%)
- trenutak priznavanja prihoda
- obaveza izdavanja elektronske fakture kada je primenljivo
- evidencija avansa, storna i naknadnih obračuna

---

## Status model

| Status | Značenje |
|---|---|
| `draft` | Predmet otvoren, bez potpune dokumentacije |
| `incomplete-intake` | Nedostaju identitet, ugovor ili osnovni podaci |
| `legal-review` | U toku pravna analiza i ugovorno usklađivanje |
| `tax-review` | U toku poreska i računovodstvena potvrda |
| `approved-for-invoice` | Dozvoljeno izdavanje proforme/fakture |
| `payment-pending` | Faktura izdata, čeka se uplata |
| `payment-confirmed` | Uplata potvrđena i usklađena |
| `service-active` | Pretplata aktivirana |
| `rollback` | Proces vraćen zbog rizika/spora |
| `closed` | Predmet zatvoren ili odbačen |
| `blocked-until-validated` | Iznos/predmet nije potvrđen |

---

## Fakturisanje i naplata

Obavezni artefakti:

- proforma
- finalna faktura
- jedinstveni referentni broj (`INV-GIGATRON-2026-001`)
- opis usluge/pretplate
- period pretplate
- valuta (`RSD`)
- instrukcije za uplatu
- potvrda prijema sredstava

Nijedna finalna faktura se ne izdaje dok status nije `approved-for-invoice`.

---

## Audit trag

Centralni audit registar mora čuvati:

- sve verzije komercijalnih uslova
- sva odobrenja i potpise
- KYC rezultate
- proforme i fakture
- potvrde prijema sredstava
- komunikaciju o sporovima, refund-u i rollback-u

---

## Operativna aktivacija

Pretplata može preći u `service-active` isključivo kada su istovremeno ispunjeni svi uslovi:

- pravni paket kompletan
- KYC/AML provera odobrena
- poreski model potvrđen
- uplata evidentirana i potvrđena
- audit registar ažuriran

---

## Tehnička granica implementacije

Ovaj repozitorijum implementira governance okvir i guard-ovane pomoćne modele za `GIGATRON d.o.o.` pretplatu.

Ne implementira automatsku pravnu validaciju niti stvarnu bankarsku realizaciju. Svaka uplata ostaje blokirana dok poslovno-pravni input ne bude potpun i proverljiv.

---

## Cross-repo napomena

Ovaj governance tok je repo-local za `spaja86/AI-IQ-SUPER-PLATFORMA`.

`spaja86/IO-OPENUI-AO` trenutno nema obaveznu downstream izmenu za ovaj dokumentovani proces.
