# NOTIFIKACIJE — reorganizovana arhitektura

## Sažetak

Notifikacioni domen je reorganizovan tako da `/src/lib/notifications` bude jedini izvor istine za:

- tipove i statuse kanala
- korisničke preference i compliance pravila
- template registar
- alert pravila
- centralni notification service
- read-model API pregled

## Slojevi

1. **Domain** — `/src/lib/notifications/domain.ts`
2. **Orchestration** — `/src/lib/notifications/service.ts`
3. **Producers** — npr. `/src/app/api/stripe/webhook/route.ts`
4. **Persistence** — `user_notifications` sa proširenim `metadata`
5. **Read model** — `/src/app/api/notifications/*` i legacy pregled `/src/app/api/openai-platforma-notifikacije`

## Migracija

- DEPON-05 ostaje kompatibilni facade preko novog domena.
- Billing notifications koriste zajednički service sloj.
- Stripe webhook više ne upisuje direktno u `user_notifications`, već emituje zahtev kroz centralni servis.
- Legacy overview ruta ostaje dostupna, ali sada čita centralizovani inventar i arhitekturu.

## API površina

- `/api/notifications` — overview + dry-run/persisted dispatch entrypoint
- `/api/notifications/history` — read-only inventar tokova
- `/api/notifications/preferences` — preview default preference i compliance pravila
- `/api/notifications/health` — health/readiness pregled
- `/api/openai-platforma-notifikacije` — legacy pregled baziran na novom source-of-truth sloju

## Persistence model

Primarni zapis ostaje `user_notifications`, ali se u `metadata` standardizuju:

- `notificationId`
- `category`
- `priority`
- `requestedChannels`
- `allowedChannels`
- `skippedChannels`
- `attemptLog`
- `templateId`
- `templateVars`
- `sourceMetadata`

Ovim se dobija audit trag bez potrebe za trenutnom DB migracijom.
