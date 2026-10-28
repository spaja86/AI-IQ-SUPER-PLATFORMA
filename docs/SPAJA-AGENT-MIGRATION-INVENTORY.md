# SPAJA Deploy — inventar agenata i probni uvoz

Datum provere: 28. oktobar 2026. Izvorna glavna grana: `f6c2be5b25d5849193c9067b1f3f5aa67480d4ef`.
Zahtev vlasnika: nastaviti migraciju 43 konfiguraciona unosa, pripremiti implementaciju za pregled, bez produkcionog deploymenta i automatskog merge-a.
Predlog evidencije: `OKRID-2026-AGENT-MIGRATION-001` — proposed, nije registrovano ljudsko odobrenje.

## Rezultat

- Tačno **43** unosa pod `agents`: **40 enabled**, **3 disabled**. Ovo nisu brojevi pokrenutih procesa.
- **43/43** kompatibilno za probni uvoz metapodataka; **0/43** dobija pravo izvršavanja ili aktivaciju.
- **79** lokalnih GitHub workflow definicija u katalogu. Za konfiguracione unose: 40 ima pronađene povezane definicije, 2 imaju nepotpune reference, 1 je ljudska uloga.
- `deploy-bot`, `calculator-validator-agent` i `gigatron-validator-agent` ostaju isključeni. Njihovi workflow-i i dalje postoje nezavisno od konfiguracionih zastavica; ovaj alat ih ne pokreće niti menja.
- Registar sadrži 9 platformi i provajdere `vercel` (remote hook) i `spaja-local` (ograničeni dev fixture). Ne registruje izvršne adaptere projektnih agenata.
- PR #1373 na `af227ea66de81268c637041432e02b99eefd726c` je pri proveri draft, nije uključen u ovu granu. `file-manifest`, `generate-module` i `verify-module` nisu adapteri za proizvoljne workflow-e i projektne agente.

## Artefakti i reprodukcija

- [Mašinski inventar](evidence/spaja-agent-inventory.json)
- [Rezultat probnog uvoza svih 43 unosa](evidence/spaja-agent-import-dry-run.json)
- [TAP — testovi inventara](evidence/spaja-agent-inventory-tests.tap)
- [TAP — postojeće Deploy/budget regresije](evidence/spaja-agent-deploy-regressions.tap)

Node 24; `npm ci --ignore-scripts`. `js-yaml` 4.1.1 je eksplicitno deklarisan kao razvojna zavisnost; ista verzija i integritet već postoje u osnovnom lockfile-u. Nijedna verzija paketa nije unapređena.

```sh
npm run agents:inventory:check
npm run agents:import:dry-run
npm run test:agents:inventory
```

Za regenerisanje preglednih snimaka posle odobrenih izmena izvora:

```sh
node scripts/spaja-agent-inventory/cli.mjs generate > docs/evidence/spaja-agent-inventory.json
node scripts/spaja-agent-inventory/cli.mjs dry-run > docs/evidence/spaja-agent-import-dry-run.json
```

Provera uvezenog fajla: `node scripts/spaja-agent-inventory/cli.mjs dry-run --input /putanja/inventar.json`.
Izlaz je JSON na stdout; alat ne upisuje registar, bazu, konfiguraciju ili radni red. Preusmeravanje stdout-a iznad je eksplicitno lokalno čuvanje izveštaja.
Test paket je uključen na početak `test:ci`, pa se poziva i kroz `npm test`.

## Ugovor i granice poverenja

`sourceRevision` označava pregledanu baznu reviziju, a `sourceFiles[].sha256` vezuje stvarne lokalne bajtove izvora, uključujući generator i izmenjene package fajlove ove grane. Vreme generisanja se ne dodaje, pa su izlazi deterministički. Izmenjen ili zastareo snimak se odbija dok se ponovo ne generiše i pregleda.

Uloga ima naveden izvor: konfiguracija, AGENTS tabela/odeljak ili tačan naziv povezane workflow definicije kada posebna dokumentovana uloga ne postoji. Srpski i engleski odeljci se čuvaju odvojeno; prevodi nisu dodatni agenti. Imena se ne normalizuju: `konvencionalni-odnosi` i `konvenkcionalni-odnosi` ostaju različiti unosi.

