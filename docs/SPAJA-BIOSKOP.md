# SPAJA BIOSKOP

Kanonski BIOSKOP signal/sekvenca:

`KAGON ERAGON SIROKE DJUKAR EPAR DOPER OKTAN DUKAT`

## Scope

- Library: `src/lib/spaja-bioskop/`
- API:
  - `POST /api/spaja-bioskop/evaluate`
  - `GET /api/spaja-bioskop/health`

## Contract

- `SPAJA_BIOSKOP_CONTRACT_VERSION = v1-spaja-bioskop`
- `SPAJA_BIOSKOP_MODULE_VERSION = 1.0.0`
- `strictOrder` default: `true`
- Status model:
  - `NORMAL` → `go`
  - `WARNING` → `no-go`
  - `BLOCKED` → `no-go`

## Validation Rules

- Tačno 8 tokena.
- Nepoznati tokeni nisu dozvoljeni.
- Duplikati nisu dozvoljeni.
- Kod `strictOrder=true` redosled mora biti potpuno jednak kanonskoj sekvenci.
- Na `signalStrength` (`0-100`) se primenjuje clamp; `NaN/Infinity` prelazi na fallback.

## Readiness & Governance

- Readiness score: pokrivenost tokena + tačnost redosleda + signal strength.
- Obavezno:
  - audit log
  - human review
  - security scan
  - performance KPI provera
  - deploy gate
- Security boundary: bez sekreta u Git-u.

## Visual Reference

- Referentna slika: `https://github.com/user-attachments/assets/1ba7c168-66d8-4aaf-ad2f-ecb779a20409`

## Linked-repo impact

- Trenutno `none` (repo-local surface).
