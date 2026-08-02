# Autokuća — B2B Pretplata (Beskonačan Račun u EUR)

**Status:** `blocked-until-validated`
**Datum:** 2026-08-02
**Owner:** Kompanija SPAJA / Digitalna Industrija

---

## Svrha

Ovaj dokument definiše obavezni governance model za B2B perpetual subscription za:

- **Kragujevac Autokuća d.o.o.** — OKRID: `OKRID-2026-AUTOKUCA-KG-001`
- **Beograd Autokuća d.o.o.** — OKRID: `OKRID-2026-AUTOKUCA-BG-001`

Svaka autokuća dobija **po jedan beskonačan (perpetual recurring) pun račun u evrima (EUR)**.

Bez potvrđenog pravnog osnova, validiranog iznosa, KYC/AML provere, poreskog modela i bankarski prihvatljivog platnog toka:

- ne izdaje se finalna faktura
- ne aktivira se pretplata
- ne puštaju se benefiti/usluge
- proces ostaje u statusu `blocked-until-validated`

---

## Intake — Obavezni ulazni podaci

Pre otvaranja billing toka moraju postojati (za svaku autokući):

1. Puno pravno ime i sedište kompanije
2. PIB i matični broj (MB)
3. Identitet i ovlašćenje potpisnika ugovora
4. Kontakt: email, telefon, adresa
5. Period važenja pretplate (`start_date`; `end_date: null` — beskonačno)
6. Potvrđen iznos obaveze (EUR), ciklus naplate i model plaćanja

Status ostaje `incomplete-intake` dok svi podaci nisu pristigli.

---

## Intake zapisi

### Kragujevac Autokuća

| Polje | Vrednost |
|-------|----------|
| OKRID | `OKRID-2026-AUTOKUCA-KG-001` |
| Pravno ime | Kragujevac Autokuća d.o.o. |
| Sedište | Kragujevac, Republika Srbija |
| PIB | [popuniti] |
| MB | [popuniti] |
| Ovlašćeni potpisnik | [popuniti] |
| Email | [popuniti] |
| Telefon | [popuniti] |
| Broj računa | `INV-KG-2026-001` |
| Status | `incomplete-intake` |

### Beograd Autokuća

| Polje | Vrednost |
|-------|----------|
| OKRID | `OKRID-2026-AUTOKUCA-BG-001` |
| Pravno ime | Beograd Autokuća d.o.o. |
| Sedište | Beograd, Republika Srbija |
| PIB | [popuniti] |
| MB | [popuniti] |
| Ovlašćeni potpisnik | [popuniti] |
| Email | [popuniti] |
| Telefon | [popuniti] |
| Broj računa | `INV-BG-2026-001` |
| Status | `incomplete-intake` |

---

## KYC / AML / Pravna provera

Obavezno pre fakturisanja (za svaku autokući):

- Identifikacija pravnog lica (izvod iz APR-a)
- Provera zastupnika i ovlašćenja potpisnika
- AML/KYC screening
- Sanctions/PEP screening
- Provera porekla sredstava (ako vrednost prelazi zakonski prag)

Status provere mora biti `approved` pre aktivacije. Status `pending` ili `rejected` blokira naplatu.

---

## Ugovorni paket (po autokući)

Svaka autokuća dobija sopstveni dokument paket:

- Glavni ugovor o pretplati
- Aneks — specifikacija usluge (opis, obim, SLA)
- Komercijalni uslovi (cena u EUR, model naplate: recurring/beskonačno)
- Uslovi raskida i refund politika
- Merodavno pravo: pravo Republike Srbije
- Nadležnost: nadležni sud prema sedištu platforme
- Potpis ovlašćenog lica obe strane

---

## Billing model — Beskonačan Račun (Perpetual Recurring Invoice)

**Tip:** B2B Subscription — bez datuma isteka (`end_date: null` / `"infinite"`)
**Valuta:** EUR (€)
**Tip računa:** Pun račun (full invoice) sa svim obaveznim elementima po RS pravu

| Polje | Kragujevac Autokuća | Beograd Autokuća |
|-------|---------------------|------------------|
| Broj računa | `INV-KG-2026-001` | `INV-BG-2026-001` |
| Izdavalac | AI-IQ-SUPER-PLATFORMA / Kompanija SPAJA | isto |
| Primalac | Kragujevac Autokuća d.o.o. | Beograd Autokuća d.o.o. |
| Datum izdavanja | datum aktivacije | datum aktivacije |
| Datum dospeća | recurring (beskonačno, svaki ciklus) | recurring (beskonačno) |
| Valuta | EUR | EUR |
| Iznos | [definisati po ugovoru] | [definisati po ugovoru] |
| PDV | 20% | 20% |
| Status pretplate | `active` (po aktivaciji) | `active` (po aktivaciji) |
| Ciklus naplate | mesečno / godišnje (odrediti) | mesečno / godišnje |
| auto-renew | `true` | `true` |

---

## Poreski i regulatorni pregled

- PDV tretman i mesto prometa: Srbija → Srbija = 20% PDV
- Devizno poslovanje: naplata u EUR — primena Zakona o deviznom poslovanju RS
- Kursna pravila i kursna razlika: referentni kurs NBS na dan fakture
- Obavezna eFaktura (SEF format) po Zakonu o elektronskom fakturisanju RS za B2B transakcije između pravnih lica
- Poreske evidencije i MEF integracija

---

## Status gejt — Blokatori pre aktivacije

| Uslov | KG Status | BG Status |
|-------|-----------|-----------|
| Potpisan ugovor | ⏳ pending | ⏳ pending |
| KYC/AML approved | ⏳ pending | ⏳ pending |
| PIB / MB verifikovan | ⏳ pending | ⏳ pending |
| Iznos fakture definisan | ⏳ pending | ⏳ pending |
| eFaktura (SEF) podešena | ⏳ pending | ⏳ pending |
| Payment metoda konfigurisana | ⏳ pending | ⏳ pending |

Bez `approved` statusa na svim gornjim uslovima — pretplata i faktura ostaju `blocked-until-validated`.

---

## Rollback plan

- Pretplata se može suspendovati bez gubitka podataka
- Izdate fakture se storniraju knjižnom notom uz puni audit trail
- Ugovorni raskid prema klauzuli iz ugovora o pretplati

---

## Audit log

Svaki billing ciklus se beleži u `omega-audit` middleware sa:

- `okrid` — jedinstveni identifikator zapisa
- `clientId` — interni ID autokuće
- `invoiceNumber` — broj računa
- `amount` — iznos u EUR
- `currency` — `EUR`
- `cycleStart` / `cycleEnd` — period naplate
- `status` — status pretplate
- `timestamp` — vreme zapisa

---

*Analogija: `docs/GIGATRON-KORPORATIVNA-PRETPLATA.md`*
