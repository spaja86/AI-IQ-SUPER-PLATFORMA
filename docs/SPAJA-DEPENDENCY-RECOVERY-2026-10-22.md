# SPAJA Deploy — bezbednosna dopuna, 22. oktobar 2026.

Status zabeležen pre objave: lokalni kandidat; merge i deployment nisu izvršeni. Tačan rezultat naknadne potpisane objave mora se proveriti kroz GitHub commit metapodatke i poređenje kompletnog Git stabla.

## Razlog i osnova

Korisnik je odobrio nastavak pripreme celog AI-IQ-SUPER-PLATFORMA repozitorijuma za SPAJA Deploy. Jedna od evidentiranih blokada je audit zaključanih zavisnosti: 51 prijavljeni paket, uključujući 15 high. Ovaj broj uključuje posredne/metavulnerability nalaze; nije broj nezavisnih exploita u aplikaciji.

- Predloženi OKRID: `OKRID-2026-SPAJA-DEPENDENCY-RECOVERY-001`.
- Lokalna grana: `fix/spaja-deploy-security-20261022`.
- Git osnova: head draft PR-a #1364, `361eebddb4f51a5674a351cea55cc19146d03ea4`.
- Nasleđeni, ranije provereni lokalni kandidat: tree `d094aca1386d51bc92ecc4158e3f11178049521b`, 32 izmenjene datoteke.
- Konačni tree, hash zaključanih zavisnosti i patch-evi beleže se u pratećem manifestu paketa.

## Promene

1. Ciljana ažuriranja `brace-expansion`, `js-yaml`, `socket.io-parser`, `source-map-js`, `undici` i `ws` u postojećim semantičkim rasponima. Direktne produkcione verzije Next.js, React, OpenAI SDK, AI SDK, Supabase i Wagmi ostaju neizmenjene.
2. Hardhat 3.4.3 → 3.20.0, unutar postojećeg deklarisanog `^3.4.3` raspona. Time njegov ZIP čitač prelazi sa ranjivog `adm-zip` 0.4.16 na 0.6.1. Ažurirane su potrebne posredne Hardhat zavisnosti.
3. Tri eksplicitna npm override pravila za zavisnosti koje roditelji zadržavaju na starim verzijama: `ws` 8.x → 8.22.0; Ignition `lodash-es` → 4.18.1; Mocha 11 `serialize-javascript` → 7.1.2. Poslednje pravilo menja major verziju posrednog serializatora; zahteva Node >=20 i zasebno je provereno stvarnim Mocha parallel workerima. Next.js već zahteva Node 20.9+, a ovde je korišćen Node 24.19.0. Override pravila treba ukloniti kada roditelji usvoje bezbedne verzije.
4. Dodat `test:dependencies` u standardni `test:ci`. Proverava stvarnu lokalnu WebSocket razmenu kroz četiri potrošača, Ignition lodash funkcije, serializaciju kroz Mocha parallel workere i regresiju za array-like CPU exhaustion u zasebnom procesu sa timeout-om.
5. API test jezika više ne izjednačava ispravan ulaz sa prolaskom vremenskog praga. Proverava da signal zaštite prati izmereno trajanje motora i zahteva BLOCKED signal kada je prag prekoračen. Postojeća realna granica vremena API odgovora i produkciona logika ostaju neizmenjene. U prvom pokretanju isti problem reprodukovan je i sa prethodnim zavisnostima.

Široki `npm audit fix --package-lock-only` je prvo ispitan u izdvojenoj kopiji, ali njegov rezultat nije zadržan: menjao je 380 zapisa verzija i povlačio nepotrebne promene u produkcionim SDK paketima. Konačna dopuna ima 67 promenjenih zapisa verzija/putanja (uključujući dodate i uklonjene posredne pakete). Nisu korišćeni `--force`, downgrade Next/ESLint konfiguracije ili izuzeci koji skrivaju nalaze.

## Audit nakon izmene

| Obuhvat | Critical | High | Moderate | Low | Ukupno |
| --- | ---: | ---: | ---: | ---: | ---: |
| Pre, sve zavisnosti | 0 | 15 | 20 | 16 | 51 |
| Posle, sve zavisnosti | 0 | 5 | 15 | 17 | 37 |
| Posle, `--omit=dev` | 0 | 0 | 14 | 7 | 21 |

