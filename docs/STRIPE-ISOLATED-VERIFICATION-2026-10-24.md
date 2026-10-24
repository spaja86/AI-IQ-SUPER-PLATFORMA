# SPAJA Stripe Checkout — izolovana provera, 24. oktobar 2026.

**Rezultat: NO-GO za produkcionu naplatu.** Od 65 izvršenih lokalnih provera, 45 prolazi, a 20 bezbednosnih očekivanja pada. To su pojedinačni test slučajevi, ne procenat završenosti sistema i ne 20 nezavisnih uzroka. Nijedna Checkout sesija, pretplata ili uplata nije kreirana preko stvarnog Stripe API-ja.

Izvorna revizija: `f6c2be5b25d5849193c9067b1f3f5aa67480d4ef` (`main`). Razlog rada: zahtev vlasnika da se postojeći Checkout proveri bez stvarne uplate, uz regresije za privremene anti-fraud vrednosti. Izmene ovog PR-a su izvršivi testovi, runner, komande i dokazi; ispravke aplikacionih ruta ostaju naredni razvojni korak.

- [Mašinski izveštaj i SHA-256 izvornog koda](evidence/stripe-isolated-2026-10-24.json)
- [Potpun TAP izlaz strogog izvršavanja](evidence/stripe-isolated-2026-10-24.tap)
- [Testovi](../src/tests/billing/stripe-isolated.test.mjs)
- [Izolovani adapteri](../src/tests/billing/fixtures/stripe-isolated-harness.mjs)

## Šta je stvarno izvršeno

Testovi učitavaju i transpajliraju postojeće `POST` handlere iz `src/app/api/stripe/checkout/route.ts` i `src/app/api/stripe/webhook/route.ts`, zajedno sa stvarnim validatorima, auth adapterom, rate limiterom, feature flagovima, idempotency helperima, tracingom, audit hashom i circuit breakerima. Koriste stvarne NextRequest/NextResponse objekte i Stripe SDK 22.1.0 za generisanje i verifikaciju lokalnih HMAC potpisa. Node: 24.22.1; TypeScript: 5.9.3. SDK i lockfile su zadržani radi provere postojeće implementacije.

Stripe HTTP, Supabase upiti i odgovori identity providera su kontrolisane memorijske simulacije. Simulirani Stripe primenjuje dokumentovano pravilo „isti ključ mora imati iste parametre”; taj rezultat nije dokaz poziva Stripe servisu. Supabase simulator predstavlja oblik odgovora `{ data, error }`, jedinstveni `event_id`, profil, audit i DLQ. Nije PostgreSQL i ne dokazuje SQL migracije, transakcije, RLS, trajnost, konkurentnost više procesa ili stvarnu jedinstvenost u bazi. `processed_at` se pri simuliranom INSERT-u postavlja na vreme obrade; nalaz WEBHOOK-08 važi za tu eksplicitnu pretpostavku, koju treba proveriti u stvarnoj šemi.

Runner prosleđuje test procesu samo kontrolisane promenljive, bez kredencijala ili `NODE_OPTIONS`. Kod ruta dobija zaseban skup sintetičkih vrednosti. Mrežni pozivi su blokirani na dostupnim granicama; nepoznati importi i DB tabele se odbijaju. Svaki scenario proverava da nije bilo pokušaja mrežnog poziva. Ovo je izolacija pouzdanog test koda, ne bezbednosni sandbox za proizvoljan neprijateljski JavaScript.

Nisu provereni HTTP server/middleware, browser Checkout, stvarna Supabase/Omega kriptografska validacija identiteta, distribuirani KV, Stripe isporuka webhooka ili produkciona infrastruktura. Auth nalazi potvrđuju ponašanje rute i adaptera kada provider prihvati/odbije token. Raniji `autofinish` testovi ruta proveravaju uglavnom prisustvo fajla/metode, a neki billing testovi koriste kopije logike; njihovo prolazak nije zamena za ove provere handlera.

## Konfiguracioni preduslovi

