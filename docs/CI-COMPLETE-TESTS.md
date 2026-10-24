# SPAJA — kompletan inventar CI testova

Standardna Node komanda: 256 → 1.765 jedinstvenih test datoteka. Celokupan inventar: 1.768 datoteka (Node 1.765, Python 1, browser 1, JVM 1). Broj datoteka nije coverage procenat.

Datum provere: 23. oktobar 2026. (Europe/Belgrade).

Osnova: `spaja86/AI-IQ-SUPER-PLATFORMA`, draft PR #1364,
`7d34702cafe8e38e218a3f53b96e6bfcb4715284`.
Dopuna je namenjena tom draft PR-u. Merge zahteva ljudski review i uspešne obavezne provere.

## Šta je promenjeno

- `npm test` / `npm run test:ci` automatski otkriva Node test datoteke iz Git inventara, uključujući nove lokalne datoteke koje nisu ignorisane.
- Uključuje svih 1.492 autofinish test datoteku, bankarski prototip, digitalni kompjuter, društvene konekcije, testove iz korena, CI pomoćne testove i SUOC pilot.
- Python testovi odluke CI gate-a, pravi Chromium testovi i JVM integracija imaju odvojene komande i rezultate.
- Application workflow deli Node inventar u šest disjunktnih grupa; `fail-fast: false` omogućava završetak drugih grupa posle pada jedne. Ne koristi `continue-on-error`.
- Svaka datoteka se izvršava u posebnom procesu. Pokretač nastavlja posle greške i beleži izlaz, trajanje, hash loga, preostale datoteke i identitet izvornog koda.
- Prazan inventar, nepoznat format testa, loša opcija, timeout, signal i nedovršen prolaz ne mogu dati uspešan rezultat.
- Nasleđeni API ključevi i Node opcije se ne prosleđuju testovima. Ovo nije OS sandbox niti zamena za mrežnu izolaciju.

Konvencija otkrivanja je `.test.*` ili `.spec.*`; drugi načini imenovanja zahtevaju dopunu inventara. U ovoj reviziji nisu pronađene dodatne datoteke u formatu `test_*.py`, `*_test.*` ili `test-*.js`.

## Reprodukcija

Potrebni su Node 24.19.0, zaključane npm zavisnosti, Python 3, JDK (`javac`) i Chromium/Playwright za odgovarajuće grupe.

```bash
npm ci --ignore-scripts --no-audit --no-fund
npm run test:inventory
npm run test:ci
npm run test:ci:python
npm run test:ci:java
npm ci --prefix tools/ci-browser --ignore-scripts --no-audit --no-fund
node tools/ci-browser/node_modules/playwright/cli.js install --with-deps chromium
SUOC_PLAYWRIGHT_MODULE="$PWD/tools/ci-browser/node_modules/playwright" npm run test:ci:browser
```

Pokretati komande i beležiti svaki izlazni status zasebno. `test:ci` pokriva Node grupu; potpuna workflow validacija uključuje i Python, JVM, browser, TypeScript, lint, smoke/source-contract, build i nezavisni security workflow.

Primer jednog CI dela: `npm run test:ci -- --shard=1/6`. Podrazumevano izvršavanje je serijsko unutar svakog dela. Lokalna opcija `--concurrency=4` ubrzava inventar, ali može uticati na postojeće vremenske pragove; padovi se zato ne brišu posle kasnijeg uspešnog ponavljanja.

Rezultati su u `.ci-evidence/all-tests-<suite>-<shard>-of-<total>/summary.json`. Izlaz meri **datoteke koje su prošle**, ne procenat pokrivenosti koda niti jedinstven broj svih assertion-a. Generisani testovi delom proveravaju samo tekst izvora. Uspešan lokalni test ne potvrđuje produkcionu dostupnost, realne uplate ili AI odgovore.

## Integracija i kontrola promena

Primeniti dopunu na navedenu reviziju PR-a #1364, proveriti patch, zatim ponoviti CI na konačnom potpisanom commitu. Pravilo repozitorijuma `AGENTS.md`, Rules 8: “All agent commits must be signed (`git commit -S`).” Lokalno potpisivanje nije podešeno; nepotpisan commit nije napravljen. Review i udaljene obavezne provere ostaju potrebni pre merge-a.

