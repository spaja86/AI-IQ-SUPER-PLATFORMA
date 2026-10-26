# SPAJA — lokalni orkestrator razvojnih zadataka, prototip v1

Osnova: `f6c2be5b25d5849193c9067b1f3f5aa67480d4ef`, 26.10.2026.
Zahtev: kontrolisani automatski razvoj u prozoru od 3 sata, sa konfiguracijom
budućih režima 6, 9, 12, 15, 18 i 24 sata. Ovaj PR dodaje lokalni CLI i stvarne,
usko ograničene razvojne zadatke. **Nije potvrđen neprekidan rad od tri ili 24
sata, niti servis koji samostalno razvija proizvoljne aplikacije.**

## Granica prema SUOC / VRH

Numerički [SUOC pilot](SUOC-DURABLE-PILOT.md) ostaje zaseban: njegovi postojeći
VRH profili, najviše osam koraka i zbirni numerički budžet ostaju neizmenjeni.
Novi `Store` preuzima njegov provereni obrazac SQLite WAL + `synchronous=FULL`,
ekskluzivnog SQLite zaključavanja i atomske promene stanja sa revizijom.
Namerno ima zasebnu bazu, šemu i scheduler. Numerički uspeh nije dokaz da je
aplikacija izgrađena. Nema prevođenja VRH koraka u proizvoljan shell.

| Adapter | Stvarno izvršavanje | Granica |
| --- | --- | --- |
| `file-manifest` | Čita eksplicitne izvorne fajlove i čuva SHA-256 inventar | Do 32 fajla, po 1 MiB; bez skrivenih putanja, symlinkova i izlaska iz workspace-a |
| `generate-module` | Kreira `.mjs` modul i njegove Node testove iz ograničenog nacrta | Samo ugrađeni `sum` i `clamp`; ne prihvata izvorni kod ni AI prompt |
| `verify-module` | Proverava tačan generisani izvor, pravi zasebnu kopiju i izvršava stvarne Node testove | Zavisnost mora biti uspešan `generate-module`; izmenjeni artefakti se odbijaju |

Novi adapteri, opšti build/test repozitorijuma, refaktorisanje, AI generisanje,
git push/merge i deployment nisu implementirani zadaci. Primer demonstrira
stvarni tok inventar → generisanje koda → izvršavanje testova.

## Lokalno pokretanje pod nadzorom

Potreban je **Linux, Node.js 24, GNU `/usr/bin/timeout`, `/usr/bin/prlimit` i
čitljiv procfs**. Novi CLI nema npm zavisnosti. Windows, macOS, serverless,
mrežni disk i distribuirano izvršavanje nisu podržani ovim prototipom.
Koristiti zaseban lokalni direktorijum izvan repozitorijuma na trajnom disku:

```sh
node scripts/spaja-dev-orchestrator/cli.mjs create ../spaja-dev-state/session.sqlite docs/examples/spaja-dev-3h.json .
node scripts/spaja-dev-orchestrator/cli.mjs run ../spaja-dev-state/session.sqlite
```

`create` samo upisuje plan. `run` otvara foreground CLI; **ne pokreće zadatke**.
U njegov standardni ulaz uneti eksplicitnu komandu:

```text
start
status
pause
retry
resume
status
quit
```

Ovo je ilustracija komandi, ne skripta koju treba poslati odjednom. `start`
važi samo za nov plan. `pause` trajno beleži nameru i prekida aktivni proces;
ako je korak prekinut, prvo je potreban `retry`, pa `resume`. Ako je pauza
stigla između koraka, dovoljan je `resume`. `cancel` je konačan. `quit`, EOF,
Ctrl+C i SIGTERM zaustavljaju lokalni radnik i zatvaraju bazu. Posle završetka
svih zadataka CLI čeka operatera; `quit` ga zatvara. Nema pozadinske instalacije,
cron-a ili systemd jedinice. Ne koristi `nohup` kao zamenu za nadzirani pilot.

Kada CLI ne drži bazu otvorenu:

```sh
node scripts/spaja-dev-orchestrator/cli.mjs status ../spaja-dev-state/session.sqlite
node scripts/spaja-dev-orchestrator/cli.mjs audit ../spaja-dev-state/session.sqlite
```

Drugi proces sa istom bazom se odbija. Dok CLI radi, koristi njegove komande
`status` i `audit`. Baza sadrži jednu sesiju; za novi plan izabrati novu bazu.
Uspeh se vidi po tekstualnim statusima, izlazu testova, inventaru i fajlovima u
`session.sqlite.artifacts/<session-id>/<task-id>-<attempt>/`. Artefakti nisu
automatski kopirani u aplikacioni kod, objavljeni ili spojeni u Git.

## Vreme i ograničenja

`hours` prihvata samo `3, 6, 9, 12, 15, 18, 24` i podrazumeva `3`. Rok je
jednom zabeležen pri `start`. Pauza, restart i retry **ne produžavaju rok**.
Red se završava ranije ako završi sve zadatke, naiđe na grešku ili iscrpi budžet.
Vremenski prozor nije obaveza da radnik tri sata proizvodi nove zadatke.

| Kontrola | Podrazumevani maksimum u v1 |
| --- | --- |
| Konkurentnost | Jedan aktivan zadatak po bazi |
| Plan | 1–64 zadatka; JSON CLI ulaz do 64 KiB; aciklične zavisnosti |
| Pokušaji | Najviše 3 po zadatku; ručni retry, bez automatskog ponavljanja |
| Vreme zadatka | 30 s; uključuje pripremu i start procesa; dodatni watchdog prekida proces |
| Zbirni budžet zadataka | 600.000 ms rezervacija; primer koristi 180.000 ms |
| CPU | OS limit po pokušaju, zaokružen na celu sekundu |
| V8 heap / RSS stabla zadatka | 64 MiB heap / 192 MiB RSS; RSS se proverava periodično na 25 ms |
| Izlaz / artefakti | 16 KiB uhvaćenog stdout+stderr / 64 KiB artefakata po pokušaju |
| Trošak eksternih operacija | `costMicros: 0`; svaka pozitivna vrednost je odbijena |
| Operaterske promene | Najviše 512; konačni cancel ostaje dostupan |

