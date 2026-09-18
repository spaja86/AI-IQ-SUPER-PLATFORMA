# PETLJE — Unified Loop Contract

Ovaj dokument definiše značenje, cilj i zajednički API za:
- `FOR PETLJA`
- `ITCH PETLJA`
- `UR PELJA`
- `NIK PETLJA`
- `DOR PETLJA`
- `EXE PETLJA`
- `KUR PETLJA`
- `DAR PETLJA`
- `YU PETLJA`
- `ZAR PETLJA`
- `DER PETLJA`
- `GAR PETLJA`
- `ZUR PETLJA`
- `IZI PETLJA`
- `UK PETLJA`
- `ZUM PETLJA`
- `DJUPRE PETLJA`
- `DOMPRE PETLJA`
- `KRUMPE PETLJA`
- `DOMBRE PETLJA`
- `OMBA PETLJA`
- `DOKSI PETLJA`
- `DOMBRA PETLJA`
- `DOKON PETLJA`
- `DUMPIR PETLJA`
- `DOMBAR PETLJA`
- `ZUMBA PETLJA`
- `DONKI PETLJA`
- `DOMPOR PETLJA`
- `DOK PETLJA`
- `DIK PETLJA`
- `SAR PETLJA`
- `OKRED PETLJA`
- `DIREKT PETLJA`
- `INDIREKT PETLJA`
- `SPAJA PETLJA`
- `DURMITOR PETLJA`
- `UMBREL PETLJA`

Kanonski statusi petlji:
- `MONSTER`
- `DISABLED`
- `ACTIVATED`
- `DEAD`

Dozvoljeni alias-i ulaza:
- `DISEBLED` → `DISABLED`
- `AKTIVEJT` → `ACTIVATED`
- `DED` → `DEAD`

## Značenje i cilj

1. **FOR PETLJA**
   - Cilj: Sekvencijalno iteriranje od `start` do `end` uz `step`.
   - Izlaz: Suma svih posećenih vrednosti.

2. **ITCH PETLJA**
   - Cilj: Iterativno približavanje od `start` ka `target` uz kontrolisani korak.
   - Izlaz: Završna (ciljna ili delimična) vrednost.

3. **UR PELJA**
   - Cilj: Linearna obrada ulazne sekvence (`sequence`).
   - Izlaz: Deterministička suma elemenata.

4. **NIK PETLJA**
   - Cilj: Obrnuto odbrojavanje od `start` ka `end`.
   - Izlaz: Suma svih posećenih vrednosti pri odbrojavanju.

5. **UMBREL PETLJA**
   - Cilj: Orkestracija svih osnovnih i proširenih petlji kroz jedinstveni rezultat i jedinstven audit trag.
   - Izlaz: Agregiran izlaz svih petlji.

6. **DOR PETLJA**
   - Cilj: Prolazak kroz opseg od `start` do `end` i sabiranje apsolutnog odstupanja svake vrednosti od `target`.
   - Izlaz: Ukupan zbir odstupanja.

7. **EXE PETLJA**
   - Cilj: Obrada `sequence` kroz težinsko sabiranje po indeksu.
   - Izlaz: `Σ value * (index + 1)`.

8. **KUR PETLJA**
   - Cilj: Koračno približavanje od `start` ka `target` uz akumulaciju svih međukoraka.
   - Izlaz: Zbir svih postignutih međuvrednosti do targeta.

9. **DAR PETLJA**
   - Cilj: Izračunavanje aritmetičke sredine svih posećenih vrednosti u opsegu.
   - Izlaz: Prosek posećenih vrednosti.

10. **YU PETLJA**
    - Cilj: Brojanje elemenata sekvence koji dosežu ili prelaze `target`.
    - Izlaz: Broj pogodaka u sekvenci.

11. **ZAR PETLJA**
    - Cilj: Merenje volatilnosti sekvence kroz apsolutne razlike susednih elemenata.
    - Izlaz: Zbir svih susednih odstupanja.

12. **DER PETLJA**
    - Cilj: Praćenje najveće prefiksne sume sekvence.
    - Izlaz: Maksimalna prefiksna suma.

13. **GAR PETLJA**
    - Cilj: Pronalaženje najveće posećene vrednosti u opsegu.
    - Izlaz: Maksimum posećenih vrednosti.

