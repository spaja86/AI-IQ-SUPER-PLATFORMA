# Nezavisna WebRTC dijagnostika — PR #1374

Osnova: `160b43b8c49fab07c0e4ca3b61b54e603fb44583`; zahtev korisnika od
26.10.2026. Nastavak postojećeg drafta, bez merge-a, javnog servisa ili
promene aplikacionog protokola. Koristi se ranije dokumentovani izuzetak
za nepotpisane commit-e ovog drafta; pravila potpisivanja nisu menjana.

## Šta proverava

Postojeća komanda `node tests/brouvzer-sync/native-rtc.cjs` ostaje ulazna
tačka nezavisne probe. Dva izvorna `RTCPeerConnection` objekta u jednoj
stranici razmenjuju offer/answer direktno u memoriji. Nema SPAJA transporta,
Yjs, provere otisaka, korisničkih bookmarkova niti mrežne signalizacije.
Podrazumevano: `iceServers: []`, `iceTransportPolicy: all`, headless Chromium,
`about:blank`, bez dodatnih loopback/mDNS flagova.

Uspeh zahteva **oba otvorena kanala, prijem tačnih sintetičkih poruka u oba
smera, zatvaranje kanala na oba kraja i zatvaranje svih kreiranih peer-ova**.
Samo `open` ili ICE `complete` nije prolaz prenosa. Za uspešnu vezu opcioni
`getStats` prikazuje samo lokalni/udaljeni tip izabranog kandidata i UDP/TCP;
izostanak statistike se vidi kao `null` i ne pretvara se u dokaz relay prenosa.

Odvojeni rokovi postoje za browser, RTC API operacije, gathering, povezivanje,
prenos i zatvaranje. Svaka RTC izlazna putanja prolazi kroz `finally`: zatvara
kanale i peer-ove, uklanja listenere i timere. Node runner zasebno zatvara
browser context, browser i opcioni lokalni HTTP server. Ako browser prekine
rad pre povratka probe, unutrašnji RTC cleanup nije potvrđen: prijavljuje se
harness greška, a ne izmišljena potvrda zatvaranja peer-ova.

## Ponovljivo pokretanje

Preduslovi: Node 24+, postojeći zaključani pilot paket i zasebno instaliran
Playwright sa odgovarajućim Chromiumom. Nisu dodate root/pilot zavisnosti.
Za Node provere prvo treba izgraditi pilot, jer postojeći server test čita
`pilot/brouvzer/dist/ui.js`:

```sh
npm ci --prefix pilot/brouvzer
npm run build --prefix pilot/brouvzer
node --test tests/brouvzer-sync/*.test.mjs
node tests/brouvzer-sync/native-rtc.cjs
```

Ako Playwright nije u standardnom module search path-u, `PLAYWRIGHT_MODULE`
može pokazivati na njegov lokalni instalirani entrypoint. `CHROMIUM_EXECUTABLE`
može izabrati drugi lokalni Chromium i bez `CHROMIUM_MODULE`. Opcioni
`CHROMIUM_MODULE` je pouzdani lokalni modul poput postojećeg QA paketa;
njegovi osnovni launch flagovi ostaju na snazi osim `--single-process`.
Profil `default` zato znači bez **naših dodatnih** RTC flagova, a ne nužno
fabričku browser konfiguraciju. Putanje i puni launch argumenti se ne ispisuju.

Kontrolisani profili bez spoljnih servera:

```sh
BROUVZER_RTC_CONFIG=tests/brouvzer-sync/native-configs/host-default.json node tests/brouvzer-sync/native-rtc.cjs
BROUVZER_RTC_CONFIG=tests/brouvzer-sync/native-configs/host-loopback.json node tests/brouvzer-sync/native-rtc.cjs
BROUVZER_RTC_CONFIG=tests/brouvzer-sync/native-configs/loopback-origin.json node tests/brouvzer-sync/native-rtc.cjs
BROUVZER_RTC_CONFIG=tests/brouvzer-sync/native-configs/relay-without-servers.json node tests/brouvzer-sync/native-rtc.cjs
BROUVZER_RTC_CONFIG=tests/brouvzer-sync/native-configs/withhold-answer.json node tests/brouvzer-sync/native-rtc.cjs
```

