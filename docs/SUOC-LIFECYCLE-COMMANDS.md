# SUOC: lokalne komande AKTIVIRAJ / IZGRADI / POKRENI

Predlog prvog lokalnog ugovora, pripremljen na zahtev korisnika 19. oktobra 2026.
Osnova: `b2d70356fa6cd5291dcf7a0ae810d80a0f482ecd`.

## Ugovor

| Komanda | Ulaz | Efekat | Greška |
|---|---|---|---|
| `AKTIVIRAJ: jezgro` | Isključivo literal `jezgro` | Aktivira ovu instancu runtime-a; ponavljanje je dozvoljeno | Drugi cilj se odbija, stanje ostaje nepromenjeno |
| `IZGRADI: demo` | Tekst `ctx.programi.demo` | Proverava DSL i čuva snimak izvora, AST i JS prikaz u memoriji | Neaktivna sesija, nepoznato ime, nevalidan izvor ili prekoračen limit |
| `POKRENI: demo` | Ime ranije pripremljenog programa i trenutni lokalni ctx | Sekvencijalno izvršava snimljeni AST i beleži audit | Neaktivna sesija, nepostojeći artefakt ili greška komande; ostatak se ne izvršava |

```text
AKTIVIRAJ: jezgro
IZGRADI: demo
POKRENI: demo
```

```json
{
  "roles": ["user"],
  "korisnik_ima_pravo": true,
  "programi": {
    "demo": "ECHO: Zdravo\nASSERT: korisnik_ima_pravo == true\nPRIV: user"
  }
}
```

Izlaz programa: `Zdravo`. `getBuilds()` vraća kopije javnih artefakata
(ime, izvor, JavaScript prikaz i broj naredbi), bez izlaganja internog AST-a.
`getAuditLog()` sadrži AKTIVIRAJ, IZGRADI, unutrašnje operacije i završni
POKRENI zapis, sa statusom, vremenom i eventualnom greškom. Spoljašnji POKRENI
zapis dolazi posle unutrašnjih zapisa. Audit se ne vraća unazad pri grešci.
Parsiranje nevalidnog vršnog izvora odbija ceo unos pre prve akcije; takva
greška se prikazuje u REPL-u i ne predstavlja izvršenu runtime operaciju.

## Granice i kompatibilnost

- Ovo je predlog lokalne DSL semantike; AKTIVIRAJ ne uključuje infrastrukturu,
  IZGRADI nije Next.js build, a POKRENI ne pokreće server niti deployment.
- Izvor programa: najviše 16384 UTF-16 jedinice i 256 naredbi; najviše 16
  pripremljenih programa po instanci; ukupni deklarisani WAIT budžet programa
  najviše 5000 ms. Pojedinačni WAIT i dalje poštuje postojeći `maxWaitMs`.
- Programi ne mogu sadržati AKTIVIRAJ/IZGRADI/POKRENI, čime se isključuje
  ugnježdeno pozivanje i rekurzija. Granice važe za svaki pripremljeni program;
  ukupan broj vršnih komandi i ponovljenih pokretanja nije novi globalni budžet.
- IZGRADI ne izvršava program. Semantika ASSERT/PRIV proverava se pri POKRENI.
  Neuspešna ponovna izgradnja čuva stari snimak. Promena ctx.programi bez
  ponovne izgradnje ne menja pripremljeni program.
- MOŽE i ŽELIM zadržavaju postojeću audit semantiku; DO je tekstualni izlaz,
  bez shell izvršavanja. Generisani JS nikada se ne prosleđuje eval/new Function.
- Aktivacija i uloge u korisnički izmenljivom ctx nisu autentifikacija ili
  serverska autorizacija. Ovo nije OS sandbox niti servis za nepoverljiv kod.
- REPL otvara novu runtime instancu pri svakom kliku. Pripremljeni programi i
  aktivacija ne opstaju između klikova ili osvežavanja stranice. Izlaz pre
  greške ostaje vidljiv, kao i audit neuspeha; dugme Obriši blokirano je tokom rada.
- IO-OPENUI-AO nije promenjen i ne dobija novu funkcionalnu integraciju ovim PR-om.
  Razlog promene: korisnikovo odobrenje tri koraka iz SUOC statusa od 19. oktobra.

## Provere od 19. oktobra 2026.

Lokalno: Node 24.19.0, postojeći deljeni node_modules; nije izvršen svež npm ci.

- SUOC postojeći runner 7/7; novi lifecycle runner 17/17.
- Direktni auth runner 66/66, glavni-endzin 61/61, API contracts 48/48.
- Direktni smoke runner 43/43. Njegova generička go-live poruka nije dokaz
  produkcione spremnosti ili dostupnosti.
- Strogi TypeScript za oba SUOC testa i njihove module: prolazi.
- Ciljani ESLint svih izmenjenih TS/TSX datoteka: prolazi.
- Puna TypeScript provera: 274 dijagnostike; izlaz je bajt-identičan čistoj
  osnovi. Nema novih dijagnostika od ove izmene. Puni build nije potvrđen;
  posle neuspešne pune provere tipova nije ponavljan Next.js build.
- `npm test`: izlaz 1 pre prvog testa zbog lokalnog tsx IPC `listen EPERM`.
  Direktni Node import runneri gore prolaze; to nije prolaz celog npm test lanca.
- `predeploy:check`: izlaz 0 sa postojećim upozorenjima i nedostajućom lokalnom
  konfiguracijom; produkciona konfiguracija nije ispitivana.
- REPL komponenta je uspešno bundlovana za browser. Playwright interaktivna
  provera nije pokrenuta jer Chromium executable nije instaliran. Vizuelni i
  interaktivni test u stvarnom pregledaču ostaju otvoreni.
- Remote CI nije potvrđen. Na osnovi b2d70356, Omega Sync Safety run
  [39224316848](https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA/actions/runs/39224316848)
  prijavljuje failure, sa poslom bez koraka. To nije dokaz pada SUOC testova;
  uzrok se iz dostupnih zapisa ne može pouzdano utvrditi. CI nije ponovo pokretan.

## Pregled i isporuka

Predlog ide kroz draft PR i ljudski pregled. Novi runner je dodat postojećem
`test:core` lancu, pa ga postojeći Omega Build uključuje kada dođe do test koraka.
Nema izmena workflow-a, zavisnosti, lockfile-a, tajni, infrastrukture ili servisa.
KPI: tri eksplicitno podržane komande, pozitivan/negativan test toka i audit greške.
Pre promocije: potvrditi predloženu semantiku, proveriti REPL u pregledaču i
pribaviti zelene release gate rezultate za tačan commit.
Rollback: reverzija ovog izdvojenog PR-a vraća stari DSL i REPL; stanje je samo
u memoriji i nema migracije podataka. Ne spajati ili objavljivati automatski.