14. **ZUR PETLJA**
    - Cilj: Pronalaženje elementa sekvence najbližeg `target` vrednosti.
    - Izlaz: Najbliža vrednost iz sekvence.

15. **IZI PETLJA**
    - Cilj: Pronalaženje prvog indeksa u sekvenci koji tačno odgovara `target` vrednosti.
    - Izlaz: Indeks prvog pogotka ili `-1`.

16. **UK PETLJA**
    - Cilj: Brojanje posećenih vrednosti u opsegu koje su manje ili jednake `target`.
    - Izlaz: Broj vrednosti ispod ili na target pragu.

17. **ZUM PETLJA**
    - Cilj: Sabiranje kvadrata svih posećenih vrednosti u opsegu.
    - Izlaz: Zbir kvadrata.

18. **DOK PETLJA**
    - Cilj: Target petlja koja prilazi `target` vrednosti i akumulira preostalu udaljenost po svakom pomaku.
    - Kategorija: `TARGET`.
    - Izlaz: Akumulirana preostala udaljenost do target-a.

19. **DIK PETLJA**
    - Cilj: Sequence petlja koja prati svako poboljšanje best-so-far blizine prema `target`.
    - Kategorija: `SEQUENCE`.
    - Izlaz: Zbir svih pozitivnih poboljšanja u odnosu na `target`.

20. **SAR PETLJA**
    - Cilj: Range petlja koja sabira potpisano odstupanje svake posećene vrednosti od `target`.
    - Kategorija: `RANGE`.
    - Izlaz: Ukupan signed offset prema `target`.

21. **OKRED PETLJA**
    - Cilj: Range petlja koja bira posećenu vrednost najbližu `target`.
    - Kategorija: `RANGE`.
    - Izlaz: Najbliža posećena vrednost.

22. **DIREKT PETLJA**
    - Cilj: Target petlja koja meri direktno zatvaranje distance prema `target`.
    - Kategorija: `TARGET`.
    - Izlaz: Akumulirano direktno zatvaranje distance.
    - Napomena: Ovo je zaseban PETLJE kontrakt i ne menja standalone `DIREKT` modul.

23. **INDIREKT PETLJA**
    - Cilj: Sequence petlja koja zatvara distancu prema `target` preko waypoint sekvence.
    - Kategorija: `SEQUENCE`.
    - Izlaz: Akumulirano indirektno zatvaranje distance.

24. **SPAJA PETLJA**
    - Cilj: Pivotira između petlji po segmentima (`RANGE`, `TARGET`, `SEQUENCE`) i prenosi međurezultate kroz kontrolisan export/import.
    - Izlaz: Agregirani izlaz svih segmentnih petlji uz audit trag pivot tranzicija.

25. **DURMITOR PETLJA**
    - Cilj: Širenje od vrha ka podnožju kroz slojeve koji rastu po širini i nose u sebi `UMBREL PETLJU`.
    - Izlaz: Zbir svih planinskih slojeva uz dodat ugrađeni izlaz `UMBREL PETLJE`.

26. **DJUPRE PETLJA**
    - Kategorija: `RANGE`.
    - Cilj: Sabiranje kubova svih posećenih vrednosti u opsegu.
    - Izlaz: Zbir `value^3` preko celog opsega.
    - Posebna validacija: Zahteva ispravan smer koraka u odnosu na opseg.

27. **DOMPRE PETLJA**
    - Kategorija: `TARGET`.
    - Cilj: Akumulacija preostale distance do targeta pre svakog pomeraja.
    - Izlaz: Zbir preostalih distanci pre svakog koraka.
    - Posebna validacija: `step` mora pratiti smer ka `target`.

28. **KRUMPE PETLJA**
    - Kategorija: `SEQUENCE`.
    - Cilj: Sabiranje svakog pozitivnog uspona između susednih elemenata.
    - Izlaz: Ukupan zbir pozitivnih razlika `next - previous`.
    - Posebna validacija: Validira svaki element sekvence.

29. **DOMBRE PETLJA**
    - Kategorija: `RANGE`.
    - Cilj: Merenje odstupanja posećenih vrednosti od centralne ose opsega.
    - Izlaz: Zbir `|value - midpoint|` preko opsega.
    - Posebna validacija: Zahteva ispravan smer koraka u odnosu na opseg.

