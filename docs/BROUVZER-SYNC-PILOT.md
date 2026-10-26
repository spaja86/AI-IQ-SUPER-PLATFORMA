# SPAJA DIGITALNI BROUZVER — lokalni CRDT / WebRTC pilot

Razlog: korisnik je 26.10.2026. odobrio implementaciju predloženog mini-sprinta
za dva učesnika i probne bookmarkove. Osnova:
`f6c2be5b25d5849193c9067b1f3f5aa67480d4ef`.
Status: razvojni kandidat, human/security review pre merge-a i release-a.

## Šta se dodaje

- Odvojeni `pilot/brouvzer` Node 24 paket i zaključane zavisnosti. Yjs je odabran
  jer pregledani postojeći Brouvzer ima lokalne nizove/localStorage, ali nema
  izvršni CRDT adapter. Ne dodaje se drugi CRDT niti se menja root lockfile.
- Probna Yjs kolekcija, stabilni UUID ID-jevi, HTTPS URL bez kredencijala,
  naziv do 120 znakova, najviše 100 ID-jeva i snapshot do 64 KiB.
- Jedan Y.Map zapis po bookmarku. Konkurentne izmene istog zapisa imaju
  determinističkog Yjs pobednika (nije last-write po zidnom satu). Time se
  može izgubiti konkurentna namera; istorija konflikata nije implementirana.
- Posebni trajni tombstone zapisi: brisanje uvek skriva isti ID, i ako stigne
  konkurentna izmena kasnije. ID se ne koristi ponovo. Tombstones se ne čiste
  automatski; puna probna baza zahteva zaseban eksplicitan reset.
- Stage → validacija → IndexedDB transakcija → vidljivo stanje. Neuspešan
  upis ne prijavljuje uspeh i ne objavljuje promenu drugom učesniku.
- Snapshot/state-vector razmena; nema trajnog reda pojedinačnih poruka.
  Trajni CRDT snapshot omogućava naknadni oporavak razlika. Ovo nije
  exactly-once mrežna isporuka ili rezervna kopija izvan uređaja.
- Ručni SDP offer/answer, jedan pouzdan ordered DataChannel, ograničen send
  buffer, koalesciranje lokalnih promena u poslednji snapshot.
- Opoziv zatvara vezu. Oporavak je novo uparivanje, nova sesija i novi
  eksplicitno generisani ECDSA P-256 DTLS sertifikat. Automatski ICE restart
  nije implementiran. Offline izmene se razmenjuju nakon nove potvrde.
- Inkognito instanca ne otvara trajno skladište i ne dozvoljava PeerSync.
  Ne uvozi postojeće bookmarkove ili istoriju aplikacije.
- Next.js stranica sa uputstvom `/spaja-digitalni-brouvzer/sync-pilot` i veza
  sa postojećeg kataloga; ona sama ne pokreće servis ili mrežnu sesiju.

## Pokretanje

```sh
cd pilot/brouvzer
npm ci --ignore-scripts
npm run build
npm test
npm start
```

Otvoriti `http://127.0.0.1:4320` u dva odvojena browser profila. Na dva
računara pokrenuti sopstvenu kopiju istog lokalnog pilota. Servis sluša samo
na 127.0.0.1, odbija drugi Host/Origin, cross-site Fetch Metadata i metode
koje menjaju stanje. Vraća samo tri unapred definisana statička resursa.
Nema serverskog signalizacijskog API-ja, korisničke baze ni cloud usluge.

A pravi ponudu → B učitava ponudu i pravi odgovor → A učitava odgovor.
Pre potvrde proveriti **ceo SHA-256 otisak** na oba uređaja preko nezavisnog
pouzdanog kanala (npr. uživo). Otisak vezuje verziju, dokument, session ID,
ceo offer SDP i answer SDP, uključujući DTLS fingerprint-e.
Uneti provereni otisak na oba uređaja. Tek posle obe potvrde razmenjuje se
CRDT sadržaj. Ne potvrđivati kod samo zato što je stigao istim kanalom kao SDP.
SDP sadrži lokalne/javne mrežne adrese: ne objavljivati ga u issue/PR/logove.

## E2EE model i granice

Zaštitu prenosa pruža standardni WebRTC DTLS između potvrđenih browser
krajnjih tačaka, uz nezavisnu proveru identiteta sagovornika. Nema novog
kriptografskog algoritma niti dodatnog izmišljenog protokola razmene ključeva.
Ovo nije tvrdnja da sam TLS prema serveru, ili otvoren kanal bez provere,
dokazuje identitet drugog učesnika. Ključevi/sertifikat nastaju u browseru i
aplikacija ih ne izvozi ili čuva u IndexedDB. Svaka nova sesija zahteva novu
potvrdu. Replay provera je per-session, per-direction sekvenca na reliable
ordered kanalu; nije zamena za CRDT idempotentnost.

