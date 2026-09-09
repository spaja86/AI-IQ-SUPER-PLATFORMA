# SPAJA Render Medija — Nikola Spajić formule

## Svrha

Ovaj dokument definiše “Nikola Spajić formule” za modul **SPAJA Render za Slike i Video** i njihov ugovor sa ChatGPT slojem.

## Specifikacija formula

- **Modul**: `src/lib/spaja-render-medija.ts`
- **Verzija formule**: `1.0.0`
- **Autor**: Nikola Spajić
- **Kategorije**: `slika`, `video`

### Ulazi

- `kvalitetIzvora` (0–100)
- `kompleksnostScene` (0–100)
- `dinamikaPokreta` (0–100)
- `aiPouzdanost` (0–100)
- `vremenskiBudzetMs` (1000–180000)

### Izlazi

- `score` (0–100)
- `status` (`optimalno`, `stabilno`, `oprez`, `kriticno`)
- `preporuka`
- `objasnjenje`
- `warnings`
- `fallbackUsed`

### Težine po kategoriji

- **slika**: kvalitet 0.35, kompleksnost 0.25, dinamika 0.05, AI 0.25, vreme 0.10
- **video**: kvalitet 0.25, kompleksnost 0.20, dinamika 0.30, AI 0.15, vreme 0.10

### Status pragovi

- `>=85` → `optimalno`
- `>=70` → `stabilno`
- `>=50` → `oprez`
- `<50` → `kriticno`

## ChatGPT integracioni ugovor

ChatGPT je potvrđen kao sloj za **predlog parametara**, ne za runtime evaluaciju score-a.

- **Mode**: `predlog-parametara`
- **Runtime evaluacija**: `false` (uvek lokalno i deterministic)
- **Validacija**:
  - payload mora biti objekat
  - najmanje jedan numerički parametar mora biti konačan broj
  - svi parametri se clamp-uju na dozvoljene granice
- **Fallback**:
  - ako payload nije validan ili nedostupan, koristi se default po kategoriji
  - fallback se beleži kroz `warnings` i `fallbackUsed=true`

## API proširenja

Rute sada vraćaju:

- `nikolaSpajicFormule`
- `formulaStatusPoKategoriji` (slika/video score, status, preporuka, objašnjenje)
- `chatGptIntegracija` (mode, runtime, validacija/fallback gde je relevantno)

Rute:

- `src/app/api/spaja-render-medija/route.ts`
- `src/app/api/spaja-render-medija-status/route.ts`
- `src/app/api/spaja-render-medija-engini/route.ts`
- `src/app/api/spaja-render-medija-pipeline/route.ts`
- `src/app/api/spaja-render-medija-pregled/route.ts`

## Governance i audit očekivanja

- Human review ostaje obavezan za merge.
- Security i secret boundary pravila ostaju nepromenjena.
- Formula sloj ne uvodi external runtime dependency; time se čuva stabilnost quality gate tokova.
- Audit-ready izlaz je dostupan kroz route response polja i test pokrivenost.