Provereno je samo prisustvo promenljivih u dostupnom izvršnom okruženju, bez ispisa vrednosti i bez čitanja udaljenih secret store-ova.

| Preduslov | Zatečeno / značenje |
|---|---|
| `STRIPE_SECRET_KEY` | Nije prisutan. Nije proveren stvarni test API pristup. |
| `STRIPE_PRICE_BASIC/PRO/ENTERPRISE/UNLIMITED` | Nijedan nije prisutan. Ciljni sandbox mora imati odgovarajuće aktivne recurring EUR cene. |
| `STRIPE_WEBHOOK_SECRET` | Nije prisutan. Sintetički potpis dokazuje lokalnu verifikaciju, ne vlasništvo nad udaljenim endpointom. |
| `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Nisu prisutni. Server ih zahteva. Potrebna je posebna test baza sa profilima, auditom, evidencijom webhooka i DLQ. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Nije prisutan. Za puni korisnički/browser auth tok treba proveriti i javnu konfiguraciju. |
| `NEXT_PUBLIC_SITE_URL` | Nije prisutan; aplikacija inače koristi javni podrazumevani BASE_URL. Harness koristi isključivo `http://localhost:3000`. |
| KV konfiguracija koju postojeći limiter čita | Nije prisutna. Proveren je samo memorijski limiter u jednom procesu. Ovaj rad ne uvodi hosting servis. |
| Tax | Checkout već šalje `automatic_tax.enabled=true`; registracije i podešavanja nisu potvrđeni. Ne tumačiti uspešan mock kao poresku spremnost. |
| Stripe API verzija / webhook šema | Proveren je zaključani SDK 22.1.0; kompatibilnost stvarnog naloga/endpointa nije potvrđena. |

Povezani Stripe alat je vratio dva test konteksta (`livemode=false`), nazvana **Default sandbox** i **IVANIKIVA**. Nijedan naziv ne identifikuje jasno Digitalna Industrija/Kompanija SPAJA. Nije biran nalog, menjana podešavanja niti izvršavana account-specific billing operacija. Sama lista nije dokaz da aplikacione cene, webhook i test baza pripadaju istom poslovnom nalogu.

**Stvarno potvrđene Stripe sandbox billing API operacije: 0. Stvarne uplate: 0.** Poslovno odobrenje za Srbiju nije predmet ovog tehničkog dokaza.

## Zaštite koje su prošle lokalnu proveru

| Oblast | Potvrđeno ponašanje | Granica dokaza |
|---|---|---|
| Autentifikacija | Nedostajući/pogrešan format i token odbijen od providera daju 401; identitet dolazi iz auth adaptera, ne iz tela zahteva. | Provider odgovori simulirani; JWT kriptografija nije potvrđena. |
| Payload i plan | Neispravan JSON, null/niz, nedostajući/pogrešan plan, besplatan plan i nedostajući Price odbijaju se. | Aktivnost/iznos/recurring svojstva stvarnog Price-a nisu potvrđena. |
| Kontrole naplate | Read-only i kill switch blokiraju; cooldown vraća 429; limit tri otvorene sesije i valutno neslaganje blokiraju. | Session list i Price API simulirani. |
| Rate limiting | Šesti zahtev korisnika i 21. zahtev sa iste prosleđene IP adrese blokiraju se. | Jedan proces; pouzdanost proxy zaglavlja i distribuirani store nisu provereni. |
| Kreiranje sesije | Prosleđuju se korisnik, serverom izabran Price, `subscription` mode i namespaced ključ; sam Checkout ne aktivira profil. | HTTP odgovor je simuliran. |
| Idempotentnost | Isti ključ i **isti request ID** koriste jednu simuliranu sesiju, i kod dva paralelna poziva. | Uobičajeni retry sa novim request ID-jem pada (CHECKOUT-01). |
| Circuit breaker | Tri izuzetka session create otvaraju circuit; sledeći zahtev dobija 503; nedostajući URL ne aktivira nalog. | Samo create korak, ne svi Stripe pozivi. |
| Webhook potpis | Stvarni Stripe SDK odbija pogrešnu tajnu, izmenjeno sirovo telo i zastareo potpis; tolerance=0 vraća bezbedan podrazumevani prag. | Potpis generisan lokalno sintetičkom tajnom. |
| Schema/whitelist | Nevažeći Checkout mode dobija 422; nepoznati tip se potvrđuje bez billing upisa. | Validator ne proverava sve poslovne uslove. |
| Aktivacija | Potpisani fixture događaj za paid subscription postavlja plan, subscription ID, limit i audit. | Ne dokazuje da su negativni slučajevi bezbedni. |
| Duplikati | Pet istovremenih dostava istog event ID-ja daje jedan upis profila i četiri duplicate odgovora. | Simulirani UNIQUE; greške upisa i drugi event ID nisu pokriveni tom zaštitom. |
| Neuspešna naplata | Treća prijavljena invoice greška postavlja `past_due` i `billing_locked`. | Checkout ne sprovodi taj lock (CHECKOUT-06). |
| Retry helper | Bačene privremene greške se ponavljaju. | Razrešeni Supabase `{error}` se ne ponavljaju (WEBHOOK-05). |

