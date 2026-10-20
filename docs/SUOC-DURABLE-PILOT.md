# SUOC / VRH — lokalni pilot sa oporavkom

Osnova: `af1e556df3702eb3b7b8134825b9a42231813fa7`, posle spajanja VRH PR-a #1358.
Ovaj korak dodaje proverljiv tok: plan → raspoređivač → postojeći SUOC/VRH →
SQLite rezultat → pregled posle restarta. To je zaseban lokalni servis za jednog
operatera, bez nove zavisnosti i bez promene Next.js produkcionih ruta.

## Pokretanje

Potreban je Node.js 24 (lokalno provereno na 24.19.0) i instalirane projektne
zavisnosti. Koristi se ugrađeni `node:sqlite`:
https://nodejs.org/download/release/latest-v24.x/docs/api/sqlite.html

```sh
npm ci --ignore-scripts
npm run suoc:pilot
```

Otvorite adresu koju servis ispiše, podrazumevano `http://127.0.0.1:4318`.
U interfejsu: **Učitaj A → B primer → Sačuvaj zadatak → Nastavi**.
Korak A sabira 1–3 i vraća 6. Korak B čeka uspešan A, uzima njegov sačuvani
rezultat kao početak i sabira 6–8 do 21.

Podrazumevana baza je `.suoc-pilot/pilot.sqlite` (izuzeta iz git-a).
Opcione konfiguracione promenljive, bez tajnih vrednosti:

- `SUOC_PILOT_DB`: putanja do SQLite datoteke na trajnom lokalnom disku;
- `SUOC_PILOT_PORT`: lokalni port (podrazumevano 4318).

Servis se uvek vezuje za `127.0.0.1`. Nemojte ga izlagati kroz reverse proxy,
tunel ili javni port. Zatvara se Ctrl+C. Posle ponovnog pokretanja sa istom
bazom interfejs prikazuje sačuvane zadatke i rezultate.

## Ugovor plana i izvršavanja

- Plan ima naziv i 1–8 jedinstvenih koraka, svaki sa postojećim VRH JSON
  zahtevom. Svi profili 0.1–0.4 prolaze originalnu validaciju.
- `dependsOn` je lista ID vrednosti koraka. Ciklusi, nepoznate zavisnosti,
  duplirani ID-jevi i nepoznata polja plana se odbijaju pre upisa.
- Opcioni `startFrom` preuzima numerički izlaz direktne uspešne zavisnosti u
  polje `start`, samo za FOR profil 0.1. Ulaz se ponovo proverava posle zamene.
- Zbir deklarisanih budžeta je do 1000 iteracija i 1000 ms po planu.
- Novi zadatak je pauziran. Nastavi omogućava izvršavanje; lokalni radnik
  uzima po jedan spreman korak. Koristi `SpajaRuntime.aktiviraj` i `vrh`.
- Pauza i otkazivanje deluju između sinhronih koraka. Nema prinudnog prekida
  usred numeričkog runnera, hard timeout-a, distribuiranog rada ili soft degrade-a.
- Neuspešan/nepotpun VRH rezultat zaustavlja zadatak; zavisni koraci ne kreću.
- Izvršeni uspešni koraci ne ponavljaju se pri retry-u. Najviše tri pokušaja
  po koraku; retry priprema zadatak u pauziranom stanju, pa traži Nastavi.
- Ograničenja pilota: 64 KiB HTTP telo, 100 zadataka, 256 KiB rezultat koraka.
  Posle 500 događaja korisničke komande za postojeći zadatak se odbijaju.
  Nema automatskog brisanja podataka; za novu sesiju odaberite novu bazu.

## Trajnost i oporavak

SQLite koristi WAL i `synchronous=FULL`. Svaka promena stanja i pripadajući
revizijski događaj upisuju se u istoj transakciji. Korak se prvo trajno označi
kao running, zatim izvrši, pa se rezultat i završni status upišu zajedno.

Pri restartu svaki running korak postaje interrupted. Servis ne pretpostavlja
da je ranije izvršavanje završeno; potreban je eksplicitni retry i Nastavi.
Queued zadaci koji su prethodno pokrenuti nastavljaju se; paused ostaju paused;
succeeded/failed/canceled ostaju sačuvani. Već potvrđeni rezultati se ne izvršavaju
ponovo. Ako proces padne posle računanja a pre potvrde upisa, računski korak
može biti ponovljen nakon operaterovog retry-a — nema exactly-once garancije.

