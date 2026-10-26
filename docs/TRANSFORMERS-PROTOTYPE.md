# TRANSFORMERS 1350 — lokalni prototip

Change driver: korisnik je 19. oktobra 2026. izabrao izradu prvog igrivog prototipa u postojećoj AI-IQ-SUPER-PLATFORMA aplikaciji.
Base revision: `b2d70356fa6cd5291dcf7a0ae810d80a0f482ecd`.

## Implementirano u kodu prototipa

- Ruta `/transformers` i direktan link na `/igrice`.
- Postojeći katalog `igrica-transformers-1350` koristi namenski runner i status `beta`.
- Jedna jedinica menja oblik robot ↔ vozilo kroz prelaz od 0,6 s; novi zahtev tokom prelaza se ignoriše. Vozilo je brže, ali ne puca.
- Lokalni duel protiv skriptovanog bota: početak, pauza, pobeda/poraz/nerešeno i potpuno resetovanje.
- Oba učesnika počinju sa 100 HP. Pogodak skida 10 HP. Domet je 26 jedinica (520 m u šematskoj razmeri). Robot puca na 0,8 s, bot na 1,2 s. Gađanje automatski cilja drugog učesnika. Prepreke blokiraju kretanje i liniju napada. Nema mrežnih igrača ili stvarnih nagrada.
- Vremensko ograničenje 90 s; istek bez eliminacije je nerešen ishod, bez obzira na preostali HP.
- Sektor 2 × 2 km oko približne oznake Smedereva (44,66 N / 20,93 E), sa dve prepreke. Teren je šematski; ne koristi stvarne geografske visine, ulice ili podatke o objektima.
- SVG prikaz sa ortografskom 2.5D projekcijom: pogled odozgo, praćenje iste jedinice, orbitalni pregled sa rotacijom i pregled duela koji drži oba učesnika u kadru. Ovo nije puna 3D simulacija ili VR prikaz.
- Katalog 23 jedinstvena ID-ja: 1–4 implementirana, 5–23 onemogućena i označena kao planirana. Namene budućih pogleda nisu izmišljene kao usvojena specifikacija.
- Tastatura i dodir: WASD/strelice, T za transformaciju, Space za napad, C za kameru, P/Escape za pauzu. Fokus mora biti na terenu; formularske kontrole čuvaju svoje standardno ponašanje. Gubitak fokusa otpušta komande, a skrivena kartica zaustavlja simulacione korake.

Dimenzionalne oznake kataloga ne menjaju ovaj prototip. Nema novih zavisnosti, infrastrukture, API upisa, finansijskih transakcija ili deployment konfiguracije.

## Planirano, nije implementirano

Liga, eliminacioni turnir, mrežni mečevi, rang-lista, ostale transformacije, AI personality, replay, cela Zemlja i kamere 5–23. Cilj velikog broja jedinica nije dokaz performansi ovog prototipa. Bot koristi mali graf vidljivosti za obilazak dve prepreke ovog sektora; nije opšti navigacioni sistem za celu Zemlju.

## Reprodukcija i provere

```sh
npm ci --ignore-scripts --no-audit --no-fund
node --import tsx --test src/tests/lib/transformers.test.ts src/tests/lib/transformers-sprint.test.ts src/tests/lib/transformers-launch.test.ts
node --import tsx src/tests/lib/gaming-endzin.test.ts
node --import tsx src/tests/lib/gaming-api-consistency.test.ts
npm run dev
```

Otvoriti `/transformers`, ili pokrenuti TRANSFORMERS iz postojećeg Digitalnog Brouvzera. Proveriti 20 ciklusa transformacije, kretanje oba oblika i prepreke, sve četiri kamere tokom transformacije, pauzu, pobedu/poraz/istek vremena i pet novih duela. Za mobilni prikaz proveriti dugmad na dodir, otpuštanje komande van dugmeta i odsustvo horizontalnog skrolovanja.

Istorijski rezultati provere prvog prototipa, 19. oktobra 2026. (nisu status aktuelnog builda):