Sve `limits` vrednosti mogu se smanjiti u granicama validatora. U v1 se ne mogu
povećati preko gornje tabele. Dakle, ni režim od 24 sata ne daje 24 sata CPU rada.
Zbirni budžet konzervativno rezerviše ceo `taskMs` **pre** pokretanja; rezervacija
ostaje potrošena i pri brzom uspehu, grešci ili padu procesa. Ne postoji tvrdnja
da je to izmerena CPU potrošnja. Host/struja/disk nisu pokriveni novčanim metrom.

Supervisor je odvojen proces koji može prekinuti blokiran zadatak. GNU timeout
je dodatni nezavisni watchdog koji ostaje aktivan i ako supervisor padne. CPU
limit je OS kontrola; RSS je periodična zaštita i može kratko prekoračiti prag.
Ovo nije cgroup hard limit ukupne memorije računara. Maksimalna veličina pojedinog
fajla ograničena je i OS pravilom; zbir artefakata proverava se pre potvrde uspeha.

## Oporavak, revizija i granice zaštite

Pre izvršavanja se trajno beleže pokušaj, token, rezervacija i rok izvršavanja.
Rezultat se potvrđuje tek posle zatvaranja nadzornog procesa. Stari tokeni ne
mogu potvrditi novi pokušaj. Uspešni zadaci se ne ponavljaju. Posle restarta
aktivna sesija je pauzirana; running zadatak je interrupted. Čak i restart
između koraka zahteva `resume`. Zakasneli uspešan callback posle roka ili
otkazivanja ne vraća sesiju u uspešno stanje.

Posle SIGKILL-a nije poznato da li je artefakt delimično ili potpuno napravljen.
Pregledati rezultat i stare procese; retry je odbijen pre isteka sačuvanog roka
pokušaja plus 2 s. Novi pokušaj dobija novu putanju; stari fajlovi se ne prepisuju.
Nema exactly-once garancije za proizvoljne spoljne efekte. Takvi adapteri se
zato ne prihvataju. Pouzdan host sat je pretpostavka; primećeno vraćanje sata
unazad blokira promene. Skok unapred može ranije isteći prozor. Simulirani sat
postoji samo kao injekcija za `Store` testove, nije CLI opcija za zaobilaženje roka.

Stanje i SHA-256 revizijski događaj upisuju se u istoj SQLite transakciji.
Lanac se proverava pri čitanju i pre svake promene; oštećenje blokira rad.
To nije WORM, spoljno usidren ili potpisan log. Vlasnik diska može vratiti celu
stariju kopiju baze. Za backup prvo zaustaviti CLI i kopirati ceo direktorijum,
uključujući artefakte; ne brisati `.lock` datoteku dok proces radi.

Nema HTTP porta. CLI i baza pripadaju lokalnom operateru. Task proces dobija
prazno okruženje osim jezika/vremenske zone, bez kredencijala i `NODE_OPTIONS`.
Nema shell-a, proizvoljnih komandi, instaliranja paketa ili mrežnog adaptera.
Node 24 `--permission` nije sandbox za zlonameran kod i ne garantuje mrežnu
izolaciju. Zaštita od API troškova ovde dolazi iz zatvorene liste ugrađenih
adaptera bez mrežnih poziva, ne iz tvrdnje da Node 24 blokira mrežu. Workspace,
repozitorijum i operater moraju biti pouzdani; TOCTOU napadi lokalnog vlasnika
diska nisu obuhvaćeni. Opšti izvršavač zahteva poseban OS sandbox i novu reviziju.

## Provere i status isporuke

```sh
node --test --test-concurrency=1 src/tests/spaja-dev-orchestrator/*.test.mjs
npm run test:suoc
npm run test:suoc:pilot
```

Novi testovi obuhvataju sve vremenske režime preko simuliranog sata, stvarno
generisanje i Node testove, konkurentno preuzimanje, SIGKILL/restart, audit
oštećenje, rollback neuspelog upisa, zavisnosti, budžete, stare tokene, prekid,
memoriju, zatrpavanje izlaza, pad supervisor-a i zatvaranje CLI-ja.

Poseban workflow `SPAJA local development orchestrator checks` je isključivo
`workflow_dispatch`: pokreće kratke testove, bez višesatne sesije, instaliranja
projektnih paketa ili deployment-a. U ovoj isporuci nije pokrenut. Standardni
`npm test` ne uključuje novi `.mjs` skup automatski.

Tačni lokalni nalazi su u [izveštaju provere](SPAJA-LOCAL-DEV-VERIFICATION-2026-10-26.md).
Režimi 3–24 h su provereni simuliranim vremenom; potrebno je zasebno nadzirano
višesatno probno izvršavanje na ciljnom serveru pre operativne upotrebe.

Rollout: draft PR → ljudski pregled → nadzirana lokalna sesija. Bez automatskog
merge-a, produkcije i plaćenih AI operacija. Rollback: zaustaviti CLI, vratiti
ove dodatne fajlove; sačuvati bazu/artefakte. Nema migracije SUOC/Supabase baze,
novih npm zavisnosti ili downstream promene ugovora sa IO-OPENUI-AO.
