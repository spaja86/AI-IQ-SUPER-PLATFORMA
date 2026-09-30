# SPAJA SERVER / SPAJA BAZA v1

## Namena

SPAJA SERVER je aplikacioni sloj na Vercel Functions. SPAJA BAZA je kontrolni sloj koji povezuje namenski storage, cache i sistem zapisa. V1 ne uvodi novu bazu, ne prenosi postojeće podatke i ne obećava neograničen kapacitet ili potpunu kompatibilnost sa svakom bazom.

## Arhitektura

1. **Edge i API granica** — Vercel Routing Middleware, Vercel Functions i autentikacija na ruti. Svaki zahtev nosi tenant i korisnički identitet; autorizacija se proverava pre pristupa podacima.
2. **Sistem zapisa** — postojeći Supabase/Postgres ostaje izvor istine za transakcione podatke i relacije.
3. **Objektni podaci** — Vercel Blob je predviđen za fajlove; metapodaci i ACL ostaju u sistemu zapisa.
4. **Cache, rate limit i poslovi** — Upstash Redis preko Marketplace integracije služi za prolazne podatke, ograničenje zahteva i redove. Ne koristi se kao sistem zapisa.
5. **Observability i skaliranje** — Vercel observability prati zahteve, greške, latenciju i trošak. Skaliranje se aktivira na merenim pragovima, ne na pretpostavci neograničenosti.

## V1 ugovor

`GET /api/spaja-infrastructure/health` javno izlaže samo status konfiguracije adaptera, bez vrednosti kredencijala. Adapteri su:

- `supabase-postgres`: transakcije i pretraga
- `vercel-blob`: objektni storage
- `upstash-redis`: cache, rate limit i redovi

Statusi su `READY`, `PARTIAL` i `UNCONFIGURED`. Nijedna promena u v1 ne dodaje kredencijale, migracije ili korisničke podatke.

## Bezbednost i pouzdanost

- Tenant izolacija i autorizacija ostaju u aplikacionom sloju.
- Cross-store tokovi moraju biti idempotentni, sa retry politikom i audit događajem.
- Cache se može izbrisati; poslovni podaci se uvek čitaju iz sistema zapisa.
- Svaki novi adapter zahteva eksplicitne limite, retention politiku, backup/restore proceduru i troškovni prag.

## Sledeće faze

1. Konfigurisati Vercel Blob i Upstash Redis kao Marketplace integracije.
2. Uvesti tenant-aware repository interfejse i audit trail.
3. Dodati durable queue workere za asinhrone cross-store poslove.
4. Postaviti dashboard alarme za error rate, p95 latenciju, cache hit-rate, storage rast i trošak.
