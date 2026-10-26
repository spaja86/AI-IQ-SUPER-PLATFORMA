# TRANSFORMERS — ispravka prelivanja navigacije

> Preuzeto iz dostavljenog QA paketa verzije 1. Ovaj dokument čuva rezultate izvornog pregleda; aktuelni ishod integracije i novog punog builda naveden je u [TRANSFORMERS-PROTOTYPE.md](TRANSFORMERS-PROTOTYPE.md). Putanje sirovih dokaza odnose se na ZIP paket.

Dopuna QA paketa od 26. oktobra 2026, na osnovu korisnikovog „Može sve“.
Osnova ostaje draft PR #1375, commit `06f61e964bfc3e1d8a8f1899bb5c2baaa3fcc83c`.

## Problem i izmena

Na `/transformers` pri širini 768 px prethodna provera je izmerila dokument
širok 17.805 px. Uzrok je bio zajednički desktop navigacioni niz sa svim linkovima,
koji se uključuje na `md` prelomnoj tački i nije ograničavao svoju širinu.

`src/components/Navigation.tsx` sada zadržava logo pune širine, a desktop linkove
ograničava na preostalu širinu zaglavlja pomoću `min-w-0` i `flex-1`. Višak linkova
se pomera unutar označene navigacione oblasti (`overflow-x-auto`), umesto da širi
celu stranicu. Linkovi i prijava/registracija se ne sabijaju; skrol oblast može
da primi fokus i ima vidljiv indikator fokusa. Nema skrivanja prelivanja dokumenta,
brisanja linkova, promene autentifikacije ili menjanja logike duela.

Promena zajedničke komponente važi i za ostale stranice koje koriste Navigation.
Postojeći meni ispod 768 px zadržava isto ponašanje. Nema novih paketa, izmena
lockfile-a, produkcione konfiguracije ili cross-repo ugovora.

## Validacija

Prvi pokušaj punog builda završio je greškom čišćenja prethodnog izlaza (`ENOTEMPTY`).
Ponovljeni pokušaj sa novim izlaznim direktorijumom prekinut je posle 896,86 s:
izlazni kod 137 i poruka `Killed`, u fazi kompilacije. Podešeni limit bio je
1.200 s i nije aktiviran. Log ne potvrđuje tačan uzrok prinudnog prekida;
ovaj rezultat se ne označava kao potvrđena greška TypeScript koda ili kao novi
V8 heap OOM. Stari generisani izlazi potom su izmešteni iz izvornog projekta.

Za lokalnu integracionu proveru upotrebljen je dokumentovani Next.js
`--debug-build-paths` za `/transformers`, `/spaja-digitalni-brouvzer` i `/industrija`.
To je ograničena kompilacija ruta, a ne uspešan pun monorepo build. Kompilacija je
uspela za 4,1 min, ali je TypeScript provera celog projekta još trajala kada je
supervizor prekinuo pokušaj na 900 s (exit 124). Nije prijavljena kompajlerska
greška. Ovaj pokušaj je potvrđeni timeout, za razliku od prethodnog exit 137.

Zasebna TypeScript provera Navigation.tsx, TransformersRunner.tsx i njihovih
uvezenih zavisnosti prošla je bez grešaka (exit 0, 38,23 s). To ne potvrđuje tipove
svih ostalih modula. Provera je koristila postojeći tsconfig sa suženim `include`
i isključenim incremental izlazom; produkciona konfiguracija nije menjana.
Ista provera potvrđena je i prenosivim `scripts/tsconfig.transformers-qa.json`
iz ovog paketa (exit 0, 106,86 s).

Za browser izvršavanje pripremljen je dijagnostički Next build istih triju ruta
u odvojenim režimima `compile` i `generate`. Ti režimi preskaču integrisanu punu
TypeScript proveru. Zato se njihov rezultat beleži odvojeno i ne predstavlja
zeleni release build, čak ni kada browser testovi prolaze.
Oba dijagnostička koraka završena su sa exit 0 (`compile` 97,28 s,
`generate` 33,71 s). Build ID je `Zbpz4xhLdNiwZ4-Yi_BIj`.
Lokalna `/transformers` ruta vratila je HTTP 200 i 199.318 bajtova HTML-a.
Testovi koriste stvarni lokalni `next start` i Chromium 138.0.7204.0.
Konzolni 404 zapisi u ovom ograničenom buildu uključuju Next.js `_rsc` prefetch
zahteve za izostavljene rute, npr. `/`, `/dashboard`, `/platforme` i `/igrice`.
To dodatno ograničava domet provere: fokusiranje linkova je testirano, a otvaranje
svih ostalih odredišta navigacije nije. Dijagnostički build nije za objavljivanje.

Ciljani ESLint nema grešaka. Jedno postojeće upozorenje ostaje na neizmenjenoj
liniji 46 Navigation.tsx (`window.location.href` u odjavi).

Prvi browser prolaz posle izmene imao je 14 dovršenih uspešnih scenarija,
uključujući 768 px i tastaturnu navigaciju na 1024 px. Dva scenarija (prepreke i
navigacija na 768 px) istekla su u `page.goto(... waitUntil: 'networkidle')`, pre
pokretanja duela i svojih provera. Ceo prolaz je zaustavljen limitom od 600 s;
preostali scenariji tada nisu potvrđeni. To su zabeleženi neuspešni pokušaji,
ne potvrđene greške geometrije prepreka ili fokusiranja.

