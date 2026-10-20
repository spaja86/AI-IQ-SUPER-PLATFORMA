# VRH / SUOC — GitHub provera

Razlog: zahtev za implementaciju VRH sa GitHub projektom
`spaja86/AI-IQ-SUPER-PLATFORMA`, 21.10.2026. (Europe/Belgrade).
Numerički dispatcher, SUOC naredba i trajni lokalni pilot već postoje.
Ova dopuna uključuje njihov zajednički regresioni skup u GitHub Actions.

## Lokalno pokretanje

Potreban je Node.js 24 zbog `node:sqlite` u pilotu.

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run test:vrh
```

Komanda redom izvršava:

1. `test:suoc`: parser, aktivaciju, izgradnju i izvršavanje, VRH preflight,
   sva registrovana numerička imena i obradu nepotpunih rezultata;
2. `test:suoc:pilot`: stvarni lokalni HTTP servis, SQLite zapis, zavisnosti,
   pauzu/otkazivanje, prekid procesa, restart, retry i integritet revizije;
3. `test:vrh:reference`: postojeće Petlja/VRH/Spajascripte test datoteke,
   SPAJA fallback izolaciju i UMBREL/DURMITOR zajedničke budžete.

Svaka greška daje neuspešan izlaz. Numerički test fajlovi se izvršavaju
sekvencijalno (`--test-concurrency=1`) da se međusobno ne opterećuju tokom
provera vremenskih budžeta. Koristi se `node --import tsx`, bez tsx CLI IPC-a.
Broj TAP testova nije broj svih unutrašnjih assert provera, niti procenat
izgrađenosti platforme. Nove zavisnosti i promena lockfile-a nisu potrebne.

## GitHub Actions

Workflow `.github/workflows/vrh-validation.yml` pokreće se na relevantnim
pull request promenama ka `main`, push promenama na `main` i ručno.
`src/lib/**` i `src/tests/**` su namerno širi filteri zbog posrednih uvoza.
Node 24, zaključana instalacija, projektni TypeScript, stroga provera
pilot/VRH test ulaza, ciljani ESLint i `test:vrh` čine jedan job.
Job ima ograničenje od 15 minuta; novo pokretanje istog ref-a i događaja
otkazuje prethodno. PR se proverava na GitHub merge reviziji (`github.sha`),
a push na njegovoj tačnoj reviziji. Summary beleži stvarne ishode koraka,
uključujući failure/skipped, bez pretvaranja neuspeha u uspeh.

Workflow koristi samo `contents: read`, standardni `pull_request`, akcije
vezane za pune SHA vrednosti i checkout bez sačuvanih kredencijala.
Nema zahteva za produkcione tajne, prijavu, auto-merge ili deployment.
Pravila sintakse i dozvola:
https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax

## Granice i pregled

Lokalna provera 21.10.2026, Node 24.19.0, na osnovi
`0593a00d49e44a6355cf107eb40f3fb2110705d2`:

- `npm run test:vrh`: 73/73 SUOC, 21/21 pilot i 13/13 referentnih test
  datoteka; poslednji skup uključuje 153 Petlja i 105 individualnih VRH
  slučajeva. Brojevi unutrašnjih slučajeva se ne sabiraju sa brojem datoteka.
- Oba TypeScript koraka i ciljani ESLint iz workflow-a prolaze.
- `actionlint` 1.7.7 proverava workflow bez grešaka; `git diff --check` prolazi.
- Direktni smoke runner (`node --import tsx src/tests/smoke/smoke.test.ts`)
  prolazi 43/43. Njegova go-live poruka nije dokaz produkcione spremnosti.
- `npm test` i `npm run test:smoke` staju u tsx CLI na `listen EPERM`
  za lokalni IPC socket; puni test lanac nije uspešno izvršen.
- `predeploy:check` završava izlazom 0, ali statusom `warning`, uz nedostajuću
  lokalnu konfiguraciju i postojeća contract upozorenja.
- Puni Next.js build, repo-wide lint, browser testovi i security audit nisu
  ponavljani za ovu CI dopunu. Udaljeni Actions rezultat nije potvrđen.

Ovo je dodatna VRH provera u okviru postojećeg `ci-bot`, ne novi autonomni
agent. `OKRID-2026-GOV-001` (release-governance, Automation) prati ovu dopunu.
KPI cilj je izvršavanje sva tri skupa i tačan zapis ishoda za pokrenuti job;
udaljeni KPI ostaje nepotvrđen dok konkretan Actions run ne završi.

Postojeće release provere ostaju potrebne: puni lint/test skup, smoke,
predeploy, security i produkcioni build. Browser testovi iz
`src/tests/spaja-ultra/pilot-browser.test.mjs` ostaju zasebna opcionalna
provera prema [pilot pregledu](SUOC-DURABLE-PILOT-REVIEW.md).
Ovaj workflow sam ne potvrđuje browser, produkciju ili javni hosting.

Path-filtered workflow ne treba postaviti kao obaveznu proveru za svaki PR
bez zasebne izmene strategije pokretanja: za nepovezane promene se ne pokreće.
`startup_failure`, odbijena naplata/kvota, policy blokada i job bez izvršenih
testova nisu prolaz. Uzrok se utvrđuje iz konkretnog run-a i GitHub poruke.

Rollout: draft PR sa `agent:config-change` → ljudski pregled → merge →
provera prvog Actions izvršavanja. Rollback vraća workflow i npm skripte;
korisničke SQLite baze i numerički runtime se ne menjaju.
Cross-repo: nema promene `spaja86/IO-OPENUI-AO`, zajedničkih ugovora,
hosting konfiguracije ili finansijskih tokova.
