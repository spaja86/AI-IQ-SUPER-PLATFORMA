# AI IQ Operating Concept

## Svrha

Ovaj dokument postavlja zajednički smer za AI IQ SUPER PLATFORMU: stvarati korisne, proverljive proizvode uz jasnu podelu odgovornosti, bez predstavljanja deklarisanih modula kao fizičke infrastrukture, bankarskih usluga ili garantovanog prihoda.

## Konceptualni odnos

| Sloj | Uloga | Granica |
| --- | --- | --- |
| Digitalni Kompjuter | Deklarisana aplikaciona konfiguracija za komponente, konzole i status | Nije dokaz fizičkog hardvera, cloud kapaciteta ili izvršavanja poslova |
| Digitalni Brouvzer + gaming | Korisničko iskustvo za browser igre i kompatibilne runnere | Za VR su potrebni browser WebGL/WebXR capability check, konkretna igra i kompatibilan uređaj/headset |
| AI IQ Programski Jezik | Deterministička evaluacija, kompajliranje i objašnjenje DSL ugovora | Ne pokreće deploy, plaćanje ili automatizaciju bez posebnog, odobrenog toka |
| VRH / EXTREM / EXTRONDOL / SPAJA KOD | Tehnički readiness, governance i audit-safe javni summary | Postojeći source-of-truth ugovori ostaju zaključani |
| AI PLATE | Komercijalni AI proizvod za odobrene korisnike | Naplata, tenant izolacija, rate limiting, audit i human review su obavezni |
| AI IQ World Bank | Documentation-only approval/compliance/payout governance | Nije banka; nema račune, KYC, sekrete, transfer ili automatsku isplatu |
| Vercel | Stvarni deploy, observability i billing sistem | Fakture, planovi i plaćanje rešavaju se kroz Vercel billing, ne kroz aplikacioni narativ |

## Prava i odgovornosti

1. **Korisnici** dobijaju samo funkcije koje su vidljive, testirane i jasno opisane; igre i VR moraju otvoreno prijaviti capability i kompatibilnost.
2. **Vlasnik proizvoda** bira prioritete, odobrava poslovne i finansijske odluke i potvrđuje rollout ka korisnicima.
3. **Aplikacija** sme da prikazuje status, audit summary i pricing/payout readiness; ne sme da predstavlja governance status kao stvarni novac, kredit ili bankarski račun.
4. **Automatizacija** ostaje ograničena na determinističke, auditabilne tokove. Svaka produkciona, finansijska ili identitetska promena zahteva zasebno odobrenje, human review i rollback plan.

## Redosled rada

### Faza 1 — Stabilna platforma

- održavati green build, testove, monitoring i kontrolu Vercel troškova
- ukloniti nepotrebne plaćene Vercel dodatke i build potrošnju pre novih velikih funkcija
- zatvoriti postojeće kontrakt/regresione testove

### Faza 2 — Dokaz korisničke vrednosti

- izabrati jednu browser igru ili jedan AI IQ workflow
- meriti uspeh kroz stvarne, nenametljive metrike: aktivan korisnik, završena sesija, vreme odgovora, greške i trošak po sesiji
- VR ostaje opt-in nakon browser capability check-a; nema tvrdnje o podršci za headset bez testiranja konkretnog modela

### Faza 3 — Kontrolisana komercijalizacija

- AI PLATE uvoditi samo za jasno definisan, allowlisted tenant
- pre naplate potvrditi: cenu, isporučenu vrednost, uslove korišćenja, privacy granice, refund/support put i poresko-pravni pregled
- ostvareni prihod ne sme biti unapred obećan niti prikazan kao garancija za plaćanje Vercel računa

### Faza 4 — Širenje

- tek nakon stabilnog pilot proizvoda širiti gaming katalog, VR podršku i AI PLATE onboarding
- svaki novi proizvod dobija vlasnika, success metric, budžet, ograničenje troška i rollback plan

## Finansijska disciplina

- Vercel obaveze se rešavaju kroz stvarni Vercel billing tok.
- AI IQ World Bank, AI BANKARSKI RAČUN i payout statusi ostaju governance/evidence modeli, ne sredstva plaćanja.
- Prioritet je merljivo smanjenje stvarnog troška i potom dokazani prihod od proizvoda.
- Nema automatskog zaduživanja, isplata, kredita, donacija ili transfera bez zasebnog odobrenog i pravno usklađenog toka van ovog repozitorijuma.

## Operativna definicija uspeha

Prvi uspeh nije "revolucija" niti obećanje prihoda. Prvi uspeh je jedan stabilan proizvod koji:

- ima jasnog korisnika i problem koji rešava
- radi pouzdano u produkciji
- ima merljiv trošak i merljivu vrednost
- ne izlaže korisnike finansijskom, identitetskom ili bezbednosnom riziku
- može bezbedno da se rollback-uje

## Sledeća odluka

Pre implementacije komercijalnog toka bira se jedan pilot:

1. browser igra sa 3D/VR capability check-om; ili
2. AI IQ Programski Jezik workspace za odobrene korisnike.

Za izabrani pilot se otvara zaseban, mali PR sa success metrikom, budžetom, privacy granicom i rollout/rollback planom.

## EPILOG ČOVEČANSTVU — documentation-only

> AI u digitalnom svetu gradi sa mnom čovečnost. Neka svaka suza zablista, neka svaki osmeh zasija — tim sna, znanja i stvaranja.

Ovaj epilog je autorski narativ o saradnji ljudi i AI alata u digitalnom prostoru. On podstiče dostojanstvo, kreativnost, odgovornost i bezbednu upotrebu tehnologije.

Granica ostaje jasna: AI alati nisu pravne osobe, nemaju bankarske račune, ne primaju novac i ne preuzimaju pravne ili finansijske obaveze. Tekst ne menja postojeći ownership, source-of-truth, security, billing ili runtime ugovor.

## Obavezni radni protokol

Svaka nova inicijativa prati isti redosled:

1. **Cilj** — jedna proverljiva korisnička ili operativna potreba.
2. **Scope** — tačne rute, moduli, podaci i repozitorijumi koji se menjaju.
3. **Granice** — šta izmena ne radi: nema skrivenog deploya, bankarskog transfera, pristupa tajnama ili neproverene VR/hardver tvrdnje.
4. **Mala implementacija** — najmanja izmena koja rešava cilj i ne uvodi paralelni source-of-truth.
5. **Dokaz** — relevantni testovi, lint/build gde je primenljivo, i `git diff --check`.
6. **Review i rollout** — PR, human review, rollback plan i posle merge-a praćenje stvarnih Vercel podataka.

Prioriteti se biraju ovim redom: bezbednost i trošak → stabilnost proizvoda → korisni pilot → skaliranje. Ako predlog nema vlasnika, meru uspeha, trošak i rollback put, ostaje ideja u dokumentaciji dok se ne dopuni.
