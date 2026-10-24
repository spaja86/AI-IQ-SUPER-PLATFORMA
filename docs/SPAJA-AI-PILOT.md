# SPAJA AI — prvi ograničeni pilot

Status: draft za pregled; nije objavljeno niti uključeno u produkciji.
Osnova: `f6c2be5b25d5849193c9067b1f3f5aa67480d4ef`.

Razlog promene: korisnik je odobrio nastavak SPAJA AI plana i povezivanje
SpajaPRO razgovora sa modelom. Raniji Prompt App chat poziva katalog pravila.
Ova izmena dodaje izbor „Katalog i pravila” / „AI model — ograničeni pilot”.
Katalog ostaje podrazumevan; model koristi zasebnu rutu `/api/spaja-pro-ai`.

## Obuhvat

- Direktan OpenAI Responses API poziv na fiksni HTTPS origin, bez gateway-a.
- Serverska provera potpisa Omega ACCESS tokena, isteka, scope-a i trenutnog
  identiteta. Odbijaju se demo nalozi, refresh tokeni, opozvani tokeni i
  identiteti koji postoje samo u JWT fallback-u.
- Pristup isključivo eksplicitno dozvoljenim ID-jevima naloga. Email, uloga,
  model i korisnički ID poslati u telu nisu izvor autorizacije ili naplate.
- SQLite WAL/FULL evidencija sa atomskom rezervacijom pre poziva modela;
  `BEGIN IMMEDIATE` sprečava prekoračenje kvote između konekcija koje koriste
  istu datoteku. Bez fallback-a u memoriju kada baza nije dostupna.
- Jedinstven `requestId` po korisniku. Ponovljen ID vraća 409; odgovori se ne
  keširaju i drugi korisnik ne može da pročita tuđi odgovor preko ove rute.
- Prekid, timeout, greška i nepoznat ishod zadržavaju iskorišćenu kvotu. Nema
  automatskog ponavljanja poziva. STOP ne garantuje da provajder nije već
  obradio/naplatio prihvaćen zahtev.
- Frontend abort signal i provera aktivnog zahteva odbacuju zakasnele rezultate.
  Promena režima briše lokalnu istoriju razgovora kako se katalog i model ne bi
  mešali. Razgovor postoji samo u memoriji komponente.

## Granice ovog pilota

Ovo je ograničenje broja poziva i veličine ulaza/izlaza ove rute, **nije novčani
limit celog OpenAI projekta**. Druge postojeće rute, uključujući
`/api/openai-ai-stream`, `/api/claude-ai-stream`, raniji `/api/spaja-pro/chat`,
govor i embeddings, nisu migrirane na ovaj ledger. Pre javnog uključivanja
potrebni su njihov poseban pregled i zajednička politika potrošnje.

Omega vault i opozivi tokena i dalje su u memoriji procesa. Posle restarta ili
u worker-u bez tog identiteta novi pilot odbija zahtev. Za javni rad potrebni
su trajni identiteti/opozivi i potvrđen tok login → pilot na izabranom hostu.
Nema tvrdnje o horizontalnom skaliranju ili readiness-u produkcije.

Ledger mora biti na trajnom lokalnom disku jednog hosta. Sve instance koje
dele kvotu moraju koristiti istu datoteku; odvojeni diskovi znače odvojene
kvote. Baza ne sme biti unutar `public/`, izložena download rutom ili obrisana
tokom resetovanja kvote. Redovi se za ovaj mali pilot ne brišu automatski.
Potrebni su ograničene dozvole direktorijuma i zaštita rezervnih kopija.

Red sadrži ID korisnika i zahteva, UTC dan, hash ulaza, model, limit izlaza,
status i broj tokena. Ne sadrži API ključ, pristupni token, prompt ili odgovor.
Hash nije anonimizacija: pristup evidenciji i dalje treba ograničiti.

Model prima do 12 korisničkih/asistentskih poruka (ukupno do 16000 UTF-8
bajtova). Klijentske system/developer poruke nisu dozvoljene. Nema alata,
privatnih izvora, RAG-a, OFFICE integracije ili izvršavanja akcija. JSON odgovor
stiže po završetku poziva; streaming nije deo ovog sprinta.

## Konfiguracija posle pregleda

Kod podrazumevano odbija model pozive. Ne aktivira se samim dodavanjem ključa.

| Promenljiva | Uslov / vrednost |
|---|---|
| `OPENAI_API_KEY` | Tajna na serveru, nikada u Git-u ili browseru |
| `OMEGA_JWT_SECRET` | Zasebna jaka tajna, najmanje 32 znaka; razvojni fallback nije dozvoljen |
| `SPAJA_AI_PILOT_ENABLED` | Eksplicitno `true` |
| `SPAJA_AI_RUNTIME` | `persistent-node`; Node.js 24, trajni disk |
| `SPAJA_AI_MODEL` | Eksplicitan dostupan Responses model, bez podrazumevanog izbora |
| `SPAJA_AI_DB_PATH` | Apsolutna putanja do trajne SQLite datoteke; direktorijum unapred pripremljen |
| `SPAJA_AI_ALLOWED_USER_IDS` | Zarezima odvojeni potvrđeni Omega ID-jevi, bez `*` |
| `SPAJA_AI_USER_DAILY_REQUESTS` | Podrazumevano 10; ceo broj 1–100 |
| `SPAJA_AI_GLOBAL_DAILY_REQUESTS` | Podrazumevano 50; ceo broj 1–500 |
| `SPAJA_AI_MAX_OUTPUT_TOKENS` | Podrazumevano 512; ograničenje 16–2048 |