Svaki unos čuva izvornu konfiguraciju, dokumentovane statuse, reference workflow-a sa poreklom, lokalnu closure listu reusable workflow-a, deklaracije komandi, npm skripte, testove, postojeće/nedostajuće fajlove, linked-agent/module/repository veze, potrebne mogućnosti i blokade. Katalog čuva parsirane pune YAML definicije, okidače, uslove, job `needs`, runner-e, timeout-e, deklarisane/nasleđene dozvole, nazive referenci tajni i spoljne action/reusable-workflow reference. Vrednosti tajni se ne učitavaju iz okruženja ili secret manager-a.

Eksplicitne reference iz konfiguracije su `config-reference`; sedam ručno pregledanih povezivanja bez konfiguracione reference označeno je `reviewed-association` u generatoru. Referenca u scope/trigger polju nije dokaz da je workflow obavezni izvršni entrypoint. Nedostajuće reference ostaju vidljive, umesto da ih zajednički `omega-auto-build.yml` prikrije.

YAML parsiranje nije potpuna GitHub validacija. Spoljni action-i i čak same-repository reusable reference sa `@main` ili drugim ref-om **nisu preuzeti niti izvršeni**. Njihov kod, efektivne dozvole, dinamičke izraze, uslove okruženja, proširivanje globova, servise i stvarnu dostupnost runner-a mora proveriti sledeća faza. Job/repository dozvole su deklaracije, ne potvrđeni grantovi. `enabledFlagEnforcement: not-proven` i `executionObserved: false` su namerni.

`dryRunAgentImport(input, expected, request)` prihvata samo `dry-run`, dev, `inventory:read`, `execution: null`, `activate: false`, `costMicros: 0`. `expected` mora napraviti pouzdani lokalni builder; ne sme se uzeti iz uvoznog fajla. Poredi se ceo kanonski snimak, ne samo broj ili hash koji pošiljalac sam navede. Duplirani JSON ključevi/ID-jevi/putanje, nepoznata polja, promenjene dozvole, izvršni adapteri, komande, kredencijali, odobrenja i promene zaštićenih zastavica se odbijaju. Negativan ili pozitivan trošak nije dozvoljen.

Ovo je lokalna razvojna CLI kontrola u SPAJA Deploy modulu, bez nove HTTP rute ili produkcionog UI-ja. Nema `apply`/`start`/`dispatch`, procene potrošnje kao dozvole za trošak, automatskog mapiranja komandi u adaptere, automatskog odobravanja ili hardverskog sandbox obećanja. Node permission test potvrđuje rad CLI-ja bez dozvole za pisanje fajlova i stvaranje subprocess-a; nije dokaz OS izolacije.

## Neusaglašenosti koje ostaju za pregled

- `calculator-validator-agent`: AGENTS kaže Active, konfiguracija false; konfiguracija se zadržava.
- Nedostaju `.github/workflows/extrimli-cuz-validator.yml` i `.github/workflows/mrkli-mrak-validator.yml`.
- `nude-validator-agent` ima dva engleska odeljka; sačuvana su oba i prijavljen duplikat u istom jeziku.
- 16 dokumentovanih identiteta nije u `agents`; 6 konfiguracionih identiteta nema AGENTS ulogu/tabelu.
- `force-validator-agent`, `astronomik-money-validator-agent`, `dinosaurus-trexar-validator-agent` i `trikot-validator-agent` imaju unose pod `featureTracks`, ne pod `agents`; ne uvoze se automatski kao dodatni agenti.
- `persona-bank-agent` je dokumentovan, ali nije konfigurisan; `another-maks`, `maksimus-2` i `maksimus-3` ne vezuju se proizvoljno za slična imena. Takve zavisnosti ostaju nerazrešene.
- Sve stvarne izvršne migracije čekaju adapter, pregled dozvola/izolacije, vezivanje budžeta, pouzdan audit i eksplicitno ljudsko odobrenje.

## Pregled svih unosa

Svaki red je prihvatljiv samo kao metapodatak. `importEnabled=false` i `executionCompatible=false` važe za svih 43.

