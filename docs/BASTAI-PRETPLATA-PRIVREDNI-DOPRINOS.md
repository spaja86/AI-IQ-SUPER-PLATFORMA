# BASTAI — Pretplata i „Privredni Doprinos” u Iznosu 1 sa „Beskonačnim” Računom

**Status:** `blocked-until-validated`  
**Datum:** 2026-08-05  
**Owner:** Kompanija SPAJA / Digitalna Industrija  
**OKRID:** `OKRID-2026-BASTAI-001`

---

## Svrha

Ovaj dokument definiše repo-local governance model za zahtev `PRETPLATA "BASTAI" PRIVREDNI DOPRINOS U IZNOSU 1 "BESKONAČAN" RAČUN`.

Predmet se tretira kao compliance i billing governance tok, a ne kao automatska naplata.

Bez potvrđenog pravnog osnova, validiranog modela naplate, određenog ili odredivog iznosa, identiteta ugovornih strana, poreskog tretmana i bankarski izvršivog toka:

- ne izdaje se finalna faktura
- ne knjiži se prihod kao konačno realizovan
- ne aktivira se pretplata
- proces ostaje `blocked-until-validated`

---

## Tumačenje izraza „1 beskonačan račun”

U ovom okviru izraz `1 "beskonačan" račun` nije dozvoljeno tumačiti kao:

- jedan jedini račun bez kraja
- neograničen ili neodređen dug
- trajnu novčanu obavezu bez obračunskog perioda
- automatsko priznavanje prihoda bez pojedinačnog obračuna

Dozvoljeno tumačenje je isključivo:

- okvirni pretplatni odnos bez unapred definisanog krajnjeg datuma
- `endDate: null` samo na nivou ugovornog odnosa
- periodični obračun po ciklusu
- zaseban račun, proforma ili drugi obračunski dokument za svaki ciklus
- mogućnost raskida, izmene ili mirovanja prema ugovoru

---

## Početni status i intake

Predmet se otvara sa statusom `blocked-until-validated` dok se ne potvrde svi obavezni podaci.

### Obavezni intake podaci

Pre pokretanja billing toka moraju biti identifikovani i dokumentovani:

1. puno pravno ime `BASTAI`
2. sedište, PIB i matični broj
3. kontakt podaci
4. identitet i ovlašćenje potpisnika
5. pravni osnov izraza `privredni doprinos`
6. poslovna kvalifikacija odnosa:
   - pretplata
   - članarina
   - donacija
   - avans
   - naknada za uslugu
7. opis usluge, prava ili benefita koje pretplata daje
8. datum početka i pravila raskida
9. valuta, iznos i obračunski ciklus
10. određeni ili odrediv metod obračuna
11. način plaćanja i bankarski izvršive instrukcije

Ako bilo koji od ovih elemenata nedostaje, predmet ostaje `incomplete-intake` ili `blocked-until-validated`, u zavisnosti od nivoa pravne neodređenosti.

---

## Pravna kvalifikacija pojma „privredni doprinos”

Izraz `privredni doprinos` mora biti pravno kvalifikovan pre bilo kakvog fakturisanja ili knjiženja prihoda.

Obavezno je utvrditi:

- da li postoji ugovor o pretplati ili drugi okvirni poslovni odnos
- da li uplata predstavlja naknadu za uslugu, članarinu, donaciju ili avans
- da li je obaveza određena ili odrediva
- da li je tok pravno izvršiv po pravu Republike Srbije

Bez završene pravne kvalifikacije:

- nije dozvoljeno izdavanje fakture
- nije dozvoljeno knjiženje prihoda
- nije dozvoljena aktivacija pretplate

---

## Poreski i računovodstveni pregled

Pre aktivacije mora biti dokumentovano:

- PDV tretman i primenjiva stopa
- da li postoji obaveza eFakture
- da li uplata predstavlja avans ili konačni obračun
- trenutak priznavanja prihoda
- pravila evidencije avansa, storna i naknadnih obračuna