## Reprodukovane blokade i naredne ispravke

P0 = ispraviti pre bilo kakve produkcione aktivacije; P1 = važna pouzdanost/zaštita; P2 = kontrolisana dijagnostika. Prioritet se odnosi na uslovnu upotrebu sistema za naplatu, ne na dokaz da je neko već pogođen.

| ID | Prioritet | Lokalni rezultat i predložena ispravka |
|---|---|---|
| FRAUD-01 | P1 | Pet pokušaja i dalje šalje `checkoutAttemptsLastHour=1`. Uvesti stvarni atomski brojač sa vremenskim prozorom. |
| FRAUD-02 | P1 | Pet IP adresa i dalje šalje `distinctIpsLast24h=1`. Evidentirati jedinstvene pouzdane IP signale uz TTL i jasno pravilo proxy poverenja. |
| FRAUD-03 | P1 | Nov nalog sa pet neuspeha i pet pokušaja sa pet IP adresa dobija 200 umesto 403. Sam assessor za te stvarne ulaze daje 95; sa placeholderima može dobiti najviše 35, ispod praga 60. |
| CHECKOUT-01 | P1 | Isti idempotency ključ uz automatski nov `metadata.request_id` daje simulirani `idempotency_error` i HTTP 500. Poslovni parametri retry-a moraju ostati stabilni; tracing odvojiti ili trajno vezati za operaciju. |
| CHECKOUT-02 | P1 | Dva dozvoljena ključa dužine 255 koji se razlikuju na kraju postaju isti posle prefiksa i `.slice(0,255)`. Koristiti hash celog namespaced identifikatora ili validirati konačnu dužinu. |
| CHECKOUT-03 | P1 | Neispravan ključ za novog kupca vraća 400 tek posle customer create i upisa profila. Validirati pre svih promena. |
| CHECKOUT-04 | P0 | Greška čitanja profila ne prekida Checkout; kreira se novi kupac/sesija. Razlikovati odsustvo zapisa od greške i za grešku zaustaviti tok. |
| CHECKOUT-05 | P0 | Greška povezivanja customer ID-ja sa profilom se ignoriše, a sesija se ipak kreira. Zahtevati potvrđen upis i idempotentno kreiranje kupca. |
| CHECKOUT-06 | P1 | `billing_locked=true` i broj neuspeha ne sprečavaju Checkout. Učitati i sprovesti lock politiku. |
| WEBHOOK-01 | P0 | `checkout.session.completed` sa `payment_status=unpaid` aktivira fixture profil. Aktivaciju vezati za potvrđeno plaćanje/izričitu politiku trial/free slučajeva. |
| WEBHOOK-02 | P0 | `mode=payment` i bez subscription ID-ja takođe aktiviraju pretplatu. Zahtevati odgovarajući mode, vezu korisnik/customer i stvarnu pretplatu. |
| WEBHOOK-03 | P0 | Nepoznat metadata plan dovodi do pokušaja upisa, uz fallback limit 100. Odbiti nepoznat plan i proveriti mapiranje Price-a. Stvarna baza može odbiti taj upis; to nije provereno. |
| WEBHOOK-04 | P0 | Neuspešan INSERT evidencije događaja dozvoljava dalji upis profila. Nedostupnost dedupe store-a mora zaustaviti obradu i ostaviti retry mogućim. |
| WEBHOOK-05 | P0 | Supabase `{error:{code:'08006'}}` vraća se kao uspešno razrešeno obećanje, pa nema ponavljanja; webhook odgovara 200. Proveravati rezultat svakog kritičnog upisa. |
| WEBHOOK-06 | P0 | Event ID je evidentiran pre neuspelog upisa; kasnija dostava se odbaci kao duplikat i profil ostaje neaktivan. Uvesti trajno processing/completed/failed stanje i atomsko završavanje. |
| WEBHOOK-07 | P0 | Greška handlera i neuspeh DLQ-a zajedno ipak daju 200/queued_for_retry, bez sačuvanog posla. Potvrditi trajno čuvanje ili vratiti retryable 5xx. |
| WEBHOOK-08 | P1 | Validan prvi događaj kreiran pre 60 s odbacuje se posle INSERT-a sa sadašnjim `processed_at`. Ordering upit gleda poslednju obradu celog tipa, uključujući upravo ubačen red. Koristiti izvorni event timestamp i stanje konkretnog customer/subscription objekta. |
| WEBHOOK-09 | P1 | Drugi event ID za isti Checkout ponavlja aktivaciju i resetuje potrošnju 17→0. Dodati idempotentnost poslovnog efekta po session/subscription objektu. |
| WEBHOOK-10 | P1 | `checkout.session.async_payment_succeeded` se ignoriše i ne aktivira paid fixture pretplatu. Dodati odgovarajući asinhroni fulfillment uz iste provere. |
| WEBHOOK-11 | P2 | Bez Stripe API ključa webhook baca izuzetak izvan kontrolisane konfiguracione grane. Vratiti kontrolisan 5xx bez otkrivanja tajni. |