| Profil | Kontrolisana razlika |
|---|---|
| host-default | Osnovna proba, bez dodatnih RTC flagova |
| host-loopback | Izričito uključuje loopback test flag i isključuje mDNS skrivanje lokalnih adresa; koristi samo sintetičku stranicu |
| loopback-origin | Osnovni browser flagovi; prazna testna stranica preko privremenog HTTP servera vezanog samo za loopback; izveštava `secureContext` |
| relay-without-servers | Loopback test profil + relay-only bez TURN-a; negativna kontrola, ne pokušaj uspešnog relay prenosa |
| withhold-answer | Loopback test profil namerno ne predaje odgovor prvom peer-u; rok povezivanja 1 s; negativna kontrola |

`loopback-test` prenosi izričito stare dodatne flagove prethodne alternate
Chromium probe u kontrolisanu opciju; podrazumevano su sada isključeni.
Ne koristiti taj profil za svakodnevno pregledanje ili stvarne podatke.
`pageOrigin` prihvata samo `blank` ili `loopback`, ne proizvoljan URL.
`headless: false` omogućava zasebnu proveru u razvojnom okruženju sa ekranom.
Svi rokovi su celi brojevi 100–30000 ms; nepoznate opcije se odbijaju.

## STUN/TURN: samo izričito odobrena testna konfiguracija

Nijedan profil u repozitorijumu nema spoljni server. Ovaj rad nije odobrenje
za korišćenje bilo kog STUN/TURN servisa i nijedan takav servis nije korišćen.

Operator prvo odobrava konkretan testni server, mrežu i privremene testne
kredencijale, zatim čuva konfiguraciju **van repozitorijuma**. Lokalni primer
oblika (placeholder nije važeći host i mora biti zamenjen odobrenim):

```json
{
  "version": 1,
  "pageOrigin": "loopback",
  "iceTransportPolicy": "relay",
  "iceServers": [{
    "urls": "turn:REPLACE_WITH_APPROVED_HOST:3478?transport=udp",
    "usernameEnv": "BROUVZER_RTC_SECRET_USER",
    "credentialEnv": "BROUVZER_RTC_SECRET_PASSWORD"
  }]
}
```

Za STUN koriste se samo `urls` i policy `all`. Za TURN `usernameEnv` i
`credentialEnv` smeju da referenciraju samo promenljive sa prefiksom
`BROUVZER_RTC_SECRET_`. Vrednosti se unose kroz odobreno lokalno upravljanje
tajnama; ne u JSON, shell istoriju, izveštaj, screenshot, Git ili argumente
komande. U samom JSON-u nisu dozvoljeni `username`, `credential`, privatni
ključevi, proizvoljni URL parametri ili skriveni dodatni atributi.

Za svaki neprazan `iceServers` runner zahteva
`BROUVZER_RTC_APPROVED_CONFIG_SHA256` jednak SHA-256 **tačnih bajtova prethodno
pregledane datoteke** označene preko `BROUVZER_RTC_CONFIG`. Svaka izmena
datoteke poništava odobrenje; runner nikada sam ne postavlja hash. To je
eksplicitna operatorska potvrda za jedno pokretanje, ne kriptografski potpis
ljudskog identiteta niti zamena za bezbednosni pregled. Hash ne vezuje
vrednosti tajni iz okruženja; operator zasebno kontroliše njihove testne naloge.

Moguće je uporediti `all` sa `relay` na odobrenoj mreži. Lokalni host kandidati
mogu pobediti pri `all`, pa uspeh sa konfigurisanim STUN/TURN **ne dokazuje**
da je taj servis korišćen. Za relay dokaz pregledati izabrani par i zasebno
izvršiti kontrolisanu proveru između uređaja/mreža. Dva peer-a u jednoj
stranici ne pokrivaju NAT prolaz između dve fizičke mreže.

