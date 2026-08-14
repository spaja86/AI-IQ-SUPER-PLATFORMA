# PLATFORM-OVERVIEW — AI-IQ-SUPER-PLATFORMA

## Pregled / Overview

AI-IQ-SUPER-PLATFORMA je mega-platforma kompanije SPAJA koja objedinjuje više specijalizovanih AI agenata, poslovnih modula i gaming sistema u jedinstven ekosistem.

## Arhitektura

```
src/
├── lib/
│   ├── platform/index.ts      ← Unified Entry Point (lazy-loading)
│   ├── types/platform.types.ts ← Shared contracts (AgentContract, PersonaContract)
│   ├── persona-bank/          ← Centralni registar persona
│   ├── logger.ts              ← Centralni logger
│   ├── api/response.ts        ← Standardni API response helper
│   └── <module>/              ← Svaki agent modul
├── app/
│   └── api/
│       ├── health/            ← Platform health check
│       ├── persona-bank/      ← Persona Bank API
│       │   ├── health/        ← Persona Bank health & coverage
│       │   ├── stats/         ← Persona Bank statistike
│       │   └── [id]/          ← Per-persona CRUD
│       └── <module>/          ← Per-module API endpoints
└── components/
    └── <module>/              ← Per-module UI komponente
```

## Moduli platforme

| Modul | Lib | API | Component | Tests | Octave | Node |
|---|---|---|---|---|---|---|
| GIGATRON | ✅ | ✅ | ✅ | ✅ | — | — |
| DECIBIL | ✅ | ✅ | ✅ | ✅ | — | — |
| Discount Telecom | ✅ | ✅ | ✅ | ✅ | 8 | 64 |
| Great Sumbion | ✅ | ✅ | ✅ | ✅ | 9 | 72 |
| Madagaskar v1+v2 | ✅ | ✅ | ✅ | ✅ | 5 | 40 |
| EXTRIMLI | ✅ | ✅ | ✅ | ✅ | 7 | 56 |
| EXTRIMLI CUZ | ✅ | ✅ | ✅ | ✅ | 7 | 57 |
| Digit Engine | ✅ | ✅ | ✅ | ✅ | 10 | 80 |
| MAKSIMUS | ✅ | ✅ | ✅ | ✅ | 13 | 128 |
| ANOTHER MAKS | ✅ | ✅ | ✅ | ✅ | — | — |
| THEM (Tarken+Hingil+Ekolan) | ✅ | ✅ | ✅ | ✅ | 16 | 256 |
| Nova Generacija | ✅ | ✅ | ✅ | ✅ | — | — |
| FORCE | ✅ | ✅ | ✅ | ✅ | — | — |

## Shared Infrastructure

### Unified Entry Point
`src/lib/platform/index.ts` eksportuje sve module i tipove platforme. Koristi lazy-loading za optimalne performanse pri cold-startu.

### Shared Types
`src/lib/types/platform.types.ts` definiše:
- `AgentContract` — standardni ugovor za sve agente
- `PersonaContract` — standardni ugovor za sve persone
- `PlatformConfig` — konfiguracija platforme
- `PlatformApiResponse<T>` — standardni API response format

### Persona Bank
Centralni registar svih persona platforme. Podržava:
- Registraciju i upsert persona
- Auto-archiving stale persona (> 30 dana)
- Health monitoring sa octave/node coverage
- Audit log za sve promene

### Standardni API Format
Svi API endpoint-i vraćaju:
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": {
    "module": "gigatron",
    "version": "1.0.0",
    "timestamp": "2026-01-01T00:00:00Z",
    "nodeId": 64
  }
}
```

## SpajaPro 16 Hipermreza

```
16 × 16 = 256 čvorova
Oktave: 1–16
Čvorovi: 1–256

Apex: THEM (octave 16, node 256)
```

## Health Endpoints

| Endpoint | Opis |
|---|---|
| `GET /api/health` | Platform liveness/readiness |
| `GET /api/persona-bank/health` | Persona Bank health & coverage |
| `GET /api/persona-bank/stats` | Persona Bank statistike |

## Multi-Repo Koordinacija

Videti: `docs/MULTI-REPO-LINKS.md`

- `spaja86/IO-OPENUI-AO` — Primary linked product repo
- Sync: dependency verzije, labels, milestones, agent-config
- Downstream promene dokumentovati u `docs/MULTI-REPO-LINKS.md`

## Linked Repositories

- 🔗 [AI-IQ-SUPER-PLATFORMA](https://github.com/spaja86/AI-IQ-SUPER-PLATFORMA)
- 🔗 [IO-OPENUI-AO](https://github.com/spaja86/IO-OPENUI-AO)