`failed_payment_count` takođe nije dokaz evidencije u poslednjih 30 dana: Checkout ga čita kao broj, a webhook inkrementira i resetuje bez vremenskog prozora. To je nalaz pregleda izvora, ne zaseban provereni test u zbiru 65. Nedostaje i potvrda pouzdane IP adrese. Nijedan od tih nedostataka ne rešava se promenom placeholdera na drugi fiksni broj.

## Reprodukcija i dodatna validacija

Posle instalacije zavisnosti iz lockfile-a:

```sh
npm run test:stripe:isolated
# Namerno exit 1: 45 pass, 20 fail, 0 skipped, 0 TODO.

node scripts/verify-stripe-isolated.mjs --report docs/evidence/stripe-isolated-2026-10-24.json
# Isto strogo izvršavanje; zapisuje JSON i kompletan TAP.

npm run test:stripe:characterize
# Svih 65 slučajeva se izvršava. 45 pass + 20 executed TODO.
# Exit 0 ovde znači da su poznata ograničenja označena, NE spremnost naplate.
```

`test:stripe:readiness` je alias stroge komande. Standardni `test:billing` skuplja samo `.test.ts/.mts/.tsx`, zato ne uključuje ovaj `.mjs` paket automatski. Nije tvrđeno da je novi gate već obavezan na GitHub-u. Direktno `node --test ...stripe-isolated.test.mjs` podrazumevano koristi executed TODO; za odluku o spremnosti koristiti strogi runner. Popravka treba da ukloni oznaku poznatog nedostatka uz očuvanje pozitivnog bezbednosnog očekivanja, ne da obrne očekivanje tako da ranjivo ponašanje prolazi.

