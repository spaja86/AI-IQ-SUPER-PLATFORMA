# SPAJA Network — proksi za sopstveni server

Status: testiran lokalni reverse proxy; javni server, domen, DNS i TLS nisu povezani.
Izvor zahteva: povezati SPAJA Deploy i SUPEROMEGATRAJEKTORIJUM preko sopstvenog servera, bez Vercel-a.
OKRID: `OKRID-2026-SPAJA-NETWORK-001`. Vlasnik: Nikola Spajić.

Ovaj paket generiše Caddy konfiguraciju za tri tačno određena HTTP servisa na istom serveru.
Ne kupuje domen, ne menja DNS/firewall, ne pokreće aplikacije i ne pretvara deklarisani server u raspoloživ izvršni čvor.
Ne kreira VPN, L2/L3 mrežu, DNS resolver niti build worker.

## Naziv i stvarne adrese

`spaja.nivo*spaja` ostaje logički naziv mreže. Nije standardno javno ime HTTPS hosta.
Wildcard u DNS-u koristi zasebnu krajnje levu oznaku `*`, kao `*.example.net`.
Raniji predlog `spaja.nivo-spaja` iz `docs/EXTRIMLI-START-DEPLOY.md` takođe nije dokaz javnog domena:
`NIVO-SPAJA` nije u IANA listi TLD-ova od 24. oktobra 2026. Ovaj paket ne koristi taj predlog kao javni cilj.
Validacija generatora proverava sintaksu i poznate zabranjene slučajeve, ne vlasništvo ni kompletnu aktuelnu IANA listu.

Za ilustrativni domen `network.example.net` mapiranje je:

| Ulaz | Aplikacija na istom serveru | Uloga |
| --- | --- | --- |
| `https://network.example.net` | `127.0.0.1:3000` | Centralna SPAJA platforma |
| `https://deploy.network.example.net` | `127.0.0.1:3100` | SPAJA Deploy |
| `https://super.network.example.net` | `127.0.0.1:3200` | SUPEROMEGATRAJEKTORIJUM |

`example.net` je dokumentacioni primer i mora se zameniti stvarnim domenom vlasnika.
Upstream portovi su podesivi; proizvoljni udaljeni hostovi i URL-ovi nisu podržani.
Ako su servisi u kontejnerima, objaviti njihove portove samo na host loopback adresi ili napraviti zasebno pregledanu kontejnersku mrežu.
Ova konfiguracija očekuje Caddy na hostu, ne u odvojenom kontejneru.

## Lokalno pokretanje

Preduslovi: Node.js 24 i Caddy 2.11.7, preuzet iz zvaničnog izvora. Caddy nije npm zavisnost aplikacije.
Generator koristi zajednički TypeScript model iz `src/lib/deploy/spaja-network.ts` i Node 24 ugrađeno uklanjanje tipova; nema novih npm zavisnosti.

```sh
node ops/spaja-network/network.mjs local --out /tmp/spaja-network-local
caddy fmt --overwrite /tmp/spaja-network-local/Caddyfile
caddy validate --config /tmp/spaja-network-local/Caddyfile --adapter caddyfile
caddy run --config /tmp/spaja-network-local/Caddyfile --adapter caddyfile
```

Izlazni direktorijum mora biti nov. Generator odbija prepisivanje postojeće konfiguracije.
Lokalni proksi sluša isključivo `127.0.0.1:8080`. Admin API i automatsko izdavanje sertifikata su isključeni u lokalnom režimu.
Pokrenuti svaku stvarnu aplikaciju na njenom loopback portu pre provere aplikacionog saobraćaja.
Za postojeći monorepo, odgovarajuća komanda iz već izgrađenog checkout-a je:

```sh
npm run start -- --hostname 127.0.0.1 --port 3000
```

