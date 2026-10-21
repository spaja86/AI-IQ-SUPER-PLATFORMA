# SPAJA MASTER OMEGA — proverljiv katalog odnosa

Razlog promene: nastavak PR-a #1363 po zahtevu korisnika, na osnovi
`f6c2be5b25d5849193c9067b1f3f5aa67480d4ef`. Proširenje čini prirodu i
nedovršeni deo svake veze vidljivim, bez dodavanja izvršnih adaptera.

## Obim i cilj 270

| Obim | Broj |
| --- | ---: |
| Postojeći moduli | 23 |
| Opisani usmereni odnosi | 64 |
| Implementirani u lokalnom obimu | 4 |
| Delimični | 3 |
| Planirani | 57 |
| Razvojni cilj | 270 |
| Još nerazrađeni odnosi do cilja | 206 |

Svih 25 originalnih parova sa svojim tipovima ostaju u katalogu; dodato je
39 odnosa. `recovery → storage / control` je preciziran kao delimičan, jer
`PilotStore` već oporavlja prekinuto stanje i čuva uspešne korake, dok backup
i restore tek treba implementirati. Dva nova delimična odnosa opisuju
lokalne pristupne provere i prikaz statusa, uz nedostajuće RBAC i alarme.
Ovo je reklasifikacija dokumentovanog obima, ne aktiviranje servisa.

Prethodni korisnikov `spaja_270_konekcija.json` označen je
`architecture-proposal-1.0`, `implementation_status: not verified`.
U pregledanom delu koristi nazive podmodula (`SNOE.VisualMind`,
`SUOC.Activate`…) i generičke šeme. Nije automatski uvezen kao 270 aktivnih
veza niti preslikan na 23 modula bez dokaza. Novi odnosi su pojedinačno
opisani; nema kartezijanskog generisanja ili popunjavanja do željenog broja.

## Model i validacija

`OmegaRelation<OmegaModuleId>` vezuje izvore/odredišta za postojeću uniju
23 identifikatora. Svaki odnos sadrži:

- Stabilan `id = omega-{from}-{to}-{kind}`; smer je izvor → odredište.
- `kind`: kontrola, podaci ili praćenje; `purpose`: konkretna namena.
- `contract`: okidač, ulazni podaci, očekivani izlaz i ponašanje pri grešci.
- `state`: `implemented`, `partial` ili `planned`.
- `evidence`: putanje koda/testova i precizno potvrđeni obim.
- `activation`: nedostajući rad i proverljiv kriterijum prihvatanja.

Identitet odnosa je **(from, to, kind)**. Dva ista identiteta su duplikat čak
i kada su dobila različit ID. Obrnut smer ili drugi tip veze predstavlja
zaseban odnos sa sopstvenim ugovorom. Samoreference nisu dozvoljene.

`validateOmegaCatalog(unknown)` proverava oblik, dozvoljene statuse/tipove,
reference, jedinstvenost modula/ID-jeva/odnosa, kompletan tekst ugovora,
repo-relativne putanje dokaza i usklađenost statusa sa nedostajućim radom.
Implementirani i delimični odnosi zahtevaju kod i testove i ne mogu se
pozivati na modul označen kao planiran. Implementirani odnos nema
nedostajući rad **unutar svog navedenog obima**; delimičan i planiran moraju
navesti prepreke. Regresioni test proverava i postojanje referenciranih fajlova.

Katalog se validira pri učitavanju; nevalidan katalog prekida pokretanje
pilota pre otvaranja baze/servera. Brojači se izvode iz istog niza odnosa.
Ove provere dokazuju konzistentnost opisa, ne da je servis trenutno pokrenut
ili da navedeni test trenutno prolazi. Status implementacije menja se tek
posle pregleda koda i stvarnog integracionog dokaza.

`GET /api/omega` sada objavljuje `omega-relationships-v2`. Za odnose su
stari `local/proposed` zamenjeni sa `implemented/partial/planned`; statusi
modula ostaju `local/partial/planned`. Klijent odbija nepodržanu verziju.
Postojeće lokalne Host/Origin/header granice i GET-only ponašanje ostaju.
Nema novih HTTP endpoint-a, migracije baze ili izvršnih komandi.

## Analiza 23 modula

Status modula ostaje status integracije u ovom lokalnom skeletu. Postojanje
koda drugde u monorepo-u (npr. Transformers prototip) ne znači da njegov
Omega adapter postoji.

