# KREATORIJUM — lokalni INDIREKT adapter

Digitalni kompjuter CLI sada ima dve odvojene komande. Browser katalog je nepromenjen.

```bash
npm run digitalni-kompjuter -- indirekt-plan '{"start":0,"target":10,"sequence":[3,1,7,10],"maxIterations":100,"maxDurationMs":1000,"status":"ACTIVATED"}'
npm run digitalni-kompjuter -- indirekt-run '{"start":0,"target":10,"sequence":[3,1,7,10],"maxIterations":100,"maxDurationMs":1000,"status":"ACTIVATED"}' --execute
```

Plan komanda validira INDIREKT ulaz i priprema NODE1450 read-only predlog nad fiksnim izvorima. Ne izvršava petlju, testove ili generisani kod. Run komanda zahteva zaseban `--execute`, ponovo validira ulaz postojećom VRH v0.2 mušemom i poziva postojeći INDIREKT runner kroz VRH. Plan nije obavezan preduslov run komande niti token dozvole; ova verzija ne vodi stanje approval procesa.

Opt-in je namera lokalnog operatora, NE autentikacija/identitet/bezbednosni sandbox. Koristiti pregledan lokalni checkout bez produkcionih tajni. Nema mrežne rute, background servisa, shell izvršavanja u adapteru, proizvoljnog izbora petlje, Java/Next build-a, deploymenta ili plaćanja. Existing CLI status/catalog/check/test ponašanje ostaje nepromenjeno.

Ulaz: start, target, sequence (do 1000 konačnih brojeva), maxIterations i maxDurationMs (1..1000), kanonski status. VRH numerički limit ostaje ±1000000. Vremenski guard je best-effort, ne hard realtime. Rezultat čuva originalni PetljaResult; numericalOutputUsable važi samo za completed rezultat. Blokiran/ograničen run vraća CLI exit 1; loša sintaksa/ulaz/izostavljen opt-in exit 2. Plan i validan završen run exit 0. Status petlje nije dokaz stvarnog operativnog sistema ili autorizacije.

Test: `npx tsx src/tests/lib/kreatorijum-local-service.test.ts`. Poređenje čuva output/status/trace/guard ugovor; ne dokazuje nezavisno matematičku ispravnost svih algoritama. Nema pune repo build/JVM potvrde.

Rollback: ukloniti nove indirekt-plan/indirekt-run CLI grane i import, lokalni adapter, test i ovu dokumentaciju. Osnovni NODE1450, VRH i INDIREKT algoritam nisu menjani. Promena ostaje lokalna do posebnog pregleda/publikacije.