Razlog promene: korisnikov zahtev za sve CI testove. OKRID: `OKRID-2026-CI-COVERAGE-001`. Downstream: nema promena drugih repozitorijuma. Rollout: dopuna postojećeg draft CI PR-a, provera rezultata, ljudski review. Rollback: revert samo ove dopune; time se vraća prethodni, ograničen obuhvat. Trošak: šest Node CI poslova umesto jednog, sa zasebnim logovima; nema promene pretplate, naplate ili infrastrukture. Nije pokrenut deployment.

Izvori implementacije: [PR #1364](https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA/pull/1364), [GitHub matrix/fail-fast](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax), [Node test execution model](https://nodejs.org/download/release/latest-jod/docs/api/test.html).

## Popravke otkrivene kompletnim prolazom

Početni lokalni prolaz otkrio je 94 neuspešne Node test datoteke (1.667 prošlih, bez preostalih datoteka). Ti logovi ostaju u paketu validacije; naknadni rezultati ih ne zamenjuju.

- Deset JSON API handlera vraća 400 za neispravan JSON, null, nizove i primitivne vrednosti. Novi regresioni test obuhvata svih deset ruta i šest neispravnih tela po ruti.
- SSE health stream oslobađa interval i abort listener na prekid/cancel; test proverava pravi SSE događaj i zatvaranje toka.
- Jokes API proverava da je count ceo broj između 1 i 10.
- Aktuelni brojači (1.520 API ruta, 208 stranica, 1.728 ukupno, 2.408 dijagnostičkih provera, 56 gejming entiteta) proveravaju se prema stvarnom izvornom inventaru. Istorijski milestone testovi proveravaju minimalne vrednosti svog izdanja.
- Testovi razlikuju modelsku verziju od verzije aplikacije, 12 dostupnih oktava od 8 elemenata konkretnog ulaza i dijagnostička upozorenja od uspešnih provera. Monolog ostaje `u_toku`; produkciona spremnost se ne proglašava radi prolaska testa.
- Šest GET testova koristi pravi Supabase SDK sa ograničenim offline HTTP fixture-om. Neusaglašeni mrežni pozivi izazivaju pad; kredencijali nisu potrebni.
- Trigger testovi potvrđuju 503 kada token nedostaje i 401 za odsutnu/pogrešnu autorizaciju kada je token konfigurisan. Obe konfiguracije pokreću se u zasebnim procesima.
- AI IQ evaluator koristi sažeti innovation registry umesto materijalizovane liste od 13.000 stavki; regresija poredi sve preuzete tehničke i governance signale sa punim izveštajem. Funkcionalni status testovi koriste kontrolisan sat, dok stvarni API test zadržava prag 200 ms i engine zadržava sigurnosni prag 50 ms.

## Tumačenje rezultata

Kompletan lokalni rezultat, verzije alata, SHA-256 izvora, hash logova i preostali nalazi pripadaju paketu validacije uz PR. Ne tvrditi da je CI zelen samo zato što su pojedinačni ponovljeni testovi prošli. Lokalne performanse mogu pasti i bez paralelnog izvršavanja; takav pad ostaje blokirajući nalaz.

GitHub prikazuje problem naplate naloga i poslove koji nisu ni počeli izvršavanje. To je prepreka udaljenoj validaciji; ova promena ne menja naplatu, zaštitu grana ni produkcionu konfiguraciju. Audit od 23. oktobra 2026. nakon povlačenja GHSA-vfj7-8cjw-p6xm prijavljuje 0 high/critical i 32 niža nalaza; nisu menjane zavisnosti radi prikrivanja nalaza.

## Investigation update — 24 October 2026

See [the eight-file investigation](CI-INSTABILITY-2026-10-24.md) and its [machine-readable evidence](CI-INSTABILITY-EVIDENCE-2026-10-24.json). The new complete local Node run passed 1765/1765 files with concurrency 4 and eight explicit exclusive barriers. The original 1757/8 run remains failed and is preserved. API/engine/process and security budgets are unchanged. Functional limiter/MFA clocks are controlled; real API latency assertions are not mocked.

Every invocation now retains an immutable `attempt-*` directory under the existing suite/shard evidence directory. The parent `summary.json` is the latest report only; log paths are relative to that parent directory. Reports include isolation/start/end and optional cgroup resource context. Separate invocations still require separate workspaces for host-level isolation. Remote required CI remains unverified until the actual application/security jobs pass.
