# AGENT-KPI-REGISTRY — AI-IQ-SUPER-PLATFORMA

Centralni registar KPI-ja za sve agente platforme. Svaki agent mora ispuniti ove KPI-je.

## KPI Definicije

| KPI | Opis | Merenje |
|---|---|---|
| `evaluationMaxMs` | Maksimalno vreme evaluacije engine logike | Jest timer u testovima |
| `apiResponseMaxMs` | Maksimalno vreme API odgovora | Network timing |
| `buildMaxMs` | Maksimalno vreme build-a (gde je relevantno) | CI timing |

## Agent KPI Registry

| Agent | `evaluationMaxMs` | `apiResponseMaxMs` | `buildMaxMs` | Octave | Node | Status |
|---|---|---|---|---|---|---|
| GIGATRON | 50ms | 200ms | — | — | — | 🚀 Active |
| DECIBIL | 50ms | 200ms | — | — | — | 🚀 Active |
| Discount Telecom | 50ms | 200ms | — | 8 | 64 | 🚀 Active |
| Great Sumbion | 50ms | 200ms | — | 9 | 72 | 🚀 Active |
| Madagaskar v1 | 50ms | 200ms | — | 5 | 40 | 🚀 Active |
| Madagaskar v2 | 50ms | 200ms | — | 5 | 40 | 🚀 Active |
| EXTRIMLI | 50ms | 200ms | — | 7 | 56 | 🚀 Active |
| EXTRIMLI CUZ | 50ms | 200ms | — | 7 | 57 | 🚀 Active |
| Digit Engine | **10ms** | 200ms | — | 10 | 80 | 🚀 Active |
| MAKSIMUS | 50ms | 200ms | 3 min | 13 | 128 | 🚀 Active |
| ANOTHER MAKS | 50ms | 200ms | 3 min | — | — | 🚀 Active |
| THEM (Tarken+Hingil+Ekolan) | 50ms | 200ms | 3 min | 16 | 256 | 🚀 Active |
| Nova Generacija | 50ms | 200ms | — | — | — | 🚀 Active |
| FORCE | 50ms | 200ms | — | — | — | 🚀 Active |
| Persona Bank | **10ms (lookup)** | **50ms (bulk)** | — | — | — | 🚀 Active |

## Nova Generacija Gaming KPI

| KPI | Vrednost |
|---|---|
| Session completion rate | ≥ 95% |
| Fairness compliance | 100% |
| Server-side evaluacija | ≤ 50ms |
| Kvantna kompenzacija latencije | ≤ 100ms |
| Broj igrača | 2–16 |

## SpajaPro 16 Hipermreza KPI

| KPI | Vrednost |
|---|---|
| Konvergencija (THEM) | ≥ 0.95 (95%) |
| Handoff latency | ≤ 100ms |
| Ukupno čvorova | 256 (16×16) |
| Aktivnih oktava | ≥ 12 od 16 = "healthy" |

## Persona Bank Coverage KPI

| KPI | Healthy | Degraded | Unavailable |
|---|---|---|---|
| Aktiven oktava pokrivenost | ≥ 12/16 | 6–11/16 | < 6/16 |
| Stale persona threshold | 30 dana | — | — |

## CI Quality Gates

Svaki agent workflow mora proći:
1. `lint` — ESLint TypeScript
2. `test` — Jest unit testovi sa KPI verifikacijom
3. `build` — Next.js build (za release)
4. `security` — npm audit + secret scanning

## Napomene

- Digit Engine ima strožiji KPI za lookup (10ms) zbog simboličkog registra
- Persona Bank bulk list mora biti ≤ 50ms
- THEM (octave 16, node 256) je apex agent — najstroži SLA-ovi
- Svaki agent mora imati bar jedan test koji verifikuje performance KPI

Za dodavanje novog agenta: videti `docs/HOW-TO-ADD-AGENT.md`