## Privatnost izlaza i tumačenje

JSON izveštaj gradi se od dozvoljenih polja: broj i tip kandidata, stanja,
numerički ICE error kodovi, rokovi, faza, oznake sintetičkih scenarija i
rezultati zatvaranja. Ne ispisuje se SDP, adresa, port, kandidat-string,
fingerprint, ICE URL, tajna, naziv secret promenljive, putanja konfiguracije
ili proizvoljni tekst browser greške. `DEBUG`/aktivni `PWDEBUG` se odbijaju
pre učitavanja Playwright-a da protokol debug ne zabeleži argumente probe.
Nema trace/HAR/screenshot/console dump-a. Pre javne objave pregledati samo
sanitizovani JSON; browser/network debug dump-ove zadržati van javnih izveštaja.

| Ishod / izlaz | Značenje |
|---|---|
| `harness-error` / 1 | Konfiguracija, browser pokretanje/stranica ili runner nisu završili; nije dokaz neuspeha aplikacionog protokola |
| `webrtc-unavailable` / 2 | RTC API nije dostupan u izabranom browser okruženju |
| `gather-timeout` / 2 | ICE prikupljanje nije završilo do roka; ne izjednačavati sa `complete` bez kandidata |
| `no-ice-candidates` / 2 | Gathering završen, ali jednom ili oba peer-a nedostaju kandidati u lokalnom SDP-u; precizan browser/OS/mrežni uzrok nije utvrđen |
| `relay-without-servers` / 2 | Završen gathering bez kandidata pri relay-only politici bez izvora relay kandidata |
| `operation-timeout` / 2 | RTC API operacija nije završena u roku; `phase` određuje koju |
| `ice-connection-failed`, `connection-timeout` / 2 | Nativni kanal nije otvoren na oba kraja; `withhold-answer` je namerno izazvana negativna kontrola |
| `transfer-timeout` / 2 | Kanal se otvorio, ali nisu primljene obe tačne sintetičke poruke |
| `native-error` / 2 | RTC API izuzetak; faza i dozvoljeno ime greške daju granice nalaza, bez raw teksta |
| `channel-close-timeout`, `cleanup-failed` / 2 | Prenos može biti potvrđen, ali kompletan test nije prošao zatvaranje |
| `native-transfer-verified` / 0 | Otvaranje, prijem u oba smera, close handshake i cleanup potvrđeni samo za ovaj native scenario |

Neuspeh zatvaranja browsera/servera daje exit 1 čak i ako su nativni koraci
uspeli. Negativna kontrola uvek vraća neuspeh prenosa (2), nikad lažni exit 0.
`applicationProtocol: not-tested` uvek ostaje izričito označeno. Tek nakon
native uspeha, sa uporedivim browser/poreklo/ICE uslovima, zasebno proveriti
`tests/brouvzer-sync/browser.mjs` (obe potvrde učesnika, konvergencija,
opoziv, ponovno uparivanje). Taj postojeći aplikacioni test koristi svoje
`iceServers: []` i svoj loopback profil: native STUN/TURN uspeh i aplikacioni
neuspeh sa drugačijom konfiguracijom ne izoluju grešku protokola.