| Agent | Config enabled | Dokumentovan status | Povezana definicija | Poseban nalaz |
|---|---|---|---|---|
| `adutiv-validator-agent` | true | 🚀 Active | `adutiv-validator.yml` | izvršavanje neprovereno |
| `aktiviti-all-validator-agent` | true | Nema reda u tabeli | `aktiviti-all-validator.yml` | nedostaje AGENTS zapis |
| `analytics-bot` | true | ✅ Active | `analytics-bot.yml` | izvršavanje neprovereno |
| `another-maks-agent` | true | 🚀 Active | `another-maks.yml` | izvršavanje neprovereno |
| `another-races-ops-agent` | true | Nema reda u tabeli | `back-to-spaces-another-races.yml` | nedostaje AGENTS zapis |
| `calculator-validator-agent` | false | ✅ Active | `calculator-validator.yml` | ostaje isključen; Active/false konflikt |
| `chatgpt-katalog-validator-agent` | true | 🚀 Active | `chatgpt-katalog-validator.yml` | izvršavanje neprovereno |
| `ci-bot` | true | ✅ Active | — | izvršavanje neprovereno |
| `decibil-validator-agent` | true | 🚀 Active | `decibil-validator.yml` | izvršavanje neprovereno |
| `delet-validator-agent` | true | 🚀 Active | `delet-validator.yml` | izvršavanje neprovereno |
| `deploy-bot` | false | ⏳ Planned | `vercel-deploy.yml` | ostaje isključen |
| `digit-engine-validator-agent` | true | 🚀 Active | `digit-engine-validator.yml` | izvršavanje neprovereno |
| `digitron-validator-agent` | true | Nema reda u tabeli | `digitron-validator.yml` | nedostaje AGENTS zapis |
| `duet-validator-agent` | true | 🚀 Active | `duet-validator.yml`, `extrimli-validator.yml` | izvršavanje neprovereno |
| `dumbir-validator-agent` | true | 🚀 Active | `dumbir-validator.yml` | izvršavanje neprovereno |
| `extrimli-cuz-validator-agent` | true | 🚀 Active | `extrimli-cuz-validator.yml` | nedostaje workflow |
| `extrimli-validator-agent` | true | 🚀 Active | `extrimli-external-github.yml`, `extrimli-spaja-deploy.yml`, `extrimli-trance-extrem-deploy.yml`, `extrimli-validator.yml` | izvršavanje neprovereno |
| `gamelord-validator-agent` | true | 🚀 Active | `gamelord-validator.yml` | izvršavanje neprovereno |
| `geografija-realna-validator-agent` | true | Nema reda u tabeli | `geografija-realna-validator.yml` | nedostaje AGENTS zapis |
| `gigatron-validator-agent` | false | 📋 Ready | `gigatron.yml` | ostaje isključen |
| `great-sumbion-validator-agent` | true | 🚀 Active | `great-sumbion-validator.yml` | izvršavanje neprovereno |
| `human-review` | true | ✅ Active | — | ljudska uloga |
| `konvencionalni-odnosi-validator-agent` | true | 🚀 Active | `konvencionalni-odnosi-validator.yml` | izvršavanje neprovereno |
| `konvenkcionalni-odnosi-validator-agent` | true | 🚀 Active | `konvenkcionalni-odnosi-validator.yml` | izvršavanje neprovereno |
| `kulkon-validator-agent` | true | 🚀 Active | `kulkon-validator.yml` | izvršavanje neprovereno |
| `madagaskar-validator-agent` | true | 🚀 Active | `madagaskar-validator.yml` | izvršavanje neprovereno |
| `maksimus-validator-agent` | true | 🚀 Active | `maksimus-validator.yml` | izvršavanje neprovereno |
| `mirikl-validator-agent` | true | 🚀 Active | `deploy-platforma.yml`, `mirikl-validator.yml`, `vercel-deploy.yml` | izvršavanje neprovereno |
| `mrkli-mrak-validator-agent` | true | 🚀 Active | `mrkli-mrak-validator.yml` | nedostaje workflow |
| `multi-repo-sync-agent` | true | ✅ Active | `multi-repo-sync.yml` | izvršavanje neprovereno |
| `nova-generacija-agent` | true | 🚀 Active | `nova-generacija.yml` | izvršavanje neprovereno |
| `nude-validator-agent` | true | 🚀 Active | `nude-validator.yml` | izvršavanje neprovereno |
| `okrid-governance` | true | Nema reda u tabeli | `okrid-weekly-review.yml` | nedostaje AGENTS zapis |
| `paraksil-validator-agent` | true | 🚀 Active | `paraksil-validator.yml` | izvršavanje neprovereno |
| `pilotrelax-validator-agent` | true | 🚀 Active | `pilotrelax-validator.yml` | izvršavanje neprovereno |
| `pozadine-svih-projekcija-validator-agent` | true | 🚀 Active | `pozadine-svih-projekcija-validator.yml` | izvršavanje neprovereno |
| `prosparitet-validator-agent` | true | 🚀 Active | `prosparitet-validator.yml` | izvršavanje neprovereno |
| `reklamitin-validator-agent` | true | 🚀 Active | `reklamitin-validator.yml` | izvršavanje neprovereno |
| `security-scanner` | true | ✅ Active | `security-scanner.yml` | izvršavanje neprovereno |
| `spaja-drustvena-mreza-validator-agent` | true | 🚀 Active | `spaja-drustvena-mreza-validator.yml` | izvršavanje neprovereno |
| `tacskrin-validator-agent` | true | Nema reda u tabeli | `tacskrin-validator.yml` | nedostaje AGENTS zapis |
| `tarken-hingil-ekolan-maksimus` | true | 🚀 Active | `tarken-hingil-ekolan-maksimus.yml` | izvršavanje neprovereno |
| `trenazer-validator-agent` | true | 🚀 Active | `trenazer-validator.yml` | izvršavanje neprovereno |

