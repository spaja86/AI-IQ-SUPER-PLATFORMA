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

18. **DURMITOR PETLJA**
    - Cilj: Širenje od vrha ka podnožju kroz slojeve koji rastu po širini i nose u sebi `UMBREL PETLJU`.
    - Izlaz: Zbir svih planinskih slojeva uz dodat ugrađeni izlaz `UMBREL PETLJE`.

## Jedinstven API / kontrakt

Sve petlje koriste isti ulazni i izlazni oblik:

- `PetljaInput`
  - `start`, `end`, `step`, `target`, `sequence`
  - `maxIterations`, `maxDurationMs`
  - `status` (`MONSTER | DISABLED | ACTIVATED | DEAD` + alias-i)

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
- Range-orijentisane petlje (`FOR`, `NIK`, `DOR`, `DAR`, `GAR`, `UK`, `ZUM`) zahtevaju smislen smer koraka u odnosu na opseg, a `ITCH PETLJA` i `KUR PETLJA` dodatno zahtevaju smislen korak u odnosu na `target`.
- Sequence-orijentisane petlje (`UR`, `EXE`, `YU`, `ZAR`, `DER`, `ZUR`, `IZI`) validiraju svaki element niza pre izvršavanja.
- Target-orijentisane petlje (`ITCH`, `KUR`, `DOR`, `YU`, `ZUR`, `IZI`, `UK`) koriste `target` kao deo izvršne logike.
- `UMBREL PETLJA` nasleđuje validaciona pravila svih delegiranih petlji; nevalidan `start/end/step`, `sequence` ili `target` u bilo kom child scenariju može učiniti agregirani rezultat `DISABLED` ili `DEAD`.
- `DURMITOR PETLJA` validira opseg kao range-orijentisana petlja, koristi `sequence` kao pejzažni sloj i nasleđuje finalni status od ugrađene `UMBREL PETLJE` kada njen interni agregat nije uspešan.
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
2. Poziv jedne od petlji (`runForPetlja`, `runItchPetlja`, `runUrPelja`, `runNikPetlja`, `runDorPetlja`, `runExePetlja`, `runKurPetlja`, `runDarPetlja`, `runYuPetlja`, `runZarPetlja`, `runDerPetlja`, `runGarPetlja`, `runZurPetlja`, `runIziPetlja`, `runUkPetlja`, `runZumPetlja`, `runDurmitorPetlja`, `runUmbrelPetlja`).
3. Obrada standardizovanog `PetljaResult`.
4. Audit kroz `trace`, `warnings`, `reason` i `durationMs`.