- 13 novih testova logike prolazi, uključujući 20 povratnih transformacija, zaključavanje komande, kolizije, brzinu oblika, domet/cooldown/liniju napada, pauzu, oba pobednička ishoda, istek, pet resetovanja i katalog kamera.
- 5 postojećih gaming resolver testova i 5 gaming API consistency testova prolazi.
- ESLint prolazi za svih sedam novih/izmenjenih aplikacionih TS/TSX datoteka.
- Serversko renderovanje potvrđuje početni ekran, SVG i 23 opcije kamera, od kojih je 20 onemogućeno.
- `tsc --noEmit` prijavljuje 274 dijagnostike i u ovom predlogu i na čistoj osnovnoj reviziji. Normalizovani skup dijagnostika je identičan; nema novih TypeScript dijagnostika. Provera cele aplikacije ipak NE prolazi.
- Automatska provera interakcija u pregledaču nije potvrđena: Chromium nije instaliran, a preuzimanje browser paketa nije uspelo. Serversko renderovanje nije dokaz funkcionalnih interakcija u browseru.
- `npm run build`: Next.js produkciona kompilacija uspela za 24,8 s, zatim prekid u TypeScript fazi sa `fatal library error, lookup self`. Potpun build nije potvrđen.

## Mini-sprint 26. oktobra 2026.

Razlog promene: korisnik je odobrio stabilniji sat duela, obilazak prepreka za bota i četvrti pogled kamere u okviru postojećeg prototipa. Osnova: `f6c2be5b25d5849193c9067b1f3f5aa67480d4ef`.

- Sat koristi izmereno aktivno vreme između poziva, umesto pretpostavke da svaki interval traje tačno 50 ms. Fizika se obrađuje u koracima do 50 ms, najviše 40 koraka po pozivu. Zastoj duži od 2 s skraćuje preostalo vreme za ceo zastoj, uz najviše 2 s simulacije kretanja i borbe. Pauza i vreme u skrivenoj kartici se izuzimaju; povratak ne izaziva nagli skok. Komande se otpuštaju pri gubitku fokusa.
- Bot obilazi proširene granice dve prepreke preko grafa od najviše 10 čvorova. Ruta se ponovo računa kada igrač promeni ćeliju od 4 jedinice, ruta istekne ili trenutni segment postane blokiran. Dodir dozvoljene granice razmaka od prepreke je usklađen sa kolizijama: igrač na (38, 40) više ne ostavlja bota bez putanje, dok prolazak kroz unutrašnjost proširene prepreke ostaje blokiran. Nema novih zavisnosti ili mrežnog AI-ja.
- Kamera 4, „Pregled duela“, centrira se između učesnika i menja razmeru prema njihovoj udaljenosti. C kruži kroz 1–4; izbor 5–23 ostaje onemogućen. Klik na teren daje fokus za tastaturu. Katalog i opis rute navode četiri kamere.

Proverljivi scenariji novog test paketa: 90 s sa različitim kašnjenjima poziva; zastoj od 30 s bez neograničenog kretanja; izuzimanje pauze i potpuno resetovanje; tri rasporeda sa preprekama bez prolaska kroz zid i četiri cilja na dozvoljenim granicama prepreka; deterministička ruta i odbijanje nevažećih ciljeva; obe jedinice u kadru kamere 4 na suprotnim uglovima sektora. Postojeći testovi čuvaju 20 povratnih transformacija i pravila duela.

Potvrđeno u radnom checkout-u 26. oktobra 2026:

