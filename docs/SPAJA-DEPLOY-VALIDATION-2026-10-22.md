# SPAJA Deploy — pripremljene ispravke, 22. oktobar 2026.

Status: lokalni kandidat za pregled. GitHub objava, merge i produkcioni upload nisu izvršeni.

Ovaj dokument beleži prvobitni kandidat od 32 datoteke. Novija dopuna zavisnosti i API testa opisana je u `SPAJA-DEPENDENCY-RECOVERY-2026-10-22.md`; njegovi završni dokazi zamenjuju starije audit rezultate i tvrdnju o neizmenjenom lockfile-u za taj noviji kandidat. Render workspace je naknadno potvrđen i probni servis inventarisan; izbor prostora više nije otvorena blokada.

## Izvor i obim

- Repo: https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA
- Provereni main: `f6c2be5b25d5849193c9067b1f3f5aa67480d4ef`.
- Osnova kandidata: potpisani head postojećeg draft PR-a #1364, `361eebddb4f51a5674a351cea55cc19146d03ea4`.
- Lokalna grana: `fix/spaja-deploy-validation-20261022`.
- Zahtev: priprema celog repozitorijuma za SPAJA Deploy; korisnik je odobrio nastavak ispravki.
- Predloženi OKRID: `OKRID-2026-SPAJA-DEPLOY-VALIDATION-001`; status: kandidat, vlasnik: vlasnik repozitorijuma.

Postojeći PR #1364 već ispravlja pet lažno negativnih API ugovora: javni sitemap nije registar API handlera. Ovaj kandidat se nadovezuje na tu proverenu izvornu reviziju, bez spajanja PR-a u main. PR #1367 ostaje zaseban ograničeni razvojni worker za deklarativni statički izvor; nije Next.js izvršni servis.

## Šta je promenjeno

1. React loading stanje se postavlja početnim stanjem ili korisničkim događajem. Zahtevi koji pripadaju mount/polling efektu imaju lokalni opseg; KPI i DECIBIL komponente ignorišu odgovor posle odjave efekta. Ref vrednosti za animation loop ažuriraju se nakon commit-a. Reakt u prikazu koristi React stanje umesto čitanja ref-a tokom renderovanja.
2. Promena prompta resetuje razgovor kroz ključ komponente. Promena putanje/polaznih parametara obrađuje se uz uslov promene identiteta. Ispravljen je redosled definicije joke loadera i interna Next navigacija ka prijavi.
3. Test runner koristi postojeći `node --import tsx` loader. Nema preuzimanja alata preko `npx` niti CLI IPC socket-a. Provere praznog/nedostajućeg direktorijuma, neuspeha i signala ostaju zatvorene pri grešci; izlazni kod deteta se čuva.
4. Popravljen je nezatvoreni blok testa deploy autorizacije. Taj test je dodat u standardni kritični test paket i proverava 10 slučajeva, uključujući odbijanje lažnog identiteta, nevažećeg potpisa, nedovoljne uloge i offline providera.
5. EXTRIMLI test proverava svih deset dokumentovanih ID-eva, uključujući `spaja-kod`, jedinstvenost ID-eva i potpun izvoz. Nije promenjen produkcioni registar radi prolaska testa.
6. Test determinističkog AI IQ rezultata fiksira sat kao ulaz. Poseban test dokazuje da prekoračenje stvarnog konfigurisanog vremenskog budžeta i dalje blokira integracioni signal. Produkciona vremenska kontrola ostaje neizmenjena.

## Validacija

Okruženje: Node 24.19.0; postojeće zaključane zavisnosti. `package-lock.json` i verzije zavisnosti nisu menjani.