30. **OMBA PETLJA**
    - Kategorija: `TARGET`.
    - Cilj: Brojanje potrebnih pomaka da se dođe do targeta.
    - Izlaz: Broj izvršenih koraka do target završetka.
    - Posebna validacija: `step` mora pratiti smer ka `target`.

31. **DOKSI PETLJA**
    - Kategorija: `SEQUENCE`.
    - Cilj: Praćenje signed pomaka između susednih elemenata.
    - Izlaz: Ukupan signed delta zbir kroz sekvencu.
    - Posebna validacija: Validira svaki element sekvence.

32. **DOMBRA PETLJA**
    - Kategorija: `RANGE`.
    - Cilj: Težinsko sabiranje signed odstupanja od target centra.
    - Izlaz: Zbir `(value - target) * iterationIndex`.
    - Posebna validacija: Zahteva ispravan smer koraka i konačan `target`.

33. **DOKON PETLJA**
    - Kategorija: `TARGET`.
    - Cilj: Sabiranje svih međupozicija posećenih na putu ka targetu.
    - Izlaz: Zbir svih landing vrednosti uključujući završni target.
    - Posebna validacija: `step` mora pratiti smer ka `target`.

34. **DUMPIR PETLJA**
    - Kategorija: `SEQUENCE`.
    - Cilj: Brojanje elemenata sekvence koji ostaju na ili ispod target praga.
    - Izlaz: Broj vrednosti `<= target`.
    - Posebna validacija: Validira svaki element sekvence i konačan `target`.

35. **DOMBAR PETLJA**
    - Kategorija: `RANGE`.
    - Cilj: Brojanje posećenih vrednosti koje dostižu ili prelaze target prag.
    - Izlaz: Broj vrednosti `>= target` u opsegu.
    - Posebna validacija: Zahteva ispravan smer koraka i konačan `target`.

36. **ZUMBA PETLJA**
    - Kategorija: `SEQUENCE`.
    - Cilj: Težinsko sabiranje apsolutnog odstupanja sekvence od targeta.
    - Izlaz: Zbir `|value - target| * iterationIndex`.
    - Posebna validacija: Validira svaki element sekvence i konačan `target`.

37. **DONKI PETLJA**
    - Kategorija: `TARGET`.
    - Cilj: Težinsko praćenje svakog pređenog koraka ka targetu.
    - Izlaz: Zbir `travelDistance * iterationIndex` za svaki pomak.
    - Posebna validacija: `step` mora pratiti smer ka `target`.

38. **DOMPOR PETLJA**
    - Kategorija: `RANGE`.
    - Cilj: Sabiranje razlike između maksimuma opsega i svake posećene vrednosti.
    - Izlaz: Ukupan gap prema najvećoj posećenoj vrednosti.
    - Posebna validacija: Zahteva ispravan smer koraka u odnosu na opseg.

## Jedinstven API / kontrakt

Sve petlje koriste isti ulazni i izlazni oblik:

- `PetljaInput`
  - `start`, `end`, `step`, `target`, `sequence`
  - `maxIterations`, `maxDurationMs`
  - `status` (`MONSTER | DISABLED | ACTIVATED | DEAD` + alias-i)
  - `spajaSegments` (`segment`, `loops`, `importFromPrevious`)
  - `spajaTransferPolicy` (`strict | fallback`)
  - `spajaExportFields` (`output | iterations | warnings-count`)
  - `spajaImportTarget` (`target | start | end | sequence`)

- `PetljaResult`
  - `kind`, `goal`, `input`
  - `status`, `statusTrail`
  - `output`, `iterations`, `completed`, `reason`
  - `warnings`, `durationMs`, `trace`

Kontrakt verzija: `1.0.0`

## Pravila izvršavanja i završetka

- Validacija ulaza je obavezna pre izvršavanja.
- `NaN` i `Infinity` nisu dozvoljeni.
- Svaka petlja ima zaštitu od beskonačnog izvršavanja:
  - `maxIterations`
  - `maxDurationMs`