Test sada čeka `load`, zatim postojeće konkretne UI uslove i stvarnu hidratovanu
promenu stanja posle klika. Ne zahteva tišinu svih pozadinskih mrežnih zahteva.
Pragovi za širinu, fokus, prepreke i ponašanje duela nisu ublaženi.

**Konačan ceo browser prolaz: 20 scenarija, 19 prolazi, 0 neuspeha, 1 preskočen,
0 otkazanih; exit 0; trajanje 382,73 s.** Log i izlazni status su u
`followup-evidence/browser-ui-ready/`. Ovaj prolaz nije zbir odabranih ponavljanja.

| Oblast | Stvarni rezultat |
|---|---|
| Početak, robot–vozilo–robot, zabrana napada iz vozila | Prolazi |
| Kretanje, otpuštanje tastera, pauza/nastavak | Prolazi |
| Kamere 1–4, kruženje tasterom C, orbit, oba učesnika u kadru | Prolazi; 19 planiranih opcija ostaje onemogućeno |
| Bot oko dve prepreke | Prolazi; 100 uzoraka položaja, bez ulaska u proširene prepreke |
| Pobeda, poraz, istek 90 s, stabilan kraj i pet resetovanja | Prolazi; deo provera koristi kontrolisani browser sat |
| Vidljivost dokumenta | Prolazi sintetički scenario; nije provera Android suspendovanja |
| Mobilne kontrole na 360/390/768 px | Prolazi; stranica ne preliva, kontrole su najmanje 44 px visoke |
| Dodir van dugmeta: touchEnd/touchCancel | Oba prolaze |
| Transformacija i odbrojavanje sa običnim browser satom | Prolazi |
| Desktop navigacija 768/1024/1280 px | Sve tri širine prolaze; unutrašnji skrol i Tab/Shift+Tab do poslednjih linkova |
| Mobilni meni 360 px | Otvaranje i Escape zatvaranje prolaze, bez prelivanja |
| Javni Brouvzer katalog → 360D → duel | Prolazi |
| Zaštićeni `/industrija` katalog | Preskočen; nedostaje legitimna prijavljena sesija |

Vizuelno su pregledani lokalni snimci prikaza na 768 px i navigacije na
768/1280 px. Ranijih 24/24 Node testova ostaju sačuvani u prvom izveštaju;
nisu ponavljani u ovoj dopuni jer logika engine-a i katalog nisu menjani.

Novi scenariji proveravaju širine 768/1024/1280 px, da horizontalni višak ostaje
unutar navigacije, Tab ulazak u prvi link, Tab/Shift+Tab kod poslednjih linkova,
automatsko pomeranje fokusiranog linka u vidljivu oblast i odsustvo horizontalnog
prelivanja dokumenta. Dodatni scenario proverava otvaranje mobilnog menija na
360 px, širinu otvorenog menija i zatvaranje tasterom Escape. Prethodni 768 px
regresioni scenario ostaje neizmenjen u svom očekivanju: dokument mora stati
u zadatu širinu.

## Reprodukcija

Primeniti kompletan novi `TRANSFORMERS-PR1375-QA.patch` na navedeni PR vrh,
zatim slediti instalacione korake iz prvog QA izveštaja. Ako je ranija verzija
QA patch-a već primenjena, vratiti samo njene izmene ili koristiti svež checkout;
novi kompletan patch ne treba primenjivati preko starog.

Puna kompilacija i TypeScript provera celog projekta ostaju release provere:

```bash
NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=4096 \
  npm run build
```

Za reprodukciju ograničene lokalne browser provere (nije release build):

```bash
node node_modules/typescript/bin/tsc --project scripts/tsconfig.transformers-qa.json --pretty false
export NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=4096
routes='src/app/transformers/page.tsx,src/app/spaja-digitalni-brouvzer/page.tsx,src/app/industrija/page.tsx'
npm run build -- --debug-build-paths="$routes" --experimental-build-mode=compile
npm run build -- --debug-build-paths="$routes" --experimental-build-mode=generate
node scripts/run-transformers-browser.mjs
```

Ovakav artefakt sadrži izabrane rute i ne treba ga objavljivati kao celu platformu.

Samo responsive i navigacione provere:

```bash
TRANSFORMERS_TEST_PATTERN='mobile|navigation' node scripts/run-transformers-browser.mjs
```

Za povratak samo aplikacione ispravke vratiti Navigation.tsx na verziju iz PR vrha.
Nema promena trajnih podataka ili migracija. Testove zadržati kao regresionu zaštitu.

## Granice

Browser emulacija nije fizički Android test. Zaštićeni `/industrija` scenario
zahteva legitiman lokalni storageState i ne računa se kao uspešan ako je preskočen.
Udaljeni CI i produkciona spremnost nisu potvrđeni ovim lokalnim proverama.
Pun standardni build ove lokalne izmene nije potvrđen: jedan pokušaj je prekinut
kodom 137, drugi ograničeni pokušaj dostigao je timeout pune TypeScript provere.
Prošli su odvojena ciljana TypeScript provera i dijagnostička kompilacija ruta.
Ova dopuna je lokalna i dostavlja se kao patch; udaljena PR grana nije menjana.
PR ostaje draft, bez spajanja ili deploymenta.
