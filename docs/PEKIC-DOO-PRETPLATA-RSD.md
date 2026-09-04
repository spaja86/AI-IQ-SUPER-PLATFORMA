# PEKIC d.o.o. — Pretplata i Dinarska Uplata po Pravu Republike Srbije

**Status:** `blocked-until-validated`  
**Datum:** 2026-08-05  
**Owner:** Kompanija SPAJA / Digitalna Industrija  
**OKRID:** `OKRID-2026-PEKIC-001`

---

## Svrha

Ovaj dokument definiše repo-local governance model za `PEKIC d.o.o.` pretplatu u dinarima (RSD), sa fokusom na pravni osnov, računovodstvenu prihvatljivost i bankarski izvršivu uplatu.

Pojam **„1 beskonačnog računa u dinarima“** nije dozvoljeno tumačiti kao neograničenu ili neodređenu novčanu obavezu. U ovom okviru on se prevodi isključivo u pravno dozvoljen oblik:

- okvirni ugovor o pretplati
- periodični obračun u RSD
- pojedinačna proforma i/ili faktura po obračunskom ciklusu
- evidencija avansa samo kada postoji jasan pravni i poreski osnov

Bez potvrđenog pravnog osnova, validiranog modela naplate, identiteta ugovornih strana, poreskog tretmana i bankarski prihvatljivog toka:

- ne izdaje se finalna faktura
- ne knjiži se prihod kao konačno realizovan
- ne aktivira se pretplata
- proces ostaje `blocked-until-validated`

---

## Tumačenje poslovnog modela

Za potrebe ovog repozitorijuma `pretplata` za `PEKIC d.o.o.` može biti samo jedan od sledećih modela:

1. ugovorna pretplata sa periodičnim fakturisanjem
2. avansna uplata za buduće usluge uz kasniji obračun
3. jednokratna uplata po posebnom ugovornom osnovu
4. trajni poslovni odnos sa mesečnim ili godišnjim obračunom

Model **nije dozvoljeno** voditi kao:

- beskonačan račun bez iznosa
- trajnu neograničenu novčanu obavezu bez obračunskog perioda
- otvoreni dug bez ugovora, fakture ili druge verifikovane dokumentacije

---

## Učesnici i dokumentacija

Pre pokretanja billing toka moraju biti identifikovani:

- izdavalac usluge / poverilac
- `PEKIC d.o.o.` kao primalac usluge / dužnik
- ovlašćeni potpisnici obe strane
- pravni osnov transakcije

Obavezna dokumentacija:

- glavni ugovor ili okvirni ugovor o pretplati
- aneks/specifikacija usluge
- proforma ili predračun kada je primenljivo
- faktura za svaki obračunski ciklus
- evidencija o prijemu uplata
- pravila raskida, izmene i mirovanja pretplate

Ako nedostaje bilo koji od ovih elemenata, predmet se vodi kao `incomplete-intake`.

---

## Pravna usklađenost — Republika Srbija

Obavezno je proveriti i dokumentovati usklađenost sa:

- Zakonom o obligacionim odnosima
- Zakonom o računovodstvu
- Zakonom o PDV
- Zakonom o elektronskom fakturisanju
- pravilima domaćeg platnog prometa u dinarima

Pošto je valuta modela `RSD`, uplata mora biti organizovana kao domaće dinarsko plaćanje uz jasno definisan iznos ili metod obračuna za svaki ciklus.

---

## Dozvoljeni model „beskonačnog računa“

U ovom okviru izraz „beskonačan račun“ znači samo:

- `endDate: null` na nivou ugovornog odnosa
- periodično izdavanje zasebnih obračunskih dokumenata
- mogućnost raskida ili izmene prema ugovoru

Ne znači:

- jedan jedini račun bez kraja
- neograničeni iznos
- automatsko priznavanje prihoda bez pojedinačnog obračuna

---

## Obavezni elementi pretplate

Svaki pretplatni aranžman mora imati:

- pravni osnov
- valutu `RSD`
- definisan iznos ili ugovorenu metodologiju obračuna
- obračunski period
- datum izdavanja i datum dospeća
- način izdavanja računa
- status KYC/identifikacije i ovlašćenja
- pravila evidencije uplata
- uslove raskida, izmene i mirovanja

---

## Poreski i računovodstveni tretman

Pre aktivacije mora biti dokumentovano:

- da li je uplata avans ili konačni obračun
- PDV status i primenjiva stopa
- trenutak priznavanja prihoda
- obaveza izdavanja elektronske fakture kada je primenljivo
- evidencija avansa, storna i naknadnih obračuna

Ako je uplata avansna, status ostaje ograničen dok ne postoji odgovarajući obračunski i poreski dokument.

---

## Kontrolne tačke usklađenosti

Pre prelaska u `approved-for-invoice` moraju biti potvrđeni:

1. identitet i ovlašćenje ugovornih strana
2. jasan pravni osnov
3. određen ili odrediv iznos
4. jasan obračunski period
5. poreski tretman
6. bankarski izvršive RSD instrukcije
7. pravila za raskid i izmene

Ako je formulacija obaveze nejasna, neodređena ili pravno neizvršiva, status ostaje `blocked-until-validated`.

---

## Status model

| Status | Značenje |
|---|---|
| `draft` | Predmet otvoren |
| `incomplete-intake` | Nedostaju identitet, ugovor ili osnovni podaci |
| `legal-review` | U toku pravna analiza i ugovorno usklađivanje |
| `tax-review` | U toku poreska i računovodstvena potvrda |
| `approved-for-invoice` | Dozvoljeno izdavanje proforme/fakture |
| `payment-pending` | Faktura izdata, čeka se uplata |
| `payment-confirmed` | Uplata potvrđena |
| `service-active` | Pretplata aktivirana |
| `rollback` | Proces vraćen zbog rizika/spora |
| `closed` | Predmet zatvoren |

---

## Formalni dokument koji ovaj plan pretpostavlja

Završni poslovni rezultat mora biti jedan od sledećih formalnih paketa:

- ugovor o pretplati u RSD, ili
- okvirni ugovor sa aneksom o dinarskim uplatama i pravilima obračuna

Tek nakon toga dozvoljeno je planirati i koristiti runtime fakturisanje u ovom repozitorijumu.

---

## Tehnička granica implementacije

Ovaj repozitorijum trenutno implementira governance okvir i guard-ovane pomoćne modele za `PEKIC d.o.o.`.

Ne implementira automatsku pravnu validaciju niti stvarnu bankarsku realizaciju. Svaka uplata ostaje blokirana dok poslovno-pravni input ne bude potpun i proverljiv.