Oba završna audit poziva vraćaju izlaz 1 zbog preostalih nalaza. **Security gate nije proglašen uspešnim.** Nula high nalaza u produkcionom skupu nije dokaz ukupne bezbednosti niti procena dosegljivosti svake ranjivosti.

Preostalih pet high zapisa čini razvojni lanac `eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces`. Za `braces` advisory GHSA-vfj7-8cjw-p6xm trenutno ne navodi zakrpljenu verziju. npm predlog downgrade-a `eslint-config-next` na 14.2.35 nije prihvaćen uz Next.js 16.4.1. Ostaju i nalazi za MetaMask, decode-uri-component, uuid, elliptic, katex, diff, @humanfs/node i @ai-sdk/provider-utils, zajedno sa njihovim posrednim roditeljima; detalji su u audit JSON dokazima. Broj low nalaza porastao je za jedan zbog izmenjenog razvojnog stabla; ukupan broj i high nalazi su smanjeni.

## Validacija

Završni rezultati komandi beleže se u pratećem izveštaju. Potvrđeno pre pakovanja: čista instalacija `npm ci`, kompletan `npm test` (svih deset faza, uključujući osam testova kompatibilnosti zavisnosti), TypeScript, puna lint provera (0 grešaka / 90 upozorenja), 43/43 smoke tvrdnje, produkcioni Next.js build i kompajliranje oba Solidity ugovora. Sve navedene komande završile su izlazom 0.

Hardhat kompajliranje je izvršeno u privremenom ESM projektu sa kopijom originalnog `hardhat.config.ts` i oba ugovora, uz stvarne ažurirane zavisnosti i solc 0.8.24. Time se proverava kompajler/plugin kompatibilnost; nije tvrdnja da je korenski blockchain CLI potpuno podešen. Korenski `package.json` i dalje nema `type: module`. Nije izvršen deploy ugovora niti blockchain transakcija.

Prvo puno `npm test` pokretanje prijavilo je jedan API test koji je imao previše strogo očekivanje za stvarni vremenski prag; taj neuspeh je zadržan u dokazima. Nakon ispravke očekivanja ciljano pokretanje prolazi 8/8, a završni puni test i build prolaze. Sedam direktorijumskih test pokretanja obrađuje 245 datoteka, uz 11 eksplicitnih core/critical pokretanja i osam novih testova kompatibilnosti. Browser tokovi i udaljeni CI za ovaj kandidat nisu potvrđeni. GitHub tokom ove provere i dalje prikazuje problem sa naplatom naloga; prethodni udaljeni poslovi nisu ni započeli izvršavanje. Lokalni prolaz nije zamena za udaljene release provere.

## Objava, trošak, rollback i povezani repozitorijumi

`AGENTS.md` zahteva potpisane commit-e, jasan audit, obavezne provere i ljudski pregled. Lokalno nema potvrđenog ključa za potpisivanje; nije napravljen nepotpisani commit. Posle podržane potpisane objave radne grane, PR mora dobiti oznake `agent:config-change` i `security:needs-review`, proći provere na tačnoj reviziji i dobiti nezavisan ljudski pregled. Postojeći main hold ostaje aktivan.

SPAJA Sites write hold iz `WRITE-AUTH-REVIEW.md` ostaje zasebna blokada. Ova dopuna ne otključava upis, ne konfiguriše produkcione tajne i ne pretvara probni Render servis u punu platformu.

Rollout: prvo pregled lokalne dopune, zatim potpisana objava i CI; produkciona promocija tek nakon razrešenih release blokada. Rollback: pregledano vraćanje ove dopune na navedeni prethodni kandidat; vraća stare ranjivosti, pa nije preporučena rutinska produkciona mera. Nema migracija podataka. Trošak: lokalna provera i preuzimanje javnih paketa/kompajlera; bez plaćenih servisa i OpenAI API poziva. Nema izmene `spaja86/IO-OPENUI-AO` niti međurepozitorijumskog API ugovora.

## Primarni izvori

- https://docs.npmjs.com/cli/v11/commands/npm-audit/
- https://docs.npmjs.com/cli/v11/commands/npm-update/
- https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#overrides
- https://github.com/advisories/GHSA-vfj7-8cjw-p6xm
- https://github.com/advisories/GHSA-qj8w-gfj5-8c6v
- https://github.com/lodash/lodash/releases
- npm registry metapodaci i audit odgovori, provereni 22.10.2026.