Dnevna kvota se određuje UTC danom početka rezervacije. Promena dana ne briše
idempotency evidenciju. Izlazni limit uključuje reasoning tokene; kratak ili
nepotpun odgovor nije dokaz da poziv nije trošio resurse.

## Provere

Node.js 24.22.1; zavisnosti iz postojećeg lockfile-a, bez izmena zavisnosti.

```sh
node --import tsx --test src/tests/api/spaja-pro-ai.test.ts
node --import tsx --test src/tests/auth/login-route-security.test.ts src/tests/api/spaja-pro-ai.test.ts
node --import tsx src/tests/smoke/smoke.test.ts
npx tsc --noEmit
npx eslint src/lib/spaja-ai src/app/api/spaja-pro-ai/route.ts src/components/SpajaProPromptApp.tsx src/tests/api/spaja-pro-ai.test.ts
```

- 27/27 novih testova; 56/56 sa postojećim login bezbednosnim regresijama.
- 43/43 postojećih smoke provera preko direktnog Node loader-a.
- TypeScript i lint izmenjenih fajlova: prolaze.
- Produkcioni Next.js build: prolazi, 1421/1421 statičkih stranica.
- Lokalni HTTP test nad produkcionim buildom sa test ključem: bez prijave 401;
  registracija 200; važeći token van allowlist-a 403. Identitet je prešao između
  ruta u ovom jednom lokalnom procesu. Nije test stvarnog modela ili hosta.
- Puni lint: 31 greška i 91 upozorenje. Svih 28 fajlova sa greškama neizmenjeno
  je u odnosu na osnovni commit; promene ovog pilota prolaze ciljani lint.
- Postojeći katalog route test: 5/6, nevalidan JSON vraća 500 umesto 4xx u
  neizmenjenoj `/api/spaja-pro-prompt-execute` ruti.
- Standardni `npm test` i `npm run test:smoke` ne stižu do testova: postojeći
  `tsx` CLI pokušava IPC kanal koji ovo okruženje odbija (`EPERM`). Direktni
  `node --import tsx` izvršava gore navedene iste relevantne datoteke.
- `predeploy:check`: izlazni kod 0, ali status `warning`, nepotpuna konfiguracija
  i postojeći neuspešni ugovori. Nije release odobrenje. Ova skripta ne učitava
  `.env.local`, pa izveštaj o env prisustvu nije provera tog fajla.
- `npm audit --omit=dev`: 28 nalaza (6 high, 15 moderate, 7 low); 0 critical.
  Lockfile nije menjan; ranjivosti nisu popravljene ovim sprintom.
- API autentifikacija novog ključa: GET `/v1/models`, HTTP 200. Nije izvršena
  plaćena generacija teksta. Model odgovori u regresijama su kontrolisani stubovi.
- Browser/telefon, produkcioni login tok, stvarna generacija, trajni hosting i
  udaljeni CI nisu potvrđeni ovim lokalnim testovima.

## Upravljanje promenom

OKRID: `OKRID-2026-SPAJA-AI-001` (initiative, active / release blocked).
Vlasnik: Nikola Spajić; obuhvat repozitorijuma: AI-IQ-SUPER-PLATFORMA.
Roadmap: SPAJA AI DOK/DUK/DAK/DIK, S01–S05 kao ograničeni pilot.
KPI: bez eksternog model poziva pre autentifikacije/allowlist-a/rezervacije;
dupli ID ne poziva provajdera ponovo; kvote opstaju posle ponovnog otvaranja
baze. Lokalno potvrđeno regresijama. Potpuna S02/S04 produkciona kontrola,
200 evaluacionih scenarija i 64 sistemske kontrole nisu ovim završeni.

Rollout: draft PR → ljudski/security pregled → trajni host i identiteti →
browser/telefon i kontrolisana generacija → posebno odobren pilot.
Rollback: isključiti `SPAJA_AI_PILOT_ENABLED`, zadržati ledger radi revizije;
katalog ostaje dostupan. Za povlačenje koda revert-ovati ovu promenu.
Downstream: nema izmene IO-OPENUI-AO, njegovih API ugovora ili deploy-a.
Bez automatskog merge-a ili deployment-a. Vercel nije korišćen u novom toku.

Zvanična dokumentacija konsultovana 2026-10-24:
- https://developers.openai.com/api/docs/guides/text
- https://developers.openai.com/api/docs/guides/migrate-to-responses
- https://developers.openai.com/api/docs/guides/token-counting
