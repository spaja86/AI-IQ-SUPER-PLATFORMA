# SPAJA Billing → AI IQ WORLD BANK: razvojna testna evidencija

Datum: 29. oktobar 2026. Status: **razvojni adapter, NO-GO za produkciju**.

Izvorni zahtev: povezati razvojne događaje SPAJA Billing sa proverljivom finansijskom evidencijom, uz duplikate, pristupne kontrole i očuvanje Stripe zaštita. Grana `codex/spaja-billing-world-bank-test-20261029` počinje od tačne revizije PR-a [#1377](https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA/pull/1377), `7a3ed6f0f4118ecfdd420c3657b44c0219110ac4`. Taj PR je i dalje draft, nije deo glavne grane.

## Šta je povezano i provereno

`SPAJA Billing testni događaj → autorizovani razvojni API → atomska SQLite evidencija → privatni AI IQ WORLD BANK pregled`.

| Integracija | Stanje |
|---|---|
| SPAJA Billing sintetički događaji → testna evidencija | Implementirano; stvarno izvršeni lokalni testovi upisa, čitanja, duplikata, konkurencije i oporavka |
| Postojeći World Bank demonstracioni modul | Ostaje `environment: simulation`, sada izričito `dataOrigin: static-fixtures`; KPI nisu rezultati stvarnih plaćanja |
| Postojeći Stripe webhook → ova evidencija | **Nije povezan**; nije preuzeta niti potvrđena nijedna stvarna/sandbox Stripe transakcija |
| Supabase → ova evidencija | Nije povezan; nijedna udaljena migracija nije primenjena |
| Bankarski transferi / settlement | Nisu implementirani ili uključeni |

Ovo nije potvrda da su sva SPAJA plaćanja povezana. Novi ulaz prima samo strogo definisane sintetičke događaje; Stripe envelope i `livemode: true` se odbijaju. Postojeći Stripe Checkout, webhook, fraud, SQL i lockfile ostaju neizmenjeni. Nema dodatnog upisa posle Stripe COMMIT-a niti promene njegovog ACK ponašanja.

## API i pristup

- `POST /api/dev/spaja-billing/world-bank`: poseban write token; upis jednog testnog događaja.
- `GET /api/dev/spaja-billing/world-bank?limit=100`: poseban read token; najviše 100 poslednjih događaja i 100 plaćanja. Ukupni brojači i zbirovi obuhvataju celu evidenciju; `truncated` označava skraćenu listu.
- Sve odgovore prati `Cache-Control: private, no-store`. Javni simulator nikada ne učitava privatnu evidenciju.
- Bez konfiguracije: 404. Produkcioni `NODE_ENV`: uvek 404, čak i uz uključenu zastavicu.
- Bez važećeg tokena: 401. Pogrešan opseg ili browser `Origin`: 403. Cookie, role, tenant, IP i Sites zaglavlja nisu izvor identiteta.
- Read i write tokeni su različiti nizovi od po 64 heksadecimalna znaka (32 slučajna bajta); poređenje koristi konstantno vreme preko SHA-256.
- Tenant dolazi samo iz serverske konfiguracije. Body/query ne mogu odabrati tenant. Jedan par tokena pripada jednom razvojnom tenant-u; ovo nije produkcioni IAM.
- Dozvoljen je samo JSON do 16 KiB; nepoznata polja, proizvoljni metapodaci, kartice i bankovni podaci se odbijaju. Greške skladišta ne otkrivaju putanje, token ili payload.

Serverska konfiguracija, **bez upisa tajni u Git ili `.env` datoteke**:

| Promenljiva | Vrednost |
|---|---|
| `NODE_ENV` | `development` ili `test` |
| `SPAJA_BILLING_TEST_ENABLED` | `true` za izričito lokalno testiranje; podrazumevano isključeno |
| `SPAJA_BILLING_TEST_DIRECTORY` | Apsolutna privatna POSIX putanja, van javnih/serviranih foldera; direktorijum 0700, baza 0600 |
| `SPAJA_BILLING_TEST_TENANT` | Serverski odabran razvojni identifikator; 1–64 slova, cifre, `_`, `-` |
| `SPAJA_BILLING_TEST_WRITE_TOKEN` | Nezavisan slučajan token za testni producent |
| `SPAJA_BILLING_TEST_READ_TOKEN` | Drugi nezavisan slučajan token za čitanje |

Tokeni ostaju serverske tajne, ne stavljati ih u browser. Ne koristiti postojeće Stripe/Supabase ključeve. Provereno na Linux-u, Node 24.22.1; koristi ugrađeni `node:sqlite`. Windows ACL i serverless/ephemeral filesystem nisu validirani; za Windows koristiti izolovan Linux/WSL razvojni proces. Ne pokretati na javnom hostingu. Ovaj endpoint ne dozvoljava produkcioni režim `next start`.

## Ugovor događaja

```json
{
  "schemaVersion": 1,
  "source": "spaja-billing-test",
  "livemode": false,
  "eventId": "test_evt_001",
  "paymentId": "test_pay_001",
  "customerId": "test_cus_001",
  "invoiceId": "test_inv_001",
  "type": "payment.succeeded",
  "amountMinor": 120000,
  "currency": "RSD",
  "occurredAt": "2026-10-29T15:00:00.000Z"
}
```

`120000` predstavlja 1.200,00 RSD. Podržane valute: RSD/EUR/USD, eksponent 2; JPY, eksponent 0. Iznosi su pozitivni bezbedni celi brojevi do 10^12. Nema kursa, konverzije ili sabiranja različitih valuta. Agregati iznosa su decimalni stringovi da JSON ne izgubi preciznost.

| Tip događaja | Dodatno obavezno polje | Efekat |
|---|---|---|
| `payment.succeeded` | — | Jedno testno knjiženje naplate sa dve suprotne stavke |
| `payment.failed` | `attemptId: test_attempt_...` | Evidencija neuspeha, bez novčanih stavki |
| `payment.reversed` | `reversalId: test_rev_...` | Delimično/potpuno storno, suprotne stavke; originalna naplata ostaje sačuvana |

Identifikatori su ograničeni i imaju `test_` prefikse. Za jednu fakturu postoji jedan kanonski `paymentId`; nove pokušaje naplate predstavljati kroz `attemptId`, ne kroz novu fakturu/plaćanje. Storna koriste isti payment/customer/invoice/currency, a `amountMinor` je iznos pojedinačnog storna.

## Integritet i redosled

- `BEGIN IMMEDIATE`, `synchronous=FULL`, jedinstvena ograničenja i jedan COMMIT povezuju payment stanje, effect, obe stavke i receipt. Greška bilo kog koraka poništava sve.
- `(tenant,eventId)` + hash kanonskog sadržaja: isti događaj je `duplicate_event`; promenjen sadržaj pod istim ID-em je 409 `event_conflict`.
- Poslovni efekat se zasebno deduplikuje: capture po payment-u, neuspeh po pokušaju, storno po reversal ID-u. Novi event ID ne može duplirati isti novčani efekat.
- Customer, invoice, valuta i iznos originalne naplate ne mogu se promeniti. Ista faktura ne može dobiti drugo plaćanje. Reversal ID ne može biti upotrebljen za drugu transakciju.
- Neuspeh posle uspeha/storna se čuva kao `ignored_stale`; ne vraća stanje unazad. Timestamp je audit podatak, nije dokaz redosleda.
- Storno pre potvrđene testne naplate vraća 409 `capture_required`, `retryable: true`; nema receipt-a niti prevremenog ACK-a. Producent prvo dostavlja capture, zatim ponavlja isti storno. Nema automatskog preuzimanja događaja od provajdera.
- Storno preko naplaćenog ostatka se odbija. Bilans dve stavke po valuti ostaje nula.
- Receipt sadrži stabilni `transactionId`. Kod ponovljene isporuke originalnog event-a receipt opisuje prvobitni upis; GET daje trenutno stanje plaćanja.
- Nema trajnog brojača svakog HTTP pokušaja: identična ponovna isporuka ostaje jedan događaj. Posebni poslovni duplikati čuvaju se sa `duplicate_effect`.

## Pokretanje i dokazi

```sh
npm ci --ignore-scripts
node --import tsx scripts/spaja-billing-world-bank-demo.mts
node --import tsx --test --test-reporter=tap src/tests/billing/world-bank-*.test.ts
node --import tsx --test --test-reporter=tap src/tests/billing/*.test.ts
node scripts/verify-stripe-isolated.mjs
```

Demo poziva stvarne GET/POST handlere u procesu, kreira nezavisne privremene tokene i privatnu bazu, pa ih uklanja. Ne otvara mrežni listener. Rezultat: 7 isporuka, 6 jedinstvenih događaja, 1 testno plaćanje, 6 stavki; 120000 RSD minor units naplaćeno i stornirano, neto 0.

| Provera | Rezultat 29. oktobra |
|---|---|
| Novi adapter/API/durability paket | **59 PASS, 0 FAIL** |
| Sve billing TypeScript datoteke | **69/69** Node test izveštaj: 59 novih testova + 10 postojećih suite datoteka; nije 69 ukupnih internih tvrdnji |
| Postojeći izolovani Stripe paket iz #1377 | **140 PASS, 0 FAIL**; stvarne rute, lokalni doubles |
| Postojeći SQL/recovery paket iz #1377 | **34 PASS, 0 FAIL**, PGlite 0.5.10; ne dokazuje native PostgreSQL konkurenciju |
| TypeScript aplikacije / ciljani ESLint | **PASS / PASS** |
| Novi SQLite paralelni procesi | Osam procesa, 1 primenjen događaj + 7 duplikata; 2 stavke |
| Prekid procesa pre/posle COMMIT-a | PASS: restart/replay bez delimičnog ili dvostrukog knjiženja |
| `npm run test:billing` | Blokiran postojećim `tsx` CLI IPC `listen EPERM`; isti TS testovi izvršeni Node import loader-om, Stripe paket zasebno |
| Dependency audit | 55 postojećih nalaza: 21 high, 19 moderate, 15 low, 0 critical; zavisnosti nisu menjane |
| Ceo app build / svi app testovi / smoke / predeploy | Nisu izvršeni; release nije odobren |

Izvršeni testovi su u `docs/evidence/world-bank-*`. SQL test alat instaliran je izdvojeno sa `@electric-sql/pglite@0.5.10`; nije dodat u projektni manifest ili lockfile. Testni procesi prekida/konkurencije ne nasleđuju kredencijale.

## Granice i dalji pregled

Nema stvarnog novca, isplate, bankovnog transfera, regulisane bankarske funkcije, automatskog deploymenta ili remote migracije. Lokalna SQLite konkurencija ne dokazuje produkcionu HA/replication/disk durability, visoko opterećenje ili native PostgreSQL ponašanje. Lokalni OS administrator i vlasnik write tokena imaju privilegije nad testnim podacima; ovo nije nezavisno zapečaćen finansijski audit. Nema automatskog čišćenja evidencije.

Za kasniju Stripe integraciju potreban je zaseban pregledan test-only adapter sa proverenim potpisom, customer/invoice vezama, test/live granicom i atomskim outbox/reconciliation ugovorom sa #1377. Iznose ne zaključivati iz naziva plana. Prvo potvrditi sandbox i realan transport u izolovanom okruženju. Produkcija ostaje NO-GO do tehničkog, bezbednosnog i potrebnog regulatornog odobrenja.

Rollback: ugasiti `SPAJA_BILLING_TEST_ENABLED`; privatnu testnu bazu sačuvati radi pregleda. Ove promene ne menjaju niti vraćaju ranjive verzije Stripe handlera.

## Odobrena objava razvojne grane

Posle isporuke konkretnog paketa i objašnjenja prepreke potpisivanja, vlasnik je 29. oktobra odgovorio: „Može sve.😁😁😁“. Ta potvrda se primenjuje kao ograničen izuzetak za nepotpisani razvojni commit i draft PR za ove izmene. [AGENTS.md](../AGENTS.md) i `.agent-config.json` nisu menjani; izuzetak ne odobrava merge, produkcioni deployment, plaćanja, udaljene migracije ili buduće nepotpisane promene.

Objava koristi početnu oznaku `[skip ci]` i trailer `skip-checks: true`. GitHub time preskače push/PR workflow-e; za Cloudflare Workers podršku potvrđuju [objava održavaoca od 4. maja 2026](https://github.com/cloudflare/workers-sdk/discussions/13216) i postojeći Cloudflare rezultat „Deployment skipped“ na roditeljskoj reviziji #1377. Vercel `git.deploymentEnabled` u `vercel.json` isključuje tačno ovu razvojnu granu. Ovo ne isključuje CI ili deployment drugih grana i ne daje dozvolu za buduće commit-e bez skip oznake.

Vercel konektor je potvrdio dva povezana projekta; detaljan pregled njihovih podešavanja vraća 403 za tim. Serverska podešavanja nisu menjana. Koristi se dokumentovana konfiguracija grane u repozitorijumu, a stvarni statusi novog commit-a proveravaju se nakon objave. Preskočene provere nisu uspešna udaljena CI validacija. Draft PR se bazira na razvojnoj grani #1377, ne na `main`; pre eventualnog spajanja potreban je pregled i zaseban release postupak.

OKRID: predlog `OKRID-2026-SPAJA-BILLING-001`, initiative, maintainer review pending. Downstream: nema promena ili runtime zavisnosti u IO-OPENUI-AO. Cilj: proverljiv testni tok i očuvane P0/FRAUD zaštite, bez uključivanja produkcije.

Reference: [Stripe webhook pravila](https://docs.stripe.com/webhooks), [Node 24 SQLite](https://nodejs.org/download/release/latest-v24.x/docs/api/sqlite.html), [AGENTS.md](../AGENTS.md), [PR #1377](https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA/pull/1377).
