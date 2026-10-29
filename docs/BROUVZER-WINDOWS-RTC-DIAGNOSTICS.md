# Windows 11: ponovljiva WebRTC matrica za PR #1374

Zahtev: nastavak dijagnostike `ice-no-candidates`, bez promene CRDT pilota,
bez spoljnih STUN/TURN servera, bez merge-a ili javnog servisa.
Osnova: `fe716d4a4f436a64f794fd48ea431c4484e3aabb`.

## Alat i granice dokaza

`tests/brouvzer-sync/windows-rtc-matrix.cjs` pokreće postojeći
`native-rtc.cjs` u zasebnom procesu za svaki browser/profil. Postojeći
native probe, CRDT aplikacija, bilateralna potvrda otiska, replay zaštita,
inkognito i testni protokol nisu menjani.

Windows pretraga proverava standardne Program Files, Program Files (x86) i
LocalAppData instalacije Chromiuma, Chrome-a i Edge-a. Ako nema standardnog
Chromiuma, proverava instalirani Playwright-managed Chromium. Nestandardna
instalacija ne smatra se pronađenom: red dobija SKIP. Alat ne instalira
Chrome/Edge, ne koristi postojeći korisnički profil i ne zahteva administratora.
Koristi zaseban privremeni Playwright context. Ne menjati firewall, antivirus,
VPN ili OS zaštite radi dobijanja prolaza.

Sve dostupne verzije se testiraju serijski, headless, na istih pet postojećih
profila: host-default, host-loopback, loopback-origin, relay-without-servers,
withhold-answer. Razlikuje se samo izvršni browser; verzija i izvor su u JSON-u.
Rokovi i značenje profila ostaju u [native vodiču](BROUVZER-NATIVE-RTC-DIAGNOSTICS.md).
Svaka proba ima spoljašnji limit 240 s. Limit/prekid/loš JSON daje FAIL i
nepotvrđen cleanup. Prisilno prekinut proces nije dokaz zatvaranja browser
potomaka: ako se to dogodi, proveriti Task Manager pre ponavljanja.

Ambient ICE konfiguracija, approval hash, RTC tajne, alternate Chromium modul,
DEBUG/PWDEBUG i NODE_OPTIONS se ne prosleđuju podprocesu. Matrica koristi samo
repo profile sa praznim iceServers. Ne predstavlja odobrenje za STUN/TURN.
PLAYWRIGHT_MODULE je pouzdani lokalni modul, kao i u postojećem runner-u.

JSON izlaz sadrži samo dozvoljena polja: PASS/FAIL/SKIP, fazu, ishod,
browser verziju, broj/tip kandidata po peer-u, gathering complete/timeout,
broj kandidata u SDP-u (bez SDP-a), numeričke ICE error kodove, channelOpen,
transferVerified, channelCloseHandshake i cleanupVerified. Sadrži i hash-eve
izvornih testnih datoteka/profila radi ponovljivosti, bez fingerprint-a uređaja.
Ne prosleđuje raw stdout/stderr, putanje instalacija, IP adrese, SDP, candidate
stringove, DTLS fingerprint-e, tajne, trace, HAR ili browser logove.

PASS zahteva exit 0 postojeće probe, oba otvorena kanala, obe tačne primljene
sintetičke poruke, handshake zatvaranja i potvrdu RTC/context/browser/server
cleanup-a. Nepotvrđena vrednost ostaje false/null/unknown. Negativne kontrole
ostaju FAIL za prenos i imaju `negativeControl: true`; nisu regresija kada se
prekidaju očekivano. Zato kompletna matrica sa negativnim kontrolama vraća
exit **2** i kada normalni profili prođu. Čitati pojedinačne redove.
Exit 1 znači grešku same matrice (uključujući nemogućnost upisa izveštaja).
Nedostupan browser je SKIP; nula proba nikada nije uspeh.

## PowerShell, Windows 11, disk D

Preduslovi: Git, Node 24+, mreža za preuzimanje zaključanih zavisnosti i
pouzdan Playwright. Komande pokretati u PowerShell-u; ne prepisuju Windows
ili postojeću instalaciju. Za checkout koristiti prazan odabrani direktorijum.
Ako je repozitorijum već preuzet, preći u njegov direktorijum i preuzeti
najnoviju reviziju draft grane bez odbacivanja sopstvenih izmena.

