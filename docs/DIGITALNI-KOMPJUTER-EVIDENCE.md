# SPAJA Digitalni Kompjuter: granice dokaza

Razlog izmene: korisnički zahtev od 17. oktobra 2026. Statička oznaka `aktivan` nije dokaz dostupnosti servera, dodeljenog hardvera/virtuelnih resursa ili izvršavanja poslova.

| Sloj | Izvor | Značenje |
| --- | --- | --- |
| Deklaracije | katalog komponenti, `statusScope: declaration-only` | Razvojne oznake, linkovi, kapaciteti i mogućnosti; katalog ostaje sačuvan. |
| Konfiguracija | `server.configurationScope: presence-only`, adapter `configured` | Prisustvo potrebnih promenljivih u procesu; `READY` znači samo da su prisutne, bez provere ispravnosti kredencijala ili rada provajdera. |
| Dostupnost | `server.availability` | `not-measured`, `checkedAt: null`, `source: null`, `availabilityVerified: false`. Nema mrežnih provera niti izmerenih CPU/GPU/RAM/cloud kapaciteta. |
| Izvršavanje | `server.execution` | `not-verified`, bez izvora/vremena potvrde; `executionEnabled: false`, `buildWorkerImplemented: false`, `providesJdk: false`. |

## API ugovor i kompatibilnost

Četiri javna digitalni-kompjuter GET endpointa dele presence-only izveštaj. HTTP 200 označava uspešno vraćen opis, ne zdravlje infrastrukture. `timestamp` je vreme odgovora, a ne vreme health provere. Nema automatske aktivacije, izdvajanja resursa ili izvršavanja.

`deklarisanoAktivnihKomponenti` broji katalog oznake. Staro `aktivnihKomponenti` polje ostaje prisutno, ali je sada `null`; `procenatAktivnih` u status/aktivacija API-ju je takođe `null`. Nepoznato nije 0% dostupnosti i nije 100% uspeha. Eksterni klijenti koji zahtevaju broj moraju prihvatiti `null` kao neizmereno. Zajednička statistika prenosi `null` i u postojeće Brouvzer API projekcije. B2B i Brouvzer prikazi koriste izričito deklarisani broj. Legacy helper `getAktivneKomponente` ostaje deklarativni filter, označen kao deprecated.

`status: aktivan` ostaje razvojna oznaka radi kompatibilnosti, uz obavezni `statusScope: declaration-only` na komponentama i konzolama. Razvojne mogućnosti servera (hosting, load balancing, auto-scaling, distribuirani resursi, klaster i edge) nisu uklonjene niti predstavljene kao izvršene.

## Lokalna validacija

Osnova: main `6235cb58d48e272fca2804845231b4afa373be13`.

- PASS: `node --import tsx src/tests/api/spaja-digitalni-kompjuter-evidence.test.ts`: četiri stvarna GET handlera × dve konfiguracije (prazna i sintetički popunjena), bez fetch poziva, bez izlaganja vrednosti konfiguracije, bez merenja ili izvršavanja. Proverava i očuvan katalog od 16 komponenti, razvojne mogućnosti servera i deklarativne UI oznake. Test je automatski otkriven postojećim `test:api` runnerom.
- PASS: `node --import tsx src/tests/digitalni-kompjuter/catalog.test.ts`.
- PASS: `node --import tsx src/tests/digitalni-kompjuter/finance-governance.test.ts` (šest scenarija).
- PASS: `node --import tsx src/tests/lib/spaja-server-control-plane.test.ts`.
- PASS: ciljani ESLint svih izmenjenih TS/TSX datoteka i novog testa; `git diff --check`.
- PASS: smoke testovi, 43/43. Poruka smoke skripte o go-live nije potvrda produkcione spremnosti.
- `npm run predeploy:check`: exit 0, warning za postojeće maksimus2/maksimus3 ugovore.
- Puna `tsc --noEmit --incremental false`: exit 2, greške u EXTRIMLI modulima izvan izmenjenih datoteka. Puna provera nije zelena.
- Puna test/lint matrica i produkcioni build nisu izvršeni u ovoj iteraciji. Browser E2E i dostupnost stvarnih provajdera nisu potvrđeni.

## Pregled i objavljivanje

Zaseban draft PR, obavezan ljudski pregled. Nema automatskog spajanja, deploymenta, promene konfiguracije, novih zavisnosti ili plaćenih servisa. Grana je u izolovanom fork-u sa nasleđenim Actions workflow-ima koji ostaju isključeni. Nema izmene IO-OPENUI-AO ili drugih povezanih repozitorijuma; eksterni potrošači ovog API-ja treba da prihvate `null`.

Rollback: revert ovog PR-a vraća prethodni ugovor i prikaz. KPI: nula neizmerenih health procenata prikazanih kao uspeh; svih 16 komponenti ostaje u katalogu. Buduće merenje mora imati izvor, vreme, obuhvat i politiku zastarevanja; ovaj PR ne uvodi takav probe ili ovlašćenje za izvršavanje.