Ona pokreće centralnu aplikaciju, ne zasebne SPAJA Deploy/SUPEROMEGATRAJEKTORIJUM servise.
Njihovi izvori i buildovi moraju biti postavljeni zasebno. Privatne Sites publikacije se ne preuzimaju niti otključavaju ovim paketom.

```sh
curl --resolve spaja.localhost:8080:127.0.0.1 http://spaja.localhost:8080/_spaja/health
curl --resolve spaja.localhost:8080:127.0.0.1 http://spaja.localhost:8080/_spaja/network
curl --resolve deploy.spaja.localhost:8080:127.0.0.1 http://deploy.spaja.localhost:8080/
```

Na `/_spaja/` je ulazna stranica mreže sa tri servisa. `/_spaja/network` je javni direktorijum konfigurisanih URL-ova.
`/_spaja/health` potvrđuje samo da proksi odgovara: `edge-up`, `upstream: not-measured`.
Nedostupan upstream vraća `502`; proksi ne prikazuje lažnu spremnost aplikacije.
Na drugom računaru/telefonu `localhost` označava taj drugi uređaj, ne server.

## Postavljanje na stvarni server

Potrebni podaci: tačan registrovani domen, javna IP adresa, OS/server provajder i način ovlašćenog pristupa serveru/DNS-u.
Lozinke i privatne SSH ključeve ne unositi u chat ili Git. Koristiti ovlašćenu vezu/secret store.
Server iza CGNAT-a bez dolaznog pristupa zahteva posebno rešenje tunela ili javni ulaz; sam A zapis nije dovoljan.

1. Proveriti vlasništvo domena i javni IPv4 servera; utvrditi stvarne upstream portove i pokretanje servisa posle restarta.
2. Generisati konfiguraciju u novom direktorijumu. Podrazumevani javni režim vraća `503` za aplikacije.
3. Napraviti tri A zapisa iz `network.json` prema potvrđenom javnom IPv4. Ne dodavati AAAA zapis ako IPv6 nije proveren.
4. Dozvoliti dolazni TCP 80/443 i, opciono, UDP 443 za HTTP/3. Administrativni pristup ograničiti prema politici servera.
   Portove 3000/3100/3200/2019 ne izlagati internetu. Ne menjati firewall pre provere postojećeg administrativnog pristupa.
5. Sačuvati prethodni Caddyfile van javnog repozitorijuma, validirati novu konfiguraciju, pa je instalirati kroz standardni Caddy servis.
   Caddy proces mora imati pristup portovima 80/443 i trajnom direktorijumu sertifikata. Koristiti zvanični sistemski servis.
6. Proveriti A/AAAA, HTTPS bez isključivanja TLS provere, HTTP→HTTPS preusmerenje i održavanje sa spoljnog uređaja.
7. Pre prosleđivanja aplikacija završiti pregled autentifikacije, autorizacije, tajni, aplikacionih limita i release provere.
   Zatim generisati zasebnu konfiguraciju sa `--serve-apps`, validirati je i izvršiti kontrolisano ponovno učitavanje.

```sh
# Primer — zameniti network.example.net stvarnim domenom pre korišćenja.
node ops/spaja-network/network.mjs public --domain network.example.net --out /tmp/spaja-network-maintenance
caddy fmt --overwrite /tmp/spaja-network-maintenance/Caddyfile
caddy validate --config /tmp/spaja-network-maintenance/Caddyfile --adapter caddyfile

# Tek za pregledane aplikacije, sa potvrđenim lokalnim portovima:
node ops/spaja-network/network.mjs public --domain network.example.net --serve-apps --out /tmp/spaja-network-active --platform-port 3000 --deploy-port 3100 --super-port 3200
caddy fmt --overwrite /tmp/spaja-network-active/Caddyfile
caddy validate --config /tmp/spaja-network-active/Caddyfile --adapter caddyfile
```