## Provere i preostala ograničenja

- Novi paket: **46/46 testova**, bez preskakanja i TODO; kompletan TAP je priložen.
- Postojeće Deploy/provider/authorization/UI i UMBREL/DURMITOR regresije: **6/6 test fajlova**, bez neuspeha. Broj fajlova nije broj svih unutrašnjih tvrdnji.
- Smoke preko `node --import tsx`: **43/43**. Tekst postojećeg smoke skripta o go-live spremnosti nije odobrenje za produkciju.
- Ciljani ESLint svih novih izvršnih/test fajlova: prolaz. Puni aplikacioni TypeScript na čistom kandidatskom stablu: prolaz.
- Puni `npm test`: novi paket prolazi, zatim postojeći `tsx` CLI staje na IPC `listen EPERM`; ostatak suite-a nije izvršen. Standardni `npm run test:smoke` ima isti IPC problem; direktni Node poziv iznad izvršava stvarni smoke paket.
- Puni ESLint repozitorijuma: **31 error / 91 warning** u postojećim fajlovima van ove promene. Nisu uklonjeni ili utišani.
- `predeploy:check`: exit 0 sa upozorenjima; nije potvrda release spremnosti.
- Dependency audit: **55 nalaza (21 high, 19 moderate, 15 low, 0 critical)**. Lockfile nije unapređivan; nalazi ostaju otvoreni.
- Kompletan Next build i uspešni udaljeni quality/security gate-ovi nisu potvrđeni. Runtime agenata, produkcioni troškovi, trajni worker i stvarni GitHub workflow run-ovi nisu testirani ovim dry-run-om.

## Rollout Plan, Cost Impact & Rollback

Samo zasebna razvojna grana/draft pregled. Bez produkcionog deploymenta, automatskog merge-a, ručnog workflow dispatch-a, promene GitHub dozvola, secret manager-a ili aktiviranja agenata. Predlog ne menja `.agent-config.json`, AGENTS, postojeći Deploy registar, postojeće adaptere, ograničenja AI troškova ili ljudske gate-ove.

Sledeće: ljudski/security pregled inventara, razrešenje statusa i zavisnosti, zatim poseban predlog ograničenog izvršnog adaptera uz eksplicitne dozvole, budget rezervacije i stop/recovery testove. Tri isključena unosa ne menjati bez posebne odluke. Ne prevesti `requiredChecks` ili `test_commands` u slobodan shell.

Dry-run nema mrežnih/plaćenih operacija; lokalno računarsko vreme i postojeći CI troškovi nisu novčano izmereni. Nema nove infrastrukture ili povećanja budžeta. Rollback: vratiti dodate inventarske module, testove, dokumente i package deklaracije; nema pokrenutog servisa, baze ili reda koji treba migrirati nazad. Cross-repo impact: pregledne reference ka IO-OPENUI-AO, bez izmena ili poruka u tom repozitorijumu.
