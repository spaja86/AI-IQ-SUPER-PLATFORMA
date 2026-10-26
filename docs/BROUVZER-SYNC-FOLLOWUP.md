# Brouvzer — dijagnostika ICE i CI, 26.10.2026.

Dopuna draft PR-a #1374. Osnova dopune:
`fbd07e5ee402748d145d3fe3047c5dbcf8a4cebb`.
Razlog: nastavak rada koji je korisnik odobrio posle objave pilota, uz
postojeći izuzetak za nepotpisanu objavu ovog drafta. Bez merge-a/release-a.

## CI: potvrđena prepreka pre izvršavanja

Pročitane su stvarne GitHub anotacije dva posla iste revizije:

- [Omega sync safety, run 40300143221](https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA/actions/runs/40300143221), job 121495714069.
- [Dependency Review, run 40300143384](https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA/actions/runs/40300143384), job 121495715708.

Oba kažu da posao nije započet zbog zaključavanja naloga usled billing
problema. Sačuvani su izvorni tekstovi i URL-ovi u
[evidenciji](evidence/brouvzer-sync/ci-annotations-20261026.json).
Omega steps API vraća praznu listu, a log vraća BlobNotFound; to je
saglasno neizvršavanju, ali sama greška loga nije dokaz uzroka.

Zaključak se odnosi na ta dva pregledana posla. Nije dokaz da su
aplikacioni testovi prošli/pali, da postoji konkretna ranjivost, niti da
je uzrok Cloudflare build neuspeha isti. Vlasnik naloga treba da reši
billing status u GitHub podešavanjima; stanje i iznos duga nisu utvrđeni.
Nema menjanja workflow-a radi zaobilaženja blokade ili lažnog green statusa.
Nisu menjani naplata, runner-i ili pretplate i nije ručno ponovljen CI.

## WebRTC: nezavisna native proba

Izolovana Chromium 138 proba koristila je dva izvorna RTCPeerConnection-a,
jedan DataChannel i iceServers:[] — bez SPAJA transporta, Yjs ili provere
identiteta. Oba gathering stanja stigla su do complete, oba SDP-a i događaji
imali su **0 kandidata**, ICE/connection ostali su new, kanal nije otvoren.
[Sačuvan rezultat](evidence/brouvzer-sync/native-rtc-20261026.json).

Ovim se ograničenje reprodukuje i bez aplikacionog koda. To sužava problem,
ali ne dokazuje odsustvo svih grešaka pilota ili precizan uzrok u OS-u,
sandbox-u, browser konfiguraciji ili mreži. Direktna WebRTC sinhronizacija
na fizičkim uređajima i TURN ostaju nepotvrđeni.

Reproducibilna proba je u `tests/brouvzer-sync/native-rtc.cjs`. Koristi isti
spoljno instalirani Playwright/Chromium pristup kao browser testovi; bez
otvorenog kanala vraća exit 2, ne lažni prolaz. Ne ispisuje SDP/IP/kredencijale.

## Promena ponašanja pilota

- Ručna signalizacija prenosi kompletan SDP, bez naknadnog trickle protokola.
  Zato završetak gathering-a bez ijednog lokalnog kandidata sada odmah
  odbija pripremu ponude/odgovora sa konkretnom porukom. Nema nepodesnog
  signala koji izgleda spremno za upotrebu.
- Posle lokalne potvrde nezavisno proverenog otiska kanal ima
  limit od 20 sekundi. Timer se ne pokreće tokom ručnog prenošenja SDP-a. Ako se ne otvori, sesija se zatvara uz objašnjenje;
  sačuvane offline izmene ostaju. Otvaranje kanala gasi ovaj timer.
- Opoziv odmah prekida i čekanje ICE gathering-a, uklanja listenere i timere.
- Interfejs prikazuje connection/ICE/channel stanja i zbirne tipove kandidata.
  Nova dijagnostika ne ispisuje adrese, portove, SDP, ICE URL-ove ili ključeve.
- Browser harness prijavljuje grešku pripreme bez naknadnog 30s čekanja i
  u dijagnostiku ne kopira celu stranicu/bookmarkove.

Bilateralna provera otiska, DTLS, replay i inkognito granice nisu oslabljeni.
Nisu dodati spoljni STUN/TURN ili novi dependency-ji. Pregled W3C WebRTC API-ja
26.10.2026: https://www.w3.org/TR/webrtc/ — complete opisuje završetak
prikupljanja; ne potvrđuje uspostavljenu vezu ili otvoren DataChannel.

## Izvršene provere dopune

- **20/20 Node testova**, uključujući prethodnih 14 i šest novih: redigovane
  informacije, zero-candidate odbijanje, gathering sa kandidatima, trenutni
  opoziv čekanja, deadline koji zatvara neotvorenu vezu i gašenje deadline-a
  nakon otvaranja. Deo transportnih scenarija koristi mock, ne realni UDP.
- **8/8 stvarnih lokalnih browser scenarija** ponovljeno nakon promene:
  IndexedDB/profil restart, uređivanje, inkognito, brisanje, širine i greška baze.
- Pilot bundle i syntax/diff provere prolaze.
- Puni browser RTC scenario i dalje **nije prošao**. Sada staje sa tačnom
  porukom da ICE nema kandidata, pre pripreme ponude i prenosa bookmarkova.
- Puni root TypeScript/build/lint/test lanac nije ponavljan za ovu JS dopunu;
  ranije neispunjene release provere ostaju otvorene. Lokalno 20/20 nije green CI.

## Naredni proverljivi koraci

1. Vlasnik rešava potvrđeni GitHub account/billing bloker; zatim proveriti
   stvarno izvršene CI korake na tačnoj reviziji, bez zaključka unapred.
2. Na dve kontrolisane instance sa kandidatima proveriti otvoren kanal,
   obe potvrde, offline/duplirane izmene i konvergenciju posle novog uparivanja.
3. Zasebno proveriti fizičke uređaje/različite mreže i odobren testni TURN,
   pa obaviti human/security review pre razmatranja merge-a/release-a.

OKRID-2026-BROUVZER-001 ostaje proposed; KPI nije proglašen kompletno ispunjenim.
Cross-repo impact: No linked repo change required; IO-OPENUI-AO nepromenjen.
Rollback ove dopune vraća dijagnostiku/deadline i pripadajuće testove/dokumente,
bez brisanja probne baze ili menjanja kriptografskog modela.

## Nova kontrolisana dijagnostika

Nastavak na osnovi `160b43b8`: sačuvana je komanda `native-rtc.cjs`, uz
kontrolisane profile, odobrenje tačne STUN/TURN konfiguracije i proveru
poruka/zatvaranja. Stvarni prenos i dalje nije potvrđen. Uputstvo, matrica
ishoda i rezultati ove dopune: [BROUVZER-NATIVE-RTC-DIAGNOSTICS.md](BROUVZER-NATIVE-RTC-DIAGNOSTICS.md).
Ranijih 8/8 UI scenarija iz ovog dokumenta odnosi se na prethodnu reviziju;
ponovljena UI provera nove dopune nije završila u roku.