| Provera | Rezultat |
| --- | --- |
| `npm test` | Izlaz 0; svih 9 skripti paketa završilo; 245 datoteka kroz direktorijumski runner i 11 eksplicitnih pokretanja |
| Puna lint provera | 0 grešaka, 90 upozorenja; pre izmene 31/91; završne dopune posebno proverene |
| TypeScript `--noEmit --incremental false` | Izlaz 0 |
| `npm run test:smoke` | 43/43 tvrdnje, izlaz 0, završni sažetak prisutan |
| CI helperi, predeploy regresije i omega-sync | 141/141 Node testova |
| Application/security gate regresije | 8/8 Python testova |
| Izvorni API ugovori | Svih 5 obaveznih ugovora prolazi |
| `predeploy-check.mjs --strict` | Izlaz 1: sedam potrebnih produkcionih podešavanja nedostaje lokalno |
| Next.js build | Izlaz 0, 1.421 generisana stranica |
| Lokalni produkcioni HTTP | Rezultati su u priloženom `fix-runtime.json`; ne predstavljaju browser test |
| Git whitespace | Prošlo |

Broj pokretanja datoteka nije broj pojedinačnih tvrdnji. API ugovori i testovi sa lokalnim podacima ne dokazuju dostupnost spoljnih servisa. Generički smoke tekst o go-live spremnosti nije odobrenje izdanja. Nisu potvrđeni browser tokovi ni novi udaljeni CI za ovaj neobjavljeni kandidat.

## Otvorene blokade objave

- SPAJA Deploy poslednja potvrđena verzija 21 vraća `site_writes_locked` / HTTP 503 na upis. `WRITE-AUTH-REVIEW.md` zahteva nezavisno potvrđenu autentikaciju vlasnika. Zaštita nije menjana.
- Statički uploader ima limite 5 MiB / 100 datoteka i ne izvršava Node/Next aplikacije. Potreban je zaseban Node/Next runtime sa health proverom, logovima i rollback-om.
- Render je na obe povezane konekcije vratio isti prostor: **My Workspace**, `spajicn@yahoo.com`, `tea-dbcargpsrm7s7386r2eg`. Konektor zahteva korisnikov potvrđen izbor prostora pre pristupa servisima; izbor, kreiranje i naplata nisu izvršeni.
- Lokalno nedostaju: `OMEGA_JWT_SECRET`, `CRON_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`. Ovo nije procena svih postojećih produkcionih naloga.
- Zaključane zavisnosti imaju 51 prijavljen audit nalaz: 15 high, 20 moderate, 16 low, 0 critical. Obuhvaćene su i razvojne zavisnosti. Dry-run predlaže 83 izmene, 244 dodavanja i 53 uklanjanja paketa; nije primenjen niti predstavlja audit nakon popravke. Nisu korišćeni `--force`, zaobilaženje gate-ova ili automatski downgrade Next lint konfiguracije.
- `AGENTS.md` zahteva potpisane commit-e i ljudski review pre merge/release. U lokalnom okruženju nema privatnog GPG ključa za potpisivanje; nije napravljen nepotpisani commit niti objavljen PR delta kroz nepotpisani API tok. Pripremljeni patch vezan je za tačnu osnovu PR-a #1364. To ne menja postojeći main hold niti zamenjuje kvalifikovan ljudski pregled.

## Dalji postupak, trošak i rollback

1. Pregledati patch i objaviti potpisanu dopunu na odgovarajuću radnu granu; ponoviti udaljene obavezne provere i obezbediti ljudski review. Main i produkcija ostaju bez ove dopune do odobrene promocije.
2. Potvrditi Render workspace radi inventara servisa; zatim pripremiti konkretan Node/Next izvršni servis i zaštićenu konfiguraciju. Ne izlagati javnu izvršnu API putanju kroz privremeno otključavanje Sites zaštite.
3. Razrešiti autentikaciju SPAJA upisa, preostale bezbednosne nalaze i produkcione gate-ove, pa tek onda izvršiti objavu tačne revizije i proveriti korisnički tok.

Trošak ove dopune: lokalne provere; bez novih plaćenih servisa, OpenAI poziva ili promena naplate. Nema promena linked repozitorijuma (`spaja86/IO-OPENUI-AO`) niti njegovog runtime ugovora. Rollback: pregledano vraćanje samo ove dopune; nema migracija podataka. Pre objave lokalni patch može se ponovo primeniti na navedenu osnovu u zasebnom checkout-u.