Ako poreski ili računovodstveni tretman nije potvrđen, status ostaje `tax-review` ili `blocked-until-validated`.

---

## Dozvoljeni billing model

Dozvoljeni model u ovom repozitorijumu podrazumeva:

- ugovorni odnos sa `endDate: null`
- periodično izdavanje zasebnog obračunskog dokumenta
- jasan obračunski period za svaki ciklus
- bankarski izvršivu uplatu
- audit trag za svaki obračun

Iznos `1` je dozvoljen samo ako je:

- ugovorno opravdan
- poreski prihvatljiv
- računovodstveno prihvatljiv
- povezan sa jasnim obračunskim osnovom

Iznos `1` nije dovoljan sam po sebi za aktivaciju ili fakturisanje.

---

## Kontrolne tačke pre `approved-for-invoice`

Pre prelaska u status `approved-for-invoice` moraju biti potvrđeni:

1. pravni osnov
2. određen ili odrediv iznos
3. definisan obračunski period
4. potvrđen poreski tretman
5. bankarski izvršive instrukcije
6. identitet i ovlašćenja ugovornih strana
7. ugovorni paket i pravila raskida

Ako je bilo koji od ovih uslova neispunjen, predmet ostaje blokiran.

---

## Status model

| Status | Značenje |
|---|---|
| `draft` | Predmet otvoren |
| `incomplete-intake` | Nedostaju osnovni identifikacioni ili ugovorni podaci |
| `legal-review` | U toku pravna analiza i kvalifikacija modela |
| `tax-review` | U toku poreska i računovodstvena potvrda |
| `approved-for-invoice` | Dozvoljeno izdavanje proforme/fakture |
| `payment-pending` | Faktura izdata, čeka se uplata |
| `payment-confirmed` | Uplata potvrđena |
| `service-active` | Pretplata aktivirana |
| `rollback` | Proces vraćen zbog rizika, spora ili neusaglašenosti |
| `closed` | Predmet zatvoren |
| `blocked-until-validated` | Predmet blokiran zbog neodređenog ili nevalidiranog modela |

---

## Aktivacija pretplate

Pretplata može preći u `service-active` isključivo kada su istovremeno ispunjeni svi uslovi:

- kompletan ugovorni paket
- potvrđen poreski i računovodstveni model
- izdat validan obračunski dokument za konkretan ciklus
- potvrđena uplata

Bez statusa `payment-confirmed` nema aktivacije usluge, benefita ni pristupa.

---

## Audit trag

Za svaki obračunski ciklus mora postojati audit zapis sa najmanje sledećim poljima:

- identifikator predmeta
- broj računa po ciklusu
- iznos
- valuta
- status
- datumi obračuna
- potvrde odobrenja
- potvrda prijema uplate

Audit trag mora biti dovoljan da pokaže:

- pravni osnov poslovnog odnosa
- pojedinačni obračun po ciklusu
- `payment confirmed before activation`
- punu sledljivost statusnih promena

---

## Formalni rezultat ovog governance toka

Završni poslovni rezultat mora biti jedan od sledećih formalnih paketa:

- ugovor o pretplati sa periodičnim obračunom, ili
- okvirni ugovor sa aneksom koji uređuje `privredni doprinos`, iznos, ciklus i dokument model

Tek nakon toga dozvoljeno je planirati runtime fakturisanje u ovom repozitorijumu.

---

## Tehnička granica implementacije

Ovaj repozitorijum trenutno implementira governance okvir za `BASTAI`.

Ne implementira automatsku pravnu validaciju, stvarnu bankarsku realizaciju niti automatsku aktivaciju pretplate. Svaka uplata ostaje blokirana dok poslovno-pravni input ne bude potpun i proverljiv.

---

## Cross-repo napomena

Ovaj governance tok je repo-local za `spaja86/AI-IQ-SUPER-PLATFORMA`.

`spaja86/IO-OPENUI-AO` trenutno nema obaveznu downstream izmenu za ovaj dokumentovani proces.