Ove komande samo pripremaju fajlove. Nisu dokaz da su DNS, sertifikati ili aplikacije aktivni.
Komanda `caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile` primenjuje prethodno instalirani, pregledani fajl.
Javni režim ima admin API samo na `127.0.0.1:2019`. Ne postavljati drugi CDN/proksi ispred ovog ulaza bez novog pregleda granice poverenja.

## Bezbednosni i aplikacioni ugovor

- Tri fiksna upstream-a na loopback-u; nema otvorenog proksija ni parametra kojim posetilac bira cilj.
- `Authorization` i `Cookie` ostaju za proveru u aplikaciji; gateway ne dodeljuje identitet korisniku.
- Uklanjaju se klijentska `Forwarded`, `X-Forwarded-*`, `X-Real-IP`, `True-Client-IP`, `CF-Connecting-IP`,
  `OAI-Authenticated-*`, `OAI-Sites-Authorization`, `X-Auth-Request-*` i `X-Remote-User` zaglavlja.
  Caddy formira nova forwarded zaglavlja iz neposredne veze i zamenjuje request ID.
- Aplikacije moraju verovati forwarded zaglavljima samo kada zahtev dolazi od ovog loopback proksija.
  Različiti poddomeni zahtevaju pregled cookie Domain/SameSite, CORS i dozvoljenih Origin vrednosti; SSO nije implementiran.
- CONNECT/TRACE i uobičajene putanje tajnih fajlova se odbijaju; svaki backend i dalje mora imati sopstvene kontrole pristupa.
- Limit tela zahteva je 8 MiB. To je striming limit: backend može primiti deo tela pre greške; ne sme potvrditi operaciju pre validacije celog zahteva.
- Ograničenje čitanja zaglavlja je 10 s, tela 30 s; povezivanje sa upstream-om 3 s, čekanje njegovih zaglavlja 30 s.
  Dugotrajni striming ostaje moguć. Nema automatskog ponavljanja neuspelih upisa.
- HTTP, SSE i WebSocket prolaze kroz Caddy. Ovo nije generički TCP/UDP tunel, WAF ili globalni rate limiter.
  Limiti autentifikacije, AI troška i upotrebe resursa ostaju u aplikacionom sloju.
- Pristupni logovi nisu uključeni. Standardni Caddy logovi grešaka ostaju; ne stavljati tajne u URL-ove.
  Pre produkcije podesiti retention, nadzor i alarmiranje prema politici vlasnika.
- Privatni Sites pristup, produkcioni DNS, postojeći firewall i AI pilot iz PR-a #1370 ostaju nepromenjeni.

## Provere i granice dokaza

### Razvojno mapiranje — 28. oktobar 2026.

Jedan model sada koriste Caddy generator, `/deploy-platforma`,
`/api/deploy-platforma/network` i polje `network` u postojećem status API-ju.
Ulaz je `ops/spaja-network/development.json`. `publicDomain: null` je nameran:
nijedno vlasništvo, javni server, DNS ili TLS nisu potvrđeni.

| Podatak | Značenje |
| --- | --- |
| `networkId` | Tačan interni ID `spaja.nivo*spaja`; nikada DNS ili URL |
| `applications[].spajaId` | Osnovni ID za platformu; `/deploy` i `/super` za druge dve aplikacije |
| `publicDomain` u ulazu / `publicDomain.candidate` u rezultatu | Izričito uneti osnovni javni hostname; može biti domen ili poddomen, bez dokaza registracije |
| `publicDomain.registeredDomain` u rezultatu | Registrovani domen iz zasebnog, pregledanog dokaza; ne iz pretpostavke o poslednje dve DNS oznake |
| `applications[].subdomain` | Jedna DNS oznaka u odnosu na osnovni hostname, ili prazno za osnovni host |
| `applications[].proxy` | Fiksni loopback upstream i ruta `/`; originalni path/query ostaju sačuvani |
| `applications[].tls` | Status zasebnog opažanja sertifikata za tačan javni host |