- Range-orijentisane petlje (`FOR`, `NIK`, `DOR`, `DAR`, `GAR`, `UK`, `ZUM`, `DJUPRE`, `DOMBRE`, `DOMBRA`, `DOMBAR`, `DOMPOR`, `SAR`, `OKRED`) zahtevaju smislen smer koraka u odnosu na opseg, a target-range varijante dodatno validiraju `target`.
- Sequence-orijentisane petlje (`UR`, `EXE`, `YU`, `ZAR`, `DER`, `ZUR`, `IZI`, `KRUMPE`, `DOKSI`, `DUMPIR`, `ZUMBA`, `DIK`, `INDIREKT`) validiraju svaki element niza pre izvršavanja.
- Target-orijentisane petlje (`ITCH`, `KUR`, `DOMPRE`, `OMBA`, `DOKON`, `DONKI`, `DOK`, `DIREKT`) koriste `target` kao deo glavne izvršne logike.
- `UMBREL PETLJA` nasleđuje validaciona pravila svih delegiranih petlji; nevalidan `start/end/step`, `sequence` ili `target` u bilo kom child scenariju može učiniti agregirani rezultat `DISABLED` ili `DEAD`.
- `DURMITOR PETLJA` validira opseg kao range-orijentisana petlja, koristi `sequence` kao pejzažni sloj i nasleđuje finalni status od ugrađene `UMBREL PETLJE` kada njen interni agregat nije uspešan.
- `SPAJA PETLJA` validira segmentnu konfiguraciju pre izvršavanja:
  - Segmenti podržavaju samo petlje svoje kategorije (`RANGE`, `TARGET`, `SEQUENCE`).
  - `importFromPrevious` se primenjuje jednom na početku segmenta (ne pre svake petlje unutar istog segmenta).
  - Export/import prenosi samo eksplicitno dozvoljena polja (`output`, `iterations`, `warnings-count`).
  - `strict` prekida pivot kada child petlja ne završi uspešno ili kada export paket nije validan; `fallback` beleži upozorenje i nastavlja.
- `reason` može biti:
  - `completed`
  - `max-iterations`
  - `time-limit`
  - `invalid-input`
  - `blocked-status`

## Status tranzicije

- Dozvoljen ulaz za izvršavanje je samo `ACTIVATED`; ostali statusi vraćaju `blocked-status`.
- `MONSTER` → `MONSTER` (blokiran ulaz sa MONSTER statusom)
- `DISABLED` → `DISABLED` (blokiran ulaz sa DISABLED statusom)
- `DEAD` → `DEAD` (blokiran ulaz sa DEAD statusom)
- `ACTIVATED` → `MONSTER` (početak izvršavanja)
- `MONSTER` → `ACTIVATED` (uspešan završetak)
- `MONSTER` → `DISABLED` (umbrella agregacija kada je barem jedna child petlja `DISABLED`)
- `ACTIVATED|MONSTER` → `DEAD` (guard stop: `max-iterations` ili `time-limit`, ili nedozvoljena tranzicija)
- `ACTIVATED` → `DISABLED` (invalid input)
- `DISABLED` i `DEAD` blokiraju izvršavanje petlje na ulazu

`statusTrail` je audit trag svih tranzicija sa:
- `from`, `to`
- `reason`
- `iteration`

## Očekivani rezultati

- Normalni ulazi završavaju sa `completed=true`.
- Nevalidni ulazi završavaju sa `reason=invalid-input`.
- Rizične konfiguracije se bezbedno zaustavljaju kroz `max-iterations` ili `time-limit` bez rušenja procesa.

## Kratak tok (primer)

1. Priprema `PetljaInput`.
2. Poziv jedne od petlji (`runForPetlja`, `runItchPetlja`, `runUrPelja`, `runNikPetlja`, `runDorPetlja`, `runExePetlja`, `runKurPetlja`, `runDarPetlja`, `runYuPetlja`, `runZarPetlja`, `runDerPetlja`, `runGarPetlja`, `runZurPetlja`, `runIziPetlja`, `runUkPetlja`, `runZumPetlja`, `runDokPetlja`, `runDikPetlja`, `runSarPetlja`, `runOkredPetlja`, `runDirektPetlja`, `runIndirektPetlja`, `runSpajaPetlja`, `runDurmitorPetlja`, `runUmbrelPetlja`).
3. Obrada standardizovanog `PetljaResult`.
4. Audit kroz `trace`, `warnings`, `reason` i `durationMs`.
