# MADAGASKAR 2 — Exotic Market Intelligence v2

## Overview

MADAGASKAR 2 extends the v1 exotic market intelligence engine with four major capabilities:

| Feature | Description |
|---|---|
| **Multi-currency FX Engine** | Convert procurement prices between 11+ currency pairs; inverse lookup; seed rates |
| **Auction / Bidding Mechanics** | In-memory auction lots for rare goods; bid validation, reserve enforcement, lot lifecycle |
| **Supply-Chain Traceability** | Chain-of-custody records per good; certifications, harvest provenance, step validation |
| **Basket Procurement** | Multi-item pricing with automatic basket discount tiers and FX aggregation |

## Module paths

| Surface | Path |
|---|---|
| Library | `src/lib/madagaskar-2/` |
| API routes | `src/app/api/madagaskar-2/` |
| Tests | `src/tests/lib/madagaskar2-*.test.ts` |

## Library modules

| Module | File | Responsibility |
|---|---|---|
| Types | `types.ts` | All v2 types, constants, re-exports from v1 |
| FX Engine | `fx.ts` | FX rate registry, conversion, inverse lookup |
| Auction Engine | `auction.ts` | Lot registry, bid placement, lifecycle |
| Traceability | `traceability.ts` | Chain-of-custody registry, CRUD, validation |
| Basket | `basket.ts` | Multi-item procurement, discount tiers, FX aggregation |
| Engine v2 | `engine.ts` | `calculateProcurementV2`, `getMadagaskar2HealthReport` |
| Registry v2 | `registry.ts` | Extended catalog (v1 + v2 goods), CRUD helpers |
| Index | `index.ts` | Public API surface |

## API routes

| Method | Route | Description |
|---|---|---|
| GET | `/api/madagaskar-2/catalog` | List goods; query params: `category`, `region`, `rarity_min` |
| POST | `/api/madagaskar-2/procure` | Single-good procurement; body: `ProcurementRequest + targetCurrency?` |
| POST | `/api/madagaskar-2/basket` | Basket procurement; body: `{ items: BasketItem[], outputCurrency? }` |
| GET | `/api/madagaskar-2/auction` | List auction lots; query param: `status` |
| POST | `/api/madagaskar-2/auction/bid` | Place a bid; body: `BidRequest` |
| GET | `/api/madagaskar-2/traceability/[goodId]` | Get traceability record for a good |
| GET | `/api/madagaskar-2/health` | v2 health report |

All routes respond with headers:
- `X-Madagaskar2-Contract-Version: v2`
- `X-Madagaskar2-Module-Version: 2.0.0`

## New catalog entries (v2)

### New categories
- `fungal` — medicinal mushrooms, mycelium extracts
- `crystal` — gem-grade crystals, mineral formations
- `algae` — spirulina, chlorella, marine algae

### New regions
- `Central-Africa` — Congo malachite, Cameroon copal, Chad moringa
- `Himalaya` — Kashmiri saffron, Tibetan cordyceps, Himalayan shilajit
- `Arctic` — Arctic spirulina, Norwegian chlorella, Svalbard sea crystal salt, Siberian chaga

## FX Engine

- 11 seed rate pairs: EUR, USD, NZD, AUD, GBP, CHF, JPY
- Direct + inverse lookup
- `convertCents(cents, from, to)` — safe: returns 0 for NaN/negative/unknown pair
- `upsertFxRate(rate)` — injectable for tests or live updates

## Auction Mechanics

Rules for `placeBid`:
1. Lot must exist and be `open`
2. Currency must match lot's currency
3. `bidAmountCents` must be a positive finite number
4. First bid: must be ≥ `reservePriceCents`
5. Subsequent bids: must be strictly > `currentBidCents`

## Basket Discount Tiers

| Item Count | Discount |
|---|---|
| ≤ 5 | 0% |
| 6–10 | 2% |
| ≥ 11 | 5% |

Constants: `MADAGASKAR2_BASKET_DISCOUNT_TIER1_ITEMS`, `MADAGASKAR2_BASKET_DISCOUNT_TIER1_PERCENT`, `MADAGASKAR2_BASKET_DISCOUNT_TIER2_ITEMS`, `MADAGASKAR2_BASKET_DISCOUNT_TIER2_PERCENT`

## KPI Contract

| KPI | Target |
|---|---|
| Engine evaluation | ≤ 50ms |
| API response | ≤ 200ms |
| NaN / Infinity / negative price leakage | 0 |

## Backward compatibility

- All v1 API routes (`/api/madagaskar/*`) remain unchanged
- `calculateProcurement` from v1 re-exported by `@/lib/madagaskar-2`
- v2 registry (`SEED_GOODS_V2`) = v1 goods + v2 new goods

## Contract version

| Field | Value |
|---|---|
| `MADAGASKAR2_CONTRACT_VERSION` | `v2` |
| `MADAGASKAR2_MODULE_VERSION` | `2.0.0` |
| `MADAGASKAR2_PERSONA_ID` | `madagaskar-exotic-market` |
| Agent trigger labels | `madagaskar:logic-change`, `madagaskar-2:logic-change` |
| Octave | 5 |
| Hipermreza node | 40 |

## Audit reference

```
AI-IQ-SUPER-PLATFORMA#MADAGASKAR-2-001 -> IO-OPENUI-AO#<follow-up issue>
```
