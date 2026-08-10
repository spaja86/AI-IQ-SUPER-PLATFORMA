# PETLJE — Unified Loop Contract

Ovaj dokument definiše značenje, cilj i zajednički API za:
- `FOR PETLJA`
- `ITCH PETLJA`
- `UR PELJA`
- `NIK PETLJA`
- `UMBREL PETLJA`

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
   - Cilj: Orkestracija sve 4 osnovne petlje kroz jedinstveni rezultat i jedinstven audit trag.
   - Izlaz: Agregiran izlaz svih petlji.

## Jedinstven API / kontrakt

Sve petlje koriste isti ulazni i izlazni oblik:

- `PetljaInput`
  - `start`, `end`, `step`, `target`, `sequence`
  - `maxIterations`, `maxDurationMs`

- `PetljaResult`
  - `kind`, `goal`, `input`
  - `output`, `iterations`, `completed`, `reason`
  - `warnings`, `durationMs`, `trace`

Kontrakt verzija: `1.0.0`

## Pravila izvršavanja i završetka

- Validacija ulaza je obavezna pre izvršavanja.
- `NaN` i `Infinity` nisu dozvoljeni.
- Svaka petlja ima zaštitu od beskonačnog izvršavanja:
  - `maxIterations`
  - `maxDurationMs`
- `reason` može biti:
  - `completed`
  - `max-iterations`
  - `time-limit`
  - `invalid-input`

## Očekivani rezultati

- Normalni ulazi završavaju sa `completed=true`.
- Nevalidni ulazi završavaju sa `reason=invalid-input`.
- Rizične konfiguracije se bezbedno zaustavljaju kroz `max-iterations` ili `time-limit` bez rušenja procesa.

## Kratak tok (primer)

1. Priprema `PetljaInput`.
2. Poziv jedne od petlji (`runForPetlja`, `runItchPetlja`, `runUrPelja`, `runNikPetlja`, `runUmbrelPetlja`).
3. Obrada standardizovanog `PetljaResult`.
4. Audit kroz `trace`, `warnings`, `reason` i `durationMs`.
