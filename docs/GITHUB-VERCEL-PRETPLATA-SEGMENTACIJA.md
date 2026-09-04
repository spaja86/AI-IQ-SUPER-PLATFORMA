# GitHub i Vercel — Pretplata po privredi i građanstvu

**Status:** `ready-for-governance-implementation`  
**Datum:** 2026-08-15  
**Owner:** Kompanija SPAJA / Digitalna Industrija

---

## 1. Komercijalni tokovi

Platforma uvodi dva odvojena komercijalna toka:

- **Privreda** — firme, preduzetnici, agencije i timovi
- **Građanstvo** — fizička lica, individualni kreatori i freelance korisnici

Ova segmentacija važi paralelno za **GitHub** i **Vercel**.

---

## 2. Četiri formalna paketa

### GitHub Građanstvo

- osnovni individualni paket
- paket sa Copilot pristupom
- portfolio + privatni repozitorijumi

### GitHub Privreda

- team paket
- compliance paket
- enterprise paket sa seat-ovima, auditom i governance slojem

### Vercel Građanstvo

- lični / showcase paket
- osnovni hosting
- preview workflow paket

### Vercel Privreda

- team hosting paket
- performance / analytics paket
- enterprise paket sa SSO, domenima, governance i prioritetnom podrškom

---

## 3. Jedinstven status model pretplate

Za oba provajdera koristi se isti status model:

- `draft`
- `incomplete-intake`
- `legal-review`
- `tax-review`
- `approved-for-invoice`
- `payment-pending`
- `payment-confirmed`
- `service-active`
- `rollback`
- `closed`
- `blocked-until-validated`

---

## 4. Pravni i poreski model po segmentu

### Građanstvo

- identitet korisnika
- prihvatanje uslova
- fiskalno prihvatljiv račun ili računovodstveni trag
- refund i otkazivanje

### Privreda

- pravno lice
- PIB / MB
- ovlašćeni potpisnik
- ugovor / aneks
- PDV / eFaktura
- approval lanac

---

## 5. Pravila aktivacije

- Nema aktivacije bez `payment-confirmed`.
- Nema enterprise benefita bez validiranog ugovornog i billing osnova.
- Neodređeni ili “beskonačni” modeli ostaju `blocked-until-validated` dok se ne prevedu u periodični obračun.

---

## 6. Matrica benefita

Svaki plan mora imati jasno definisane:

- broj seat-ova
- privatni repo pristup
- Copilot / AI prava
- build / deploy limite
- analytics i observability
- SLA i podršku
- audit / governance nivo
- broj projekata / timova / domena

---

## 7. FinOps okvir

Za oba provajdera se uvode:

- mesečni budžeti
- pragovi upozorenja na **50% / 75% / 90% / 100%**
- cost center za privredu
- limit i anti-overage pravila za građanstvo
- KPI:
  - trošak po deploy-u
  - trošak po korisniku
  - build duration
  - deployment success rate

---

## 8. Operativni split

- **Vercel** ostaje primarni source of truth za deploy i build.
- **GitHub Actions** ostaje quality gate, audit i governance sloj.
- Subscription model mora slediti taj split i ne sme duplirati odgovornosti između provajdera.

---

## 9. Enterprise procurement tok

### Vercel

- Vercel sales zahtev
- enterprise billing readiness
- ownership i admin backup
- security kontakt
- kvartalni vendor review
- godišnji komercijalni review

### GitHub

- GitHub enterprise zahtev
- ownership i billing transfer
- governance matrica vlasništva
- repo admin backup
- security kontakt
- kvartalni vendor review
- godišnji komercijalni review

---

## 10. Intake podaci

Pre otvaranja pretplate moraju biti definisani:

- segment korisnika
- identitet / naziv pravnog lica
- kontakt kanal
- željeni plan
- valuta i ciklus naplate
- način plaćanja
- očekivani obim korišćenja
- potrebni add-on-i
- compliance zahtevi

Za **privredu** su dodatno obavezni:

- PIB / MB
- ovlašćeni potpisnik

---

## 11. Audit i dokumentacioni paket

Mora postojati trag za:

- svaku promenu plana
- svaki invoice ciklus
- svaki approval
- svaki payment event
- svaki upgrade / downgrade / rollback

Ako postoji vendor ili multi-repo uticaj, evidencija mora sadržati downstream reference ka povezanim repo dokumentima.

---

## 12. Go-live redosled

1. građanstvo pilot sa ograničenim planovima
2. privreda standardni planovi
3. enterprise / procurement tokovi za GitHub i Vercel
4. post-pilot usklađivanje cena, pragova i upgrade pravila

---

## 13. Implementacioni prioritet

1. definicija planova i benefita
2. pravno-poreska validacija
3. billing status model
4. procurement / enterprise readiness
5. audit i operativni KPI nadzor