`spaja.nivo-spaja.com` i `spaja-nivo-spaja.com` ostaju različiti mogući unosi.
Nijedan nije automatski izabran, preimenovan, proglašen registrovanim ili vlasništvom korisnika.
Validator odbija poznate ne-javne završetke, neispravne hostove, wildcard/URL/IP,
duple ID-jeve/aplikacije/hostove/portove, nepoznate aplikacije i proizvoljne upstream URL-ove.
Sintaksa nije provera kompletne aktuelne IANA/public-suffix baze: nepoznati, sintaktički
mogući završetak ostaje **neproveren**, nikad dokaz registracije.

```sh
node ops/spaja-network/network.mjs local --mapping ops/spaja-network/development.json --out /tmp/spaja-network-mapping-local
# Samo čitanje u lokalno pokrenutoj platformi:
curl 'http://127.0.0.1:3000/api/deploy-platforma/network?id=spaja.nivo%2Aspaja%2Fdeploy'
```

Za zasebnu radnu konfiguraciju kopirati JSON u nov fajl i izmeniti samo eksplicitne
host/port vrednosti. `--mapping` se ne sme mešati sa starim `--domain`/port argumentima.
Stari CLI argumenti i lokalni portovi 3000/3100/3200 ostaju podržani.
Postojeći fajlovi i izlazni direktorijumi se ne prepisuju. Nije napravljena migracija
postojećih runtime/DNS konfiguracija. Manifest sada ima `schemaVersion: 2`; stara
polja `networkName`, `services` i `dns` ostaju, a dodato je strukturirano `mapping`.
Javni API i Caddy direktorijum uklanjaju interne portove i upstream adrese.

#### Granica poverenja za TLS

`buildNetworkMapping(input, evidence, now)` prima konfiguraciju i dokaze odvojeno.
Konfiguracioni JSON odbija polja poput `tls`, `status`, `ownershipVerified` i `upstream`;
API nema POST/upis i ne preuzima dokaze iz query parametara. Generator nikada ne
prihvata dokaze iz ulaznog JSON-a i ne izdaje sertifikate. `https://` u planiranom
URL-u znači planirani protokol, ne aktivan TLS.

`active` zahteva server/operator opažanje `source: tls-probe`, tačan host,
`chainVerified: true`, `hostnameVerified: true`, SHA-256 otisak i važeće datume.
Dokaz mora biti star najviše 24 h, ne sme biti iz budućnosti i sertifikat mora
važiti u trenutku provere i prikaza. Istekli dokaz daje `stale`, istekao sertifikat
`expired`, neispravan dokaz `failed`; bez dokaza je `unverified`.
To je validacija već prikupljenih dokaza, **nije implementirana javna TLS sonda**.
Budući adapter sme proslediti dokaze samo iz pouzdanog server/operator izvora sa
standardnom proverom CA lanca i imena; nikad iz korisničkog JSON-a ili browser tvrdnje.
Ni aktivan TLS ne potvrđuje vlasništvo, DNS cilj, dostupnost upstream-a ili release odobrenje.
`publicActivationAllowed` ostaje `false`; nema novog deployment trigger-a.

Vercel governance izlaz je sada `scope: vercel-integration-only`, uz zaseban
`spajaNetwork` rezultat. Njegova kompatibilna canonical apex/wildcard polja su `null`;
potrošači moraju prikazati „nije podešeno“, bez sklapanja URL-a iz `null`.
Legacy Vercel workflow-i, env/secrets i EXTRIMLI konfiguracije nisu menjani niti pokrenuti.
Oni nisu izvor istine za ovo razvojno mapiranje i zahtevaju zaseban pregled pre eventualne javne upotrebe.

```sh
CADDY_BIN=/apsolutna/putanja/do/caddy node --test ops/spaja-network/network.test.mjs ops/spaja-network/mapping.test.mjs
node --import tsx --test src/tests/lib/spaja-network.test.ts
```

