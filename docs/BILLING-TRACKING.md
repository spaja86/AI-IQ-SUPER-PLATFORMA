# 💳 BILLING TRACKING — AI-IQ-SUPER-PLATFORMA

Dokument za praćenje troškova GitHub i Vercel naloga projekta AI-IQ-SUPER-PLATFORMA.

---

## 📌 Aktuelni Planovi

| Servis | Plan | Mesečni trošak | Status |
|--------|------|----------------|--------|
| GitHub | Free / Team | $0 – $4/user/mes | ✅ Aktivan |
| Vercel | Hobby / Pro | $0 – $20/mes/član | ✅ Aktivan |

> **Napomena:** Ažurirati tabelu kada se plan promeni.

---

## 📊 GitHub — Limiti i Praćenje

### Free Tier
| Resurs | Limit (Free) | Preporuka |
|--------|-------------|-----------|
| Actions minuti | 2,000 min/mes (public repo) | Optimizovati paths: filtere |
| Storage (Packages) | 500 MB | Postaviti `retention-days: 7` na artifacts |
| Seats | 1 owner | Koristiti Rulesets umesto Branch Protection |

### Team Plan ($4/user/mes)
- Protected branch rules na `main`
- Required reviewers (human-review agent policy)
- `.github/CODEOWNERS` enforcement

### Kada preći na Team Plan?
- Kada platforma ima ≥ 2 aktivna saradnika koji trebaju protected branch reviews
- Kada trebaju napredna branch protection pravila koja nisu dostupna na Free

### GitHub Advanced Security (opciono)
- Secret scanning: **besplatno** za public repo
- Za privatni repo: ~$49/committer/mes — razmotriti samo ako repo postane privatan
- Alternativa: integrisan `runtime-tools-secret_scanning` u Copilot Task Agent workflow

---

## 🚀 Vercel — Limiti i Praćenje

### Hobby Plan (besplatno)
| Resurs | Limit |
|--------|-------|
| Bandwidth | 100 GB/mes |
| Build minuti | 6,000/mes |
| Serverless Function execution | 100 GB-hrs/mes |
| Cron invokacije | 2 crons/projekt |
| Korisnici | 1 |

### Pro Plan ($20/mes/član)
- Neograničeni deploymenti
- 1 TB bandwidth
- Custom domains sa SSL
- Password protection za Preview deploymenti
- Više Cron Jobs (do 40/projekt)
- Više korisnika u timu

### Kada preći na Pro Plan?
- Kada mesečni bandwidth pređe 80 GB (80% free tier limita)
- Kada build minuti pređu 4,800/mes (80% free tier limita)
- Kada je potrebna password zaštita za Preview URL-ove
- Kada platforma ide u produkciju sa stvarnim korisnicima

### Enterprise Plan
- SLA, SSO, dedicated support
- Razmotriti kada platforma dostigne produkcioni saobraćaj na skali

---

## ⚡ Optimizacije za Smanjenje Troškova

### GitHub Actions
- `paths:` filteri na svim workflow-ima — pokretanje samo kada relevantne datoteke promene
- `concurrency:` grupe — otkazivanje prethodnog run-a na novi PR push
- `retention-days: 7` na artifact upload-ima umesto default 90 dana
- `actions/cache` sa npm cache strategijom za ubrzanje build-ova
- `workflow_dispatch` za heavy job-ove (nova-generacija, maksimus, them)

### Vercel
- `regions: ["fra1"]` u `vercel.json` — EU region, smanjuje cross-region invokacije
- Edge Functions za statičke/lightweight rute
- `outputFileTracingExcludes` u `next.config.ts` — smanjuje bundle veličinu
- Preview deployment samo za PR-ove sa specifičnim labelima
- Image Optimization samo za slike koje se menjaju

---

## 📅 Mesečni Budget Limiti

| Servis | Soft limit (alert) | Hard limit (action required) |
|--------|-------------------|------------------------------|
| GitHub Actions minuti | 1,600 min/mes | 2,000 min/mes |
| Vercel Bandwidth | 80 GB/mes | 100 GB/mes |
| Vercel Build minuti | 4,800 min/mes | 6,000 min/mes |

> Analytics-bot proverava mesečno trošenje i šalje alert kada se dostigne 80% limita.

---

## 👥 Linije Odgovornosti

| Akcija | Ko odobrava |
|--------|-------------|
| Upgrade GitHub → Team | @spaja86 |
| Upgrade Vercel → Pro | @spaja86 |
| Upgrade Vercel → Enterprise | @spaja86 + human-review agent |
| Dodavanje novog Vercel projekta | @spaja86 |
| Promena billing email-a | @spaja86 |

---

## 🔒 Sigurnosna Pravila za Naplatu

1. **Vercel i GitHub payment metode** — čuvati samo u account settings, nikada u Git repozitorijumu
2. **API ključevi za billing API-je** — koristiti GitHub Secrets i Vercel Environment Variables
3. **Deploy hook URL-ovi** — nikada u kodu, samo u Vercel projekt settings
4. **Fakture i finansijski podaci** — van repozitorijuma

---

## 📈 Istorijat Promena Plana

| Datum | Servis | Promena | Razlog | Odobrio |
|-------|--------|---------|--------|---------|
| 2026-08-14 | GitHub | Baseline dokumentacija | Inicijalna BILLING-TRACKING.md | @spaja86 |
| 2026-08-14 | Vercel | Baseline dokumentacija | Inicijalna BILLING-TRACKING.md | @spaja86 |

> Ažurirati ovu tabelu pri svakoj promeni plana ili billing konfiguracije.

---

## 🔗 Korisni Linkovi

- [GitHub Billing Settings](https://github.com/settings/billing)
- [GitHub Actions Usage](https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA/settings/billing)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Usage](https://vercel.com/account/usage)
- [GitHub Pricing](https://github.com/pricing)
- [Vercel Pricing](https://vercel.com/pricing)

---

_Poslednje ažuriranje: 2026-08-14 · Maintainer: @spaja86_
