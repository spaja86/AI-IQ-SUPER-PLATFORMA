# 🚀 Go-Live Checklist — AI IQ SUPER PLATFORMA
## Kompanija SPAJA — Digitalna Industrija

Ova checklista pokriva sve što mora biti potvrđeno **pre svakog deploymenta u produkciju**.  
Svaki tim/okruženje ima sopstvenu sekciju. Nijedan item ne sme ostati neoznačen.

---

## 🔐 A. Sigurnost i Auth

### Konfiguracija
- [ ] `OMEGA_JWT_SECRET` postavljen u Vercel env vars (min 32 karaktera, random)
- [ ] `CRON_SECRET` postavljen za sve cron endpoint-e
- [ ] `OMEGA_BLOCKED_IPS` ažuriran sa poznatim lošim IP adresama (opciono)
- [ ] Rate limiting je aktivan: testirati `GET /api/health` 250+ puta u minutu → 429

### Stripe
- [ ] `STRIPE_SECRET_KEY` je **produkcijski** ključ (počinje sa `sk_live_`)
- [ ] `STRIPE_PUBLIC_KEY` je **produkcijski** ključ (počinje sa `pk_live_`)
- [ ] `STRIPE_WEBHOOK_SECRET` postavljen za produkcijski webhook endpoint
- [ ] Webhook endpoint `https://DOMEN/api/stripe/webhook` registrovan u Stripe Dashboard
- [ ] Webhook slušni događaji: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- [ ] Stripe planovi (`price_*` ID-jevi) postavljeni u env vars i konzistentni sa `PLANOVI` u `stripe/config.ts`

### Supabase
- [ ] `NEXT_PUBLIC_SUPABASE_URL` postavljen
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` postavljen
- [ ] `SUPABASE_SERVICE_ROLE_KEY` postavljen (tajni — nikad izlagati klijentu)
- [ ] Sve 3 migracije primenjene: `001_initial_schema.sql`, `002_threads_models_settings.sql`, `003_audit_evolution.sql`
- [ ] RLS politike verifikovane: testirati da korisnik A ne može čitati profil korisnika B
- [ ] Trigger `on_auth_user_created` aktivan (testirati registraciju)

### OpenAI
- [ ] `OPENAI_API_KEY` postavljen
- [ ] API ključ testiran: `curl https://api.openai.com/v1/models -H "Authorization: Bearer $KEY"` → 200

---

## 🌐 B. Vercel Deploy

### Domen i DNS
- [ ] Produkcijski domen je konfigurisan u Vercel
- [ ] SSL sertifikat aktivan (Vercel automatski — proveriti zeleni katanac)
- [ ] DNS propagacija kompletirana (A/CNAME rekord) — wait 24h posle promene

### Vercel Env Vars
- [ ] Sve env vars postavljene za `Production` okruženje (ne samo `Development`)
- [ ] Verifikovati da nema `_placeholder` vrednosti u produkcijskim env vars
- [ ] `NODE_ENV` = `production` (automatski od Vercel-a)
- [ ] `NEXT_PUBLIC_*` varijable su ispravno prefiksovane

### Vercel Cron
- [ ] `vercel.json` cron konfiguracija aktivna:
  - `GET /api/cron/zdravlje` — svakih 30 minuta
  - `GET /api/cron/evolucija` — svakih 6 sati
- [ ] Cron jobovi se pojavljuju u Vercel Dashboard → Cron Jobs tabeli
- [ ] Ručno testiranje cron endpoint-a sa `CRON_SECRET` headerom → 200

### KV (opciono ali preporučeno za rate limiting)
- [ ] Vercel KV baza kreirana u Dashboard
- [ ] `VERCEL_KV_REST_API_URL` i `VERCEL_KV_REST_API_TOKEN` postavljeni
- [ ] `isKVConfigured()` vraća `true` u health check endpoint-u

---

## 🧪 C. Testovi i Quality Gates

### Build
- [ ] `npm run build` prolazi bez grešaka
- [ ] TypeScript: `npx tsc --noEmit` — nema novih grešaka (od onih koje su bile pre deploymenta)
- [ ] ESLint: `npm run lint` prolazi

