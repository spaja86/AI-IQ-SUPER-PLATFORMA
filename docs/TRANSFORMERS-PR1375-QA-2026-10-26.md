# TRANSFORMERS PR #1375 — proverljiva QA, 26. oktobar 2026.

> Preuzeto iz dostavljenog QA paketa verzije 1. Ovaj dokument čuva rezultate izvornog pregleda; aktuelni ishod integracije i novog punog builda naveden je u [TRANSFORMERS-PROTOTYPE.md](TRANSFORMERS-PROTOTYPE.md). Putanje sirovih dokaza odnose se na ZIP paket.

> Istorijski izveštaj prvog QA prolaza, pre lokalne ispravke navigacije.
> Aktuelni kod i rezultati dopune opisani su u
> [TRANSFORMERS-NAVIGATION-FIX-2026-10-26.md](TRANSFORMERS-NAVIGATION-FIX-2026-10-26.md).
> Crveni 768 px nalaz i očekivanja ispod odnose se na početni PR vrh.

Proveren je aktuelni vrh `06f61e964bfc3e1d8a8f1899bb5c2baaa3fcc83c` draft PR-a
[1375](https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA/pull/1375).
Prvobitni zahtev opisuje stariji `e05d7c69`; tokom pregleda PR je već dopunjen
ispravkom navigacije bota uz dozvoljene granice prepreka i završenim standardnim buildom.
Ta dopuna je preuzeta i proverena, bez ponovnog implementiranja.

## Ishod

Lokalni duel može da se testira u stvarnom Chromium browseru preko lokalnog Next.js
produkcionog servera. Prolazi 24/24 Node testa i 13/14 browser scenarija duela.
Dodatno prolazi javno pokretanje iz SPAJA Brouvzer kataloga. Jedini potvrđeni
neuspeh duela/prikaza u konačnim proverama jeste horizontalno prelivanje cele
stranice na širini 768 px zbog zajedničke glavne navigacije. Put pokretanja preko
zaštićene `/industrija` nije izvršen sa prijavljenom sesijom.

Ovo je završena provera sa otvorenim nalazom, a ne potvrda spremnosti za produkciju.
Nema izmena aplikacionog koda, konfiguracije, zavisnosti ili lockfile-a. Dopunjeni
su testovi, lokalni test runner i ova dokumentacija. Nije pisan GitHub komentar,
menjana udaljena grana, spajan PR ili pokretan deployment.

## HTTP: reprodukovan problem izvršnog okruženja

- Zaseban Node HTTP probe na `127.0.0.1:3137` uspešno je vratio `same-exec-ok`
  pozivu iz istog izvršnog okruženja.
- Dok je taj server radio, drugi izvršni poziv na isti port vratio je
  `ECONNREFUSED`. Time je reprodukovana izolacija lokalnih mrežnih okruženja.
- `scripts/run-transformers-browser.mjs` zato pokreće Next, čeka HTTP 200 sa
  početnim ekranom i zatim pokreće browser testove u istom stablu procesa.
- Server sluša isključivo `127.0.0.1`, a testni browser blokira zahteve van tog
  porekla. Nisu menjani CSP, autentifikacija ili produkcione bezbednosne postavke.
- Produkciona `/transformers` vratila je HTTP 200 i 194.296 bajtova HTML-a.
  Tek zatim su potvrđene hidratacija i stvarne interakcije, uključujući pokretanje
  duela, promene stanja i završetak. Sam HTTP 200 nije korišćen kao dokaz igrivosti.
- Ranije prijavljeno odbijanje veze saglasno je ovom reprodukovanom ograničenju;
  originalni životni ciklus procesa iz starog pokušaja nije potpuno zabeležen.
- Dodatni novi `next dev --webpack` pokušaj u ovoj proveri nije dao spremnu rutu
  unutar 120 s; log je ostao u kompilaciji `/transformers/page`, bez konačne
  kompajlerske dijagnostike. Runner ga je zaustavio zbog svog vremenskog limita.
  Browser scenariji nad tim razvojnim serverom nisu izvršeni. Uspešne interakcije
  iz ovog izveštaja izvršene su nad lokalnim `next start` serverom; ovaj novi
  razvojni timeout nije pomešan sa ranijim Webpack build OOM nalazima.

## Stvarno izvršene provere

Okruženje: Node.js 24.22.1, Next.js 16.4.1, Playwright 1.62.1 i lokalni headless
Chromium 138.0.7204.0. Izolovana kopija projekta; zavisnosti ponovo korišćene iz
postojećeg checkout-a sa identičnim SHA-256 lockfile-om. Nije korišćen fizički telefon.