Semantika gathering-a, ICE policy i DataChannel stanja:
[W3C WebRTC Recommendation](https://www.w3.org/TR/webrtc/), pregledano
26.10.2026. Nalazi i lokalni dokazi su u odeljku ispod.

## Rollout i rollback

Samo draft → human/security review → kontrolisani razvojni browser sa
kandidatima → zasebna proba na uređajima/mrežama → posebna release odluka.
Nema promene workflow-a, javne signalizacije, kredencijala ili aplikacionih
bezbednosnih granica. Nema novih zavisnosti; cross-repo impact: **No linked
repo change required**, IO-OPENUI-AO nepromenjen. Rollback vraća ovu dopunu
testova/dokumentacije, bez menjanja pilot baze i podataka.

## Stvarno izvršeno 26.10.2026.

Node **24.22.1**, Chromium **138.0.7204.0** iz postojećeg alternate QA paketa.

| Provera | Stvarni rezultat |
|---|---|
| `node --test tests/brouvzer-sync/*.test.mjs` | **62/62**, exit 0: postojećih 20 + 42 nova testa konfiguracije, sintetičkog RTC API-ja i CLI ugovora |
| Pilot `npm run build` | Prolaz |
| Syntax provere tri CJS modula i `git diff --check` | Prolaz |
| `host-default` | **exit 2**, `gather-timeout` kod prvog peer-a; 0 kandidata, drugi nije započeo gathering |
| `host-loopback` | **exit 2**, oba gathering `complete`, oba 0 kandidata; `no-ice-candidates` |
| `loopback-origin` | **exit 2**, `secureContext: true`, ali `gather-timeout` i 0 kandidata prvog peer-a |
| `relay-without-servers` | **exit 2**, oba gathering `complete`, 0 kandidata; ispravno označena relay politika bez servera |
| `withhold-answer` | **exit 2**, oba gathering `complete`, 0 kandidata; namerno zadržani odgovor dostiže `connection-timeout` |
| Postojeći lokalni Chromium UI paket | **Nije završen**: spoljašnji limit 150 s; ranijih 8/8 nije ponovo potvrđeno |
| Postojeći aplikacioni Chromium RTC paket | **Nije završen**: limit 70 s + 5 s za završavanje, proces prekinut (exit 137); ne proglašava se ni prolaz ni utvrđena greška aplikacionog protokola |

Svih pet native proba ima `channelOpen: false`, `transferVerified: false`,
`cleanup.verified: true` i potvrđeno zatvaranje browser context-a, browsera
i lokalnog origin servera kada je pokrenut. **Nijedan stvarni prenos nije
prošao.** Uspešan prenos, dvosmerni payload i close handshake u Node testovima
koriste sintetički RTC API, a ne stvarnu mrežu. Negativni timeout scenario
proverava deadline/cleanup u ovom okruženju; sa 0 kandidata ne dokazuje
ponašanje uspostavljene mrežne veze.

Promena browser RTC flagova menja opaženi gathering ishod (timeout naspram
complete bez kandidata), ali ne daje kandidate. Pouzdani lokalni origin sam
nije uklonio ograničenje. To su opažanja ovih proba, **ne utvrđen uzrok** u
OS-u, sandbox-u, mDNS-u, firewall-u ili konfiguraciji Chromiuma. Aplikacioni
protokol se ne može proglasiti ispravnim na osnovu neuspešne native probe.

Dokazi: [sanitizovana matrica sa SHA-256 testiranih datoteka](evidence/brouvzer-sync/native-rtc-matrix-20261026.json)
i [62 Node rezultata](evidence/brouvzer-sync/native-rtc-node-tests-20261026.txt).

Prvi pokušaj Node paketa pre builda imao je 55/56: postojeći server test nije
našao generisani `dist/ui.js`. Posle builda i završnih dopuna rezultat je
62/62. Prvi pokušaj browser harness-a istekao je pri pripremi context-a;
poseban kontrolisani browser rok povećan je na podrazumevanih 30 s, nakon
čega su pet navedenih native proba završene. Ni jedan raniji neuspeh nije
predstavljen kao prolaz prenosa.

STUN/TURN, drugi browseri, fizički uređaji i dve različite mreže nisu
provereni. Nije bilo odobrene testne ICE konfiguracije za spoljne servise.
Puni root build/lint/TypeScript/predeploy i udaljeni CI nisu potvrđeni ovom
dopunom; prethodni CI nalazi ostaju istorijski, bez novog zaključka o nalogu.
