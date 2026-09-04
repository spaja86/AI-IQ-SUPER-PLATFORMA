# MRKLI MRAK

MRKLI MRAK je deterministički modul za procenu operativne spremnosti u uslovima niske vidljivosti.

## Scope i contract (v1)

- **Purpose**: standardizovana procena rizika i stabilnosti u “darkness-navigation” sesijama.
- **Input**:
  - `mode`: `EXPLORATION | STEALTH | RECOVERY`
  - `riskTolerance`: `LOW | MEDIUM | HIGH`
  - `ambientLightLux`: `0..500`
  - `focusLevel`: `0..100`
  - `sleepHours`: `0..24`
  - `sessionMinutes`: `1..300`
  - `supportTools?`: `FLASHLIGHT | NIGHT_VISION | AUDIO_CUES | MAP`
- **Output**:
  - `darknessScore`, `clarityScore`, `stabilityScore`, `confidenceScore` (`0..100`)
  - `status`: `CLEAR | CAUTION | DENSE | BLACKOUT`
  - `recommendedToolset`, `warnings`, `valid`, `durationMs`, `disclaimer`

## Očekivano ponašanje

- Nevalidni ulazi (`NaN`, `Infinity`, pogrešni tipovi, vrednosti van opsega) vraćaju `valid: false`.
- API sloj vraća:
  - `400` za payload shape/JSON greške.
  - `422` za domen-validaciju koja nije prošla (`valid: false`).
  - `200` za validne evaluacije.

## Performance i security constraints

- Cilj evaluacije: `<= 50ms` prosečno.
- API odgovor: `<= 200ms`.
- Modul ne koristi spoljne pozive, ne procesuira sekrete i ne sme logovati osetljive podatke.