| Provera | Rezultat | Granica dokaza |
|---|---|---|
| Engine, katalog i launch regresije | 24/24 prolazi | Node testovi stvarnog projektnog izvora |
| Početak i robot → vozilo → robot | Prolazi | Hidratovana Next.js stranica; vozilo ne može da napada |
| Kretanje, otpuštanje tastera, pauza/nastavak | Prolazi | Zamrznuti sat, HP i SVG tokom pauze; komanda se ne zadržava |
| Kamere 1–4, C, orbit i kadar oba učesnika | Prolazi | 23 opcije, 19 planiranih onemogućeno |
| Bot i prepreke u browseru | Prolazi | Jedna putanja iza prepreke, 100 uzoraka položaja; ne ulazi ni u jednu proširenu prepreku |
| Bot: dodatni rasporedi | Prolazi | Node: tri rasporeda i četiri legalne granične pozicije oko dve prepreke |
| Pobeda, stabilan rezultat i pet resetovanja | Prolazi | Vraćaju se HP, početni ekran i 90 s |
| Poraz bez napadanja | Prolazi | Browser intervali pokretani virtuelnim satom |
| Istek 90 s pri velikom kašnjenju | Prolazi | `clock.fastForward(90000)`, ograničena fizička nadoknada; nije 90 s čekanja u stvarnom vremenu |
| Skrivena kartica i otpuštanje komande | Prolazi | Sintetički `visibilitychange` i kontrolisani `document.hidden`; nije test stvarnog Android suspendovanja |
| Mobilni 360 px i 390 px | Prolazi | Bez horizontalnog prelivanja; transformacija, pauza/nastavak, četiri kamere; kontrole najmanje 44 px visoke |
| Mobilni/tablet 768 px | **Ne prolazi** | `scrollWidth=17805`; detalji ispod |
| Dodir, izvlačenje prsta van dugmeta, touchEnd | Prolazi | CDP dodir; kretanje se zaustavlja |
| touchCancel | Prolazi | CDP otkazivanje dodira; kretanje se zaustavlja |
| Običan browser sat | Prolazi | Obe transformacije i odbrojavanje bez Playwright virtuelnog sata |
| Javni Brouvzer katalog → 360D → duel | Prolazi | Stvarna navigacija i pokretanje namenskog runner-a |
| Zaštićeni Industrija katalog | Preskočeno | `AuthGuard`; nije dostavljen legitiman lokalni storageState |

Rezultati su objedinjeni iz glavnog prolaza (13 uspešnih, 1 neuspešan), ponovljene
768 px dijagnostike i zasebnog kataloškog prolaza (1 uspešan, 1 preskočen).
Ponovljeni 768 px neuspeh ne predstavlja dodatni nezavisan problem.

Prvi razvojni prolaz testnog skripta nije korišćen kao konačni nalaz: virtuelni sat
je bio instaliran posle kreiranja intervala, `pauseAt` je ponekad tražio prošlo
vreme, a SVG tekst se čitao preko `innerText`. Sada se sat instalira pre učitavanja
aplikacije, zamrzava pre početka duela, a SVG koristi `textContent`. Kataloški
test čeka završetak navigacije. Početni sirovi logovi ostaju u paketu radi revizije.

## Otvoren nalaz: navigacija previše široka od 768 px

**Prioritet P2 za responsive prikaz; blokira tvrdnju da svi testirani formati prolaze.**

Na širini 768 px aktivira se `md:flex` blok u `src/components/Navigation.tsx`.
Svi linkovi kataloga renderuju se u jednoj horizontalnoj flex traci bez ograničenja
širine ili unutrašnjeg skrola. Izmeren je blok širok 17.721,625 px, desna ivica
17.804,6875 px, dokument `scrollWidth=17805` i mobilni `innerWidth=3072`.
To je zajednički okvir stranice; `TransformersRunner` nije uzrok široke trake.

Reprodukcija: otvoriti `/transformers` sa viewportom 768 × 844 i mobilnim/touch
emulacionim postavkama. Pokrenuti namenski test komandom ispod. Test namerno
ostaje crven; `overflow:hidden` nije umetnut radi prikrivanja problema.

Predlog naredne male izmene: ograničiti desktop navigaciju dostupnom flex širinom
(`min-w-0`) i omogućiti pristupačan unutrašnji horizontalni skrol ili objediniti
veliki broj linkova u meni. Zatim ponoviti 768/1024/1280 px, tastaturni fokus i
pristup poslednjim linkovima. Zajednička navigacija ovim QA paketom nije menjana.

## Build: memorijska greška je razdvojena od vremenskog ograničenja

Pročitani su sačuvani stvarni logovi prethodnog rada i aktuelni commit/PR opis.
Pre početka novih testova svih 5.365 praćenih datoteka odgovaralo je checkout-u
uspešnog builda, uključujući dopunu navigacije bota; sedam promenjenih datoteka
provereno je prema GitHub blob SHA vrednostima. Sačuvan je izveštaj poređenja.