| Modul | Status modula | Ulazne | Izlazne | Razlog odnosa / granica |
| --- | --- | ---: | ---: | --- |
| SpajaNikOpenEvolution (snoe) | planned | 0 | 3 | Vizuelni scenario i prevod plana |
| I/O OpenUI / AO (openui) | planned | 1 | 3 | Namera, radni prostor i kvalitet sesije |
| SpajaUltraOmegaCore (suoc) | local | 2 | 1 | Postojeći lokalni dispatcher |
| AI IQ World Bank (bank) | planned | 2 | 4 | Isključivo finansijska simulacija i nacrti |
| Kompanija SPAJA (company) | planned | 1 | 3 | Brief, simulacioni budžet i predlog izdanja |
| Game platforme (games) | planned | 0 | 3 | Draft analiza i replay meča |
| Spaja Poker (poker) | planned | 0 | 3 | Pravila posebnog špila i turnirski replay |
| Transformers 1350 (transformers) | planned | 0 | 3 | Adapter lokalnog prototipa i offline analiza |
| Multi-Agent System (agents) | planned | 6 | 4 | Ograničeni poslovi, alati i dokazi |
| SPAJA Backend Core (backend) | planned | 9 | 5 | Ugovori zahteva, politika i skladištenje |
| VRH numeričko jezgro (vrh) | local | 5 | 1 | Dozvoljene numeričke operacije |
| Automation & Validation (automation) | planned | 3 | 3 | Determinističke provere vezane za reviziju |
| Naučni zapisi / OVSM (ovsm) | planned | 0 | 3 | Autorske formule, jedinice i poreklo |
| Kreativni koncepti (creative) | planned | 2 | 4 | Brief, verzije artefakta i predlog rendera |
| NBS komunikacija (nbs) | planned | 1 | 2 | Dokumenti i nacrti; bez slanja instituciji |
| GPU Compute Cluster (gpu) | planned | 1 | 3 | Ograničeni render poslovi i merljiv kapacitet |
| Data & Storage Layer (storage) | partial | 13 | 2 | Lokalni SQLite; druga skladišta planirana |
| Infrastructure & Cloud (cloud) | planned | 1 | 2 | Manifest i health; infrastruktura nije aktivirana |
| Security & Compliance (security) | partial | 2 | 2 | Lokalne provere; RBAC/sandbox politika planirani |
| Pipeline & Deployment (pipeline) | planned | 2 | 4 | Dokazi validacije; nema promocije iz ovog grafa |
| Failover & Recovery (recovery) | partial | 1 | 2 | Lokalni retry; backup/restore tek treba dokazati |
| Live Monitoring & Alerts (monitoring) | partial | 9 | 1 | Lokalni status; spoljna telemetrija/alarme tek povezati |
| Supervisor Control Panel (scp) | local | 3 | 3 | Ručne lokalne komande; šira delegacija planirana |

## Lokalni pregled

Pokrenuti `npm run suoc:pilot` sa Node.js 24 i otvoriti
`http://127.0.0.1:4318/omega` (ili port iz terminala).

1. Izabrati karticu ili modul iz padajućeg menija. Kartice prikazuju ulazni
   i izlazni broj; susedi izabranog modula su naglašeni.
2. Kombinovati status, tip i pretragu namene/modula/ID-ja. Brojač pokazuje
   broj vidljivih odnosa; ukupni brojači ostaju nefiltrirani.
3. Ulazne i izlazne veze prikazane su odvojeno sa strelicama, tipom i tekstom
   statusa. Status se razlikuje i stilom ivice, ne samo bojom.
4. Izabrati vezu mišem ili tastaturom za ugovor, dokaz, nedostajući rad i
   kriterijum prihvatanja. Detalj dobija fokus. Isti izbor postoji u tabeli.
5. Za prazne filtere prikazuje se poruka i sklanja zastareo detalj.
   „Obriši filtere“ vraća sve odnose; „Pregled SCP“ bira kontrolni modul.

Pregled i filtriranje šalju samo postojeći GET zahtev za katalog; ne kreiraju
zadatke. SCP dugmad i dalje koriste isključivo postojeći `pilot.js` tok.
Tekst se prikazuje sa `textContent`; putanje dokaza nisu izvršive komande.

## Sledeće proširenje ka 270

Sledeći odnos mora imati različitu odgovornost/ugovor, ne samo novo ime.
Redosled predloga: (1) adapteri postojećih lokalnih prototipova i read-only
izveštaja, (2) dokazi validacije/backup probe, (3) izolovani agentski/GPU
servisi nakon izbora infrastrukture i odobrenja. Podmoduli iz prethodnog
predloga zahtevaju posebno mapiranje na ove module. Nijedna faza nije
odobrenje za aktiviranje spoljnog servisa, plaćanje ili slanje poruke.

## Provera i granice

Lokalne komande za ovu promenu:

```sh
npm run test:suoc:pilot
npm run test:suoc
node --import tsx --test src/tests/spaja-ultra/pilot-browser.test.mjs
npx tsc --noEmit --incremental false
```

Browser testovi koriste opcioni Playwright/Chromium preko postojećih
`SUOC_PLAYWRIGHT_MODULE`, `SUOC_CHROMIUM_EXECUTABLE` i `SUOC_CHROMIUM_ARGS`.
Testni alati nisu dodati produkcionim zavisnostima. Regresije pokrivaju
nevalidan katalog, duplikate, reference, status/dokaze, očuvanje originalnih
25 odnosa, sve filtere, smer, nedostajuće delove, tastaturu, prikaz teksta,
prazne rezultate, reset, lokalni tok 6/21 i odsustvo izvršavanja pri pregledu.
Tačan rezultat završne lokalne provere beleži se u PR-u. Udaljeni CI,
puni aplikacioni build i produkciona spremnost nisu potvrđeni ovim dokumentom.

## Uvođenje i povratak

Zaseban draft PR → ljudski pregled → lokalno pokretanje. Nema izmene CI
pravila, zaštite main grane ili rada u PR-u #1364. Nema downstream promene
u IO-OPENUI-AO; njegov adapter je i dalje planiran. Nema novih operativnih
troškova, plaćenih servisa, migracija ili deployment-a. Za rollback zaustaviti
pilot, vratiti fajlove ovog PR-a i ponovo pokrenuti lokalni servis. Baza sa
korisničkim zadacima ostaje netaknuta.