```powershell
New-Item -ItemType Directory -Force D:\SPAJA | Out-Null
Set-Location D:\SPAJA
git clone --single-branch --branch codex/brouvzer-sync-pilot-20261026 https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA.git SPAJA-RTC-QA
Set-Location D:\SPAJA\SPAJA-RTC-QA
npm ci --prefix pilot/brouvzer
if ($LASTEXITCODE -ne 0) { throw 'Instalacija pilot zavisnosti nije uspela' }
npm run build --prefix pilot/brouvzer
if ($LASTEXITCODE -ne 0) { throw 'Pilot build nije uspeo' }
node --test tests/brouvzer-sync/*.test.mjs
if ($LASTEXITCODE -ne 0) { throw 'Sinteticki testovi nisu prosli' }
```

Ako već imaš odvojeni Playwright, postavi PLAYWRIGHT_MODULE na njegov
pouzdan entrypoint. U suprotnom zasebna QA instalacija, bez novih repo zavisnosti:

```powershell
npm install --prefix D:\SPAJA\rtc-tooling --save-exact playwright@1.62.1
if ($LASTEXITCODE -ne 0) { throw 'QA alat nije instaliran' }
$env:PLAYWRIGHT_MODULE = 'D:\SPAJA\rtc-tooling\node_modules\playwright'
# Opciono: managed Chromium; Chrome/Edge se otkrivaju nezavisno.
node D:\SPAJA\rtc-tooling\node_modules\playwright\cli.js install chromium
node tests/brouvzer-sync/windows-rtc-matrix.cjs D:\SPAJA\rtc-windows-report-01.json
$rtcExit = $LASTEXITCODE
Write-Host "Matrica exit: $rtcExit (2 ukljucuje negativne kontrole)"
```

Upis izveštaja odbija postojeću datoteku; za sledeće pokretanje izabrati novi
naziv. Standardni izlaz već prikazuje sanitizovani JSON. Za kontrolu ponovljivosti
ponoviti sa report-02/report-03 bez menjanja mreže, instalacija ili profila.
Ne snimati nefiltrirane WebRTC internals/logove u javnu evidenciju.

Posle native PASS-a zasebno pokrenuti postojeći aplikacioni runner sa tačno
izabranim browser-om (putanja ostaje samo lokalna):

```powershell
$env:CHROMIUM_EXECUTABLE = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
node tests/brouvzer-sync/browser.mjs
Remove-Item Env:CHROMIUM_EXECUTABLE -ErrorAction SilentlyContinue
```

Prilagoditi putanju stvarnoj instalaciji Chrome/Edge/Chromium. Aplikacioni
runner ima sopstveni profil: native PASS ne dokazuje CRDT konvergenciju,
bezbednost aplikacionog protokola niti prolaz svih 11 aplikacionih scenarija.
Dva peer-a u jednoj stranici takođe ne dokazuju NAT prolaz između uređaja/mreža.

## Izvršeno u ovoj dopuni, 30.10.2026. (Europe/Belgrade)

- Linux, Node 24.22.1: pilot build PASS; Node paket **77/77 PASS**
  (prethodnih 69 + 8 novih). RTC mreža u Node testovima je sintetička.
- Windows matrica na Linux-u: exit 2, platform unsupported,
  windowsExecution false, bez probnih redova. Nema izmišljenog Windows PASS-a.
- Postojeća native proba preko dostupnog Playwright 1.62.1: exit 1,
  harness-error u browser-launch, RTC proba nije počela; nema dokaza prenosa
  niti utvrđenog novog uzroka ranijeg ice-no-candidates.
- Syntax i git diff --check: PASS. Windows 11, Chrome/Edge mrežni prenos,
  aplikacioni browser/UI runner i puni root/udaljeni CI nisu potvrđeni ovom dopunom.

Human/security review ostaje obavezan. Nema novih root/pilot zavisnosti,
workflow/config, hosting, cloud ili finansijskih promena. No linked repo
change required; IO-OPENUI-AO nepromenjen. Rollback uklanja samo novu matricu,
njene testove i ovaj vodič; pilot i njegova baza ostaju netaknuti.
