# NODE 1450 — razvojni contract

## Svrha

`NODE 1450` je lokalni read-only planer i ograničeni AI razvojni profil nad postojećim `NOTES 1450` handoff paketom. Pomaže da se iz postojećeg koda, dokumentacije i testova pripreme jasni predlozi za narednu izmenu.

Nije autonoman izvršilac, produkcioni runtime, bankarski sistem niti izvor istine.

## Veza sa NOTES 1450

- `NOTES 1450` ostaje kanonski bounded radni-handoff za cilj, kontekst, kontinuitet zadataka, saturaciju materijala i deterministički sledeći korak.
- `NODE 1450` koristi taj handoff samo za pripremu predloga rada.
- Ownership ostaje zaključan: `EXTREM` tehnički readiness, `EXTRONDOL` governance/review/rollback, `SPAJA KOD` audit-safe summary.

## Dozvoljeni izvori

1. verzionisani kod i testovi iz dostupnih repozitorijuma;
2. postojeća dokumentacija i API ugovori;
3. Vercel deployment, usage i observability podaci kada su relevantni;
4. eksplicitno dostavljen zahtev vlasnika proizvoda.

## Dozvoljeni izlazi

- plan izmene sa konkretnim fajlovima;
- predlog koda ili dokumentacije;
- test plan, lint/build rezultat i rollback plan;
- PR spreman za ljudski review;
- audit-safe sažetak statusa i otvorenih rizika.

## Zabranjeni izlazi

- samostalni merge, deploy, plaćanje, transfer ili promena billing plana;
- pristup, prikaz ili unos tajni, KYC dokumenata, računa ili payment kredencijala;
- tvrdnje o fizičkom hardveru, stvarnim igrama ili VR kompatibilnosti bez potvrđenog testa;
- predstavljanje predloga kao garantovanog prihoda ili automatskog poslovnog rezultata.

## Obavezni gate-ovi

1. jasna namera i konkretan target;
2. najmanja bezbedna izmena;
3. relevantni testovi i `git diff --check`;
4. code review pre commita;
5. pull request i human review pre merge-a;
6. rollback opis za runtime, config ili poslovne promene.

## Operativni tok

`zahtev → NOTES 1450 kontekst → analiza → mali predlog → testovi → PR → ljudski review → Vercel deploy → observability provera`

## Granice

NODE 1450 može ubrzati pripremu kvalitetnih izmena, ali vlasnik proizvoda zadržava odluke, a Vercel i GitHub ostaju stvarni sistemi za deploy, billing i verzionisanje.

## Izvršna verzija v1

```bash
npm run node:1450 -- "Pregled bankarskog modula" src/lib/ai-iq-world-bank.ts
npx tsx src/tests/lib/node-1450.test.ts
```

CLI validira 1–20 postojećih izvornih fajlova unutar `src/`, `scripts/` ili `docs/` i ispisuje JSON plan sa postojećim ownership granicama. Ne čita sadržaj fajlova, ne poziva LLM, ne generiše diff, ne izvršava testove niti menja fajlove. Cilj je ulaz vlasnika, ne dokaz izvršenog rada. Plan navodi `checksExecuted: false` i `codeGenerated: false`. Tajni/dot fajlovi, putanje van repozitorijuma i symlink ciljevi su odbijeni.

Ova verzija ne zamenjuje TypeScript, Node.js ili Next.js. NOTES 1450 ostaje postojeći handoff; nema nove runtime rute, source-of-truth sloja ili petog track-a. Predlog koda/automatska analiza sadržaja ostaju naredna faza, ne implementirana mogućnost.

## Sačuvana TypeScript dijagnostika

```bash
npm run node:1450 -- --diagnostics /path/to/typecheck.log src/lib/extrimli-extrem/index.ts
npx tsx src/tests/lib/node-1450-diagnostics.test.ts
```

Opciono čita eksplicitno odabran lokalni `.log`/`.txt` artifact do 1 MiB (krajnji symlink i dot putanje se odbijaju). Ne prosleđujte fajlove sa tajnama; koristite pouzdan lokalni direktorijum. Podržan je plain `tsc` format `file(line,column): error TSxxxx: ...`. Jedan postojeći EXTREM `.ts`/`.tsx` target se validira postojećim source allowlist pravilima.

Izlaz grupiše dijagnostike po kodu i navodi putanju/red/kolonu i generičku preporuku za pregled. Ne ispisuje originalne poruke ni sadržaj izvora, ne dokazuje da se artifact odnosi na aktuelnu reviziju i ne izvodi konkretan patch. Neprepoznat/prazan ulaz je greška, ne uspešan typecheck. Nula grešaka za target nije dokaz da ceo projekat prolazi. `checksExecuted`, `sourceContentsAnalyzed` i `codeGenerated` ostaju false.