Promena je nastavak PR-a #1371 / `OKRID-2026-SPAJA-NETWORK-001` po zahtevu vlasnika.
Rollout: pregled razvojne grane → potvrđen domen/server → zasebni DNS/TLS i aplikacioni
dokazi → odobrena operativna aktivacija. Rollback koda: vratiti ovaj commit; rollback
servera ostaje prethodno sačuvani Caddyfile. Nema troška nove infrastrukture niti novih
zavisnosti. KPI: tačno mapirane aplikacije, odbijeni konflikti i nula TLS aktivnosti bez
dokaza. `IO-OPENUI-AO` nema promenu API-ja, runtime-a ili izvora u ovom zadatku.

### Istorijska provera prototipa iz PR-a #1371

```sh
CADDY_BIN=/apsolutna/putanja/do/caddy node --test ops/spaja-network/network.test.mjs
```

Ako `CADDY_BIN` nije postavljen, integracioni test je eksplicitno preskočen; to nije potvrda rada proksija.
Lokalno na Node 24/Caddy 2.11.7: **32/32 testova**, bez preskakanja, uključujući tri hosta, putanju/query/POST,
token/cookie, podmetnuta zaglavlja, 413, 502, SSE, prekid klijenta i WebSocket razmenu.
Validirana su oba javna konfiguraciona režima i lokalni režim. Javno izdavanje TLS sertifikata nije testirano.
Caddy Linux amd64 arhiva: SHA-256 `727b91701a392de6ebc5027509f548bf39979e5216340d0faed8fa5e69c84f8b`,
upoređen sa digestom zvaničnog GitHub izdanja 2.11.7. Provera potpisa arhive nije izvršena.
Test fixture servisi se gase i uklanjaju nakon testa; nisu produkcione instance tri platforme.
Kroz isti proksi proverena je i ranije izgrađena lokalna Next.js aplikacija: `/api/health` i `/deploy-platforma` vraćaju 200.
Ruta `/omega` u tom buildu vraća 404, a nepokrenuti SUPEROMEGATRAJEKTORIJUM upstream 502; te površine nisu označene kao dostupne.
Izolovana razvojna grana: produkcijski `npm run build`, ciljani ESLint i 43/43 smoke provere prolaze.
`predeploy:check` ostaje u statusu `warning` zbog postojeće nepotpune konfiguracije/ugovora; udaljeni CI i kompletan release nisu potvrđeni.

## Rollout, rollback i uticaj

- Rollout: pregled PR-a → potvrđen domen/server → održavanje sa validnim TLS-om → provereni privatni backend-i → eksplicitno uključivanje.
- Rollback: ponovo učitati sačuvanu prethodnu konfiguraciju ili validiranu konfiguraciju održavanja. Ne brisati sertifikate ili aplikacione podatke.
- KPI: broj uspešnih ruta i testova, proverene HTTP greške, kasnije stvarni TLS/DNS/uptime/p95. Nema obećanja dostupnosti ili kapaciteta.
- Downstream: nema promene API ugovora ili izvora `spaja86/IO-OPENUI-AO`; taj repozitorijum nije novi upstream.
- Nema novih npm zavisnosti, promene build worker-a, automatskog merge-a, plaćene infrastrukture ili promene postojeće objave.
- Release i dalje zahteva review i odgovarajuće build/lint/test/smoke/predeploy/security provere iz AGENTS.md.

## Zvanični izvori

- [Caddy reverse_proxy](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy)
- [Caddy automatic HTTPS](https://caddyserver.com/docs/automatic-https)
- [Caddy globalne opcije](https://caddyserver.com/docs/caddyfile/options)
- [Caddy sistemski servis](https://caddyserver.com/docs/running)
- [Next.js self-hosting](https://nextjs.org/docs/app/guides/self-hosting)
- [RFC 4592 — wildcard oznake](https://www.rfc-editor.org/rfc/rfc4592.html)
- [IANA TLD lista](https://data.iana.org/TLD/tlds-alpha-by-domain.txt)