- Neautorizovan učesnik ili zamena SDP-a ne može dobiti podatke ako oba
  čoveka proveravaju ceo otisak preko pouzdanog nezavisnog kanala.
- Nema naloga, sertifikovanog identiteta ili grupnog članstva; čovek vezuje
  potvrđeni fingerprint za osobu/uređaj. Dozvoljen je jedan peer po instanci.
- Lokalna IndexedDB je **nešifrovana**, isključivo za izmišljene podatke.
  Šifrovanje na disku, dugoročni identitet, oporavak ključeva i forward/post-
  compromise garancije aplikacionog protokola nisu deo ovog izdanja.
- Kompromitovan OS, browser, XSS ili zlonamerno isporučen JavaScript mogu
  čitati podatke. Lokalni servis, izvorni kod i zavisnosti moraju biti pouzdani.
- Opoziv sprečava buduću razmenu preko ove sesije; ne briše već pročitane
  podatke ili kopije na drugom uređaju. Autorizovan peer može slati loše
  semantičke izmene i pokušati DoS; ograničenja smanjuju, ne uklanjaju rizik.
- Metapodaci (IP, vreme, obim) nisu skriveni. Nema podrazumevanih spoljnih
  STUN/TURN servera. P2P između odvojenih mreža može izostati zbog NAT-a.
  TURN nije obezbeđen niti verifikovan. TURN koji samo prosleđuje pakete ne
  postaje DTLS endpoint; broker koji dešifruje sadržaj bi promenio model.
- Pre javnog izlaganja potreban je zaseban dizajn auth/signalizacije,
  rate-limit-a, ključeva, TURN kredencijala i revizije; ne izlagati lokalni
  servis tunelom/proxy-jem kao produkcioni servis.

## Testovi i dokazi

```sh
npm --prefix pilot/brouvzer test
npm --prefix pilot/brouvzer run build
# Opcioni browser alati van root/produkcione instalacije:
PLAYWRIGHT_MODULE=/apsolutna/putanja/do/playwright node tests/brouvzer-sync/browser.mjs
```

Node testovi obuhvataju 20 seed-ova konkurentnih replika sa dupliranim i
izmešanim snapshot-ima, remove-wins, determinističku konflikt rezoluciju,
trajnost preko adaptera, neuspešan upis, inkognito, validaciju, limite,
vezivanje otiska, replay/tuđu sesiju, opoziv, backpressure i HTTP granice.
Browser scenario zasebno proverava stvarni DataChannel, dve potvrde,
IndexedDB/reload, opoziv i novo uparivanje, inkognito i mobilnu širinu.
Pročitati `BROUVZER-SYNC-VALIDATION.md` za stvarne rezultate i ograničenja;
prisustvo testa nije dokaz da je izvršen.

## Governance, rollout i rollback

Predloženi ID: `OKRID-2026-BROUVZER-001`, initiative, status proposed;
owner area: Product + Security; imenovanje vlasnika čeka pregled.
Roadmap: ograničena probna CRDT/DTLS sinhronizacija za dva učesnika.
KPI: konvergencija u zadatom skupu, nula slanja pre obe potvrde,
odbijanje replay-a i nula IndexedDB/mrežnog rada u inkognito instanci.
KPI nije procenat završenosti proizvoda.

Human/security review obavezan. Pre objave pregledati zavisnosti i sve
release gate-ove; kandidat nije odobrenje za merge ili produkciju.
Root AGENTS.md i orgSettings zahtevaju potpisane commit-e. Lokalno
potpisivanje nije podešeno. Korisnik je 26.10.2026, posle objašnjenja tog
pravila i konkretnog pitanja za nepotpisan draft PR bez spajanja/deployment-a,
odgovorio „Može sve.😁😁😁“. Ovaj izuzetak važi za objavu ovog kandidata;
pravilo AGENTS.md i orgSettings nisu menjani. Nisu menjani auth, finansije, hosting ili CI konfiguracija.

Rollout: review → testni lokalni profil sa izmišljenim podacima → nezavisna
provera na fizičkim uređajima i mrežama → zasebna odluka o daljem izdanju.
Rollback: zaustaviti servis, vratiti samo fajlove ovog pilota i njegovu
navigacionu dopunu; postojeću istoriju/bookmarkove ne menjati. Probni
IndexedDB ostaje na profilu dok korisnik eksplicitno ne izabere brisanje.

Cross-repo impact: **No linked repo change required**. IO-OPENUI-AO nije
izmenjen i nema funkcionalne federacije, kopiranja privatnih podataka ili
aktivacije servisa drugih projekata.

## Primarni izvori

- Yjs update API: https://docs.yjs.dev/api/document-updates
- WebRTC bezbednosna arhitektura, RFC 8827 (2021): https://www.rfc-editor.org/rfc/rfc8827
- WebRTC API (W3C): https://www.w3.org/TR/webrtc/
- Izvori pregledani 26.10.2026; standardi su osnova dizajna, ne nova istraživanja
  ili sertifikat bezbednosti ovog pilota.