Dodatno izvršeno:

- ESLint novih `.mjs` fajlova: prolaz, bez upozorenja.
- `tsc --noEmit --incremental false`: prolaz. `.mjs` harness nije statički TypeScript verifikovan; izvršen je u testovima i lintovan.
- `node --import tsx src/tests/billing/billing-hardening.test.ts`: 9/9.
- `node --import tsx src/tests/billing/billing-orchestration.test.ts`: 27/27.
- Uobičajeni `npm run test:billing` nije mogao da pokrene tsx CLI zbog lokalnog `listen EPERM` na IPC socketu; gore navedena dva relevantna fajla izvršena su kroz Node import loader bez tog CLI servera.
- Build, kompletan monorepo test paket, browser smoke, predeploy i online dependency audit nisu izvršeni. Ovaj PR ne menja aplikacioni runtime niti zavisnosti i nije release kandidat. Udaljeni CI nije potvrđen ovim lokalnim dokazima.

## Uslovi za kasniju sandbox integraciju

1. Potvrditi koji povezani test nalog pripada SPAJA projektu; zabeležiti account ID interno. Obezbediti test/restricted API ključ odgovarajućih dozvola, postojeće test Price ID-jeve, posebnu test bazu i odgovarajuću webhook signing tajnu. Tajne unositi kroz secret konfiguraciju, nikada u PR/chat log.
2. Pre mrežnog koraka odbiti sve live ključeve; iz test API odgovora potvrditi `livemode=false` i da Price/customer/session pripadaju istom sandbox kontekstu. Razdvojiti test bazu od produkcije i proveriti URL povratka i Tax uslove koje postojeći Checkout traži.
3. U sandboxu proveriti kreiranje/retry sesije i zatim testnu simulaciju plaćanja Stripe test podacima, potpisanu isporuku webhooka, duplikate, neuspeh i oporavak upisa. Ne koristiti stvarnu karticu ili uplatu 1.000 RSD.
4. U novom izveštaju navesti stvarne API request/event/session ID-jeve bez tajni i odvojiti ih od `*_fixture` dokaza. Sam API create nije dokaz da ceo webhook/auth tok radi. Pre toga rešiti P0 blokade.

Ovi koraci su preostali uslovi, ne tvrdnja da je sandbox integracija izvršena ili da je poslovni nalog odobren.

## Izvori i razvojna odluka

- [Stripe idempotent requests](https://docs.stripe.com/api/idempotent_requests): ponovljeni ključ zahteva iste parametre.
- [Stripe webhook vodič](https://docs.stripe.com/webhooks): sirovo telo, potpis, duplikati po event ID-ju i poslovnom objektu.
- [Stripe delivery/signature troubleshooting](https://docs.stripe.com/events/manage-webhook-endpoints): potvrda obrade, retry i endpoint-specific signing tajna.
- [Stripe Checkout post-payment događaji](https://docs.stripe.com/payments/existing-customers?platform=web&ui=stripe-hosted): asinhroni događaji uspeha/neuspeha.
- [Stripe subscription payment confirmation](https://docs.stripe.com/billing/subscriptions/bacs-debit): potvrda naplate pre fulfillment-a kod odloženih metoda.

Razvojna preporuka: review ovog testnog dokaza, zatim mali PR-ovi za (1) webhook payment/DB/retry uslove, (2) Checkout idempotentnost i customer vezu, (3) merene anti-fraud signale i lock. Predloženi tracking ID: `OKRID-2026-STRIPE-AUDIT-001`, status `proposed`, review owner: repozitorijumski code owner; nije tvrdnja da je vlasnik odobrio nalaze ili preuzeo rok. Nema ugovorne promene prema IO-OPENUI-AO; downstream provera je potrebna tek ako preuzme buduće runtime ispravke. Rollout ovog PR-a je samo razvojni review; rollback je revert testova/komandi/dokumentacije. Nema troška Stripe transakcija ni nove infrastrukture.