### Testovi
- [ ] `npm test` prolazi:
  - `omega-auth.test.ts` — auth unit testovi
  - `spaja-ultra-core.test.ts` — SPAJA core testovi
  - `glavni-endzin.test.ts` — motor testovi
  - `api-contracts.test.ts` — API contract testovi
- [ ] `npm run test:smoke` prolazi:
  - `smoke.test.ts` — smoke testovi

### Ručno testiranje kritičnih tokova
- [ ] **Registracija**: `POST /api/auth/register` sa validnim kredencijalima → 200 + token
- [ ] **Login**: `POST /api/auth/login` sa demo@spaja.ai / Demo2024! → 200 + token
- [ ] **Auth Guard**: pristup `/dashboard` bez tokena → redirect na login
- [ ] **Checkout**: pokrenuti checkout za Basic plan → redirect na Stripe
- [ ] **Health**: `GET /api/health` → 200 + zdravlje > 80%
- [ ] **Status**: `GET /api/status` → 200 + verzija
- [ ] **Rate Limit**: 250+ zahteva u minutu → 429 Too Many Requests

---

## 📊 D. Observability i Monitoring

### Logging
- [ ] Vercel Logs prikazuju strukturirani JSON u produkciji
- [ ] Greške se pojavljuju u Vercel Log Drains (ako konfigurisan)
- [ ] Nema `console.log` sa osetljivim podacima (ključevi, lozinke, tokeni)

### Health Dashboard
- [ ] `GET /api/health` vraća `zdravlje >= 80`
- [ ] `GET /api/status` vraća konzistentne metrike sa `src/lib/constants.ts`
- [ ] Vercel Analytics aktivan (`@vercel/analytics` integrisan)
- [ ] Speed Insights aktivan (`@vercel/speed-insights` integrisan)

### Alarmi
- [ ] Postaviti Vercel Alert za 5xx error rate > 1% tokom 5 minuta
- [ ] Postaviti Vercel Alert za p95 latencija > 3s
- [ ] Stripe Dashboard: alarm za neuspešne webhooks

---

## 💾 E. Podaci i Backup

### Supabase
- [ ] Point-in-time recovery (PITR) aktivan za produkcijsku bazu
- [ ] Backup politika dokumentovana (Supabase automatski backup — proveriti retention period)
- [ ] RLS politike testovane sa production data
- [ ] `audit_events` tabela prima unose (testirati login event)

### Data Retention
- [ ] Health snapshots: `cleanup_old_health_snapshots()` zakazan (ako nije cron)
- [ ] Audit log retention: 90 dana (konfigurisano u `omega-audit.ts`)
- [ ] Chat istorija: politika retencije dokumentovana

---

## 🔁 F. Rollback Plan

### Pre svakog deploymenta
1. Napraviti Vercel Preview deployment i testirati sve kritične tokove
2. Zabележiti trenutnu verziju (git tag ili sha)
3. Proveriti Supabase backup pre migracija

### Ako nešto pođe naopako
1. `vercel rollback` na prethodni deployment
2. Ako su migracije problema: kontaktirati Supabase podršku za PITR
3. Revert Stripe webhook konfiguracije na prethodni endpoint

---

## 📋 G. Dokumentacija i Komunikacija

- [ ] CHANGELOG.md ažuriran sa svim promenama u verziji
- [ ] API dokumentacija konzistentna sa implementacijom
- [ ] Interni tim obavešten o svim novim env vars koji moraju biti postavljeni
- [ ] Korisnici obavešteni o downtime-u (ako je planiran)

---

## ✅ Final Sign-Off

| Sekcija | Odgovoran | Datum | Status |
|---------|-----------|-------|--------|
| A. Sigurnost i Auth | | | ⬜ |
| B. Vercel Deploy | | | ⬜ |
| C. Testovi | | | ⬜ |
| D. Observability | | | ⬜ |
| E. Podaci | | | ⬜ |
| F. Rollback Plan | | | ⬜ |
| G. Dokumentacija | | | ⬜ |

**Deploy se sme pokrenuti tek kada su SVE sekcije ✅.**

---

*Poslednje ažuriranje: April 2026 | Verzija: 42.36.0 | Kompanija SPAJA — Digitalna Industrija*
