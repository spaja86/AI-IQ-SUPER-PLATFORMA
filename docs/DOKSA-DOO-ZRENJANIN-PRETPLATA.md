# DOKSA d.o.o. Zrenjanin — POSLOVNA PONUDA / PRETPLATA governance

**Status:** `blocked-until-validated`  
**Datum:** 2026-09-26  
**Owner:** Kompanija SPAJA / Digitalna Industrija  
**Parent lock:** `DEVELOPER AND CREATE == VRH PROGRAMSKOG EKVILADENTA == POSLOVNA PONUDA / PRETPLATA`

---

## 1. Svrha i poslovni model

Ovaj dokument definiše repo-local governance tok za poslovni predmet pretplate vezan za pravno lice `DOKSA d.o.o. Zrenjanin`.

Predmet ostaje:

- additive-only dokumentacioni i governance slučaj u postojećem `EXTRIMLI / EXTREM / EXTRONDOL / SPAJA KOD` modelu
- bez novih runtime ruta
- bez paralelnog source-of-truth sistema
- bez automatske aktivacije dok identitet, ugovor i uplata nisu potvrđeni

Ako postoji interes za zapošljavanje, partnerstvo ili širu saradnju, taj tok ostaje odvojen od pretplate i vodi se kao poseban human-review/commercial track.

---

## 2. Kanonski poslovni predmet

- Kanonski pretplatnik: `DOKSA d.o.o. Zrenjanin`
- Potencijalni intake kontakt / potpisnik za validaciju: private intake evidencija, nije public-safe summary podatak
- Kontakt ili potpisnik ne sme biti tretiran kao automatski potvrđen bez proverljivog ovlašćenja

Pre bilo kakve aktivacije mora biti potvrđeno:

1. da `DOKSA d.o.o. Zrenjanin` predstavlja tačno pravno lice
2. da je `Vladimir Anđelković` ovlašćeni potpisnik ili validni intake kontakt
3. da postoji ugovorni i billing osnov za pretplatu

---

## 3. Intake — obavezni ulazni podaci

Moraju biti dokumentovani:

1. puno pravno ime: `DOKSA d.o.o. Zrenjanin`
2. sedište, PIB i matični broj
3. identitet i ovlašćenje potpisnika
4. kontakt podaci (email, telefon, adresa)
5. opis usluge / prava / benefita pretplate
6. valuta, iznos i ciklus naplate
7. način plaćanja i bankarski izvršive instrukcije
8. datum početka i pravila aktivacije / raskida / mirovanja
9. downstream reference ako je potreban summary-only prenos

Ako bilo koji element nedostaje, predmet ostaje `incomplete-intake` ili `blocked-until-validated`.

---

## 4. Pravna, billing i compliance kvalifikacija

Pre aktivacije moraju biti završeni:

- contract approval
- compliance review
- human review
- payment verification
- downstream reference

Bez potvrđenog identiteta, ugovora i uplate:

- nema aktivacije
- nema enterprise benefita
- nema WAWE promocije
- nema downstream tvrdnje da je pretplata aktivna

---

## 5. Ownership split

- **EXTREM** — tehnička/readiness evidencija i bounded dokaz spremnosti
- **EXTRONDOL** — review, freeze/promotion, rollout/rollback, payment verification i governance odluke
- **SPAJA KOD** — samo audit-safe summary status, blocker/watch reason, review posture i downstream reference

Ownership split ostaje zaključan:

- `DOK + DIK + FOR` -> `EXTREM`
- `DAK + DUK` -> `EXTRONDOL`
- `SPAJA KOD` -> `summary-only`

---

## 6. Status workflow

| Status | Značenje |
| --- | --- |
| `draft` | Predmet otvoren |
| `incomplete-intake` | Nedostaju ključni podaci |
| `identity-review` | U toku potvrda pravnog lica i potpisnika |
| `contract-review` | U toku pravna i billing kvalifikacija |
| `payment-pending` | Ugovorni okvir postoji, čeka se uplata |
| `activation-ready` | Hard gate-ovi zatvoreni, čeka human review završetak |
| `service-active` | Pretplata aktivirana |
| `rollback` | Aktivacija vraćena zbog rizika ili neusaglašenosti |
| `blocked-until-validated` | Blokirano dok identitet/ugovor/uplata nisu provereni |

Javni posture ostaje `READY | WATCH | BLOCKED`.

---

## 7. Privatne poruke i granica javnog sloja

Direktna poruka `Bato zaposli mi i drugare, ljubi brat` ne ulazi u kanonski ugovorni jezik.

Ako se sačuva, tretira se isključivo kao:

- private intake evidence
- audit beleška
- repo-local komunikacioni trag

Nije dozvoljeno da se ta poruka pojavi u:

- public-safe summary izlazu
- downstream sync paketu
- kanonskom pretplata opisu

---

## 8. Razdvajanje pretplate od zapošljavanja / saradnje

- Pretplata ostaje billing i governance predmet.
- Zapošljavanje, preporuke za drugare ili partnerstvo ostaju poseban commercial/human-review track.
- Javna formulacija ostaje ograničena na status, blocker reason, review posture i downstream reference.

---

## 9. Audit trag

Audit paket mora sadržati najmanje:

- kanonsko pravno lice
- status potvrde identiteta
- status potvrde potpisnika / intake kontakta
- contract approval evidence
- compliance review evidence
- payment verification evidence
- human review evidence
- downstream reference
- istoriju statusnih promena

Audit trag mora dokazivati `payment-confirmed before service-active`.

---

## 10. Rollback i activation gate

Rollback ili freeze je obavezan kada postoji:

- nepotvrđen identitet pravnog lica
- nepotvrđeno ovlašćenje potpisnika
- povučena ili osporena uplata
- nedovršen compliance review
- pokušaj objave privatne poruke ili kontakta u public-safe summary sloju

Aktivacija je dozvoljena samo kada su identitet, ugovor, uplata, human review i audit evidence kompletni.

---

## 11. Acceptance kriterijumi

- nema novih runtime ruta
- nema paralelnog source-of-truth sistema
- nema aktivacije bez potvrđenog identiteta, ugovora i uplate
- nema objave privatnih poruka ili kontakata u public-safe summary sloju
- downstream prema `spaja86/IO-OPENUI-AO` ostaje summary-only

---