- 20 testova logike TRANSFORMERS i 4 testa pokretanja iz kataloga prolaze preko projektnog `tsx` runner-a, bez izolovanog adaptera. Dodatnih 5 postojećih gaming resolver i 5 API consistency provera prolazi.
- Ciljani ESLint za šest TS/TSX datoteka prolazi. `node node_modules/typescript/bin/tsc --noEmit --incremental false` prolazi bez dijagnostika posle dopune navigacije. Zavisnosti su ponovo korišćene iz postojećeg checkout-a sa identičnim SHA-256 sadržajem `package-lock.json`, zatim lokalno kopirane za standardni Turbopack build; lockfile nije menjan.
- Prvi Webpack build je u naknadno dostupnom logu završio sa `JavaScript heap out of memory` pri limitu oko 2 GB. Ponovljeni `NODE_OPTIONS=--max-old-space-size=4096 npm run build -- --webpack` takođe je završio memorijskom greškom. To nije TypeScript dijagnostika niti dokaz greške u logici TRANSFORMERS.
- Standardni produkcioni `NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=4096 npm run build` (Turbopack) prolazi sa exit 0: kompilacija 2,7 min, TypeScript 2,7 min, generisano svih 1.421 statičkih stranica za 109 s. `/transformers` je uključena. Konfiguracija i zavisnosti nisu menjane. U logu ostaju upozorenja drugih modula o Edge runtime-u i nedostajućem AUTOFINISH_TRIGGER_TOKEN; ona nisu zaustavila lokalni build.
- Dodatni smoke paket: `node --import tsx src/tests/smoke/smoke.test.ts`, 43/43 prolaze. Npm/tsx CLI omotač nije mogao da otvori lokalni IPC kanal; direktno je izvršen isti testni kod preko Node loader-a.
- `npm run predeploy:check` vraća exit 0, ali status `warning`: nedostaju produkcioni env parametri i više ugovora drugih modula nije spremno. Taj rezultat nije zeleno svetlo za produkciju. Pun `npm test` i dependency audit nisu pokrenuti.
- Lokalni HTTP pregled izvršen u istom procesu sa dev serverom potvrđuje `/transformers`: HTTP 200, početni ekran, SVG i svih 23 opcije kamera; 1–4 aktivne, 5–23 onemogućene. Ovo je serversko renderovanje, bez provere interakcija. Raniji pokušaj pristupa serveru iz odvojenog okruženja vraćao je odbijenu vezu.
- Proveren i lokalni produkcioni server (`next start`): `/transformers` vraća HTTP 200, početni ekran, tačno jedan SVG sektora i 23 opcije kamere, od kojih su 1–4 aktivne i 5–23 onemogućene. Server je zaustavljen posle provere; nema deploymenta. To potvrđuje serversko renderovanje produkcionog artefakta, bez provere klijentskih interakcija.
- Cloud browser zabranjuje protokol `file:` za pripremljenu proveru originalne komponente. Zabrana nije zaobilažena. Interakcije u browseru, prikaz na malom ekranu i fizički telefon ostaju nepotvrđeni.
- Zatečeni GitHub statusi za prvi commit PR-a nisu zeleni: prisutni su `failure` i `startup_failure`; FinOps workflow nema poslove. Uzrok udaljenih neuspeha nije ovim proverama dijagnostikovan i ne predstavlja potvrđenu regresiju igre.

Pre ljudskog pregleda proveriti i u browseru: početak, transformaciju u oba smera, sve četiri kamere, pauzu/nastavak, promenu kartice tokom pritisnute komande, završetak i novi duel. Mobilni scenario: kretanje dodirom, otpuštanje van dugmeta i odsustvo horizontalnog skrolovanja. Uspešni testovi logike ne potvrđuju ove UI scenarije ili fizički telefon.

## Cross-repo impact

Nema promene IO-OPENUI-AO repozitorijuma ili zajedničkih mrežnih ugovora. Promena kataloga odnosi se samo na centralnu aplikaciju. Stari razgovor kao istorijska referenca: https://chatgpt.com/g/g-p-67c080727f6c8191bba48cc3999f24e9-igrice/c/692376be-8280-8332-a476-5e3d619972cf .

## Review i povratak

Predlog zahteva ljudski pregled pre spajanja, u skladu sa AGENTS.md. Nije dokaz objavljene igre ili produkcione spremnosti. Povratak: revert mini-sprint promena vraća tri kamere, prethodni sat i direktno praćenje bota; postojeći prototip i njegovo pokretanje ostaju. Nema migracija ili trajnih podataka za vraćanje.