| Putanja | Dokaz i zaključak |
|---|---|
| Webpack, heap oko 2 GB | `Reached heap limit`, `JavaScript heap out of memory`, `SIGABRT`, oko 260 s |
| Webpack, heap 4 GB | Ista memorijska greška, oko 418 s |
| Standardni `npm run build` / Turbopack | Završena kompilacija (2,7 min), TypeScript (2,7 min), 1.421/1.421 statičkih stranica (109 s), `/transformers` u spisku |
| Lokalni `next start` iz tog artefakta | HTTP 200 i stvarno izvršene browser interakcije iz ovog izveštaja |

Webpack logovi pokazuju iscrpljenje V8 heap-a, a ne samo istek petominutnog čekanja
niti potvrđenu TypeScript/sintaksnu grešku TRANSFORMERS koda. Standardni uspešan
build je ponovo upotrebljen, nije još jednom nepotrebno građen. Build ID:
`lUFbrO-ILbJHg1OBvXBY_`.

Ostaju upozorenja drugih modula iz prethodnih logova (Edge runtime i nedostajući
AUTOFINISH_TRIGGER_TOKEN), neprovereni udaljeni CI i produkciona podešavanja.
Cloudflare status sam po sebi nije dijagnoza lokalne logike duela. Nije pokrenut
novi Cloudflare ili drugi deployment.

## Reprodukcija

U svežem checkout-u navedenog PR vrha primeniti `TRANSFORMERS-PR1375-QA.patch`
iz paketa. Komande su za Bash i izvršavaju se iz korena repozitorijuma:

```bash
git checkout --detach 06f61e964bfc3e1d8a8f1899bb5c2baaa3fcc83c
git apply --check /putanja/TRANSFORMERS-PR1375-QA.patch
git apply /putanja/TRANSFORMERS-PR1375-QA.patch
npm ci
npm install --no-save --package-lock=false playwright@1.62.1
npx playwright install chromium
node --import tsx --test src/tests/lib/transformers.test.ts src/tests/lib/transformers-sprint.test.ts src/tests/lib/transformers-launch.test.ts
NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=4096 npm run build
node scripts/run-transformers-browser.mjs
```

Browser nije nova runtime zavisnost aplikacije. Ako postoji lokalni browser ili
poseban Playwright paket, navesti njihove stvarne putanje:

```bash
TRANSFORMERS_CHROME_PATH=/apsolutna/putanja/chromium \
TRANSFORMERS_PLAYWRIGHT_MODULE=/apsolutna/putanja/playwright \
node scripts/run-transformers-browser.mjs
```

Izolovana reprodukcija otvorenog nalaza ili kataloga:

```bash
TRANSFORMERS_TEST_PATTERN='mobile 768' node scripts/run-transformers-browser.mjs
TRANSFORMERS_TEST_PATTERN='catalog' node scripts/run-transformers-browser.mjs
```

Podrazumevani runner koristi `next start` i zato zahteva uspešan build.
`TRANSFORMERS_SERVER_MODE=development` bira `next dev --webpack` za razvojnu
dijagnostiku. `TRANSFORMERS_RESULTS_DIR` menja direktorijum logova, a
`TRANSFORMERS_PORT` lokalni port. Runner ima ograničeno čekanje spremnosti i
trajanja testova, vraća neuspešan exit status kada scenario padne i zaustavlja server.

`/industrija` se testira samo uz `TRANSFORMERS_AUTH_STATE` koji pokazuje na
legitiman lokalni Playwright storageState. Takav fajl ne treba commitovati ili
uključivati u QA paket. Sesija nije fabrikovana radi zelenog rezultata.

Očekivanje na ovoj reviziji: 24 Node testa prolaze; kompletan browser skup ima
poznat neuspeh na 768 px, pa exit status ne treba očekivati kao 0. Preskočeni
Industrija scenario nije uračunat među uspešne provere.

## Preostale granice validacije

- Nije testiran fizički Android uređaj, sistemska promena aplikacije, zaključavanje
  ekrana ili izvorni mobilni birač opcija; kamera je birana Playwright API-jem.
- Stvarno skrivanje browser kartice/suspendovanje mobilnog OS-a treba proveriti
  posebno; trenutni visibility test je eksplicitno sintetički.
- Nisu ponavljani svi testovi monorepoa, udaljeni CI ili dependency audit.
- Pre spajanja popraviti ili zasebno razrešiti responsive nalaz, izvršiti fizički
  telefonski scenario i odgovarajuće release provere. PR ostaje draft.

Za fizički telefon: početak → obe transformacije → svaka kamera → držanje smera
i otpuštanje van dugmeta → pauza/nastavak → odlazak u drugu aplikaciju i povratak
dok je komanda pritisnuta → završetak i novi duel. Ovaj niz je pripremljen,
ali nije označen kao izvršen.
