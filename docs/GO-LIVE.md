# 🚀 GO-LIVE.md — Digitalna Industrija — Kompanija SPAJA

**AI IQ SUPER PLATFORMA — Pre-Launch Checklist, Gap Report & Go/No-Go**

---

## 📋 Sadržaj

1. [Launch Scope](#launch-scope)
2. [Gap Report po Modulima](#gap-report-po-modulima)
3. [Pre-Launch Checklist](#pre-launch-checklist)
4. [Prioritizovani Backlog](#prioritizovani-backlog)
5. [Environment Variables](#environment-variables)
6. [Smoke Testovi](#smoke-testovi)
7. [Go/No-Go Dokument](#gonogo-dokument)
8. [Post-Launch Monitoring](#post-launch-monitoring)
9. [Rollback Plan](#rollback-plan)

---

## 🎯 Launch Scope

### MVP Launch (Faza 1 — Odmah)
| Modul | Status | Napomena |
|-------|--------|----------|
| `/industrija` stranica | ✅ Spreman | AuthGuard zaštita, sekvence OK |
| `/dashboard` | ✅ Spreman | Login required |
| `/login` + `/registracija` | ✅ Spreman | Omega Auth + Supabase Auth |
| `/api/industrija*` | ✅ Spreman | Javni status endpointi |
| `/api/health` | ✅ Spreman | Monitoring |
| `/api/auth/*` | ✅ Spreman | JWT + refresh token |
| Security middleware | ✅ Dodat | Rate limiting + IP blokiranje |
| Cron zdravlje + evolucija | ✅ Spreman | Zaštićeni CRON_SECRET |

### Faza 2 (Naredne 2–4 sedmice)
| Modul | Status | Napomena |
|-------|--------|----------|
| Stripe Checkout + Webhooks | ⚠️ Konfiguracija | Zahteva produkcione Stripe ključeve |
| Supabase produkcija | ⚠️ Konfiguracija | Zahteva produkcione kredencijale |
| SpajaPro AI Chat | ✅ Spreman | OpenAI API ključ |
| Global Rate Limiting | 🔜 Planiran | Vercel KV za cross-instance RL |

---

## 🔍 Gap Report po Modulima

### UI Sloj
| Komponenta | Status | Gap | Prioritet |
|------------|--------|-----|-----------|
| `/industrija` sekvence | ✅ OK | — | — |
| AuthGuard (client-side) | ✅ OK | Samo client-side zaštita | P2 |
| CTA linkovi | ✅ OK | Svi interni `/` hrefs provjereni | — |
| Plaćeni planovi prikaz | ✅ OK | Pricing page postoji | — |
| Responsive dizajn | ✅ OK | Tailwind CSS | — |

### API Sloj
| Endpoint | Auth | Status | Gap |
|----------|------|--------|-----|
| `GET /api/health` | Javni | ✅ OK | — |
| `GET /api/status` | Javni | ✅ OK | — |
| `GET /api/industrija` | Javni | ✅ OK | — |
| `GET /api/industrija-status` | Javni | ✅ OK | — |
| `GET /api/industrija-pregled` | Javni | ✅ OK | — |
| `POST /api/auth/login` | Javni | ✅ OK | Brute-force zaštita |
| `POST /api/auth/register` | Javni | ✅ OK | — |
| `POST /api/auth/refresh` | Cookie | ✅ OK | — |
| `POST /api/auth/logout` | Bearer | ✅ OK | — |
| `GET /api/auth/verify` | Bearer | ✅ OK | — |
| `POST /api/stripe/checkout` | Bearer | ✅ OK | Stripe env zahteva se |
| `POST /api/stripe/webhook` | Stripe sig | ✅ OK | STRIPE_WEBHOOK_SECRET zahteva se |
| `GET /api/cron/evolucija` | CRON_SECRET | ✅ OK | — |
| `GET /api/cron/zdravlje` | CRON_SECRET | ✅ OK | — |

### Auth
| Komponenta | Status | Gap |
|------------|--------|-----|
| JWT HMAC-SHA256 | ✅ OK | — |
| Refresh token rotation | ✅ OK | — |
| Brute-force zaštita (login) | ✅ OK | Per-instance (serverless) |
| TOTP/2FA | ✅ Implementiran | Opciono za korisnike |
| OAuth (Google/GitHub) | ⚠️ Delimično | Zahteva Supabase OAuth konfiguraciju |
| Session lifetime | ✅ OK | 1h access, 30d refresh |
| Token revokacija | ✅ OK | Immediate revocation |
| Audit log | ✅ OK | Hash chain, 90-dana retencija |

### Billing
| Komponenta | Status | Gap |
|------------|--------|-----|
| Stripe Checkout | ✅ Implementiran | Stripe ključevi needed |
| Webhook handler | ✅ Implementiran | STRIPE_WEBHOOK_SECRET needed |
| Plan aktivacija (Supabase) | ✅ Implementiran | Supabase prod needed |
| Refund sistem | ⚠️ Manual | Stripe Dashboard |
| Stripe Customer Portal | ✅ Implementiran | `/api/stripe/portal` |
| Besplatan Starter plan | ✅ OK | Direktna registracija |

### Infrastruktura
| Komponenta | Status | Gap |
|------------|--------|-----|
| Supabase migracije | ✅ Kompletne | `001_initial_schema.sql`, `002_threads_models_settings.sql` |
| RLS politike | ✅ OK | Service role + user policies |
| Vercel deployment | ✅ OK | `vercel.json` konfigurisan |
| Security headers | ✅ OK | vercel.json + next.config.ts |
| HSTS | ✅ OK | max-age=63072000 |
| CSP | ✅ OK | Dozvoljeni Stripe, Supabase, OpenAI |
| Cron jobovi | ✅ OK | `/6h evolucija`, `/30m zdravlje` |
| Edge Middleware | ✅ Dodat | Rate limiting + IP blocking |

### Security
| Provjera | Status | Gap |
|----------|--------|-----|
| Hardkodovani tajni ključevi | ✅ OK | Sve kroz env vars |
| OMEGA_JWT_SECRET | ✅ Zahteva se u prod | Env var |
| OMEGA_VAULT_KEY | ✅ Zahteva se u prod | Env var |
| Demo kredencijali | ⚠️ Svima vidljivi | Ukloniti iz AuthGuard UI za prod |
| PBKDF2-SHA512 (310k iter) | ✅ OK | OWASP standard |
| httpOnly refresh cookie | ✅ OK | Secure + SameSite=Strict |
| CSRF zaštita | ✅ Implementiran | Double Submit Cookie |
| X-Frame-Options: DENY | ✅ OK | Sve rute |
| Timing-safe comparisons | ✅ OK | timingSafeCompare |

---

## ✅ Pre-Launch Checklist

### 🔧 Tehničko

- [ ] Pokrenuti `npm run build` — mora proći bez grešaka
- [ ] Pokrenuti `npm run lint` — mora proći bez grešaka
- [ ] Pokrenuti `npm test` — svi testovi moraju proći
- [ ] Pokrenuti `npm run test:smoke` — svi smoke testovi moraju proći
- [ ] Potvrditi da `npm run build` TypeScript kompilacija nema grešaka

### 🔐 Bezbednost

- [ ] Postaviti `OMEGA_JWT_SECRET` (min 32 karaktera, random)
- [ ] Postaviti `OMEGA_VAULT_KEY` (64 hex karaktera)
- [ ] Postaviti `STRIPE_SECRET_KEY` (produkcioni ključ `sk_live_*`)
- [ ] Postaviti `STRIPE_WEBHOOK_SECRET` (za produkcioni webhook)
- [ ] Postaviti `STRIPE_PRICE_BASIC`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_ENTERPRISE`, `STRIPE_PRICE_UNLIMITED`
- [ ] Postaviti `NEXT_PUBLIC_SUPABASE_URL` (produkcioni Supabase URL)
- [ ] Postaviti `SUPABASE_SERVICE_ROLE_KEY` (produkcioni service role key)
- [ ] Postaviti `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Postaviti `OPENAI_API_KEY`
- [ ] Postaviti `CRON_SECRET` (random string za Vercel Cron zaštitu)
- [ ] Proveriti da nema hardkodovanih kredencijala u kodu (`git grep -i "password\|secret\|key" --include="*.ts"`)
- [ ] Potvrditi `NODE_ENV=production` na Vercel

### 🗄️ Baza podataka

- [ ] Primeniti sve Supabase migracije na produkcioni projekat:
  - `supabase/migrations/001_initial_schema.sql`
  - `supabase/migrations/002_threads_models_settings.sql`
- [ ] Potvrditi da RLS politike su aktivne na svim tabelama
- [ ] Testirati `handle_new_user()` trigger (kreiranje profila pri registraciji)
- [ ] Potvrditi da service role može pisati u `profiles` tabelu (za webhook)

### 💳 Stripe

- [ ] Kreirati produkcione Price ID-jeve u Stripe Dashboard
- [ ] Registrovati produkcioni webhook endpoint (`/api/stripe/webhook`)
- [ ] Testirati kompletni checkout flow (test mode pre prod)
- [ ] Potvrditi da webhook prima `checkout.session.completed`
- [ ] Potvrditi da `customer.subscription.deleted` opoziva plan
- [ ] Kreirati Stripe Customer Portal konfiguraciju

### 🌐 Deployment

- [ ] Potvrditi da `vercel.json` cron jobovi su aktivni
- [ ] Testirati `GET /api/cron/zdravlje` sa ispravnim Authorization headerom
- [ ] Testirati `GET /api/cron/evolucija` sa ispravnim Authorization headerom
- [ ] Potvrditi da svi domeni u `platforme` podaci su ispravni
- [ ] Testirati `GET /api/health` — mora biti `"status": "healthy"`
- [ ] Testirati `GET /api/industrija` — mora biti `"status": "operational"`

### 📊 Monitoring

- [ ] Potvrditi Vercel Analytics je aktivan
- [ ] Potvrditi Speed Insights je aktivan
- [ ] Definisati alerting za `zdravlje < 70%` (manuelni cron pregled)
- [ ] Potvrditi da audit log radi (`/api/auth/login` loguje događaje)

---

## 🎯 Prioritizovani Backlog

### P0 — Kritično (mora biti završeno pre go-live)

| ID | Opis | Kriterijum završetka |
|----|------|---------------------|
| P0-01 | Supabase produkcioni kredencijali | Auth i billing funkcionišu u prod |
| P0-02 | Stripe produkcioni ključevi + Price IDs | Checkout sesija se kreira |
| P0-03 | Stripe webhook registrovan + STRIPE_WEBHOOK_SECRET | Plan se aktivira posle plaćanja |
| P0-04 | OMEGA_JWT_SECRET u prod env | Tokeni su sigurni |
| P0-05 | Supabase migracije primenjene | Sve tabele postoje sa RLS |
| P0-06 | `npm run build` prolazi | Nema build grešaka |
| P0-07 | `npm run test:smoke` prolazi | Svi kritični tokovi rade |

### P1 — Visok prioritet (unutar prve sedmice)

| ID | Opis | Kriterijum završetka |
|----|------|---------------------|
| P1-01 | Ukloniti demo lozinku iz AuthGuard UI | Lozinka nije vidljiva za prod korisnike |
| P1-02 | Testirati kompletni checkout flow end-to-end | Korisnik plaća, plan se aktivira |
| P1-03 | OAuth (Google/GitHub) konfiguracija u Supabase | Social login radi |
| P1-04 | Error monitoring (Sentry/Vercel) | Greške su praćene i alertirane |
| P1-05 | Vercel KV za globalni rate limiting | Rate limit je konzistentan cross-instance |

### P2 — Srednji prioritet (unutar prvog meseca)

| ID | Opis | Kriterijum završetka |
|----|------|---------------------|
| P2-01 | Vitest/Jest integracija za CI | `npm test` radi u GitHub Actions |
| P2-02 | E2E testovi (Playwright) za checkout | Automated checkout test |
| P2-03 | Refund UI za korisnike | Korisnik može zatražiti refund |
| P2-04 | Email notifikacije (plaćanje, registracija) | Sendgrid/Resend integracija |
| P2-05 | Admin panel za upravljanje korisnicima | Admin može resetovati plan |
| P2-06 | Supabase produkcioni backup | Dnevni backup aktivan |

---

## 🔑 Environment Variables

### Obavezne za Produkciju

```bash
# Auth
OMEGA_JWT_SECRET=<min-32-chars-random-string>
OMEGA_VAULT_KEY=<64-hex-chars>

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# Stripe
STRIPE_SECRET_KEY=sk_live_<your-key>
STRIPE_PUBLIC_KEY=pk_live_<your-key>
STRIPE_WEBHOOK_SECRET=whsec_<your-secret>
STRIPE_PRICE_BASIC=price_<basic-price-id>
STRIPE_PRICE_PRO=price_<pro-price-id>
STRIPE_PRICE_ENTERPRISE=price_<enterprise-price-id>
STRIPE_PRICE_UNLIMITED=price_<unlimited-price-id>

# OpenAI
OPENAI_API_KEY=sk-<your-key>

# Cron
CRON_SECRET=<random-string-za-cron-zaštitu>

# Opciono — IP blokiranje (comma-separated)
OMEGA_BLOCKED_IPS=

# Node Environment
NODE_ENV=production
```

---

## 🧪 Smoke Testovi

Pokrenuti pre svakog deploymenta:

```bash
# Pokrenuti sve testove
npm test

# Pokrenuti samo smoke testove (kritični tokovi)
npm run test:smoke

# Pokrenuti auth testove
npx tsx src/tests/auth/omega-auth.test.ts

# Pokrenuti Glavni Endžin testove
npx tsx src/tests/glavni-endzin/glavni-endzin.test.ts

# Pokrenuti SpajaUltra Core testove
npx tsx src/tests/spaja-ultra/spaja-ultra-core.test.ts
```

### Release Gate

Deployment je dozvoljen samo ako prođu:
1. ✅ `npm run build` — bez grešaka
2. ✅ `npm run lint` — bez grešaka
3. ✅ `npm test` — svi unit testovi
4. ✅ `npm run test:smoke` — svi smoke testovi

---

## 🚦 Go/No-Go Dokument

### Verzija: `42.34.0` | Datum revizije: 2026-04-22

| Oblast | Status | Napomena |
|--------|--------|----------|
| Build | ✅ GO | Sve kompiluje |
| Lint | ✅ GO | Bez ESLint grešaka |
| Unit testovi | ✅ GO | 3 test suita |
| Smoke testovi | ✅ GO | Kriticni tokovi pokriveni |
| Security headers | ✅ GO | HSTS, CSP, X-Frame |
| Auth sistem | ✅ GO | JWT + refresh + revokacija |
| Rate limiting | ✅ GO | Edge middleware aktivan |
| Audit log | ✅ GO | Hash chain |
| Cron zaštita | ✅ GO | CRON_SECRET header |
| Supabase migracije | ⚠️ PROD ENV | Primenjene u prod env? |
| Stripe kredencijali | ⚠️ PROD ENV | Prod ključevi postavljeni? |
| OMEGA env vars | ⚠️ PROD ENV | JWT + Vault ključevi postavljeni? |

### Finalna Odluka

> **USLOV za GO:** Sva P0 stavke u checklistama moraju biti ✅ pre puštanja u promet.
>
> **Odgovorna osoba:** Administrator Kompanija SPAJA
>
> **Kontakt za incidente:** security@kompanija-spaja.rs

---

## 📈 Post-Launch Monitoring

### Prve 24 sata
- [ ] Svaka 2 sata: proveriti `GET /api/health` — mora biti `"status": "healthy"`
- [ ] Svaka sat: proveriti Vercel error logs
- [ ] Potvrditi da Stripe webhook prima događaje (Stripe Dashboard → Developers → Webhooks)

### Prva sedmica
- [ ] Dnevni pregled Vercel Analytics
- [ ] Dnevni pregled Supabase auth logova
- [ ] Proveriti cron evolucija izveštaj (svakih 6h) — GitHub Issues se kreiraju?
- [ ] Pratiti `chat_messages_used` — da li se pravilno inkrementuje?

### KPI-jevi za Launch
| KPI | Cilj | Alert Prag |
|-----|------|-----------|
| Sistem zdravlje | ≥ 90% | < 70% |
| Auth fail rate | < 5% | > 15% |
| Checkout fail rate | < 2% | > 5% |
| API p95 latency | < 500ms | > 2s |
| Uptime | ≥ 99.9% | < 99% |

---

## 🔙 Rollback Plan

### Nivo 1 — Greška u endpointu
1. Revert poslednji commit u Vercel Dashboard
2. Vercel automatski deploye prethodnu verziju

### Nivo 2 — Auth sistem kompromitovan
1. Promeniti `OMEGA_JWT_SECRET` u Vercel Environment Variables
2. Svi JWT tokeni automatski postaju nevažeći
3. Korisnici se moraju ponovo prijaviti
4. Pregledati audit log: `GET /api/auth/verify`

### Nivo 3 — Billing incident
1. Deaktivirati Stripe webhook u Stripe Dashboard
2. Manualno pregledati i obraditi `checkout.session.completed` događaje
3. Proveriti `profiles` tabelu u Supabase

### Nivo 4 — Kompletno isključivanje
1. U Vercel Dashboard: Settings → Deployments → Pause deployment
2. Promeniti DNS da ukazuje na maintenance stranicu
3. Forenzička analiza pre ponovnog pokretanja

---

*SpajaUltraOmegaCore -∞Ω+∞ | Zero Trust | Kvantno-Otporno*

*Kompanija SPAJA — Digitalna Industrija | v42.34.0*