Posebna SQLite `.lock` datoteka drži ekskluzivno vlasništvo tokom života servisa.
Drugi servis sa istom bazom se odbija. Operativni sistem oslobađa zaključavanje
i posle SIGKILL; ne uklanjajte lock datoteku dok servis radi.

Revizijski lanac SHA-256 obuhvata broj događaja, ID zadatka, vreme, vrstu,
detalj, hash celog stanja i prethodni hash. Proverava se pri čitanju i pre
izmene; neslaganje blokira nastavak. To nije WORM, kriptografski potpis ili
spoljno usidren zapis. Vlasnik diska može izmeniti ili vratiti celu bazu i lanac.
Trajnost zavisi od diska i okruženja; ephemeral/serverless filesystem nije podržan.
Za kopiju zaustavite servis i sačuvajte ceo direktorijum baze.

## Pristup i interfejs

Tačan loopback Host, Origin i Fetch Metadata provere i obavezno API zaglavlje
odbijaju pozive iz drugih browser izvora. Nema CORS dozvole. UI koristi
`textContent`, CSP i zabranu uokviravanja. Status uvek ima tekst uz boju.
Napredak je broj uspešnih koraka / broj koraka tog zadatka; nije procenat
izgrađenosti cele platforme. Panel se osvežava na 1,5 sekundi dok je otvoren.

Lokalni procesi i drugi korisnici istog računara mogu pristupiti loopback portu.
Ovo nije korisnička prijava, RBAC, zaštita za javni servis ni daljinska
notifikacija. Ne koristi demo OTP tok kao identitet. Baza/putanja se ne biraju
HTTP zahtevom. Servis izvršava samo postojeće numeričke VRH operacije;
ne prima proizvoljan JS, shell, mrežne pozive ili komande za rad sa fajlovima.

## Provere i pregled

```sh
npm run test:suoc:pilot
npm run test:suoc
```

Integracioni testovi uključuju dva stvarna procesa lokalnog servisa sa
prekidom SIGKILL između njih, opstanak rezultata, prekid neposredno posle
trajnog preuzimanja koraka, retry bez ponavljanja uspešnog A, zavisnosti,
nepotpune rezultate, limit pokušaja, zaključavanje baze i oštećenje revizije.
HTTP provera sama ne dokazuje browser klikove ili raspored elemenata.
Tačni rezultati izvršenih provera i preostale provere navode se u PR-u.

Izvršeno 20.10.2026. na ovom kodu:

- 18/18 testova lokalnog pilota prolazi, uključujući stvarni HTTP servis,
  SIGKILL/restart, atomsku transakciju pri neuspelom upisu revizije i oporavak.
- Postojeći SUOC skup: 7/7 osnovnih, 17/17 lifecycle i 49/49 VRH slučajeva.
  To je 73/73 zasebnog regresionog skupa, ukupno 91/91 ova dva skupa.
- Puni projektni TypeScript, zasebni strogi TypeScript pilota/testa/CLI-ja,
  ciljani ESLint i sintaksna provera browser JavaScript-a prolaze.
- Stvarni browser klikovi nisu provereni: preuzimanje Chromium Headless Shell-a
  nije uspelo (prazna/neispravna ZIP arhiva). Puni Next.js build i udaljeni CI
  nisu izvršeni za ovu promenu. Nije pokrenut deployment.

Pri pripremi promene pronađen je dupliran `test:core` ključ u spojenom
`package.json`: drugi ključ je prekrivao VRH test dodajući login security test.
Sada postoji jedan ključ koji uključuje oba testa. Novi pilot se pokreće zasebno
preko `test:suoc:pilot`; zahteva Node 24. U prvobitnom pilot PR-u nije bio
automatski dodat CI-ju. Dopuna [VRH GitHub provere](VRH-GITHUB-VALIDATION.md)
uključuje ga u `npm run test:vrh` i zaseban GitHub Actions workflow.

Rollout: draft PR → ljudski pregled → kontrolisano lokalno pokretanje.
Rollback: zaustaviti servis i vratiti promenu; korisničku bazu ne brisati.
Nema SQL migracije nad postojećim SPAJA/Supabase bazama, novih npm zavisnosti,
promene produkcionog hostinga, deployment-a ili downstream izmene IO-OPENUI-AO.
SPAJA SERVER/BAZA u udaljenoj infrastrukturi ostaju zaseban posao.
