# Brouvzer — ponovljive UI i aplikacione RTC provere

Nastavak draft PR-a #1374 na osnovi `0cc9a927063e455e9ec22b62607501daa3af7315`,
26.10.2026, posle korisnikovog odobrenja nastavka. Aplikacioni kod,
konfiguracija ICE servera i bezbednosne granice pilota nisu menjani.

## Promena

Postojeće komande `browser-local.mjs` i `browser.mjs` sada koriste zajednički
`browser-harness.mjs`. Zadržano je svih osam lokalnih UI scenarija i svih
jedanaest aplikacionih RTC scenarija. Rezultat razdvaja završene provere,
nezavršene provere, fazu prekida, vrstu greške i stanje zatvaranja resursa.
Samo sve završene provere, bez neočekivanih page grešaka i uz potvrđen
cleanup, daju exit 0.

- Svaka faza, Playwright akcije/navigacija i zatvaranje imaju rok. Default
  je 30 s, a `BROUVZER_BROWSER_STEP_TIMEOUT_MS` dozvoljava 1000–60000 ms.
  Rokovi prijavljuju neuspeh i pokreću cleanup; nisu garancija prinudnog
  prekida native browser procesa ako on prestane da odgovara.
- `BROUVZER_BROWSER_PROGRESS=1` daje samo fiksne oznake faza na stderr;
  završni sanitizovani JSON ostaje na stdout. Korisnički sadržaj, SDP,
  otisci, adrese, putanje i proizvoljne poruke grešaka se ne ispisuju.
- Playwright debug logging se odbija, kako ne bi zabeležio sadržaj ručne
  signalizacije. Page greške se broje bez čuvanja njihovog teksta.
- Resursi se zatvaraju obrnutim redom. Greška ili istek jedne operacije
  ne preskače ostale resurse. Cleanup neuspeh zadržava neuspešan status čak
  i ako su sve funkcionalne provere prošle.
- Aplikacioni RTC test mapira poznatu grešku pripreme ponude na
  `ice-no-candidates` ili `ice-gather-timeout`; ne pokušava da čita i ispiše
  celu stranicu pri grešci. Uspešan offline korak nije dokaz mrežnog prenosa.

## Pokretanje

Koristiti Node 24+, izgrađeni postojeći pilot i zasebno instalirani
Playwright/Chromium kao u [native uputstvu](BROUVZER-NATIVE-RTC-DIAGNOSTICS.md).

```sh
npm run build --prefix pilot/brouvzer
node --test tests/brouvzer-sync/*.test.mjs
BROUVZER_BROWSER_PROGRESS=1 node tests/brouvzer-sync/browser-local.mjs
BROUVZER_BROWSER_PROGRESS=1 node tests/brouvzer-sync/browser.mjs
```

Postojeće promenljive `PLAYWRIGHT_MODULE`, `CHROMIUM_MODULE` i
`CHROMIUM_EXECUTABLE` ostaju podržane. UI paket koristi postojeće osnovne
alternate flagove; aplikacioni RTC paket zadržava svoj raniji loopback/mDNS
profil. Ne dodaje se STUN/TURN i ne koristi se native privatna ICE
konfiguracija. UI paket opciono podržava `QA_SCREENSHOT` samo za sintetičke
lokalne testove; screenshot nije pravljen u ovoj dopuni.

Na Linux CI/development hostu može se dodati spoljašnji limit poput
`timeout --kill-after=5s 210s node tests/brouvzer-sync/browser-local.mjs`.
Prinudni prekid nije prolaz i ne potvrđuje cleanup. Usporeno okruženje može
prekoračiti rokove; rezultat tada mora ostati neuspešan/nepotvrđen.

## Obuhvat i granice

Novi Node testovi proveravaju ograničene rokove, oznaku faze, izostavljanje
privatnog teksta, obrnuti cleanup redosled, nastavak nakon greške i zabranu
debug logovanja. Oni ne zamenjuju stvarni browser test.

Prva instrumentirana UI proba završila je svih osam scenarija i zabeležila
nula page grešaka, ali poslednji browser context nije potvrdio zatvaranje
u tadašnjem roku od 5 s. Runner je pravilno vratio exit 1. Završna verzija
koristi isti kontrolisani rok za cleanup kao i ostale faze, podrazumevano
30 s. To ne dokazuje uzrok prethodnih ukupnih timeout-a.

Nema novih zavisnosti ili izmena workflow-a. Puni root release lanac,
udaljeni CI, fizički uređaji i spoljne mreže nisu potvrđeni ovom dopunom.
Cross-repo impact: No linked repo change required; IO-OPENUI-AO nepromenjen.
Rollback vraća samo ovu dopunu runner-a/testova/dokaza. Human/security
review, draft status i zabrana javne aktivacije ostaju na snazi; koristi
se prethodno odobren unsigned izuzetak istog drafta.

## Rezultati završne lokalne provere

Node 24.22.1, Chromium 138.0.7204.0, isti alternate QA paket.

- **69/69 Node testova prolazi**: prethodnih 62 + sedam provera browser
  harness-a. Sintetičke RTC provere nisu stvarni WebRTC prenos.
- **8/8 lokalnih UI scenarija prolazi**, exit 0, nula page grešaka.
  Potvrđeno je zatvaranje sva tri kreirana browser context-a, uklanjanje
  sopstvenog probnog profila i zatvaranje lokalnog servera.
- Syntax provere sva tri izmenjena browser modula i diff check prolaze.
- Osnovni pilot bundle je postojeći build iz prethodne dopune; aplikacioni
  izvor nije menjan. SHA-256 provera potvrđuje da native dijagnostika i
  njeni profili odgovaraju prethodnoj sačuvanoj matrici; tih pet proba nije
  ponavljano kao deo ovog nastavka.

Aplikacioni RTC paket završava sa **exit 1**, faza `pair-offer`,
`errorCode: ice-no-candidates`. Završen je jedan offline scenario od 11;
preostalih deset nije završeno, što nije deset nezavisnih grešaka. Obe
stranice su prethodno spremne i imaju nezavisne sintetičke izmene.
Sva četiri resursa (dva context-a, browser i server) potvrđeno su zatvorena.
Stvarni prenos ostaje `not-confirmed`; nezavisna potvrda učesnika, mrežna
konvergencija i kasniji RTC koraci nisu proglašeni uspešnim.

Sanitizovani [browser rezultati i hash-evi](evidence/brouvzer-sync/browser-runner-followup-20261026.json)
i [69 Node rezultata](evidence/brouvzer-sync/browser-runner-node-tests-20261026.txt).

Nema spoljnih STUN/TURN poziva, spajanja PR-a ili javnog servisa. Za stvarni
prenos i dalje je potrebno razvojno okruženje koje obezbeđuje kandidate,
ili konkretna zasebno odobrena testna ICE konfiguracija iz native uputstva.
