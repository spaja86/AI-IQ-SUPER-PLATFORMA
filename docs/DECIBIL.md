# DECIBIL — Audio/Signal Measurement Module

> SpajaUltraOmegaCore -∞Ω+∞ | Kompanija SPAJA — Digitalna Industrija

## Pregled / Overview

**DECIBIL** je modul za merenje i analizu audio/signal nivoa u dBFS (Decibels Full Scale) format.
Integrisan je u AI-IQ-SUPER-PLATFORMA kao deo gaming fairness i analytics infrastrukture.

---

## Arhitektura

```
src/lib/decibil/
  types.ts       — TypeScript interfejsi i konstante
  utils.ts       — RMS, peak, dBFS konverzije, validacija
  core.ts        — Glavni motor merenja, history store, health report
  index.ts       — Javni API (re-export)

src/app/api/decibil/
  measure/route.ts   — GET/POST /api/decibil/measure
  analyze/route.ts   — POST /api/decibil/analyze
  history/route.ts   — GET /api/decibil/history

src/components/decibil/
  DecibelMeter.tsx    — Real-time VU meter komponent
  DecibelHistory.tsx  — Grafikon istorije merenja
  DecibelAlerts.tsx   — Prikaz warning/clipping alerta
```

---

## API Endpoints

### GET /api/decibil/measure
Vraća trenutno sintetičko merenje (placeholder za server-side).

**Response:**
```json
{
  "data": {
    "dbfs": -60,
    "rms": 0,
    "peak": 0,
    "status": "silence",
    "timestamp": "2026-08-05T18:00:00.000Z",
    "sourceId": "decibil-...",
    "source": "synthetic",
    "windowMs": 0
  }
}
```

### POST /api/decibil/measure
Prima JSON sa audio uzorcima i vraća analizu.

**Body:**
```json
{
  "samples": [0.1, -0.1, 0.2, -0.3],
  "sampleRate": 44100,
  "source": "microphone",
  "sourceId": "mic-001"
}
```

### POST /api/decibil/analyze
Detaljna analiza sa svim metrikama.

**Body:** isti format kao `/api/decibil/measure`

**Response:**
```json
{
  "data": {
    "measurement": { "dbfs": -18.5, "status": "normal", ... },
    "average": -20.1,
    "peakHold": -12.3,
    "thresholds": { "silenceDbfs": -60, "warningDbfs": -12, "clippingDbfs": -3 },
    "valid": true,
    "warnings": [],
    "durationMs": 2
  }
}
```

### GET /api/decibil/history?limit=20
Vraća time-series istoriju i health report.

---

## Status definicije

| Status     | dBFS opseg       | Boja   |
|------------|------------------|--------|
| `silence`  | ≤ -60 dBFS       | gray   |
| `normal`   | -60 do -12 dBFS  | green  |
| `warning`  | -12 do -3 dBFS   | yellow |
| `clipping` | > -3 dBFS        | red    |

---

## Performance KPI

- Analiza evaluacija: ≤ 50ms (per Nova Generacija standard)
- API response: ≤ 200ms
- History store: max 1000 merenja (in-memory per instance)

---

## Agent Integration

- **decibil-validator-agent** — CI validacija logike (videti AGENTS.md)
- **nova-generacija-agent** — Audio fairness provere u gaming kontekstu
- **analytics-bot** — Tracking decibel metrika i reporting

---

## Contract Version

`DECIBIL_CONTRACT_VERSION = 'v1'`  
`DECIBIL_MODULE_VERSION = '1.0.0'`

---

## Linked Repos

- Nema downstream promena u `spaja86/IO-OPENUI-AO` za inicijalnu verziju.
- Buduće sinhronizacije: via `multi-repo-sync-agent`.
