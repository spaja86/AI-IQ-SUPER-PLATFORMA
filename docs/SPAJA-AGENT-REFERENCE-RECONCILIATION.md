# SPAJA agenti — poreklo referenci i usaglašavanje statusa

Pregled: 28. oktobar 2026. Nastavak [draft PR-a #1378](https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA/pull/1378), od revizije `e2820791a0bff57a46233ac81371ec74e4f2eb93` (stablo `d011dce835889ef1ac6e8b09aed5e351f6390eac`). Osnovni inventar i probni uvoz već postoje; ova dopuna razrešava poreklo referenci i dokumentovane statuse. Predlog `OKRID-2026-AGENT-MIGRATION-001` ostaje proposed, bez odobrenja izvršavanja.

## Poreklo dve nedostajuće komponente

| Referenca | Uvođenje reference | Dokaz i zaključak |
|---|---|---|
| `.github/workflows/extrimli-cuz-validator.yml` | [b2815e61](https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA/commit/b2815e61db1d238bb5a8d27bc21fafcf363dd374), 12. avgust 2026, PR #906 | Commit dodaje konfiguraciju, AGENTS opis, modul i testove, ali nijedan workflow. Referenca je od početka bez odgovarajuće datoteke. |
| `.github/workflows/mrkli-mrak-validator.yml` | [a31b33a7](https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA/commit/a31b33a708fcc3c42c04e26b90ec99cb5eaa1adf), 16. avgust 2026 po vremenu Srbije (15. avgust UTC), PR #932 | Commit dodaje konfiguraciju, AGENTS opis, modul, API, dokument i testove, ali nijedan workflow. Referenca je od početka bez odgovarajuće datoteke. |

Proverena je kompletna istorija dostupna iz head-a PR-a: **4223 commit-a**, non-shallow clone. `git log` za obe putanje je prazan; GitHub commits API za iste putanje/ref takođe vraća `[]`. Pregled promena u `.github/workflows` ne pokazuje preimenovanje ili brisanje tih fajlova. Zaključak je **neimplementirane namenske workflow datoteke u istoriji ove grane**, a ne izgubljeni ili preimenovani workflow-i. To nije tvrdnja o svim nedostupnim/obrisanim granama ili drugim repozitorijumima.

Provera sličnih postojećih definicija:

- `extrimli-validator.yml` pokriva druge EXTRIMLI domene; nije preimenovani CUZ validator.
- `extrimli-spaja-deploy.yml` sadrži direktan poziv CUZ testova i širi deploy proces. `extrimli-trance-extrem-deploy.yml` sadrži uslovni CUZ test i post-deploy proveru sa `|| echo` fallback-om. To dokazuje delimično pokrivanje modula, ne ekvivalentnost posebnog validatora, obavezno uspešan rezultat ili pravo aktivacije. Nisu mapirani kao zamene.
- Nijedna trenutna workflow definicija ne pominje `mrkli-mrak`. Njegovi unit/API testovi postoje i mogu se pokrenuti lokalno; to nije workflow implementacija.
- Zajednički `omega-auto-build.yml` ostaje zajednička CI zavisnost; ne zatvara nedostajući namenski workflow.

Obe originalne reference ostaju u konfiguraciji kao nerešene zavisnosti. Inventar zadržava `incomplete-definitions` i konkretne `missing-workflow:<path>` blokade. Nije kreiran placeholder YAML niti nagađana zamenska putanja.

Reprodukcija istorijskog nalaza:

```sh
git rev-list --count e2820791a0bff57a46233ac81371ec74e4f2eb93
git log e2820791a0bff57a46233ac81371ec74e4f2eb93 --full-history --name-status -- .github/workflows/extrimli-cuz-validator.yml .github/workflows/mrkli-mrak-validator.yml
git show b2815e61db1d238bb5a8d27bc21fafcf363dd374 -- .agent-config.json
git show a31b33a708fcc3c42c04e26b90ec99cb5eaa1adf -- .agent-config.json
git log e2820791a0bff57a46233ac81371ec74e4f2eb93 --name-status -- .github/workflows
```

## Statusi i primenjene ispravke

`.agent-config.json` i svih 79 workflow datoteka ostaju identični početku ove dopune. Sačuvano je svih 43 unosa i svih 43 `enabled` vrednosti, uključujući tri isključena agenta.

| Identitet/grupa | Konfiguracija | Dokumentacija posle ispravke | Preostala izvršna zavisnost |
|---|---|---|---|
| `calculator-validator-agent` | `enabled: false` | Disabled u SR/EN, umesto Active | Workflow ima PR/push/manual okidače i poziva spolja referenciran `_validator-template.yml@main`; sprovođenje zastavice nije dokazano. Konfiguracioni IO-OPENUI-AO scope / `calculator-tests` alias nije isto što i lokalni poker testovi u workflow-u. |
| `deploy-bot` | `enabled: false`, deklarisani `merge-to-main` | Disabled u SR/EN, umesto Planned; tabelarni workflow okidač ispravljen u Manual workflow_dispatch (fallback) | `vercel-deploy.yml` je ručni fallback, a ne automatski merge okidač. Konfiguracionu semantiku, produkcionu potvrdu i spoljne deploy integracije treba posebno pregledati. |
| `gigatron-validator-agent` | `enabled: false` | Disabled u SR/EN, umesto Ready | Workflow ima PR/push/manual okidače; nijedna njegova direktna provera ne vezuje pokretanje za ovu zastavicu. `gigatron-tests` alias ostaje nerešen. |
| CUZ i MRKLI MRAK | `enabled: true`, `status: active` | Missing workflow u SR/EN; opis radnji je nameravano ponašanje | `configured-active-but-workflow-missing` je eksplicitni nalaz; oznaka active nije dokaz izvršavanja. |
| Šest ranije nedokumentovanih konfigurisanih agenata | Neizmenjeno | Dodati SR/EN opis uloge, postojeći workflow, okidači i Configured status | Vlasnik pojedinačne uloge nije potvrđen: Unassigned; runtime ostaje neproveren. |
| 16 identiteta izvan `agents` | Nisu dodati u katalog | Documented only u obe tabele | Workflow/feature-track postojanje ne daje članstvo u katalogu niti pravo uvoza/izvršavanja. |

Šest dopunjenih uloga potiče isključivo iz postojećih izvora:

| Agent | Izvor workflow ponašanja |
|---|---|
| `aktiviti-all-validator-agent` | `aktiviti-all-validator.yml` |
| `another-races-ops-agent` | `back-to-spaces-another-races.yml` |
| `digitron-validator-agent` | `digitron-validator.yml` |
| `geografija-realna-validator-agent` | `geografija-realna-validator.yml` |
| `okrid-governance` | `okrid-weekly-review.yml` |
| `tacskrin-validator-agent` | `tacskrin-validator.yml` |

Van kataloga ostaju `agent-resilience`, `astronomik-money-validator-agent`, `dijagnoza-validator-agent`, `dinosaurus-trexar-validator-agent`, `discount-telecom-validator-agent`, `dnevna-svetlost-validator-agent`, `dresing-validator-agent`, `ekvivalent-network-validator-agent`, `ekzist-validator-agent`, `epekm-denter-validator-agent`, `force-validator-agent`, `persona-bank-agent`, `swiming-validator-agent`, `tajming-validator-agent`, `trikot-validator-agent` i `zlatni-racuni-validator-agent`. Četiri postojeća feature-track unosa ostaju izvan `agents`; nazivi se ne spajaju po sličnosti.

Generator sada proverava konflikt u bilo kojoj jezičkoj varijanti, aktivnu deklaraciju uz isključenu konfiguraciju, aktivnu deklaraciju uz nedostajući workflow i postojanje workflow-a uz isključenu konfiguraciju bez dokaza da zastavica kontroliše pokretanje. `Configured` i `Missing workflow` su razdvojene oznake kataloga/implementacije; nijedna nije dokaz runtime zdravlja.

## Regresije i dostupne provere

- **57/57** testova inventara: prethodnih 46 nastavljeno uz 11 novih regresija. Pokriveni su svi SR/EN statusi, tri zaštićena isključena unosa, oba nedostajuća workflow-a uprkos prisutnom omega workflow-u, odbijanje uklonjenih blokada iz uvoza, šest dopunjenih uloga i svih 16 identiteta izvan kataloga. [TAP](evidence/spaja-agent-inventory-tests.tap).
- Postojeće Deploy/provider/authorization/UI/budget regresije: **6/6 test fajlova**. [TAP](evidence/spaja-agent-deploy-regressions.tap).
- CUZ unit testovi, MRKLI MRAK unit i API testovi: **3/3 test fajla**, preko `node --import tsx --test`; lokalno izvršavanje testova nije pokretanje agenata. [TAP](evidence/spaja-agent-reference-domain-tests.tap).
- Ciljani ESLint i aplikacioni `tsc --noEmit --incremental false`: prolaz. `npm ci --ignore-scripts --no-audit --no-fund`: prolaz, bez promena lockfile-a.
- Standardni `npm test` prolazi inventarski paket, zatim staje na postojećem `tsx` IPC `listen EPERM`; ostatak suite-a nije potvrđen. Standardni smoke ima isti problem; direktni `node --import tsx` smoke prolazi **43/43**.
- `predeploy:check`: exit 0, uz postojeća MAKSIMUS2/3 contract upozorenja. Deterministički inventar/dry-run i `git diff --check`: prolaz. Snimci su osveženi zato što vezuju stvarne bajtove AGENTS/generatora, bez novog runtime uvoza.
- Puni build, kompletan CI, produkciona spremnost i runtime kompatibilnost nisu potvrđeni. Raniji puni lint/audit nalazi iz glavnog izveštaja ostaju otvoreni; zavisnosti nisu unapređivane.

## Preostale zavisnosti i granica promene

1. Dva namenska validatora zahtevaju poseban predlog implementacije, pregled dozvola i odobrenje; ne zamenjivati ih deploy workflow-ima.
2. Potrebna je eksplicitna odluka kako `enabled` treba da kontroliše GitHub workflow-e. Ova dopuna ne uvodi automatizam, dispatch ili promenu okidača.
3. Ostaju nedostajući dokumenti `docs/EXTRIMLI-CUZ.md` i `docs/ANOTHER-MAKS.md`, nerešeni test-suite/linked-agent aliasi, neproverene spoljne reusable/action reference i dupli engleski NUDE odeljak. Odsustvo dokumenta se ne skriva dodavanjem izmišljenog sadržaja.
4. Izvršni adapter, izolacija, efektivne dozvole, budžet, audit, stop/recovery i ljudski/security pregled i dalje su preduslovi. **43/43** prihvatljivo za metapodatke; **0/43** kompatibilno za izvršavanje.

Rollout: postojeća razvojna grana i draft pregled, bez merge-a ili produkcionog deploymenta. Nema promene registara, konfiguracionih zastavica, workflow definicija, odobrenja ili budžeta. Trošak lokalnih provera nije novčano izmeren; nema nove infrastrukture ili odobrenog troška. Downstream: nema izmena u IO-OPENUI-AO niti drugim repozitorijumima. Rollback: revert dopune dokumentacije, generatora, regresionih testova i njihovih dokaznih snimaka; nema izvršenih agenata ili migracije baze za vraćanje.
