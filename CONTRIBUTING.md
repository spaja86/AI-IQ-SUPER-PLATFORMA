# 🤝 CONTRIBUTING - AI-IQ-SUPER-PLATFORMA

## Pravila za Doprinose sa Nakladom

Hvala što razmatrate saradnju sa **AI-IQ-SUPER-PLATFORMA**. Svi doprinosi su **PLAĆENI** prema cjeniku navedenom u `BILLING.md`.

---

## 📋 KAKO POČETI SA PLAĆENIM DOPRINOSOM

### Korak 1️⃣: Provjerite BILLING.md
- Pročitajte sve cijene i usluge
- Odaberite tip doprinosa (Code Review, Bug Fix, Feature, itd.)
- Izračunajte očekivanu naknadu

### Korak 2️⃣: Otvorite GitHub Issue
```markdown
Title: [PLAĆENI] - Kratko Beskrivanje Zahtjeva
Labels: needs-payment, type:feature (ili type:bug)

## Opis
Detaljno opišite šta trebate.

## Očekivana Cijena
Prema BILLING.md: $XXX

## Payment Status
- [ ] Depozit 50% uplaćen
- [ ] Finalno plaćanje sprema
```

### Korak 3️⃣: Pošaljite Plaćanje
- Izračun će biti generiran automatski
- Odaberite metodu plaćanja (Stripe, PayPal, Blockchain, Bank)
- Pošaljite proof of payment sa issue-om

### Korak 4️⃣: Počinje Razvoj
- Nakon potvrde plaćanja - kreiram branch i počinjem rad
- Pravilan update-e putem commit-a
- Otverite PR kada je gotovo

### Korak 5️⃣: Code Review & Merge
- Izvrši se QA i testiranje
- Može biti tražene izmjene (bez dodatne naknade do 10% koda)
- Merge u main nakon aprovale

---

## 🏷️ GITHUB LABELS (OBAVEZNI)

Svaki issue MORA imati:

```
needs-payment       → Čeka plaćanje
payment-pending     → Plaćanje je u toku
payment-received    → Plaćanje je primit
in-progress         → Rad je u toku
under-review        → Čeka code review
ready-to-merge      → Spreman za merge
```

Primjer pull request-a:
```
Title: [PAID] Feature: New Dashboard Components
Labels: payment-received, in-progress, type:feature
```

---

## 💳 METODE PLAĆANJA

### 1. **Stripe** (Preporučeno)
```
Link: [stripe.com/pay/...]
Vrijeme: Instant
Valute: USD, EUR, GBP
```

### 2. **PayPal**
```
Email: [paypal email]
Vrijeme: 1-2 sata
Valute: Sve glavne
```

### 3. **Blockchain**
```
Ethereum: 0x...
Bitcoin: 1...
Vrijeme: 10-30 minuta
Fee: 0.5%
```

### 4. **Bank Transfer**
```
IBAN: [IBAN broj]
Swift: [SWIFT kod]
Vrijeme: 2-3 dana
Fee: Zavisi od banke
```

---

## ✅ CHECKLIST ZA PULL REQUEST

Pre nego što otvorite PR, provjerite:

- [ ] **Plaćanje je 100% gotovo** (Payment Status: PAID)
- [ ] Branch je kreiran iz `main`
- [ ] Kod je testiran lokalno
- [ ] Commit poruke su jasne i deskriptivne
- [ ] Nema merge conflicts-a
- [ ] Dokumentacija je ažurirana
- [ ] TypeScript/JavaScript je bez greške (`npm run lint`)
- [ ] Testovi prolaze (`npm test`)
- [ ] PR ima sve potrebne labels-e

---

## 🚫 NEĆE BITI PRIHVAĆENI

❌ Pull requests BEZ plaćanja  
❌ Issues bez `needs-payment` label-a  
❌ Kod sa greškama ili bez testova  
❌ Zahtjevi koji krše BILLING.md uslove  
❌ Neprofesionalne poruke ili format  

---

## 📊 PROCESS TIMELINE

| Korak | Vrijeme | Status |
|-------|---------|--------|
| Issue otvoren | 0h | `needs-payment` |
| Plaćanje primljeno | 0-48h | `payment-received` |
| Razvoj počinje | 48h-72h | `in-progress` |
| PR otvoren | Ovisno o uslozi | `under-review` |
| Code review | 24-48h | `under-review` |
| Approval & Merge | 24h | `ready-to-merge` |

---

## 📞 KONTAKT & SUPPORT

**Za pitanja o plaćanju:**
- 📧 Email: [vaš email]
- 💬 GitHub Issues: Tag `@billing-team`
- 📱 Discord: [Link]

**Za probleme sa Pull Request-om:**
- 📧 Odgovor na PR thread-u
- 💬 GitHub Discussions

---

## ⚖️ PRAVNA NAPOMENA

Svi doprinosi postaju vlasništvo **spaja86** i **AI-IQ-SUPER-PLATFORMA**.  
Nije dozvoljeno korišćenje koda na drugom mjestu bez dozvole.

---

**Verzija**: 1.0  
**Datum**: 2026-07-15  
**Status**: ✅ AKTIVNO
