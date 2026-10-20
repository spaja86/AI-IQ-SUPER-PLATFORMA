# Nezavisna funkcionalna provera SUOC/VRH pilota — 20.10.2026.

## Odluka

**Spojeni pilot: jezgro trajnosti prolazi ciljane provere, ali panel zahteva ispravku pre pouzdanog operaterskog korišćenja.**
U originalnom panelu potvrđeno je otkazivanje drugog zadatka od onog prikazanog operateru.
Pripremljena ispravka i testovi prolaze; promena je namenjena zasebnom PR-u za pregled pre spajanja ili puštanja u rad.
Posle pregleda ispravke postoji osnova za kontrolisani lokalni pilot jednog operatera. Produkciona spremnost nije potvrđena.

Proverena osnova: PR [#1359](https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA/pull/1359),
merge commit `84bab3d1b3b16ce7452ee9df9b0519e69f6e4c65`, merge 20.10.2026. u 18:29:47 UTC / 20:29:47 Europe/Belgrade.
Izvorni opis: [SUOC-DURABLE-PILOT.md](https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA/blob/84bab3d1b3b16ce7452ee9df9b0519e69f6e4c65/docs/SUOC-DURABLE-PILOT.md).

## Metod i izolacija

- Zaseban checkout tačnog merge commita; Node.js 24.19.0, `npm ci --ignore-scripts`, Linux.
- Svaki test koristi novu privremenu SQLite bazu; restart koristi isključivo bazu tog testa.
- Stvarni lokalni HTTP servis vezan za `127.0.0.1`, nasumični portovi; nema proxy-ja, tunela ili javnog izlaganja.
- Stvarni headless Chromium 153.0.8010.0, Playwright 1.62.1. Klikovi, unos JSON-a i DOM provere nisu HTTP simulacija niti jsdom.
- Standardni Playwright download vratio je praznu/neispravnu ZIP arhivu. Lokalni Chromium je obezbeđen zasebnim testnim paketom `@sparticuz/chromium@153.0.0`; nema nove produkcione zavisnosti.
- Za pauzu/otkazivanje između A i B korišćen je postojeći `startPilot({intervalMs: 2500})` testni parametar. Ostali testovi koriste podrazumevani interval 150 ms. Ovo potvrđuje kontrolu na granici koraka, ne prinudno zaustavljanje usred računanja.
- Test preklapanja zahteva odlaže stvarni HTTP odgovor za Alpha; ne izmišlja sadržaj odgovora.
- Testovi SIGKILL prekida ubacuju kvar samo u testni proces neposredno pre `finish` upisa koraka B, po završetku stvarnog računanja. Produkcioni kod nema dodatni hook.

## Potvrđeni problemi i ciljana ispravka

### P1 — prikazani zadatak i cilj komande mogu se razlikovati

Original: `pilot/suoc/pilot.js`, `refresh`, izbor reda i handler kontrolnih dugmadi.

Reprodukcija: otvoriti Alpha; zadržati njegov odgovor detalja tokom osvežavanja; kliknuti Beta; pustiti Alpha odgovor; kliknuti Otkaži. U stvarnom Chromium-u panel prikazuje **Task Alpha**, dok server otkazuje **Task Beta**. Globalni `selected` promeni se tokom već aktivnog osvežavanja, koje se kasnije prikaže iz zastarelog odgovora.

Ispravka: generacija prikaza odbacuje zastarele odgovore; promena izbora odmah uklanja stari detalj i onemogućava kontrole; traženo osvežavanje se ponavlja posle tekućeg; komanda hvata ID trenutno potvrđenog prikaza. Komande se ne pokreću paralelno iz panela.

### P2 — zastareli zeleni uspeh ostaje vidljiv posle greške

Original: `refresh` catch prikazuje crvenu poruku, ali zadržava zelene bedževe i detalj prethodnog rezultata. To je reprodukovano posle zaustavljanja servisa i posle izmene revizijskih zapisa na testnoj bazi. Backend odbija oštećen zapis, ali UI i dalje prikazuje stari potvrđeni uspeh. Ovo je problem prikaza, ne dokaz da backend potvrđuje oštećeno stanje.

Ispravka: neuspešno osvežavanje uklanja nepotvrđene detalje i listu statusa, onemogućava kontrole i jasno navodi da stanje nije potvrđeno. Posle uspešnog oporavka prikaz se ponovo učitava i stara poruka o vezi se uklanja.

Tri browser regresije (pogrešan cilj, gubitak servisa, oštećen audit) ponovljene su nad originalnim panelom: **0/3 prolazi**. Sa ispravkom sve tri prolaze kao deo skupa od sedam scenarija. Rani probni browser harness imao je i timeout zbog nečekanja učitavanja primera; taj problem testnog harness-a je uklonjen i nije prijavljen kao kvar proizvoda.

## Automatski potvrđeni rezultati

| Provera | Originalni merge | Pripremljena ispravka |
|---|---:|---:|
| Postojeći integracioni testovi pilota | 18/18 | uključeni u 21/21 |
| Prošireni testovi pilota | nije originalni skup | 21/21 |
| SUOC regresije | 73/73 = 7 + 17 + 49 | 73/73 |
| Stvarni Chromium scenariji | tri ciljane regresije padaju | 7/7 |
| Puni projektni TypeScript `tsc --noEmit` | prolazi | prolazi |
| Ciljani ESLint, JS sintaksa, `git diff --check` | — | prolazi |

Nova tri integraciona slučaja dopunjuju stvarne rupe u prethodnih 18 testova:

1. **Neuspeh upisa rezultata/revizije** nakon uspešnog A: transakcija se vraća, B nema rezultat ni događaj uspeha; restart označava prekid; retry ponavlja samo B. Prethodni test je proveravao neuspeh upisa komande resume, ne rezultata.
2. **Stvarni HTTP worker prima SIGKILL posle računanja B, pre potvrde rezultata**: posle restarta A ima rezultat 6, B je interrupted bez rezultata; eksplicitni retry + resume završava sa 21, pokušaji `[1, 2]`, claim istorija `[A, B, B]`. Prethodni crash test prekidao je pomoćni proces neposredno posle claim-a.
3. **Prekinut HTTP upload plana**: nepotpuno telo ne kreira zadatak, servis ostaje dostupan i baza je prazna i posle restarta.

Za potvrđeni uspeh restart vraća isti dokument i revizijsku istoriju; pokušaji ostaju `[1, 1]`. Za prekid se kompletan potvrđeni A poredi pre i posle retry-a, ne samo njegov brojčani izlaz.

## Stvarno proverene browser interakcije

| Scenario | Potvrđeno |
|---|---|
| Učitaj primer → sačuvaj → Nastavi | A = 6, B = 21; svaki korak jedan pokušaj |
| Reload i restart sa istom bazom | Isti rezultati i događaji; bez ponavljanja uspešnih koraka |
| Pauziraj posle A → Nastavi | B miruje tokom pauze, zatim završava; A se ne ponavlja |
| Otkaži posle A | A ostaje succeeded, B canceled sa 0 pokušaja |
| Neispravan JSON / nepotpun numerički rezultat | Greška ili failed, 0/2 uspešnih; zavisni korak se ne izvršava |
| Pripremi ponovni pokušaj | Zadatak ostaje paused do posebnog klika Nastavi |
| Promena izbora uz odložen odgovor | Komanda cilja prikazani zadatak posle ispravke |
| Gubitak veze i povratak servisa | Nepotvrđeni status se uklanja, greška veze se čisti po oporavku |
| Oštećen revizijski zapis dok panel radi | Crvena greška, bez starog zelenog uspeha i dostupnih kontrola |
| SIGKILL pre potvrde B, restart, retry i resume kroz UI | interrupted → paused → succeeded, A očuvan, pokušaji `[1, 2]` |

Proverena širina prikaza 1280×900 i odsustvo horizontalnog preliva pri 390×844. Ovo nije sveobuhvatna vizuelna, accessibility ili međubrowser provera; Firefox, Safari, Android Chrome i čitači ekrana nisu testirani.

## Puni lanac i udaljeni CI

`npm test` je pokušano. Zaustavlja se pre prvog testa u `test:core`: `npx tsx` ne može da otvori IPC Unix socket (`listen EPERM /tmp/tsx-0/57.pipe`). To je blokada ovog razvojnog okruženja, ne potvrđena funkcionalna regresija pilota. Ciljani skupovi uspešno su izvršeni pomoću postojećih `node --import tsx` npm komandi. Puni lanac **nije uspešno verifikovan**. Puni Next.js build i repo-wide lint nisu ponavljani.

Za tačan merge SHA provereni su svi 3 vraćena push izvršavanja:

- [Multi-Repo Sync 39475242415](https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA/actions/runs/39475242415): startup_failure, 0 poslova.
- [Omega Sync Safety 39475240574](https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA/actions/runs/39475240574): failure, 1 posao bez koraka.
- [Security Scanner 39475240711](https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA/actions/runs/39475240711): failure; 3 neuspešna posla bez koraka, Dependency Review skipped.

Ovi podaci ne dokazuju uzrok neuspeha i nisu dokaz da su SUOC testovi tamo izvršeni. Nije pokrenut rerun workflow-a.

## Ponovljiva lokalna provera

```sh
npm ci --ignore-scripts
npm run test:suoc:pilot
npm run test:suoc
npx tsc --noEmit
npx eslint pilot/suoc/pilot.js src/tests/spaja-ultra/pilot.test.ts src/tests/spaja-ultra/pilot-browser.test.mjs
node --check pilot/suoc/pilot.js
git diff --check
```

Browser testovi namerno su zasebni, jer projekat nema Playwright kao deklarisanu zavisnost. Koristiti instaliran Playwright i lokalni Chromium. `SUOC_PLAYWRIGHT_MODULE` može biti apsolutna putanja do Playwright modula; ako nije postavljen, test traži `playwright`. `SUOC_CHROMIUM_EXECUTABLE` može pokazivati na već instaliran Chromium; bez njega Playwright koristi svoj instalirani pregledač. `SUOC_CHROMIUM_ARGS` je opcioni JSON niz argumenata za izolovano testno okruženje.

```sh
node --import tsx --test src/tests/spaja-ultra/pilot-browser.test.mjs
```

U ovoj proveri korišćeni su argumenti paketa `@sparticuz/chromium`, bez `--single-process`. Servis i pregledač su završeni po testovima, probne baze uklonjene. Testovi ne traže kredencijale niti pristup udaljenoj SPAJA bazi.

## Granice i predaja

Ostaju nepotvrđeni: korisnička autentifikacija/RBAC, udaljena SPAJA BAZA/SERVER, rad sa više čvorova, hard timeout i prekid usred sinhronog runnera, stvarni prekid napajanja/diska, distribuirane exactly-once garancije, produkcioni hosting i puni CI lanac. Loopback nije korisnička autentifikacija; hash lanac nije spolja usidren/WORM zapis.

Obim ispravke: `pilot/suoc/pilot.js`; dopuna `src/tests/spaja-ultra/pilot.test.ts`; novi opcioni `src/tests/spaja-ultra/pilot-browser.test.mjs`; ovaj izveštaj. Nema promene SQLite šeme, servera, worker-a, numeričkog izvršavanja, npm produkcionih zavisnosti ili hostinga.

Razlog promene: korisnikov zahtev za nezavisnu proveru PR #1359 i dva reprodukovana funkcionalna UI propusta. Početni pregled pripremljen je na grani `review/suoc-pilot-functional-readiness`. Nastavak je na izdvojenoj grani `fix/suoc-panel-consistency-20261020` u KRALJEVINA review forku. `AGENTS.md` nije menjan; potreban je ljudski pregled pre spajanja.

Ponovna provera istog dana u čistom checkout-u baze potvrđuje 21/21 pilot, 73/73 SUOC i 7/7 Chromium scenarija, puni TypeScript i ciljani ESLint bez grešaka. Testovi koriste privremene baze i lokalni servis; uspeh ne potvrđuje udaljeni CI niti produkcioni deployment.

Sledeće: ljudski pregled patch-a → provere u standardnom Node 24 okruženju → kontrolisani lokalni pilot. Rollback: vratiti samo izmenjene UI/test/doc datoteke i restartovati servis da ponovo učita statičke resurse; korisničku bazu ne brisati. KPI ovog pregleda su test-skupovi i tačne granice, ne procenat izgrađenosti SPAJA platforme. Nema downstream promene za IO-OPENUI-AO.
